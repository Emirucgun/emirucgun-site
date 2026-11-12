# emirucgun.com

Personal site, designed in the visual language of Apple Wallet. Static HTML, CSS and a little JavaScript — no build step, no framework.

## Structure
- `index.html` — the whole site, styles included: a stack of Wallet-style cards (Profile, Flo internship, four projects, Writing, Contact).
  Each card's detail content lives in a hidden `.detail` block inside its `<article class="pass">`.
  The stylesheet is inlined in `<head>` on purpose, so the first paint needs one request. It holds the iOS system colours
  (light/dark), the card stack, the card art (CSS and inline SVG, no images) and the detail-sheet components.
- `main.js` — card open/close (FLIP animation), previous/next between cards, history/deep links, menu, theme, QR pass, copy, share.
- `emir-ucgun.vcf` — the contact card behind "Save Contact".
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
- **Contact details** appear in three places: the Contact card in `index.html`, `emir-ucgun.vcf`, and `og.png`.

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
