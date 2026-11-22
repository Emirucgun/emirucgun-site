# emirucgun.com

Personal site, designed in the visual language of Apple Wallet. Static HTML, CSS and a little JavaScript — no build step, no framework.

## Structure
- `index.html` — the whole site, styles included: a stack of Wallet-style cards (Profile, Flo internship, four projects, Writing, Contact).
  Each card's detail content lives in a hidden `.detail` block inside its `<article class="pass">`.
  The stylesheet is inlined in `<head>` on purpose, so the first paint needs one request. It holds the iOS system colours
  (light/dark), the card stack, the card art (CSS and inline SVG, no images) and the detail-sheet components.
- `main.js` — card open/close (FLIP animation), previous/next between cards, history/deep links, menu, theme, QR pass, copy, share.
- `Emir-Ucgun-CV.pdf` — the CV behind every "CV" button. Replace the file to update it; the name stays the same.
- `emir-ucgun.vcf` — the contact card behind the "Save contact" button.
- `og.png`, `apple-touch-icon.png` — link-preview image and home-screen icon.
- `/about`, `/work`, `/writing` redirect to `/#profile`, `/#white-noise`, `/#writing` (see `vercel.json`).

## How the Wallet interaction works
Tapping a card copies its face into a fixed sheet, moves the real `.detail` node in beneath it, and animates the
copy from the card's old position (FLIP) while the other cards drop to the bottom. Only `transform` and `opacity`
are animated, so it stays on the compositor. Every card has a deep link (`/#ghosted`); back/forward and the ✕
button close it. Inside a sheet, the Previous/Next tiles at the bottom (or ← →) move through the stack without
going back. A tap that lands while an animation is running is queued and runs when it ends.
Without JavaScript the cards render as a plain list with all details visible.
Motion is skipped under `prefers-reduced-motion`.

## Editing
- **New project:** copy one of the project `<article class="pass">` blocks in `index.html`, give it a new `id`,
  `data-title`, `data-tag` (the short label shown in the menu) and `style="--i:N;--k:…"` (`--i` is its position in the
  stack, `--k` its colour for the menu and the Previous/Next tiles), and add a `.c-xxx` card-art class in the
  `<style>` block. Keep `data-kind="project"`: the ••• menu builds its Projects section from those cards.
- **New essay:** add a `.row` to the Writing card's "Latest Essays" list.
- Only the top ~60px of each card shows in the stack, so put the card's name in `.c-top`.
- **Card text must stay readable:** every card colour was picked for at least 4.5:1 contrast against its text.
  Check a new colour pair before using it.
- **Image art instead of CSS art:** put `<img class="c-art" src="/cards/name.webp" alt="">` as the first child of a
  card's `<button class="card …">`. It fills the card and the text stays on top. Export at 1040 × 656 px
  (the card is 1.586 : 1) and keep the top strip calm, since the title sits on it.
- **QR code:** the pass under "Show QR Code" encodes `https://www.emirucgun.com` as a single SVG path in `index.html`
  (the `<dialog id="qr">`). If the address changes, generate a new one and replace the path and its `viewBox`.
- **Contact details** appear in four places: the Contact card in `index.html`, `emir-ucgun.vcf`, `Emir-Ucgun-CV.pdf`, and `og.png`.

## Fonts
SF Pro on Apple devices (system font — nothing is downloaded). Everywhere else, a self-hosted Inter variable font
(`fonts/Inter-var-*.woff2`, weights 400–700).

## Theme
Follows the OS on first visit; the sun/moon button overrides it and the choice is stored in `localStorage`.
An inline script in `<head>` applies it before first paint.

## Local preview
`python3 -m http.server` and visit `localhost:8000` (redirects only work on Vercel).

## Deploy
Hosted on Vercel, connected to this repository (`main` branch, auto-deploy on push).
Vercel project settings: Framework Preset **Other**; Build, Output and Install commands empty.
The repository root is served as-is.

