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
  const sheetInner = $('#sheetInner');
  const sheetCard = $('#sheetCard');
  const sheetBody = $('#sheetBody');
  const sheetNav = $('#sheetNav');
  const sheetTitle = $('#sheetTitle');
  const closeBtn = $('#closeBtn');
  const qr = $('#qr');
  const passes = $$('.pass', stack);
  const baseTitle = document.title;

  // a miniature of a card, in that card's colour (--k on its <article>)
  const mini = (pass) => `<i class="mini" style="--k:${pass.style.getPropertyValue('--k')}"></i>`;

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
  // the Projects section lists every card marked data-kind="project"
  $('#menuProjects').innerHTML = passes
    .filter((p) => p.dataset.kind === 'project')
    .map((p) => `<a href="#${p.id}"><span class="pi">${mini(p)}</span>${p.dataset.title}<small>${p.dataset.tag || ''}</small></a>`)
    .join('');
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    moreBtn.setAttribute('aria-expanded', String(open));
    if (open) menu.scrollTop = 0;
  };
  moreBtn.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!menu.classList.contains('open')); });
  addEventListener('click', (e) => { if (!menu.contains(e.target)) setMenu(false); });

  /* ---------- intro tile ---------- */
  $('#promoX').addEventListener('click', () => {
    const promo = $('#promo');
    const done = () => { root.classList.add('no-promo'); store('intro', '0'); };
    if (!motion()) return done();
    const h = promo.offsetHeight + 24;
    promo.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.94)' }], { duration: 180, easing: 'ease' })
      .finished.then(() => {
        done();
        stack.animate([{ transform: `translateY(${h}px)` }, { transform: 'none' }], { duration: 420, easing: EASE });
      });
  });

  /* ---------- degree progress bars (Sep 2024 → Jul 2028) ---------- */
  const bars = $$('#degreeBars i');
  if (bars.length) {
    const start = Date.UTC(2024, 8, 1), end = Date.UTC(2028, 6, 1);
    const p = Math.min(1, Math.max(0, (Date.now() - start) / (end - start)));
    bars.forEach((b, i) => b.classList.toggle('on', i < Math.round(p * bars.length)));
  }

  /* ---------- QR pass ---------- */
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-qr]')) return;
    setMenu(false);
    if (!qr.open) qr.showModal();
  });
  qr.addEventListener('click', (e) => { if (e.target === qr) qr.close(); });   // tap outside the pass

  /* ============================================================
     Card open / close — FLIP from the stack into the sheet
     ============================================================ */
  let current = null;   // open .pass
  let busy = false;     // an open/close animation is running
  let queued = null;    // the latest request made while busy; runs when the animation ends

  const isPass = (el) => el && el.classList && el.classList.contains('pass');
  const delta = (a, b) => `translate(${a.left - b.left}px, ${a.top - b.top}px)`;
  const settle = () => { busy = false; const q = queued; queued = null; if (q) q(); };

  // mode: 'push' (new history entry), 'replace' (swap card in place), false (history already moved)
  const setHistory = (pass, mode) => {
    if (mode === 'push') history.pushState({ card: pass.id, pushed: true }, '', `#${pass.id}`);
    else if (mode === 'replace') history.replaceState({ card: pass.id, pushed: !!(history.state && history.state.pushed) }, '', `#${pass.id}`);
  };

  // previous / next tiles under the detail, so the whole stack can be read without going back
  const navTile = (pass, label) => pass
    ? `<a class="tile nav" href="#${pass.id}"><span class="nav-top">${mini(pass)}${label}</span><span class="nav-name">${pass.dataset.title}</span></a>`
    : '<span></span>';

  // put a card into the sheet: a static copy of its face + its real detail node
  function mount(pass) {
    const card = $('.card', pass);
    const detail = $('.detail', pass);
    const face = document.createElement('div');
    face.className = card.className;
    face.innerHTML = card.innerHTML;
    face.setAttribute('aria-hidden', 'true');
    sheetCard.replaceChildren(face);
    detail.hidden = false;
    sheetBody.replaceChildren(detail);
    const i = passes.indexOf(pass);
    sheetNav.innerHTML = navTile(passes[i - 1], 'Previous') + navTile(passes[i + 1], 'Next');
    sheetTitle.textContent = pass.dataset.title;
    sheet.classList.remove('scrolled');
    card.style.visibility = 'hidden';
    document.title = `${pass.dataset.title} — Emir Uçgun`;
    current = pass;
    return face;
  }

  // and take it back out: the detail node returns to its card
  function unmount() {
    const detail = sheetBody.firstElementChild;
    if (detail) { detail.hidden = true; current.appendChild(detail); }
    sheetCard.replaceChildren();
    sheetNav.replaceChildren();
    $('.card', current).style.visibility = '';
    current = null;
  }

  function open(pass, { mode = 'push', instant = false } = {}) {
    if (busy) { queued = () => open(pass, { mode, instant }); return; }
    if (current === pass) return;
    setMenu(false);
    if (current) return swap(pass, mode);
    busy = true;

    const from = $('.card', pass).getBoundingClientRect();
    const face = mount(pass);
    sheet.hidden = false;
    sheet.scrollTop = 0;
    root.classList.add('locked');
    page.inert = true;
    setHistory(pass, mode);

    const finish = () => {
      stack.style.visibility = 'hidden';
      if (!instant) closeBtn.focus({ preventScroll: true });
    };
    if (instant || !motion()) { finish(); settle(); return; }

    const to = face.getBoundingClientRect();
    const vh = innerHeight;
    const anims = [];

    // the chosen card flies to the top
    anims.push(face.animate([{ transform: delta(from, to) }, { transform: 'none' }], { duration: 440, easing: EASE }));

    // everyone else drops to the bottom of the screen
    let k = 0;
    passes.forEach((p) => {
      if (p === pass) return;
      const r = p.getBoundingClientRect();
      if (r.bottom < -40 || r.top > vh + 40) return;
      anims.push(p.animate(
        [{ transform: 'none', opacity: 1 }, { transform: `translateY(${vh - r.top + 30}px)`, opacity: 1 }],
        { duration: 400, easing: EASE, delay: 8 * k++, fill: 'forwards' }
      ));
    });
    [$('#promo'), $('.top')].forEach((el) => anims.push(el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' })));

    sheetBg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, delay: 120, easing: 'ease', fill: 'backwards' });
    sheetBar.animate([{ opacity: 0, transform: 'scale(.8)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: 150, easing: EASE, fill: 'backwards' });
    [sheetBody, sheetNav].forEach((el) => el.animate([{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 100, easing: EASE, fill: 'backwards' }));

    anims[0].finished.then(() => {
      finish();
      anims.forEach((a) => a.cancel());
      settle();
    });
  }

  // a card is already open: trade its contents for another's, sliding in from the side it sits on
  function swap(pass, mode) {
    const dir = passes.indexOf(pass) > passes.indexOf(current) ? 1 : -1;
    unmount();
    mount(pass);
    sheet.scrollTop = 0;
    setHistory(pass, mode);
    closeBtn.focus({ preventScroll: true });
    if (motion()) sheetInner.animate([{ opacity: 0, transform: `translateX(${dir * 32}px)` }, { opacity: 1, transform: 'none' }], { duration: 280, easing: EASE });
  }

  function close({ instant = false } = {}) {
    if (busy) { queued = () => close({ instant }); return; }
    if (!current) return;
    busy = true;
    const card = $('.card', current);
    const face = sheetCard.firstElementChild;

    const finish = () => {
      sheet.hidden = true;
      [face, sheetBg, sheetBar, sheetBody, sheetNav, sheetInner].forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
      unmount();
      root.classList.remove('locked');
      page.inert = false;
      document.title = baseTitle;
      card.focus({ preventScroll: true });
      settle();
    };

    stack.style.visibility = '';
    if (instant || !motion()) return finish();

    const to = card.getBoundingClientRect();
    const from = face.getBoundingClientRect();
    const vh = innerHeight;

    const lead = face.animate([{ transform: 'none' }, { transform: delta(to, from) }], { duration: 380, easing: EASE, fill: 'forwards' });
    let k = 0;
    passes.forEach((p) => {
      if (p === current) return;
      const r = p.getBoundingClientRect();
      if (r.bottom < -40 || r.top > vh + 40) return;
      p.animate(
        [{ transform: `translateY(${vh - r.top + 30}px)` }, { transform: 'none' }],
        { duration: 400, easing: EASE, delay: 8 * k++, fill: 'backwards' }
      );
    });
    [$('#promo'), $('.top')].forEach((el) => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, delay: 100, fill: 'backwards' }));
    sheetBg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: 'ease', fill: 'forwards' });
    [sheetBody, sheetNav].forEach((el) => el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(30px)' }], { duration: 160, easing: 'ease', fill: 'forwards' }));
    sheetBar.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' });

    lead.finished.then(finish);
  }

  // user-initiated close: unwind our history entry if we made one
  const dismiss = () => {
    if (!current) return;
    if (history.state && history.state.pushed) history.back();
    else { history.replaceState(null, '', location.pathname + location.search); close(); }
  };

  /* ---------- wiring ---------- */
  passes.forEach((p) => $('.card', p).addEventListener('click', () => open(p)));
  closeBtn.addEventListener('click', dismiss);
  addEventListener('keydown', (e) => {
    if (qr.open) return;   // the dialog handles its own Escape
    if (e.key === 'Escape') {
      if (menu.classList.contains('open')) { setMenu(false); moreBtn.focus(); return; }
      dismiss();
    } else if (current && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !e.altKey && !e.metaKey && !e.ctrlKey) {
      // ← → step through the stack while a card is open
      const next = passes[passes.indexOf(current) + (e.key === 'ArrowRight' ? 1 : -1)];
      if (next) open(next, { mode: 'replace' });
    }
  });

  // in-page links to a card (#flo, #contact, …) open it instead of jumping
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (!isPass(target)) return;
    e.preventDefault();
    setMenu(false);
    open(target, { mode: current ? 'replace' : 'push' });
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
