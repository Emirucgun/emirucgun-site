# emirucgun.com

Personal site, designed in the visual language of Apple Wallet. Static HTML, CSS and a little JavaScript — no build step, no framework.

## Structure
- `index.html` — the whole site: a stack of Wallet-style cards (Profile, Flo internship, four projects, Writing, Contact).
  Each card's detail content lives in a hidden `.detail` block inside its `<article class="pass">`.
- `style.css` — iOS system colours (light/dark), the card stack, card art (CSS only, no images), detail-sheet components.
- `main.js` — card open/close (FLIP animation), history/deep links, menu, theme, copy, share.
- `/about`, `/work`, `/writing` redirect to `/#profile`, `/#white-noise`, `/#writing` (see `vercel.json`).

## How the Wallet interaction works
Tapping a card copies its face into a fixed sheet, moves the real `.detail` node in beneath it, and animates the
copy from the card's old position (FLIP) while the other cards drop to the bottom. Only `transform` and `opacity`
are animated, so it stays on the compositor. Every card has a deep link (`/#ghosted`); back/forward and the ✕
button close it. Without JavaScript the cards render as a plain list with all details visible.
Motion is skipped under `prefers-reduced-motion`.

## Editing
- **New project:** copy one of the project `<article class="pass">` blocks in `index.html`, give it a new `id`,
  `data-title` and `style="--i:N"` (its position in the stack), and add a `.c-xxx` card-art class in `style.css`.
- **New essay:** add a `.row` to the Writing card's "Latest Essays" list.
- Only the top ~60px of each card shows in the stack, so put the card's name in `.c-top`.

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
