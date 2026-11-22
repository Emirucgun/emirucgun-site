// @ts-check
/* Digital menu: builds the whole page from menu.data.js. No dependencies, no build step.
   You shouldn't need to edit this file for a new client: edit menu.data.js instead.

   What it does
   - renders header (cover photo, info row), filter chips, sticky category tabs, the house specials,
     the dishes (photo rows and text-only rows), footer, and three sheets (dish, filters, hours)
   - IT | EN switch, remembered in localStorage (wrapped in try/catch: private mode, blocked storage…)
   - open / closed status computed from the opening hours, in the restaurant's time zone
   - scrollspy on the category tabs with a sliding underline, smooth scroll on tap (instant with reduced motion)
   - filters: vegetarian, vegan, gluten-free, plus any of the 14 allergens */

import data from './menu.data.js';
import { ALLERGENS, ALLERGEN } from './allergens.js';

/** @typedef {import('./menu.types').Lang} Lang */
/** @typedef {import('./menu.types').Localized} Localized */
/** @typedef {import('./menu.types').AllergenId} AllergenId */
/** @typedef {import('./menu.types').Category} Category */
/** @typedef {import('./menu.types').Dish} Dish */
/** @typedef {import('./menu.types').TimeRange} TimeRange */

/* ---------- fixed reference data (the 14 allergens: allergens.js) ---------- */

