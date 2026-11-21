/* Posts gallery in the "Esempi" section: business tabs + an accessible lightbox. No dependencies.
   The lightbox is a native <dialog> opened with showModal(): the rest of the page becomes inert
   (focus stays inside) and Esc closes it. Arrows/swipe move through the open business's 4 images. */
(() => {
  const root = document.querySelector('[data-posts-gallery]');
  if (!root) return;
  const article = root.closest('article');
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panel = (t) => document.getElementById(t.getAttribute('aria-controls'));

  /* ---------- tabs (roving tabindex, arrow/Home/End keys) ---------- */
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panel(t).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      const n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (n === undefined) return;
      e.preventDefault();
      select(tabs[(n + tabs.length) % tabs.length], true);
    });
  });

  /* ---------- lightbox ---------- */
  const dlg = article.querySelector('.pg-lb');
  if (!dlg || typeof dlg.showModal !== 'function') return; // very old browsers: images stay viewable inline
  const img = dlg.querySelector('img');
  const src = dlg.querySelector('source');
  const cap = dlg.querySelector('figcaption');
  let items = [], idx = 0, opener = null;

  const show = (i) => {
    idx = (i + items.length) % items.length;
    const b = items[idx];
    const alt = b.querySelector('img').alt;
    src.srcset = b.dataset.full + '.avif';
    img.src = b.dataset.full + '.webp';
    img.alt = alt;
    cap.textContent = `${alt} (${idx + 1}/${items.length})`;
  };

  article.addEventListener('click', (e) => {
    const b = e.target.closest('.pg-open');
    if (!b) return;
    items = [...b.closest('.pg-panel').querySelectorAll('.pg-open')];
    opener = b;
    show(items.indexOf(b));
    dlg.showModal();
    dlg.querySelector('.pg-close').focus();
  });

  dlg.querySelector('.pg-prev').addEventListener('click', () => show(idx - 1));
  dlg.querySelector('.pg-next').addEventListener('click', () => show(idx + 1));
  dlg.querySelector('.pg-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('close', () => { opener?.focus(); img.removeAttribute('src'); src.removeAttribute('srcset'); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
    else if (e.key === 'Tab') { // focus trap: cycle through the dialog's buttons only
      const f = [...dlg.querySelectorAll('button')];
      const i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
  // backdrop click: anything that is not the image or a control
  dlg.addEventListener('click', (e) => { if (!e.target.closest('img, button')) dlg.close(); });

  // swipe
  let x0 = null, y0 = 0;
  dlg.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  dlg.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(idx + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
