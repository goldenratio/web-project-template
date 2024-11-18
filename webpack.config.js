const path = require("node:path");
const crypto = require("node:crypto");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const GenerateJsonPlugin = require("generate-json-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const packageJSON = require("./package.json");
const artifactVersion = `v${process.env.ARTIFACT_VERSION || packageJSON.version}`;
const baseDirectory = crypto.createHash("md5").update(`${artifactVersion}${Date.now()}`).digest("hex");
const artifactDest = `./dist/${baseDirectory}`;

const defaultConfig = ({ isWatchMode, isProduction, baseUrl }) => ({
  target: "web",
  entry: "./src/index.ts",
  output: {
    filename: "./[name].js",
    path: path.resolve(__dirname, artifactDest),
  },
  devServer: {},
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: "html-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|webp)$/,
        exclude: /node_modules/,
        loader: "file-loader",
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    extensionAlias: {
      ".js": [".ts", ".js"],
      ".mjs": [".mts", ".mjs"],
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.DefinePlugin({
      DEBUG: !isProduction,
      VERSION: JSON.stringify(artifactVersion),
      BASE_URL: JSON.stringify(baseUrl),
    }),
    new HtmlWebpackPlugin({
      filename: isWatchMode ? "index.html" : "../index.html",
      template: "./src/index.html",
      scriptLoading: "blocking",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "resources",
          to: "resources",
          transform(content, absoluteFrom) {
            if (absoluteFrom.includes(".json") || absoluteFrom.includes(".css")) {
              return content.toString().replaceAll("${baseUrl}", baseUrl);
            }
            return content;
          },
        },
      ],
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new GenerateJsonPlugin(
      "build-info.json",
      {
        version: artifactVersion,
        isProduction: isProduction,
        buildDate: new Date().toUTCString(),
      },
      undefined,
      2,
    ),
    new webpack.BannerPlugin({
      banner: () => {
        return `${packageJSON.name}\nversion: ${artifactVersion}\nbuild date: ${new Date().toUTCString()}\n`;
      },
    }),
  ],
});

module.exports = (_, argv) => {
  const { mode, env } = argv;
  const isProduction = mode === "production";
  const isWatchMode = env.WEBPACK_SERVE === true;
  const baseUrl = isWatchMode ? "" : baseDirectory;

  const config = defaultConfig({ isWatchMode, isProduction, baseUrl });
  if (isProduction) {
    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          minify: TerserPlugin.uglifyJsMinify,
          extractComments: false,
        }),
      ],
    };
  } else {
    config.devtool = "source-map";
  }

  return config;
};