const DAYS = /** @type {const} */ (['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);

/** Interface text. Restaurant content lives in menu.data.js; these are the same for every menu. */
const UI = {
  it: {
    menu: 'Menù', demo: 'demo', lang: 'Lingua', call: 'Chiama', directions: 'Indicazioni', hours: 'Orari',
    phone: 'Telefono', address: 'Indirizzo',
    demoNotice: 'Avviso demo', sections: 'Sezioni del menù', filters: 'Filtri', allergenFilter: 'Allergeni',
    filtersActive: (/** @type {number} */ n) => `Filtri, ${n} ${n === 1 ? 'attivo' : 'attivi'}`,
    openNow: 'Aperto ora', closesAt: (/** @type {string} */ t) => `chiude alle ${t}`,
    closingSoon: 'Chiude tra poco', at: (/** @type {string} */ t) => `alle ${t}`, closed: 'Chiuso',
    opensAt: (/** @type {string} */ t) => `apre alle ${t}`,
    opensTomorrow: (/** @type {string} */ t) => `apre domani alle ${t}`,
    opensOn: (/** @type {string} */ d, /** @type {string} */ t) => `apre ${d} alle ${t}`,
    // short forms for the info row
    sOpen: 'Aperto', sSoon: 'Chiude presto', sUntil: (/** @type {string} */ t) => `fino alle ${t}`,
    sOpensAt: (/** @type {string} */ t) => `apre alle ${t}`,
    sOpensTomorrow: (/** @type {string} */ t) => `apre domani ${t}`,
    sOpensOn: (/** @type {string} */ d, /** @type {string} */ t) => `apre ${d} ${t}`,
    daysShort: ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'],
    house: 'Piatto della casa', houseTitle: 'Piatti della casa', houseNote: 'Quelli che ci chiedono di più.',
    vegetarian: 'Vegetariano', vegan: 'Vegano', spicy: 'Piccante', glutenFree: 'Senza glutine',
    allergens: 'Allergeni', noAllergens: 'Senza allergeni', noAllergensLong: 'Nessuno dei 14 allergeni principali.',
    diet: 'Preferenze',
    exclude: 'Escludi allergeni', excludeHint: 'Toccate un allergene per nascondere i piatti che lo contengono.',
    drinksHint: 'Vegetariano e Vegano non nascondono le bevande.',
    reset: 'Azzera', close: 'Chiudi', details: 'dettagli',
    show: (/** @type {number} */ n) => (n === 1 ? 'Mostra 1 piatto' : `Mostra ${n} piatti`),
    dishes: (/** @type {number} */ n) => (n === 1 ? '1 piatto' : `${n} piatti`),
    without: 'senza',
    emptyTitle: 'Nessun piatto con questi filtri',
    emptyText: 'Provate a togliere un filtro, oppure chiedete al personale: spesso un piatto si può adattare.',
    resetFilters: 'Azzera i filtri',
    cover: 'Coperto', perPerson: 'a persona',
    allergyTitle: 'Allergie e intolleranze',
    allergyLead: 'Per allergie e intolleranze chiedete al personale.',
    allergyText: 'I numeri accanto ai piatti indicano i 14 allergeni del Reg. UE 1169/2011. In cucina li usiamo tutti: non possiamo escludere tracce.',
    translated: '',
    legend: 'Legenda allergeni', where: 'Dove siamo', info: 'Buono a sapersi', closedDay: 'Chiuso', today: 'oggi',
    days: ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'],
    noscript: 'Per vedere il menù attivate JavaScript, oppure chiedete il menù cartaceo al personale.'
  },
  en: {
    menu: 'Menu', demo: 'demo', lang: 'Language', call: 'Call', directions: 'Directions', hours: 'Hours',
    phone: 'Phone', address: 'Address',
    demoNotice: 'Demo notice', sections: 'Menu sections', filters: 'Filters', allergenFilter: 'Allergens',
    filtersActive: (/** @type {number} */ n) => `Filters, ${n} active`,
    openNow: 'Open now', closesAt: (/** @type {string} */ t) => `closes at ${t}`,
    closingSoon: 'Closing soon', at: (/** @type {string} */ t) => `at ${t}`, closed: 'Closed',
    opensAt: (/** @type {string} */ t) => `opens at ${t}`,
    opensTomorrow: (/** @type {string} */ t) => `opens tomorrow at ${t}`,
    opensOn: (/** @type {string} */ d, /** @type {string} */ t) => `opens ${d} at ${t}`,
    sOpen: 'Open', sSoon: 'Closing soon', sUntil: (/** @type {string} */ t) => `until ${t}`,
    sOpensAt: (/** @type {string} */ t) => `opens at ${t}`,
    sOpensTomorrow: (/** @type {string} */ t) => `opens tomorrow ${t}`,
    sOpensOn: (/** @type {string} */ d, /** @type {string} */ t) => `opens ${d} ${t}`,
    daysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    house: 'House special', houseTitle: 'House specials', houseNote: 'The ones our guests ask for most.',
    vegetarian: 'Vegetarian', vegan: 'Vegan', spicy: 'Spicy', glutenFree: 'Gluten-free',
    allergens: 'Allergens', noAllergens: 'No allergens', noAllergensLong: 'None of the 14 major allergens.',
    diet: 'Preferences',
    exclude: 'Exclude allergens', excludeHint: 'Tap an allergen to hide the dishes that contain it.',
    drinksHint: 'Vegetarian and Vegan don’t hide drinks.',
    reset: 'Clear', close: 'Close', details: 'details',
    show: (/** @type {number} */ n) => (n === 1 ? 'Show 1 dish' : `Show ${n} dishes`),
    dishes: (/** @type {number} */ n) => (n === 1 ? '1 dish' : `${n} dishes`),
    without: 'without',
    emptyTitle: 'No dishes match these filters',
    emptyText: 'Try removing a filter, or ask our staff: we can often adapt a dish.',
    resetFilters: 'Clear filters',
    cover: 'Cover charge', perPerson: 'per person',
    allergyTitle: 'Allergies and intolerances',
    allergyLead: 'If you have allergies or intolerances, please ask our staff.',
    allergyText: 'The numbers next to each dish are the 14 allergens of EU Regulation 1169/2011. We use all of them in our kitchen, so we cannot rule out traces.',
    translated: 'Translated from our Italian menu. If you have a severe allergy, please talk to our staff before ordering.',
    legend: 'Allergen key', where: 'Find us', info: 'Good to know', closedDay: 'Closed', today: 'today',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    noscript: 'Please enable JavaScript to see the menu, or ask our staff for the printed one.'
  }
};

/* ---------- state ---------- */

const root = document.documentElement;
const R = data.restaurant;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
/** @param {unknown} v @returns {Lang | null} */
const asLang = (v) => (v === 'it' || v === 'en' ? v : null);
const storage = {
  get() { try { return localStorage.getItem(data.storageKey); } catch { return null; } },
  /** @param {string} v */
  set(v) { try { localStorage.setItem(data.storageKey, v); } catch { /* private mode or blocked: fine */ } }
};

/** @type {Lang} */
let lang = asLang(new URLSearchParams(location.search).get('lang')) || asLang(storage.get()) || data.defaultLang;
const state = {
  /** @type {null | 'vegetarian' | 'vegan'} */ diet: null,
  /** @type {Set<AllergenId>} */ exclude: new Set()
};
/** id of the dish shown in the dish sheet, so it survives a language switch */
/** @type {string | null} */
let openDish = null;
/** dishes whose photo files are missing: shown as text-only rows from then on */
const noPhoto = new Set();

/* ---------- helpers ---------- */

const ui = () => UI[lang];
/** @param {Localized | undefined} v */
const t = (v) => (v == null ? '' : typeof v === 'string' ? v : v[lang]);
/** @param {unknown} s */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const eurFormat = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });
/** Always Italian format ("12,00 €"), as on the restaurant's printed menu. @param {number} n */
const eur = (n) => eurFormat.format(n);
/** @param {string} name @param {string} [cls] */
const icon = (name, cls = '') => `<svg class="i ${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
/** @param {string} id */
const $id = (id) => document.getElementById(id);
/** @param {string} hhmm */
const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
/** @param {AllergenId[]} ids */
const allergensOf = (ids) => ids
  .map((id) => ALLERGEN[id] || (console.warn(`[menu] Unknown allergen "${id}"`), null))
  .filter((a) => a !== null)
  .sort((a, b) => a.n - b.n);
const behavior = () => (reduceMotion.matches ? 'auto' : 'smooth');
/** '/x/bunet.jpg' → '/x/bunet' @param {string} src */
const stem = (src) => src.replace(/\.[a-z0-9]+$/i, '');
/** @type {Map<string, { dish: Dish, cat: Category }>} */
const DISHES = new Map(data.categories.flatMap((c) => c.dishes.map((d) => [d.id, { dish: d, cat: c }])));
/** @param {Dish} d */
const photoOf = (d) => (d.photo && !noPhoto.has(d.id) ? d.photo : null);

/** A dish photo: square WebP copies made by photos.py. @param {Dish} d @param {string} cls @param {string} sizes */
function dishImg(d, cls, sizes) {
  const s = stem(/** @type {string} */ (photoOf(d)));
  return `<img class="${cls}" src="${esc(s)}-480.webp" srcset="${esc(s)}-240.webp 240w, ${esc(s)}-480.webp 480w, ${esc(s)}-960.webp 960w"`
    + ` sizes="${sizes}" alt="" width="480" height="480" loading="lazy" decoding="async" data-photo="${esc(d.id)}">`;
}

/* ---------- theme (colours + fonts from the data file) ---------- */

function applyTheme() {
  const { accent, accentDark, fonts } = data.theme;
  root.style.setProperty('--theme-accent', accent);
  root.style.setProperty('--theme-accent-dark', accentDark);
  root.style.setProperty('--font-heading', `'${fonts.heading.family}', ${fonts.heading.fallback}`);
  root.style.setProperty('--font-body', `'${fonts.body.family}', ${fonts.body.fallback}`);
  const style = document.createElement('style');
  style.textContent = [fonts.heading, fonts.body]
    .map((f) => `@font-face{font-family:'${f.family}';font-style:normal;font-weight:${f.weight};font-display:swap;src:url(${f.src}) format('woff2')}`)
    .join('');
  document.head.append(style);
}

/* ---------- opening hours ---------- */

/** Day (0 = Monday) and minutes since midnight, in the restaurant's time zone. */
function nowThere(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: R.timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(date);
  const get = (/** @type {string} */ type) => parts.find((p) => p.type === type)?.value || '';
  const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday'));
  return { day, min: (Number(get('hour')) % 24) * 60 + Number(get('minute')) };
}

/** @param {number} day @returns {TimeRange[]} */
const rangesOf = (day) => R.hours[DAYS[(day + 7) % 7]] || [];

/** @returns {{ open: true, left: number, at: string } | { open: false, inDays: number, day: number, at: string }} */
function openStatus() {
  const { day, min } = nowThere();
  // open now? (a range like 19:00–01:00 runs past midnight)
  for (const [a, b] of rangesOf(day)) {
    const start = toMin(a);
    const end = toMin(b) <= start ? toMin(b) + 1440 : toMin(b);
    if (min >= start && min < end) return { open: true, left: end - min, at: b };
  }
  for (const [a, b] of rangesOf(day - 1)) {
    if (toMin(b) <= toMin(a) && min < toMin(b)) return { open: true, left: toMin(b) - min, at: b };
  }
  // next opening within a week
  for (let i = 0; i < 8; i++) {
    const next = rangesOf(day + i).map((r) => r[0]).filter((a) => i > 0 || toMin(a) > min).sort((x, y) => toMin(x) - toMin(y))[0];
    if (next) return { open: false, inDays: i, day: (day + i) % 7, at: next };
  }
  return { open: false, inDays: -1, day: 0, at: '' };
}

/** Status for the info row: a short state word, a short detail line, and the full sentence for screen readers. */
function statusText() {
  const u = ui();
  const s = openStatus();
  if (s.open) {
    if (s.left <= 30) return { state: 'soon', word: u.sSoon, sub: u.at(s.at), full: `${u.closingSoon}, ${u.at(s.at)}` };
    return { state: 'open', word: u.sOpen, sub: u.sUntil(s.at), full: `${u.openNow}, ${u.closesAt(s.at)}` };
  }
  const c = /** @type {{ inDays: number, day: number, at: string }} */ (s);
  if (c.inDays < 0) return { state: 'closed', word: u.closed, sub: '', full: u.closed };
  const sub = c.inDays === 0 ? u.sOpensAt(c.at) : c.inDays === 1 ? u.sOpensTomorrow(c.at) : u.sOpensOn(u.daysShort[c.day], c.at);
  const full = c.inDays === 0 ? u.opensAt(c.at) : c.inDays === 1 ? u.opensTomorrow(c.at) : u.opensOn(u.days[c.day], c.at);
  return { state: 'closed', word: u.closed, sub, full: `${u.closed}, ${full}` };
}

function updateStatus() {
  const el = document.querySelector('.status');
  if (!el) return;
  const s = statusText();
  el.setAttribute('data-state', s.state);
  const set = (/** @type {string} */ sel, /** @type {string} */ v) => { const n = el.querySelector(sel); if (n && n.textContent !== v) n.textContent = v; };
  set('.status-word', s.word);
  set('.status-sub', s.sub);
  set('.status-full', s.full);
}

function hoursList() {
  const today = nowThere().day;
  return `<dl class="hours">${DAYS.map((_, i) => {
    const r = rangesOf(i);
    return `<div${i === today ? ' class="today"' : ''}><dt>${esc(ui().days[i])}${i === today ? ` <span class="sr-only">(${ui().today})</span>` : ''}</dt>`
      + `<dd>${r.length ? r.map(([a, b]) => `${a}–${b}`).join(' · ') : ui().closedDay}</dd></div>`;
  }).join('')}</dl>`;
}

/* ---------- rendering ---------- */

function renderBanner() {
  const d = data.demo;
  if (!d) return '';
  return `<aside class="demo-banner" aria-label="${ui().demoNotice}"><span class="pill">Demo</span>${esc(t(d.banner))} · <a href="${esc(d.url)}" target="_top">${esc(t(d.linkLabel))}</a></aside>`;
}

function renderCover() {
  const c = R.coverPhoto;
  if (!c) return '';
  const s = stem(c.src);
  return `<picture class="cover-photo">
    <source type="image/avif" srcset="${esc(s)}-800.avif 800w, ${esc(s)}-1600.avif 1600w" sizes="100vw">
    <img src="${esc(s)}-800.webp" srcset="${esc(s)}-800.webp 800w, ${esc(s)}-1600.webp 1600w" sizes="100vw" alt="${esc(t(c.alt))}" width="1600" height="900" fetchpriority="high" decoding="async">
  </picture>`;
}

function renderHeader() {
  const u = ui();
  const demo = !!data.demo;
  /** One cell of the info row: a link or (on the demo) a button. */
  const cell = (/** @type {string} */ ic, /** @type {string} */ label, /** @type {string} */ value, /** @type {string} */ attrs, /** @type {boolean} */ isLink) =>
    `<li>${isLink ? `<a class="info-cell" ${attrs}>` : `<button type="button" class="info-cell" ${attrs}>`}`
    + `<span class="info-label">${icon(ic)}${label}</span><span class="info-value">${value}</span>${isLink ? '</a>' : '</button>'}</li>`;
  const cover = R.cover;
  const coverAl = cover?.allergens ? allergensOf(cover.allergens) : [];
  return `<header class="mast${R.coverPhoto ? ' has-cover' : ''}">
  <div class="mast-media">${renderCover()}
    <div class="lang" role="group" aria-label="${u.lang}">
      <button type="button" data-lang="it" lang="it" aria-pressed="${lang === 'it'}">IT<span class="sr-only"> · Italiano</span></button>
      <button type="button" data-lang="en" lang="en" aria-pressed="${lang === 'en'}">EN<span class="sr-only"> · English</span></button>
    </div>
  </div>
  <div class="mast-body wrap">
    <div class="mast-id">
      ${R.logo ? `<span class="logo-tile"><img class="logo" src="${esc(R.logo.src)}" width="${R.logo.width}" height="${R.logo.height}" alt=""></span>` : ''}
      ${R.kicker ? `<p class="kicker">${esc(t(R.kicker))}</p>` : ''}
      <h1>${esc(R.name)}</h1>
      ${R.tagline ? `<p class="tagline">${esc(t(R.tagline))}</p>` : ''}
    </div>
    <div class="mast-info">
      <ul class="info">
        <li><button type="button" class="info-cell status" data-state="closed" data-action="hours" aria-haspopup="dialog">
          <span class="info-label">${icon('clock')}${u.hours}</span>
          <span class="info-value" aria-hidden="true"><span class="dot"></span><span class="status-word"></span></span>
          <span class="info-sub status-sub" aria-hidden="true"></span>
          <span class="sr-only status-full"></span>
        </button></li>
        ${cell('pin', u.address, `${esc(R.address.street).replace(/ (\S{1,4})$/, '&nbsp;$1')}<span class="info-sub">${esc(R.address.city.replace(/^\d+\s*/, ''))}</span>`,
          demo ? 'data-action="demo-directions"' : `href="${esc(R.mapsUrl)}" target="_blank" rel="noopener"`, !demo)}
        ${cell('phone', u.phone, `${esc(R.phoneDisplay)}<span class="info-sub">${u.call}</span>`,
          demo ? 'data-action="demo-call"' : `href="tel:${esc(R.phone)}"`, !demo)}
      </ul>
      ${cover ? `<p class="cover-strip"><span class="cover-name">${u.cover}</span> <b>${eur(cover.amount)}</b> <span class="muted">${u.perPerson}${cover.note ? ` · ${esc(t(cover.note))}` : ''}${coverAl.length ? ` <span class="al-inline">${u.allergens}: ${coverAl.map((a) => `${a.n} ${esc(t(a.name)).toLowerCase()}`).join(', ')}</span>` : ''}</span></p>` : ''}
    </div>
  </div>
