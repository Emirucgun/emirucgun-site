// @ts-check
/* Ornament sets for the restaurant template, drawn here as SVG (no images, nothing licensed).
   Each set returns:
     css    extra CSS (patterns as data URIs) appended to the page's inline stylesheet
     parts  small inline SVG snippets the renderer drops into fixed slots:
            heroTop (above the hero), heroAccent (next to the title), mark (before a section
            eyebrow), divider (between sections), footerTop (above the footer)
   Restraint is the rule: each set uses its pattern in two or three places, never as wallpaper.
   Everything decorative is aria-hidden. */

/** @typedef {import('./types').Theme} Theme */

/** @param {string} svg */
const url = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}")`;
const XMLNS = "xmlns='http://www.w3.org/2000/svg'";

/** Small deterministic random generator, so the same build always draws the same texture. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n) => Math.round(n * 10) / 10;

/* ================= Indian: hand-block print ================= */

/** One booti (the small repeated flower of Sanganeri / Bagru block prints): six petals and a centre. */
function booti(cx, cy, r, petal, centre, petalOpacity = 1, centreOpacity = 1) {
  let p = '';
  for (let i = 0; i < 6; i++) {
    p += `<ellipse cx='${cx}' cy='${f(cy - r * 0.6)}' rx='${f(r * 0.3)}' ry='${f(r * 0.48)}' transform='rotate(${i * 60} ${cx} ${cy})'/>`;
  }
  return `<g fill='${petal}' fill-opacity='${petalOpacity}'>${p}</g><circle cx='${cx}' cy='${cy}' r='${f(r * 0.24)}' fill='${centre}' fill-opacity='${centreOpacity}'/>`;
}

/** @param {Theme['colors']} c */
function blockPrint(c) {
  // half-drop repeat of a small booti with four dots between, like a printed cotton
  const tile = `<svg ${XMLNS} width='56' height='56' viewBox='0 0 56 56'>
    ${booti(14, 14, 9, c.primary, c.accent, 0.11, 0.32)}${booti(42, 42, 9, c.accent2, c.accent, 0.10, 0.32)}
    <g fill='${c.primary}' fill-opacity='.14'><circle cx='42' cy='14' r='1.3'/><circle cx='14' cy='42' r='1.3'/></g></svg>`;
  // kangura border: the stepped battlement edge printed along the borders of many block-print cloths
  const kangura = (fill, dot) => `<svg ${XMLNS} width='24' height='16' viewBox='0 0 24 16'>
    <path fill='${fill}' d='M0 16V12h4V8h4V4h8v4h4v4h4v4z'/><circle cx='12' cy='9.5' r='1.6' fill='${dot}'/></svg>`;
  const line = `<svg ${XMLNS} width='12' height='6' viewBox='0 0 12 6'><circle cx='6' cy='3' r='1.4' fill='${c.accent}'/></svg>`;
  const mark = `<svg class="orn-mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${booti(12, 12, 11, c.accent2, c.accent).replace(/'/g, '"')}</svg>`;
  const divider = `<div class="orn-divider" aria-hidden="true"><span></span><svg viewBox="0 0 24 24" focusable="false">${booti(12, 12, 11, c.primary, c.accent).replace(/'/g, '"')}</svg><span></span></div>`;
  return {
    css: `
.orn-print{background-image:${url(tile)};background-size:56px 56px}
.orn-border{height:22px;background:${url(kangura(c.accent2, c.accent))} repeat-x left top/24px 16px,${url(line)} repeat-x left bottom/12px 6px}
.orn-border.down{transform:scaleY(-1)}
.hero{position:relative}
.hero::before{content:"";position:absolute;inset:0;background-image:${url(tile)};background-size:56px 56px;-webkit-mask-image:linear-gradient(#000 0,transparent 85%);mask-image:linear-gradient(#000 0,transparent 85%);pointer-events:none}
.hero > *{position:relative}
.hero-photo{border-radius:999px 999px var(--r) var(--r);outline:1.5px solid var(--accent);outline-offset:6px}
.hero-photo img{border-radius:inherit}
.orn-mark{width:22px;height:22px;flex:none}
.orn-divider{display:flex;align-items:center;gap:14px;max-width:320px;margin:0 auto;color:var(--accent)}
.orn-divider span{flex:1;height:1px;background:currentColor;opacity:.7}
.orn-divider svg{width:26px;height:26px}
.band-photo img,.dish-card .ph img{border-radius:var(--r)}
`,
    parts: {
      heroTop: '',
      heroAccent: '',
      mark,
      divider,
      footerTop: '<div class="orn-border down" aria-hidden="true"></div>',
      headerBottom: '<div class="orn-border" aria-hidden="true"></div>'
    }
  };
}

