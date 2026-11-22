// Tiny static server for local tests, with Vercel-style clean URLs (/studio/prezzi → prezzi/index.html).
// Used by sites-test.cjs and lighthouse-sites.cjs so they need nothing running beforehand.
//   const { start } = require('./static-server.cjs'); const srv = await start(4174); … srv.close();
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml' };

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/\/+$/, '') || '/';
  const base = path.join(ROOT, path.normalize(clean).replace(/^(\.\.[/\\])+/, ''));
  for (const f of [base, `${base}.html`, path.join(base, 'index.html')]) {
    try { if (fs.statSync(f).isFile()) return f; } catch { /* next */ }
  }
  return null;
}

function start(port = 4174) {
  const server = http.createServer((req, res) => {
    const file = resolve(req.url || '/');
    if (!file) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((ok) => server.listen(port, '127.0.0.1', () => ok(server)));
}

module.exports = { start, ROOT };
