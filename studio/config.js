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

  // The three concept restaurant websites (/demo/ristorante-indiano, -giapponese, -messicano).
  // false: not built (their URLs return 404), and the "Siti web" section on /esempi and every link to
  // them are left out. true: built and shown. After changing it, run
  //   node studio/sites/build.mjs && python3 studio/tools/build-pages.py && node studio/tools/check-site.mjs
  // The website packages on /prezzi stay either way.
  showWebsiteDemos: false,

  // Your main, professional site.
  mainSite: 'https://www.emirucgun.com',

  /* ---------- prices ----------
     Every price on every page comes from here: change a number, save, done. The numbers written
     inside the HTML are only the fallback for browsers without JavaScript: run
     `node studio/tools/check-site.mjs` after changing prices and it lists any that differ.

     Time-limited offer: switched off (null). The mechanism is still there for the future: set
       offer: { name: 'Saldi', ends: '2027-01-31T23:59', timeZone: 'Europe/Rome' },
     and add an `offer` price next to `regular` for the packages on offer (e.g. photo: { offer: 119, regular: 149 }).
     Until `ends`, those packages show the `offer` price; the pages carry no banner, countdown or
     struck-through price any more, so add that markup back too if you want it. */
  offer: null,
  prices: {
    trial:   { regular: 79 },  // Prova: 10 dish photos, paid only if satisfied
    photo:   { regular: 149 }, // Foto dei piatti
    vis:     { regular: 349 }, // Visibilità
    full:    { regular: 449 }, // Completo
    site:    { regular: 599 }, // Sito + Menù
    renew:   { regular: 849 }, // Rinnovo totale (Sito + Menù + Google + 20 foto)
    monthly: { regular: 149 }  // Gestione mensile, per month (includes hosting + small site updates)
  },

  // Package names, used in the prefilled WhatsApp messages.
  packages: {
    trial: { it: 'Prova', en: 'Trial' },
    photo: { it: 'Foto dei piatti', en: 'Dish photos' },
    vis: { it: 'Visibilità', en: 'Visibility' },
    full: { it: 'Completo', en: 'Complete' },
    site: { it: 'Sito + Menù', en: 'Website + Menu' },
    renew: { it: 'Rinnovo totale', en: 'Total refresh' },
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
   With an offer: turns `ends` + `timeZone` into one exact moment, the same for every visitor whatever
   their phone's clock zone, and marks the page before it is drawn so the right prices show at once.
   With `offer: null`: no offer, regular prices only. */
(function (S) {
  var m = S.offer && /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)$/.exec(S.offer.ends || '');
  if (!m) {
    if (S.offer) console.warn('[studio] config.js: offer.ends must look like 2027-01-31T23:59. Offer ignored.');
    S.offer = null;
    S.offerActive = function () { return false; };
    document.documentElement.setAttribute('data-offer', 'off');
    return;
  }
  var guess = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  // offset of the time zone at that moment: format the UTC guess in the zone and compare
  var offsetAt = function (t) {
    try {
      var p = {};
      new Intl.DateTimeFormat('en-US', { timeZone: S.offer.timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
        .formatToParts(new Date(t)).forEach(function (x) { p[x.type] = x.value; });
      return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute) - t;
    } catch (e) { return 3600000; } // Europe/Rome in winter
  };
  S.offer.endsAt = guess - offsetAt(guess - offsetAt(guess)); // two passes: right across DST changes
  S.offerActive = function () { return Date.now() < S.offer.endsAt; };
  document.documentElement.setAttribute('data-offer', S.offerActive() ? 'on' : 'off');
})(window.STUDIO);
