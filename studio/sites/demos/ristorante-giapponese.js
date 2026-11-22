// @ts-check
/* CONCEPT DEMO — FICTIONAL RESTAURANT. "Kinari" does not exist: name, people, address, phone and
   story are invented (checked in November 2026: no restaurant of this name in Turin).
   A small Japanese home-cooking place (teishoku at lunch, izakaya plates at dinner), not sushi
   all-you-can-eat. Prices are realistic for Turin. Photos: studio/demo/giapponese/*.jpg. */

/** @type {import('../types').SiteData} */
export default {
  slug: 'ristorante-giapponese',
  kind: 'demo',
  theme: 'giapponese',
  restaurant: {
    name: 'Kinari',
    nativeName: { text: '生成', lang: 'ja' },
    kicker: { it: 'Cucina di casa giapponese · Torino', en: 'Japanese home cooking · Turin' },
    cuisine: { it: 'Cucina di casa giapponese', en: 'Japanese home cooking' },
    servesCuisine: ['Japanese', 'Izakaya'],
    tagline: { it: 'Teishoku a pranzo, piccoli piatti la sera.', en: 'Teishoku at lunch, small plates at night.' },
    intro: {
      it: 'Dodici posti al banco e quattro tavoli. A pranzo il teishoku del giorno, la sera piccoli piatti da izakaya, ramen e sake. Ingredienti di stagione, pochi e scelti con cura.',
      en: 'Twelve seats at the counter and four tables. The day’s teishoku at lunch; at night izakaya small plates, ramen and sake. Seasonal ingredients, few and carefully chosen.'
    },
    story: {
      title: { it: 'Il colore della carta grezza', en: 'The colour of raw paper' },
      paragraphs: [
        {
          it: '“Kinari” è il colore naturale della seta e della carta non sbiancate. Haruka lo ha scelto per il suo ristorante perché in cucina vale lo stesso: togliere, invece di aggiungere.',
          en: '“Kinari” is the natural colour of unbleached silk and paper. Haruka chose it for her restaurant because the same goes for cooking: take away rather than add.'
        },
        {
          it: 'Cresciuta a Kanazawa, a Torino dal 2016, cucina come a casa: un dashi preparato ogni mattina, verdure in salamoia fatte da noi, il pesce del mercato di Porta Palazzo. Il menù cambia con le stagioni.',
          en: 'Raised in Kanazawa and in Turin since 2016, she cooks the way it’s done at home: dashi made every morning, our own pickles, fish from the Porta Palazzo market. The menu changes with the seasons.'
        }
      ]
    },
    highlights: [
      { title: { it: 'Dashi ogni mattina', en: 'Fresh dashi daily' }, text: { it: 'Alga kombu e katsuobushi, la base di quasi tutto.', en: 'Kombu and katsuobushi, the base of almost everything.' } },
      { title: { it: 'Teishoku a pranzo', en: 'Teishoku at lunch' }, text: { it: 'Un vassoio completo: piatto principale, riso, zuppa di miso e contorni.', en: 'A complete tray: main dish, rice, miso soup and sides.' } },
      { title: { it: 'Menù di stagione', en: 'Seasonal menu' }, text: { it: 'Cambia quattro volte l’anno. Ora: autunno.', en: 'It changes four times a year. Now: autumn.' } }
    ],
    signature: ['teishoku-del-giorno', 'shoyu-ramen', 'unagi-don'],
    photos: {
      hero: { src: '/studio/demo/giapponese/hero.jpg', width: 1200, height: 1500, alt: { it: 'Teishoku su un vassoio di legno chiaro: pesce alla griglia, riso, zuppa di miso e piccoli contorni', en: 'Teishoku on a light wooden tray: grilled fish, rice, miso soup and small sides' } },
      story: { src: '/studio/demo/giapponese/banco.jpg', width: 1200, height: 900, alt: { it: 'Il banco di legno di Kinari, con le ciotole in ceramica allineate', en: 'The wooden counter at Kinari, with ceramic bowls lined up' } }
    },
    address: { street: 'Vicolo della Carta 2', city: '10122 Torino' },
    phone: '+390110000002',
    phoneDisplay: '011 000 0002',
    whatsapp: '390000000002',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Quadrilatero%20Romano%2C%20Torino',
    mapsQuery: 'Quadrilatero Romano, Torino',
    priceRange: '€€',
    timeZone: 'Europe/Rome',
    hours: {
      mon: [],
      tue: [['12:30', '14:30'], ['19:30', '22:30']],
      wed: [['12:30', '14:30'], ['19:30', '22:30']],
      thu: [['12:30', '14:30'], ['19:30', '22:30']],
      fri: [['12:30', '14:30'], ['19:30', '23:00']],
      sat: [['12:30', '14:30'], ['19:30', '23:00']],
      sun: [['19:30', '22:30']]
    },
    hoursNote: { it: 'Chiuso il lunedì e la domenica a pranzo. Dodici posti al banco: meglio prenotare.', en: 'Closed on Mondays and Sunday lunchtime. Twelve counter seats: booking recommended.' },
    cover: { amount: 2, note: { it: 'Tè hōjicha caldo, servito a volontà.', en: 'Hot hōjicha tea, as much as you like.' }, allergens: [] },
    notes: [
      { it: 'La salsa di soia contiene soia e glutine: su richiesta c’è il tamari senza glutine.', en: 'Soy sauce contains soy and gluten: gluten-free tamari on request.' },
      { it: 'Il pesce crudo è abbattuto a norma di legge.', en: 'Raw fish is blast-frozen as required by law.' },
      { it: 'Prezzi in euro, IVA inclusa. Accettiamo carte e contanti.', en: 'Prices in euros, VAT included. We accept cards and cash.' }
    ]
  },

  categories: [
    {
      id: 'piccoli-piatti',
      name: { it: 'Piccoli piatti', en: 'Small plates' },
      note: { it: 'Da condividere, la sera come all’izakaya.', en: 'To share in the evening, izakaya style.' },
      dishes: [
        { id: 'edamame', name: 'Edamame', description: { it: 'Fagioli di soia al vapore con sale marino.', en: 'Steamed soybeans with sea salt.' }, price: 5, allergens: ['soy'], tags: ['vegan'] },
        { id: 'gyoza', name: { it: 'Gyoza di maiale (5 pz)', en: 'Pork gyoza (5 pcs)' }, description: { it: 'Ravioli di maiale e cavolo, scottati e poi al vapore, con salsa di soia e olio di sesamo.', en: 'Pork and cabbage dumplings, pan-fried then steamed, with soy sauce and sesame oil.' }, price: 8, allergens: ['gluten', 'soy', 'sesame'], photo: '/studio/demo/giapponese/gyoza.jpg' },
        { id: 'gyoza-verdure', name: { it: 'Gyoza di verdure (5 pz)', en: 'Vegetable gyoza (5 pcs)' }, description: { it: 'Cavolo, funghi shiitake e tofu, con salsa di soia e olio di sesamo.', en: 'Cabbage, shiitake and tofu, with soy sauce and sesame oil.' }, price: 7.5, allergens: ['gluten', 'soy', 'sesame'], tags: ['vegan'] },
        { id: 'agedashi-tofu', name: 'Agedashi tofu', description: { it: 'Tofu fritto in un dashi caldo con salsa di soia, daikon grattugiato e zenzero.', en: 'Fried tofu in warm dashi with soy sauce, grated daikon and ginger.' }, price: 7, allergens: ['soy', 'fish', 'gluten'] },
        { id: 'karaage', name: 'Karaage', description: { it: 'Pollo marinato in zenzero e salsa di soia, fritto, con limone e maionese giapponese.', en: 'Chicken marinated in ginger and soy sauce, fried, with lemon and Japanese mayonnaise.' }, price: 9, allergens: ['gluten', 'soy', 'eggs', 'mustard', 'sulphites'], photo: '/studio/demo/giapponese/karaage.jpg' },
        { id: 'sunomono', name: 'Sunomono', description: { it: 'Cetriolo e alga wakame in aceto di riso, con sesamo.', en: 'Cucumber and wakame seaweed in rice vinegar, with sesame.' }, price: 5.5, allergens: ['sesame', 'sulphites'], tags: ['vegan'] }
      ]
    },
    {
      id: 'crudo',
      name: { it: 'Pesce crudo', en: 'Raw fish' },
      note: { it: 'Solo pesce del giorno: quando finisce, finisce.', en: 'Only the day’s fish: when it’s gone, it’s gone.' },
      dishes: [
        { id: 'sashimi', name: { it: 'Sashimi del giorno (9 fette)', en: 'Sashimi of the day (9 slices)' }, description: { it: 'Tre pesci, tagliati al momento, con wasabi fresco.', en: 'Three fish, cut to order, with fresh wasabi.' }, price: 18, allergens: ['fish'], photo: '/studio/demo/giapponese/sashimi.jpg' },
        { id: 'chirashi', name: 'Chirashi', description: { it: 'Ciotola di riso da sushi con pesce crudo del giorno, tamagoyaki e salsa di soia.', en: 'A bowl of sushi rice with the day’s raw fish, tamagoyaki and soy sauce.' }, price: 19, allergens: ['fish', 'eggs', 'soy', 'gluten', 'sulphites'] },
        { id: 'hosomaki-cetriolo', name: { it: 'Hosomaki di cetriolo (6 pz)', en: 'Cucumber hosomaki (6 pcs)' }, description: { it: 'Riso, alga nori e cetriolo, con sesamo.', en: 'Rice, nori and cucumber, with sesame.' }, price: 6, allergens: ['sesame', 'sulphites'], tags: ['vegan'] }
      ]
    },
    {
      id: 'ramen-donburi',
      name: { it: 'Ramen e donburi', en: 'Ramen and donburi' },
      dishes: [
        { id: 'shoyu-ramen', name: 'Shoyu ramen', description: { it: 'Zuppa limpida di pollo e dashi alla salsa di soia, chashu di maiale, uovo marinato, cipollotto e nori.', en: 'Clear chicken and dashi soup with soy sauce, pork chashu, marinated egg, spring onion and nori.' }, price: 15, allergens: ['gluten', 'eggs', 'soy', 'fish'], tags: ['house'], photo: '/studio/demo/giapponese/shoyu-ramen.jpg' },
        { id: 'miso-ramen', name: { it: 'Ramen vegetale al miso', en: 'Vegetable miso ramen' }, description: { it: 'Zuppa di miso e sesamo, tofu, mais, germogli di soia e cipollotto.', en: 'Miso and sesame soup, tofu, sweetcorn, bean sprouts and spring onion.' }, price: 14, allergens: ['gluten', 'soy', 'sesame'], tags: ['vegan'] },
        { id: 'oyakodon', name: 'Oyakodon', description: { it: 'Pollo e uovo cotti nel dashi con cipolla, su riso.', en: 'Chicken and egg simmered in dashi with onion, over rice.' }, price: 14, allergens: ['eggs', 'fish', 'soy', 'gluten'] },
        { id: 'katsu-curry', name: 'Katsu curry', description: { it: 'Cotoletta di maiale in panko con curry giapponese e riso.', en: 'Panko pork cutlet with Japanese curry and rice.' }, price: 15, allergens: ['gluten', 'eggs', 'milk', 'soy', 'celery'] },
        { id: 'unagi-don', name: 'Unagi don', description: { it: 'Anguilla laccata alla griglia su riso, con pepe sansho.', en: 'Glazed grilled eel over rice, with sansho pepper.' }, price: 22, allergens: ['fish', 'soy', 'gluten'], tags: ['house'], photo: '/studio/demo/giapponese/unagi-don.jpg' }
      ]
    },
    {
      id: 'teishoku',
      name: 'Teishoku',
      note: { it: 'Solo a pranzo. Con riso, zuppa di miso, tsukemono e due piccoli contorni.', en: 'Lunch only. With rice, miso soup, tsukemono and two small sides.' },
      dishes: [
        { id: 'teishoku-del-giorno', name: { it: 'Teishoku del giorno', en: 'Teishoku of the day' }, description: { it: 'Pesce o carne del giorno: lo trovate scritto alla lavagna.', en: 'The day’s fish or meat: it’s on the blackboard.' }, price: 17, allergens: ['fish', 'soy', 'gluten', 'sesame'], tags: ['house'], available: { it: 'Solo a pranzo', en: 'Lunch only' }, photo: '/studio/demo/giapponese/teishoku.jpg' },
        { id: 'saba-teishoku', name: { it: 'Saba shioyaki teishoku', en: 'Saba shioyaki teishoku' }, description: { it: 'Sgombro alla griglia con solo sale, daikon grattugiato e limone.', en: 'Mackerel grilled with just salt, grated daikon and lemon.' }, price: 16, allergens: ['fish', 'soy'], available: { it: 'Solo a pranzo', en: 'Lunch only' } }
      ]
    },
    {
      id: 'dolci',
      name: { it: 'Dolci', en: 'Desserts' },
      dishes: [
        { id: 'mochi-matcha', name: { it: 'Mochi al matcha (2 pz)', en: 'Matcha mochi (2 pcs)' }, description: { it: 'Morbido riso glutinoso (senza glutine, nonostante il nome) ripieno di gelato al tè matcha.', en: 'Soft glutinous rice (gluten-free, despite the name) filled with matcha ice cream.' }, price: 6, allergens: ['milk'], tags: ['vegetarian'] },
        { id: 'dorayaki', name: 'Dorayaki', description: { it: 'Due pancake morbidi con anko, la crema di fagioli azuki.', en: 'Two soft pancakes with anko, sweet azuki bean paste.' }, price: 5.5, allergens: ['gluten', 'eggs'], tags: ['vegetarian'] },
        { id: 'purin', name: 'Purin', description: { it: 'Il crème caramel giapponese, cotto al vapore.', en: 'Japanese crème caramel, steamed.' }, price: 5, allergens: ['eggs', 'milk'], tags: ['vegetarian'] }
      ]
    },
    {
      id: 'bevande',
      name: { it: 'Tè, sake e bevande', en: 'Tea, sake and drinks' },
      drinks: true,
      dishes: [
        { id: 'sencha', name: { it: 'Tè verde sencha (teiera)', en: 'Sencha green tea (pot)' }, price: 3.5, allergens: [], tags: ['vegan'] },
        { id: 'hojicha', name: { it: 'Hōjicha, tè tostato (teiera)', en: 'Hōjicha roasted tea (pot)' }, price: 3.5, allergens: [], tags: ['vegan'] },
        { id: 'sake', name: { it: 'Sake junmai, caldo o freddo', en: 'Junmai sake, warm or cold' }, price: [{ label: { it: 'tokkuri 180 ml', en: 'tokkuri 180 ml' }, amount: 9 }, { label: { it: 'bottiglia 720 ml', en: 'bottle 720 ml' }, amount: 34 }], allergens: [], tags: ['vegan'] },
        { id: 'umeshu', name: { it: 'Umeshu, liquore di prugne (5 cl)', en: 'Umeshu plum liqueur (5 cl)' }, price: 6, allergens: [], tags: ['vegan'] },
        { id: 'birra-giapponese', name: { it: 'Birra giapponese (33 cl)', en: 'Japanese beer (33 cl)' }, price: 5, allergens: ['gluten'] },
        { id: 'acqua', name: { it: 'Acqua naturale o frizzante (75 cl)', en: 'Still or sparkling water (75 cl)' }, price: 2.5, allergens: [], tags: ['vegan'] }
      ]
    }
  ]
};
