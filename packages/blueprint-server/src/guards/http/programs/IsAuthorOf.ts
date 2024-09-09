import { StatusCodes } from "http-status-codes";
import type { HttpContract } from "@blueprint/contracts";
import type { HttpContext } from "~/models/http/HttpContext";
import type { HttpGuard } from "~/guards/HttpGuard";
import type { AccessToken } from "~/models/auth/AccessToken";
import type { ProgramService } from "~/services/ProgramService";
import { HttpError } from "~/errors/auth/HttpError";
import { Logger } from "~/logging/Logger";

export class IsAuthorOf<TContract extends HttpContract<any, any>> implements HttpGuard<TContract> {
  private readonly logger = Logger.for(IsAuthorOf.name);

  public constructor(
    private readonly getProgramId: (ctx: HttpContext<TContract>) => string,
    private readonly programService: ProgramService,
  ) {}

  public async challenge(ctx: HttpContext<TContract>): Promise<void> {
    const accessToken = await ctx.getBearerTokenOrThrow() as AccessToken;

    const user = await this.programService.getAuthor(this.getProgramId(ctx));
    if (user === undefined) {
      this.logger.info("Author not found for the program.");
      throw new HttpError(StatusCodes.NOT_FOUND);
    }

    if (user.id !== accessToken.payload.userId) {
      this.logger.info("An attempt to access a protected program resource by a non-author user.");
      throw new HttpError(StatusCodes.FORBIDDEN);
    }
  }
}
