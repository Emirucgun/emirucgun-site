// Menu validation, shared by the menu demo (check.mjs) and the restaurant website builder
// (studio/sites/build.mjs). Not loaded by any page.
//
//   checkMenu(menu) → { errors, warnings, categories, items, house }
//
// `menu` needs `restaurant` (hours, timeZone, optional cover) and `categories`, i.e. the shape of
// menu.data.js. Errors: broken data. Warnings: things a human should double-check, e.g. a
// description that mentions butter on a dish without the milk allergen.

import { ALLERGENS as LIST } from './allergens.js';

const ALLERGENS = LIST.map((a) => a.id);
const ANIMAL = ['fish', 'crustaceans', 'molluscs'];
const NOT_VEGAN = [...ANIMAL, 'eggs', 'milk'];

// Words in the Italian description (or name) that usually mean an allergen is present.
// Piedmontese classics first, then ingredients common in Indian, Japanese and Mexican kitchens.
const HINTS = {
  gluten: /\b(pane(?!er)|mollica|pangrattato|panko|farina|grissini|biscott\w*|pasta\b|tajarin|tagliolini|agnolotti|ravioli|gnocchi|meliga|birra|crostini|focaccia|orzo|farro|naan|roti|paratha|samosa|gyoza|ramen|udon|tempura|salsa di soia|shoyu|seitan|churros|tortillas? di (?:farina|frumento|grano))/i,
  eggs: /\b(uov\w+|tuorl\w+|maionese|zabaione|tonnat\w+|meringa|flan|purin)/i,
  fish: /\b(acciugh\w+|tonno|tonnat\w+|trota|salmone|baccalà|pesce|merluzzo|bagna càuda|bagnet verde|dashi|katsuobushi|sgombro|anguilla|sashimi|branzino|orata)/i,
  crustaceans: /\b(gamber\w+|scamp\w+|aragost\w+|astice|granchio)/i,
  molluscs: /\b(cozze|vongole|calamar\w+|polpo|seppi\w+|lumache)/i,
  milk: /\b(burro|panna|latte|formagg\w+|parmigiano|grana|tomin\w+|fonduta|fontina|castelmagno|mozzarella|ricotta|besciamella|gelato|yogurt|paneer|ghee|lassi|kulfi|queso|cotija)/i,
  nuts: /\b((?<!burro )nocciol\w+|amarett\w+|mandorl\w+|noci\b|pistacch\w+|pinoli|gianduia|anacard\w+)/i,
  peanuts: /\b(arachid\w+|nocciolin\w+)/i,
  celery: /\b(sedano|brodo|soffritto|ragù|brasat\w+|minestr\w+)/i,
  mustard: /\b(senape|mostarda)/i,
  sesame: /\b(sesamo|tahina)/i,
  soy: /\b(soia|tofu|edamame|miso|shoyu)/i,
  sulphites: /\b(vino|barolo|barbera|nebbiolo|marsala|aceto|vermouth|sfumat\w+|moscato)/i,
  lupin: /\b(lupin\w+)/i
};

const text = (v) => (v == null ? { it: '', en: '' } : typeof v === 'string' ? { it: v, en: v } : v);
const idOk = /^[a-z0-9-]+$/;

/** @param {{ restaurant: any, categories: any[] }} menu */
export function checkMenu(menu) {
  const errors = [];
  const warnings = [];
  const bothLangs = (v, where) => {
    if (v == null) return;
    const x = text(v);
    if (!x.it?.trim() || !x.en?.trim()) errors.push(`${where}: missing Italian or English text`);
  };

  const r = menu.restaurant;
  for (const [day, ranges] of Object.entries(r.hours || {})) {
    for (const range of ranges) {
      if (!Array.isArray(range) || range.length !== 2 || !range.every((t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t))) {
        errors.push(`hours.${day}: "${range}" is not ["HH:MM", "HH:MM"]`);
      }
    }
  }
  try { new Intl.DateTimeFormat('it', { timeZone: r.timeZone }); } catch { errors.push(`timeZone "${r.timeZone}" is not valid`); }
  for (const a of r.cover?.allergens || []) if (!ALLERGENS.includes(a)) errors.push(`cover: unknown allergen "${a}"`);

  const catIds = new Set();
  const dishIds = new Set();
  let house = 0;
  let items = 0;

  for (const c of menu.categories) {
    if (!idOk.test(c.id)) errors.push(`category "${c.id}": id must be lowercase letters, digits and dashes`);
    if (catIds.has(c.id)) errors.push(`category "${c.id}": duplicate id`);
    catIds.add(c.id);
    bothLangs(c.name, `category ${c.id} name`);
    bothLangs(c.note, `category ${c.id} note`);

    for (const d of c.dishes) {
      items++;
      const where = `${c.id} › ${d.id}`;
      if (!idOk.test(d.id)) errors.push(`${where}: id must be lowercase letters, digits and dashes`);
      if (dishIds.has(d.id) || catIds.has(d.id)) errors.push(`${where}: duplicate id`);
      dishIds.add(d.id);
      bothLangs(d.name, `${where} name`);
      bothLangs(d.description, `${where} description`);
      bothLangs(d.available, `${where} available`);

      const prices = typeof d.price === 'number' ? [d.price] : (d.price || []).map((p) => p.amount);
      if (!prices.length || prices.some((p) => typeof p !== 'number' || !(p > 0))) errors.push(`${where}: price must be a positive number`);
      if (Array.isArray(d.price)) d.price.forEach((p, i) => bothLangs(p.label, `${where} price[${i}] label`));

      if (!Array.isArray(d.allergens)) { errors.push(`${where}: allergens must be a list ([] if none)`); continue; }
      for (const a of d.allergens) if (!ALLERGENS.includes(a)) errors.push(`${where}: unknown allergen "${a}"`);
      if (new Set(d.allergens).size !== d.allergens.length) errors.push(`${where}: an allergen is listed twice`);

      const tags = d.tags || [];
      if (tags.includes('house')) house++;
      if (tags.includes('vegan')) {
        const bad = d.allergens.filter((a) => NOT_VEGAN.includes(a));
        if (bad.length) errors.push(`${where}: tagged vegan but contains ${bad.join(', ')}`);
        if (tags.includes('vegetarian')) warnings.push(`${where}: 'vegan' already counts as vegetarian, 'vegetarian' is redundant`);
      }
      if (tags.includes('vegetarian')) {
        const bad = d.allergens.filter((a) => ANIMAL.includes(a));
        if (bad.length) errors.push(`${where}: tagged vegetarian but contains ${bad.join(', ')}`);
      }

      // For drinks only the name is checked: tasting notes ("perfect with the brasato") aren't ingredients.
      const it = c.drinks ? text(d.name).it : `${text(d.name).it} ${text(d.description).it}`;
      for (const [allergen, re] of Object.entries(HINTS)) {
        const m = it.match(re);
        if (!m || d.allergens.includes(allergen)) continue;
        if (/\b(senza|niente|no)\s+$/i.test(it.slice(0, m.index))) continue; // "senza latte", "niente uova"
        warnings.push(`${where}: mentions "${m[0]}" but doesn't list ${allergen}`);
      }
      if (d.photo && !d.photo.startsWith('/')) warnings.push(`${where}: photo path should be absolute (start with /)`);
    }
  }

  if (house < 2 || house > 3) warnings.push(`${house} dishes are tagged 'house': 2–3 keeps them special`);
  return { errors, warnings, categories: menu.categories.length, items, house };
}
