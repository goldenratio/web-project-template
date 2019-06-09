import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'

/**
 * @param {('esnext' | 'legacy')} target
 * @return {{file: string, format: string, sourcemap: boolean}}
 */
const output = (target) => {
  const suffix = target === 'esnext' ? '.esnext' : '.legacy';
  const format = target === 'esnext' ? 'es' : 'cjs';
  return {
    file: `./dist/bundle${suffix}.js`,
    format: format,
    sourcemap: true
  };
};

/**
 * @param {string} [tsConfigFile=tsconfig.json]
 * @return {*[]}
 */
const plugins = (tsConfigFile = 'tsconfig.json') => [
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
  resolve(),

  // Resolve source maps to the original source
  sourceMaps()
];

const polyfills = {
  input: 'src/polyfills.ts',
  output: { file: './dist/polyfills.js', format: 'cjs', sourcemap: false },
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  plugins: plugins()
};

/**
 * @param {('esnext' | 'legacy')} target
 * @param {string} tsConfigFile
 * @return {*}
 */
const bundle = (target, tsConfigFile) => {
  return {
    input: 'src/index.ts',
    output: output(target),
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    watch: {
      include: 'src/**',
    },
    plugins: plugins(tsConfigFile)
  }
};

export default commandLineArgs => {
  const target = commandLineArgs ? commandLineArgs[ 'config-target' ] || 'esnext' : 'esnext';
  const tsConfigFile = target === 'esnext' ? 'tsconfig.esnext.json' : 'tsconfig.json';

  if (target === 'esnext') {
    return [
      bundle(target, tsConfigFile)
    ];
  }

  return [
    polyfills,
    bundle(target, tsConfigFile)
  ];
}
