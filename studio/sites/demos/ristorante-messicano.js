// @ts-check
/* CONCEPT DEMO — FICTIONAL RESTAURANT. "Cocina Jacaranda" does not exist: name, people, address,
   phone and story are invented (checked in November 2026: no restaurant of this name in Turin).
   Mexican home cooking from Puebla and the Yucatán, corn tortillas made in-house, not Tex-Mex.
   Prices are realistic for Turin. Photos: studio/demo/messicano/*.jpg. */

/** @type {import('../types').SiteData} */
export default {
  slug: 'ristorante-messicano',
  kind: 'demo',
  theme: 'messicano',
  restaurant: {
    name: 'Cocina Jacaranda',
    kicker: { it: 'Cucina messicana · Borgo Dora, Torino', en: 'Mexican cooking · Borgo Dora, Turin' },
    cuisine: { it: 'Cucina messicana', en: 'Mexican cooking' },
    servesCuisine: ['Mexican'],
    tagline: { it: 'Tortillas di mais fatte a mano, ogni giorno.', en: 'Corn tortillas made by hand, every day.' },
    intro: {
      it: 'Cucina di casa messicana, da Puebla allo Yucatán: tortillas di mais nixtamalizzato fatte a mano, mole cotto per due giorni, tacos al pastor e mezcal. Nessun Tex-Mex.',
      en: 'Mexican home cooking from Puebla to the Yucatán: hand-pressed nixtamal corn tortillas, mole simmered for two days, tacos al pastor and mezcal. No Tex-Mex.'
    },
    story: {
      title: { it: 'Come sotto le jacarande', en: 'As under the jacarandas' },
      paragraphs: [
        {
          it: 'A Città del Messico, in primavera, le jacarande colorano di viola intere strade. Lupita è cresciuta in una di quelle, a Puebla ha imparato il mole dalla madre e a Torino ha incontrato Marco, che oggi sta in sala.',
          en: 'In Mexico City, every spring, jacaranda trees turn whole streets purple. Lupita grew up on one of them, learned mole from her mother in Puebla, and in Turin met Marco, who now runs the dining room.'
        },
        {
          it: 'Il mais arriva secco e lo nixtamalizziamo noi, con la calce, come si fa da millenni. Ogni mattina lo maciniamo e pressiamo le tortillas una per una. È lento, ma si sente.',
          en: 'Our corn arrives dried and we nixtamalise it ourselves, with lime, the way it has been done for millennia. Every morning we grind it and press the tortillas one by one. It’s slow, and you can taste it.'
        }
      ]
    },
    highlights: [
      { title: { it: 'Tortillas fatte a mano', en: 'Hand-pressed tortillas' }, text: { it: 'Mais nixtamalizzato da noi, senza glutine.', en: 'Corn we nixtamalise ourselves, gluten-free.' } },
      { title: { it: 'Mole di Puebla', en: 'Puebla mole' }, text: { it: 'Ventisei ingredienti, due giorni di cottura.', en: 'Twenty-six ingredients, two days of cooking.' } },
      { title: { it: 'Mezcal e agave', en: 'Mezcal and agave' }, text: { it: 'Una piccola carta di mezcal artigianali di Oaxaca.', en: 'A small list of craft mezcal from Oaxaca.' } }
    ],
    signature: ['tacos-cochinita', 'mole-poblano', 'tacos-al-pastor'],
    photos: {
      hero: { src: '/studio/demo/messicano/hero.jpg', width: 1200, height: 1500, alt: { it: 'Tacos su tortillas di mais fatte a mano, con cipolla rossa marinata e coriandolo, su un piatto di ceramica dipinta', en: 'Tacos on hand-pressed corn tortillas, with pickled red onion and coriander, on a painted ceramic plate' } },
      story: { src: '/studio/demo/messicano/cucina.jpg', width: 1200, height: 900, alt: { it: 'Le mani di Lupita che pressano una tortilla di mais', en: 'Lupita’s hands pressing a corn tortilla' } }
    },
    address: { street: 'Via delle Ceramiche 9', city: '10152 Torino' },
    phone: '+390110000003',
    phoneDisplay: '011 000 0003',
    whatsapp: '390000000003',
    booking: { url: 'https://example.com/prenota', label: { it: 'Prenota un tavolo', en: 'Book a table' } },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Borgo%20Dora%2C%20Torino',
    mapsQuery: 'Borgo Dora, Torino',
    priceRange: '€€',
    timeZone: 'Europe/Rome',
    hours: {
      mon: [],
      tue: [['19:00', '23:00']],
      wed: [['19:00', '23:00']],
      thu: [['19:00', '23:00']],
      fri: [['19:00', '00:30']],
      sat: [['12:30', '15:00'], ['19:00', '00:30']],
      sun: [['12:30', '15:00'], ['19:00', '23:00']]
    },
    hoursNote: { it: 'Chiuso il lunedì. A pranzo solo sabato e domenica.', en: 'Closed on Mondays. Lunch on Saturdays and Sundays only.' },
    cover: { amount: 2, note: { it: 'Totopos fatti da noi e salsa del giorno.', en: 'Our own totopos and the salsa of the day.' }, allergens: [] },
    notes: [
      { it: 'Le tortillas di mais sono senza glutine, ma in cucina usiamo anche farina di frumento.', en: 'Our corn tortillas are gluten-free, but we also use wheat flour in the kitchen.' },
      { it: 'Piccante? Le salse sono a parte: dalla più dolce alla habanero.', en: 'Spicy? Salsas come on the side: from mild to habanero.' },
      { it: 'Prezzi in euro, IVA inclusa. Accettiamo carte e contanti.', en: 'Prices in euros, VAT included. We accept cards and cash.' }
    ]
  },

  categories: [
    {
      id: 'antojitos',
      name: { it: 'Antojitos', en: 'Antojitos' },
      note: { it: 'Piccoli piatti per cominciare.', en: 'Small plates to start.' },
      dishes: [
        { id: 'guacamole', name: { it: 'Guacamole e totopos', en: 'Guacamole and totopos' }, description: { it: 'Avocado schiacciato al momento con lime, cipolla, coriandolo e chile serrano; chips di mais fatte da noi.', en: 'Avocado mashed to order with lime, onion, coriander and serrano chilli; our own corn chips.' }, price: 8, allergens: [], tags: ['vegan'], photo: '/studio/demo/messicano/guacamole.jpg' },
        { id: 'esquites', name: 'Esquites', description: { it: 'Mais saltato con maionese al lime, formaggio cotija e chile in polvere.', en: 'Sautéed corn with lime mayonnaise, cotija cheese and chilli powder.' }, price: 6.5, allergens: ['eggs', 'milk'], tags: ['vegetarian', 'spicy'] },
        { id: 'sopa-de-tortilla', name: 'Sopa de tortilla', description: { it: 'Zuppa di pomodoro e chile pasilla con strisce di tortilla croccanti, avocado, panna acida e formaggio fresco.', en: 'Tomato and pasilla chilli soup with crisp tortilla strips, avocado, sour cream and fresh cheese.' }, price: 7.5, allergens: ['milk'], tags: ['vegetarian'] },
        { id: 'queso-fundido', name: { it: 'Queso fundido con chorizo', en: 'Queso fundido with chorizo' }, description: { it: 'Formaggio fuso al forno con chorizo, servito con tortillas di farina di frumento.', en: 'Baked melted cheese with chorizo, served with wheat flour tortillas.' }, price: 9, allergens: ['milk', 'gluten'] }
      ]
    },
    {
      id: 'tacos',
      name: 'Tacos',
      note: { it: 'Tre tacos per porzione, su tortillas di mais fatte a mano.', en: 'Three tacos per portion, on hand-pressed corn tortillas.' },
      dishes: [
        { id: 'tacos-al-pastor', name: 'Tacos al pastor', description: { it: 'Maiale marinato con achiote e chiles, cotto allo spiedo, con ananas, cipolla e coriandolo.', en: 'Pork marinated with achiote and chillies, spit-roasted, with pineapple, onion and coriander.' }, price: 12, allergens: [], tags: ['house'], photo: '/studio/demo/messicano/tacos-al-pastor.jpg' },
        { id: 'tacos-cochinita', name: { it: 'Tacos de cochinita pibil', en: 'Cochinita pibil tacos' }, description: { it: 'Maiale cotto otto ore in foglia di banano con achiote e arancia amara, cipolla rossa marinata. Ricetta dello Yucatán.', en: 'Pork cooked for eight hours in banana leaf with achiote and bitter orange, pickled red onion. A Yucatán recipe.' }, price: 12, allergens: [], tags: ['house'], photo: '/studio/demo/messicano/tacos-cochinita.jpg' },
        { id: 'tacos-pescado', name: { it: 'Tacos de pescado', en: 'Fish tacos' }, description: { it: 'Pesce bianco in pastella alla birra, cavolo croccante e maionese al chipotle.', en: 'White fish in beer batter, crunchy cabbage and chipotle mayonnaise.' }, price: 13, allergens: ['fish', 'gluten', 'eggs'], tags: ['spicy'] },
        { id: 'tacos-hongos', name: { it: 'Tacos de hongos', en: 'Mushroom tacos' }, description: { it: 'Funghi saltati con epazote e chile guajillo, queso fresco.', en: 'Mushrooms sautéed with epazote and guajillo chilli, queso fresco.' }, price: 11, allergens: ['milk'], tags: ['vegetarian'] },
        { id: 'tacos-nopal', name: { it: 'Tacos de nopal', en: 'Nopal tacos' }, description: { it: 'Cactus nopal alla piastra con fagioli neri, cipolla e salsa verde.', en: 'Griddled nopal cactus with black beans, onion and salsa verde.' }, price: 10.5, allergens: [], tags: ['vegan'] }
      ]
    },
    {
      id: 'platos-fuertes',
      name: { it: 'Piatti forti', en: 'Mains' },
      dishes: [
        { id: 'mole-poblano', name: 'Mole poblano', description: { it: 'Pollo nella salsa di mole di Puebla: chiles, cioccolato, sesamo, arachidi, mandorle e pane tostato. Con riso e tortillas.', en: 'Chicken in Puebla’s mole sauce: chillies, chocolate, sesame, peanuts, almonds and toasted bread. With rice and tortillas.' }, price: 17, allergens: ['sesame', 'peanuts', 'nuts', 'gluten', 'milk'], tags: ['house'], photo: '/studio/demo/messicano/mole-poblano.jpg' },
        { id: 'enchiladas-verdes', name: 'Enchiladas verdes', description: { it: 'Tortillas ripiene di pollo, salsa di tomatillo, panna acida e formaggio.', en: 'Tortillas filled with chicken, tomatillo sauce, sour cream and cheese.' }, price: 14, allergens: ['milk'] },
        { id: 'pozole', name: 'Pozole rojo', description: { it: 'Zuppa di mais bianco cacahuazintle e maiale, con ravanelli, lattuga, origano e lime.', en: 'Hominy and pork soup with radishes, lettuce, oregano and lime.' }, price: 14, allergens: [], available: { it: 'Solo sabato e domenica', en: 'Saturdays and Sundays only' } },
        { id: 'arrachera', name: 'Arrachera', description: { it: 'Bavetta di manzo marinata e grigliata, guacamole, fagioli refritos e tortillas.', en: 'Marinated grilled flank steak, guacamole, refried beans and tortillas.' }, price: 19, allergens: [] }
      ]
    },
    {
      id: 'postres',
      name: { it: 'Dolci', en: 'Desserts' },
      dishes: [
        { id: 'churros', name: 'Churros', description: { it: 'Fritti al momento, con zucchero e cannella e una tazza di cioccolata calda.', en: 'Fried to order, with cinnamon sugar and a cup of hot chocolate.' }, price: 6, allergens: ['gluten', 'milk'], tags: ['vegetarian'], photo: '/studio/demo/messicano/churros.jpg' },
        { id: 'flan', name: { it: 'Flan de cajeta', en: 'Cajeta flan' }, description: { it: 'Crème caramel con cajeta, il caramello di latte di capra.', en: 'Crème caramel with cajeta, goat’s milk caramel.' }, price: 5.5, allergens: ['eggs', 'milk'], tags: ['vegetarian'] },
        { id: 'tres-leches', name: 'Pastel tres leches', description: { it: 'Pan di spagna imbevuto di tre latti, con cannella.', en: 'Sponge cake soaked in three milks, with cinnamon.' }, price: 6, allergens: ['gluten', 'eggs', 'milk'], tags: ['vegetarian'] }
      ]
    },
    {
      id: 'bebidas',
      name: { it: 'Da bere', en: 'Drinks' },
      drinks: true,
      dishes: [
        { id: 'agua-jamaica', name: { it: 'Agua de jamaica', en: 'Agua de jamaica' }, description: { it: 'Infuso freddo di fiori di ibisco.', en: 'Cold hibiscus flower drink.' }, price: 4, allergens: [], tags: ['vegan'] },
        { id: 'horchata', name: 'Horchata', description: { it: 'Bevanda di riso e cannella.', en: 'Rice and cinnamon drink.' }, price: 4, allergens: [], tags: ['vegan'] },
        { id: 'margarita', name: 'Margarita', description: { it: 'Tequila, lime e liquore all’arancia.', en: 'Tequila, lime and orange liqueur.' }, price: 9, allergens: [], tags: ['vegan'] },
        { id: 'michelada', name: 'Michelada', description: { it: 'Birra con lime, sale e chile.', en: 'Beer with lime, salt and chilli.' }, price: 7, allergens: ['gluten'] },
        { id: 'mezcal', name: { it: 'Mezcal artigianale (4 cl)', en: 'Craft mezcal (4 cl)' }, price: 8, allergens: [], tags: ['vegan'] },
        { id: 'cerveza', name: { it: 'Birra messicana (33 cl)', en: 'Mexican beer (33 cl)' }, price: 5, allergens: ['gluten'] },
        { id: 'agua', name: { it: 'Acqua naturale o frizzante (75 cl)', en: 'Still or sparkling water (75 cl)' }, price: 2.5, allergens: [], tags: ['vegan'] }
      ]
    }
  ]
};
