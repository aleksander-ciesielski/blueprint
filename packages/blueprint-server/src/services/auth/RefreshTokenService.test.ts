import { mock } from "jest-mock-extended";
import { RefreshTokenPayload } from "@blueprint/contracts";
import jwt from "jsonwebtoken";
import type { Repository } from "typeorm";
import type { DatabaseService } from "~/services/DatabaseService";
import type { User } from "~/models/entities/User";
import { EnvReader } from "~/services/EnvReader";
import { InvalidatedRefreshToken } from "~/models/entities/InvalidatedRefreshToken";
import { RefreshToken } from "~/models/auth/RefreshToken";
import { RefreshTokenService } from "~/services/auth/RefreshTokenService";

const PRIVATE_KEY = "ABC";
const ID_LENGTH = 24;
const VALIDITY_SECONDS = 60;

beforeEach(() => {
  jest.useFakeTimers();
  jest.resetAllMocks();
});

const databaseService = mock<DatabaseService>();
const invalidatedRefreshTokenRepository = mock<Repository<InvalidatedRefreshToken>>();
const envReader = mock<EnvReader>();

function createRefreshTokenService(): RefreshTokenService {
  databaseService.getRepository.calledWith(InvalidatedRefreshToken)
    .mockReturnValue(invalidatedRefreshTokenRepository);

  envReader.getOrThrow.calledWith("REFRESH_TOKEN_PRIVATE_KEY", EnvReader.string)
    .mockReturnValue(PRIVATE_KEY);

  envReader.getOrThrow.calledWith("REFRESH_TOKEN_ID_LENGTH", EnvReader.integer)
    .mockReturnValue(ID_LENGTH);

  envReader.getOrThrow.calledWith("REFRESH_TOKEN_VALIDITY_SECONDS", EnvReader.integer)
    .mockReturnValue(VALIDITY_SECONDS);

  return new RefreshTokenService(
    databaseService,
    envReader,
  );
}

describe("RefreshTokenService", () => {
  describe("sign", () => {
    it("returns a RefreshToken instance", () => {
      const refreshTokenService = createRefreshTokenService();

      const refreshToken = refreshTokenService.sign(mock<User>({
        id: "123",
      }));

      expect(refreshToken).toBeInstanceOf(RefreshToken);
    });

    it("returns a refresh token with a correct JWT payload object", () => {
      const refreshTokenService = createRefreshTokenService();

      const refreshToken = refreshTokenService.sign(mock<User>({
        id: "123",
      }));

      expect(refreshToken.payload).not.toBeInstanceOf(RefreshTokenPayload);
      expect(refreshToken.payload).toEqual(expect.objectContaining({
        userId: "123",
        iat: expect.any(Number),
        exp: expect.any(Number),
      }));
    });

    it("returns a refresh token with a correct JWT value", () => {
      const refreshTokenService = createRefreshTokenService();

      const refreshToken = refreshTokenService.sign(mock<User>({
        id: "123",
      }));

      expect(() => jwt.verify(refreshToken.jwt, PRIVATE_KEY)).not.toThrow();
    });
  });

  describe("invalidate", () => {
    it("inserts the given token's id into the invalidated tokens repository", async () => {
      invalidatedRefreshTokenRepository.findOne.mockResolvedValue(null);
      const refreshTokenService = createRefreshTokenService();

      const token = jwt.sign({
        userId: "123",
        jti: "totally-random-id",
      }, PRIVATE_KEY);
      await refreshTokenService.invalidate(token);

      expect(invalidatedRefreshTokenRepository.insert).toHaveBeenCalledTimes(1);
      expect(invalidatedRefreshTokenRepository.insert).toHaveBeenCalledWith(expect.objectContaining({
        jti: "totally-random-id",
        expires: expect.any(Date),
      }));
    });

    it("does not insert the token id if the token itself is invalid", async () => {
      invalidatedRefreshTokenRepository.findOne.mockResolvedValue(null);
      const refreshTokenService = createRefreshTokenService();

      const token = jwt.sign({
        userId: "123",
        jti: "totally-random-id",
      }, "invalid-private-key");
      await refreshTokenService.invalidate(token);

      expect(invalidatedRefreshTokenRepository.insert).not.toHaveBeenCalled();
    });
  });

  describe("verify", () => {
    it("returns a JWT payload object if the given token is valid", async () => {
      invalidatedRefreshTokenRepository.findOne.mockResolvedValue(null);
      const refreshTokenService = createRefreshTokenService();

      const refreshTokenJwtPayload = await refreshTokenService.verify(
        jwt.sign(
          { userId: "123" },
          PRIVATE_KEY,
          { jwtid: "some-id", expiresIn: VALIDITY_SECONDS },
        ),
      );

      expect(refreshTokenJwtPayload).not.toBeInstanceOf(RefreshTokenPayload);
      expect(refreshTokenJwtPayload).toEqual(expect.objectContaining({
        userId: "123",
        jti: "some-id",
        iat: expect.any(Number),
        exp: expect.any(Number),
      }));
    });

    it("returns undefined if the given token is invalid (invalidated)", async () => {
      invalidatedRefreshTokenRepository.findOne.mockResolvedValue(mock<InvalidatedRefreshToken>());
      const refreshTokenService = createRefreshTokenService();
      const token = jwt.sign(
        { userId: "123" },
        PRIVATE_KEY,
        { expiresIn: VALIDITY_SECONDS },
      );

      const refreshTokenPayload = await refreshTokenService.verify(token);

      expect(refreshTokenPayload).toBeUndefined();
    });

    it("returns undefined if the given token is invalid (expired)", async () => {
      invalidatedRefreshTokenRepository.findOne.mockResolvedValue(null);
      const refreshTokenService = createRefreshTokenService();
      const token = jwt.sign(
        { userId: "123" },
        PRIVATE_KEY,
        { expiresIn: VALIDITY_SECONDS },
      );

      jest.setSystemTime(Date.now() + VALIDITY_SECONDS * 1_000);
      const refreshTokenPayload = await refreshTokenService.verify(token);

      expect(refreshTokenPayload).toBeUndefined();
    });

    it("returns undefined if the given token is invalid (malformed)", async () => {
      invalidatedRefreshTokenRepository.findOne.mockResolvedValue(null);
      const refreshTokenService = createRefreshTokenService();

      const refreshTokenPayload = await refreshTokenService.verify("hi");

      expect(refreshTokenPayload).toBeUndefined();
    });
  });
});
