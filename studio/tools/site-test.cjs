// Browser test for the studio site: offer switch, countdown, prices, WhatsApp links, slider, form, menu, sticky bar.
// Needs Playwright (`npm i -g playwright` or any global install) and a local server on the repo root:
//   npx serve -l 4173 .            (from the repository root, in another terminal)
//   node studio/tools/site-test.cjs [http://localhost:4173]
// The browser clock is set with Playwright's clock API, so the end date in config.js is tested as it is.
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:4173';
const PAGES = ['/studio/', '/studio/esempi', '/studio/prezzi', '/studio/come-funziona'];

let fails = 0;
const ok = (cond, msg) => { console.log(`${cond ? '  ok  ' : '  FAIL'} ${msg}`); if (!cond) fails++; };

async function open(browser, path, time, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 740 }, reducedMotion: 'reduce', ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  if (time) await page.clock.install({ time: new Date(time) });
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  return { page, ctx, errors };
}
const visible = (page, sel) => page.locator(sel).first().isVisible();
const norm = (t) => t.replace(/[\s\u00a0\u202f]+/g, ' ').trim(); // Intl puts a no-break space before €
const texts = async (page, sel) => (await page.$$eval(sel, (els) => els.filter((e) => e.offsetParent !== null).map((e) => e.textContent))).map(norm);

