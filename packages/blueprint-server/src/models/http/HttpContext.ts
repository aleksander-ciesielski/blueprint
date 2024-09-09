import { Credentials } from "@blueprint/contracts";
import { match } from "ts-pattern";
import type {
  AccessTokenPayload, HttpContract, JwtPayload, RefreshTokenPayload,
} from "@blueprint/contracts";
import type { Request, Response } from "express";
import type { AccessTokenService } from "~/services/auth/AccessTokenService";
import type { RefreshTokenService } from "~/services/auth/RefreshTokenService";
import { Req } from "~/models/http/Req";
import { Res } from "~/models/http/Res";
import { AccessToken } from "~/models/auth/AccessToken";
import { EmptyBearerTokenError } from "~/errors/auth/EmptyBearerTokenError";
import { InvalidBearerTokenSignatureError } from "~/errors/auth/InvalidBearerTokenSignatureError";
import { RefreshToken } from "~/models/auth/RefreshToken";

export interface HttpContextOptions<TContract extends HttpContract<any, any>> {
  contract: TContract;
  $req: Request;
  $res: Response;
}

export class HttpContext<const TContract extends HttpContract<any, any>> {
  private static readonly AUTHORIZATION_TOKEN_REGEX = /^Bearer (.*?)$/;

  public readonly contract: TContract;
  public readonly req: Req<TContract>;
  public readonly res: Res<TContract>;

  public constructor(
    private readonly options: HttpContextOptions<TContract>,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly accessTokenService: AccessTokenService,
  ) {
    this.contract = options.contract;

    this.req = new Req(options.contract, options.$req);
    this.res = new Res(options.contract, options.$res);
  }

  public async getBearerTokenOrThrow(): Promise<RefreshToken | AccessToken> {
    const value = this.getBearerTokenValue();
    if (value === undefined || this.contract.credentials === Credentials.None) {
      throw new EmptyBearerTokenError();
    }

    const payload = await match(this.contract.credentials)
      .with(Credentials.RefreshToken, () => this.refreshTokenService.verify(value))
      .with(Credentials.AccessToken, () => this.accessTokenService.verify(value))
      .exhaustive();

    if (payload === undefined) {
      throw new InvalidBearerTokenSignatureError();
    }

    return match(this.contract.credentials)
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      .with(Credentials.RefreshToken, () => new RefreshToken(value, payload as JwtPayload<RefreshTokenPayload>))
      .with(Credentials.AccessToken, () => new AccessToken(value, payload as JwtPayload<AccessTokenPayload>))
      .exhaustive();
  }

  public getBearerTokenValue(): string | undefined {
    if (this.options.$req.headers.authorization === undefined) {
      return undefined;
    }

    const result = HttpContext.AUTHORIZATION_TOKEN_REGEX.exec(this.options.$req.headers.authorization);
    return result?.[1]?.trim();
  }
}
