import jwt from "jsonwebtoken";
import type { AccessTokenPayload, JwtPayload } from "@blueprint/contracts";

export class AccessToken {
  public static from(token: string) {
    return new AccessToken(token, jwt.decode(token) as JwtPayload<AccessTokenPayload>);
  }

  public constructor(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    public readonly jwt: string,
    public readonly payload: JwtPayload<AccessTokenPayload>,
  ) {}
}
