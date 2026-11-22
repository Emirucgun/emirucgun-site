// Checks menu.data.js before you publish it:  node studio/demo/menu/check.mjs
// Errors (exit code 1): broken data. Warnings: things a human should double-check,
// e.g. a description that mentions butter on a dish without the milk allergen.
// The rules live in check-lib.mjs (shared with the restaurant website builder). Not loaded by the page.

import menu from './menu.data.js';
import { checkMenu } from './check-lib.mjs';

const { errors, warnings, categories, items, house } = checkMenu(menu);
console.log(`${categories} categories, ${items} items, ${house} house specials.`);
for (const w of warnings) console.log(`  warning  ${w}`);
for (const e of errors) console.log(`  ERROR    ${e}`);
if (errors.length) process.exit(1);
console.log(warnings.length ? 'OK, with warnings to review.' : 'OK.');
