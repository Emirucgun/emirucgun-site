// @ts-check
/* Neutral theme for any restaurant (trattoria, bistrot, caffè): cream paper, one deep wine accent,
   no ornaments. Uses the studio's own Fraunces + Inter, so nothing new to download. A good start
   for a private preview: change `primary` to the restaurant's colour (4.5:1 on `bg`). */
/** @type {import('../types').Theme} */
export default {
  name: 'classico',
  colors: {
    bg: '#FAF7F2', surface: '#FFFFFF', text: '#1D1A16', muted: '#5A5248',
    primary: '#7A2333', onPrimary: '#FFFFFF',
    accent: '#B9895A', accent2: '#7A2333',
    line: '#E8E1D6', band: '#2A211C', onBand: '#F3ECE2'
  },
  fonts: {
    faces: [
      { family: 'Fraunces', src: '/studio/fonts/Fraunces-var-latin.woff2', weight: '300 800' },
      { family: 'Inter', src: '/studio/fonts/Inter-var-latin.woff2', weight: '400 700' }
    ],
    display: "'Fraunces', Georgia, 'Times New Roman', serif",
    body: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    preload: ['/studio/fonts/Fraunces-var-latin.woff2', '/studio/fonts/Inter-var-latin.woff2'],
    displayWeight: 600,
    displayTracking: '-.015em'
  },
  ornaments: 'none',
  texture: 'none',
  layout: 'centered',
  radius: 12
};
