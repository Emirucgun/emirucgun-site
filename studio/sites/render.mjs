// @ts-check
/* Restaurant website template: turns one data file + one theme into static HTML.
   Four pages per site: home and menu, each in Italian and English (separate URLs, so Google indexes
   both languages and every page works without JavaScript). Called by build.mjs; no DOM needed.

   Page anatomy (home): banner (demo / preview only) · header · hero · three highlights · story ·
   signature dishes · hours + where + contacts · booking band · footer · phone action bar.
   Menu page: header · title · sticky category bar · dishes with allergens · allergy info · footer. */

import { ALLERGENS, ALLERGEN } from '../demo/menu/allergens.js';
import { ornamentSet } from './ornaments.mjs';

/** @typedef {import('./types').SiteData} SiteData */
/** @typedef {import('./types').Theme} Theme */
/** @typedef {import('./types').Localized} Localized */
/** @typedef {import('./types').Photo} Photo */
/** @typedef {'it' | 'en'} Lang */

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const SCHEMA_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** Interface text, the same for every restaurant. */
const UI = {
  it: {
    skip: 'Vai al contenuto', sections: 'Sezioni', menu: 'Menù', story: 'Storia', hours: 'Orari', where: 'Dove siamo',
    home: 'Home', langName: 'Italiano', switchTo: 'English', book: 'Prenota', call: 'Chiama', whatsapp: 'WhatsApp',
    directions: 'Indicazioni', fullMenu: 'Tutto il menù', signature: 'I piatti da provare',
    signatureLead: 'Tre piatti per conoscerci. Il menù completo è in italiano e inglese, con gli allergeni.',
    hoursTitle: 'Orari', today: 'oggi', closedDay: 'Chiuso', whereTitle: 'Dove siamo', contacts: 'Contatti',
    showMap: 'Mostra la mappa', openMaps: 'Apri in Google Maps', mapNote: 'La mappa si carica da Google solo se la aprite.',
    mapTitle: (/** @type {string} */ n) => `Mappa: ${n}`,
    bandTitle: 'Vi aspettiamo a tavola.', bandText: 'Prenotate in un minuto, oppure scriveteci su WhatsApp.',
    menuTitle: (/** @type {string} */ n) => `Il menù di ${n}`,
    menuLead: 'Prezzi in euro, IVA inclusa. Toccate «Allergeni» su un piatto per vederli.',
    categories: 'Categorie del menù', house: 'Piatto della casa', vegetarian: 'Vegetariano', vegan: 'Vegano', spicy: 'Piccante',
    allergens: 'Allergeni', noAllergens: 'Senza allergeni', allergyTitle: 'Allergie e intolleranze',
    allergyLead: 'Per allergie e intolleranze chiedete al personale prima di ordinare.',
    allergyText: 'I numeri accanto ai piatti indicano i 14 allergeni del Reg. UE 1169/2011. In cucina li usiamo tutti: non possiamo escludere tracce.',
    legend: 'Legenda allergeni', cover: 'Coperto', perPerson: 'a persona', info: 'Buono a sapersi',
    days: ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'],
    status: { open: 'Aperto ora · chiude alle {t}', soon: 'Chiude tra poco · alle {t}', closed: 'Chiuso · apre alle {t}', tomorrow: 'Chiuso · apre domani alle {t}', later: 'Chiuso · apre {d} alle {t}', none: 'Chiuso' },
    footerMade: 'Sito realizzato da', allRights: 'Tutti i diritti riservati.',
    instagram: 'Instagram', facebook: 'Facebook', backHome: 'Torna alla home',
    demoBanner: 'Progetto dimostrativo — ristorante inventato', demoBy: 'Un sito di Emir Uçgun Studio',
    demoNotes: { call: 'Demo: su un sito vero qui parte la chiamata.', whatsapp: 'Demo: su un sito vero qui si apre WhatsApp con il messaggio già scritto.', book: 'Demo: su un sito vero qui si apre la prenotazione.', directions: 'Demo: su un sito vero qui si apre Google Maps.' },
    demoPitch: 'Volete un sito così per il vostro ristorante, con il menù al posto del PDF?', demoPitchLink: 'Vedi Sito + Menù',
    previewBanner: (/** @type {string} */ n) => `Anteprima riservata per ${n}, preparata da Emir Uçgun Studio`,
    previewCta: 'Vi piace? Scrivetemi', previewWa: (/** @type {string} */ n) => `Buongiorno Emir, ho visto l'anteprima del sito per ${n}.`,
    bookMsg: (/** @type {string} */ n) => `Buongiorno, vorrei prenotare un tavolo da ${n}. Giorno, ora e persone: `,
    toastClose: 'Chiudi'
  },
  en: {
    skip: 'Skip to content', sections: 'Sections', menu: 'Menu', story: 'Our story', hours: 'Hours', where: 'Find us',
    home: 'Home', langName: 'English', switchTo: 'Italiano', book: 'Book', call: 'Call', whatsapp: 'WhatsApp',
    directions: 'Directions', fullMenu: 'Full menu', signature: 'Dishes to try',
    signatureLead: 'Three dishes to get to know us. The full menu is in Italian and English, with allergens.',
    hoursTitle: 'Opening hours', today: 'today', closedDay: 'Closed', whereTitle: 'Find us', contacts: 'Contact',
    showMap: 'Show the map', openMaps: 'Open in Google Maps', mapNote: 'The map only loads from Google if you open it.',
    mapTitle: (/** @type {string} */ n) => `Map: ${n}`,
    bandTitle: 'We look forward to seeing you.', bandText: 'Book in a minute, or message us on WhatsApp.',
    menuTitle: (/** @type {string} */ n) => `${n} menu`,
    menuLead: 'Prices in euros, VAT included. Tap “Allergens” on a dish to see them.',
    categories: 'Menu categories', house: 'House special', vegetarian: 'Vegetarian', vegan: 'Vegan', spicy: 'Spicy',
    allergens: 'Allergens', noAllergens: 'No allergens', allergyTitle: 'Allergies and intolerances',
    allergyLead: 'If you have allergies or intolerances, please ask our staff before ordering.',
    allergyText: 'The numbers next to each dish are the 14 allergens of EU Regulation 1169/2011. We use all of them in our kitchen, so we cannot rule out traces.',
    legend: 'Allergen key', cover: 'Cover charge', perPerson: 'per person', info: 'Good to know',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    status: { open: 'Open now · closes at {t}', soon: 'Closing soon · at {t}', closed: 'Closed · opens at {t}', tomorrow: 'Closed · opens tomorrow at {t}', later: 'Closed · opens {d} at {t}', none: 'Closed' },
    footerMade: 'Website by', allRights: 'All rights reserved.',
    instagram: 'Instagram', facebook: 'Facebook', backHome: 'Back to home',
    demoBanner: 'Concept project — fictional restaurant', demoBy: 'A website by Emir Uçgun Studio',
    demoNotes: { call: 'Demo: on a real site this starts the call.', whatsapp: 'Demo: on a real site this opens WhatsApp with the message ready.', book: 'Demo: on a real site this opens the booking page.', directions: 'Demo: on a real site this opens Google Maps.' },
    demoPitch: 'Want a website like this for your restaurant, with the menu instead of a PDF?', demoPitchLink: 'See Website + Menu',
    previewBanner: (/** @type {string} */ n) => `Private preview for ${n}, prepared by Emir Uçgun Studio`,
    previewCta: 'Like it? Message me', previewWa: (/** @type {string} */ n) => `Hello Emir, I've seen the website preview for ${n}.`,
    bookMsg: (/** @type {string} */ n) => `Hello, I'd like to book a table at ${n}. Day, time and number of people: `,
    toastClose: 'Close'
  }
};

