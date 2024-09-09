const path = require("node:path");

module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@next/next/recommended",
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  rules: {
    "@next/next/no-html-link-for-pages": ["warn", path.join(__dirname, "./src/pages")],
    "no-param-reassign": ["off"],
    "import/no-webpack-loader-syntax": "off",
  },
};
