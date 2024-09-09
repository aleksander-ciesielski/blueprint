import jwt from "jsonwebtoken";
import type { JwtPayload, RefreshTokenPayload } from "@blueprint/contracts";

export class RefreshToken {
  public static from(token: string) {
    return new RefreshToken(token, jwt.decode(token) as JwtPayload<RefreshTokenPayload>);
  }

  public constructor(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    public readonly jwt: string,
    public readonly payload: JwtPayload<RefreshTokenPayload>,
  ) {}
}
