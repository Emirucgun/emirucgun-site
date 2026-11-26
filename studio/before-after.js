/* ============================================================
   Before/after examples of dish photos: the list shown in the sliders on the home page and on /esempi.
   Add an example = add one entry below (how to make the images: studio/README.md, "Before/after examples").

   With one entry the slider shows just that dish; with two or more, a row of dish names appears above it
   and the visitor switches between them. The FIRST entry is also the one written in the HTML (what people
   see before JavaScript loads, and in the delivery-app card on /esempi): if you change which one is first,
   update those three places too (`node studio/tools/check-site.mjs` tells you if they differ).

   Only real photos of real dishes, with the restaurant's permission. Never generated or downloaded images.
   ============================================================ */
window.STUDIO_BA = [
  {
    id: 'kebab',                          // short, unique, no spaces
    // image files, without "-<width>.<avif|webp>": every width in `widths` must exist in both formats
    before: '/studio/img/dish-before',
    after: '/studio/img/dish-after',
    widths: [480, 800, 1200],
    width: 1200, height: 896,             // size of the largest file (keeps the space reserved while loading)
    dish: { it: 'Kebab al piatto', en: 'Kebab plate' },
    // short description, shown in the delivery-app card on /esempi (first example only)
    desc: { it: 'Carne, patatine, insalata e salse', en: 'Meat, fries, salad and sauces' },
    // optional: who it's from, shown under the slider. Example: { it: 'Trattoria da Gino, Torino', en: 'Trattoria da Gino, Turin' }
    credit: null,
    alt: {
      before: { it: 'Prima: la foto originale del piatto, scattata con il telefono in cucina', en: 'Before: the original photo of the dish, taken on a phone in the kitchen' },
      after: { it: 'Dopo: lo stesso piatto con luce, colori e sfondo sistemati', en: 'After: the same dish with light, colour and background fixed' }
    }
  }
  // , { id: 'carbonara', before: '/studio/img/ba/carbonara-before', after: '/studio/img/ba/carbonara-after',
  //     widths: [480, 800, 1200], width: 1200, height: 900,
  //     dish: { it: 'Carbonara', en: 'Carbonara' }, credit: { it: 'Osteria …, Torino', en: 'Osteria …, Turin' },
  //     alt: { before: { it: 'Prima: …', en: 'Before: …' }, after: { it: 'Dopo: …', en: 'After: …' } } }
];
