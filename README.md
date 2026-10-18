# emirucgun.com

Personal site — static HTML, CSS and a little JavaScript. No build step, no framework.

## Pages
- `index.html` — home
- `work.html` — selected projects
- `writing.html` — essays published on Medium
- `about.html` — background, experience, education

## Stack
Plain HTML/CSS/JS. Self-hosted webfonts (Oswald, Inter, JetBrains Mono) in `fonts/`.
Deployed on Vercel from the `main` branch.

## Local preview
Open `index.html` in a browser, or run `python3 -m http.server` and visit `localhost:8000`.

## Theme
Dark and light themes share one set of CSS custom properties in `:root` and
`[data-theme="light"]`. The theme follows the operating system on first visit,
then a header button (or the `T` key) overrides it; the choice is stored in `localStorage`.
A tiny inline script in `<head>` applies the theme before paint, so there is no flash.

## Interactions
`main.js` — no dependencies:
- scroll progress line under the header
- cursor spotlight and hero parallax (desktop, fine pointer only)
- magnetic hover on selected links
- copy-to-clipboard on the email address
- mobile menu, scroll reveals, cross-page transitions (`@view-transition`)
Everything is disabled under `prefers-reduced-motion`.

## Editing
Every page shares `style.css`. Content lives directly in the HTML — no templating.
When adding a project: copy a `.row` block in `work.html`, bump the index number, update the link.
When adding an essay: copy a `.post` block in `writing.html` (and the two most recent on `index.html`).

## Deploy
Hosted on Vercel, connected to this repository (`main` branch, auto-deploy on push).

Vercel project settings that must stay this way:
- Framework Preset: **Other**
- Build Command: *(empty)*
- Output Directory: *(empty)*
- Install Command: *(empty)*

There is no build step — the repository root is served as-is.