</header>`;
}

function renderChips() {
  const u = ui();
  return `<div class="chips-row wrap" role="group" aria-label="${u.filters}"><div class="chips-scroll">
  <button type="button" class="chip chip-filter filter-btn" data-action="filters" aria-haspopup="dialog">${icon('sliders')}<span>${u.allergenFilter}</span><span class="count" aria-hidden="true" hidden></span></button>
  <button type="button" class="chip" data-diet="vegetarian" aria-pressed="false">${icon('leaf')}${u.vegetarian}</button>
  <button type="button" class="chip" data-diet="vegan" aria-pressed="false">${icon('sprout')}${u.vegan}</button>
  <button type="button" class="chip" data-gf aria-pressed="false">${icon('wheat-off')}${u.glutenFree}</button>
</div></div>`;
}

function renderBar() {
  const u = ui();
  return `<nav class="bar" aria-label="${u.sections}"><div class="bar-in wrap">
  <ul class="cats">${data.categories.map((c) => `<li data-cat-item="${c.id}"><a href="#${c.id}" data-cat="${c.id}" aria-current="false">${esc(t(c.name))}</a></li>`).join('')}<li class="ind" aria-hidden="true"></li></ul>
  <button type="button" class="bar-filter filter-btn" data-action="filters" aria-haspopup="dialog" aria-label="${u.filters}">${icon('sliders')}<span class="count" aria-hidden="true" hidden></span></button>
