const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const { version } = require('./package.json');
const artifactVersion = `v${process.env.ARTIFACT_VERSION || version}`;
const artifactDest = `./dist/${artifactVersion}`;

const defaultConfig = ({ isWatchMode, isProduction, baseUrl }) => ({
  target: 'web',
  entry: './src/index.ts',
  output: {
    filename: './[name].js',
    path: path.resolve(__dirname, artifactDest),
  },
  devServer: {},
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|webp)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      extensions: 'ts',
    }),
    new webpack.DefinePlugin({
      DEBUG: !isProduction,
      VERSION: JSON.stringify(artifactVersion),
      BASE_URL: JSON.stringify(baseUrl)
    }),
    new HtmlWebpackPlugin({
      filename: isWatchMode ? 'index.html' : '../index.html',
      template: './src/index.html',
      scriptLoading: 'blocking'
    }),
    new CopyPlugin({
      patterns: [{
        from: 'resources',
        to: 'resources',
        transform(content, absoluteFrom) {
          if (absoluteFrom.includes('.json') || absoluteFrom.includes('.css')) {
            return content.toString().replaceAll('${baseUrl}', baseUrl)
          }
          return content;
        }
      }],
    }),
  ],
});

module.exports = (_, argv) => {
  const { mode, env } = argv;
  const isProduction = mode === 'production';
  const isWatchMode = env.WEBPACK_SERVE === true;
  const baseUrl = isWatchMode ? '' : artifactVersion;

  const config = defaultConfig({ isWatchMode, isProduction, baseUrl });
  if (!isProduction) {
    config.devtool = 'source-map';
  }

  return config;
};
