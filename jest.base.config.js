export default {
  transform: {
    ".*?": ["babel-jest", { configFile: "./babelrc.test.cjs" }],
  },
  testRegex: "^.+?/src/.+\\.test\\.ts$",
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!nanoid)",
  ],
};