</div></nav>`;
}

/** @param {Dish['price']} p */
function renderPrice(p) {
  if (typeof p === 'number') return `<p class="price">${eur(p)}</p>`;
  return `<p class="price price-multi">${p.map((o) => `<span><span class="opt-label">${esc(t(o.label))}</span> ${eur(o.amount)}</span>`).join('')}</p>`;
}

/** Diet / spicy tags. @param {Dish} d */
function tagChips(d) {
  const u = ui();
  const tags = d.tags || [];
  return [
    tags.includes('vegan') ? `<li class="tag tag-veg">${icon('sprout')}${u.vegan}</li>`
      : tags.includes('vegetarian') ? `<li class="tag tag-veg">${icon('leaf')}${u.vegetarian}</li>` : '',
    tags.includes('spicy') ? `<li class="tag tag-spicy">${icon('flame')}${u.spicy}</li>` : ''
  ].join('');
}

/** @param {Dish} d */
function renderDish(d) {
  const u = ui();
  const house = (d.tags || []).includes('house');
  const al = allergensOf(d.allergens);
  const chips = tagChips(d);
  const photo = photoOf(d);
  const alHtml = al.length
    ? `<span class="al"><span class="sr-only">${u.allergens}: ${esc(al.map((a) => t(a.name)).join(', '))}</span>`
      + `<span class="al-label" aria-hidden="true">${u.allergens}</span><span class="al-nums" aria-hidden="true">${al.map((a) => `<span class="al-n">${a.n}</span>`).join('')}</span></span>`
    : `<span class="al-none">${u.noAllergens}</span>`;
  return `<li class="dish${photo ? ' has-photo' : ''}" id="d-${esc(d.id)}">
  <div class="dish-text">
    ${house ? `<p class="badge">${icon('star')}${u.house}</p>` : ''}
    <h3 class="dish-name"><button type="button" class="open" data-dish="${esc(d.id)}" aria-haspopup="dialog">${esc(t(d.name))}<span class="sr-only">, ${u.details}</span></button></h3>
    ${d.description ? `<p class="desc">${esc(t(d.description))}</p>` : ''}
    ${d.available ? `<p class="avail">${icon('calendar')}${esc(t(d.available))}</p>` : ''}
    ${renderPrice(d.price)}
  </div>
  ${photo ? `<div class="thumb">${dishImg(d, 'photo', '(min-width: 1024px) 128px, 104px')}</div>` : ''}
  <div class="meta">${chips ? `<ul class="tags">${chips}</ul>` : ''}${alHtml}</div>
