// @ts-check
/* PRIVATE PREVIEW — TEMPLATE. Copy this file to a new name (the name doesn't matter, the URL comes
   from `slug`), fill it in, then run:   node studio/sites/build.mjs
   The preview appears at studio.emirucgun.com/anteprima/<slug> (noindex, nofollow, not in the
   sitemap, not linked from anywhere). Full steps: README.md in this folder.
   Files whose name starts with "_" (like this one) are skipped by the builder. */

/** @type {import('../types').SiteData} */
export default {
  slug: '',                 // e.g. 'trattoria-da-gino-k7m2': lowercase, dashes, plus a short random ending
  kind: 'preview',
  theme: 'classico',        // 'classico' · 'indiano' · 'giapponese' · 'messicano' (studio/sites/themes/)
  restaurant: {
    name: '',
    kicker: { it: '', en: '' },     // 'Trattoria piemontese · San Salvario'
    cuisine: { it: '', en: '' },    // 'Cucina piemontese'
    servesCuisine: [''],            // in English, for Google: ['Italian', 'Piedmontese']
    intro: { it: '', en: '' },      // 1–3 sentences under the name
    story: {
      title: { it: '', en: '' },
      paragraphs: [{ it: '', en: '' }]
    },
    highlights: [                   // exactly three short facts
      { title: { it: '', en: '' }, text: { it: '', en: '' } },
      { title: { it: '', en: '' }, text: { it: '', en: '' } },
      { title: { it: '', en: '' }, text: { it: '', en: '' } }
    ],
    signature: ['', '', ''],        // ids of three dishes from `categories` below
    photos: {
      // the .jpg files go in studio/anteprima/<slug>/foto/ (any absolute path works); a missing file gets a placeholder
      hero: { src: '/studio/anteprima/SLUG/foto/hero.jpg', width: 1200, height: 1500, alt: { it: '', en: '' } },
      story: { src: '/studio/anteprima/SLUG/foto/sala.jpg', width: 1200, height: 900, alt: { it: '', en: '' } }
    },
    address: { street: '', city: '10100 Torino' },   // city with the CAP: '10124 Torino'
    phone: '+39',                   // for the Call button: '+390111234567'
    phoneDisplay: '',               // as people read it: '011 123 4567'
    // whatsapp: '39',              // digits only, with 39; delete the line to hide WhatsApp
    // booking: { url: '' },        // TheFork or the restaurant's own booking page; delete to use WhatsApp/phone
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=',   // their Google Maps link
    mapsQuery: '',                  // what the map shows: 'Via Roma 1, Torino'
    priceRange: '€€',
    // social: { instagram: '' },
    timeZone: 'Europe/Rome',
    hours: {                        // 24-hour clock; [] = closed; ['19:00', '01:00'] runs past midnight
      mon: [],
      tue: [['12:00', '14:30'], ['19:00', '22:30']],
      wed: [['12:00', '14:30'], ['19:00', '22:30']],
      thu: [['12:00', '14:30'], ['19:00', '22:30']],
      fri: [['12:00', '14:30'], ['19:00', '23:00']],
      sat: [['12:00', '14:30'], ['19:00', '23:00']],
      sun: [['12:00', '15:00']]
    },
    // hoursNote: { it: '', en: '' },
    // cover: { amount: 2, note: { it: '', en: '' }, allergens: [] },
    notes: [{ it: 'Prezzi in euro, IVA inclusa.', en: 'Prices in euros, VAT included.' }]
  },

  // The menu: exactly like studio/demo/menu/menu.data.js (see studio/demo/menu/README.md, "Dish fields").
  categories: [
    {
      id: 'antipasti',
      name: { it: 'Antipasti', en: 'Starters' },
      dishes: [
        { id: '', name: { it: '', en: '' }, description: { it: '', en: '' }, price: 0, allergens: [] }
      ]
    }
  ]
};
