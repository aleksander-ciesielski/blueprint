import { singleton } from "tsyringe";
import { RefreshTokenPayload } from "@blueprint/contracts";
import jwt from "jsonwebtoken";
import { instanceToPlain } from "class-transformer";
import { nanoid } from "nanoid";
import type { JwtPayload } from "@blueprint/contracts";
import type { Repository } from "typeorm";
import type { User } from "~/models/entities/User";
import { EnvReader } from "~/services/EnvReader";
import { DatabaseService } from "~/services/DatabaseService";
import { InvalidatedRefreshToken } from "~/models/entities/InvalidatedRefreshToken";
import { RefreshToken } from "~/models/auth/RefreshToken";
import { Logger } from "~/logging/Logger";

@singleton()
export class RefreshTokenService {
  private readonly logger = Logger.for(RefreshTokenService.name);

  private readonly PRIVATE_KEY: string;
  private readonly ID_LENGTH: number;
  private readonly VALIDITY_SECONDS: number;

  private readonly invalidatedRefreshTokenRepository: Repository<InvalidatedRefreshToken>;

  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly envReader: EnvReader,
  ) {
    this.invalidatedRefreshTokenRepository = this.databaseService.getRepository(InvalidatedRefreshToken);

    this.PRIVATE_KEY = this.envReader.getOrThrow(
      "REFRESH_TOKEN_PRIVATE_KEY",
      EnvReader.string,
    );

    this.ID_LENGTH = this.envReader.getOrThrow(
      "REFRESH_TOKEN_ID_LENGTH",
      EnvReader.integer,
    );

    this.VALIDITY_SECONDS = this.envReader.getOrThrow(
      "REFRESH_TOKEN_VALIDITY_SECONDS",
      EnvReader.integer,
    );
  }

  public sign(user: User): RefreshToken {
    const jwtid = nanoid(this.ID_LENGTH);
    const token = jwt.sign(
      instanceToPlain(this.getTokenPayload(user)),
      this.PRIVATE_KEY,
      { expiresIn: this.VALIDITY_SECONDS, jwtid },
    );

    return RefreshToken.from(token);
  }

  public async invalidate(token: string): Promise<void> {
    const payload = await this.verify(token);
    if (payload === undefined || payload.jti === undefined) {
      return;
    }

    await this.invalidatedRefreshTokenRepository.insert({
      jti: payload.jti,
      expires: new Date(Date.now() + this.VALIDITY_SECONDS * 1_000),
    });
  }

  public async verify(
    token: string,
  ): Promise<JwtPayload<RefreshTokenPayload> | undefined> {
    try {
      const payload = jwt.verify(token, this.PRIVATE_KEY) as JwtPayload<RefreshTokenPayload>;
      if (payload.jti === undefined) {
        return undefined;
      }

      const invalidatedToken = await this.invalidatedRefreshTokenRepository.findOne({
        where: {
          jti: payload.jti,
        },
      });

      if (invalidatedToken !== null) {
        this.logger.warn("Detected an attempt to use an invalidated refresh token.");
        return undefined;
      }

      return payload;
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        return undefined;
      }

      this.logger.error("Error during refresh token verification.", { e });
      throw e;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private getTokenPayload(user: User): RefreshTokenPayload {
    return new RefreshTokenPayload({
      userId: user.id,
    });
  }
}
