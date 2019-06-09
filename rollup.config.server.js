import { bundle } from './rollup.config';
import serve from 'rollup-plugin-serve'

const esnextBundle = bundle('esnext');
esnextBundle
  .plugins
  .push(
    serve({
      contentBase: './dist',
      open: true
    })
  );

export default [
  bundle('legacy'),
  esnextBundle
];