/* ---------- helpers ---------- */

/** @param {unknown} s */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c);
/** @param {Localized | undefined} v @param {Lang} l */
const tx = (v, l) => (v == null ? '' : typeof v === 'string' ? v : v[l]);
const eurFmt = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });
/** Always "12,00 €", like the printed menu. @param {number} n */
const eur = (n) => eurFmt.format(n);
/** @param {string} name */
const icon = (name) => `<svg class="i" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
const ICONS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
<symbol id="i-phone" viewBox="0 0 24 24"><path d="M5 4h3.5l1.7 4.2-2.2 1.4a11 11 0 0 0 6.4 6.4l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z"/></symbol>
<symbol id="i-wa" viewBox="0 0 24 24"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12z"/><path d="M9.2 8.6c.3-.3.8-.3 1 .1l.7 1.3c.1.3.1.6-.1.8l-.4.4c.4.9 1.2 1.7 2.1 2.1l.4-.4c.2-.2.5-.3.8-.1l1.3.7c.4.2.4.7.1 1l-.6.6c-.5.5-1.3.6-1.9.3a7 7 0 0 1-3.6-3.6c-.3-.6-.2-1.4.3-1.9z"/></symbol>
<symbol id="i-cal" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.6"/></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></symbol>
<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
<symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4.5M12 8h.01"/></symbol>
<symbol id="i-insta" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.2 6.8h.01"/></symbol>
<symbol id="i-leaf" viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12"/></symbol>
<symbol id="i-sprout" viewBox="0 0 24 24"><path d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></symbol>
<symbol id="i-flame" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4.1 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></symbol>
<symbol id="i-star" viewBox="0 0 24 24"><path d="M12 2.5l2.1 7.4 7.4 2.1-7.4 2.1-2.1 7.4-2.1-7.4L2.5 12l7.4-2.1z" fill="currentColor" stroke="none"/></symbol>
<symbol id="i-chev" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
</svg>`;