/* ================= Japanese: washi, wood, one brush stroke ================= */

/** @param {Theme['colors']} c */
function ink(c) {
  const r = rng(7);
  // washi: soft paper noise plus long, thin kozo fibres
  let fibres = '';
  for (let i = 0; i < 22; i++) {
    const x = r() * 260, y = r() * 260, len = 30 + r() * 70, a = r() * Math.PI;
    const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
    const cx = (x + x2) / 2 + (r() - 0.5) * 30, cy = (y + y2) / 2 + (r() - 0.5) * 30;
    fibres += `<path d='M${f(x)} ${f(y)}Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}' stroke-width='${f(0.4 + r() * 0.5)}'/>`;
  }
  const washi = `<svg ${XMLNS} width='260' height='260' viewBox='0 0 260 260'>
    <filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/>
    <feColorMatrix values='0 0 0 0 .36  0 0 0 0 .31  0 0 0 0 .24  0 0 0 .075 0'/></filter>
    <rect width='260' height='260' filter='url(#n)'/>
    <g fill='none' stroke='#7d6c52' stroke-opacity='.16' stroke-linecap='round'>${fibres}</g></svg>`;
  // hinoki wood: long gently waving grain lines
  let grain = '';
  for (let y = 4; y < 160; y += 5 + r() * 9) {
    let d = `M0 ${f(y)}`;
    for (let x = 0; x <= 480; x += 80) d += `Q${x + 40} ${f(y + (r() - 0.5) * 5)} ${x + 80} ${f(y + (r() - 0.5) * 2)}`;
    grain += `<path d='${d}' stroke-width='${f(0.5 + r() * 1.1)}'/>`;
  }
  const wood = `<svg ${XMLNS} width='480' height='160' viewBox='0 0 480 160'><g fill='none' stroke='#8b6a43' stroke-opacity='.13'>${grain}</g></svg>`;
  // the single brush stroke: heavy where the brush lands, tapering out, with a few dry-brush gaps
  const stroke = `<svg class="brush" viewBox="0 0 600 64" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <defs><mask id="dry"><rect width="600" height="64" fill="#fff"/>
      <g stroke="#000" stroke-linecap="round" fill="none"><path d="M300 29 C380 28 470 29 560 30" stroke-width="1.3"/><path d="M250 35 C340 35 430 34 520 33" stroke-width=".9"/><path d="M420 31 C470 31 520 31 585 31" stroke-width="1.1"/></g></mask></defs>
    <path mask="url(#dry)" fill="${c.accent}" d="M10 37C9 25 26 15 52 16C110 18 190 23 270 23C360 23 450 24 520 26C556 27 582 28 596 31C580 34 552 35 515 36C440 38 360 40 270 41C190 42 110 45 55 47C30 48 11 46 10 37Z"/></svg>`;
  return {
    css: `
body{background-image:${url(washi)};background-size:260px 260px}
.orn-wood{background-color:#E7D7BC;background-image:${url(wood)};background-size:480px 160px;color:var(--text)}
.brush{display:block;width:min(340px,78%);height:22px;margin-top:14px}
.native-v{font-family:var(--display);color:var(--muted)}
.hero-photo{border-radius:var(--r)}
.orn-divider{width:64px;height:1px;background:var(--text);opacity:.5;margin-left:0}
`,
    parts: { heroTop: '', heroAccent: stroke, mark: '', divider: '<div class="orn-divider" aria-hidden="true"></div>', footerTop: '', headerBottom: '' }
  };
}

/* ================= Mexican: Talavera tiles, one papel picado garland ================= */

