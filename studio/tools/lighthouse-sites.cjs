// Lighthouse (mobile) for the restaurant websites, with its own static server.
//   node studio/tools/lighthouse-sites.cjs [path …]      default: the Indian demo, home and menu
// Uses `npx lighthouse` (or LIGHTHOUSE_BIN=/path/to/lighthouse) and the Chromium that Playwright installed (or CHROME_PATH).
// Note: demos are noindex on purpose, so Lighthouse's SEO score flags "page is blocked from indexing";
// the script also reports SEO with that one audit set aside, i.e. what a real client's site gets.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
// async on purpose: a sync spawn would block this process, and with it the static server Lighthouse is loading
const run = (cmd, args, opts) => new Promise((ok) => { const c = spawn(cmd, args, opts); const t = setTimeout(() => c.kill(), 180000); c.on('close', (status) => { clearTimeout(t); ok({ status }); }); });
const { start } = require('./static-server.cjs');

const PORT = 4176;
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['/studio/demo/ristorante-indiano', '/studio/demo/ristorante-indiano/menu'];
const chrome = process.env.CHROME_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : require('playwright').chromium.executablePath());

(async () => {
  const server = await start(PORT);
  const rows = [];
  for (const p of pages) {
    const out = path.join(os.tmpdir(), `lh-${p.replace(/\W+/g, '-')}.json`);
    const bin = process.env.LIGHTHOUSE_BIN ? [process.env.LIGHTHOUSE_BIN] : ['npx', '-y', 'lighthouse@12'];
    const r = await run(bin[0], [...bin.slice(1), `http://127.0.0.1:${PORT}${p}`, '--quiet', '--output=json', `--output-path=${out}`,
      '--only-categories=performance,accessibility,best-practices,seo', `--chrome-flags=--headless=new --no-sandbox`],
    { stdio: ['ignore', 'ignore', 'inherit'], env: { ...process.env, CHROME_PATH: chrome } });
    if (r.status !== 0 || !fs.existsSync(out)) { console.log(`${p}: lighthouse failed`); continue; }
    const j = JSON.parse(fs.readFileSync(out, 'utf8'));
    const c = j.categories;
    const score = (k) => Math.round(c[k].score * 100);
    // SEO without the "is-crawlable" audit (the demo's deliberate noindex)
    const seoRefs = c.seo.auditRefs.filter((a) => a.weight > 0 && a.id !== 'is-crawlable');
    const seoNoIndex = Math.round(100 * seoRefs.reduce((s, a) => s + a.weight * (j.audits[a.id].score ?? 1), 0) / seoRefs.reduce((s, a) => s + a.weight, 0));
    const m = (id) => j.audits[id].displayValue;
    rows.push({ page: p, perf: score('performance'), a11y: score('accessibility'), bp: score('best-practices'), seo: score('seo'), seoNoIndex, lcp: m('largest-contentful-paint'), cls: m('cumulative-layout-shift'), tbt: m('total-blocking-time') });
    const failing = Object.values(j.audits).filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode === 'binary').map((a) => a.id);
    if (failing.length) console.log(`${p}: failing audits: ${failing.join(', ')}`);
  }
  server.close();
  console.table(rows);
})();
