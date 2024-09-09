import { singleton } from "tsyringe";
import * as bcrypt from "bcrypt";
import { HttpContracts } from "@blueprint/contracts";
import type { Repository } from "typeorm";
import { RefreshTokenService } from "~/services/auth/RefreshTokenService";
import { AccessTokenService } from "~/services/auth/AccessTokenService";
import { User } from "~/models/entities/User";
import { TokenPair } from "~/models/auth/TokenPair";
import { DatabaseService } from "~/services/DatabaseService";
import { LoginError } from "~/errors/auth/LoginError";
import { InvalidRefreshTokenError } from "~/errors/auth/InvalidRefreshTokenError";
import { RegisterError } from "~/errors/auth/RegisterError";
import { UserValidator } from "~/validators/UserValidator";
import { EnvReader } from "~/services/EnvReader";

@singleton()
export class AuthService {
  private readonly userRepository: Repository<User>;

  private readonly PASSWORD_HASH_ROUNDS: number;

  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly accessTokenService: AccessTokenService,
    private readonly userValidator: UserValidator,
    private readonly envReader: EnvReader,
  ) {
    this.userRepository = this.databaseService.getRepository(User);

    this.PASSWORD_HASH_ROUNDS = this.envReader.getOrThrow(
      "PASSWORD_HASH_ROUNDS",
      EnvReader.integer,
    );
  }

  public async authenticate(
    email: string,
    password: string,
  ): Promise<TokenPair> {
    const user = await this.userRepository.findOneBy({ email });
    if (user === null) {
      throw new LoginError([HttpContracts.LoginErrorCode.UserNotFound]);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new LoginError([HttpContracts.LoginErrorCode.InvalidPassword]);
    }

    return new TokenPair({
      refresh: this.refreshTokenService.sign(user),
      access: this.accessTokenService.sign(user),
    });
  }

  public async register(
    email: string,
    name: string,
    password: string,
  ): Promise<void> {
    const validationErrors = this.userValidator.validate({ name, email, password });
    if (validationErrors.length > 0) {
      throw new RegisterError(validationErrors);
    }

    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser !== null) {
      throw new RegisterError([HttpContracts.RegisterErrorCode.EmailInUse]);
    }

    await this.userRepository.insert({
      email,
      name,
      password: await bcrypt.hash(password, this.PASSWORD_HASH_ROUNDS),
    });
  }

  public async rotateTokens(refreshToken: string): Promise<TokenPair> {
    const currentRefreshTokenPayload = await this.refreshTokenService.verify(refreshToken);
    if (currentRefreshTokenPayload === undefined) {
      throw new InvalidRefreshTokenError();
    }

    const user = await this.userRepository.findOneBy({
      id: currentRefreshTokenPayload.userId,
    });

    if (user === null) {
      throw new Error("Related user not found for the given refresh token.");
    }

    if (currentRefreshTokenPayload.exp === undefined) {
      throw new Error("No expiration date found for the given refresh token.");
    }

    await this.refreshTokenService.invalidate(refreshToken);

    return new TokenPair({
      access: this.accessTokenService.sign(user),
      refresh: this.refreshTokenService.sign(user),
    });
  }
}
