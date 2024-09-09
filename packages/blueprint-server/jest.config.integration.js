import baseConfig from "../../jest.base.config.js";
import mergeOptions from "merge-options";

export default mergeOptions(baseConfig, {
  testRegex: "^.+?/src/integration/.+\\.test\\.ts$",
  setupFilesAfterEnv: [
    "jest-extended/all",
    "./jest.setup",
  ],
});