(async () => {
  const browser = await chromium.launch();

  console.log('\n# Offer running (2026-11-22 10:00 Rome)');
  for (const path of PAGES) {
    const { page, ctx, errors } = await open(browser, path, '2026-11-22T10:00:00+01:00');
    ok(await page.getAttribute('html', 'data-offer') === 'on', `${path}: data-offer=on`);
    ok(await visible(page, '.promo'), `${path}: banner visible`);
    const cd = await page.textContent('.promo [data-cd-text]');
    ok(cd === '8g 13h 59m', `${path}: banner countdown "${cd}" (expected 8g 13h 59m to 30/11 23:59)`);
    ok(errors.length === 0, `${path}: no JS errors ${errors.join(' | ')}`);
    await ctx.close();
  }
  {
    const { page, ctx } = await open(browser, '/studio/prezzi', '2026-11-22T10:00:00+01:00');
    const prices = await texts(page, '.plans .price');
    ok(prices.join(',') === '249 €,119 €,349 €', `prezzi: offer prices ${prices}`);
    const struck = await texts(page, '.plans del');
    ok(struck.join(',') === '349 €,149 €,449 €', `prezzi: struck regular prices ${struck}`);
    ok(await visible(page, '.deadline'), 'prezzi: deadline box visible');
    const box = await page.$$eval('[data-cd-box] [data-u]', (e) => e.map((x) => x.textContent));
    ok(box.join(' ') === '8 13 59', `prezzi: countdown boxes ${box}`);
    const href = await page.getAttribute('[data-wa="vis"]', 'href');
    ok(norm(decodeURIComponent(href)).includes('Visibilità (249 €)'), 'prezzi: Visibilità WhatsApp message has the offer price');
    ok(href.startsWith('https://wa.me/39'), 'WhatsApp number has the 39 country code');
    const sr = await page.textContent('.deadline .sr-only [lang="it"]');
    ok(/30 novembre alle 23:59/.test(sr), `prezzi: readable end text "${sr.trim()}"`);
    // the clock ticks: one minute later the countdown moves, and nothing else changes
    await page.clock.runFor(60_000);
    ok(await page.textContent('[data-cd-box] [data-u="m"]') === '58', 'countdown ticks once a minute');
    // reload gives the same countdown (no per-visitor reset)
    await page.reload({ waitUntil: 'networkidle' });
    ok(await page.textContent('[data-cd-box] [data-u="m"]') === '58', 'same countdown after reload');
    await ctx.close();
  }
  {
    // a visitor whose phone is set to another time zone sees the same end moment
    const { page, ctx } = await open(browser, '/studio/prezzi', '2026-11-22T10:00:00+01:00', { timezoneId: 'America/New_York' });
    const box = await page.$$eval('[data-cd-box] [data-u]', (e) => e.map((x) => x.textContent));
    ok(box.join(' ') === '8 13 59', `time zone independent countdown (New York phone): ${box}`);
    await ctx.close();
  }

  console.log('\n# Offer crossing its end while the page is open');
  {
    const { page, ctx } = await open(browser, '/studio/', '2026-11-30T23:58:30+01:00');
    ok(await page.getAttribute('html', 'data-offer') === 'on', 'on at 23:58:30');
    await page.clock.runFor(31_000);
    ok(await page.getAttribute('html', 'data-offer') === 'off', 'switches off at 23:59:00 without reload');
    ok(!(await visible(page, '.promo')), 'banner hidden after the end');
    const prices = await texts(page, '.plans .price');
    ok(prices.join(',') === '349 €,149 €,449 €', `home: regular prices ${prices}`);
    await ctx.close();
  }

  console.log('\n# After the end (2026-12-01 09:00 Rome)');
  for (const path of PAGES) {
    const { page, ctx, errors } = await open(browser, path, '2026-12-01T09:00:00+01:00');
    ok(await page.getAttribute('html', 'data-offer') === 'off', `${path}: data-offer=off`);
    ok(!(await visible(page, '.promo')), `${path}: no banner`);
    ok(await page.locator('del:visible').count() === 0, `${path}: no struck prices`);
    ok(await page.locator('.deadline:visible, .offer-tag:visible').count() === 0, `${path}: no countdown or offer label`);
    const body = await page.evaluate(() => document.body.innerText);
    ok(!/Black Friday/i.test(body), `${path}: no visible "Black Friday" text`);
    ok(errors.length === 0, `${path}: no JS errors ${errors.join(' | ')}`);
    await ctx.close();
  }
  {
    const { page, ctx } = await open(browser, '/studio/prezzi', '2026-12-01T09:00:00+01:00');
    const prices = await texts(page, '.plans .price');
    ok(prices.join(',') === '349 €,149 €,449 €', `prezzi: regular prices ${prices}`);
    const cmp = await texts(page, '.cmp thead small');
    ok(cmp.join(',') === '149 €,349 €,449 €', `prezzi: comparison table header ${cmp}`);
    const href = decodeURIComponent(await page.getAttribute('[data-wa="photo"]', 'href'));
    ok(norm(href).includes('Foto dei piatti (149 €)'), 'WhatsApp message uses the regular price');
    ok(norm(await page.textContent('[data-calc] [data-out="vis"]')) === '349 €', 'calculator uses the regular Visibilità price');
    await ctx.close();
  }

  console.log('\n# Interactions (home, 375 px)');
  {
    const { page, ctx } = await open(browser, '/studio/', '2026-11-22T10:00:00+01:00');
    const box = page.locator('#prima-dopo [data-ba]');
    const bb = await box.boundingBox();
    await page.mouse.move(bb.x + bb.width * 0.5, bb.y + bb.height / 2);
    await page.mouse.down();
    await page.mouse.move(bb.x + bb.width * 0.2, bb.y + bb.height / 2, { steps: 5 });
    await page.mouse.up();
    const pos = await box.evaluate((el) => el.style.getPropertyValue('--pos'));
    ok(Math.abs(parseFloat(pos) - 20) < 2, `slider drags with the pointer (--pos ${pos})`);
    await page.focus('#prima-dopo input[type=range]');
    await page.keyboard.press('ArrowRight');
    ok(Math.abs(parseFloat(await box.evaluate((el) => el.style.getPropertyValue('--pos'))) - 21) < 2, 'slider moves with the keyboard');

    ok(!(await page.locator('.stickybar.show').count()), 'sticky bar hidden on the hero');
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(300);
    ok(await page.locator('.stickybar.show').count() === 1, 'sticky bar visible after the hero');
    await page.locator('#analisi').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    ok(!(await page.locator('.stickybar.show').count()), 'sticky bar hidden over the final CTA');

    await ctx.route('https://wa.me/**', (r) => r.fulfill({ body: 'stub' })); // don't leave the test machine
    await page.fill('[data-wa-form] [name=locale]', 'Trattoria da Gino');
    await page.fill('[data-wa-form] [name=link]', 'https://deliveroo.it/menu/torino/gino');
    const [popup] = await Promise.all([ctx.waitForEvent('page'), page.click('[data-wa-form] button[type=submit]')]);
    await popup.waitForLoadState();
    const url = decodeURIComponent(popup.url());
    ok(url.includes('wa.me/393445034591') && url.includes('Locale: Trattoria da Gino') && url.includes('deliveroo.it/menu/torino/gino'),
      'mini form opens WhatsApp with name and link');
    await popup.close();

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('.burger');
    ok(await page.locator('#nav.open').isVisible(), 'hamburger opens the menu');
    await page.keyboard.press('Escape');
    ok(!(await page.locator('#nav.open').count()), 'Esc closes the menu');

    await page.click('[data-set-lang="en"]');
    ok((await page.textContent('h1')).includes('More customers'), 'EN toggle switches the copy');
    ok((await page.textContent('.promo [data-cd-text]')).includes('d '), 'countdown in English units');
    ok(norm(decodeURIComponent(await page.getAttribute('[data-wa="vis"]', 'href'))).includes('Visibility package (€249)'), 'EN WhatsApp message');
    await ctx.close();
  }
  {
    const { page, ctx } = await open(browser, '/studio/prezzi', '2026-11-22T10:00:00+01:00');
    await page.locator('#c-orders').fill('500');
    await page.locator('#c-aov').fill('20');
    const extra = norm(await page.textContent('[data-out="extra"]'));
    const days = (await page.textContent('[data-out="days"]')).trim();
    ok(extra === '1200 €' || extra === '1.200 €', `calculator 500 × 20 € × 12% = ${extra}`);
    ok(days === '7', `pays for itself in ${days} days (249 / (1200/30) → 7)`);
    await ctx.close();
  }

  await browser.close();
  console.log(fails ? `\n${fails} FAILED` : '\nAll passed.');
  process.exit(fails ? 1 : 0);
})();
