// Runs site-test.cjs against the built-in static server (no `npx serve` needed):
//   node studio/tools/run-site-test.cjs
const { spawn } = require('node:child_process');
const path = require('node:path');
const { start } = require('./static-server.cjs');

(async () => {
  const server = await start(4173);
  const child = spawn(process.execPath, [path.join(__dirname, 'site-test.cjs'), 'http://127.0.0.1:4173'], { stdio: 'inherit' });
  child.on('close', (code) => { server.close(); process.exit(code ?? 1); });
})();
