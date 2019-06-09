import defaultConfig from './rollup.config';
import serve from 'rollup-plugin-serve'

const defaultJSON = defaultConfig({
  'config-target': 'esnext'
});
const plugins = defaultJSON
  .plugins
  .concat([
    serve({
      contentBase: './dist',
      open: true
    })
  ]);

const config = { ...defaultJSON, plugins };

export default config;