/** "10124 Torino" → { postalCode, locality } */
function splitCity(city) {
  const m = /^(\d{5})\s+(.+)$/.exec(city.trim());
  return m ? { postalCode: m[1], locality: m[2] } : { postalCode: '', locality: city };
}

/** Groups days that share the same ranges: "martedì–sabato 12:00–14:30 · 19:00–22:30". */
function hoursRows(hours, l) {
  const u = UI[l];
  return DAYS.map((d, i) => {
    const r = hours[d] || [];
    return { i, day: u.days[i], text: r.length ? r.map(([a, b]) => `${a}–${b}`).join(' · ') : u.closedDay };
  });
}

/* ---------- the page builder ---------- */

/**
 * @param {SiteData} site
 * @param {Theme} theme
 * @param {{ css: string, base: string, origin: string, publicBase: string, studio: { whatsapp: string },
 *           picture: (p: Photo, l: Lang, sizes: string, opts?: { priority?: boolean, cls?: string }) => string,
 *           photoUrl: (src: string) => string }} ctx
 * @returns {{ path: string, html: string }[]}
 */
export function renderSite(site, theme, ctx) {
  const R = site.restaurant;
  const orn = ornamentSet(theme);
  const kind = site.kind;
  const demo = kind === 'demo';
  const css = ctx.css + orn.css;
  const dishById = Object.fromEntries(site.categories.flatMap((c) => c.dishes.map((d) => [d.id, { ...d, cat: c }])));
  const signature = R.signature.map((id) => dishById[id]).filter(Boolean);
  const addr = splitCity(R.address.city);

  /** URLs: `local` for links inside the pages (work on localhost and on the subdomain), `public` for canonical/OG. */
  const pathFor = (/** @type {Lang} */ l, /** @type {'home'|'menu'} */ page) => `${l === 'en' ? '/en' : ''}${page === 'menu' ? '/menu' : ''}`;
  const local = (l, page) => (ctx.base + pathFor(l, page)) || '/';
  const pub = (l, page) => ctx.origin + ((ctx.publicBase + pathFor(l, page)) || '/');

  const wa = (/** @type {Lang} */ l) => (R.whatsapp ? `https://wa.me/${R.whatsapp}?text=${encodeURIComponent(UI[l].bookMsg(R.name))}` : '');

  /** An action button: a real link, or on the demo a button that explains itself. */
  function action(/** @type {'call'|'whatsapp'|'book'|'directions'} */ type, /** @type {Lang} */ l, cls = 'btn') {
    const u = UI[l];
    const short = /\bab\b|hdr-book/.test(cls); // the phone bar and header have room for one word
    const label = { call: u.call, whatsapp: u.whatsapp, book: (!short && tx(R.booking?.label, l)) || u.book, directions: u.directions }[type];
    const ico = { call: 'phone', whatsapp: 'wa', book: 'cal', directions: 'pin' }[type];
    const href = { call: `tel:${R.phone}`, whatsapp: wa(l), book: R.booking?.url || wa(l) || `tel:${R.phone}`, directions: R.mapsUrl }[type];
    if (!href) return '';
    if (demo) return `<button type="button" class="${cls}" data-demo-note="${esc(u.demoNotes[type])}">${icon(ico)}<span>${esc(label)}</span></button>`;
    const ext = /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '';
    return `<a class="${cls}" href="${esc(href)}"${ext}>${icon(ico)}<span>${esc(label)}</span></a>`;
  }

  function banner(/** @type {Lang} */ l) {
    const u = UI[l];
    if (demo) {
      return `<aside class="banner" aria-label="${l === 'it' ? 'Avviso' : 'Notice'}"><p><b>${esc(u.demoBanner)}</b> · <a href="/studio/esempi#siti">${esc(u.demoBy)}</a></p></aside>`;
    }
    if (kind === 'preview') {
      const link = `https://wa.me/${ctx.studio.whatsapp}?text=${encodeURIComponent(u.previewWa(R.name))}`;
      return `<aside class="banner" aria-label="${l === 'it' ? 'Avviso' : 'Notice'}"><p><b>${esc(u.previewBanner(R.name))}</b> · <a href="${esc(link)}" target="_blank" rel="noopener">${esc(u.previewCta)}</a></p></aside>`;
    }
    return '';
  }

  function header(/** @type {Lang} */ l, /** @type {'home'|'menu'} */ page) {
    const u = UI[l];
    const other = l === 'it' ? 'en' : 'it';
    const cur = (p) => (p === page ? ' aria-current="page"' : '');
    return `<header class="hdr"><div class="wrap hdr-in">
  <a class="brand" href="${local(l, 'home')}">${esc(R.name)}</a>
  <a class="lang" href="${local(other, page)}" hreflang="${other}" lang="${other}"><span aria-hidden="true">${other.toUpperCase()}</span><span class="sr-only">${UI[other].langName}</span></a>
  ${action('book', l, 'btn btn-sm hdr-book')}
  <nav class="nav" aria-label="${u.sections}">
    <a href="${local(l, 'menu')}"${cur('menu')}>${u.menu}</a>
    <a href="${local(l, 'home')}#storia">${u.story}</a>
    <a href="${local(l, 'home')}#orari">${u.hours}</a>
    <a href="${local(l, 'home')}#dove">${u.where}</a>
  </nav>
</div></header>${orn.parts.headerBottom}`;
  }

  function footer(/** @type {Lang} */ l) {
    const u = UI[l];
    const social = [
      R.social?.instagram ? `<a href="${esc(R.social.instagram)}" target="_blank" rel="noopener">${icon('insta')}${u.instagram}</a>` : '',
      R.social?.facebook ? `<a href="${esc(R.social.facebook)}" target="_blank" rel="noopener">${u.facebook}</a>` : ''
    ].join('');
    const phone = demo ? esc(R.phoneDisplay) : `<a href="tel:${esc(R.phone)}">${esc(R.phoneDisplay)}</a>`;
    return `${orn.parts.footerTop}<footer class="foot"><div class="wrap foot-in">
  <div><p class="foot-name">${esc(R.name)}</p><p>${esc(tx(R.cuisine, l))}</p></div>
  <address>${esc(R.address.street)}<br>${esc(R.address.city)}<br>${phone}</address>
  <div class="foot-links"><a href="${local(l, 'menu')}">${u.menu}</a><a href="${local(l, 'home')}#orari">${u.hours}</a>${social}</div>
</div>
<div class="wrap foot-end">${demo
      ? `<p>${esc(u.demoPitch)} <a href="/studio/prezzi#sito">${esc(u.demoPitchLink)}</a></p><p>${esc(u.demoBanner)}. ${u.footerMade} <a href="/studio">Emir Uçgun Studio</a>.</p>`
      : `<p>© ${new Date().getFullYear()} ${esc(R.name)}. ${u.allRights} ${u.footerMade} <a href="https://studio.emirucgun.com">Emir Uçgun Studio</a>.</p>`}</div>
</footer>`;
  }

  function actionBar(/** @type {Lang} */ l) {
    return `<nav class="actionbar" aria-label="${l === 'it' ? 'Azioni rapide' : 'Quick actions'}">${action('call', l, 'ab')}${action('whatsapp', l, 'ab')}${action('book', l, 'ab ab-main')}</nav>`;
  }

  /* ---------- head: meta, OG, hreflang, JSON-LD ---------- */

  function head(/** @type {Lang} */ l, /** @type {'home'|'menu'} */ page, /** @type {object[]} */ ld) {
    const u = UI[l];
    const title = page === 'home'
      ? `${R.name} · ${tx(R.cuisine, l)} ${l === 'it' ? 'a' : 'in'} ${l === 'it' ? addr.locality : addr.locality === 'Torino' ? 'Turin' : addr.locality}`
      : `${u.menu} · ${R.name}`;
    const desc = page === 'home' ? tx(R.intro, l) : `${u.menuTitle(R.name)}: ${site.categories.map((c) => tx(c.name, l).toLowerCase()).join(', ')}. ${l === 'it' ? 'Prezzi e allergeni, in italiano e inglese.' : 'Prices and allergens, in Italian and English.'}`;
    const robots = kind === 'preview' ? 'noindex, nofollow' : kind === 'demo' ? 'noindex' : 'index, follow';
    const ogImg = ctx.origin + ctx.photoUrl(R.photos.hero.src);
    const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${theme.colors.primary}"/><text x="32" y="44" font-family="Georgia,serif" font-size="34" text-anchor="middle" fill="${theme.colors.onPrimary}">${esc(R.name.replace(/^(Ristorante|Trattoria|Cocina|Osteria)\s+/i, '').charAt(0))}</text></svg>`;
    return `<!doctype html>
<html lang="${l}" data-layout="${theme.layout}" data-orn="${theme.ornaments}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${pub(l, page)}">
<link rel="alternate" hreflang="it" href="${pub('it', page)}">
<link rel="alternate" hreflang="en" href="${pub('en', page)}">
<link rel="alternate" hreflang="x-default" href="${pub('it', page)}">
<meta name="theme-color" content="${theme.colors.bg}">
<meta name="color-scheme" content="light">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(R.name)}">
<meta property="og:locale" content="${l === 'it' ? 'it_IT' : 'en_GB'}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${pub(l, page)}">
<meta property="og:image" content="${esc(ogImg)}">
<meta property="og:image:alt" content="${esc(tx(R.photos.hero.alt, l))}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(favicon)}">
<link rel="apple-touch-icon" href="/studio/apple-touch-icon.png">
${theme.fonts.preload.map((p) => `<link rel="preload" href="${p}" as="font" type="font/woff2" crossorigin>`).join('\n')}
<style>${css}</style>
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n')}
<script src="/studio/sites/site.js" defer></script>
</head>
<body>
<a class="skip" href="#main">${u.skip}</a>
${ICONS}
${banner(l)}
${header(l, page)}
`;
  }

  function restaurantLd(/** @type {Lang} */ l) {
    /** @type {Record<string, string[]>} */
    const groups = {};
    DAYS.forEach((d, i) => (R.hours[d] || []).forEach(([a, b]) => { (groups[`${a}|${b}`] ||= []).push(SCHEMA_DAYS[i]); }));
    return {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      '@id': `${pub('it', 'home')}#restaurant`,
      name: R.name,
      description: tx(R.intro, l),
      url: pub(l, 'home'),
      image: [ctx.origin + ctx.photoUrl(R.photos.hero.src), ctx.origin + ctx.photoUrl(R.photos.story.src)],
      servesCuisine: R.servesCuisine,
      priceRange: R.priceRange,
      telephone: R.phone,
      ...(R.email ? { email: R.email } : {}),
      address: { '@type': 'PostalAddress', streetAddress: R.address.street, postalCode: addr.postalCode, addressLocality: addr.locality, addressCountry: 'IT' },
      openingHoursSpecification: Object.entries(groups).map(([k, days]) => {
        const [opens, closes] = k.split('|');
        return { '@type': 'OpeningHoursSpecification', dayOfWeek: days, opens, closes };
      }),
      hasMenu: pub(l, 'menu'),
      acceptsReservations: R.booking?.url || true,
      inLanguage: l,
      ...(R.social ? { sameAs: Object.values(R.social).filter(Boolean) } : {})
    };
  }

  function menuLd(/** @type {Lang} */ l) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Menu',
      name: UI[l].menuTitle(R.name),
      url: pub(l, 'menu'),
      inLanguage: l,
      hasMenuSection: site.categories.map((c) => ({
        '@type': 'MenuSection',
        name: tx(c.name, l),
        hasMenuItem: c.dishes.map((d) => {
          const tags = d.tags || [];
          const diet = tags.includes('vegan') ? ['https://schema.org/VeganDiet', 'https://schema.org/VegetarianDiet'] : tags.includes('vegetarian') ? ['https://schema.org/VegetarianDiet'] : [];
          const offers = typeof d.price === 'number'
            ? { '@type': 'Offer', price: d.price.toFixed(2), priceCurrency: 'EUR' }
            : d.price.map((p) => ({ '@type': 'Offer', name: tx(p.label, l), price: p.amount.toFixed(2), priceCurrency: 'EUR' }));
          return {
            '@type': 'MenuItem', name: tx(d.name, l),
            ...(d.description ? { description: tx(d.description, l) } : {}),
            offers,
            ...(diet.length ? { suitableForDiet: diet } : {})
          };
        })
      }))
    };
  }

  /* ---------- home ---------- */

  function hoursBlock(/** @type {Lang} */ l) {
    const u = UI[l];
    const data = { tz: R.timeZone, hours: R.hours, days: u.days, s: u.status };
    return `<div class="hours-card" data-hours="${esc(JSON.stringify(data))}">
      <p class="status" data-state="unknown" hidden><span class="dot" aria-hidden="true"></span><span class="status-text"></span></p>
      <dl class="hours">${hoursRows(R.hours, l).map((r) => `<div data-day="${r.i}"><dt>${esc(r.day)}<span class="today-tag"> · ${u.today}</span></dt><dd>${esc(r.text)}</dd></div>`).join('')}</dl>
      ${R.hoursNote ? `<p class="small muted-on">${esc(tx(R.hoursNote, l))}</p>` : ''}
    </div>`;
  }

  function home(/** @type {Lang} */ l) {
    const u = UI[l];
    const N = R.nativeName;
    const native = N ? `<p class="native" lang="${esc(N.lang)}">${esc(N.text)}</p>` : '';
    const sizesHero = theme.layout === 'split' ? '(min-width:900px) 50vw, 100vw' : '(min-width:900px) 46vw, calc(100vw - 32px)';
    const hero = `<section class="hero" aria-labelledby="h-hero">
  ${orn.parts.heroTop}
  <div class="wrap hero-in">
    <div class="hero-text">
      ${native}
      <p class="kicker">${esc(tx(R.kicker, l))}</p>
      <h1 id="h-hero">${esc(R.name)}</h1>
      ${orn.parts.heroAccent}
      <p class="intro">${esc(tx(R.intro, l))}</p>
      <div class="cta">${action('book', l, 'btn btn-primary')}<a class="btn btn-ghost" href="${local(l, 'menu')}">${u.menu}${icon('arrow')}</a></div>
      <p class="status-mini" data-status-mini hidden></p>
    </div>
    <figure class="hero-photo">${ctx.picture(R.photos.hero, l, sizesHero, { priority: true })}</figure>
  </div>
</section>`;

    const highlights = `<section class="highlights" aria-label="${l === 'it' ? 'In breve' : 'At a glance'}"><div class="wrap"><ul class="hl">${R.highlights
      .map((h) => `<li>${orn.parts.mark}<div><h2 class="hl-t">${esc(tx(h.title, l))}</h2><p>${esc(tx(h.text, l))}</p></div></li>`).join('')}</ul></div></section>`;

    const story = `<section id="storia" class="sec story" aria-labelledby="h-story"><div class="wrap story-in">
  <figure class="band-photo">${ctx.picture(R.photos.story, l, '(min-width:900px) 44vw, calc(100vw - 32px)')}</figure>
  <div class="story-text">
    <p class="eyebrow">${orn.parts.mark}${u.story}</p>
    <h2 id="h-story">${esc(tx(R.story.title, l))}</h2>
    ${R.story.paragraphs.map((p) => `<p>${esc(tx(p, l))}</p>`).join('')}
  </div>
</div></section>`;

    const dishes = `<section class="sec sig" aria-labelledby="h-sig"><div class="wrap">
  ${orn.parts.divider}
  <div class="sec-head"><p class="eyebrow">${orn.parts.mark}${u.menu}</p><h2 id="h-sig">${u.signature}</h2><p class="lead">${u.signatureLead}</p></div>
  <ul class="sig-list">${signature.map((d) => `<li class="dish-card">
    ${d.photo ? `<div class="ph">${ctx.picture({ src: d.photo, alt: d.name, width: 1200, height: 1200 }, l, '(min-width:900px) 30vw, calc(100vw - 32px)')}</div>` : ''}
    <div class="dc-body"><h3>${esc(tx(d.name, l))}</h3><p>${esc(tx(d.description, l))}</p><p class="price">${typeof d.price === 'number' ? eur(d.price) : eur(d.price[0].amount)}</p></div>
  </li>`).join('')}</ul>
  <p class="center"><a class="btn btn-primary" href="${local(l, 'menu')}">${u.fullMenu}${icon('arrow')}</a></p>
</div></section>`;

    const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(R.mapsQuery)}&output=embed`;
    const INFO = { 'block-print': 'info-band', ink: 'orn-wood', talavera: 'info-tiles', none: 'info-band' }[theme.ornaments];
    const info = `<section id="orari" class="sec info ${INFO}" aria-labelledby="h-hours"><div class="wrap info-in">
  <div class="info-col">
    <h2 id="h-hours">${icon('clock')}${u.hoursTitle}</h2>
    ${theme.ornaments === 'talavera' ? `<div class="orn-tile-frame">${hoursBlock(l)}</div>` : hoursBlock(l)}
  </div>
  <div class="info-col" id="dove">
    <h2>${icon('pin')}${u.whereTitle}</h2>
    <address class="addr">${esc(R.name)}<br>${esc(R.address.street)}<br>${esc(R.address.city)}</address>
    <div class="map" data-map="${esc(mapSrc)}" data-map-title="${esc(u.mapTitle(R.name))}">
      <svg class="map-art" viewBox="0 0 320 140" aria-hidden="true" focusable="false"><path d="M0 92 C60 80 90 104 160 90 S260 60 320 74" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="10"/><path d="M110 0 L132 140 M214 0 L196 140" stroke="currentColor" stroke-opacity=".22" stroke-width="7"/><path d="M160 26c-11 0-19 8-19 18 0 14 19 32 19 32s19-18 19-32c0-10-8-18-19-18z" fill="currentColor"/><circle cx="160" cy="44" r="6" fill="var(--map-bg)"/></svg>
      <div class="map-btns"><button type="button" class="btn btn-sm btn-light" data-map-load hidden>${u.showMap}</button>${demo ? action('directions', l, 'btn btn-sm btn-light') : `<a class="btn btn-sm btn-light" href="${esc(R.mapsUrl)}" target="_blank" rel="noopener">${u.openMaps}</a>`}</div>
      <p class="map-note" data-map-note hidden>${u.mapNote}</p>
    </div>
    <h2 class="mt">${u.contacts}</h2>
    <ul class="contacts">
      <li>${action('call', l, 'link-act')} <span class="muted-on">${esc(R.phoneDisplay)}</span></li>
      ${R.whatsapp ? `<li>${action('whatsapp', l, 'link-act')}</li>` : ''}
      ${R.email ? `<li><a class="link-act" href="mailto:${esc(R.email)}">${esc(R.email)}</a></li>` : ''}
      ${R.social?.instagram ? `<li><a class="link-act" href="${esc(R.social.instagram)}" target="_blank" rel="noopener">${icon('insta')}<span>Instagram</span></a></li>` : ''}
    </ul>
  </div>
