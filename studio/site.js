/* studio.emirucgun.com: shared script for every studio page. No dependencies.
   - IT | EN toggle: both languages are in the HTML as <span lang="it"> / <span lang="en">;
     CSS hides the inactive one. Attributes (alt, aria-label, …) switch via data-en-*.
   - Prices come from config.js (window.STUDIO). The optional time-limited offer (config `offer`, null = none)
     only switches packages that have an `offer` price, and drives banner/countdown markup if a page has any.
   - WhatsApp / email links, mini form and calculator build their text from config.js too.
   - Before/after sliders, mobile menu, sticky bar, scroll reveal and count-up. */
(() => {
  const C = window.STUDIO || {};
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const isSet = (v) => typeof v === 'string' && v.trim() !== '' && !v.includes('PLACEHOLDER');
  const lang = () => (root.lang === 'en' ? 'en' : 'it');
  const motionOK = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = (n) => String(n).padStart(2, '0');

  /* ---------- clean URLs on the subdomain ----------
     Links in the HTML start with /studio so they also work on localhost and Vercel previews.
     On studio.emirucgun.com the same pages live at the root, so drop the prefix. */
  if (location.hostname === 'studio.emirucgun.com') {
    $$('a[href^="/studio"]').forEach((a) => {
      const href = a.getAttribute('href').replace(/^\/studio(?=\/|#|\?|$)/, '') || '/';
      a.setAttribute('href', href.startsWith('#') ? '/' + href : href);
    });
  }

  /* ---------- offer + prices ---------- */
  const offerOn = () => (typeof C.offerActive === 'function' ? C.offerActive() : false);
  const P = C.prices || {};
  const priceOf = (k) => (P[k] ? (offerOn() && P[k].offer != null ? P[k].offer : P[k].regular) : 0);
  const money = (n, l = lang()) => new Intl.NumberFormat(l === 'en' ? 'en-GB' : 'it-IT', {
    style: 'currency', currency: 'EUR', minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2
  }).format(n);
  const endDate = C.offer && C.offer.endsAt ? new Date(C.offer.endsAt) : null;
  const fmtDate = (l) => endDate.toLocaleDateString(l === 'en' ? 'en-GB' : 'it-IT', { day: 'numeric', month: 'long', timeZone: C.offer.timeZone });
  const fmtTime = (l) => endDate.toLocaleTimeString(l === 'en' ? 'en-GB' : 'it-IT', { hour: '2-digit', minute: '2-digit', timeZone: C.offer.timeZone });

  const renderPrices = (l) => {
    $$('[data-price]').forEach((el) => { if (P[el.dataset.price]) el.textContent = money(priceOf(el.dataset.price), l); });
    $$('[data-price-regular]').forEach((el) => { const p = P[el.dataset.priceRegular]; if (p) el.textContent = money(p.regular, l); });
    $$('[data-price-offer]').forEach((el) => { const p = P[el.dataset.priceOffer]; if (p && p.offer != null) el.textContent = money(p.offer, l); });
    $$('[data-eur]').forEach((el) => { el.textContent = money(+el.dataset.eur, l); });
    if (endDate) {
      $$('[data-offer-date]').forEach((el) => { el.textContent = fmtDate(el.closest('[lang]')?.lang || l); });
      $$('[data-offer-time]').forEach((el) => { el.textContent = fmtTime(el.closest('[lang]')?.lang || l); });
    }
  };

  /* countdown: days, hours, minutes to the one fixed end moment. Ticks once a minute, silently
     (no aria-live): screen readers get the plain "ends on 30 November at 23:59" text instead. */
  const countdown = () => {
    if (!endDate) return;
    const left = C.offer.endsAt - Date.now();
    if (left <= 0) {
      // the offer just ended with the page open: switch to regular prices once (renderAll calls back here)
      if (root.getAttribute('data-offer') !== 'off') { root.setAttribute('data-offer', 'off'); renderAll(); }
      return;
    }
    const m = Math.ceil(left / 60000); // minutes still to go, so it reads 00m only at the end
    const d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mm = m % 60;
    const units = lang() === 'en' ? ['d', 'h', 'm'] : ['g', 'h', 'm'];
    $$('[data-cd-text]').forEach((el) => { el.textContent = `${d}${units[0]} ${pad(h)}${units[1]} ${pad(mm)}${units[2]}`; });
    $$('[data-cd-box]').forEach((box) => {
      $('[data-u="d"]', box).textContent = d;
      $('[data-u="h"]', box).textContent = pad(h);
      $('[data-u="m"]', box).textContent = pad(mm);
    });
    clearTimeout(countdown.t);
    countdown.t = setTimeout(countdown, Math.min(60000 - (Date.now() % 60000) + 50, left + 50));
  };
  document.addEventListener('visibilitychange', () => { if (!document.hidden) countdown(); });

  /* ---------- contact links ---------- */
  const missing = ['whatsapp', 'email'].filter((k) => !isSet(C[k]));
  if (missing.length) console.warn('[studio] Fill in studio/config.js:', missing.join(', '));
  const waUrl = (text) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`;
  const packText = (k, l) => {
    const name = (C.packages && C.packages[k] && C.packages[k][l]) || k;
    const price = money(priceOf(k), l) + (k === 'monthly' ? (l === 'en' ? '/month' : '/mese') : '');
    return C.packageMessage[l].replace('{pack}', name).replace('{price}', price);
  };
  const renderContacts = (l) => {
    const msg = (C.message && C.message[l]) || '';
    $$('[data-wa]').forEach((a) => {
      a.href = waUrl(a.dataset.wa && C.packageMessage ? packText(a.dataset.wa, l) : msg);
      a.target = '_blank';
      a.rel = 'noopener';
    });
    $$('[data-mail]').forEach((a) => {
      const subject = (C.emailSubject && C.emailSubject[l]) || '';
      a.href = `mailto:${C.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;
    });
  };
  $$('[data-mail-text]').forEach((el) => { el.textContent = C.email; });
  $$('[data-phone-text]').forEach((el) => {
    if (isSet(C.phoneDisplay)) el.textContent = C.phoneDisplay;
    else el.closest('[data-if-phone]')?.remove();
  });
  $$('[data-linkedin]').forEach((a) => {
    if (isSet(C.linkedin)) a.href = C.linkedin;
    else a.hidden = true;
  });
  $$('[data-main-site]').forEach((a) => { if (C.mainSite) a.href = C.mainSite; });

  /* free-review mini form: opens WhatsApp with the name and link already typed. No backend. */
  $$('[data-wa-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.elements.locale.value.trim();
      const link = form.elements.link.value.trim();
      if (!name) { form.elements.locale.focus(); return; }
      const en = lang() === 'en';
      const text = en
        ? `Hello Emir, I'd like the free review for my restaurant.\nRestaurant: ${name}` + (link ? `\nDelivery app / Google link: ${link}` : '')
        : `Buongiorno Emir, vorrei l'analisi gratuita per il mio locale.\nLocale: ${name}` + (link ? `\nLink app di delivery / Google: ${link}` : '');
      const w = window.open(waUrl(text), '_blank'); // ('noopener' would make this always null)
      if (w) w.opener = null;
      else location.href = waUrl(text);
    });
  });

  /* ---------- "Quanto vale una foto?" calculator ---------- */
  const calcs = $$('[data-calc]');
  const renderCalc = () => calcs.forEach((box) => {
    const orders = +$('[name="orders"]', box).value;
    const aov = +$('[name="aov"]', box).value;
    const lift = +box.dataset.calc || 0.12;
    const extra = Math.round(orders * aov * lift);
    const price = priceOf('vis');
    const days = extra > 0 ? Math.ceil(price / (extra / 30)) : null;
    const l = lang();
    $('[data-out="orders"]', box).value = orders;
    $('[data-out="aov"]', box).value = money(aov, l);
    $('[name="orders"]', box).setAttribute('aria-valuetext', l === 'en' ? `${orders} orders a month` : `${orders} ordini al mese`);
    $('[name="aov"]', box).setAttribute('aria-valuetext', money(aov, l));
    $('[data-out="extra"]', box).textContent = money(extra, l);
    $$('[data-out="days"]', box).forEach((el) => { el.textContent = days ? String(days) : '—'; });
    $$('[data-out="vis"]', box).forEach((el) => { el.textContent = money(price, l); });
  });
  calcs.forEach((box) => box.addEventListener('input', renderCalc));

  /* ---------- language ---------- */
  const ATTRS = ['alt', 'aria-label', 'title', 'content', 'placeholder'];
  const baseTitle = document.title;
  const renderAll = () => {
    const l = lang();
    renderPrices(l);
    renderContacts(l);
    renderCalc();
    countdown();
  };
  const setLang = (l, save) => {
    root.lang = l;
    if (save) { try { localStorage.setItem('lang', l); } catch {} }
    ATTRS.forEach((attr) => $$(`[data-en-${attr}]`).forEach((el) => {
      if (!el.hasAttribute(`data-it-${attr}`)) el.setAttribute(`data-it-${attr}`, el.getAttribute(attr) || '');
      el.setAttribute(attr, el.getAttribute(`data-${l}-${attr}`));
    }));
    document.title = l === 'en' && root.dataset.titleEn ? root.dataset.titleEn : baseTitle;
    $$('[data-set-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setLang === l)));
    renderAll();
    document.dispatchEvent(new CustomEvent('studio:lang', { detail: l }));
  };
  $$('[data-set-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.setLang, true)));
  // keeps other open studio pages (and the menu preview iframe) in the same language
  addEventListener('storage', (e) => { if (e.key === 'lang' && (e.newValue === 'it' || e.newValue === 'en')) setLang(e.newValue, false); });
  setLang(lang(), false);

  /* ---------- mobile menu ---------- */
  const burger = $('.burger');
  const nav = burger && document.getElementById(burger.getAttribute('aria-controls'));
  if (burger && nav) {
    const toggle = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
    };
    burger.addEventListener('click', () => toggle(burger.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) toggle(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) { toggle(false); burger.focus(); }
    });
    document.addEventListener('click', (e) => { if (!e.target.closest('.top')) toggle(false); });
    matchMedia('(min-width: 900px)').addEventListener('change', () => toggle(false));
  }

  /* ---------- before/after sliders ---------- */
  $$('[data-ba]').forEach((box) => {
    const input = $('input', box);
    let pos = 50, drag = null, hinting = 0;
    const set = (v, user) => {
      pos = Math.max(0, Math.min(100, v));
      box.style.setProperty('--pos', pos + '%');
      input.value = Math.round(pos);
      input.setAttribute('aria-valuetext', lang() === 'en'
        ? `${Math.round(pos)}% before, ${100 - Math.round(pos)}% after`
        : `${Math.round(pos)}% prima, ${100 - Math.round(pos)}% dopo`);
      if (user) { box.classList.add('touched'); cancelAnimationFrame(hinting); hinting = 0; }
    };
    const fromX = (x) => { const r = box.getBoundingClientRect(); return ((x - r.left) / r.width) * 100; };
    // mouse: follows from the press. Touch/pen: follows a horizontal drag or a tap; a vertical
    // swipe scrolls the page as usual (touch-action: pan-y) and the browser cancels the pointer.
    box.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      drag = { id: e.pointerId, x: e.clientX, moved: false };
      if (e.pointerType === 'mouse') { set(fromX(e.clientX), true); box.setPointerCapture(e.pointerId); }
      box.classList.add('dragging');
    });
    box.addEventListener('pointermove', (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      if (!drag.moved && Math.abs(e.clientX - drag.x) > 4) {
        drag.moved = true;
        try { box.setPointerCapture(e.pointerId); } catch {}
      }
      if (drag.moved || e.pointerType === 'mouse') set(fromX(e.clientX), true);
    });
    const end = (e) => {
      if (!drag) return;
      if (e.type === 'pointerup' && !drag.moved && e.pointerType !== 'mouse') set(fromX(e.clientX), true);
      drag = null;
      box.classList.remove('dragging');
    };
    box.addEventListener('pointerup', end);
    box.addEventListener('pointercancel', end);
    input.addEventListener('input', () => set(+input.value, true));
    document.addEventListener('studio:lang', () => set(pos));
    set(50);

    // one gentle sweep the first time the slider is seen, to show it can be dragged
    const hint = () => {
      if (!motionOK || box.classList.contains('touched') || hinting) return;
      const t0 = performance.now(), dur = 1600;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        set(50 - 22 * Math.sin(k * Math.PI * 2) * (1 - k * 0.35));
        hinting = k < 1 ? requestAnimationFrame(step) : 0;
        if (k >= 1) set(50);
      };
      hinting = requestAnimationFrame(step);
    };
    box.hint = hint;
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(([en]) => {
        if (en.isIntersecting) { io.disconnect(); setTimeout(hint, 700); }
      }, { threshold: 0.6 });
      io.observe(box);
    }
  });
  // "Guarda il prima/dopo": scroll to the slider and replay the sweep
  $$('[data-show-ba]').forEach((a) => a.addEventListener('click', () => {
    const box = document.getElementById(a.getAttribute('href').slice(1))?.querySelector('[data-ba]');
    if (box && box.hint) setTimeout(box.hint, 450);
  }));

  /* ---------- sticky bottom bar (phones): visible after the hero, hidden over the final CTA ---------- */
  const bar = $('.stickybar');
  const trigger = $('[data-bar-after]');
  if (bar && trigger && 'IntersectionObserver' in window) {
    document.body.classList.add('has-bar');
    let past = false, atEnd = false;
    const upd = () => bar.classList.toggle('show', past && !atEnd);
    new IntersectionObserver(([en]) => { past = !en.isIntersecting && en.boundingClientRect.top < 0; upd(); }).observe(trigger);
    const endEl = $('[data-bar-hide]');
    if (endEl) new IntersectionObserver(([en]) => { atEnd = en.isIntersecting; upd(); }).observe(endEl);
  }

  /* ---------- scroll reveal, staggered groups, count-up ---------- */
  $$('[data-stagger]').forEach((p) => [...p.children].forEach((c, i) => {
    c.classList.add('rv');
    c.style.setProperty('--d', `${i * 90}ms`);
  }));
  const countUp = (el) => {
    const to = +el.dataset.count;
    if (!motionOK) return;
    const t0 = performance.now(), dur = 900;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      io.unobserve(el);
      if (el.dataset.count) { countUp(el); return; }
      el.classList.add('rv-in');
      el.classList.remove('rv-wait');
      // hand transforms and transitions back to the element's own styles (hover lifts etc.)
      setTimeout(() => el.classList.remove('rv-in'), 650 + (parseInt(el.style.getPropertyValue('--d')) || 0));
    }), { rootMargin: '0px 0px -6% 0px' });
    // only what starts below the fold is hidden, so nothing visible on load ever blinks
    $$('.rv').forEach((el) => {
      if (!motionOK || el.getBoundingClientRect().top < innerHeight) return;
      el.classList.add('rv-wait');
      io.observe(el);
    });
    $$('[data-count]').forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) return;
      io.observe(el);
    });
  }

  /* ---------- live preview of the menu demo, only on wide screens (phones get the button) ---------- */
  const preview = $('[data-preview]');
  if (preview && matchMedia('(min-width: 900px)').matches) {
    const frame = document.createElement('iframe');
    frame.src = preview.dataset.preview;
    frame.title = preview.dataset.title || '';
    frame.loading = 'lazy';
    preview.append(frame);
  }
})();
