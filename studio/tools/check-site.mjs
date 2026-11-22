// Static checks for the studio site (no browser needed):   node studio/tools/check-site.mjs
// - every price written in the HTML (the no-JavaScript fallback) matches config.js
// - every internal link and #anchor points to something that exists
// - no duplicate ids, every <img> has alt + width + height, no leftover forbidden copy
// - the WhatsApp fallback links use the number in config.js
// - with showWebsiteDemos false: the concept demos aren't built and no page links to them
// - private previews (/anteprima/…) are noindex, nofollow and never linked; sitemap has no demos or previews
// Exit code 1 on any error.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const STUDIO = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = join(STUDIO, '..');
const PAGES = ['index.html', 'esempi/index.html', 'prezzi/index.html', 'come-funziona/index.html'];

// load config.js the way the browser would
const sandbox = { window: {}, document: { documentElement: { setAttribute() {} } }, Date, Intl };
vm.runInNewContext(readFileSync(join(STUDIO, 'config.js'), 'utf8'), sandbox);
const C = sandbox.window.STUDIO;

const errors = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
const num = (t) => +t.replace(/[^\d,.]/g, '').replace(',', '.');

const html = Object.fromEntries(PAGES.map((p) => [p, readFileSync(join(STUDIO, p), 'utf8')]));
const ids = (src) => [...src.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const urlToFile = (path) => {
  const clean = path.replace(/^\/studio\/?/, '').replace(/\/$/, '');
  for (const f of clean === '' ? ['index.html'] : [`${clean}/index.html`, `${clean}.html`, clean]) {
    if (existsSync(join(STUDIO, f))) return f;
  }
  return null;
};

for (const [page, src] of Object.entries(html)) {
  // prices: offer price where the page shows "current", regular where it shows the struck price
  for (const m of src.matchAll(/data-price="(\w+)"[^>]*>([^<]*)</g)) {
    const p = C.prices[m[1]];
    if (!p) err(page, `unknown price key "${m[1]}"`);
    else if (num(m[2]) !== p.offer) err(page, `price ${m[1]} fallback "${m[2]}" ≠ config offer ${p.offer}`);
  }
  for (const m of src.matchAll(/data-price-regular="(\w+)"[^>]*>([^<]*)</g)) {
    const p = C.prices[m[1]];
    if (!p || num(m[2]) !== p.regular) err(page, `regular price ${m[1]} fallback "${m[2]}" ≠ config ${p && p.regular}`);
  }
  // no hard-coded euro amounts outside the price elements (they would not follow the offer switch)
  const stripped = src.replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<!--[\s\S]*?-->/g, '')
    .replace(/data-price(-regular|-offer)?="\w+"[^>]*>[^<]*</g, '').replace(/data-out="\w+"[^>]*>[^<]*</g, '');
  for (const m of stripped.matchAll(/>[^<]*?\d+\s?€[^<]*</g)) err(page, `hard-coded price outside a data-price element: ${m[0].slice(0, 80)}`);

  // forbidden leftovers
  for (const re of [/31 dicembre/i, /31 December/i, /prezzo di lancio/i, /launch price/i, /\bposti\b/i, /\bspots?\b/i, /solo \d+ /i])
    if (re.test(stripped)) err(page, `forbidden copy matches ${re}`);

  // ids
  const seen = new Set();
  for (const id of ids(src)) { if (seen.has(id)) err(page, `duplicate id "${id}"`); seen.add(id); }

  // images
  for (const m of src.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\salt="/.test(tag)) err(page, `img without alt: ${tag.slice(0, 80)}`);
    if (/\ssrc="/.test(tag) && (!/\swidth="/.test(tag) || !/\sheight="/.test(tag))) err(page, `img without width/height: ${tag.slice(0, 80)}`);
  }
  for (const m of src.matchAll(/(?:src|srcset)="([^"]+)"/g))
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u.startsWith('/') && !existsSync(join(REPO, u))) err(page, `missing file ${u}`);
    }

  // links and anchors
  for (const m of src.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (href.startsWith('#')) { if (href.length > 1 && !ids(src).includes(href.slice(1))) err(page, `anchor ${href} not found`); continue; }
    if (href.startsWith('https://wa.me/')) { if (!href.startsWith(`https://wa.me/${C.whatsapp}`)) err(page, `WhatsApp fallback ${href} ≠ config ${C.whatsapp}`); continue; }
    if (!href.startsWith('/studio')) continue;
    const [path, hash] = href.split('#');
    if (/\.(svg|png|jpg|webp|avif|css|js|woff2)$/.test(path)) { if (!existsSync(join(REPO, path))) err(page, `missing file ${path}`); continue; }
    const file = urlToFile(path);
    if (!file) { err(page, `broken link ${href}`); continue; }
    if (hash && html[file] && !ids(html[file]).includes(hash)) err(page, `link ${href}: #${hash} not found in ${file}`);
  }

  // every Italian span has its English twin (rough count)
  const it = (src.match(/<span lang="it">/g) || []).length, en = (src.match(/<span lang="en">/g) || []).length;
  if (it !== en) err(page, `${it} Italian spans vs ${en} English spans`);

  // meta
  if (!/<meta name="description" content="[^"]{50,}/.test(src)) err(page, 'missing or short meta description');
  if (!/<link rel="canonical"/.test(src)) err(page, 'missing canonical');
  if (!/property="og:title"/.test(src)) err(page, 'missing og:title');
}