/** @param {Theme['colors']} c */
function talavera(c) {
  const blue = c.accent, ochre = c.accent2;
  let petals = '';
  for (let i = 0; i < 8; i++) petals += `<ellipse cx='30' cy='19.5' rx='3.6' ry='8.5' transform='rotate(${i * 45} 30 30)'/>`;
  const tile = `<svg ${XMLNS} width='60' height='60' viewBox='0 0 60 60'>
    <rect width='60' height='60' fill='#FBF4E6'/>
    <g fill='${blue}'><circle r='11'/><circle cx='60' r='11'/><circle cy='60' r='11'/><circle cx='60' cy='60' r='11'/>${petals}</g>
    <g fill='#FBF4E6'><circle r='5'/><circle cx='60' r='5'/><circle cy='60' r='5'/><circle cx='60' cy='60' r='5'/></g>
    <g fill='${ochre}'><circle r='2.6'/><circle cx='60' r='2.6'/><circle cy='60' r='2.6'/><circle cx='60' cy='60' r='2.6'/>
      <circle cx='30' cy='30' r='4.6'/><path d='M30 0l3 4-3 4-3-4zM60 30l-4 3-4-3 4-3zM30 60l-3-4 3-4 3 4zM0 30l4-3 4 3-4 3z'/></g>
    <circle cx='30' cy='30' r='1.8' fill='${blue}'/></svg>`;
  // papel picado: seven paper flags on a string, each with cut-outs (fill-rule evenodd = holes)
  const colours = [c.primary, ochre, blue, '#A8325E', '#3E7550', c.primary, ochre];
  let flags = '';
  for (let i = 0; i < 7; i++) {
    const x = 6 + i * 84, w = 72, top = 8 + Math.sin((i / 6) * Math.PI) * 6, h = 54;
    let d = `M${x} ${f(top)}h${w}v${h - 8}`;
    for (let s = 0; s < 6; s++) d += `l-${w / 12} 8l-${w / 12} -8`; // zig-zag cut edge
    d += 'z';
    const cx = x + w / 2, cy = top + 24;
    d += `M${cx} ${f(cy - 11)}l8 11-8 11-8-11z`; // diamond
    for (const dx of [-24, -14, 14, 24]) d += `M${f(cx + dx)} ${f(cy - 2)}a2.6 2.6 0 1 0 .01 0z`; // dots
    for (let s = 0; s < 6; s++) d += `M${f(x + 6 + s * 11)} ${f(top + 7)}h6l-3 5z`; // little triangles
    flags += `<path fill="${colours[i]}" fill-rule="evenodd" d="${d}"/>`;
  }
  const garland = `<svg class="picado" viewBox="0 0 600 72" preserveAspectRatio="xMidYMin meet" aria-hidden="true" focusable="false">
    <path d="M0 8Q300 22 600 8" fill="none" stroke="${c.text}" stroke-opacity=".35" stroke-width="1.2"/>${flags}</svg>`;
  const mark = `<span class="orn-mark" aria-hidden="true"></span>`;
  return {
    css: `
.orn-tiles{height:30px;background:${url(tile)} repeat-x center/30px 30px;border-block:3px solid ${blue}}
.orn-tile-frame{background:${url(tile)} 0 0/48px 48px;padding:12px;border-radius:calc(var(--r) + 6px)}
.orn-mark{display:inline-block;width:20px;height:20px;flex:none;background:${url(tile)} center/20px 20px;border-radius:3px}
.picado{display:block;width:min(560px,100%);height:auto;margin:0 auto 6px}
h1,.sign{text-shadow:.05em .05em 0 ${ochre}}
.hero-photo{border-radius:var(--r);box-shadow:0 6px 0 ${blue}}
@media (min-width:900px){.hero-photo{border-radius:0;box-shadow:none;border-left:6px solid ${blue}}}
.orn-divider{display:none}
`,
    parts: {
      heroTop: garland,
      heroAccent: '',
      mark,
      divider: '',
      footerTop: '<div class="orn-tiles" aria-hidden="true"></div>',
      headerBottom: ''
    }
  };
}

/** @param {Theme} theme */
export function ornamentSet(theme) {
  const c = theme.colors;
  if (theme.ornaments === 'block-print') return blockPrint(c);
  if (theme.ornaments === 'ink') return ink(c);
  if (theme.ornaments === 'talavera') return talavera(c);
  return { css: '.orn-divider{display:none}', parts: { heroTop: '', heroAccent: '', mark: '', divider: '', footerTop: '', headerBottom: '' } };
}
