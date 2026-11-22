// @ts-check
/* Japanese theme: restraint. Unbleached-paper (kinari) base with a washi fibre texture, sumi ink
   text, one persimmon brush stroke as the only accent, a light hinoki wood band, asymmetric layout
   with generous whitespace. Display: Shippori Mincho; text: Zen Kaku Gothic New (both SIL OFL).
   Kanji fall back to the phone's own Japanese fonts (Hiragino, Noto Serif CJK), so nothing extra loads. */
/** @type {import('../types').Theme} */
export default {
  name: 'giapponese',
  colors: {
    bg: '#F4EFE4', surface: '#FAF7F0', text: '#262421', muted: '#5C574F',
    primary: '#2B2A28', onPrimary: '#F4EFE4',
    accent: '#A4472A', accent2: '#7C8466',
    line: '#DED4C2', band: '#3A3128', onBand: '#EFE7D7'
  },
  fonts: {
    faces: [
      { family: 'Shippori Mincho', src: '/studio/sites/fonts/ShipporiMincho-400-latin.woff2', weight: '400' },
      { family: 'Shippori Mincho', src: '/studio/sites/fonts/ShipporiMincho-600-latin.woff2', weight: '600' },
      { family: 'Zen Kaku Gothic New', src: '/studio/sites/fonts/ZenKakuGothicNew-400-latin.woff2', weight: '400' },
      { family: 'Zen Kaku Gothic New', src: '/studio/sites/fonts/ZenKakuGothicNew-500-latin.woff2', weight: '500' }
    ],
    display: "'Shippori Mincho', 'Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif JP', 'Noto Serif CJK JP', Georgia, serif",
    body: "'Zen Kaku Gothic New', 'Hiragino Sans', 'Yu Gothic', 'Noto Sans JP', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    preload: ['/studio/sites/fonts/ShipporiMincho-400-latin.woff2', '/studio/sites/fonts/ZenKakuGothicNew-400-latin.woff2'],
    displayWeight: 400,
    displayTracking: '.02em'
  },
  ornaments: 'ink',
  texture: 'washi',
  layout: 'asymmetric',
  radius: 2
};
