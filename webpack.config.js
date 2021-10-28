const fs = require('fs');
const path = require('path');

const { argv } = require('yargs');
const webpack = require('webpack');
// eslint-disable-next-line @typescript-eslint/naming-convention
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/naming-convention
const CleanWebpackPlugin = require('clean-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/naming-convention
const ESLintPlugin = require('eslint-webpack-plugin');

const projectRoot = path.resolve(process.cwd());

const packageNameParam = argv['packageName'];
if (typeof packageNameParam !== 'string') {
  throw new Error('missing packageName, example usage: npm run sandbox cascade-slot-machine');
}

const paramParts = packageNameParam.split(':');
const packageName = paramParts[0];
const sandboxName = typeof paramParts[1] === 'string' ? `sandbox-${paramParts[1]}` : 'sandbox';

const sandboxFolder = `./packages/${packageName}/${sandboxName}`;
if (!fs.existsSync(sandboxFolder)) {
  throw new Error(`sandbox folder ${sandboxFolder} does not exist`);
}

const componentsDirList = fs.readdirSync('./packages') || [];
const componentsAlias = {};
componentsDirList.forEach(dirName => {
  componentsAlias[`@gsbaltic/${dirName}`] = path.resolve(projectRoot, `./packages/${dirName}/src`);
});

const defaultConfig = () => ({
    target: 'web',
    entry: {
      main: ['core-js', 'whatwg-fetch', `${sandboxFolder}/index.ts`]
    },
    devServer: {
      contentBase: sandboxFolder,
      host: '0.0.0.0',
      port: 8000
    },
    module: {
      rules: [
        {
          // needed for pixi-inspect dev tool
          // Provide plugin only helps for libraries
          test: path.resolve('./node_modules/pixi.js-legacy'),
          loader: 'expose-loader',
          options: {
            exposes: {
              globalName: 'PIXI',
              override: true
            }
          }
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.html$/,
          use: 'html-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpg|gif)$/,
          exclude: /node_modules/,
          loader: 'file-loader'
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        ... componentsAlias
      }
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new ESLintPlugin({
        extensions: 'ts'
      }),
      new webpack.DefinePlugin({
        DEBUG: true
      }),
      new HtmlWebpackPlugin({
        template: `${sandboxFolder}/index.html`
      }),
      new webpack.ProvidePlugin({
        PIXI: 'pixi.js-legacy'
      })
    ],
    output: {
      filename: './[name].js',
      path: path.resolve(__dirname, 'dist')
    }
  });

const getDevConfig = () => {
  const config = defaultConfig();
  config.devtool = 'source-map';
  return config;
};

module.exports = (env, argv) => getDevConfig();
