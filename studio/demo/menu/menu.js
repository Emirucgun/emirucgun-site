// @ts-check
/* Digital menu: builds the whole page from menu.data.js. No dependencies, no build step.
   You shouldn't need to edit this file for a new client: edit menu.data.js instead.

   What it does
   - renders header, sticky category bar, dishes, footer and the two sheets (filters, hours)
   - IT | EN switch, remembered in localStorage (wrapped in try/catch: private mode, blocked storage…)
   - open / closed status computed from the opening hours, in the restaurant's time zone
   - scrollspy on the category bar, smooth scroll on tap (instant with reduced motion)
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
    demoNotice: 'Avviso demo', sections: 'Sezioni del menù', filters: 'Filtri',
    filtersActive: (/** @type {number} */ n) => `Filtri, ${n} ${n === 1 ? 'attivo' : 'attivi'}`,
    openNow: 'Aperto ora', closesAt: (/** @type {string} */ t) => `chiude alle ${t}`,
    closingSoon: 'Chiude tra poco', at: (/** @type {string} */ t) => `alle ${t}`, closed: 'Chiuso',
    opensAt: (/** @type {string} */ t) => `apre alle ${t}`,
    opensTomorrow: (/** @type {string} */ t) => `apre domani alle ${t}`,
    opensOn: (/** @type {string} */ d, /** @type {string} */ t) => `apre ${d} alle ${t}`,
    house: 'Piatto della casa', vegetarian: 'Vegetariano', vegan: 'Vegano', spicy: 'Piccante', glutenFree: 'Senza glutine',
    allergens: 'Allergeni', noAllergens: 'Senza allergeni', diet: 'Preferenze',
    exclude: 'Escludi allergeni', excludeHint: 'Nascondo i piatti che contengono:',
    drinksHint: 'Vegetariano e Vegano non nascondono le bevande.',
    reset: 'Azzera', close: 'Chiudi',
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
    legend: 'Legenda allergeni', where: 'Dove siamo', info: 'Buono a sapersi', closedDay: 'Chiuso', today: 'oggi',
    days: ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'],
    noscript: 'Per vedere il menù attivate JavaScript, oppure chiedete il menù cartaceo al personale.'
  },
  en: {
    menu: 'Menu', demo: 'demo', lang: 'Language', call: 'Call', directions: 'Directions', hours: 'Hours',
    demoNotice: 'Demo notice', sections: 'Menu sections', filters: 'Filters',
    filtersActive: (/** @type {number} */ n) => `Filters, ${n} active`,
    openNow: 'Open now', closesAt: (/** @type {string} */ t) => `closes at ${t}`,
    closingSoon: 'Closing soon', at: (/** @type {string} */ t) => `at ${t}`, closed: 'Closed',
    opensAt: (/** @type {string} */ t) => `opens at ${t}`,
    opensTomorrow: (/** @type {string} */ t) => `opens tomorrow at ${t}`,
    opensOn: (/** @type {string} */ d, /** @type {string} */ t) => `opens ${d} at ${t}`,
    house: 'House special', vegetarian: 'Vegetarian', vegan: 'Vegan', spicy: 'Spicy', glutenFree: 'Gluten-free',
    allergens: 'Allergens', noAllergens: 'No allergens', diet: 'Preferences',
    exclude: 'Exclude allergens', excludeHint: 'Hide dishes that contain:',
    drinksHint: 'Vegetarian and Vegan don’t hide drinks.',
    reset: 'Clear', close: 'Close',
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

function statusText() {
  const u = ui();
  const s = openStatus();
  if (s.open) {
    if (s.left <= 30) return { state: 'soon', html: `<b>${u.closingSoon}</b> · ${u.at(s.at)}` };
    return { state: 'open', html: `<b>${u.openNow}</b> · ${u.closesAt(s.at)}` };
  }
  if (s.inDays < 0) return { state: 'closed', html: `<b>${u.closed}</b>` };
  const when = s.inDays === 0 ? u.opensAt(s.at) : s.inDays === 1 ? u.opensTomorrow(s.at) : u.opensOn(u.days[s.day], s.at);
  return { state: 'closed', html: `<b>${u.closed}</b> · ${when}` };
}

function updateStatus() {
  const el = document.querySelector('.status');
  if (!el) return;
  const s = statusText();
  el.setAttribute('data-state', s.state);
  const text = el.querySelector('.status-text');
  if (text && text.innerHTML !== s.html) text.innerHTML = s.html;
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

function renderHeader() {
  const u = ui();
  const demo = !!data.demo;
  const call = demo
    ? `<button type="button" class="action" data-action="demo-call">${icon('phone')}${u.call}</button>`
    : `<a class="action" href="tel:${esc(R.phone)}">${icon('phone')}${u.call}</a>`;
  const directions = demo
    ? `<button type="button" class="action" data-action="demo-directions">${icon('pin')}${u.directions}</button>`
    : `<a class="action" href="${esc(R.mapsUrl)}" target="_blank" rel="noopener">${icon('pin')}${u.directions}</a>`;
  return `<header class="mast">
  <div class="lang" role="group" aria-label="${u.lang}">
    <button type="button" data-lang="it" lang="it" aria-pressed="${lang === 'it'}">IT<span class="sr-only"> · Italiano</span></button>
    <button type="button" data-lang="en" lang="en" aria-pressed="${lang === 'en'}">EN<span class="sr-only"> · English</span></button>
  </div>
  ${R.logo ? `<img class="logo" src="${esc(R.logo.src)}" width="${R.logo.width}" height="${R.logo.height}" alt="">` : ''}
  ${R.kicker ? `<p class="kicker">${esc(t(R.kicker))}</p>` : ''}
  <h1>${esc(R.name)}</h1>
  ${R.tagline ? `<p class="tagline">${esc(t(R.tagline))}</p>` : ''}
  <div class="rule" aria-hidden="true"><i></i></div>
  <p class="status" data-state="closed"><span class="dot" aria-hidden="true"></span><span class="status-text"></span></p>
  <ul class="actions">
    <li>${call}</li>
    <li>${directions}</li>
    <li><button type="button" class="action" data-action="hours" aria-haspopup="dialog">${icon('clock')}${u.hours}</button></li>
  </ul>
</header>`;
}

function renderBar() {
  const u = ui();
  return `<nav class="bar" aria-label="${u.sections}"><div class="bar-in">
  <button type="button" class="filter-btn" data-action="filters" aria-haspopup="dialog">${icon('sliders')}<span>${u.filters}</span><span class="count" aria-hidden="true" hidden></span></button>
  <ul class="cats">${data.categories.map((c) => `<li data-cat-item="${c.id}"><a href="#${c.id}" data-cat="${c.id}" aria-current="false">${esc(t(c.name))}</a></li>`).join('')}</ul>
</div></nav>`;
}

/** @param {Dish['price']} p */
function renderPrice(p) {
  if (typeof p === 'number') return `<p class="price">${eur(p)}</p>`;
  return `<p class="price price-multi">${p.map((o) => `<span><span class="opt-label">${esc(t(o.label))}</span>${eur(o.amount)}</span>`).join('')}</p>`;
}

/** @param {Dish} d */
function renderDish(d) {
  const u = ui();
  const tags = d.tags || [];
  const house = tags.includes('house');
  const al = allergensOf(d.allergens);
  const names = al.map((a) => t(a.name));
  const chips = [
    tags.includes('vegan') ? `<li class="tag">${icon('sprout')}${u.vegan}</li>`
      : tags.includes('vegetarian') ? `<li class="tag">${icon('leaf')}${u.vegetarian}</li>` : '',
    tags.includes('spicy') ? `<li class="tag tag-spicy">${icon('flame')}${u.spicy}</li>` : ''
  ].join('');
  const alHtml = al.length
    ? `<button type="button" class="al-btn" aria-expanded="false" aria-controls="al-${d.id}" title="${esc(names.join(', '))}">`
      + `<span class="sr-only">${u.allergens}: ${esc(names.join(', '))}</span>`
      + `<span class="al-label" aria-hidden="true">${u.allergens}</span>`
      + al.map((a) => `<span class="al-n" aria-hidden="true">${a.n}</span>`).join('')
      + `${icon('chevron', 'chev')}</button>`
    : `<span class="al-none">${u.noAllergens}</span>`;
  return `<li class="dish${house ? ' is-house' : ''}${d.photo ? ' has-photo' : ''}" id="d-${esc(d.id)}">
  ${house ? `<p class="house-label">${icon('star')}${u.house}</p>` : ''}
  <div class="dish-main">${d.photo ? `<img class="photo" src="${esc(d.photo)}" alt="" width="120" height="120" loading="lazy" decoding="async">` : ''}<div>
    <div class="dish-top"><h3 class="dish-name">${esc(t(d.name))}</h3>${renderPrice(d.price)}</div>
    ${d.description ? `<p class="desc">${esc(t(d.description))}</p>` : ''}
    ${d.available ? `<p class="avail">${icon('calendar')}${esc(t(d.available))}</p>` : ''}
    <div class="meta">${chips ? `<ul class="tags">${chips}</ul>` : ''}${alHtml}</div>
    ${al.length ? `<p class="al-names" id="al-${d.id}" hidden><b>${u.allergens}:</b> ${al.map((a) => `${a.n} ${esc(t(a.name))}`).join(' · ')}</p>` : ''}
  </div></div>
</li>`;
}

/** @param {Category} c */
function renderCategory(c) {
  return `<section class="cat" id="${esc(c.id)}" aria-labelledby="h-${esc(c.id)}">
  <div class="cat-head"><h2 id="h-${esc(c.id)}" tabindex="-1">${esc(t(c.name))}</h2>${c.note ? `<p class="cat-note">${esc(t(c.note))}</p>` : ''}</div>
  <ul class="dishes">${c.dishes.map(renderDish).join('')}</ul>
</section>`;
}

function renderFooter() {
  const u = ui();
  const cover = R.cover;
  const coverAl = cover?.allergens ? allergensOf(cover.allergens) : [];
  const demo = data.demo;
  return `<footer class="foot">
  <section class="box notice" aria-labelledby="h-allergy">
    <h2 id="h-allergy">${icon('info')}${u.allergyTitle}</h2>
    <p class="lead">${u.allergyLead}</p>
    <p class="muted">${u.allergyText}</p>
  </section>
  <section class="box" aria-labelledby="h-legend">
    <h2 id="h-legend">${u.legend}</h2>
    <ol class="legend">${ALLERGENS.map((a) => `<li><span class="al-n" aria-hidden="true">${a.n}</span><span>${esc(t(a.long))}</span></li>`).join('')}</ol>
  </section>
  ${cover ? `<section class="box" aria-labelledby="h-cover">
    <div class="cover-row"><h2 id="h-cover">${u.cover}</h2><p class="price">${eur(cover.amount)} <span class="muted">${u.perPerson}</span></p></div>
    ${cover.note || coverAl.length ? `<p class="muted">${esc(t(cover.note))}${coverAl.length ? ` ${u.allergens}: ${coverAl.map((a) => `${a.n} ${esc(t(a.name)).toLowerCase()}`).join(', ')}.` : ''}</p>` : ''}
  </section>` : ''}
  <section class="box" aria-labelledby="h-hours">
    <h2 id="h-hours">${icon('clock')}${u.hours}</h2>
    ${hoursList()}
    ${R.hoursNote ? `<p class="muted">${esc(t(R.hoursNote))}</p>` : ''}
  </section>
  <section class="box where" aria-labelledby="h-where">
    <h2 id="h-where">${icon('pin')}${u.where}</h2>
    <address>${esc(R.name)}<br>${esc(R.address.street)}, ${esc(R.address.city)}<br>${
      demo ? esc(R.phoneDisplay) : `<a href="tel:${esc(R.phone)}">${esc(R.phoneDisplay)}</a>`}</address>
  </section>
  ${R.notes?.length ? `<section class="box" aria-labelledby="h-info"><h2 id="h-info">${u.info}</h2><ul class="notes">${R.notes.map((n) => `<li>${esc(t(n))}</li>`).join('')}</ul></section>` : ''}
  ${demo ? `<div class="pitch"><p>${esc(t(demo.pitch))}</p><a class="btn" href="${esc(demo.url)}" target="_top">${esc(demo.url.replace(/^https?:\/\//, ''))}${icon('arrow')}</a></div>
  <p class="fineprint">${esc(t(demo.banner))} · <a href="${esc(demo.url)}" target="_top">${esc(t(demo.linkLabel))}</a></p>` : ''}
  ${!demo && data.credit ? `<p class="fineprint"><a href="${esc(data.credit.url)}">${esc(t(data.credit.label))}</a></p>` : ''}
</footer>`;
}

function renderSheets() {
  const u = ui();
  const hasDrinks = data.categories.some((c) => c.drinks);
  return `<dialog class="sheet" id="sheet-filters" aria-labelledby="t-filters">
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
      <div class="al-grid">${ALLERGENS.map((a) => `<label class="al-opt"><input type="checkbox" value="${a.id}"><span class="al-n" aria-hidden="true">${a.n}</span><span>${esc(t(a.name))}</span></label>`).join('')}</div>
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

function render() {
  const app = $id('app');
  if (!app) return;
  const u = ui();
  root.lang = lang;
  document.title = `${u.menu} · ${R.name}${data.demo ? ` (${u.demo})` : ''}`;
  app.innerHTML = `${renderBanner()}<div class="page">${renderHeader()}${renderBar()}
<main id="menu">
  <div class="filter-summary" hidden><p></p><button type="button" class="link-btn" data-action="reset">${u.reset}</button></div>
  ${data.categories.map(renderCategory).join('')}
  <div class="empty" hidden>${icon('plate')}<h2>${u.emptyTitle}</h2><p>${u.emptyText}</p><button type="button" class="btn" data-action="reset">${u.resetFilters}</button></div>
</main>${renderFooter()}</div>${renderSheets()}`;

  // a photo that doesn't exist (yet) just disappears: the card is designed to work without it
  app.querySelectorAll('img.photo').forEach((img) => {
    const drop = () => { img.closest('.dish')?.classList.remove('has-photo'); img.remove(); };
    if (img instanceof HTMLImageElement && img.complete && !img.naturalWidth) drop();
    else img.addEventListener('error', drop, { once: true });
  });
  const logo = app.querySelector('img.logo');
  logo?.addEventListener('error', () => logo.remove(), { once: true });

  observeBar();
  updateStatus();
  applyFilters();
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

  const count = activeCount();
  const empty = document.querySelector('.empty');
  if (empty instanceof HTMLElement) empty.hidden = !nothing;

  // filter button badge
  const btn = document.querySelector('.filter-btn');
  const badge = btn?.querySelector('.count');
  if (btn && badge instanceof HTMLElement) {
    badge.hidden = count === 0;
    badge.textContent = String(count);
    btn.toggleAttribute('data-active', count > 0);
    if (count) btn.setAttribute('aria-label', u.filtersActive(count)); else btn.removeAttribute('aria-label');
  }

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

  // controls in the sheet
  document.querySelectorAll('[data-diet]').forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute('data-diet') === state.diet)));
  document.querySelector('[data-gf]')?.setAttribute('aria-pressed', String(state.exclude.has('gluten')));
  document.querySelectorAll('.al-opt input').forEach((i) => {
    if (i instanceof HTMLInputElement) i.checked = state.exclude.has(/** @type {AllergenId} */ (i.value));
  });
  const show = document.querySelector('[data-show-count]');
  if (show) show.textContent = u.show(food);
  spy();
}

function resetFilters() {
  state.diet = null;
  state.exclude.clear();
  applyFilters();
}

/* ---------- sticky bar: height + scrollspy ---------- */

/** @type {ResizeObserver | null} */
let barObserver = null;
function observeBar() {
  const bar = document.querySelector('.bar');
  if (!bar) return;
  barObserver?.disconnect();
  const set = () => root.style.setProperty('--bar-h', `${Math.round(bar.getBoundingClientRect().height)}px`);
  if ('ResizeObserver' in window) { barObserver = new ResizeObserver(set); barObserver.observe(bar); }
  set();
}

let lockSpy = 0;
/** @type {string | null} */
let current = null;

/** @param {string | null} id */
function setCurrent(id) {
  if (id === current && document.querySelector(`.cats a[aria-current="true"]`)) return;
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
  openSheets.forEach((id) => /** @type {HTMLDialogElement | null} */ ($id(id))?.showModal());
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

/* ---------- events (delegated once, so they survive re-renders) ---------- */

/** @param {string} id */
function openSheet(id) {
  const d = $id(id);
  if (d instanceof HTMLDialogElement && !d.open) d.showModal();
}

let filtersAtOpen = '';
const filterKey = () => `${state.diet}|${[...state.exclude].sort().join(',')}`;

document.addEventListener('click', (e) => {
  const target = /** @type {Element} */ (e.target);
  if (target instanceof HTMLDialogElement) { target.close(); return; } // tap on the backdrop

  const langBtn = target.closest('[data-lang]');
  if (langBtn) { setLang(asLang(langBtn.getAttribute('data-lang')) || lang, true); return; }

  const cat = target.closest('a[data-cat]');
  if (cat) { e.preventDefault(); goTo(cat.getAttribute('data-cat') || ''); return; }

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

  const al = target.closest('.al-btn');
  if (al) {
    const open = al.getAttribute('aria-expanded') !== 'true';
    al.setAttribute('aria-expanded', String(open));
    const panel = $id(al.getAttribute('aria-controls') || '');
    if (panel) panel.hidden = !open;
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

// After closing the filter sheet with new filters, bring the (shorter) menu back into view.
document.addEventListener('close', (e) => {
  if (!(e.target instanceof HTMLDialogElement) || e.target.id !== 'sheet-filters') return;
  if (filterKey() === filtersAtOpen) return;
  const main = $id('menu');
  if (main && main.getBoundingClientRect().top < 0) {
    scrollTo({ top: scrollY + main.getBoundingClientRect().top - (document.querySelector('.bar')?.getBoundingClientRect().height || 0), behavior: 'auto' });
  }
}, true);

/** @type {number} */
let raf = 0;
addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; spy(); }); }, { passive: true });

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
