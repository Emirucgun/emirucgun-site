# studio.emirucgun.com

The overview of the studio site (pages, what to edit, scripts) is in the repository's main `README.md`.
Prices and settings: `studio/config.js`. Restaurant website template: `studio/sites/README.md`.

## Before/after examples

The before/after slider on the home page and on `/esempi` shows the dishes listed in **`studio/before-after.js`**.
With one entry it shows that dish; with two or more, a row of dish names appears above the slider and visitors
switch between them (the delivery-app card on `/esempi` always shows the first one).

Only real photos of a real client's dishes, with their permission. No generated images, nothing from the internet:
the site promises it.

To add one:

1. Put the two originals somewhere in the repo, e.g. `studio/ba/carbonara-before.jpg` and `studio/ba/carbonara-after.jpg`.
   Same framing in both; landscape about 4:3 works best (the slider is 4:3 and crops to fit).
2. Make the responsive copies, **480, 800 and 1200 px wide, AVIF + WebP**, from the repository root:

   ```bash
   python3 studio/tools/optimize-images.py studio/ba/carbonara-before.jpg studio/img/ba/carbonara-before 480 800 1200
   python3 studio/tools/optimize-images.py studio/ba/carbonara-after.jpg  studio/img/ba/carbonara-after  480 800 1200
   ```

   This writes `studio/img/ba/carbonara-before-480.avif`, `…-480.webp`, `…-800.*`, `…-1200.*` and the same for `after`.
3. Add an entry to `studio/before-after.js` (there is a commented example at the end of the list): `id`, the two paths
   **without** `-<width>.<ext>`, `widths: [480, 800, 1200]`, `width`/`height` of the 1200 px file (the script prints it),
   the dish name and both alt texts in Italian and English, and optionally `credit` (restaurant name, IT and EN).
4. Check: `node studio/tools/check-site.mjs` (every file exists, every field is there) and
   `node studio/tools/run-site-test.cjs` (the tabs work).

The first entry of the list is also written in the HTML (shown before JavaScript loads). To put a new dish first,
change the image paths in `studio/index.html` (`#prima-dopo`) and `studio/tools/pages/esempi.inc` (`#foto` and the app
card), then run `python3 studio/tools/build-pages.py`. `check-site.mjs` fails if they differ from the list.
