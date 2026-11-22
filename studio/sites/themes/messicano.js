// @ts-check
/* Mexican theme: terracotta and warm earth on an adobe-cream base, Talavera tiles (cobalt and ochre)
   as accents only, one small papel picado garland over the hero, display lettering in the spirit of
   hand-painted shop signs (rótulos). Display: Alfa Slab One (Jm Solé); text: Work Sans (both SIL OFL). */
/** @type {import('../types').Theme} */
export default {
  name: 'messicano',
  colors: {
    bg: '#F7EDE0', surface: '#FFF8EE', text: '#2E1F17', muted: '#694C3A',
    primary: '#9E3F1C', onPrimary: '#FFF6EA',
    accent: '#1F3E8C', accent2: '#D99A2B',
    line: '#E8D3BC', band: '#5B2E1C', onBand: '#FBEBD8'
  },
  fonts: {
    faces: [
      { family: 'Alfa Slab One', src: '/studio/sites/fonts/AlfaSlabOne-400-latin.woff2', weight: '400' },
      { family: 'Work Sans', src: '/studio/sites/fonts/WorkSans-400-700-latin.woff2', weight: '400 700' }
    ],
    display: "'Alfa Slab One', 'Rockwell', 'Roboto Slab', Georgia, serif",
    body: "'Work Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    preload: ['/studio/sites/fonts/AlfaSlabOne-400-latin.woff2', '/studio/sites/fonts/WorkSans-400-700-latin.woff2'],
    displayWeight: 400,
    displayTracking: '.01em'
  },
  ornaments: 'talavera',
  texture: 'none',
  layout: 'split',
  radius: 10
};
