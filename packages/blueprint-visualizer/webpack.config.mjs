import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import path from "node:path";
import webpack from "webpack";

export default {
  mode: "production",
  entry: "./src/index.ts",
  module: {
    exprContextCritical: false,
    rules: [
      {
        loader: "string-replace-loader",
        options: {
          search: /String\.fromCharCode\(112, 97, 116, 104\)/,
          replace: "\"path\"",
          flags: "g",
        },
      },
      {
        loader: "string-replace-loader",
        options: {
          search: /String\.fromCharCode\(102, 115\)/,
          replace: "\"fs\"",
          flags: "g",
        },
      },
      {
        test: /\.ts$/,
        use: [{
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.build.json"
          },
        }],
        exclude: /node_modules/,
      },
    ],
  },
  experiments: {
    outputModule: true,
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new NodePolyfillPlugin({
      includeAliases: ["path"],
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [new TsconfigPathsPlugin()],
  },
  output: {
    filename: "index.js",
    path: path.resolve(import.meta.dirname, "dist"),
    globalObject: "this",
    library: {
      type: "module",
    },
  },
};
