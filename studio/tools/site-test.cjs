// Browser test for the studio site: no leftover offer, prices, packages, WhatsApp links, slider, form, menu, sticky bar.
// Needs Playwright (`npm i -g playwright` or any global install) and a local server on the repo root:
//   npx serve -l 4173 .            (from the repository root, in another terminal)
//   or, with no server running:  node studio/tools/run-site-test.cjs
//   node studio/tools/site-test.cjs [http://localhost:4173]
// The browser clock is set with Playwright's clock API where a date matters.
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
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
  if (time) await page.clock.install({ time: new Date(time) });
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  return { page, ctx, errors };
}
const visible = (page, sel) => page.locator(sel).first().isVisible();
const norm = (t) => t.replace(/[\s\u00a0\u202f]+/g, ' ').trim(); // Intl puts a no-break space before €
const texts = async (page, sel) => (await page.$$eval(sel, (els) => els.filter((e) => e.offsetParent !== null).map((e) => e.textContent))).map(norm);

(async () => {
  const browser = await chromium.launch();

  // config.js has `offer: null`: whatever the date, no banner, countdown, struck price, offer label or badge.
  for (const [label, time] of [['before 30 November', '2026-11-22T10:00:00+01:00'], ['after 30 November', '2026-12-01T09:00:00+01:00']]) {
    console.log(`\n# No offer (config offer: null), ${label}`);
    for (const path of PAGES) {
      const { page, ctx, errors } = await open(browser, path, time);
      ok(await page.getAttribute('html', 'data-offer') === 'off', `${path}: data-offer=off`);
      ok(await page.locator('.promo, .deadline, .offer-tag, .badge, del, [data-cd-text], [data-cd-box]').count() === 0, `${path}: no banner, countdown, offer label, badge or struck price in the page`);
      for (const l of ['it', 'en']) {
        if (l === 'en') await page.click('[data-set-lang="en"]');
        const body = await page.evaluate(() => document.body.innerText);
        ok(!/Black Friday|invece di|instead of|più richiesto|most popular/i.test(body), `${path} (${l}): no offer or "most popular" copy`);
        // every price element shows a price: nothing left empty
        const empty = await page.$$eval('[data-price]', (els) => els.filter((e) => !/\d/.test(e.textContent)).length);
        ok(empty === 0, `${path} (${l}): no empty price elements`);
      }
      ok(errors.length === 0, `${path}: no JS errors or warnings ${errors.join(' | ')}`);
      await ctx.close();
    }
  }
  {
    const { page, ctx } = await open(browser, '/studio/');
    const prices = await texts(page, '.plans .price');
    ok(prices.join(',') === '79 €,349 €,599 €', `home: three packages, Prova first ${prices}`);
    ok(await page.locator('.plans .plan').count() === 3, 'home: at most 3 package cards');
    ok(await page.locator('.plans .plan').first().evaluate((el) => el.classList.contains('plan-pop') && el.classList.contains('p-trial')), 'home: Prova is the featured card');
    ok(await page.locator('.plans-foot a[href$="/prezzi"]').count() === 1, 'home: one "Tutti i pacchetti" link');
    const href = decodeURIComponent(await page.getAttribute('.plans [data-wa="trial"]', 'href'));
    ok(norm(href).includes('pacchetto Prova (79 €)'), 'home: Prova WhatsApp message');
    ok(href.startsWith('https://wa.me/39'), 'WhatsApp number has the 39 country code');
    await ctx.close();
  }
  {
    const { page, ctx } = await open(browser, '/studio/prezzi');
    const prices = await texts(page, '.plans .price');
    ok(prices.join(',') === '79 €,849 €,599 €,349 €,149 €,449 €', `prezzi: one price per package, Prova first ${prices}`);
    const first = await page.locator('.plans .plan').first().getAttribute('class');
    ok(/p-trial/.test(first), 'prezzi: Prova is the first card');
    const cmp = await texts(page, '.cmp thead small');
    ok(cmp.join(',') === '79 €,149 €,349 €,449 €,599 €,849 €', `prezzi: comparison table header ${cmp}`);
    const cols = await page.$$eval('.cmp tr', (rows) => rows.map((r) => r.children.length));
    ok(cols.every((n) => n === 7), `prezzi: every table row has 7 cells (${[...new Set(cols)]})`);
    const href = decodeURIComponent(await page.getAttribute('[data-wa="photo"]', 'href'));
    ok(norm(href).includes('Foto dei piatti (149 €)'), 'WhatsApp message uses the config price');
    ok(norm(await page.textContent('[data-calc] [data-out="vis"]')) === '349 €', 'calculator uses the Visibilità price');
    await ctx.close();
  }
  console.log('\n# Interactions (home, 375 px)');
  {
    const { page, ctx } = await open(browser, '/studio/');
    const box = page.locator('#prima-dopo [data-ba]');
    await box.scrollIntoViewIfNeeded(); // at 375 px the slider starts below the fold
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
    ok(norm(decodeURIComponent(await page.getAttribute('[data-wa="vis"]', 'href'))).includes('Visibility package (€349)'), 'EN WhatsApp message');
    await ctx.close();
  }
  {
    const { page, ctx } = await open(browser, '/studio/prezzi');
    await page.locator('#c-orders').fill('500');
    await page.locator('#c-aov').fill('20');
    const extra = norm(await page.textContent('[data-out="extra"]'));
    const days = (await page.textContent('[data-out="days"]')).trim();
    ok(extra === '1200 €' || extra === '1.200 €', `calculator 500 × 20 € × 12% = ${extra}`);
    ok(days === '9', `pays for itself in ${days} days (349 / (1200/30) → 9)`);
    await ctx.close();
  }


  console.log('\n# Before/after examples (before-after.js)');
  {
    // the real list: one example, so no dish tabs
    const { page, ctx, errors } = await open(browser, '/studio/');
    ok(await page.locator('.ba-tabs').count() === 0, 'one example: no dish tabs');
    ok(await page.locator('#prima-dopo [data-ba-meta]').isHidden(), 'no credit: the credit line stays hidden');
    ok(errors.length === 0, `no JS errors ${errors.join(' | ')}`);
    await ctx.close();
  }
  for (const path of ['/studio/', '/studio/esempi']) {
    // two examples (the second reuses the kebab files the other way round: only the mechanism is tested)
    const { page, ctx, errors } = await open(browser, path);
    await ctx.close();
    const c2 = await browser.newContext({ viewport: { width: 375, height: 740 }, reducedMotion: 'reduce' });
    await c2.route('**/studio/before-after.js', async (r) => {
      const file = require('node:path').join(__dirname, '..', 'before-after.js');
      const src = require('node:fs').readFileSync(file, 'utf8').replace(/\n\];\s*$/, `\n  ,
  { id: 'test', before: '/studio/img/dish-after', after: '/studio/img/dish-before', widths: [480, 800, 1200], width: 1200, height: 896,
    dish: { it: 'Piatto di prova', en: 'Test dish' }, credit: { it: 'Trattoria di prova, Torino', en: 'Test trattoria, Turin' },
    alt: { before: { it: 'Prima di prova', en: 'Test before' }, after: { it: 'Dopo di prova', en: 'Test after' } } }
];`);
      await r.fulfill({ contentType: 'text/javascript', body: src });
    });
    const p2 = await c2.newPage();
    const errs = [];
    p2.on('pageerror', (e) => errs.push(e.message));
    await p2.goto(BASE + path, { waitUntil: 'networkidle' });
    const fig = p2.locator('[data-ba-set]:not([data-ba-set="first"])').first();
    const tabs = fig.locator('[role="tab"]');
    ok(await tabs.count() === 2, `${path}: two examples → two dish tabs`);
    ok(await tabs.first().getAttribute('aria-selected') === 'true', `${path}: first tab selected`);
    await tabs.nth(1).click();
    ok(await tabs.nth(1).getAttribute('aria-selected') === 'true', `${path}: clicking the second tab selects it`);
    const imgs = await fig.locator('[data-ba] img').evaluateAll((els) => els.map((e) => e.getAttribute('src') + '|' + e.alt));
    ok(imgs[0] === '/studio/img/dish-after-800.webp|Prima di prova' && imgs[1] === '/studio/img/dish-before-800.webp|Dopo di prova', `${path}: images and alt swap (${imgs})`);
    const avif = await fig.locator('[data-ba] > picture source[type="image/avif"]').first().getAttribute('srcset');
    ok(avif.includes('/studio/img/dish-after-1200.avif 1200w'), `${path}: AVIF srcset swaps with every size`);
    ok(norm(await fig.locator('[data-ba-meta]').innerText()) === 'Trattoria di prova, Torino', `${path}: credit shown`);
    await tabs.nth(1).focus();
    await p2.keyboard.press('ArrowLeft');
    ok(await tabs.first().getAttribute('aria-selected') === 'true', `${path}: arrow keys move between dishes`);
    ok(await fig.locator('[data-ba-meta]').isHidden(), `${path}: no credit on the first example → hidden again`);
    await p2.click('[data-set-lang="en"]');
    ok(norm(await tabs.nth(1).innerText()) === 'Test dish', `${path}: tab names in English`);
    ok(await fig.locator('[data-ba] img').first().getAttribute('alt') === 'Before: the original photo of the dish, taken on a phone in the kitchen', `${path}: alt in English`);
    if (path === '/studio/esempi') ok(await p2.locator('.app [role="tab"]').count() === 0, '/studio/esempi: the delivery-app card keeps the first example, no tabs');
    ok(errs.length === 0 && errors.length === 0, `${path}: no JS errors ${errs.join(' | ')}`);
    await c2.close();
  }

  await browser.close();
  console.log(fails ? `\n${fails} FAILED` : '\nAll passed.');
  process.exit(fails ? 1 : 0);
})();
