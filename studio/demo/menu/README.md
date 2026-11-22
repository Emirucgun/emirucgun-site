# Digital menu (Menù digitale)

The live demo at **studio.emirucgun.com/demo/menu** (locally: `/studio/demo/menu/`), for the fictional
"Trattoria dei Tre Glicini". The same files are the template for every client menu.

Static HTML, CSS and one small JavaScript module. No framework, no build step, no backend, no external services.
About 110 KB on first load, fonts included. Lighthouse mobile: Performance, Accessibility and Best Practices 100.
(SEO is lower only because the demo is deliberately `noindex`.)

## Files

| File | What it is | Edit it? |
| --- | --- | --- |
| `menu.data.js` | **All the content**: restaurant info, hours, cover charge, colours, fonts, categories, dishes, prices, allergens, tags | **Yes, this is the one** |
| `index.html` | Page shell: title and link-preview tags, font preloads, icon sprite | Title/description/preview tags and paths only |
| `menu.js` | Renders everything from the data file; language switch, open/closed status, filters, scrollspy | No |
| `menu.css` | Design: light + dark mode, print stylesheet, motion | Not needed per client |
| `menu.types.d.ts` | Types for the data file, so VS Code autocompletes and underlines mistakes | No |
| `check.mjs` | Validates the data file and double-checks allergens against the dish descriptions | No, just run it |
| `allergens.js`, `check-lib.mjs` | The 14-allergen list and the validation rules, shared with the restaurant website template (`studio/sites/`) | No |
| `logo.svg` | The demo restaurant's logo (also used as its favicon) | Replace per client |

## New client menu in 10 minutes

1. **Copy the folder**, e.g. `studio/demo/menu/` → `studio/m/da-gino/` (or into the client's own site).
   For a whole website with the menu built in, use the template in `studio/sites/` instead.
2. **Fix the five absolute paths** at the top of `index.html` (`modulepreload` ×3, `stylesheet`, `script`)
   so they point at the new folder. They're absolute on purpose: on the subdomain the page is served at
   `/demo/menu` without a trailing slash, where relative paths would break.
3. **Edit `menu.data.js`**:
   - `restaurant`: name, kicker, tagline, address, phone (`+39…` for the Call button, plus how it's displayed),
     Google Maps link, `hours` (24-hour clock; a day missing or `[]` = closed; `["19:00", "01:00"]` runs past midnight),
     `hoursNote` (holidays), `cover` (coperto, with its allergens), `notes`.
   - `logo`: path, width and height of the client's logo, or delete the line for none.
   - `theme.accent` (one deep colour, **4.5:1 contrast** on the light background `#F7F2E9`) and
     `theme.accentDark` (the same colour lifted for dark mode, 4.5:1 on `#191412`). Check at webaim.org/resources/contrastchecker.
   - `theme.fonts`: keep Fraunces + Inter, or point to other self-hosted `.woff2` files. If you change them,
     update the two `<link rel="preload">` lines in `index.html` too.
   - `categories` → `dishes`: see the field list below.
   - `storageKey`: a key of its own per client (e.g. `'dagino-lang'`), so the language choice doesn't mix with other sites.
   - **Delete the `demo` block** (banner, fake Call/Directions). Optionally add `credit` (small link at the bottom).
4. **Edit `index.html`**: `<title>`, description and `og:` tags (WhatsApp and Google read these without running
   JavaScript), canonical URL, theme-color, and **remove** `<meta name="robots" content="noindex">`.
5. **Run the checker** and fix anything it reports:
   ```bash
   node studio/m/da-gino/check.mjs
   ```
6. Preview locally (below), on a real phone if you can, then commit.

## Dish fields

```js
{
  id: 'tajarin-ragu',                         // unique, lowercase-with-dashes
  name: { it: 'Tajarin al ragù', en: 'Tajarin with ragù' },   // or one string if it's the same: 'Bunet'
  description: { it: '…', en: '…' },          // optional
  price: 14,                                  // euros; shown as "14,00 €"
  // several sizes: price: [{ label: { it: 'calice', en: 'glass' }, amount: 6 }, { label: { it: 'bottiglia', en: 'bottle' }, amount: 26 }]
  allergens: ['gluten', 'eggs', 'celery', 'sulphites'],   // ALL of them, [] if none
  tags: ['vegetarian'],                       // 'vegetarian' | 'vegan' | 'spicy' | 'house'
  available: { it: 'Solo il giovedì', en: 'Thursdays only' },  // optional
  photo: '/studio/m/da-gino/photos/tajarin.webp'               // optional
}
```

- **Allergens** use the 14 EU allergens (Reg. UE 1169/2011), numbered 1–14 in the official order:
  `gluten, crustaceans, eggs, fish, peanuts, soy, milk, nuts, celery, mustard, sesame, sulphites, lupin, molluscs`.
  List hidden ones too: bread or breadcrumbs → `gluten`, stock or soffritto → `celery`, wine or vinegar → `sulphites`,
  butter/cream/cheese → `milk`, amaretti → `nuts`, mayonnaise → `eggs`, mostarda → `mustard`.
  `check.mjs` warns when a description mentions one of these ingredients but the allergen is missing.
  **Always confirm the final list with the restaurant**: the restaurant is legally responsible for it.
- **Tags**: `vegan` already counts as vegetarian. `house` (piatto della casa) gets a highlighted card: keep it to 2–3 dishes.
  Careful with `vegetarian`: Parmigiano and most aged cheeses use animal rennet, and panna cotta uses gelatine.
- **Photos** (optional): square, about 400 × 400 px, WebP, under 40 KB each, absolute path. Cards are designed to look
  complete without one; if a photo path is set but the file isn't there, the card simply shows without it.
- **Categories**: `id`, `name`, optional `note` (a line under the heading). Set `drinks: true` on drinks:
  the Vegetarian/Vegan filters then leave them visible (allergen filters still apply).

## How it behaves

- **Language**: Italian by default; IT | EN switch remembered in `localStorage` (inside try/catch, so private browsing
  works). `?lang=en` in the URL forces English, handy for a link sent to a tourist-heavy client.
  Prices always use the Italian format (`12,00 €`), like the printed menu.
- **Open/closed**: computed every 30 s from `hours`, in the restaurant's `timeZone` (not the phone's):
  "Aperto ora · chiude alle 22:30", "Chiude tra poco · alle 22:30" (last 30 minutes), "Chiuso · apre alle 19:00",
  "Chiuso · apre domani alle 12:00", "Chiuso · apre martedì alle 12:00".
- **Header buttons**: Call (`tel:`), Directions (Google Maps link), Hours (opens a sheet with the week, today highlighted).
  On the demo, Call and Directions show a short "Demo: …" note instead. Hours works, since it only shows the invented hours.
- **Filters**: Vegetarian, Vegan, Gluten-free, plus "hide dishes containing…" for any of the 14 allergens.
  Empty categories disappear from the page and the category bar; if nothing matches, an empty state offers to clear them.
- **Allergens on each dish**: numbered badges; tapping them shows the names. Screen readers hear the names directly.
- **Dark mode** follows the phone's setting. **Motion** is limited to small transitions and the sheets sliding up,
  all off with "reduce motion". **Print** gives a clean one-column version of the full menu (filters ignored).

## Local preview

```bash
python3 -m http.server
```

Then open `http://localhost:8000/studio/demo/menu/`. To see it as a phone would, use the browser's device toolbar at 375 px.
Test dark mode by switching the OS (or DevTools → Rendering → prefers-color-scheme).
