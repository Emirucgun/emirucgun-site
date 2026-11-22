/* ============================================================
   studio.emirucgun.com: everything you may need to change, in one place.
   Every studio page reads this file. Anything still set to 'PLACEHOLDER' is hidden
   or shows a warning in the browser console.
   ============================================================ */
window.STUDIO = {
  // WhatsApp number in international format, digits only, no "+" or spaces.
  // Italian mobile = 39 + the number. Example: '393401234567'
  whatsapp: '393445034591',

  // The same number as people should read it on the page. Example: '+39 340 123 4567'
  // Leave it as 'PLACEHOLDER' to hide the number and show only the WhatsApp button.
  phoneDisplay: 'PLACEHOLDER',

  // Your contact email.
  email: 'emirucgun@gmail.com',

  // Your LinkedIn profile URL.
  linkedin: 'https://www.linkedin.com/in/eucgun/',

  // Your main, professional site.
  mainSite: 'https://www.emirucgun.com',

  /* ---------- prices and the Black Friday offer ----------
     The offer ends at `ends` (local time in `timeZone`). Until then the site shows the `offer`
     price with the `regular` price struck through, plus the banner and countdown. From that
     moment on, for every visitor, the banner and countdown disappear and only `regular` prices
     are shown. Nothing else to change. To run a new offer, set a new `ends` date (and prices).
     The numbers written inside the HTML are only the fallback for browsers without JavaScript:
     run `node studio/tools/check-site.mjs` after changing prices and it lists any that differ. */
  offer: {
    name: 'Black Friday',
    ends: '2026-11-30T23:59',
    timeZone: 'Europe/Rome'
  },
  prices: {
    photo:   { offer: 119, regular: 149 }, // Foto dei piatti
    vis:     { offer: 249, regular: 349 }, // Visibilità
    full:    { offer: 349, regular: 449 }, // Completo
    monthly: { offer: 149, regular: 149 }  // Gestione mensile, per month
  },

  // Package names, used in the prefilled WhatsApp messages.
  packages: {
    photo: { it: 'Foto dei piatti', en: 'Dish photos' },
    vis: { it: 'Visibilità', en: 'Visibility' },
    full: { it: 'Completo', en: 'Complete' },
    monthly: { it: 'Gestione mensile', en: 'Monthly management' }
  },

  // The text WhatsApp and email open with, already typed for the visitor.
  // {pack} and {price} are filled in by the package buttons.
  message: {
    it: "Buongiorno Emir, ho visto il sito e vorrei l'analisi gratuita per il mio locale. Nome del locale: ",
    en: "Hello Emir, I saw your site and I'd like the free review for my restaurant. Restaurant name: "
  },
  packageMessage: {
    it: 'Buongiorno Emir, mi interessa il pacchetto {pack} ({price}). Nome del locale: ',
    en: "Hello Emir, I'm interested in the {pack} package ({price}). Restaurant name: "
  },
  emailSubject: {
    it: 'Richiesta analisi gratuita',
    en: 'Free review request'
  }
};

/* ---- Nothing to edit below. ----
   Turns `ends` + `timeZone` into one exact moment, the same for every visitor whatever their
   phone's clock zone, and marks the page before it is drawn so the right prices show at once. */
(function (S) {
  var m = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)$/.exec(S.offer.ends);
  var guess = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  // offset of the time zone at that moment: format the UTC guess in the zone and compare
  var offsetAt = function (t) {
    try {
      var p = {};
      new Intl.DateTimeFormat('en-US', { timeZone: S.offer.timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
        .formatToParts(new Date(t)).forEach(function (x) { p[x.type] = x.value; });
      return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute) - t;
    } catch { return 3600000; } // Europe/Rome in winter
  };
  S.offer.endsAt = guess - offsetAt(guess - offsetAt(guess)); // two passes: right across DST changes
  S.offerActive = function () { return Date.now() < S.offer.endsAt; };
  document.documentElement.setAttribute('data-offer', S.offerActive() ? 'on' : 'off');
})(window.STUDIO);