</li>`;
}

/** The house specials, as big photo cards (only those with a photo). */
function renderFeatured() {
  const u = ui();
  const list = [...DISHES.values()].filter(({ dish }) => (dish.tags || []).includes('house') && photoOf(dish));
  if (!list.length) return '';
  return `<section class="featured wrap" id="casa" aria-labelledby="h-casa">
  <div class="sec-head"><h2 id="h-casa" class="sec-title">${u.houseTitle}<span aria-hidden="true">.</span></h2><p class="sec-note">${u.houseNote}</p></div>
  <ul class="feat-list">${list.map(({ dish: d }) => `<li class="feat" id="f-${esc(d.id)}">
    <div class="feat-media">${dishImg(d, 'photo', '(min-width: 1024px) 352px, (min-width: 700px) 45vw, 72vw')}</div>
    <h3 class="feat-name"><button type="button" class="open" data-dish="${esc(d.id)}" aria-haspopup="dialog">${esc(t(d.name))}<span class="sr-only">, ${u.details}</span></button></h3>
    ${d.description ? `<p class="desc">${esc(t(d.description))}</p>` : ''}
    ${renderPrice(d.price)}
  </li>`).join('')}</ul>
</section>`;
}

/** @param {Category} c */
function renderCategory(c) {
  return `<section class="cat wrap" id="${esc(c.id)}" aria-labelledby="h-${esc(c.id)}">
  <div class="sec-head"><h2 id="h-${esc(c.id)}" class="sec-title" tabindex="-1">${esc(t(c.name))}<span aria-hidden="true">.</span></h2>${c.note ? `<p class="sec-note">${esc(t(c.note))}</p>` : ''}</div>
  <ul class="dishes">${c.dishes.map(renderDish).join('')}</ul>
</section>`;
}

function renderFooter() {
  const u = ui();
  const demo = data.demo;
  return `<footer class="foot">
  <div class="foot-grid wrap">
  <section class="box notice" aria-labelledby="h-allergy">
    <h2 id="h-allergy">${icon('info')}${u.allergyTitle}</h2>
    <p class="lead">${u.allergyLead}</p>
    <p class="muted">${u.allergyText}</p>
    ${u.translated ? `<p class="muted">${u.translated}</p>` : ''}
  </section>
  <section class="box legend-box" aria-labelledby="h-legend">
    <h2 id="h-legend">${u.legend}</h2>
    <ol class="legend">${ALLERGENS.map((a) => `<li><span class="al-n al-n-lg" aria-hidden="true">${a.n}</span><span>${esc(t(a.long))}</span></li>`).join('')}</ol>
  </section>
  <section class="box" aria-labelledby="h-hours">
    <h2 id="h-hours">${icon('clock')}${u.hours}</h2>
    ${hoursList()}
    ${R.hoursNote ? `<p class="muted">${esc(t(R.hoursNote))}</p>` : ''}
  </section>
  <section class="box where" aria-labelledby="h-where">
    <h2 id="h-where">${icon('pin')}${u.where}</h2>
    <address>${esc(R.name)}<br>${esc(R.address.street)}, ${esc(R.address.city)}<br>${
      demo ? esc(R.phoneDisplay) : `<a href="tel:${esc(R.phone)}">${esc(R.phoneDisplay)}</a>`}</address>
    ${R.notes?.length ? `<h2 id="h-info" class="h-sub">${u.info}</h2><ul class="notes">${R.notes.map((n) => `<li>${esc(t(n))}</li>`).join('')}</ul>` : ''}
  </section>
  </div>
  ${demo ? `<div class="pitch wrap"><p>${esc(t(demo.pitch))}</p><a class="btn" href="${esc(demo.url)}" target="_top">${esc(demo.url.replace(/^https?:\/\//, ''))}${icon('arrow')}</a></div>
  <p class="fineprint wrap">${esc(t(demo.banner))} · <a href="${esc(demo.url)}" target="_top">${esc(t(demo.linkLabel))}</a></p>` : ''}
  ${!demo && data.credit ? `<p class="fineprint wrap"><a href="${esc(data.credit.url)}">${esc(t(data.credit.label))}</a></p>` : ''}
</footer>`;
}

/** Dish sheet content. @param {string} id */
function renderDishSheet(id) {
  const u = ui();
  const entry = DISHES.get(id);
  if (!entry) return '';
  const d = entry.dish;
  const al = allergensOf(d.allergens);
  const chips = tagChips(d);
  const photo = photoOf(d);
  return `${photo ? `<div class="ds-media">${dishImg(d, 'photo', '(min-width: 640px) 560px, 100vw').replace(' loading="lazy"', '')}</div>` : ''}
  <button type="button" class="icon-btn ds-close" data-action="close" aria-label="${u.close}">${icon('x')}</button>
  <div class="ds-body">
    ${(d.tags || []).includes('house') ? `<p class="badge">${icon('star')}${u.house}</p>` : ''}
    <h2 id="t-dish">${esc(t(d.name))}</h2>
    ${renderPrice(d.price)}
    ${d.description ? `<p class="ds-desc">${esc(t(d.description))}</p>` : ''}
    ${d.available ? `<p class="avail">${icon('calendar')}${esc(t(d.available))}</p>` : ''}
    ${chips ? `<ul class="tags">${chips}</ul>` : ''}
    <section class="ds-al" aria-labelledby="h-ds-al">
      <h3 id="h-ds-al">${u.allergens}</h3>
      ${al.length ? `<ul class="ds-al-list">${al.map((a) => `<li><span class="al-n al-n-lg" aria-hidden="true">${a.n}</span>${esc(t(a.long))}</li>`).join('')}</ul>`
        : `<p class="muted">${u.noAllergensLong}</p>`}
      <p class="muted small">${u.allergyLead}${u.translated ? ` ${u.translated}` : ''}</p>
    </section>
  </div>`;
}

function renderSheets() {
  const u = ui();
  const hasDrinks = data.categories.some((c) => c.drinks);
  return `<dialog class="sheet sheet-dish" id="sheet-dish" aria-labelledby="t-dish"><div class="ds"></div></dialog>
