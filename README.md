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

## Editing
Every page shares `style.css`. Content lives directly in the HTML — no templating.
When adding a project: copy a `.row` block in `work.html`, bump the index number, update the link.
When adding an essay: copy a `.post` block in `writing.html` (and the two most recent on `index.html`).
