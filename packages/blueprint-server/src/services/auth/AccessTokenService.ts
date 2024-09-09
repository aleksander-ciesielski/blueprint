import { singleton } from "tsyringe";
import { AccessTokenPayload } from "@blueprint/contracts";
import jwt from "jsonwebtoken";
import { instanceToPlain } from "class-transformer";
import type { JwtPayload } from "@blueprint/contracts";
import type { User } from "~/models/entities/User";
import { Logger } from "~/logging/Logger";
import { AccessToken } from "~/models/auth/AccessToken";
import { EnvReader } from "~/services/EnvReader";

@singleton()
export class AccessTokenService {
  private readonly PRIVATE_KEY: string;
  private readonly VALIDITY_SECONDS: number;

  private readonly logger = Logger.for(AccessTokenService.name);

  public constructor(
    private readonly envReader: EnvReader,
  ) {
    this.PRIVATE_KEY = this.envReader.getOrThrow(
      "ACCESS_TOKEN_PRIVATE_KEY",
      EnvReader.string,
    );

    this.VALIDITY_SECONDS = this.envReader.getOrThrow(
      "ACCESS_TOKEN_VALIDITY_SECONDS",
      EnvReader.integer,
    );
  }

  public sign(user: User): AccessToken {
    const token = jwt.sign(
      instanceToPlain(this.getTokenPayload(user)),
      this.PRIVATE_KEY,
      { expiresIn: this.VALIDITY_SECONDS },
    );

    return AccessToken.from(token);
  }

  public async verify(
    token: string,
  ): Promise<JwtPayload<AccessTokenPayload> | undefined> {
    try {
      return jwt.verify(token, this.PRIVATE_KEY) as JwtPayload<AccessTokenPayload>;
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        return undefined;
      }

      this.logger.error("Error during access token verification.", { e });
      throw e;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private getTokenPayload(user: User): AccessTokenPayload {
    return new AccessTokenPayload({
      userId: user.id,
      name: user.name,
    });
  }
}
