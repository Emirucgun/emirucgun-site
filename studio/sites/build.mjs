// Builds every restaurant website from its data file:   node studio/sites/build.mjs
//
//   studio/sites/demos/<slug>.js      → studio/demo/<slug>/       (fictional concept demos, noindex)
//   studio/sites/anteprime/<slug>.js  → studio/anteprima/<slug>/  (private previews, noindex + nofollow)
//   files whose name starts with "_" are templates and are skipped.
//
// Each site gets four static pages: home + menu, in Italian and English. Like the rest of the studio
// site, the generated HTML is committed and Vercel serves it as-is (no build step on Vercel).
// Before writing anything it checks: the menu (same rules as the menu demo's check.mjs), the site
// fields, and the theme's text contrast. Errors stop the build; warnings are printed.
// Photos: missing photo slots get a placeholder and every .jpg gets WebP sizes (photos.py, needs Pillow).
//
// Options:  node studio/sites/build.mjs anteprime/da-gino.js   build only that data file

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, basename, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import vm from 'node:vm';
import { renderSite } from './render.mjs';
import { checkMenu } from '../demo/menu/check-lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const STUDIO = join(HERE, '..');
const REPO = join(STUDIO, '..');
const ORIGIN = 'https://studio.emirucgun.com';

// the studio's WhatsApp number, for the "Vi piace? Scrivetemi" link on previews
const sandbox = { window: {}, document: { documentElement: { setAttribute() {} } }, Date, Intl };
vm.runInNewContext(readFileSync(join(STUDIO, 'config.js'), 'utf8'), sandbox);
const STUDIO_CFG = sandbox.window.STUDIO;

/* ---------- contrast ---------- */
const lum = (hex) => {
  const v = hex.replace('#', '').match(/../g).map((x) => parseInt(x, 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
};
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

function checkTheme(t, errors) {
  const c = t.colors;
  const pairs = [['text', 'bg'], ['muted', 'bg'], ['text', 'surface'], ['muted', 'surface'], ['onPrimary', 'primary'], ['primary', 'bg'], ['primary', 'surface'], ['onBand', 'band'], ['bg', 'text']];
  for (const [fg, bg] of pairs) {
    const r = contrast(c[fg], c[bg]);
    if (r < 4.5) errors.push(`theme ${t.name}: ${fg} on ${bg} is ${r.toFixed(2)}:1 (needs 4.5:1)`);
  }
  if (t.ornaments === 'ink' && contrast(c.muted, '#E7D7BC') < 4.5) errors.push(`theme ${t.name}: muted text on the wood band is too weak`);
}

/* ---------- site fields ---------- */
const loc = (v) => (typeof v === 'string' ? { it: v, en: v } : v || { it: '', en: '' });
function checkSite(site, errors, warnings) {
  const R = site.restaurant || {};
  const need = (cond, msg) => { if (!cond) errors.push(msg); };
  need(/^[a-z0-9-]+$/.test(site.slug || ''), `slug "${site.slug}": lowercase letters, digits and dashes only`);
  need(['demo', 'preview', 'client'].includes(site.kind), `kind must be 'demo', 'preview' or 'client'`);
  for (const k of ['name', 'phone', 'phoneDisplay', 'mapsUrl', 'mapsQuery', 'priceRange', 'timeZone']) need(typeof R[k] === 'string' && R[k].trim(), `restaurant.${k} is empty`);
  need(R.address?.street && /^\d{5}\s+\S/.test(R.address?.city || ''), `restaurant.address: street, and city as "10124 Torino"`);
  for (const k of ['cuisine', 'intro', 'kicker']) { const v = loc(R[k]); need(v.it?.trim() && v.en?.trim(), `restaurant.${k}: Italian and English text`); }
  need(R.story?.paragraphs?.length, 'restaurant.story: at least one paragraph');
  need(R.highlights?.length === 3, 'restaurant.highlights: exactly three');
  need(R.signature?.length === 3, 'restaurant.signature: three dish ids');
  const ids = new Set((site.categories || []).flatMap((c) => c.dishes.map((d) => d.id)));
  for (const id of R.signature || []) need(ids.has(id), `restaurant.signature: no dish with id "${id}"`);
  for (const k of ['hero', 'story']) {
    const p = R.photos?.[k];
    need(p?.src?.startsWith('/') && /\.jpe?g$/i.test(p.src), `restaurant.photos.${k}.src: an absolute path to a .jpg`);
    need(p?.width > 0 && p?.height > 0, `restaurant.photos.${k}: width and height`);
    const a = loc(p?.alt); need(a.it?.trim() && a.en?.trim(), `restaurant.photos.${k}.alt: Italian and English`);
  }
  if (R.whatsapp && !/^\d{10,15}$/.test(R.whatsapp)) errors.push('restaurant.whatsapp: digits only, with the country code (39…)');
  if (!R.whatsapp && !R.booking) warnings.push('no WhatsApp and no booking link: the booking buttons will call the phone');
  if (site.kind === 'client' && !site.origin) errors.push("kind 'client' needs origin (the site's public address)");
}

/* ---------- photos ---------- */
function photoSlots(site, theme) {
  const R = site.restaurant;
  const c = theme.colors;
  const slots = [R.photos.hero, R.photos.story].map((p) => ({ src: p.src, width: p.width, height: p.height }));
  for (const cat of site.categories) for (const d of cat.dishes) if (d.photo) slots.push({ src: d.photo, width: 1200, height: 1200 });
  return slots.map((s) => ({ ...s, bg: c.surface, fg: c.muted }));
}

function picture(p, l, sizes, opts = {}) {
  const base = p.src.replace(/\.jpe?g$/i, '');
  const widths = [480, 960].filter((w) => existsSync(join(REPO, `${base}-${w}.webp`)));
  const alt = typeof p.alt === 'string' ? p.alt : p.alt[l];
  const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);
  const load = opts.priority ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';
  return `<picture>${widths.length ? `<source type="image/webp" srcset="${widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ')}" sizes="${sizes}">` : ''}`
    + `<img src="${p.src}" width="${p.width}" height="${p.height}" alt="${esc(alt)}" ${load}></picture>`;
}

/* ---------- CSS ---------- */
const minify = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}').trim();
const BASE_CSS = readFileSync(join(HERE, 'site.css'), 'utf8');
function themeCss(t) {
  const c = t.colors, F = t.fonts;
  const faces = F.faces.map((x) => `@font-face{font-family:'${x.family}';font-style:${x.style || 'normal'};font-weight:${x.weight};font-display:swap;src:url(${x.src}) format('woff2')}`).join('');
  return faces + `:root{--bg:${c.bg};--surface:${c.surface};--text:${c.text};--muted:${c.muted};--primary:${c.primary};--on-primary:${c.onPrimary};`
    + `--accent:${c.accent};--accent2:${c.accent2};--line:${c.line};--band:${c.band};--on-band:${c.onBand};--display:${F.display};--body:${F.body};`
    + `--dw:${F.displayWeight};--dcase:${F.displayCase || 'none'};--dtrack:${F.displayTracking || '0'};--r:${t.radius}px;color-scheme:light}`;
}

