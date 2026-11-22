/* Restaurant website template: the only script, ~3 KB, no dependencies. Everything on the page
   works without it; this adds:
   - "open now / closes at …" from the opening hours, in the restaurant's time zone, and today highlighted
   - the click-to-load Google map (nothing is requested from Google until the visitor asks)
   - on demos, a short note instead of calling a fictional number
   - on the menu page, the current category highlighted in the sticky bar */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- sticky header height, so the menu's category bar sits right under it ---------- */
  const hdr = $('.hdr');
  if (hdr) {
    const set = () => document.documentElement.style.setProperty('--hdr-h', `${Math.round(hdr.getBoundingClientRect().height)}px`);
    set();
    if ('ResizeObserver' in window) new ResizeObserver(set).observe(hdr);
  }

  /* ---------- opening hours ---------- */
  const box = $('[data-hours]');
  if (box) {
    let cfg;
    try { cfg = JSON.parse(box.dataset.hours); } catch { cfg = null; }
    const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const now = () => {
      const p = {};
      new Intl.DateTimeFormat('en-GB', { timeZone: cfg.tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
        .formatToParts(new Date()).forEach((x) => { p[x.type] = x.value; });
      return { day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(p.weekday), min: (+p.hour % 24) * 60 + +p.minute };
    };
    const ranges = (d) => cfg.hours[DAYS[(d + 7) % 7]] || [];
    const status = () => {
      const { day, min } = now();
      for (const [a, b] of ranges(day)) {
        const s = toMin(a), e = toMin(b) <= s ? toMin(b) + 1440 : toMin(b);
        if (min >= s && min < e) return { state: e - min <= 30 ? 'soon' : 'open', t: b, day };
      }
      for (const [a, b] of ranges(day - 1)) if (toMin(b) <= toMin(a) && min < toMin(b)) return { state: toMin(b) - min <= 30 ? 'soon' : 'open', t: b, day };
      for (let i = 0; i < 8; i++) {
        const next = ranges(day + i).map((r) => r[0]).filter((a) => i > 0 || toMin(a) > min).sort((x, y) => toMin(x) - toMin(y))[0];
        if (next) return { state: i === 0 ? 'closed' : i === 1 ? 'tomorrow' : 'later', t: next, d: cfg.days[(day + i) % 7], day };
      }
      return { state: 'none', day };
    };
    const paint = () => {
      if (!cfg) return;
      let s;
      try { s = status(); } catch { return; }
      const text = (cfg.s[s.state] || '').replace('{t}', s.t || '').replace('{d}', s.d || '');
      $$('[data-day]', box).forEach((row) => row.classList.toggle('today', +row.dataset.day === s.day));
      const el = $('.status', box);
      el.dataset.state = s.state === 'open' || s.state === 'soon' ? s.state : 'closed';
      $('.status-text', el).textContent = text;
      el.hidden = false;
      const mini = $('[data-status-mini]');
      if (mini) { mini.textContent = text; mini.dataset.state = el.dataset.state; mini.hidden = false; }
    };
    paint();
    setInterval(paint, 60000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) paint(); });
  }

  /* ---------- click-to-load map ---------- */
  $$('[data-map]').forEach((map) => {
    const btn = $('[data-map-load]', map);
    if (!btn) return;
    btn.hidden = false;
    const note = $('[data-map-note]', map);
    if (note) note.hidden = false;
    btn.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = map.dataset.map;
      f.title = map.dataset.mapTitle || 'Map';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.allowFullscreen = true;
      map.classList.add('loaded');
      map.prepend(f);
      btn.remove();
      if (note) note.remove();
      f.focus();
    });
  });

  /* ---------- demo buttons: say what would happen ---------- */
  const toast = $('.toast');
  let timer = 0;
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-demo-note]');
    if (!b || !toast) return;
    toast.textContent = b.dataset.demoNote;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 3600);
  });

  /* ---------- menu: highlight the category in view ---------- */
  const links = $$('.cats a[href^="#"]');
  if (links.length && 'IntersectionObserver' in window) {
    const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const visible = new Set();
    const bar = $('.cats ul');
    const set = () => {
      const id = [...byId.keys()].find((k) => visible.has(k));
      links.forEach((a) => a.removeAttribute('aria-current'));
      const a = id && byId.get(id);
      if (!a) return;
      a.setAttribute('aria-current', 'true');
      const r = a.getBoundingClientRect(), b = bar.getBoundingClientRect();
      if (r.left < b.left || r.right > b.right) bar.scrollTo({ left: bar.scrollLeft + r.left - b.left - 16, behavior: 'smooth' });
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? visible.add(en.target.id) : visible.delete(en.target.id)));
      set();
    }, { rootMargin: '-120px 0px -55% 0px' });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }
})();
