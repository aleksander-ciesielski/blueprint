import { AuthProtection, Credentials } from "@blueprint/contracts";
import { match } from "ts-pattern";
import { injectable } from "tsyringe";
import { StatusCodes } from "http-status-codes";
import type { HttpContract } from "@blueprint/contracts";
import type { HttpHandler } from "~/handlers/HttpHandler";
import type { HttpContext } from "~/models/http/HttpContext";
import { AccessTokenService } from "~/services/auth/AccessTokenService";
import { HttpError } from "~/errors/auth/HttpError";
import { Logger } from "~/logging/Logger";
import { RefreshTokenService } from "~/services/auth/RefreshTokenService";

@injectable()
export class AuthProtectionHandler implements HttpHandler {
  private readonly logger = Logger.for(AuthProtectionHandler.name);

  public constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  public async handle<TContract extends HttpContract<any, any>>(
    ctx: HttpContext<TContract>,
    next: (ctx: HttpContext<TContract>) => Promise<void> | void,
  ): Promise<void> {
    if (ctx.contract.protection === AuthProtection.None) {
      return next(ctx);
    }

    if (ctx.contract.credentials === Credentials.None) {
      throw new Error("Credentials.None is illegal for the protected endpoint.");
    }

    const token = ctx.getBearerTokenValue();
    if (token === undefined) {
      this.logger.debug("No token present for the protected endpoint.");
      throw new HttpError(StatusCodes.UNAUTHORIZED);
    }

    const tokenPayload = await match(ctx.contract.credentials)
      .with(Credentials.AccessToken, () => this.accessTokenService.verify(token))
      .with(Credentials.RefreshToken, () => this.refreshTokenService.verify(token))
      .exhaustive();

    if (tokenPayload === undefined) {
      this.logger.debug("Invalid token for the protected endpoint.");
      throw new HttpError(StatusCodes.UNAUTHORIZED);
    }

    await next(ctx);
  }
}
