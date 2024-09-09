import { EnvReader } from "~/services/EnvReader";

beforeEach(() => {
  globalThis.process.env = {};
});

describe("EnvReader", () => {
  describe("get", () => {
    it("returns the environment variable value if it's set", () => {
      globalThis.process.env.ENV_NAME = "hello";

      const reader = new EnvReader();
      expect(reader.get("ENV_NAME", EnvReader.string)).toBe("hello");
    });

    it("returns transformed environment variable if it's set and a non-String transform function is specified", () => {
      globalThis.process.env.ENV_NAME = "42";

      const reader = new EnvReader();
      expect(reader.get("ENV_NAME", EnvReader.integer)).toBe(42);
    });

    it("returns undefined if the environment variable is not set", () => {
      const reader = new EnvReader();
      expect(reader.get("ENV_NAME", EnvReader.string)).toBe(undefined);
    });
  });

  describe("getOrThrow", () => {
    it("returns the environment variable value if it's set", () => {
      globalThis.process.env.ENV_NAME = "hello";

      const reader = new EnvReader();
      expect(reader.getOrThrow("ENV_NAME", EnvReader.string)).toBe("hello");
    });

    it("returns transformed environment variable if it's set and a non-String transform function is specified", () => {
      globalThis.process.env.ENV_NAME = "42";

      const reader = new EnvReader();
      expect(reader.getOrThrow("ENV_NAME", EnvReader.integer)).toBe(42);
    });

    it("throws an Error if the environment variable is not set", () => {
      const reader = new EnvReader();
      expect(() => reader.getOrThrow("ENV_NAME", EnvReader.string)).toThrow();
    });
  });
});
