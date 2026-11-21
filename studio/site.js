/* studio.emirucgun.com: shared script for every studio page. No dependencies.
   - IT | EN toggle: both languages are in the HTML as <span lang="it"> / <span lang="en">;
     CSS hides the one that is not active. Attributes (alt, aria-label, …) switch via data-en-*.
   - Contact links (WhatsApp, email, LinkedIn) are filled in from config.js.
   - Prices marked data-eur are formatted for the active language. */
(() => {
  const C = window.STUDIO || {};
  const root = document.documentElement;
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const isSet = (v) => typeof v === 'string' && v.trim() !== '' && v !== 'PLACEHOLDER' && !v.includes('PLACEHOLDER');
  const lang = () => (root.lang === 'en' ? 'en' : 'it');

  /* ---------- clean URLs on the subdomain ----------
     Links in the HTML start with /studio so they also work on localhost and Vercel previews.
     On studio.emirucgun.com the same pages live at the root, so drop the prefix. */
  if (location.hostname === 'studio.emirucgun.com') {
    $$('a[href^="/studio"]').forEach((a) => {
      const href = a.getAttribute('href').replace(/^\/studio(?=\/|#|\?|$)/, '') || '/';
      a.setAttribute('href', href.startsWith('#') ? '/' + href : href);
    });
  }

  /* ---------- prices ---------- */
  const money = (n, l) => new Intl.NumberFormat(l === 'en' ? 'en-GB' : 'it-IT', {
    style: 'currency', currency: 'EUR',
    minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2
  }).format(n);
  const renderPrices = (l) => $$('[data-eur]').forEach((el) => { el.textContent = money(+el.dataset.eur, l); });

  /* ---------- contact links ---------- */
  const missing = [];
  ['whatsapp', 'email', 'linkedin'].forEach((k) => { if (!isSet(C[k])) missing.push(k); });
  if (missing.length) console.warn('[studio] Fill in studio/config.js:', missing.join(', '));

  const renderContacts = (l) => {
    const msg = (C.message && C.message[l]) || '';
    $$('[data-wa]').forEach((a) => {
      a.href = `https://wa.me/${isSet(C.whatsapp) ? C.whatsapp : 'PLACEHOLDER'}?text=${encodeURIComponent(msg)}`;
      a.target = '_blank';
      a.rel = 'noopener';
    });
    $$('[data-mail]').forEach((a) => {
      const subject = (C.emailSubject && C.emailSubject[l]) || '';
      a.href = `mailto:${isSet(C.email) ? C.email : 'PLACEHOLDER'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;
    });
  };
  $$('[data-mail-text]').forEach((el) => { el.textContent = isSet(C.email) ? C.email : 'PLACEHOLDER'; });
  $$('[data-phone-text]').forEach((el) => {
    if (isSet(C.phoneDisplay)) el.textContent = C.phoneDisplay;
    else el.closest('[data-if-phone]')?.remove();
  });
  $$('[data-linkedin]').forEach((a) => {
    if (isSet(C.linkedin)) a.href = C.linkedin;
    else a.closest('[data-if-linkedin]')?.setAttribute('hidden', '');
  });
  $$('[data-main-site]').forEach((a) => { if (C.mainSite) a.href = C.mainSite; });

  /* ---------- photo: shown only once the file has loaded, initials until then ---------- */
  $$('[data-photo]').forEach((box) => {
    if (!C.photo) return;
    const img = new Image();
    img.alt = box.dataset.alt || '';
    img.decoding = 'async';
    img.width = 400; img.height = 400;
    img.onload = () => { box.textContent = ''; box.append(img); box.classList.add('has-photo'); };
    img.src = C.photo;
  });

  /* ---------- language ---------- */
  const ATTRS = ['alt', 'aria-label', 'title', 'content'];
  const baseTitle = document.title;
  const setLang = (l, save) => {
    root.lang = l;
    if (save) { try { localStorage.setItem('lang', l); } catch {} }
    ATTRS.forEach((attr) => $$(`[data-en-${attr}]`).forEach((el) => {
      if (!el.hasAttribute(`data-it-${attr}`)) el.setAttribute(`data-it-${attr}`, el.getAttribute(attr) || '');
      el.setAttribute(attr, el.getAttribute(`data-${l}-${attr}`));
    }));
    document.title = l === 'en' && root.dataset.titleEn ? root.dataset.titleEn : baseTitle;
    $$('[data-set-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setLang === l)));
    renderPrices(l);
    renderContacts(l);
    document.dispatchEvent(new CustomEvent('studio:lang', { detail: l }));
  };
  $$('[data-set-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.setLang, true)));
  // keeps other open studio pages (and the menu preview iframe) in the same language
  addEventListener('storage', (e) => { if (e.key === 'lang' && (e.newValue === 'it' || e.newValue === 'en')) setLang(e.newValue, false); });
  setLang(lang(), false);

  /* ---------- live preview of the menu demo, only on wide screens (phones get the button) ---------- */
  const preview = document.querySelector('[data-preview]');
  if (preview && matchMedia('(min-width: 900px)').matches) {
    const frame = document.createElement('iframe');
    frame.src = preview.dataset.preview;
    frame.title = preview.dataset.title || '';
    frame.loading = 'lazy';
    preview.append(frame);
  }
})();
