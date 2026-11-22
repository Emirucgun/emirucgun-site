// Phone screenshots of the three concept websites, for the "Siti web" section of /esempi.
//   node studio/tools/sites-screens.cjs
// Run it again after replacing the placeholder photos in studio/demo/<cuisine>/ (and rebuilding with
// node studio/sites/build.mjs), so /esempi shows the real dishes. Writes studio/img/sites/<slug>-<w>.webp
// (360 and 720 px wide). Starts its own static server; needs Playwright and Pillow.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');
const { start, ROOT } = require('./static-server.cjs');

const SLUGS = ['ristorante-indiano', 'ristorante-giapponese', 'ristorante-messicano'];
const OUT = path.join(ROOT, 'studio', 'img', 'sites');
const PORT = 4175;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await start(PORT);
  const browser = await chromium.launch();
  // an iPhone-sized viewport at 3x: the frame shows the top of the home page, as a visitor sees it
  const ctx = await browser.newContext({ viewport: { width: 375, height: 760 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  for (const slug of SLUGS) {
    const page = await ctx.newPage();
    await page.goto(`http://127.0.0.1:${PORT}/studio/demo/${slug}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const png = path.join(OUT, `${slug}.png`);
    await page.screenshot({ path: png });
    await page.close();
    // 1125 px wide original → 360 / 720 px WebP (the frame is at most 240 css px wide)
    execFileSync('python3', ['-c', `
from PIL import Image
im = Image.open(${JSON.stringify(png)}).convert('RGB')
for w in (360, 720):
    im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(${JSON.stringify(path.join(OUT, slug))} + f'-{w}.webp', 'WEBP', quality=80, method=6)
`]);
    fs.unlinkSync(png);
    console.log('wrote', path.relative(ROOT, path.join(OUT, `${slug}-360.webp`)), '+ 720');
  }
  await browser.close();
  server.close();
})();
