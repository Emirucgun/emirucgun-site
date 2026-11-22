// @ts-check
/* Indian theme: jewel tones (indigo, saffron, emerald) on a warm ivory base, a hand-block-print
   motif (booti) and a kangura-style border, an arched photo frame. Display: Rozha One (Indian Type
   Foundry); text: Mukta (Ek Type). Both SIL Open Font License, self-hosted in studio/sites/fonts. */
/** @type {import('../types').Theme} */
export default {
  name: 'indiano',
  colors: {
    bg: '#FBF5EA', surface: '#FFFDF8', text: '#2A2118', muted: '#66533F',
    primary: '#27346B', onPrimary: '#FFF8EC',
    accent: '#E09A1E', accent2: '#13664F',
    line: '#E8D9C1', band: '#1E2752', onBand: '#F6EBD6'
  },
  fonts: {
    faces: [
      { family: 'Rozha One', src: '/studio/sites/fonts/RozhaOne-400-latin.woff2', weight: '400' },
      { family: 'Mukta', src: '/studio/sites/fonts/Mukta-400-latin.woff2', weight: '400' },
      { family: 'Mukta', src: '/studio/sites/fonts/Mukta-600-latin.woff2', weight: '600' }
    ],
    display: "'Rozha One', Georgia, 'Times New Roman', serif",
    body: "'Mukta', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    preload: ['/studio/sites/fonts/RozhaOne-400-latin.woff2', '/studio/sites/fonts/Mukta-400-latin.woff2'],
    displayWeight: 400,
    displayTracking: '.005em'
  },
  ornaments: 'block-print',
  texture: 'none',
  layout: 'centered',
  radius: 6
};