</div></section>`;

    const band = `<section class="sec book-band" aria-labelledby="h-band"><div class="wrap book-in">
  <h2 id="h-band" class="sign">${u.bandTitle}</h2><p>${u.bandText}</p>
  <div class="cta">${action('book', l, 'btn btn-primary')}${action('whatsapp', l, 'btn btn-ghost')}</div>
</div></section>`;

    return head(l, 'home', [restaurantLd(l)])
      + `<main id="main">\n${hero}\n${highlights}\n${story}\n${dishes}\n${info}\n${band}\n</main>\n${footer(l)}\n${actionBar(l)}\n<div class="toast" role="status" aria-live="polite"></div>\n</body>\n</html>\n`;
  }

  /* ---------- menu ---------- */

  function dish(d, l) {
    const u = UI[l];
    const tags = d.tags || [];
    const al = d.allergens.map((id) => ALLERGEN[id]).filter(Boolean).sort((a, b) => a.n - b.n);
    const chips = [
      tags.includes('vegan') ? `<li class="tag">${icon('sprout')}${u.vegan}</li>` : tags.includes('vegetarian') ? `<li class="tag">${icon('leaf')}${u.vegetarian}</li>` : '',
      tags.includes('spicy') ? `<li class="tag tag-hot">${icon('flame')}${u.spicy}</li>` : ''
    ].join('');
    const price = typeof d.price === 'number'
      ? `<p class="price">${eur(d.price)}</p>`
      : `<p class="price price-multi">${d.price.map((o) => `<span><span class="opt">${esc(tx(o.label, l))}</span> ${eur(o.amount)}</span>`).join('')}</p>`;
    const alHtml = al.length
      ? `<details class="al"><summary><span class="al-label">${u.allergens}</span>${al.map((a) => `<span class="al-n" aria-hidden="true">${a.n}</span>`).join('')}<span class="sr-only">: ${al.map((a) => esc(tx(a.name, l))).join(', ')}</span>${icon('chev')}</summary><p>${al.map((a) => `${a.n} ${esc(tx(a.name, l))}`).join(' · ')}</p></details>`
      : `<span class="al-none">${u.noAllergens}</span>`;
    return `<li class="dish${tags.includes('house') ? ' is-house' : ''}${d.photo ? ' has-photo' : ''}" id="d-${esc(d.id)}">
  ${d.photo ? `<div class="dish-ph">${ctx.picture({ src: d.photo, alt: d.name, width: 1200, height: 1200 }, l, '96px')}</div>` : ''}
  <div class="dish-body">
    ${tags.includes('house') ? `<p class="house">${icon('star')}${u.house}</p>` : ''}
    <div class="dish-top"><h3>${esc(tx(d.name, l))}</h3>${price}</div>
    ${d.description ? `<p class="desc">${esc(tx(d.description, l))}</p>` : ''}
    ${d.available ? `<p class="avail">${esc(tx(d.available, l))}</p>` : ''}
    <div class="meta">${chips ? `<ul class="tags">${chips}</ul>` : ''}${alHtml}</div>
  </div>
