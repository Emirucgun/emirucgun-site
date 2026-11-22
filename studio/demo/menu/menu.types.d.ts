/* Types for menu.data.js. Nothing here is loaded by the browser: it only lets an editor
   (VS Code etc.) autocomplete and flag mistakes while you edit the data file. */

export type Lang = 'it' | 'en';

/** A text in both languages. */
export interface Text { it: string; en: string }

/** A plain string when the text is the same in both languages (e.g. "Bunet"), otherwise { it, en }. */
export type Localized = string | Text;

/** The 14 allergens of EU Regulation 1169/2011, Annex II. Numbers 1–14 follow this order. */
export type AllergenId =
  | 'gluten'      // 1  Cereali contenenti glutine
  | 'crustaceans' // 2  Crostacei
  | 'eggs'        // 3  Uova
  | 'fish'        // 4  Pesce
  | 'peanuts'     // 5  Arachidi
  | 'soy'         // 6  Soia
  | 'milk'        // 7  Latte
  | 'nuts'        // 8  Frutta a guscio
  | 'celery'      // 9  Sedano
  | 'mustard'     // 10 Senape
  | 'sesame'      // 11 Sesamo
  | 'sulphites'   // 12 Anidride solforosa e solfiti
  | 'lupin'       // 13 Lupini
  | 'molluscs';   // 14 Molluschi

/** 'vegan' already counts as vegetarian for the filters; you don't need both. 'house' = piatto della casa. */
export type Tag = 'vegetarian' | 'vegan' | 'spicy' | 'house';

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

/** ["12:00", "14:30"], 24-hour clock. A range that ends after midnight is written ["19:00", "01:00"]. */
export type TimeRange = [string, string];

export interface PriceOption {
  /** e.g. { it: 'calice', en: 'glass' } */
  label: Localized;
  amount: number;
}

export interface Dish {
  /** Unique, lowercase, no spaces: used for the page anchor. */
  id: string;
  name: Localized;
  description?: Localized;
  /** In euros: 12 or 12.5. Several sizes (glass / bottle): a list of PriceOption. */
  price: number | PriceOption[];
  /** Every allergen the dish contains, including hidden ones (stock, wine, breadcrumbs…). [] if none. */
  allergens: AllergenId[];
  tags?: Tag[];
  /** Absolute path to the square master photo, e.g. '/studio/demo/menu/photos/bunet.jpg' (at least 1200 × 1200).
      Run `python3 photos.py` in this folder: the page loads the bunet-240/480/960.webp copies it makes.
      Dishes without a photo get a text-only row; if the files are missing the row also falls back to text-only. */
  photo?: string;
  /** e.g. { it: 'Solo il giovedì', en: 'Thursdays only' } */
  available?: Localized;
}

export interface Category {
  /** Unique, lowercase, no spaces: used for the page anchor (#primi). */
  id: string;
  name: Localized;
  /** A short line under the heading. */
  note?: Localized;
  /** true for drinks: the Vegetarian / Vegan filters don't hide them (allergen filters still do). */
  drinks?: boolean;
  dishes: Dish[];
}

export interface FontSpec {
  /** CSS family name, e.g. 'Fraunces'. */
  family: string;
  /** Absolute path to a .woff2 file. Also update the matching <link rel="preload"> in index.html. */
  src: string;
  /** Weight range of a variable font ('300 800') or a single weight ('400'). */
  weight: string;
  /** Fallback stack, e.g. "Georgia, 'Times New Roman', serif". */
  fallback: string;
}

export interface Theme {
  /** The one accent colour on the light background (headings, buttons, highlights). Needs 4.5:1 contrast on #F7F2E9. */
  accent: string;
  /** The same colour, lighter, for dark mode. Needs 4.5:1 contrast on #191412. */
  accentDark: string;
  fonts: { heading: FontSpec; body: FontSpec };
}

export interface Restaurant {
  name: string;
  /** Small line above the name, e.g. "Torino · dal 1962". */
  kicker?: Localized;
  /** One short sentence under the name. */
  tagline?: Localized;
  /** Logo shown above the name (SVG or PNG, absolute path). Leave out for none. */
  logo?: { src: string; width: number; height: number };
  /** Wide photo (16:9, at least 1600 px wide) at the top of the page. Run `python3 photos.py`:
      the page loads the -800/-1600 .avif and .webp copies. Leave out for a header without photo. */
  coverPhoto?: { src: string; alt: Localized };
  address: { street: string; city: string };
  /** International format, used for the Call button: '+390110000000'. */
  phone: string;
  /** As people should read it: '011 000 0000'. */
  phoneDisplay: string;
  /** Google Maps link for the Directions button. */
  mapsUrl: string;
  /** IANA time zone used to compute "open now". */
  timeZone: string;
  /** Opening hours per day. A missing day, or [], means closed. */
  hours: Partial<Record<Weekday, TimeRange[]>>;
  /** e.g. holidays: { it: 'Chiuso dal 10 al 25 agosto', en: 'Closed 10–25 August' } */
  hoursNote?: Localized;
  /** Cover charge per person, with what it includes. */
  cover?: { amount: number; note?: Localized; allergens?: AllergenId[] };
  /** Short lines shown at the bottom (payment, VAT, booking…). */
  notes?: Localized[];
}

export interface Demo {
  /** The permanent banner at the top. */
  banner: Localized;
  /** Where the banner and the footer link go. */
  url: string;
  linkLabel: Localized;
  /** Shown when someone taps Call / Directions on the demo. */
  callNote: Localized;
  directionsNote: Localized;
  /** Footer line inviting owners to get their own menu. */
  pitch: Localized;
}

export interface MenuData {
  restaurant: Restaurant;
  theme: Theme;
  categories: Category[];
  /** Language the page opens in the first time. */
  defaultLang: Lang;
  /** localStorage key that remembers the visitor's language. */
  storageKey: string;
  /** Present only on the demo: shows the banner and turns Call / Directions into a "demo" note.
      Delete it for a real client. */
  demo?: Demo;
  /** Small credit at the very bottom, for real clients. */
  credit?: { label: Localized; url: string };
}
