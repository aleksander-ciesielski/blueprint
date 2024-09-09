/* eslint-disable max-len */

import { mock } from "jest-mock-extended";
import * as bcrypt from "bcrypt";
import { HttpContracts } from "@blueprint/contracts";
import type { Repository } from "typeorm";
import type { DatabaseService } from "~/services/DatabaseService";
import { EnvReader } from "~/services/EnvReader";
import { AuthService } from "~/services/auth/AuthService";
import { RefreshTokenService } from "~/services/auth/RefreshTokenService";
import { AccessTokenService } from "~/services/auth/AccessTokenService";
import { UserValidator } from "~/validators/UserValidator";
import { User } from "~/models/entities/User";
import { LoginError } from "~/errors/auth/LoginError";
import { TokenPair } from "~/models/auth/TokenPair";
import { RegisterError } from "~/errors/auth/RegisterError";
import { InvalidRefreshTokenError } from "~/errors/auth/InvalidRefreshTokenError";
import { InvalidatedRefreshToken } from "~/models/entities/InvalidatedRefreshToken";

const PASSWORD_HASH_ROUNDS = 2;
const REFRESH_TOKEN_PRIVATE_KEY = "REFRESH_TOKEN_PRIVATE_KEY";
const REFRESH_TOKEN_ID_LENGTH = 42;
const REFRESH_TOKEN_VALIDITY_SECONDS = 123;
const ACCESS_TOKEN_PRIVATE_KEY = "ACCESS_TOKEN_PRIVATE_KEY";
const ACCESS_TOKEN_VALIDITY_SECONDS = 321;

const databaseService = mock<DatabaseService>();
const envReader = mock<EnvReader>();
const userRepository = mock<Repository<User>>();
const invalidatedRefreshTokenRepository = mock<Repository<InvalidatedRefreshToken>>();

beforeEach(() => {
  jest.resetAllMocks();

  databaseService.getRepository.calledWith(User).mockReturnValue(userRepository);
  databaseService.getRepository.calledWith(InvalidatedRefreshToken).mockReturnValue(invalidatedRefreshTokenRepository);

  envReader.getOrThrow.calledWith("PASSWORD_HASH_ROUNDS", EnvReader.integer)
    .mockReturnValue(PASSWORD_HASH_ROUNDS);
  envReader.getOrThrow.calledWith("REFRESH_TOKEN_PRIVATE_KEY", EnvReader.string)
    .mockReturnValue(REFRESH_TOKEN_PRIVATE_KEY);
  envReader.getOrThrow.calledWith("REFRESH_TOKEN_ID_LENGTH", EnvReader.integer)
    .mockReturnValue(REFRESH_TOKEN_ID_LENGTH);
  envReader.getOrThrow.calledWith("REFRESH_TOKEN_VALIDITY_SECONDS", EnvReader.integer)
    .mockReturnValue(REFRESH_TOKEN_VALIDITY_SECONDS);
  envReader.getOrThrow.calledWith("ACCESS_TOKEN_PRIVATE_KEY", EnvReader.string)
    .mockReturnValue(ACCESS_TOKEN_PRIVATE_KEY);
  envReader.getOrThrow.calledWith("ACCESS_TOKEN_VALIDITY_SECONDS", EnvReader.integer)
    .mockReturnValue(ACCESS_TOKEN_VALIDITY_SECONDS);
});

function createAuthService(): AuthService {
  return new AuthService(
    databaseService,
    new RefreshTokenService(databaseService, envReader),
    new AccessTokenService(envReader),
    new UserValidator(),
    envReader,
  );
}