<dialog class="sheet" id="sheet-filters" aria-labelledby="t-filters">
  <div class="sheet-head"><h2 id="t-filters">${u.filters}</h2><button type="button" class="icon-btn" data-action="close" aria-label="${u.close}">${icon('x')}</button></div>
  <div class="sheet-body">
    <fieldset><legend>${u.diet}</legend>
      <div class="chips">
        <button type="button" class="chip" data-diet="vegetarian" aria-pressed="false">${icon('leaf')}${u.vegetarian}</button>
        <button type="button" class="chip" data-diet="vegan" aria-pressed="false">${icon('sprout')}${u.vegan}</button>
        <button type="button" class="chip" data-gf aria-pressed="false">${icon('wheat-off')}${u.glutenFree}</button>
      </div>
      ${hasDrinks ? `<p class="hint">${u.drinksHint}</p>` : ''}
    </fieldset>
    <fieldset><legend>${u.exclude}</legend><p class="hint">${u.excludeHint}</p>
      <div class="al-grid">${ALLERGENS.map((a) => `<label class="al-opt"><input type="checkbox" value="${a.id}"><span class="al-n al-n-lg" aria-hidden="true">${a.n}</span><span>${esc(t(a.name))}</span></label>`).join('')}</div>
    </fieldset>
  </div>
  <div class="sheet-foot"><button type="button" class="btn btn-ghost" data-action="reset">${u.reset}</button><button type="button" class="btn" data-action="close" data-show-count></button></div>
</dialog>
<dialog class="sheet" id="sheet-hours" aria-labelledby="t-hours">
  <div class="sheet-head"><h2 id="t-hours">${u.hours}</h2><button type="button" class="icon-btn" data-action="close" aria-label="${u.close}">${icon('x')}</button></div>
  <div class="sheet-body">
    ${hoursList()}
    ${R.hoursNote ? `<p class="muted">${esc(t(R.hoursNote))}</p>` : ''}
    <p class="muted">${esc(R.address.street)}, ${esc(R.address.city)}</p>
  </div>
</dialog>`;
}

/** Photos fade in once loaded; a photo whose files are missing turns its dish into a text-only row. @param {ParentNode} scope */
function wirePhotos(scope) {
  scope.querySelectorAll('img[data-photo]').forEach((img) => {
    if (!(img instanceof HTMLImageElement)) return;
    const id = img.getAttribute('data-photo') || '';
    const shown = () => img.classList.add('loaded');
    const drop = () => {
      noPhoto.add(id);
      const row = img.closest('.dish, .feat, .ds-media');
      if (row?.classList.contains('dish')) { row.classList.remove('has-photo'); img.closest('.thumb')?.remove(); }
      else if (row?.classList.contains('feat')) {
        const section = row.closest('.featured');
        row.remove();
        if (section && !section.querySelector('.feat')) section.remove(); // no heading over an empty row
      }
      else row?.remove();
    };
    if (img.complete) { if (img.naturalWidth) shown(); else drop(); return; }
    img.addEventListener('load', shown, { once: true });
    img.addEventListener('error', drop, { once: true });
  });
}

function render() {
  const app = $id('app');
  if (!app) return;
  const u = ui();
  root.lang = lang;
  document.title = `${u.menu} · ${R.name}${data.demo ? ` (${u.demo})` : ''}`;
  app.innerHTML = `${renderBanner()}<div class="page">${renderHeader()}${renderChips()}${renderBar()}
<main id="menu">
  <div class="filter-summary wrap" hidden><p></p><button type="button" class="link-btn" data-action="reset">${u.reset}</button></div>
  ${renderFeatured()}
  ${data.categories.map(renderCategory).join('')}
  <div class="empty wrap" hidden>${icon('plate')}<h2>${u.emptyTitle}</h2><p>${u.emptyText}</p><button type="button" class="btn" data-action="reset">${u.resetFilters}</button></div>
