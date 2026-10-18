/* Emir Uçgun — site interactions
   No dependencies. Everything degrades gracefully. */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- theme ---------- */
  const themeBtn = document.getElementById('themeBtn');
  const setTheme = (t) => {
    root.dataset.theme = t;
    try { localStorage.setItem('theme', t); } catch {}
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', t === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
      themeBtn.title = t === 'light' ? 'Dark mode' : 'Light mode';
    }
  };
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      setTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
    });
  }
  // keyboard: "t" toggles theme (ignored while typing)
  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
    if (e.key === 't') setTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
  });

  /* ---------- mobile menu ---------- */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  if (burger && menu) {
    const toggle = (open) => {
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle(!menu.classList.contains('open')));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) toggle(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });
  }

  /* ---------- scroll progress ---------- */
  const bar = document.getElementById('progress');
  if (bar) {
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = max > 0 ? `${(scrollY / max) * 100}%` : '0%';
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  }

  /* ---------- pointer spotlight ---------- */
  if (!reduced && matchMedia('(pointer: fine)').matches) {
    document.body.classList.add('has-pointer');
    const spot = document.querySelector('.spot');
    let raf = null;
    addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        root.style.setProperty('--mx', `${e.clientX}px`);
        root.style.setProperty('--my', `${e.clientY}px`);
        raf = null;
      });
    }, { passive: true });
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px' });
  document.querySelectorAll('.rv').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 55}ms`;
    io.observe(el);
  });

  /* ---------- hero parallax ---------- */
  const title = document.querySelector('.hero-title');
  if (title && !reduced && matchMedia('(pointer: fine)').matches) {
    addEventListener('pointermove', (e) => {
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      title.style.transform = `translate3d(${x * -7}px, ${y * -5}px, 0)`;
    }, { passive: true });
  }

  /* ---------- magnetic links ---------- */
  if (!reduced && matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-mag]').forEach((el) => {
      const strength = 0.22;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * strength;
        const dy = (e.clientY - (r.top + r.height / 2)) * strength;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- copy email ---------- */
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const t = document.createElement('textarea');
        t.value = text; document.body.appendChild(t); t.select();
        document.execCommand('copy'); t.remove();
      }
      const old = btn.textContent;
      btn.textContent = 'Copied ✓';
      btn.classList.add('done');
      setTimeout(() => { btn.textContent = old; btn.classList.remove('done'); }, 1600);
    });
  });
})();
