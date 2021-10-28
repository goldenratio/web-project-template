const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const artifactVersion = 'v1.0.0';
const artifactDest = `./dist/${artifactVersion}`;

const defaultConfig = () => ({
	target: 'web',
	entry: './src/index.ts',
	output: {
		filename: './[name].js',
		path: path.resolve(__dirname, artifactDest),
	},
	devServer: {
		port: 8000
	},
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
			DEBUG: true,
		}),
		new HtmlWebpackPlugin({
      filename: '../index.html',
      template: './src/index.html'
    }),
		new CopyPlugin({
			patterns: [
				{ from: 'resources', to: 'resources' }
			],
		}),
	],
});

const getDevConfig = () => {
	const config = defaultConfig();
	config.devtool = 'source-map';
	return config;
};

module.exports = (env, argv) => {
  console.log(env);
	return getDevConfig();
};