</main>${renderFooter()}</div>${renderSheets()}`;

  wirePhotos(app);
  const logo = app.querySelector('img.logo');
  logo?.addEventListener('error', () => logo.closest('.logo-tile')?.remove(), { once: true });
  const cover = app.querySelector('.cover-photo img');
  cover?.addEventListener('error', () => { cover.closest('.mast')?.classList.remove('has-cover'); cover.closest('picture')?.remove(); }, { once: true });

  observeBar();
  updateStatus();
  applyFilters();
  current = null;
  spy();
}

/* ---------- filters ---------- */

/** @param {Dish} d @param {Category} c */
function matches(d, c) {
  const tags = d.tags || [];
  if (!c.drinks && state.diet === 'vegan' && !tags.includes('vegan')) return false;
  if (!c.drinks && state.diet === 'vegetarian' && !tags.includes('vegan') && !tags.includes('vegetarian')) return false;
  return !d.allergens.some((a) => state.exclude.has(a));
}

function activeCount() { return (state.diet ? 1 : 0) + state.exclude.size; }

function applyFilters() {
  const u = ui();
  let food = 0;
  for (const c of data.categories) {
    let n = 0;
    for (const d of c.dishes) {
      const ok = matches(d, c);
      const el = $id(`d-${d.id}`);
      if (el) el.hidden = !ok;
      const feat = $id(`f-${d.id}`);
      if (feat) feat.hidden = !ok;
      if (ok) n++;
    }
    if (!c.drinks) food += n;
    const section = $id(c.id);
    if (section) section.hidden = n === 0;
    const item = document.querySelector(`[data-cat-item="${c.id}"]`);
    if (item instanceof HTMLElement) item.hidden = n === 0;
  }
  const nothing = food === 0;
  if (nothing) data.categories.forEach((c) => { const s = $id(c.id); if (s) s.hidden = true; });
  document.querySelectorAll('[data-cat-item]').forEach((li) => { if (nothing && li instanceof HTMLElement) li.hidden = true; });
  const featured = $id('casa');
  if (featured) featured.hidden = nothing || !featured.querySelector('.feat:not([hidden])');

  const count = activeCount();
  const empty = document.querySelector('.empty');
  if (empty instanceof HTMLElement) empty.hidden = !nothing;

  // filter buttons: badge with the number of active filters
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    const badge = btn.querySelector('.count');
    if (!(badge instanceof HTMLElement)) return;
    const n = state.exclude.size + (btn.classList.contains('bar-filter') ? (state.diet ? 1 : 0) : 0);
    badge.hidden = n === 0;
    badge.textContent = String(n);
    btn.toggleAttribute('data-active', n > 0);
    if (btn.classList.contains('bar-filter')) btn.setAttribute('aria-label', count ? u.filtersActive(count) : u.filters);
  });

  // summary line above the menu
  const summary = document.querySelector('.filter-summary');
  if (summary instanceof HTMLElement) {
    summary.hidden = count === 0 || nothing;
    const parts = [];
    if (state.diet) parts.push(u[state.diet]);
    if (state.exclude.size) parts.push(`${u.without} ${allergensOf([...state.exclude]).map((a) => t(a.name).toLowerCase()).join(', ')}`);
    const p = summary.querySelector('p');
    if (p) p.innerHTML = `${esc(parts.join(' · '))} · <b>${u.dishes(food)}</b>`;
  }

  // chips (row + sheet) and the allergen checkboxes
  document.querySelectorAll('[data-diet]').forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute('data-diet') === state.diet)));
  document.querySelectorAll('[data-gf]').forEach((b) => b.setAttribute('aria-pressed', String(state.exclude.has('gluten'))));
  document.querySelectorAll('.al-opt input').forEach((i) => {
    if (i instanceof HTMLInputElement) i.checked = state.exclude.has(/** @type {AllergenId} */ (i.value));
  });
  const show = document.querySelector('[data-show-count]');
  if (show) show.textContent = u.show(food);
  current = null;
  spy();
}

function resetFilters() {
  state.diet = null;
  state.exclude.clear();
  applyFilters();
}

/* ---------- sticky bar: height, scrollspy, sliding underline ---------- */

/** @type {ResizeObserver | null} */
let barObserver = null;
function observeBar() {
  const bar = document.querySelector('.bar');
  if (!bar) return;
  barObserver?.disconnect();
  const set = () => { root.style.setProperty('--bar-h', `${Math.round(bar.getBoundingClientRect().height)}px`); moveIndicator(); };
  if ('ResizeObserver' in window) { barObserver = new ResizeObserver(set); barObserver.observe(bar); }
  set();
}

/** Slides the underline under the current tab. */
function moveIndicator() {
  const ind = document.querySelector('.cats .ind');
  if (!(ind instanceof HTMLElement)) return;
  const a = document.querySelector('.cats a[aria-current="true"]');
  if (!(a instanceof HTMLElement)) { ind.style.opacity = '0'; return; }
  ind.style.opacity = '1';
  ind.style.width = `${a.offsetWidth}px`;
  ind.style.transform = `translateX(${a.offsetLeft}px)`;
}

let lockSpy = 0;
/** @type {string | null} */
let current = null;

/** @param {string | null} id */
function setCurrent(id) {
  if (id === current) return;
  current = id;
  const cats = document.querySelector('.cats');
  if (id === null && cats) cats.scrollTo({ left: 0, behavior: behavior() });
  document.querySelectorAll('.cats a').forEach((a) => {
    const on = a.getAttribute('data-cat') === id;
    a.setAttribute('aria-current', String(on));
    if (on && cats instanceof HTMLElement && a instanceof HTMLElement) {
      // keep the active category visible in the horizontal bar
      const r = a.getBoundingClientRect(), b = cats.getBoundingClientRect();
      if (r.left < b.left + 8 || r.right > b.right - 28) {
        cats.scrollTo({ left: cats.scrollLeft + (r.left - b.left) - b.width / 2 + r.width / 2, behavior: behavior() });
      }
    }
  });
  moveIndicator();
}

function spy() {
  if (Date.now() < lockSpy) return;
  const bar = document.querySelector('.bar');
  const line = (bar ? bar.getBoundingClientRect().bottom : 0) + 40;
  /** @type {string | null} */
  let id = null;
  for (const c of data.categories) {
    const s = $id(c.id);
    if (s && !s.hidden && s.getBoundingClientRect().top <= line) id = c.id;
  }
  setCurrent(id);
}

/** @param {string} id */
function goTo(id) {
  const s = $id(id);
  if (!s) return;
  setCurrent(id);
  lockSpy = Date.now() + 1200;
  const unlock = () => { lockSpy = 0; spy(); };
  addEventListener('scrollend', unlock, { once: true });
  s.scrollIntoView({ behavior: behavior(), block: 'start' });
  s.querySelector('h2')?.focus({ preventScroll: true });
  try { history.replaceState(null, '', `#${id}`); } catch { /* sandboxed iframe */ }
}

/* ---------- language ---------- */

