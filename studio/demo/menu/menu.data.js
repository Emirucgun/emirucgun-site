// @ts-check
/* =====================================================================================
   THE ONLY FILE TO EDIT FOR A NEW MENU.
   Everything on the page (restaurant info, hours, colours, fonts, dishes, prices,
   allergens) comes from here. See README.md in this folder.

   Rules of thumb
   - Text in two languages is { it: '…', en: '…' }. If it's the same in both, a plain '…'.
   - Prices are numbers in euros: 12, 12.5. The page shows them as "12,00 €".
   - Allergens: list EVERY one the dish contains, hidden ones too
     (bread/breadcrumbs → gluten, stock/soffritto → celery, wine/vinegar → sulphites,
     butter/cream/cheese → milk, amaretti → nuts, mayonnaise → eggs).
     Then run `node studio/demo/menu/check.mjs` to catch typos.
   - Tags: 'vegetarian', 'vegan' (counts as vegetarian too), 'spicy', 'house' (2–3 per menu).

   THIS RESTAURANT IS FICTIONAL: name, address, phone and prices are invented.
   ===================================================================================== */

/** @typedef {import('./menu.types').MenuData} MenuData */

/** @type {MenuData} */
const menu = {
  defaultLang: 'it',
  // Same key as the rest of studio.emirucgun.com, so the demo opens in the language
  // the visitor already picked there. Use a key of your own for a client, e.g. 'tregliciniLang'.
  storageKey: 'lang',

  restaurant: {
    name: 'Trattoria dei Tre Glicini',
    kicker: { it: 'Cucina piemontese · Torino', en: 'Piedmontese cooking · Turin' },
    tagline: {
      it: 'Piatti di casa sotto il pergolato di glicini, dal 1962.',
      en: 'Home cooking under the wisteria pergola, since 1962.'
    },
    logo: { src: '/studio/demo/menu/logo.svg', width: 64, height: 64 },
    // Wide photo at the top of the page (16:9). Run photos.py after adding or replacing it.
    coverPhoto: {
      src: '/studio/demo/menu/photos/cover.jpg',
      alt: { it: 'Il cortile della trattoria sotto il pergolato di glicini', en: 'The trattoria courtyard under the wisteria pergola' }
    },
    address: { street: 'Via dei Tre Glicini 3', city: '10124 Torino' },
    phone: '+390110000000',
    phoneDisplay: '011 000 0000',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Torino',
    timeZone: 'Europe/Rome',
    hours: {
      mon: [],
      tue: [['12:00', '14:30'], ['19:00', '22:30']],
      wed: [['12:00', '14:30'], ['19:00', '22:30']],
      thu: [['12:00', '14:30'], ['19:00', '22:30']],
      fri: [['12:00', '14:30'], ['19:00', '23:00']],
      sat: [['12:00', '14:30'], ['19:00', '23:00']],
      sun: [['12:00', '15:00']]
    },
    hoursNote: { it: 'Chiuso il lunedì e la domenica sera.', en: 'Closed on Mondays and Sunday evenings.' },
    cover: {
      amount: 2.5,
      note: { it: 'Pane e grissini stirati a mano, fatti da noi.', en: 'Bread and hand-rolled grissini, baked in-house.' },
      allergens: ['gluten']
    },
    notes: [
      { it: 'Prezzi in euro, IVA e servizio inclusi.', en: 'Prices in euros, VAT and service included.' },
      { it: 'Porzioni per bambini su richiesta.', en: 'Children’s portions on request.' },
      { it: 'Accettiamo carte e contanti.', en: 'We accept cards and cash.' }
    ]
  },

  theme: {
    accent: '#7A2333',     // Barolo red
    accentDark: '#D98A8F', // the same red, lifted for dark mode
    fonts: {
      heading: {
        family: 'Fraunces',
        src: '/studio/fonts/Fraunces-var-latin.woff2',
        weight: '300 800',
        fallback: "Georgia, 'Times New Roman', serif"
      },
      body: {
        family: 'Inter',
        src: '/studio/fonts/Inter-var-latin.woff2',
        weight: '400 700',
        fallback: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
      }
    }
  },

  categories: [
    {
      id: 'antipasti',
      name: { it: 'Antipasti', en: 'Starters' },
      dishes: [
        {
          id: 'vitello-tonnato',
          name: 'Vitello tonnato',
          description: {
            it: 'Girello di vitello cotto rosa, affettato sottile, sotto la nostra salsa tonnata con capperi.',
            en: 'Thin slices of rosy veal under our tuna and caper sauce.'
          },
          price: 13,
          photo: '/studio/demo/menu/photos/vitello-tonnato.jpg',
          allergens: ['eggs', 'fish'] // tuna + anchovies, egg mayonnaise
        },
        {
          id: 'battuta-fassona',
          name: { it: 'Battuta di Fassona al coltello', en: 'Hand-cut Fassona beef tartare' },
          description: {
            it: 'Carne cruda di Fassona piemontese battuta a mano, condita solo con olio extravergine, limone e sale.',
            en: 'Raw Piedmontese Fassona beef, chopped by hand and dressed simply with olive oil, lemon and salt.'
          },
          price: 14,
          photo: '/studio/demo/menu/photos/battuta-fassona.jpg',
          allergens: []
        },
        {
          id: 'tomini-elettrici',
          name: { it: 'Tomini elettrici', en: 'Tomini elettrici (spicy fresh cheese)' },
          description: {
            it: 'Tomini freschi sotto bagnet verde piccante: prezzemolo, aglio, acciughe, mollica di pane all’aceto e peperoncino.',
            en: 'Little fresh cheeses in a fiery green sauce of parsley, garlic, anchovies, vinegar-soaked breadcrumbs and chilli.'
          },
          price: 9,
          photo: '/studio/demo/menu/photos/tomini-elettrici.jpg',
          allergens: ['gluten', 'fish', 'milk', 'sulphites'], // bread, anchovies, cheese, wine vinegar
          tags: ['spicy']
        },
        {
          id: 'peperoni-bagna-cauda',
          name: { it: 'Peperoni con bagna càuda', en: 'Roast peppers with bagna càuda' },
          description: {
            it: 'Peperoni arrostiti al forno con la salsa calda di aglio, acciughe e olio extravergine.',
            en: 'Oven-roasted peppers with the warm Piedmontese dip of garlic, anchovies and olive oil.'
          },
          price: 11,
          allergens: ['fish']
        },
        {
          id: 'giardiniera',
          name: { it: 'Giardiniera della casa', en: 'House giardiniera' },
          description: {
            it: 'Verdure dell’orto in agrodolce (peperoni, carote, sedano, cavolfiore e cipolline), preparate da noi a fine estate.',
            en: 'Our sweet-and-sour garden vegetables (peppers, carrots, celery, cauliflower and baby onions), put up every late summer.'
          },
          price: 8,
          allergens: ['celery', 'sulphites'], // wine vinegar
          tags: ['vegan']
        }
      ]
    },

    {
      id: 'primi',
      name: { it: 'Primi', en: 'Pasta & soups' },
      note: { it: 'Pasta fresca tirata a mano ogni mattina.', en: 'Fresh pasta, rolled by hand every morning.' },
      dishes: [
        {
          id: 'agnolotti-plin',
          name: { it: 'Agnolotti del plin al sugo d’arrosto', en: 'Agnolotti del plin in roast jus' },
          description: {
            it: 'Piccoli ravioli pizzicati a mano, ripieni di vitello, maiale e coniglio arrosto con Parmigiano, nel loro sugo di cottura.',
            en: 'Tiny hand-pinched ravioli filled with roast veal, pork, rabbit and Parmigiano, served in their own roasting juices.'
          },
          price: 15,
          photo: '/studio/demo/menu/photos/agnolotti-plin.jpg',
          allergens: ['gluten', 'eggs', 'milk', 'celery', 'sulphites'], // egg pasta, Parmigiano, roast with soffritto and wine
          tags: ['house']
        },
        {
          id: 'tajarin-ragu',
          name: { it: 'Tajarin al ragù bianco di vitello', en: 'Tajarin with white veal ragù' },
          description: {
            it: 'Tagliolini sottilissimi ai 30 tuorli, tagliati a coltello, con ragù bianco di vitello cotto piano e rosmarino.',
            en: 'Whisper-thin 30-yolk tagliolini, cut by knife, with a slow-cooked white veal ragù and rosemary.'
          },
          price: 14,
          photo: '/studio/demo/menu/photos/tajarin-ragu.jpg',
          allergens: ['gluten', 'eggs', 'celery', 'sulphites'] // soffritto, white wine
        },
        {
          id: 'gnocchi-nocciole',
          name: { it: 'Gnocchi al burro, salvia e nocciole', en: 'Potato gnocchi, butter, sage and hazelnuts' },
          description: {
            it: 'Gnocchi di patate fatti in casa con burro di montagna, salvia e nocciole Piemonte IGP tostate.',
            en: 'Homemade potato gnocchi with mountain butter, sage and toasted Piedmont hazelnuts.'
          },
          price: 12,
          allergens: ['gluten', 'eggs', 'milk', 'nuts'],
          tags: ['vegetarian']
        },
        {
          id: 'risotto-barolo',
          name: { it: 'Risotto al Barolo', en: 'Barolo risotto' },
          description: {
            it: 'Riso Carnaroli sfumato al Barolo, cotto nel brodo di verdure e mantecato al burro di montagna.',
            en: 'Carnaroli rice cooked with Barolo and vegetable stock, finished with mountain butter.'
          },
          price: 14,
          photo: '/studio/demo/menu/photos/risotto-barolo.jpg',
          allergens: ['milk', 'celery', 'sulphites'], // butter, vegetable stock, wine
          tags: ['vegetarian']
        },
        {
          id: 'minestrone',
          name: { it: 'Minestrone dell’orto', en: 'Garden minestrone' },
          description: {
            it: 'Verdure di stagione e fagioli borlotti cotti piano, con un filo d’olio extravergine a crudo.',
            en: 'Seasonal vegetables and borlotti beans, simmered slowly and finished with fresh olive oil.'
          },
          price: 10,
          allergens: ['celery'],
          tags: ['vegan'],
          available: { it: 'Da ottobre a marzo', en: 'October to March' }
        }
      ]
    },

    {
      id: 'secondi',
      name: { it: 'Secondi', en: 'Mains' },
      dishes: [
        {
          id: 'brasato-barolo',
          name: { it: 'Brasato al Barolo con polenta', en: 'Beef braised in Barolo, with polenta' },
          description: {
            it: 'Cappello del prete di manzo cotto sei ore nel Barolo con le sue verdure, servito con polenta morbida.',
            en: 'Beef shoulder braised for six hours in Barolo with its vegetables, on soft polenta.'
          },
          price: 22,
          photo: '/studio/demo/menu/photos/brasato-barolo.jpg',
          allergens: ['celery', 'sulphites'],
          tags: ['house']
        },
        {
          id: 'bollito-misto',
          name: { it: 'Bollito misto alla piemontese', en: 'Piedmontese bollito misto' },
          description: {
            it: 'Sette tagli di manzo e vitello cotti nel brodo, con bagnet verde, bagnet ross e mostarda.',
            en: 'Seven cuts of beef and veal simmered in broth, with green sauce, red sauce and mostarda.'
          },
          price: 24,
          // green sauce: bread, anchovies, vinegar · broth: celery · mostarda: mustard essence
          allergens: ['gluten', 'fish', 'celery', 'mustard', 'sulphites'],
          available: { it: 'Solo il giovedì', en: 'Thursdays only' }
        },
        {
          id: 'coniglio-erbe',
          name: { it: 'Coniglio alle erbe', en: 'Rabbit with herbs' },
          description: {
            it: 'Coniglio al forno con rosmarino, timo e vino bianco, patate novelle e olive taggiasche.',
            en: 'Oven-roasted rabbit with rosemary, thyme and white wine, new potatoes and Taggiasca olives.'
          },
          price: 18,
          allergens: ['sulphites']
        },
        {
          id: 'trota',
          name: { it: 'Trota salmonata al burro nocciola', en: 'Salmon trout in brown butter' },
          description: {
            it: 'Filetto di trota delle valli cuneesi in padella, burro nocciola e limone, con spinaci saltati.',
            en: 'Pan-seared trout fillet from the Cuneo valleys, brown butter and lemon, with sautéed spinach.'
          },
          price: 18,
          allergens: ['fish', 'milk']
        },
        {
          id: 'cipolle-ripiene',
          name: { it: 'Cipolle ripiene al forno', en: 'Baked stuffed onions' },
          description: {
            it: 'Cipolle dorate ripiene di pane, uova, amaretti e noce moscata, gratinate al forno con un velo di burro.',
            en: 'Golden onions stuffed with bread, egg, amaretti and nutmeg, baked with a little butter until crisp on top.'
          },
          price: 14,
          allergens: ['gluten', 'eggs', 'milk', 'nuts'], // amaretti = almonds
          tags: ['vegetarian']
        }
      ]
    },

    {
      id: 'contorni',
      name: { it: 'Contorni', en: 'Sides' },
      dishes: [
        {
          id: 'patate',
          name: { it: 'Patate al forno', en: 'Roast potatoes' },
          description: { it: 'Con rosmarino e sale grosso.', en: 'With rosemary and coarse salt.' },
          price: 5,
          allergens: [],
          tags: ['vegan']
        },
        {
          id: 'spinaci',
          name: { it: 'Spinaci saltati', en: 'Sautéed spinach' },
          description: { it: 'In padella con aglio e olio extravergine.', en: 'Pan-tossed with garlic and olive oil.' },
          price: 5,
          allergens: [],
          tags: ['vegan']
        },
        {
          id: 'verdure-griglia',
          name: { it: 'Verdure grigliate', en: 'Grilled vegetables' },
          description: {
            it: 'Le verdure di stagione del mercato, alla griglia.',
            en: 'Seasonal vegetables from the market, off the grill.'
          },
          price: 6,
          allergens: [],
          tags: ['vegan']
        },
        {
          id: 'insalata',
          name: { it: 'Insalata mista', en: 'Mixed salad' },
          description: { it: 'Foglie, carote e pomodori, condita al tavolo.', en: 'Leaves, carrots and tomatoes, dressed at the table.' },
          price: 5,
          allergens: [],
          tags: ['vegan']
        }
      ]
    },

    {
      id: 'dolci',
      name: { it: 'Dolci', en: 'Desserts' },
      dishes: [
        {
          id: 'bunet',
          name: 'Bunet',
          description: {
            it: 'Il budino piemontese al cacao e amaretti, con caramello. La ricetta di nonna Teresa.',
            en: 'Piedmont’s cocoa and amaretti pudding with caramel. Nonna Teresa’s recipe.'
          },
          price: 6.5,
          photo: '/studio/demo/menu/photos/bunet.jpg',
          allergens: ['eggs', 'milk', 'nuts'], // amaretti = almonds
          tags: ['house', 'vegetarian']
        },
        {
          id: 'zabaione',
          name: { it: 'Zabaione caldo con paste di meliga', en: 'Warm zabaglione with cornmeal biscuits' },
          description: {
            it: 'Montato al momento con Marsala, servito con i biscotti di meliga.',
            en: 'Whisked to order with Marsala, served with crumbly cornmeal biscuits.'
          },
          price: 7,
          photo: '/studio/demo/menu/photos/zabaione.jpg',
          allergens: ['gluten', 'eggs', 'milk', 'sulphites'], // biscuits: wheat + butter · Marsala
          tags: ['vegetarian']
        },
        {
          id: 'torta-nocciole',
          name: { it: 'Torta di nocciole', en: 'Hazelnut cake' },
          description: {
            it: 'Soffice torta di nocciole Piemonte IGP, servita tiepida con panna montata.',
            en: 'Soft cake of Piedmont hazelnuts, served warm with whipped cream.'
          },
          price: 6,
          allergens: ['gluten', 'eggs', 'milk', 'nuts'],
          tags: ['vegetarian']
        },
        {
          id: 'sorbetto',
          name: { it: 'Sorbetto al limone', en: 'Lemon sorbet' },
          description: { it: 'Limoni, zucchero e acqua: niente latte, niente uova.', en: 'Lemons, sugar and water: no milk, no eggs.' },
          price: 5,
          allergens: [],
          tags: ['vegan']
        }
      ]
    },

    {
      id: 'vini',
      name: { it: 'Vini e bevande', en: 'Wine & drinks' },
      note: { it: 'Vini del Piemonte, anche al calice.', en: 'Piedmont wines, most of them by the glass.' },
      drinks: true,
      dishes: [
        {
          id: 'barbera',
          name: 'Barbera d’Asti DOCG',
          description: { it: 'Rosso succoso, da tutto pasto.', en: 'Juicy, easy-going red that goes with everything.' },
          price: [{ label: { it: 'calice', en: 'glass' }, amount: 6 }, { label: { it: 'bottiglia', en: 'bottle' }, amount: 26 }],
          allergens: ['sulphites']
        },
        {
          id: 'nebbiolo',
          name: 'Langhe Nebbiolo DOC',
          description: { it: 'Rosso elegante, profuma di rosa e lampone.', en: 'Elegant red with notes of rose and raspberry.' },
          price: [{ label: { it: 'calice', en: 'glass' }, amount: 7 }, { label: { it: 'bottiglia', en: 'bottle' }, amount: 30 }],
          allergens: ['sulphites']
        },
        {
          id: 'arneis',
          name: 'Roero Arneis DOCG',
          description: { it: 'Bianco fresco, con note di pera e fiori bianchi.', en: 'Crisp white with hints of pear and white blossom.' },
          price: [{ label: { it: 'calice', en: 'glass' }, amount: 6 }, { label: { it: 'bottiglia', en: 'bottle' }, amount: 25 }],
          allergens: ['sulphites']
        },
        {
          id: 'barolo',
          name: 'Barolo DOCG',
          description: { it: 'Il re dei vini piemontesi. Perfetto con il brasato.', en: 'The king of Piedmont wines. Perfect with the brasato.' },
          price: [{ label: { it: 'bottiglia', en: 'bottle' }, amount: 58 }],
          allergens: ['sulphites']
        },
        {
          id: 'acqua',
          name: { it: 'Acqua minerale', en: 'Mineral water' },
          description: { it: 'Naturale o frizzante.', en: 'Still or sparkling.' },
          price: [{ label: '75 cl', amount: 3 }],
          allergens: []
        },
        {
          id: 'caffe',
          name: { it: 'Caffè espresso', en: 'Espresso' },
          price: 1.5,
          allergens: []
        }
      ]
    }
  ],

  // ---- Demo only: delete this block for a real client. ----
  demo: {
    banner: { it: 'Menù dimostrativo — ristorante e prezzi inventati', en: 'Demo menu — restaurant and prices are made up' },
    linkLabel: { it: 'Realizzato da Emir Uçgun Studio', en: 'Made by Emir Uçgun Studio' },
    url: 'https://studio.emirucgun.com',
    callNote: { it: 'Demo: qui partirebbe la chiamata al ristorante.', en: 'Demo: this would call the restaurant.' },
    directionsNote: { it: 'Demo: qui si aprirebbe Google Maps con le indicazioni.', en: 'Demo: this would open directions in Google Maps.' },
    pitch: { it: 'Vi piace? Ne preparo uno così per il vostro locale.', en: 'Like it? I can make one just like it for your restaurant.' }
  }

  // For a real client, replace `demo` with a small credit instead:
  // credit: { label: { it: 'Menù digitale di Emir Uçgun Studio', en: 'Digital menu by Emir Uçgun Studio' }, url: 'https://studio.emirucgun.com' }
};

export default menu;
