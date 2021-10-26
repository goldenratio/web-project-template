import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import eslint from '@rollup/plugin-eslint';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';

const { version } = require('./package.json');

export const outDir = 'dist';

// maybe you can get correct version from your CI
const buildVersion = `v${version}`;

/**
 * @param {string} [tsConfigFile=tsconfig.json]
 * @param {boolean} [isProduction=false]
 * @return {*[]}
 */
const plugins = (tsConfigFile = 'tsconfig.json', isProduction = false) => {
	const defaultPlugins = [
		// Allow json resolution
		json(),


		// Compile TypeScript files
		typescript({
			tsconfig: tsConfigFile,
		}),

		// Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
		commonjs(),

		// Allow node_modules resolution, so you can use 'external' to control
		// which external modules to include in the bundle
		// https://github.com/rollup/rollup-plugin-node-resolve#usage
		resolve(),

		copy({
			targets: [
				{ src: './resources', dest: `${outDir}/${buildVersion}` },
				{
					src: './html-template/index.html',
					dest: `${outDir}`,
					transform: (contents, filename) => {
						return contents.toString().replaceAll('${version}', buildVersion);
					},
				},
			],
		}),
	];

	if (isProduction) {
		return [...defaultPlugins, terser()];
	}

	return [...defaultPlugins, sourceMaps()];
};

/**
 * @param {boolean} [isProduction=false]
 * @return {*}
 */
export const bundle = (isProduction = false) => {
	const tsConfigFile = 'tsconfig.json';
	return {
		input: 'src/index.ts',
		output: {
			dir: `./${outDir}/${buildVersion}`,
			format: 'es',
			sourcemap: !isProduction,
		},
		// Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
		external: [],
		watch: {
			include: 'src/**',
		},
		plugins: plugins(tsConfigFile, isProduction),
	};
};

export default () => {
	const isProduction = process.env.BUILD === 'production';
	return [bundle(isProduction)];
};