/** @param {Lang} l @param {boolean} save */
function setLang(l, save) {
  if (save) storage.set(l);
  if (l === lang) return;
  // keep the visitor looking at the same dish after the re-render
  const line = document.querySelector('.bar')?.getBoundingClientRect().bottom || 0;
  const anchor = [...document.querySelectorAll('.dish:not([hidden]), .cat:not([hidden])')]
    .find((el) => el.getBoundingClientRect().bottom > line);
  const before = anchor?.getBoundingClientRect().top;
  const focusedLang = document.activeElement?.getAttribute('data-lang');
  const openSheets = [...document.querySelectorAll('dialog[open]')].map((d) => d.id);
  lang = l;
  render();
  if (anchor && before !== undefined && scrollY > 0) {
    const after = $id(anchor.id)?.getBoundingClientRect().top;
    if (after !== undefined) scrollBy(0, after - before);
  }
  if (focusedLang) /** @type {HTMLElement | null} */ (document.querySelector(`[data-lang="${focusedLang}"]`))?.focus();
  openSheets.forEach((id) => (id === 'sheet-dish' && openDish ? showDish(openDish) : /** @type {HTMLDialogElement | null} */ ($id(id))?.showModal()));
}

/* ---------- toast ---------- */

/** @type {number | undefined} */
let toastTimer;
/** @param {string} text */
function toast(text) {
  const el = $id('toast');
  if (!el) return;
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('show'), 3200);
}

/* ---------- sheets ---------- */

/** @param {string} id */
function openSheet(id) {
  const d = $id(id);
  if (d instanceof HTMLDialogElement && !d.open) d.showModal();
}

/** @param {string} id */
function showDish(id) {
  const sheet = $id('sheet-dish');
  const box = sheet?.querySelector('.ds');
  if (!(sheet instanceof HTMLDialogElement) || !box) return;
  openDish = id;
  box.innerHTML = renderDishSheet(id);
  sheet.classList.toggle('has-media', !!box.querySelector('.ds-media'));
  wirePhotos(box);
  if (!sheet.open) sheet.showModal();
  sheet.scrollTop = 0;
  /** @type {HTMLElement | null} */ (box.querySelector('.ds-close'))?.focus();
}

let filtersAtOpen = '';
const filterKey = () => `${state.diet}|${[...state.exclude].sort().join(',')}`;

/* ---------- events (delegated once, so they survive re-renders) ---------- */

document.addEventListener('click', (e) => {
  const target = /** @type {Element} */ (e.target);
  if (target instanceof HTMLDialogElement) { target.close(); return; } // tap on the backdrop

  const langBtn = target.closest('[data-lang]');
  if (langBtn) { setLang(asLang(langBtn.getAttribute('data-lang')) || lang, true); return; }

  const cat = target.closest('a[data-cat]');
  if (cat) { e.preventDefault(); goTo(cat.getAttribute('data-cat') || ''); return; }

  const dish = target.closest('[data-dish]');
  if (dish) { showDish(dish.getAttribute('data-dish') || ''); return; }

  const diet = target.closest('[data-diet]');
  if (diet) {
    const v = /** @type {'vegetarian' | 'vegan'} */ (diet.getAttribute('data-diet'));
    state.diet = state.diet === v ? null : v;
    applyFilters();
    return;
  }
  if (target.closest('[data-gf]')) {
    if (state.exclude.has('gluten')) state.exclude.delete('gluten'); else state.exclude.add('gluten');
    applyFilters();
    return;
  }

  const action = target.closest('[data-action]')?.getAttribute('data-action');
  if (!action) return;
  if (action === 'filters') { filtersAtOpen = filterKey(); openSheet('sheet-filters'); }
  else if (action === 'hours') openSheet('sheet-hours');
  else if (action === 'close') target.closest('dialog')?.close();
  else if (action === 'reset') resetFilters();
  else if (action === 'demo-call' && data.demo) toast(t(data.demo.callNote));
  else if (action === 'demo-directions' && data.demo) toast(t(data.demo.directionsNote));
});

document.addEventListener('change', (e) => {
  const input = e.target;
  if (!(input instanceof HTMLInputElement) || !input.closest('.al-opt')) return;
  const id = /** @type {AllergenId} */ (input.value);
  if (input.checked) state.exclude.add(id); else state.exclude.delete(id);
  applyFilters();
});

document.addEventListener('close', (e) => {
  if (!(e.target instanceof HTMLDialogElement)) return;
  if (e.target.id === 'sheet-dish') {
    // back to the row the dish was opened from
    const id = openDish;
    openDish = null;
    const btn = document.querySelector(`.dish [data-dish="${id}"]`);
    if (btn instanceof HTMLElement) btn.focus({ preventScroll: true });
    return;
  }
  // After closing the filter sheet with new filters, bring the (shorter) menu back into view.
  if (e.target.id !== 'sheet-filters' || filterKey() === filtersAtOpen) return;
  const main = $id('menu');
  if (main && main.getBoundingClientRect().top < 0) {
    scrollTo({ top: scrollY + main.getBoundingClientRect().top - (document.querySelector('.bar')?.getBoundingClientRect().height || 0), behavior: 'auto' });
  }
}, true);

/** @type {number} */
let raf = 0;
addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; spy(); }); }, { passive: true });
addEventListener('resize', moveIndicator, { passive: true });
document.fonts?.ready.then(moveIndicator);

// Another tab (or the studio page this demo is embedded in) changed the language.
addEventListener('storage', (e) => {
  const l = e.key === data.storageKey ? asLang(e.newValue) : null;
  if (l) setLang(l, false);
});

/* ---------- start ---------- */

applyTheme();
render();
// transitions only from the second frame on, so nothing animates on first paint
requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('ready')));
setInterval(updateStatus, 30_000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateStatus(); });

// deep link to a section (#primi), now that the content exists
if (location.hash.length > 1) {
  const id = decodeURIComponent(location.hash.slice(1));
  if (data.categories.some((c) => c.id === id)) requestAnimationFrame(() => $id(id)?.scrollIntoView({ block: 'start' }));
}