// sitemap lists every page
const sitemap = readFileSync(join(STUDIO, 'sitemap.xml'), 'utf8');
for (const u of ['/', '/esempi', '/prezzi', '/come-funziona'])
  if (!sitemap.includes(`<loc>https://studio.emirucgun.com${u}</loc>`)) errors.push(`sitemap.xml: missing ${u}`);
if (/\/anteprima|\/demo\//.test(sitemap)) errors.push('sitemap.xml: demos and private previews must not be listed');

const walkAll = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.name.startsWith('.') || e.name === 'node_modules' ? [] : e.isDirectory() ? walkAll(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : []));

// hidden concept demos: nothing built, nothing links to them
if (C.showWebsiteDemos !== true) {
  const demos = readdirSync(join(STUDIO, 'sites', 'demos')).filter((f) => f.endsWith('.js') && !f.startsWith('_')).map((f) => f.replace(/\.js$/, ''));
  for (const slug of demos) if (existsSync(join(STUDIO, 'demo', slug))) errors.push(`studio/demo/${slug}/ exists but showWebsiteDemos is false: run node studio/sites/build.mjs`);
  const re = new RegExp(`(/demo/(${demos.join('|')})\\b|esempi#siti)`);
  for (const f of walkAll(REPO)) {
    const m = readFileSync(f, 'utf8').match(re);
    if (m) errors.push(`${f.slice(REPO.length + 1)}: links to a hidden website demo (${m[0]})`);
  }
}

// private previews (/anteprima/<slug>) are never linked from any other page of the site
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : []));
for (const f of walk(STUDIO)) {
  const rel = f.slice(STUDIO.length + 1);
  if (rel.startsWith('anteprima/')) {
    if (!/<meta name="robots" content="noindex, nofollow">/.test(readFileSync(f, 'utf8'))) errors.push(`${rel}: private preview without noindex, nofollow`);
    continue;
  }
  if (/href="[^"]*\/anteprima\//.test(readFileSync(f, 'utf8'))) errors.push(`${rel}: links to a private preview (/anteprima/…)`);
}

console.log(`Offer "${C.offer.name}" ends ${new Date(C.offer.endsAt).toISOString()} (${C.offer.ends} ${C.offer.timeZone})`);
console.log('Prices:', Object.entries(C.prices).map(([k, v]) => `${k} ${v.offer}/${v.regular}`).join(' · '));
for (const e of errors) console.log('  ERROR ', e);
console.log(errors.length ? `${errors.length} error(s).` : `OK: ${PAGES.length} pages checked.`);
process.exit(errors.length ? 1 : 0);
