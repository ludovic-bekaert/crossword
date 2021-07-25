const {sassPlugin} = require('esbuild-sass-plugin');

require('esbuild').build({
  entryPoints: ['src/index.js'],
  bundle: true,
  external: ['react', 'lodash', 'prop-types'],
  outdir: 'dist',
  plugins: [sassPlugin()],
  format: 'esm',
  splitting: true,
  target: ['esnext'],
}).catch(() => process.exit(1))