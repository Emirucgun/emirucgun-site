/* Emir Uçgun — Wallet interactions. No dependencies.
   Animations touch only transform/opacity so they stay on the compositor. */
(() => {
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const motion = () => !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = 'cubic-bezier(.32,.72,0,1)';   // iOS sheet curve
  const store = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

  const page = $('#home');
  const stack = $('#stack');
  const sheet = $('#sheet');
  const sheetBg = $('.sheet-bg', sheet);
  const sheetBar = $('.sheet-bar', sheet);
  const sheetCard = $('#sheetCard');
  const sheetBody = $('#sheetBody');
  const sheetTitle = $('#sheetTitle');
  const passes = $$('.pass', stack);
  const baseTitle = document.title;

  /* ---------- HUD toast ---------- */
  const hud = $('#hud');
  let hudT;
  const toast = (msg) => {
    $('span', hud).textContent = msg;
    hud.classList.add('show');
    clearTimeout(hudT);
    hudT = setTimeout(() => hud.classList.remove('show'), 1500);
  };

  /* ---------- theme ---------- */
  const themeBtn = $('#themeBtn');
  const metaTheme = $('meta[name="theme-color"]');
  const syncTheme = () => {
    const dark = root.dataset.theme === 'dark';
    metaTheme.content = dark ? '#000000' : '#f2f2f7';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light appearance' : 'Switch to dark appearance');
  };
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    store('theme', root.dataset.theme);
    syncTheme();
  });
  syncTheme();

  /* ---------- ••• menu ---------- */
  const moreBtn = $('#moreBtn');
  const menu = $('#menu');
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    moreBtn.setAttribute('aria-expanded', String(open));
  };
  moreBtn.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!menu.classList.contains('open')); });
  addEventListener('click', (e) => { if (!menu.contains(e.target)) setMenu(false); });

  /* ---------- promo banner ---------- */
  $('#promoX').addEventListener('click', () => {
    const promo = $('#promo');
    const done = () => { root.classList.add('no-promo'); store('promo', '0'); };
    if (!motion()) return done();
    const h = promo.offsetHeight + 26;
    promo.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.94)' }], { duration: 220, easing: 'ease' })
      .finished.then(() => {
        done();
        stack.animate([{ transform: `translateY(${h}px)` }, { transform: 'none' }], { duration: 480, easing: EASE });
      });
  });

  /* ---------- degree progress bars (Sep 2024 → Jul 2028) ---------- */
  const bars = $$('#degreeBars i');
  if (bars.length) {
    const start = Date.UTC(2024, 8, 1), end = Date.UTC(2028, 6, 1);
    const p = Math.min(1, Math.max(0, (Date.now() - start) / (end - start)));
    bars.forEach((b, i) => b.classList.toggle('on', i < Math.round(p * bars.length)));
  }

  /* ============================================================
     Card open / close — FLIP from the stack into the sheet
     ============================================================ */
  let current = null;   // open .pass
  let busy = false;

  const isPass = (el) => el && el.classList && el.classList.contains('pass');
  const delta = (a, b) => `translate(${a.left - b.left}px, ${a.top - b.top}px)`;

  // mode: 'push' (new history entry), 'replace' (swap card in place), false (history already moved)
  function open(pass, { mode = 'push', instant = false } = {}) {
    if (busy || current === pass) return Promise.resolve();
    if (current) return close().then(() => open(pass, { mode, instant }));
    busy = true;
    current = pass;
    setMenu(false);

    const card = $('.card', pass);
    const detail = $('.detail', pass);
    const from = card.getBoundingClientRect();

    // build the sheet: a static copy of the card face + the real detail node
    const face = document.createElement('div');
    face.className = card.className;
    face.innerHTML = card.innerHTML;
    face.setAttribute('aria-hidden', 'true');
    sheetCard.replaceChildren(face);
    detail.hidden = false;
    sheetBody.replaceChildren(detail);
    sheetTitle.textContent = pass.dataset.title;
    sheet.classList.remove('scrolled');
    sheet.hidden = false;
    sheet.scrollTop = 0;
    root.classList.add('locked');
    page.inert = true;
    card.style.visibility = 'hidden';
    document.title = `${pass.dataset.title} — Emir Uçgun`;

    if (mode === 'push') history.pushState({ card: pass.id, pushed: true }, '', `#${pass.id}`);
    else if (mode === 'replace') history.replaceState({ card: pass.id, pushed: !!(history.state && history.state.pushed) }, '', `#${pass.id}`);

    const finish = () => {
      stack.style.visibility = 'hidden';
      busy = false;
      if (!instant) $('#closeBtn').focus({ preventScroll: true });
    };
    if (instant || !motion()) { finish(); return Promise.resolve(); }

    const to = face.getBoundingClientRect();
    const vh = innerHeight;
    const anims = [];

    // the chosen card flies to the top
    anims.push(face.animate([{ transform: delta(from, to) }, { transform: 'none' }], { duration: 560, easing: EASE }));

    // everyone else drops to the bottom of the screen
    let k = 0;
    passes.forEach((p) => {
      if (p === pass) return;
      const r = p.getBoundingClientRect();
      if (r.bottom < -40 || r.top > vh + 40) return;
      anims.push(p.animate(
        [{ transform: 'none', opacity: 1 }, { transform: `translateY(${vh - r.top + 30}px)`, opacity: 1 }],
        { duration: 500, easing: EASE, delay: 10 * k++, fill: 'forwards' }
      ));
    });
    const promo = $('#promo'), top = $('.top');
    [promo, top].forEach((el) => el && anims.push(el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' })));

    sheetBg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 160, easing: 'ease', fill: 'backwards' });
    sheetBar.animate([{ opacity: 0, transform: 'scale(.8)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: 200, easing: EASE, fill: 'backwards' });
    sheetBody.animate([{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: 140, easing: EASE, fill: 'backwards' });

    return anims[0].finished.then(() => {
      finish();
      anims.forEach((a) => a.cancel());
    });
  }

  function close({ instant = false } = {}) {
    if (!current || busy) return Promise.resolve();
    busy = true;
    const pass = current;
    const card = $('.card', pass);
    const detail = sheetBody.firstElementChild;   // it lives in the sheet while open
    const face = sheetCard.firstElementChild;

    const finish = () => {
      sheet.hidden = true;
      [face, sheetBg, sheetBar, sheetBody].forEach((el) => el && el.getAnimations().forEach((a) => a.cancel()));
      detail.hidden = true;
      pass.appendChild(detail);
      sheetCard.replaceChildren();
      card.style.visibility = '';
      root.classList.remove('locked');
      page.inert = false;
      document.title = baseTitle;
      current = null;
      busy = false;
    };

    stack.style.visibility = '';
    if (instant || !motion()) { finish(); card.focus({ preventScroll: true }); return Promise.resolve(); }

    const to = card.getBoundingClientRect();
    const from = face.getBoundingClientRect();
    const vh = innerHeight;
    const anims = [];

    anims.push(face.animate([{ transform: 'none' }, { transform: delta(to, from) }], { duration: 500, easing: EASE, fill: 'forwards' }));
    let k = 0;
    passes.forEach((p) => {
      if (p === pass) return;
      const r = p.getBoundingClientRect();
      if (r.bottom < -40 || r.top > vh + 40) return;
      anims.push(p.animate(
        [{ transform: `translateY(${vh - r.top + 30}px)` }, { transform: 'none' }],
        { duration: 520, easing: EASE, delay: 12 * k++, fill: 'backwards' }
      ));
    });
    [$('#promo'), $('.top')].forEach((el) => el && el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 120, fill: 'backwards' }));
    sheetBg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'ease', fill: 'forwards' });
    sheetBody.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(30px)' }], { duration: 200, easing: 'ease', fill: 'forwards' });
    sheetBar.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: 'forwards' });

    return anims[0].finished.then(() => {
      finish();
      card.focus({ preventScroll: true });
    });
  }

  // user-initiated close: unwind our history entry if we made one
  const dismiss = () => {
    if (!current) return;
    if (history.state && history.state.pushed) history.back();
    else { history.replaceState(null, '', location.pathname + location.search); close(); }
  };

  /* ---------- wiring ---------- */
  passes.forEach((p) => $('.card', p).addEventListener('click', () => open(p)));
  $('#closeBtn').addEventListener('click', dismiss);
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (menu.classList.contains('open')) { setMenu(false); moreBtn.focus(); return; }
    dismiss();
  });

  // in-page links to a card (#flo, #contact, …) open it instead of jumping
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (!isPass(target)) return;
    e.preventDefault();
    setMenu(false);
    if (target !== current) open(target, { mode: current ? 'replace' : 'push' });
  });

  // back / forward, and hash edits on an already-loaded page
  const syncToHash = () => {
    const target = document.getElementById(location.hash.slice(1));
    if (isPass(target)) open(target, { mode: false });
    else close();
  };
  addEventListener('popstate', syncToHash);
  addEventListener('hashchange', syncToHash);

  // compact title in the sheet bar once the card scrolls under it
  sheet.addEventListener('scroll', () => {
    sheet.classList.toggle('scrolled', sheet.scrollTop > sheetCard.offsetHeight * 0.7);
  }, { passive: true });

  /* ---------- share ---------- */
  $('#shareBtn').addEventListener('click', async () => {
    const url = location.href;
    const title = document.title;
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
      return;
    }
    await copy(url);
    toast('Link Copied');
  });

  /* ---------- copy ---------- */
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const t = document.createElement('textarea');
      t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove();
    }
  }
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    await copy(btn.dataset.copy);
    const label = $('span', btn);
    btn.classList.add('done');
    if (label) label.textContent = 'Copied';
    toast('Email Copied');
    setTimeout(() => { btn.classList.remove('done'); if (label) label.textContent = 'Copy'; }, 1600);
  });

  /* ---------- deep link on load (/#ghosted) ---------- */
  const initial = document.getElementById(location.hash.slice(1));
  if (isPass(initial)) {
    history.replaceState({ card: initial.id, pushed: false }, '', `#${initial.id}`);
    open(initial, { mode: false, instant: true });
  }
})();
