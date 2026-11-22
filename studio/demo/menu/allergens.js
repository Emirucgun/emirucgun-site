// @ts-check
/* The 14 allergens of Reg. (EU) 1169/2011, Annex II, in their official order (= their number).
   Shared by the menu demo (menu.js) and the restaurant website template (studio/sites/), so both
   always number and name allergens the same way. No DOM code: it also runs in Node. */

/** @typedef {import('./menu.types').AllergenId} AllergenId */

export const ALLERGENS = /** @type {const} */ ([
  ['gluten', 'Glutine', 'Gluten', 'Cereali contenenti glutine', 'Cereals containing gluten'],
  ['crustaceans', 'Crostacei', 'Crustaceans'],
  ['eggs', 'Uova', 'Eggs'],
  ['fish', 'Pesce', 'Fish'],
  ['peanuts', 'Arachidi', 'Peanuts'],
  ['soy', 'Soia', 'Soy', 'Soia', 'Soybeans'],
  ['milk', 'Latte', 'Milk', 'Latte e derivati (incluso il lattosio)', 'Milk and dairy (including lactose)'],
  ['nuts', 'Frutta a guscio', 'Tree nuts', 'Frutta a guscio (mandorle, nocciole, noci…)', 'Tree nuts (almonds, hazelnuts, walnuts…)'],
  ['celery', 'Sedano', 'Celery'],
  ['mustard', 'Senape', 'Mustard'],
  ['sesame', 'Sesamo', 'Sesame', 'Semi di sesamo', 'Sesame seeds'],
  ['sulphites', 'Solfiti', 'Sulphites', 'Anidride solforosa e solfiti', 'Sulphur dioxide and sulphites'],
  ['lupin', 'Lupini', 'Lupin'],
  ['molluscs', 'Molluschi', 'Molluscs']
]).map(([id, it, en, itLong, enLong], i) => ({
  id: /** @type {AllergenId} */ (id),
  n: i + 1,
  name: { it, en },
  long: { it: itLong || it, en: enLong || en }
}));
/** @type {Record<string, (typeof ALLERGENS)[number]>} */
export const ALLERGEN = Object.fromEntries(ALLERGENS.map((a) => [a.id, a]));