/* ---------- run ---------- */
const only = process.argv.slice(2);
const jobs = only.length
  ? only.map((f) => resolve(HERE, f))
  : ['demos', 'anteprime'].flatMap((dir) => (existsSync(join(HERE, dir)) ? readdirSync(join(HERE, dir)) : [])
    .filter((f) => f.endsWith('.js') && !f.startsWith('_')).map((f) => join(HERE, dir, f)));

// showWebsiteDemos: false in config.js → the concept demos aren't built and any built copy is removed,
// so /demo/<slug> returns 404. Their data files stay in demos/, ready to switch back on.
if (STUDIO_CFG.showWebsiteDemos !== true) {
  for (const f of existsSync(join(HERE, 'demos')) ? readdirSync(join(HERE, 'demos')) : []) {
    if (!f.endsWith('.js') || f.startsWith('_')) continue;
    const out = join(STUDIO, 'demo', f.replace(/\.js$/, ''));
    if (existsSync(out)) { rmSync(out, { recursive: true, force: true }); console.log(`removed ${join('studio', 'demo', basename(out))}/ (showWebsiteDemos is false)`); }
  }
}
const hidden = (file) => STUDIO_CFG.showWebsiteDemos !== true && basename(dirname(file)) === 'demos';

let failed = false;
for (const file of jobs) {
  if (hidden(file)) { console.log(`${basename(file)}: skipped (showWebsiteDemos is false in studio/config.js)`); continue; }
  const site = (await import(pathToFileURL(file).href + `?t=${Date.now()}`)).default;
  const theme = typeof site.theme === 'string' ? (await import(pathToFileURL(join(HERE, 'themes', `${site.theme}.js`)).href)).default : site.theme;
  const errors = [], warnings = [];
  checkSite(site, errors, warnings);
  if (!theme) errors.push(`theme "${site.theme}" not found in studio/sites/themes/`);
  else checkTheme(theme, errors);
  if (!errors.length) {
    const m = checkMenu({ restaurant: site.restaurant, categories: site.categories });
    errors.push(...m.errors); warnings.push(...m.warnings);
  }
  console.log(`${basename(file)} (${site.kind}, theme ${theme?.name})`);
  for (const w of warnings) console.log(`  warning  ${w}`);
  for (const e of errors) console.log(`  ERROR    ${e}`);
  if (errors.length) { failed = true; continue; }

  // photos: placeholders for missing slots + WebP sizes
  const manifest = join(tmpdir(), `sites-photos-${site.slug}.json`);
  writeFileSync(manifest, JSON.stringify(photoSlots(site, theme)));
  const py = spawnSync('python3', [join(HERE, 'photos.py'), manifest], { stdio: 'inherit' });
  if (py.status !== 0) console.log('  warning  photos.py did not run (Python + Pillow needed): pages will use the .jpg files only');

  const folder = site.kind === 'demo' ? 'demo' : site.kind === 'preview' ? 'anteprima' : 'sites/out';
  const out = join(STUDIO, folder, site.slug);
  const ctx = {
    css: minify(themeCss(theme) + BASE_CSS),
    base: site.kind === 'client' ? '' : `/studio/${folder}/${site.slug}`,
    publicBase: site.kind === 'client' ? '' : `/${folder}/${site.slug}`,
    origin: site.kind === 'client' ? site.origin.replace(/\/$/, '') : ORIGIN,
    studio: { whatsapp: STUDIO_CFG.whatsapp },
    picture,
    photoUrl: (src) => src
  };
  const pages = renderSite(site, theme, ctx);
  for (const sub of ['en', 'menu']) rmSync(join(out, sub), { recursive: true, force: true });
  for (const p of pages) {
    const dir = join(out, p.path);
    mkdirSync(dir, { recursive: true });
    const html = p.html.replace(/<style>([\s\S]*?)<\/style>/, (_, c) => `<style>${minify(c)}</style>`);
    writeFileSync(join(dir, 'index.html'), html);
    console.log(`  wrote ${join('studio', folder, site.slug, p.path, 'index.html')} (${(html.length / 1024).toFixed(1)} KB)`);
  }
}
if (failed) { console.log('Some sites have errors: nothing was written for them.'); process.exit(1); }
