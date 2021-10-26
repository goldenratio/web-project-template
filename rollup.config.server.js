import serve from 'rollup-plugin-serve'
import { bundle, polyfills, outDir } from './rollup.config';

const bundleESNext = bundle();
bundleESNext
  .plugins
  .push(
    serve({
      contentBase: `./${outDir}`,
      open: true
    })
  );

export default [
  polyfills,
  bundleESNext
];
