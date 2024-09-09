import { injectable } from "tsyringe";
import { Repository } from "typeorm";
import { Program } from "~/models/entities/Program";
import { DatabaseService } from "~/services/DatabaseService";
import { User } from "~/models/entities/User";
import { ProgramReaction, ProgramReactionType } from "~/models/entities/ProgramReaction";
import { IllegalReactionTypeError } from "~/errors/program/IllegalReactionTypeError";
import { ProgramNotFoundError } from "~/errors/program/ProgramNotFoundError";
import { ProgramSnippet, ProgramSnippetType } from "~/models/entities/ProgramSnippet";
import { ProgramSnippetGroup } from "~/models/entities/ProgramSnippetGroup";

export interface ProgramReactionCountView {
  positive: number;
  negative: number;
}

export interface ProgramSnippetPayload {
  type: ProgramSnippetType;
  contentBase64: string;
}

export interface ProgramSnippetGroupPayload {
  children: ProgramSnippetPayload[];
}

@injectable()
export class ProgramService {
  private readonly programRepository: Repository<Program>;
  private readonly userRepository: Repository<User>;
  private readonly programReactionRepository: Repository<ProgramReaction>;

  public constructor(private readonly databaseService: DatabaseService) {
    this.programRepository = databaseService.getRepository(Program);
    this.userRepository = databaseService.getRepository(User);
    this.programReactionRepository = databaseService.getRepository(ProgramReaction);
  }

  public async createProgram(
    userId: string,
    name: string,
    snippetGroups: ProgramSnippetGroupPayload[],
  ): Promise<Program | undefined> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user === null) {
      return undefined;
    }

    const authorEntity = new User();
    authorEntity.id = userId;

    const programEntity = new Program();
    programEntity.name = name;
    programEntity.author = authorEntity;
    programEntity.snippetGroups = snippetGroups.map((group) => {
      const groupEntity = new ProgramSnippetGroup();
      groupEntity.program = programEntity;
      groupEntity.snippets = group.children.map((snippet) => {
        const snippetEntity = new ProgramSnippet();
        snippetEntity.group = groupEntity;
        snippetEntity.type = snippet.type;
        snippetEntity.contentBase64 = snippet.contentBase64;

        return snippetEntity;
      });

      return groupEntity;
    });

    const program = await this.programRepository.save(programEntity);
    return this.getProgram(program.id);
  }

  public async updateProgram(
    programId: string,
    name: string,
    snippetGroups: ProgramSnippetGroupPayload[],
  ): Promise<void> {
    const program = await this.programRepository.findOneBy({
      id: programId,
    });

    if (program === null) {
      throw new ProgramNotFoundError();
    }

    program.name = name;
    program.snippetGroups = snippetGroups.map((group) => {
      const groupEntity = new ProgramSnippetGroup();
      groupEntity.program = program;
      groupEntity.snippets = group.children.map((snippet) => {
        const snippetEntity = new ProgramSnippet();
        snippetEntity.group = groupEntity;
        snippetEntity.type = snippet.type;
        snippetEntity.contentBase64 = snippet.contentBase64;

        return snippetEntity;
      });

      return groupEntity;
    });

    await this.programRepository.save(program);
  }

  public async getAuthor(programId: string): Promise<User | undefined> {
    const program = await this.getProgram(programId);
    if (program === undefined) {
      return undefined;
    }

    return program.author;
  }

  public async getProgram(programId: string): Promise<Program | undefined> {
    try {
      const program = await this.programRepository.findOne({
        where: { id: programId },
        relations: {
          author: true,
          reactions: true,
          snippetGroups: {
            snippets: true,
          },
        },
      });

      if (program === null) {
        return undefined;
      }

      return program;
    } catch (e) {
      return undefined;
    }
  }

  public async getReactionCountView(programId: string): Promise<ProgramReactionCountView> {
    interface RawQueryRow {
      type: ProgramReactionType;
      count: number;
    }

    const groupedReactions = await this.programReactionRepository
      .createQueryBuilder("reaction")
      .select("reaction.type, COUNT(reaction.type) as count")
      .where("reaction.programId = :id", { id: programId })
      .groupBy("type")
      .getRawMany<RawQueryRow>();

    const reactionCountMap = new Map(
      groupedReactions.map((groupedReactionsRow) => (
        [groupedReactionsRow.type, Number(groupedReactionsRow.count)]
      )),
    );

    return {
      positive: reactionCountMap.get(ProgramReactionType.Positive) ?? 0,
      negative: reactionCountMap.get(ProgramReactionType.Negative) ?? 0,
    };
  }

  public async getUserReaction(programId: string, userId: string): Promise<ProgramReactionType | undefined> {
    const program = await this.getProgram(programId);
    if (program === undefined) {
      throw new ProgramNotFoundError();
    }

    return program.reactions.find((entry) => (entry.userId === userId))?.type;
  }

  public async reactOnProgram(
    userId: string,
    programId: string,
    type: ProgramReactionType | undefined,
  ): Promise<void> {
    if (type !== undefined && !Object.values(ProgramReactionType).includes(type)) {
      throw new IllegalReactionTypeError();
    }

    await this.databaseService.connection.transaction(async () => {
      await this.programReactionRepository.delete({
        userId,
        program: { id: programId },
      });

      if (type === undefined) {
        return;
      }

      await this.programReactionRepository.insert({
        userId,
        type,
        program: { id: programId },
      });
    });
  }

  public async getAllPrograms(): Promise<Program[]> {
    return this.programRepository.find();
  }
}
