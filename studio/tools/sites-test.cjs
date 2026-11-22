// Browser test for the restaurant websites (studio/sites) and the studio pages that link to them.
//   node studio/tools/sites-test.cjs                 run the checks
//   node studio/tools/sites-test.cjs --shots <dir>   …and save full-page screenshots at 375 and 1280 px
// Starts its own static server (static-server.cjs); needs Playwright (preinstalled or `npm i -D playwright`).
// Checks, at 375 px and 1280 px: no console errors, no horizontal scroll, one h1, images load,
// robots meta right for the page kind, JSON-LD parses, demo buttons show their note, IT ⇄ EN links.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { start, ROOT } = require('./static-server.cjs');

const PORT = 4174;
const BASE = `http://127.0.0.1:${PORT}`;
const shotsIdx = process.argv.indexOf('--shots');
const SHOTS = shotsIdx > -1 ? path.resolve(process.argv[shotsIdx + 1]) : null;
const WIDTHS = [375, 1280];

const sitePages = [];
for (const [folder, kind] of [['demo', 'demo'], ['anteprima', 'preview']]) {
  const dir = path.join(ROOT, 'studio', folder);
  if (!fs.existsSync(dir)) continue;
  for (const slug of fs.readdirSync(dir)) {
    if (!fs.existsSync(path.join(dir, slug, 'menu', 'index.html'))) continue; // only template sites
    for (const p of ['', '/en', '/menu', '/en/menu']) sitePages.push({ url: `/studio/${folder}/${slug}${p}`, kind });
  }
}
const studioPages = ['/studio', '/studio/prezzi', '/studio/esempi', '/studio/come-funziona', '/studio/demo/menu', '/studio/prezzi?lang=en'].map((url) => ({ url, kind: 'studio' }));

(async () => {
  const server = await start(PORT);
  const browser = await chromium.launch();
  const errors = [];
  let checks = 0;
  const fail = (page, msg) => errors.push(`${page}: ${msg}`);
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

  for (const width of WIDTHS) {
    // isMobile: like a real phone, the page is laid out wider (and zoomed out) if anything overflows,
    // so innerWidth must stay equal to the screen width
    const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 812 : 800 }, deviceScaleFactor: 1, isMobile: width < 600, hasTouch: width < 600 });
    for (const { url, kind } of [...sitePages, ...studioPages]) {
      const page = await ctx.newPage();
      const logs = [];
      page.on('console', (m) => { if (m.type() === 'error') logs.push(m.text()); });
      page.on('pageerror', (e) => logs.push(String(e)));
      page.on('requestfailed', (r) => { if (!r.url().startsWith(BASE)) return; logs.push(`request failed ${r.url()}`); });
      page.on('response', (r) => { if (r.url().startsWith(BASE) && r.status() >= 400) logs.push(`${r.status()} ${r.url()}`); });
      const where = `${url} @${width}`;
      await page.goto(BASE + url, { waitUntil: 'load' });
      // let lazy images load, then come back up
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
      await page.waitForTimeout(250);
      const info = await page.evaluate(() => ({
        overflow: Math.max(document.documentElement.scrollWidth, innerWidth) - screen.width,
        h1: document.querySelectorAll('h1').length,
        lang: document.documentElement.lang,
        robots: document.querySelector('meta[name="robots"]')?.content || '',
        ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { return JSON.parse(s.textContent)['@type']; } catch { return 'INVALID'; } }),
        broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map((i) => i.currentSrc || i.src),
        banner: document.querySelector('.banner')?.textContent || ''
      }));
      checks++;
      if (logs.length) fail(where, `console: ${logs.join(' | ')}`);
      if (info.overflow > 0) fail(where, `horizontal scroll (${info.overflow}px wider than the screen)`);
      if (info.h1 !== 1) fail(where, `${info.h1} h1 elements`);
      if (info.broken.length) fail(where, `broken images: ${info.broken.join(', ')}`);
      if (kind !== 'studio') {
        const en = url.includes('/en');
        if (info.lang !== (en ? 'en' : 'it')) fail(where, `lang="${info.lang}"`);
        if (kind === 'demo' && info.robots !== 'noindex') fail(where, `robots "${info.robots}" (demo must be noindex)`);
        if (kind === 'preview' && info.robots !== 'noindex, nofollow') fail(where, `robots "${info.robots}" (preview must be noindex, nofollow)`);
        if (info.ld.length !== 1 || info.ld[0] === 'INVALID') fail(where, `JSON-LD: ${info.ld.join(',') || 'none'}`);
        if (kind === 'demo' && !/inventato|fictional/.test(info.banner)) fail(where, 'demo banner missing');
        if (kind === 'preview' && !/Anteprima riservata per|Private preview for/.test(info.banner)) fail(where, 'preview banner missing');
        // language link points to the other language of the same page
        const other = await page.getAttribute('.lang', 'href');
        const expected = en ? url.replace('/en', '') : url.replace(/(\/studio\/[^/]+\/[^/]+)/, '$1/en');
        if (other !== expected) fail(where, `language link ${other}, expected ${expected}`);
        // demo buttons explain themselves
        if (kind === 'demo' && !url.includes('menu')) {
          const btn = page.locator(width < 600 ? '.actionbar [data-demo-note]' : '.hero [data-demo-note]').first();
          await btn.click();
          const t = await page.locator('.toast.show').textContent({ timeout: 2000 }).catch(() => '');
          if (!/Demo/.test(t || '')) fail(where, 'demo note did not appear');
        }
        if (!url.includes('menu')) {
          const status = await page.locator('.status').isVisible();
          if (!status) fail(where, 'open/closed status not shown');
        }
      }
      if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${url.replace(/^\/studio\/?/, '').replace(/\//g, '_') || 'home'}-${width}.png`), fullPage: true });
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  server.close();
  for (const e of errors) console.log('  FAIL ', e);
  console.log(errors.length ? `${errors.length} problem(s) in ${checks} page loads.` : `OK: ${checks} page loads (${WIDTHS.join(' and ')} px).`);
  process.exit(errors.length ? 1 : 0);
})();
