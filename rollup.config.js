import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser';

export const outDir = 'dist';

/**
 * @param {boolean} isProduction
 * @return {{file: string, format: string, sourcemap: boolean}}
 */
const output = (isProduction) => {
  const suffix = '';
  const format = 'cjs';
  return {
    file: `./${outDir}/bundle${suffix}.js`,
    format: format,
    sourcemap: !isProduction
  };
};

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
      tsconfig: tsConfigFile
    }),

    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),

    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve()
  ];

  if (isProduction) {
    return [
      ... defaultPlugins,
      terser()
    ];
  }

  return [
    ... defaultPlugins,
    sourceMaps()
  ];
};

export const polyfills = {
  input: 'src/polyfills.ts',
  output: { file: `./${outDir}/polyfills.js`, format: 'iife', sourcemap: false },
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  plugins: plugins()
};

/**
 * @param {boolean} [isProduction=false]
 * @return {*}
 */
export const bundle = (isProduction = false) => {
  const tsConfigFile = 'tsconfig.json';
  return {
    input: 'src/index.ts',
    output: output(isProduction),
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    watch: {
      include: 'src/**',
    },
    plugins: plugins(tsConfigFile, isProduction)
  }
};

export default commandLineArgs => {
  const isProduction = commandLineArgs && commandLineArgs['config-production'] || false;
  return [
    polyfills,
    bundle(isProduction)
  ];
}