## Studio subdomain (studio.emirucgun.com)
A sales site for Turin restaurants (dish photos for delivery apps and Google, Google Business Profile, IT/EN QR menu,
monthly management) lives in `studio/` and is served at **studio.emirucgun.com**. It does not touch any of the files above.
Every page has one goal: the visitor messages on WhatsApp (or requests the free review).

### Pages
| URL | File | Sections |
| --- | --- | --- |
| `/` | `studio/index.html` | Black Friday banner · hero with before/after slider · platform figures · 3 services · pricing · risk reversal · 4 FAQ + free-review form |
| `/esempi` | `studio/esempi/index.html` | photo before/after + delivery-app card · Google profile before/after · QR menu demo · social posts gallery |
| `/prezzi` | `studio/prezzi/index.html` | packages · comparison table · monthly plan · "Quanto vale una foto?" calculator · payment · full FAQ |
| `/come-funziona` | `studio/come-funziona/index.html` | 4 steps · shooting guide · six trust rules · about me |
| `/demo/menu` | `studio/demo/menu/` | the working menu demo (see its own README) |

The three subpages share their head, banner, header, CTA band, footer and sticky bar. Those parts are written by
`studio/tools/build-pages.py`; each page's own content is in `studio/tools/pages/*.inc`. Edit the `.inc` file (or the
shared parts in the script), then run `python3 studio/tools/build-pages.py`. The generated HTML is committed: Vercel
still serves the folder as-is, with no build step. `index.html` is written by hand.

### What to edit
- `studio/config.js`: **everything that changes**: WhatsApp number (with the 39 prefix), email, LinkedIn,
  the prefilled WhatsApp messages, and the **offer**: `offer.ends` (local time) + `offer.timeZone`, and every package's
  `offer` and `regular` price. Until `ends`, pages show the offer price with the regular one struck through, the banner and the
  countdown; from that moment on, for every visitor, only regular prices. Nothing else to change when the offer ends.
- Copy: both languages sit side by side as `<span lang="it">…</span><span lang="en">…</span>`; edit both.
- Prices in the HTML (`data-price="vis"` etc.) are only the no-JavaScript fallback; `site.js` fills them from `config.js`.
- `studio/img/`: AVIF + WebP sizes of the before/after photos (`dish-before-*`, `dish-after-*`) and the portrait (`emir-*`),
  made from `food-before-1.jpg`, `food-after-1.jpg` and `emir.jpg`. New before/after pairs: same framing, export 480/800/1200 px wide.
- Testimonials: a hidden section in `index.html` (`#testimonianze`), for real quotes only, with permission.
- Platform figures (home proof strip, calculator on `/prezzi`): Deliveroo up to +12% online orders with photos on 10% of the menu;
  DoorDash +13% sales on average with photos on half the menu. Keep them worded as the platforms' figures, never as a promise.

### Scripts
- `studio/studio.css`: one stylesheet for all four pages (mobile first). `studio/site.js`: language, prices, offer + countdown,
  WhatsApp links, mini form, calculator, before/after sliders, mobile menu, sticky bar, scroll reveal. `studio/posts-gallery.js`: the gallery on `/esempi`.
- `node studio/tools/check-site.mjs`: static checks: fallback prices = config, links and anchors, ids, images, IT/EN pairs, sitemap.
- `node studio/tools/site-test.cjs`: browser test with Playwright (run `npx serve -l 4173 .` from the repo root first):
  offer on/off around the end date, countdown, prices, WhatsApp links, slider, form, menu, sticky bar, calculator, EN.

### Routing and preview
- `middleware.js` serves `/` of the subdomain from `/studio`; the host-scoped rewrite in `vercel.json` serves every other
  subdomain path from `/studio/…`. Requests to `emirucgun.com/studio…` redirect to the subdomain.
- Local preview: `npx serve -l 4173 .` from the repo root, then `localhost:4173/studio/` (clean URLs like `/studio/prezzi` work).
