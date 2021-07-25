const esbuild = require('esbuild');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');
const {sassPlugin} = require('esbuild-sass-plugin');

const clients = [];

esbuild.build({
  entryPoints: ['examples/index.jsx'],
  bundle: true,
  sourcemap: true,
  plugins: [sassPlugin()],
  minify: true,
  target: ['es2020'],
  outfile: path.resolve(__dirname, '../examples/out.js'),
  banner: { js: ' (() => new EventSource("/esbuild").onmessage = () => location.reload())();' },
  watch: {
    onRebuild(error, result) {
      clients.forEach((res) => res.write('data: update\n\n'))
      clients.length = 0
      console.log(error ? error : '...')
    },
  },
})
.catch(() => process.exit(1))

esbuild.serve({
    servedir: path.resolve(__dirname, '../examples'),
    port: 8000
}, {}).then(() => {
  http.createServer((req, res) => {
    const { url, method, headers } = req;
    if (req.url === '/esbuild')
      return clients.push(
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        })
      )
    const path = ~url.split('/').pop().indexOf('.') ? url : `/index.html` //for PWA with router
    req.pipe(
      http.request({ hostname: '0.0.0.0', port: 8000, path, method, headers }, (prxRes) => {
        res.writeHead(prxRes.statusCode, prxRes.headers)
        prxRes.pipe(res, { end: true })
      }),
      { end: true }
    )
  }).listen(8000)

  setTimeout(() => {
    const op = { darwin: ['open'], linux: ['xdg-open'], win32: ['cmd', '/c', 'start'] }
    const ptf = process.platform
    if (clients.length === 0) spawn(op[ptf][0], [...[op[ptf].slice(1)], `http://localhost:8000`])
  }, 1000) //open the default browser only if it is not opened yet
})