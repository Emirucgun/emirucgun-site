/* Types for the restaurant website template (studio/sites/). Nothing here is loaded by a browser:
   it only lets an editor (VS Code etc.) autocomplete and flag mistakes in the data and theme files.
   The restaurant info and the menu reuse the menu demo's types, so a site's menu is written exactly
   like studio/demo/menu/menu.data.js. */

import type { Localized, Restaurant, Category, Lang } from '../demo/menu/menu.types';

export type { Localized, Restaurant, Category, Lang };

/** A photo slot. `src` is an absolute path to a .jpg; the builder adds WebP sizes next to it. */
export interface Photo {
  src: string;
  alt: Localized;
  /** Pixel size of the original, for width/height (no layout shift). */
  width: number;
  height: number;
}

/** Text in the restaurant's own script, shown once as a quiet accent (e.g. 'केसर रसोई', lang 'hi'). */
export interface NativeName { text: string; lang: string }

export interface SiteInfo extends Restaurant {
  /** e.g. { it: 'Cucina indiana del Nord', en: 'North Indian cooking' } — shown in the hero and the page title. */
  cuisine: Localized;
  /** schema.org servesCuisine, in English: ['Indian', 'North Indian']. */
  servesCuisine: string[];
  nativeName?: NativeName;
  /** One to three sentences under the name. Overrides the shorter `tagline` in the hero. */
  intro: Localized;
  story: { title: Localized; paragraphs: Localized[] };
  /** Three short facts, shown as a row: 'Tandoor a carbone', 'Biryani cotto in dum'… */
  highlights: { title: Localized; text: Localized }[];
  /** Ids of 3 dishes from the menu, shown on the home page with their photo. */
  signature: string[];
  photos: { hero: Photo; story: Photo };
  /** Digits only, with country code, for wa.me: '393401234567'. Leave out to hide WhatsApp. */
  whatsapp?: string;
  /** Online booking link (TheFork, the restaurant's own system…). Leave out to use WhatsApp/phone. */
  booking?: { url: string; label?: Localized };
  email?: string;
  /** What Google Maps should search for in the click-to-load map, e.g. 'Via Roma 1, Torino'. */
  mapsQuery: string;
  /** schema.org priceRange: '€', '€€', '€€€'. */
  priceRange: string;
  social?: { instagram?: string; facebook?: string };
}

export interface SiteData {
  /** URL slug: /demo/<slug> for a concept demo, /anteprima/<slug> for a private preview. */
  slug: string;
  /** 'demo': a fictional restaurant (banner, fake buttons, noindex).
      'preview': a real prospect's private preview (banner, real buttons, noindex + nofollow).
      'client': a live client site (no banner, indexable). */
  kind: 'demo' | 'preview' | 'client';
  /** A theme name from studio/sites/themes/ ('indiano', 'giapponese', 'messicano', 'classico'), or a theme object. */
  theme: string | Theme;
  restaurant: SiteInfo;
  categories: Category[];
  /** Only for kind 'client': the public address of the site, e.g. 'https://www.dagino.it'. */
  origin?: string;
}

/** A self-hosted .woff2 font face. */
export interface FontFace { family: string; src: string; weight: string; style?: 'normal' | 'italic' }

export interface Theme {
  name: string;
  /** Colour roles. The builder checks text contrast (4.5:1) and stops if a pair is too weak. */
  colors: {
    /** page background */ bg: string;
    /** cards, header */ surface: string;
    /** body text */ text: string;
    /** secondary text */ muted: string;
    /** buttons and links; `onPrimary` is the text on it */ primary: string; onPrimary: string;
    /** decorative accents (ornaments, rules); never used for small text */ accent: string; accent2: string;
    /** hairlines */ line: string;
    /** the dark band (hours, footer) and its text */ band: string; onBand: string;
  };
  fonts: {
    faces: FontFace[];
    /** CSS font stacks */ display: string; body: string;
    /** the 1–2 files to preload (display + body regular) */ preload: string[];
    displayWeight: number;
    /** e.g. 'uppercase' for sign-painted lettering */
    displayCase?: 'none' | 'uppercase';
    /** letter-spacing for display text, e.g. '.02em' */
    displayTracking?: string;
  };
  /** Which drawn SVG set to use: patterns, dividers, frames. See ornaments.mjs. */
  ornaments: 'block-print' | 'ink' | 'talavera' | 'none';
  /** Page texture behind everything. */
  texture: 'washi' | 'none';
  /** Hero and section arrangement. */
  layout: 'centered' | 'asymmetric' | 'split';
  /** Corner radius for cards, buttons and photos, in px. */
  radius: number;
}
