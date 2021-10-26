import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

import { bundle, outDir } from './rollup.config';

const bundleServer = bundle();
bundleServer.plugins.push(
	serve({
		contentBase: `./${outDir}`,
		open: true,
	}),
	livereload(`./${outDir}`)
);

export default [bundleServer];