describe("AuthService (integration)", () => {
  describe("authenticate", () => {
    it("returns a TokenPair instance", async () => {
      userRepository.findOneBy.calledWith(
        expect.objectContaining({ email: "aleksander@blueprint.aleksanderciesiel.ski" }),
      ).mockResolvedValue(mock<User>({
        email: "aleksander@blueprint.aleksanderciesiel.ski",
        name: "Aleksander",
        password: await bcrypt.hash("123", 1),
      }));
      const authService = createAuthService();

      const tokenPair = await authService.authenticate("aleksander@blueprint.aleksanderciesiel.ski", "123");

      expect(tokenPair).toBeInstanceOf(TokenPair);
    });

    it("returns a TokenPair with the correct refresh token payload", async () => {
      userRepository.findOneBy.calledWith(
        expect.objectContaining({ email: "aleksander@blueprint.aleksanderciesiel.ski" }),
      ).mockResolvedValue(mock<User>({
        id: "ALEKSANDER",
        email: "aleksander@blueprint.aleksanderciesiel.ski",
        name: "Aleksander",
        password: await bcrypt.hash("123", 1),
      }));
      const authService = createAuthService();

      const tokenPair = await authService.authenticate("aleksander@blueprint.aleksanderciesiel.ski", "123");

      expect(tokenPair.refresh).toEqual(expect.objectContaining({
        jwt: expect.any(String),
        payload: {
          userId: "ALEKSANDER",
          exp: expect.any(Number),
          iat: expect.any(Number),
          jti: expect.any(String),
        },
      }));
    });

    it("returns a TokenPair with the correct access token payload", async () => {
      userRepository.findOneBy.calledWith(
        expect.objectContaining({ email: "aleksander@blueprint.aleksanderciesiel.ski" }),
      ).mockResolvedValue(mock<User>({
        id: "ALEKSANDER",
        email: "aleksander@blueprint.aleksanderciesiel.ski",
        name: "Aleksander",
        password: await bcrypt.hash("123", 1),
      }));
      const authService = createAuthService();

      const tokenPair = await authService.authenticate("aleksander@blueprint.aleksanderciesiel.ski", "123");

      expect(tokenPair.access).toEqual(expect.objectContaining({
        jwt: expect.any(String),
        payload: {
          name: "Aleksander",
          userId: "ALEKSANDER",
          exp: expect.any(Number),
          iat: expect.any(Number),
        },
      }));
    });

    it("throws an LoginError with HttpContracts.LoginErrorCode.UserNotFound if the user does not exist", async () => {
      userRepository.findOneBy.calledWith(
        expect.objectContaining({ email: "aleksander@blueprint.aleksanderciesiel.ski" }),
      ).mockResolvedValue(null);
      const authService = createAuthService();

      const rejects = expect(
        () => authService.authenticate("aleksander@blueprint.aleksanderciesiel.ski", "123"),
      ).rejects;

      await rejects.toThrow(LoginError);
      await rejects.toEqual<LoginError>(
        expect.objectContaining({ codes: [HttpContracts.LoginErrorCode.UserNotFound] }),
      );
    });

    it("throws an LoginError with HttpContracts.LoginErrorCode.InvalidPassword if the password is invalid", async () => {
      userRepository.findOneBy.calledWith(
        expect.objectContaining({ email: "aleksander@blueprint.aleksanderciesiel.ski" }),
      ).mockResolvedValue(mock<User>({
        email: "aleksander@blueprint.aleksanderciesiel.ski",
        name: "Aleksander",
        password: await bcrypt.hash("abc", 1),
      }));
      const authService = createAuthService();

      const rejects = expect(
        () => authService.authenticate("aleksander@blueprint.aleksanderciesiel.ski", "123"),
      ).rejects;

      await rejects.toThrow(LoginError);
      await rejects.toEqual<LoginError>(
        expect.objectContaining({ codes: [HttpContracts.LoginErrorCode.InvalidPassword] }),
      );
    });
  });

  describe("register", () => {
    it("inserts an User entity into the database", async () => {
      userRepository.findOneBy.calledWith(
        expect.objectContaining({ email: "aleksander@blueprint.aleksanderciesiel.ski" }),
      ).mockResolvedValue(null);
      const authService = createAuthService();

      await authService.register("aleksander@blueprint.aleksanderciesiel.ski", "Aleksander", "1234567890");

      expect(userRepository.insert).toHaveBeenCalledTimes(1);
      expect(userRepository.insert).toHaveBeenCalledWith(expect.objectContaining({
        name: "Aleksander",
        email: "aleksander@blueprint.aleksanderciesiel.ski",
        password: expect.any(String),
      }));
    });

    it("throws an RegisterError with RegisterErrorCode.MalformedEmail if the given email is malformed", async () => {
      const authService = createAuthService();

      const rejects = expect(
        () => authService.register("aleksander", "Aleksander", "1234567890"),
      ).rejects;

      await rejects.toThrow(RegisterError);
      await rejects.toEqual<RegisterError>(
        expect.objectContaining({ codes: [HttpContracts.RegisterErrorCode.MalformedEmail] }),
      );
    });

    it("throws an RegisterError with RegisterErrorCode.NameTooShort if the given name is too short", async () => {
      const authService = createAuthService();

      const rejects = expect(
        () => authService.register("aleksander@blueprint.aleksanderciesiel.ski", "mw", "1234567890"),
      ).rejects;

      await rejects.toThrow(RegisterError);
      await rejects.toEqual<RegisterError>(
        expect.objectContaining({ codes: [HttpContracts.RegisterErrorCode.NameTooShort] }),
      );
    });

    it("throws an RegisterError with RegisterErrorCode.NameTooLong if the given name is too long", async () => {
      const authService = createAuthService();

      const rejects = expect(
        () => authService.register("aleksander@blueprint.aleksanderciesiel.ski", "".padEnd(200, "B"), "1234567890"),
      ).rejects;

      await rejects.toThrow(RegisterError);
      await rejects.toEqual<RegisterError>(
        expect.objectContaining({ codes: [HttpContracts.RegisterErrorCode.NameTooLong] }),
      );
    });

    it("throws an RegisterError with RegisterErrorCode.PasswordTooShort if the given password is too short", async () => {
      const authService = createAuthService();

      const rejects = expect(
        () => authService.register("aleksander@blueprint.aleksanderciesiel.ski", "Aleksander", "123"),
      ).rejects;

      await rejects.toThrow(RegisterError);
      await rejects.toEqual<RegisterError>(
        expect.objectContaining({ codes: [HttpContracts.RegisterErrorCode.PasswordTooShort] }),
      );
    });

    it("throws an RegisterError with RegisterErrorCode.EmailInUse if the given email is already in use", async () => {
      userRepository.findOneBy.calledWith(
        expect.objectContaining({ email: "aleksander@blueprint.aleksanderciesiel.ski" }),
      ).mockResolvedValue(mock<User>());
      const authService = createAuthService();

      const rejects = expect(
        () => authService.register("aleksander@blueprint.aleksanderciesiel.ski", "Aleksander", "1234567890"),
      ).rejects;

      await rejects.toThrow(RegisterError);
      await rejects.toEqual<RegisterError>(
        expect.objectContaining({ codes: [HttpContracts.RegisterErrorCode.EmailInUse] }),
      );
    });
  });

  describe("rotateTokens", () => {
    it("invalidates the current refresh token", async () => {
      const user = mock<User>({
        id: "ALEKSANDER",
        name: "Aleksander",
        email: "aleksander@blueprint.aleksanderciesiel.ski",
        password: "1234567890",
        programs: [],
      });

      invalidatedRefreshTokenRepository.findOne.mockResolvedValue(null);
      userRepository.findOne.mockResolvedValue(user);
      userRepository.findOneBy.mockResolvedValue(user);
      const authService = createAuthService();

      const refreshTokenService = new RefreshTokenService(databaseService, envReader);
      const refreshToken = refreshTokenService.sign(user);

      await authService.rotateTokens(refreshToken.jwt);

      expect(invalidatedRefreshTokenRepository.insert).toHaveBeenCalledTimes(1);
      expect(invalidatedRefreshTokenRepository.insert).toHaveBeenCalledWith(expect.objectContaining({
        jti: refreshToken.payload.jti,
      }));
    });

    it("throws an InvalidRefreshTokenError if the token payload is incorrect", async () => {
      invalidatedRefreshTokenRepository.findOne.mockResolvedValue(null);
      const authService = createAuthService();

      await expect(() => authService.rotateTokens("ABC"))
        .rejects.toThrow(InvalidRefreshTokenError);
    });

    it("throws an Error if the related user does not exist", async () => {
      invalidatedRefreshTokenRepository.findOne.mockResolvedValue(null);
      const authService = createAuthService();

      const refreshTokenService = new RefreshTokenService(databaseService, envReader);
      const refreshToken = refreshTokenService.sign(mock<User>({
        name: "Aleksander",
        email: "aleksander@blueprint.aleksanderciesiel.ski",
        password: "1234567890",
        programs: [],
      }));

      await expect(() => authService.rotateTokens(refreshToken.jwt))
        .rejects.toThrow(Error);
    });
  });
});
