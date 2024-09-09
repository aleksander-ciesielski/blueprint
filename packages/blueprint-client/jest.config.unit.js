import baseConfig from "../../jest.base.config.js";
import mergeOptions from "merge-options";

export default mergeOptions(baseConfig, {
  testEnvironment: "jsdom",
  modulePathIgnorePatterns: ["integration"],
  setupFilesAfterEnv: [
    "jest-extended/all",
    "./jest.setup",
  ],
});
