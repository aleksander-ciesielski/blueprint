import { mock } from "jest-mock-extended";
import * as bcrypt from "bcrypt";
import type { JwtPayload, RefreshTokenPayload } from "@blueprint/contracts";
import type { Repository } from "typeorm";
import type { RefreshTokenService } from "~/services/auth/RefreshTokenService";
import type { AccessTokenService } from "~/services/auth/AccessTokenService";
import type { DatabaseService } from "~/services/DatabaseService";
import type { RefreshToken } from "~/models/auth/RefreshToken";
import type { AccessToken } from "~/models/auth/AccessToken";
import type { UserValidator } from "~/validators/UserValidator";
import type { EnvReader } from "~/services/EnvReader";
import { User } from "~/models/entities/User";
import { TokenPair } from "~/models/auth/TokenPair";
import { LoginError } from "~/errors/auth/LoginError";
import { InvalidRefreshTokenError } from "~/errors/auth/InvalidRefreshTokenError";
import { AuthService } from "~/services/auth/AuthService";

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(1692490336133);
  jest.resetAllMocks();
});

const databaseService = mock<DatabaseService>();
const userRepository = mock<Repository<User>>();
const refreshTokenService = mock<RefreshTokenService>();
const accessTokenService = mock<AccessTokenService>();
const userValidator = mock<UserValidator>();
const envReader = mock<EnvReader>();

function createAuthService(): AuthService {
  databaseService.getRepository.calledWith(User).mockReturnValue(userRepository);

  return new AuthService(
    databaseService,
    refreshTokenService,
    accessTokenService,
    userValidator,
    envReader,
  );
}

describe("AuthService", () => {
  describe("authenticate", () => {
    it("returns a TokenPair instance", async () => {
      userRepository.findOneBy.calledWith(expect.objectContaining({ email: "abc@def.xyz" }))
        .mockResolvedValue(mock<User>({
          name: "Aleksander",
          email: "abc@def.xyz",
          password: await bcrypt.hash("321", 4),
        }));

      const authService = createAuthService();
      const tokenPair = await authService.authenticate("abc@def.xyz", "321");

      expect(tokenPair).toBeInstanceOf(TokenPair);
    });

    it("returns tokens created by RefreshTokenService and AccessTokenService", async () => {
      const refreshToken = mock<RefreshToken>();
      const accessToken = mock<AccessToken>();
      refreshTokenService.sign.mockReturnValue(refreshToken);
      accessTokenService.sign.mockReturnValue(accessToken);
      userRepository.findOneBy.calledWith(expect.objectContaining({ email: "abc@def.xyz" }))
        .mockResolvedValue(mock<User>({
          email: "abc@def.xyz",
          password: await bcrypt.hash("321", 4),
        }));

      const authService = createAuthService();
      const tokenPair = await authService.authenticate("abc@def.xyz", "321");

      expect(tokenPair.refresh).toBe(refreshToken);
      expect(tokenPair.access).toBe(accessToken);
    });

    it("throws LoginError if the related user does not exist", async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      const authService = createAuthService();

      await expect(() => authService.authenticate("abc@def.xyz", "321"))
        .rejects.toThrow(LoginError);
    });

    it("throws LoginError if the given password is invalid", async () => {
      userRepository.findOneBy.calledWith(expect.objectContaining({ email: "abc@def.xyz" }))
        .mockResolvedValue(mock<User>({
          email: "abc@def.xyz",
          password: await bcrypt.hash("321", 4),
        }));

      const authService = createAuthService();

      await expect(() => authService.authenticate("abc@def.xyz", "abc"))
        .rejects.toThrow(LoginError);
    });
  });

  describe("rotateTokens", () => {
    it("returns a TokenPair instance", async () => {
      refreshTokenService.verify.calledWith("token").mockResolvedValue(mock<JwtPayload<RefreshTokenPayload>>({
        userId: "123",
        exp: 1700266359,
      }));

      const authService = createAuthService();
      const tokenPair = await authService.rotateTokens("token");

      expect(tokenPair).toBeInstanceOf(TokenPair);
    });

    it("returns tokens created by RefreshTokenService and AccessTokenService", async () => {
      const refreshToken = mock<RefreshToken>();
      const accessToken = mock<AccessToken>();
      refreshTokenService.sign.mockReturnValue(refreshToken);
      accessTokenService.sign.mockReturnValue(accessToken);
      refreshTokenService.verify.calledWith("TOKEN").mockResolvedValue(mock<JwtPayload<RefreshTokenPayload>>({
        userId: "123",
        exp: 1700266359,
      }));
      userRepository.findOneBy.calledWith(
        expect.objectContaining({ id: "123" }),
      ).mockResolvedValue(mock<User>());

      const authService = createAuthService();
      const tokenPair = await authService.rotateTokens("TOKEN");

      expect(tokenPair.refresh).toBe(refreshToken);
      expect(tokenPair.access).toBe(accessToken);
    });

    it("invalidates the given refresh token", async () => {
      refreshTokenService.verify.calledWith("token").mockResolvedValue(mock<JwtPayload<RefreshTokenPayload>>({
        userId: "123",
        exp: 1700266359,
      }));
      userRepository.findOneBy.calledWith(
        expect.objectContaining({ id: "123" }),
      ).mockResolvedValue(mock<User>());

      const authService = createAuthService();
      await authService.rotateTokens("token");

      expect(refreshTokenService.invalidate).toHaveBeenCalledTimes(1);
      expect(refreshTokenService.invalidate).toHaveBeenCalledWith("token");
    });

    it("throws HttpError if the given token is invalid", async () => {
      const authService = createAuthService();

      await expect(() => authService.rotateTokens("malformed-token")).rejects.toThrow(InvalidRefreshTokenError);
    });

    it("throws an error if the given token does not have exp claim set", async () => {
      refreshTokenService.verify.calledWith("TOKEN").mockResolvedValue(mock<JwtPayload<RefreshTokenPayload>>({
        userId: "123",
        exp: undefined,
      }));
      userRepository.findOneBy.calledWith(
        expect.objectContaining({ id: "123" }),
      ).mockResolvedValue(mock<User>());

      const authService = createAuthService();

      await expect(() => authService.rotateTokens("TOKEN")).rejects.toThrowError();
    });
  });
});
