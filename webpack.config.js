/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const GasPlugin = require("gas-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const eslintOptions = {
  extensions: [`js`, `ts`],
  exclude: [`node_modules`],
  fix: true,
};

module.exports = {
  mode: "development",
  devtool: false,
  context: __dirname,
  entry: "./src/index.ts",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [new GasPlugin(), new ESLintPlugin(eslintOptions)],
};
