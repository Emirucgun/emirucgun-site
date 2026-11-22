// @ts-check
/* CONCEPT DEMO — FICTIONAL RESTAURANT. "Kesar Rasoi" does not exist: name, people, address, phone
   and story are invented (checked in November 2026: no restaurant of this name in Turin).
   Prices are realistic for an Indian restaurant in Turin. Photos: studio/demo/indiano/*.jpg. */

/** @type {import('../types').SiteData} */
export default {
  slug: 'ristorante-indiano',
  kind: 'demo',
  theme: 'indiano',
  restaurant: {
    name: 'Kesar Rasoi',
    nativeName: { text: 'केसर रसोई', lang: 'hi' },
    kicker: { it: 'Cucina indiana del Nord · Torino', en: 'North Indian cooking · Turin' },
    cuisine: { it: 'Cucina indiana del Nord', en: 'North Indian cooking' },
    servesCuisine: ['Indian', 'North Indian', 'Awadhi'],
    tagline: { it: 'La cucina di Lucknow, a Vanchiglia.', en: 'The cooking of Lucknow, in Vanchiglia.' },
    intro: {
      it: 'Tandoor, curry cotti a fuoco lento e biryani sigillato nella pentola, come si fa a Lucknow. Un piccolo ristorante di famiglia a Vanchiglia, con tante scelte vegetariane e vegane.',
      en: 'Tandoor, slow-cooked curries and biryani sealed in the pot, the way it’s done in Lucknow. A small family restaurant in Vanchiglia, with plenty of vegetarian and vegan choices.'
    },
    story: {
      title: { it: 'Lo zafferano di casa', en: 'Saffron from home' },
      paragraphs: [
        {
          it: '“Kesar” è lo zafferano, “rasoi” la cucina di casa. Meera e Arjun sono arrivati a Torino da Lucknow nel 2014 e hanno aperto Kesar Rasoi un anno dopo, con le ricette della nonna di Meera e un tandoor costruito a mano.',
          en: '“Kesar” is saffron, “rasoi” the home kitchen. Meera and Arjun came to Turin from Lucknow in 2014 and opened Kesar Rasoi a year later, with Meera’s grandmother’s recipes and a hand-built tandoor.'
        },
        {
          it: 'La cucina awadhi è lenta: il dal makhani cuoce tutta la notte, il biryani si sigilla con la pasta e finisce di cuocere nel suo vapore. Le spezie le tostiamo e maciniamo noi, ogni mattina.',
          en: 'Awadhi cooking is slow: the dal makhani simmers overnight, the biryani is sealed with dough and finishes in its own steam. We toast and grind our spices ourselves, every morning.'
        }
      ]
    },
    highlights: [
      { title: { it: 'Tandoor a carbone', en: 'Charcoal tandoor' }, text: { it: 'Naan, tikka e kebab cotti nel forno di argilla, a 400 gradi.', en: 'Naan, tikka and kebabs baked in the clay oven at 400 degrees.' } },
      { title: { it: 'Biryani in dum', en: 'Dum biryani' }, text: { it: 'Riso e carne sigillati insieme nella pentola, come a Lucknow.', en: 'Rice and meat sealed together in the pot, as in Lucknow.' } },
      { title: { it: 'Vegetariano e vegano', en: 'Vegetarian and vegan' }, text: { it: 'Metà del menù è vegetariana; i piatti vegani sono segnati.', en: 'Half the menu is vegetarian; vegan dishes are marked.' } }
    ],
    signature: ['galouti-kebab', 'biryani-lucknow', 'dal-makhani'],
    photos: {
      hero: { src: '/studio/demo/indiano/hero.jpg', width: 1200, height: 1500, alt: { it: 'Biryani di agnello appena aperto, nella pentola di rame, con zafferano e cipolla croccante', en: 'Lamb biryani just unsealed in its copper pot, with saffron and crispy onion' } },
      story: { src: '/studio/demo/indiano/sala.jpg', width: 1200, height: 900, alt: { it: 'La sala di Kesar Rasoi, con tovaglie stampate a mano e luce calda', en: 'The Kesar Rasoi dining room, with hand-printed tablecloths and warm light' } }
    },
    address: { street: 'Via delle Spezie 12', city: '10153 Torino' },
    phone: '+390110000001',
    phoneDisplay: '011 000 0001',
    whatsapp: '390000000001',
    booking: { url: 'https://example.com/prenota', label: { it: 'Prenota un tavolo', en: 'Book a table' } },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vanchiglia%2C%20Torino',
    mapsQuery: 'Vanchiglia, Torino',
    priceRange: '€€',
    timeZone: 'Europe/Rome',
    hours: {
      mon: [],
      tue: [['19:00', '23:00']],
      wed: [['12:00', '14:30'], ['19:00', '23:00']],
      thu: [['12:00', '14:30'], ['19:00', '23:00']],
      fri: [['12:00', '14:30'], ['19:00', '23:30']],
      sat: [['12:00', '15:00'], ['19:00', '23:30']],
      sun: [['12:00', '15:00'], ['19:00', '22:30']]
    },
    hoursNote: { it: 'Chiuso il lunedì e il martedì a pranzo.', en: 'Closed on Mondays and Tuesday lunchtime.' },
    cover: {
      amount: 2,
      note: { it: 'Papad croccanti e chutney di mango fatto da noi.', en: 'Crisp papad and our own mango chutney.' },
      allergens: []
    },
    notes: [
      { it: 'Piccante su richiesta: diteci quanto lo volete, da “delicato” a “come a Lucknow”.', en: 'Spice level on request: tell us how hot you like it, from “mild” to “as in Lucknow”.' },
      { it: 'Prezzi in euro, IVA inclusa. Accettiamo carte e contanti.', en: 'Prices in euros, VAT included. We accept cards and cash.' },
      { it: 'Tutta la carne è halal.', en: 'All our meat is halal.' }
    ]
  },

  categories: [
    {
      id: 'antipasti',
      name: { it: 'Antipasti', en: 'Starters' },
      dishes: [
        { id: 'samosa', name: { it: 'Samosa di verdure (2 pz)', en: 'Vegetable samosa (2 pcs)' }, description: { it: 'Pasta croccante ripiena di patate, piselli e spezie, con chutney di tamarindo.', en: 'Crisp pastry filled with potato, peas and spices, with tamarind chutney.' }, price: 6, allergens: ['gluten'], tags: ['vegan'] },
        { id: 'pakora', name: { it: 'Pakora di verdure', en: 'Vegetable pakora' }, description: { it: 'Cipolla, spinaci e cavolfiore in pastella di ceci, fritti al momento.', en: 'Onion, spinach and cauliflower in chickpea batter, fried to order.' }, price: 6.5, allergens: [], tags: ['vegan'] },
        { id: 'aloo-tikki-chaat', name: 'Aloo tikki chaat', description: { it: 'Tortini di patate con ceci, yogurt, chutney di tamarindo e menta, coriandolo fresco.', en: 'Potato patties with chickpeas, yogurt, tamarind and mint chutneys, fresh coriander.' }, price: 7, allergens: ['milk'], tags: ['vegetarian'], photo: '/studio/demo/indiano/aloo-tikki-chaat.jpg' },
        { id: 'galouti-kebab', name: 'Galouti kebab', description: { it: 'Polpettine di agnello morbidissime, con 24 spezie, all’uso di Lucknow, su una sottile paratha con ghee.', en: 'Melt-in-the-mouth lamb patties with 24 spices, Lucknow style, on a thin paratha with ghee.' }, price: 9.5, allergens: ['gluten', 'milk'], tags: ['house'], photo: '/studio/demo/indiano/galouti-kebab.jpg' },
        { id: 'paneer-tikka', name: 'Paneer tikka', description: { it: 'Paneer marinato nello yogurt e cotto nel tandoor, con peperoni e cipolla.', en: 'Paneer marinated in yogurt and cooked in the tandoor, with peppers and onion.' }, price: 9, allergens: ['milk'], tags: ['vegetarian'] }
      ]
    },
    {
      id: 'tandoor',
      name: { it: 'Dal tandoor', en: 'From the tandoor' },
      note: { it: 'Serviti con insalata di cipolla e chutney alla menta.', en: 'Served with onion salad and mint chutney.' },
      dishes: [
        { id: 'murgh-tikka', name: 'Murgh tikka', description: { it: 'Bocconcini di pollo marinati in yogurt, zenzero e garam masala.', en: 'Chicken pieces marinated in yogurt, ginger and garam masala.' }, price: 14, allergens: ['milk'], photo: '/studio/demo/indiano/murgh-tikka.jpg' },
        { id: 'tandoori-chicken', name: { it: 'Pollo tandoori (mezzo)', en: 'Tandoori chicken (half)' }, description: { it: 'Mezzo pollo marinato una notte nello yogurt e nel peperoncino del Kashmir.', en: 'Half a chicken marinated overnight in yogurt and Kashmiri chilli.' }, price: 15, allergens: ['milk'], tags: ['spicy'] },
        { id: 'seekh-kebab', name: { it: 'Seekh kebab di agnello', en: 'Lamb seekh kebab' }, description: { it: 'Spiedini di agnello macinato con zenzero, coriandolo e peperoncino verde.', en: 'Minced lamb skewers with ginger, coriander and green chilli.' }, price: 15, allergens: [], tags: ['spicy'] },
        { id: 'tandoori-gamberoni', name: { it: 'Gamberoni tandoori', en: 'Tandoori king prawns' }, description: { it: 'Gamberoni marinati in yogurt, ajwain e olio di senape.', en: 'King prawns marinated in yogurt, ajwain and mustard oil.' }, price: 19, allergens: ['crustaceans', 'milk', 'mustard'] }
      ]
    },
    {
      id: 'curry',
      name: { it: 'Curry', en: 'Curries' },
      note: { it: 'Da accompagnare con riso o pane, ordinati a parte.', en: 'To have with rice or bread, ordered separately.' },
      dishes: [
        { id: 'butter-chicken', name: { it: 'Butter chicken', en: 'Butter chicken' }, description: { it: 'Pollo dal tandoor in salsa di pomodoro, burro, panna e anacardi, con fieno greco.', en: 'Tandoor chicken in a tomato, butter, cream and cashew sauce, with fenugreek.' }, price: 14, allergens: ['milk', 'nuts'], photo: '/studio/demo/indiano/butter-chicken.jpg' },
        { id: 'rogan-josh', name: { it: 'Rogan josh di agnello', en: 'Lamb rogan josh' }, description: { it: 'Agnello cotto lentamente con yogurt, peperoncino del Kashmir e cardamomo nero.', en: 'Lamb slow-cooked with yogurt, Kashmiri chilli and black cardamom.' }, price: 15.5, allergens: ['milk'], tags: ['spicy'] },
        { id: 'palak-paneer', name: 'Palak paneer', description: { it: 'Paneer fatto da noi in crema di spinaci, aglio e zenzero.', en: 'Our own paneer in a creamy spinach sauce with garlic and ginger.' }, price: 12, allergens: ['milk'], tags: ['vegetarian'] },
        { id: 'dal-makhani', name: 'Dal makhani', description: { it: 'Lenticchie nere e fagioli rossi cotti per dodici ore, finiti con burro e panna.', en: 'Black lentils and kidney beans cooked for twelve hours, finished with butter and cream.' }, price: 11, allergens: ['milk'], tags: ['vegetarian', 'house'], photo: '/studio/demo/indiano/dal-makhani.jpg' },
        { id: 'chana-masala', name: 'Chana masala', description: { it: 'Ceci in salsa di pomodoro e cipolla, con amchur e garam masala.', en: 'Chickpeas in tomato and onion sauce, with amchur and garam masala.' }, price: 10, allergens: [], tags: ['vegan'] },
        { id: 'baingan-bharta', name: 'Baingan bharta', description: { it: 'Melanzane affumicate nel tandoor, schiacciate con pomodoro, cipolla e peperoncino verde.', en: 'Tandoor-smoked aubergine, mashed with tomato, onion and green chilli.' }, price: 11, allergens: [], tags: ['vegan', 'spicy'] }
      ]
    },
    {
      id: 'biryani',
      name: 'Biryani',
      note: { it: 'Cotti in dum: ci vogliono 20 minuti, ne vale la pena.', en: 'Cooked dum style: it takes 20 minutes, and it’s worth it.' },
      dishes: [
        { id: 'biryani-lucknow', name: { it: 'Biryani di agnello alla Lucknow', en: 'Lucknow lamb biryani' }, description: { it: 'Riso basmati e agnello cotti insieme nella pentola sigillata con un coperchio di pasta, zafferano, acqua di rose e ghee. Con raita.', en: 'Basmati rice and lamb cooked together in a pot sealed with a dough lid, saffron, rose water and ghee. With raita.' }, price: 17, allergens: ['gluten', 'milk'], tags: ['house'], photo: '/studio/demo/indiano/biryani-lucknow.jpg' },
        { id: 'biryani-pollo', name: { it: 'Biryani di pollo', en: 'Chicken biryani' }, description: { it: 'Pollo marinato nello yogurt, riso basmati, cipolla croccante e menta. Con raita.', en: 'Yogurt-marinated chicken, basmati rice, crispy onion and mint. With raita.' }, price: 15, allergens: ['milk'] },
        { id: 'biryani-verdure', name: { it: 'Biryani di verdure', en: 'Vegetable biryani' }, description: { it: 'Verdure di stagione, riso basmati, anacardi tostati e zafferano. Con raita.', en: 'Seasonal vegetables, basmati rice, toasted cashews and saffron. With raita.' }, price: 13, allergens: ['milk', 'nuts'], tags: ['vegetarian'] }
      ]
    },
    {
      id: 'pane-riso',
      name: { it: 'Pane e riso', en: 'Bread and rice' },
      dishes: [
        { id: 'naan', name: 'Naan', description: { it: 'Dal tandoor, con un velo di burro.', en: 'From the tandoor, brushed with butter.' }, price: 3, allergens: ['gluten', 'milk'], tags: ['vegetarian'] },
        { id: 'garlic-naan', name: { it: 'Naan all’aglio', en: 'Garlic naan' }, description: { it: 'Con aglio e coriandolo.', en: 'With garlic and coriander.' }, price: 3.5, allergens: ['gluten', 'milk'], tags: ['vegetarian'] },
        { id: 'peshwari-naan', name: 'Peshwari naan', description: { it: 'Ripieno di cocco, uvetta e mandorle.', en: 'Filled with coconut, raisins and almonds.' }, price: 4.5, allergens: ['gluten', 'milk', 'nuts'], tags: ['vegetarian'] },
        { id: 'tandoori-roti', name: 'Tandoori roti', description: { it: 'Pane integrale senza burro.', en: 'Wholewheat bread, no butter.' }, price: 2.5, allergens: ['gluten'], tags: ['vegan'] },
        { id: 'riso-zafferano', name: { it: 'Riso basmati allo zafferano', en: 'Saffron basmati rice' }, description: { it: 'Con un filo di ghee.', en: 'With a little ghee.' }, price: 4, allergens: ['milk'], tags: ['vegetarian'] },
        { id: 'raita', name: 'Raita', description: { it: 'Yogurt con cetriolo e cumino tostato.', en: 'Yogurt with cucumber and toasted cumin.' }, price: 3.5, allergens: ['milk'], tags: ['vegetarian'] }
      ]
    },
    {
      id: 'dolci',
      name: { it: 'Dolci', en: 'Desserts' },
      dishes: [
        { id: 'gulab-jamun', name: 'Gulab jamun', description: { it: 'Palline di latte e farina, fritte e servite calde nello sciroppo al cardamomo.', en: 'Milk and flour dumplings, fried and served warm in cardamom syrup.' }, price: 5, allergens: ['gluten', 'milk'], tags: ['vegetarian'], photo: '/studio/demo/indiano/gulab-jamun.jpg' },
        { id: 'kulfi-pistacchio', name: { it: 'Kulfi al pistacchio', en: 'Pistachio kulfi' }, description: { it: 'Il gelato indiano, denso e cremoso, fatto da noi.', en: 'Indian ice cream, dense and creamy, made in-house.' }, price: 5.5, allergens: ['milk', 'nuts'], tags: ['vegetarian'] },
        { id: 'kheer', name: 'Kheer', description: { it: 'Budino di riso al latte con zafferano, cardamomo e mandorle.', en: 'Rice pudding with saffron, cardamom and almonds.' }, price: 5, allergens: ['milk', 'nuts'], tags: ['vegetarian'] }
      ]
    },
    {
      id: 'bevande',
      name: { it: 'Bevande', en: 'Drinks' },
      drinks: true,
      dishes: [
        { id: 'mango-lassi', name: 'Mango lassi', price: 4.5, allergens: ['milk'], tags: ['vegetarian'] },
        { id: 'lassi-salato', name: { it: 'Lassi salato al cumino', en: 'Salted cumin lassi' }, price: 4, allergens: ['milk'], tags: ['vegetarian'] },
        { id: 'masala-chai', name: 'Masala chai', description: { it: 'Tè nero con latte e spezie.', en: 'Black tea with milk and spices.' }, price: 3.5, allergens: ['milk'], tags: ['vegetarian'] },
        { id: 'nimbu-pani', name: { it: 'Nimbu pani', en: 'Nimbu pani' }, description: { it: 'Limonata fresca allo zenzero.', en: 'Fresh ginger lemonade.' }, price: 4, allergens: [], tags: ['vegan'] },
        { id: 'birra-indiana', name: { it: 'Birra indiana (33 cl)', en: 'Indian beer (33 cl)' }, price: 5, allergens: ['gluten'] },
        { id: 'acqua', name: { it: 'Acqua naturale o frizzante (75 cl)', en: 'Still or sparkling water (75 cl)' }, price: 2.5, allergens: [], tags: ['vegan'] }
      ]
    }
  ]
};
