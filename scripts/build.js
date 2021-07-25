const {sassPlugin} = require('esbuild-sass-plugin');

require('esbuild').build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outdir: 'dist',
  plugins: [sassPlugin()],
}).catch(() => process.exit(1))