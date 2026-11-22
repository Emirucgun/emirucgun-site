# Private previews (`/anteprima/<slug>`)

A spec website for a real restaurant you're pitching, built with the same template as the concept demos.
It lives at **studio.emirucgun.com/anteprima/&lt;slug&gt;** and you send the link only to that restaurant.

What keeps it private:
- every page has `<meta name="robots" content="noindex, nofollow">`, and Vercel also sends an
  `X-Robots-Tag: noindex, nofollow` header for everything under `/anteprima/` (photos included);
- it is not in `sitemap.xml` and no page of the site links to it (`node studio/tools/check-site.mjs` fails if one does);
- `/anteprima/` is deliberately *not* in `robots.txt`: a blocked page can't be crawled, so Google would never
  see the `noindex`, and robots.txt is public anyway;
- a small banner on every page: "Anteprima riservata per *Nome*, preparata da Emir Uçgun Studio", with a WhatsApp link to you.

It is unlisted, not password-protected: anyone with the link can open it. Add a short random ending to the
slug (`da-gino-k7m2`) so it can't be guessed, and don't put anything there the restaurant hasn't published itself.

## New preview in 5 steps

1. **Copy the template:** `studio/sites/anteprime/_esempio.js` → `studio/sites/anteprime/da-gino.js`
   (any name without a leading `_`).
2. **Fill it in** from what's public: Google profile, their PDF menu, Instagram. Set `slug`
   (e.g. `trattoria-da-gino-k7m2`) and replace `SLUG` in the two photo paths with it. Pick a `theme`:
   `classico` fits most Italian places; `indiano`, `giapponese`, `messicano` are the three concept styles.
   For their own colour, copy `studio/sites/themes/classico.js` to a new file and change `primary`
   (the builder stops if text contrast is under 4.5:1).
   The menu uses the same fields as the menu demo (`studio/demo/menu/README.md`, "Dish fields"):
   allergens, tags, prices. Mark allergens you can't confirm with a comment and ask them.
3. **Photos (optional):** put `hero.jpg` (portrait, ~1200 × 1500) and `sala.jpg` (~1200 × 900) in
   `studio/anteprima/<slug>/foto/`, plus dish photos (square, ~1200 × 1200) at the `photo:` paths of their dishes.
   Missing ones become neutral placeholders. Use their own photos (from their Google profile, with the
   preview as the only use) or ones you took; never stock photos of other restaurants' food.
4. **Build and check:** `node studio/sites/build.mjs anteprime/da-gino.js`. It validates everything
   (menu, allergen hints, contrast) and writes `studio/anteprima/<slug>/` (home + menu, IT + EN).
   Then `node studio/tools/sites-test.cjs` tests it at 375 and 1280 px.
5. **Commit, push, send the link:** `https://studio.emirucgun.com/anteprima/<slug>`.

When they say no (or yes, and the site moves to its own domain), delete both the data file and the
`studio/anteprima/<slug>/` folder.

For a client who buys: change `kind` to `'client'`, add `origin: 'https://www.their-domain.it'` and
build: the banner disappears, pages become indexable, links start from `/`, canonical and JSON-LD
use their domain, and the output goes to `studio/sites/out/<slug>/`. To deploy it on their hosting, copy
that folder to the site root together with the files it references (`/studio/sites/site.js`, the theme's
fonts, the photos), keeping the same paths.
