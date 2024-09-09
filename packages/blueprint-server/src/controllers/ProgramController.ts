import { injectable } from "tsyringe";
import { StatusCodes } from "http-status-codes";
import { HttpContracts } from "@blueprint/contracts";
import { tryCatch } from "@blueprint/common";
import { match } from "ts-pattern";
import type { AccessToken } from "~/models/auth/AccessToken";
import { ProgramService, ProgramSnippetGroupPayload, ProgramSnippetPayload } from "~/services/ProgramService";
import { HttpContext } from "~/models/http/HttpContext";
import { HttpContract } from "~/decorators/http/HttpContract";
import { HttpError } from "~/errors/auth/HttpError";
import { UserService } from "~/services/UserService";
import { ProgramNotFoundError } from "~/errors/program/ProgramNotFoundError";
import { ProgramReactionType } from "~/models/entities/ProgramReaction";
import { IllegalReactionTypeError } from "~/errors/program/IllegalReactionTypeError";
import { ProgramSnippet, ProgramSnippetType } from "~/models/entities/ProgramSnippet";
import { ProgramSnippetGroup } from "~/models/entities/ProgramSnippetGroup";

@injectable()
export class ProgramController {
  private static mapProgramReactionType(
    programReactionType: ProgramReactionType | undefined,
  ): HttpContracts.ProgramReaction {
    return match(programReactionType)
      .with(ProgramReactionType.Positive, () => HttpContracts.ProgramReaction.Positive)
      .with(ProgramReactionType.Negative, () => HttpContracts.ProgramReaction.Negative)
      .with(undefined, () => HttpContracts.ProgramReaction.None)
      .exhaustive();
  }

  private static mapProgramSnippetGroup(
    programSnippetGroup: ProgramSnippetGroup,
  ): HttpContracts.ProgramSnippetGroup {
    return {
      children: programSnippetGroup.snippets.map(ProgramController.mapProgramSnippet),
    };
  }

  private static mapProgramSnippet(
    programSnippet: ProgramSnippet,
  ): HttpContracts.ProgramSnippet {
    return {
      type: match(programSnippet.type)
        .with(ProgramSnippetType.Source, () => HttpContracts.ProgramSnippetType.Source)
        .with(ProgramSnippetType.Visualizer, () => HttpContracts.ProgramSnippetType.Visualizer)
        .with(ProgramSnippetType.Markdown, () => HttpContracts.ProgramSnippetType.Markdown)
        .exhaustive(),
      codeBase64: programSnippet.contentBase64,
    };
  }

  private static mapContractProgramReaction(
    programReaction: HttpContracts.ProgramReaction,
  ): ProgramReactionType | undefined {
    return match(programReaction)
      .with(HttpContracts.ProgramReaction.Positive, () => ProgramReactionType.Positive)
      .with(HttpContracts.ProgramReaction.Negative, () => ProgramReactionType.Negative)
      .with(HttpContracts.ProgramReaction.None, () => undefined)
      .exhaustive();
  }

  private static mapContractProgramSnippetGroup(
    programSnippetGroup: HttpContracts.ProgramSnippetGroup,
  ): ProgramSnippetGroupPayload {
    return {
      children: programSnippetGroup.children.map(ProgramController.mapContractProgramSnippet),
    };
  }

  private static mapContractProgramSnippet(
    programSnippet: HttpContracts.ProgramSnippet,
  ): ProgramSnippetPayload {
    return {
      type: match(programSnippet.type)
        .with(HttpContracts.ProgramSnippetType.Source, () => ProgramSnippetType.Source)
        .with(HttpContracts.ProgramSnippetType.Visualizer, () => ProgramSnippetType.Visualizer)
        .with(HttpContracts.ProgramSnippetType.Markdown, () => ProgramSnippetType.Markdown)
        .exhaustive(),
      contentBase64: programSnippet.codeBase64,
    };
  }

  public constructor(
    private readonly programService: ProgramService,
    private readonly userService: UserService,
  ) {}