</li>`;
  }

  function menu(/** @type {Lang} */ l) {
    const u = UI[l];
    const cover = R.cover;
    const coverAl = (cover?.allergens || []).map((id) => ALLERGEN[id]).filter(Boolean);
    const body = `<main id="main" class="menu-page">
<section class="menu-head"><div class="wrap">
  <p class="eyebrow">${orn.parts.mark}${esc(tx(R.cuisine, l))}</p>
  <h1>${esc(u.menuTitle(R.name))}</h1>
  <p class="lead">${u.menuLead}</p>
</div></section>
<nav class="cats" aria-label="${u.categories}"><div class="wrap"><ul>${site.categories.map((c) => `<li><a href="#${esc(c.id)}">${esc(tx(c.name, l))}</a></li>`).join('')}</ul></div></nav>
<div class="wrap menu-body">
${site.categories.map((c) => `<section class="cat" id="${esc(c.id)}" aria-labelledby="h-${esc(c.id)}">
  <div class="cat-head"><h2 id="h-${esc(c.id)}">${esc(tx(c.name, l))}</h2>${c.note ? `<p class="cat-note">${esc(tx(c.note, l))}</p>` : ''}</div>
  <ul class="dishes">${c.dishes.map((d) => dish(d, l)).join('')}</ul>
</section>`).join('\n')}
<div class="menu-info">
  <section class="box notice" aria-labelledby="h-allergy"><h2 id="h-allergy">${icon('info')}${u.allergyTitle}</h2><p><b>${u.allergyLead}</b></p><p class="muted">${u.allergyText}</p></section>
  <section class="box" aria-labelledby="h-legend"><h2 id="h-legend">${u.legend}</h2><ol class="legend">${ALLERGENS.map((a) => `<li><span class="al-n" aria-hidden="true">${a.n}</span><span>${esc(tx(a.long, l))}</span></li>`).join('')}</ol></section>
  ${cover ? `<section class="box" aria-labelledby="h-cover"><div class="cover-row"><h2 id="h-cover">${u.cover}</h2><p class="price">${eur(cover.amount)} <span class="muted">${u.perPerson}</span></p></div>${cover.note ? `<p class="muted">${esc(tx(cover.note, l))}${coverAl.length ? ` ${u.allergens}: ${coverAl.map((a) => `${a.n} ${esc(tx(a.name, l)).toLowerCase()}`).join(', ')}.` : ''}</p>` : ''}</section>` : ''}
  ${R.notes?.length ? `<section class="box" aria-labelledby="h-info"><h2 id="h-info">${u.info}</h2><ul class="notes">${R.notes.map((n) => `<li>${esc(tx(n, l))}</li>`).join('')}</ul></section>` : ''}
</div>
<p class="center menu-cta">${action('book', l, 'btn btn-primary')}<a class="btn btn-ghost" href="${local(l, 'home')}">${u.backHome}</a></p>
</div>
</main>`;
    return head(l, 'menu', [menuLd(l)]) + `${body}\n${footer(l)}\n${actionBar(l)}\n<div class="toast" role="status" aria-live="polite"></div>\n</body>\n</html>\n`;
  }

  return [
    { path: '', html: home('it') },
    { path: 'en', html: home('en') },
    { path: 'menu', html: menu('it') },
    { path: 'en/menu', html: menu('en') }
  ];
}
