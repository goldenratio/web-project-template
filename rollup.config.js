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
  const suffix = target === 'esnext' ? '.esnext': '.legacy';
  const format = target === 'esnext' ? 'es' : 'cjs';
  return { file: `./dist/bundle${suffix}.js`, format: format, sourcemap: true };
};

export default commandLineArgs => {
  const target = commandLineArgs ? commandLineArgs['config-target'] || 'esnext' : 'esnext';
  const tsConfigFile  = target === 'esnext' ? 'tsconfig.esnext.json' : 'tsconfig.json';

  return {
    input: `src/index.ts`,
    output: output(target),
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    watch: {
      include: 'src/**',
    },
    plugins: [
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
    ],
  };
}