  @HttpContract(HttpContracts.createProgramContract)
  public async createProgram(ctx: HttpContext<typeof HttpContracts.createProgramContract>): Promise<void> {
    const accessToken = await ctx.getBearerTokenOrThrow() as AccessToken;
    const program = await this.programService.createProgram(
      accessToken.payload.userId,
      ctx.req.payload.name,
      ctx.req.payload.snippetGroups.map((group) => ProgramController.mapContractProgramSnippetGroup(group)),
    );

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (program === undefined) {
      return ctx.res.send(StatusCodes.BAD_REQUEST, undefined);
    }

    ctx.res.send(
      StatusCodes.CREATED,
      new HttpContracts.CreateProgramCreatedResponse(program.id),
    );
  }

  @HttpContract(HttpContracts.updateProgramContract, (when) => when.isAuthorOf((ctx) => ctx.req.payload.programId))
  public async updateProgram(ctx: HttpContext<typeof HttpContracts.updateProgramContract>): Promise<void> {
    await this.programService.updateProgram(
      ctx.req.payload.programId,
      ctx.req.payload.name,
      ctx.req.payload.snippetGroups.map((group) => ProgramController.mapContractProgramSnippetGroup(group)),
    );

    ctx.res.send(StatusCodes.OK, undefined);
  }

  @HttpContract(HttpContracts.getProgramContract)
  public async getProgram(ctx: HttpContext<typeof HttpContracts.getProgramContract>): Promise<void> {
    const program = await this.programService.getProgram(ctx.req.payload.programId.trim());

    if (program === undefined) {
      throw new HttpError(StatusCodes.NOT_FOUND);
    }

    const userReaction = await tryCatch(
      async () => {
        const token = await ctx.getBearerTokenOrThrow() as AccessToken;
        return this.programService.getUserReaction(program.id, token.payload.userId);
      },
      () => undefined,
    );

    const reactions = await this.programService.getReactionCountView(program.id);

    ctx.res.send(
      StatusCodes.OK,
      new HttpContracts.GetProgramOkResponse(
        {
          name: program.name,
          authorId: program.author.id,
          authorName: program.author.name,
          snippetGroups: program.snippetGroups.map((group) => ProgramController.mapProgramSnippetGroup(group)),
        },
        reactions.positive,
        reactions.negative,
        ProgramController.mapProgramReactionType(userReaction),
      ),
    );
  }

  @HttpContract(HttpContracts.reactOnProgramContract)
  public async reactOnProgram(ctx: HttpContext<typeof HttpContracts.reactOnProgramContract>): Promise<void> {
    try {
      const accessToken = await ctx.getBearerTokenOrThrow() as AccessToken;
      const user = await this.userService.getUser(accessToken.payload.userId);

      await this.programService.reactOnProgram(
        user.id,
        ctx.req.payload.programId,
        ProgramController.mapContractProgramReaction(ctx.req.payload.reaction),
      );

      const userReaction = await this.programService.getUserReaction(
        ctx.req.payload.programId,
        accessToken.payload.userId,
      );

      const reactions = await this.programService.getReactionCountView(ctx.req.payload.programId);

      return ctx.res.send(
        StatusCodes.OK,
        new HttpContracts.ReactOnProgramOkResponse(
          reactions.positive,
          reactions.negative,
          ProgramController.mapProgramReactionType(userReaction),
        ),
      );
    } catch (e) {
      if (e instanceof IllegalReactionTypeError) {
        throw new HttpError(StatusCodes.BAD_REQUEST);
      }

      if (e instanceof ProgramNotFoundError) {
        throw new HttpError(StatusCodes.NOT_FOUND);
      }

      throw e;
    }
  }

  @HttpContract(HttpContracts.getAllProgramsContract)
  public async getAllPrograms(ctx: HttpContext<typeof HttpContracts.getAllProgramsContract>): Promise<void> {
    const programs = await this.programService.getAllPrograms();

    ctx.res.send(
      StatusCodes.OK,
      new HttpContracts.GetAllProgramsOkResponse(
        programs.map((program) => new HttpContracts.ProgramEntry(
          program.id,
          program.name,
        )),
      ),
    );
  }
}
