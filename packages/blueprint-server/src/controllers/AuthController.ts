import { injectable } from "tsyringe";
import { HttpContracts } from "@blueprint/contracts";
import { StatusCodes } from "http-status-codes";
import { HttpContract } from "~/decorators/http/HttpContract";
import { HttpContext } from "~/models/http/HttpContext";
import { AuthService } from "~/services/auth/AuthService";
import { RefreshTokenService } from "~/services/auth/RefreshTokenService";
import { AccessTokenService } from "~/services/auth/AccessTokenService";
import { LoginError } from "~/errors/auth/LoginError";
import { InvalidRefreshTokenError } from "~/errors/auth/InvalidRefreshTokenError";
import { RegisterError } from "~/errors/auth/RegisterError";

@injectable()
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  @HttpContract(HttpContracts.loginContract)
  public async login(ctx: HttpContext<typeof HttpContracts.loginContract>): Promise<void> {
    const currentRefreshToken = ctx.getBearerTokenValue();
    if (currentRefreshToken !== undefined) {
      await this.refreshTokenService.invalidate(currentRefreshToken);
    }

    try {
      const tokenPair = await this.authService.authenticate(
        ctx.req.payload.email.trim(),
        ctx.req.payload.password.trim(),
      );

      return ctx.res.send(StatusCodes.OK, new HttpContracts.LoginOkResponse(
        tokenPair.refresh.jwt,
        tokenPair.access.jwt,
      ));
    } catch (e) {
      if (e instanceof LoginError) {
        return ctx.res.send(
          StatusCodes.UNAUTHORIZED,
          new HttpContracts.LoginUnauthorizedResponse(e.codes),
        );
      }

      throw e;
    }
  }

  @HttpContract(HttpContracts.registerContract)
  public async register(ctx: HttpContext<typeof HttpContracts.registerContract>): Promise<void> {
    try {
      await this.authService.register(
        ctx.req.payload.email.trim(),
        ctx.req.payload.name.trim(),
        ctx.req.payload.password.trim(),
      );

      return ctx.res.send(StatusCodes.CREATED, undefined);
    } catch (e) {
      if (e instanceof RegisterError) {
        return ctx.res.send(
          StatusCodes.BAD_REQUEST,
          new HttpContracts.RegisterBadRequestResponse(e.codes),
        );
      }

      throw e;
    }
  }

  @HttpContract(HttpContracts.logoutContract)
  public async logout(ctx: HttpContext<typeof HttpContracts.logoutContract>): Promise<void> {
    const refreshToken = ctx.getBearerTokenValue();
    if (refreshToken === undefined) {
      return ctx.res.send(StatusCodes.UNAUTHORIZED, undefined);
    }

    await this.refreshTokenService.invalidate(refreshToken);
    return ctx.res.send(StatusCodes.NO_CONTENT, undefined);
  }

  @HttpContract(HttpContracts.rotateTokensContract)
  public async rotateTokens(ctx: HttpContext<typeof HttpContracts.rotateTokensContract>): Promise<void> {
    const currentRefreshToken = ctx.getBearerTokenValue();
    if (currentRefreshToken === undefined) {
      return ctx.res.send(StatusCodes.UNAUTHORIZED, undefined);
    }

    try {
      const tokenPair = await this.authService.rotateTokens(currentRefreshToken);

      return ctx.res.send(StatusCodes.OK, new HttpContracts.RotateTokensOkResponse(
        tokenPair.refresh.jwt,
        tokenPair.access.jwt,
      ));
    } catch (e) {
      if (e instanceof InvalidRefreshTokenError) {
        return ctx.res.send(StatusCodes.UNAUTHORIZED, undefined);
      }

      throw e;
    }
  }

  @HttpContract(HttpContracts.myselfContract)
  public async myself(ctx: HttpContext<typeof HttpContracts.myselfContract>): Promise<void> {
    const accessToken = ctx.getBearerTokenValue();
    if (accessToken === undefined) {
      return ctx.res.send(StatusCodes.OK, {
        username: undefined,
        userId: undefined,
      });
    }

    const payload = await this.accessTokenService.verify(accessToken);

    return ctx.res.send(StatusCodes.OK, {
      username: payload?.name,
      userId: payload?.userId,
    });
  }
}
