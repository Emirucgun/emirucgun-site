# Restaurant website template (`studio/sites/`)

One template, many restaurants: each site is **one data file** (restaurant, story, hours, contacts, menu, photos)
plus **one theme** (colours, fonts, ornaments, layout). The builder turns them into static HTML: no framework,
nothing to run on Vercel, about 45 KB per page (CSS inlined) plus one 3 KB script.

Every site gets four pages: home and menu, in Italian and English (`/…`, `/…/menu`, `/…/en`, `/…/en/menu`),
each with its own URL, `hreflang` links, canonical, Open Graph tags and schema.org JSON-LD
(`Restaurant` with opening hours on the home page, `Menu` with sections, items, prices and diets on the menu page).

```bash
node studio/sites/build.mjs                          # build every site (demos + previews)
node studio/sites/build.mjs anteprime/da-gino.js     # build one
node studio/tools/sites-test.cjs                     # browser test at 375 and 1280 px (--shots <dir> for screenshots)
node studio/tools/lighthouse-sites.cjs               # Lighthouse mobile on a demo (needs network for npx the first time)
node studio/tools/sites-screens.cjs                  # refresh the phone screenshots on /esempi
```

## Files

| File | What it is |
| --- | --- |
| `demos/*.js` | The three concept demos (fictional restaurants) → `studio/demo/<slug>/` |
| `anteprime/*.js` | Private previews for real prospects → `studio/anteprima/<slug>/` (see `anteprime/README.md`) |
| `anteprime/_esempio.js` | Empty template to copy for a new preview (files starting with `_` aren't built) |
| `themes/*.js` | `indiano`, `giapponese`, `messicano`, `classico` (neutral, for any Italian place) |
| `types.d.ts` | Types for data and theme files: VS Code autocompletes and flags mistakes. The restaurant and menu types are the menu demo's own (`studio/demo/menu/menu.types.d.ts`) |
| `render.mjs` | Builds the HTML of the four pages (all interface text, IT and EN, is here) |
| `ornaments.mjs` | The SVG ornament sets, drawn in code: block-print booti and kangura border; washi fibres, hinoki grain and one brush stroke; Talavera tile and papel picado |
| `site.css` | The one stylesheet, mobile first, with the three layouts (`centered`, `asymmetric`, `split`) |
| `site.js` | "Open now" from the hours, click-to-load Google map, demo notes, menu scrollspy. Pages work without it |
| `photos.py` | Placeholders for missing photos + WebP sizes (480/960) of every .jpg. Called by the builder |
| `build.mjs` | Validates and writes everything |
| `fonts/` | Self-hosted Latin subsets (SIL Open Font License, licence files alongside): Rozha One + Mukta, Shippori Mincho + Zen Kaku Gothic New, Alfa Slab One + Work Sans |

Shared with the menu demo: the 14-allergen list (`studio/demo/menu/allergens.js`) and the menu checks
(`studio/demo/menu/check-lib.mjs`: allergen hints from the descriptions, vegan/vegetarian consistency, hours,
prices, duplicate ids). The builder runs them on every site and **refuses to write a site with errors**. It also
checks that every text colour in the theme has at least 4.5:1 contrast.

## The three concept demos

All three are **fictional** (names checked against Turin restaurants in November 2026), labelled
"Progetto dimostrativo — ristorante inventato" on every page, `noindex`, fake phone numbers, and their buttons
show a "Demo: …" note instead of calling anyone.

| URL | Restaurant | Theme |
| --- | --- | --- |
| `/demo/ristorante-indiano` | Kesar Rasoi, North Indian (Lucknow) | jewel tones on ivory, block-print booti and kangura border, arched photo frame, Rozha One + Mukta (both by Indian foundries) |
| `/demo/ristorante-giapponese` | Kinari, Japanese home cooking (teishoku, izakaya) | kinari paper with washi fibres, sumi text, one persimmon brush stroke, hinoki band, asymmetric layout, Shippori Mincho + Zen Kaku Gothic New |
| `/demo/ristorante-messicano` | Cocina Jacaranda, Mexican (Puebla, Yucatán) | terracotta and earth, Talavera tiles as accents, one papel picado garland, sign-painted lettering, Alfa Slab One + Work Sans |

### Photo slots

The pages reference these files; until you add yours, each is a neutral "FOTO IN ARRIVO" placeholder of the right
size. Replace a file **keeping its name**, then run `node studio/sites/build.mjs` (it regenerates the WebP sizes)
and `node studio/tools/sites-screens.cjs` (the /esempi screenshots). Any size works (they're cropped to fit);
these are the shapes the layouts use:

| Folder | Files |
| --- | --- |
| `studio/demo/indiano/` | `hero.jpg` (portrait 4:5, ~1200 × 1500), `sala.jpg` (4:3, ~1200 × 900); dishes, square ~1200 × 1200: `galouti-kebab`, `biryani-lucknow`, `dal-makhani`, `aloo-tikki-chaat`, `murgh-tikka`, `butter-chicken`, `gulab-jamun` |
| `studio/demo/giapponese/` | `hero.jpg`, `banco.jpg` (the counter); dishes: `teishoku`, `shoyu-ramen`, `unagi-don`, `gyoza`, `karaage`, `sashimi` |
| `studio/demo/messicano/` | `hero.jpg`, `cucina.jpg` (hands pressing a tortilla); dishes: `tacos-cochinita`, `mole-poblano`, `tacos-al-pastor`, `guacamole`, `churros` |

The first three dishes of each list are the "piatti da provare" on the home page; all of them also show as
thumbnails in the menu. Use photos you have the rights to.

## Making a new site

Copy a data file (for a real prospect, start from `anteprime/_esempio.js`; steps in `anteprime/README.md`), pick a
theme or copy one, build. The fields are documented in `types.d.ts`; the menu fields are exactly the menu demo's
(`studio/demo/menu/README.md`, "Dish fields").

A new theme is a copy of `themes/classico.js` with other colours/fonts; set `ornaments: 'none'` unless you draw a
new set in `ornaments.mjs`. Keep restraint: one pattern used in two or three places, never as wallpaper, and
draw from the real design tradition of the cuisine, never from clichés.
