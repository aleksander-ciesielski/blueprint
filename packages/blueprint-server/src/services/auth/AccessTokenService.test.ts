import { mock } from "jest-mock-extended";
import { AccessTokenPayload } from "@blueprint/contracts";
import jwt from "jsonwebtoken";
import type { User } from "~/models/entities/User";
import { EnvReader } from "~/services/EnvReader";
import { AccessToken } from "~/models/auth/AccessToken";
import { AccessTokenService } from "~/services/auth/AccessTokenService";

const PRIVATE_KEY = "ABC";
const VALIDITY_SECONDS = 60;

beforeEach(() => {
  jest.useFakeTimers();
  jest.resetAllMocks();
});

const envReader = mock<EnvReader>();

function createAccessTokenService(): AccessTokenService {
  envReader.getOrThrow.calledWith("ACCESS_TOKEN_PRIVATE_KEY", EnvReader.string)
    .mockReturnValue(PRIVATE_KEY);

  envReader.getOrThrow.calledWith("ACCESS_TOKEN_VALIDITY_SECONDS", EnvReader.integer)
    .mockReturnValue(VALIDITY_SECONDS);

  return new AccessTokenService(envReader);
}

describe("AccessTokenService", () => {
  describe("sign", () => {
    it("returns an AccessToken instance", () => {
      const accessTokenService = createAccessTokenService();

      const accessToken = accessTokenService.sign(mock<User>({
        id: "123",
      }));

      expect(accessToken).toBeInstanceOf(AccessToken);
    });

    it("returns an access token with a correct JWT payload object", () => {
      const accessTokenService = createAccessTokenService();

      const accessToken = accessTokenService.sign(mock<User>({
        id: "123",
      }));

      expect(accessToken.payload).not.toBeInstanceOf(AccessTokenPayload);
      expect(accessToken.payload).toEqual(expect.objectContaining({
        userId: "123",
        iat: expect.any(Number),
        exp: expect.any(Number),
      }));
    });

    it("returns an access token with a correct JWT value", () => {
      const accessTokenService = createAccessTokenService();

      const accessToken = accessTokenService.sign(mock<User>({
        id: "123",
      }));

      expect(() => jwt.verify(accessToken.jwt, PRIVATE_KEY)).not.toThrow();
    });
  });

  describe("verify", () => {
    it("returns a JWT payload object if the given token is valid", async () => {
      const accessTokenService = createAccessTokenService();
      const accessTokenJwtPayload = await accessTokenService.verify(
        jwt.sign(
          { userId: "123" },
          PRIVATE_KEY,
          { expiresIn: VALIDITY_SECONDS },
        ),
      );

      expect(accessTokenJwtPayload).not.toBeInstanceOf(AccessTokenPayload);
      expect(accessTokenJwtPayload).toEqual(expect.objectContaining({
        userId: "123",
        iat: expect.any(Number),
        exp: expect.any(Number),
      }));
    });

    it("returns undefined if the given token is invalid (expired)", async () => {
      const accessTokenService = createAccessTokenService();
      const token = jwt.sign(
        { userId: "123" },
        PRIVATE_KEY,
        { expiresIn: VALIDITY_SECONDS },
      );

      jest.setSystemTime(Date.now() + VALIDITY_SECONDS * 1_000);
      const accessTokenPayload = await accessTokenService.verify(token);

      expect(accessTokenPayload).toBeUndefined();
    });

    it("returns undefined if the given token is invalid (malformed)", async () => {
      const accessTokenService = createAccessTokenService();

      const accessTokenPayload = await accessTokenService.verify("hi");

      expect(accessTokenPayload).toBeUndefined();
    });
  });
});
