#!/usr/bin/env python3
"""Writes the shared parts (head, header, CTA band, footer, sticky bar) of the studio subpages.

The site has no build step: the HTML files in studio/ are what Vercel serves. This script is only a
convenience to keep the three subpages' shared chrome identical. Page bodies live in studio/tools/pages/*.inc.
Run it after editing a body or the shared parts below:   python3 studio/tools/build-pages.py
(index.html and demo/menu are written by hand and are not touched.)"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WA = 'https://wa.me/393445034591'  # no-JS fallback only; the real link is built from config.js

SPRITE = '''<svg class="sprite" aria-hidden="true">
  <defs>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="M4.5 12.5l5 5L19.5 7"/></symbol>
    <symbol id="i-x" viewBox="0 0 24 24"><path d="M7 12h10"/></symbol>
    <symbol id="i-wa" viewBox="0 0 24 24"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12z"/><path d="M9.2 8.6c.3-.3.8-.3 1 .1l.7 1.3c.1.3.1.6-.1.8l-.4.4c.4.9 1.2 1.7 2.1 2.1l.4-.4c.2-.2.5-.3.8-.1l1.3.7c.4.2.4.7.1 1l-.6.6c-.5.5-1.3.6-1.9.3a7 7 0 0 1-3.6-3.6c-.3-.6-.2-1.4.3-1.9z"/></symbol>
    <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
    <symbol id="i-image" viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M20.5 16l-5-5-8.5 8.5"/></symbol>
    <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.6"/></symbol>
    <symbol id="i-qr" viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 14h2M14 18v2h2M18 18h2v2"/></symbol>
    <symbol id="i-eye" viewBox="0 0 24 24"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></symbol>
    <symbol id="i-key" viewBox="0 0 24 24"><rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v2.5"/></symbol>
    <symbol id="i-receipt" viewBox="0 0 24 24"><path d="M6 3.5h12v17l-2.4-1.5-2.4 1.5-2.4-1.5-2.4 1.5L6 20.5z"/><path d="M9 8.5h6M9 12h6M9 15.5h3.5"/></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></symbol>
    <symbol id="i-gift" viewBox="0 0 24 24"><path d="M4 11h16v9H4zM3 7.5h18V11H3zM12 7.5V20"/><path d="M12 7.5S10.8 3.5 8.5 3.5a2 2 0 0 0 0 4M12 7.5s1.2-4 3.5-4a2 2 0 0 1 0 4"/></symbol>
    <symbol id="i-upload" viewBox="0 0 24 24"><path d="M12 15.5V4.5M7.5 9L12 4.5 16.5 9M4.5 15v3.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V15"/></symbol>
    <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></symbol>
    <symbol id="i-angle" viewBox="0 0 24 24"><path d="M4 20h16M4 20L16 6"/><path d="M10 20a6 6 0 0 0-1.8-4.3"/></symbol>
    <symbol id="i-sparkle" viewBox="0 0 24 24"><path d="M12 3.5l1.9 5.6 5.6 1.9-5.6 1.9L12 18.5l-1.9-5.6-5.6-1.9 5.6-1.9z"/></symbol>
    <symbol id="i-frame" viewBox="0 0 24 24"><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/><circle cx="12" cy="12" r="3.5"/></symbol>
    <symbol id="i-steam" viewBox="0 0 24 24"><path d="M4 15h16a8 8 0 0 1-16 0zM8 4c-.7 1 .7 2 0 3.5M12 3c-.7 1 .7 2 0 3.5M16 4c-.7 1 .7 2 0 3.5"/></symbol>
    <symbol id="i-copy" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/></symbol>
    <symbol id="i-chat" viewBox="0 0 24 24"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12z"/></symbol>
    <symbol id="i-in" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5v6M8 7.5v.01M11.5 16.5v-6M11.5 13c0-1.5 1-2.5 2.4-2.5s2.1 1 2.1 2.5v3.5"/></symbol>
    <symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.3 2.4 3.4 5.2 3.4 8.5s-1.1 6.1-3.4 8.5c-2.3-2.4-3.4-5.2-3.4-8.5S9.7 5.9 12 3.5z"/></symbol>
    <symbol id="i-phone" viewBox="0 0 24 24"><path d="M5 4h3.5l1.7 4.2-2.2 1.4a11 11 0 0 0 6.4 6.4l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z"/></symbol>
    <symbol id="i-route" viewBox="0 0 24 24"><path d="M12 3.5l8.5 8.5-8.5 8.5L3.5 12z"/><path d="M9.5 13.5V11h5M12.5 9l2 2-2 2"/></symbol>
    <symbol id="i-book" viewBox="0 0 24 24"><path d="M4 5.5A2 2 0 0 1 6 3.5h13v14H6a2 2 0 0 0-2 2zM4 19.5a2 2 0 0 0 2 2h13v-4"/></symbol>
    <symbol id="i-store" viewBox="0 0 24 24"><path d="M4 9.5V20h16V9.5M3 9.5l1.6-5h14.8l1.6 5zM3 9.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M10 20v-5h4v5"/></symbol>
  </defs>
</svg>'''


def head(p):
    return f'''<!doctype html>
<html lang="it" data-title-en="{p['title_en']}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>(function(){{var d=document.documentElement,l;d.classList.add('js');try{{l=new URLSearchParams(location.search).get('lang')||localStorage.getItem('lang')}}catch(e){{}}if(l==='en')d.lang='en'}})();</script>
<!-- config.js loads first (it is tiny): prices and settings, ready before the page is drawn. -->
<script src="/studio/config.js"></script>
<title>{p['title']}</title>
<meta name="description" content="{p['desc']}">
<link rel="canonical" href="https://studio.emirucgun.com/{p['slug']}">
<meta name="theme-color" content="#F4F1EC">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Emir Uçgun · Studio">
<meta property="og:locale" content="it_IT">
<meta property="og:locale:alternate" content="en_GB">
<meta property="og:title" content="{p['og_title']}">
<meta property="og:description" content="{p['og_desc']}">
<meta property="og:url" content="https://studio.emirucgun.com/{p['slug']}">
<meta property="og:image" content="https://studio.emirucgun.com/studio/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Emir Uçgun: più clienti per i ristoranti di Torino, su Google, al tavolo e sui delivery">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/studio/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/studio/apple-touch-icon.png">
{p.get('preload', '')}<link rel="preload" href="/studio/fonts/SpaceGrotesk-var-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/studio/fonts/Inter-var-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/studio/studio.css">
<script src="/studio/site.js" defer></script>
{p.get('scripts', '')}</head>
<body>
'''


def chrome_top(current):
    def nav(href, it, en, key):
        cur = ' aria-current="page"' if key == current else ''
        return f'<a href="{href}"{cur}><span lang="it">{it}</span><span lang="en">{en}</span></a>'
    return f'''{SPRITE}

<a class="skip" href="#main"><span lang="it">Vai al contenuto</span><span lang="en">Skip to content</span></a>

<header class="top">
  <div class="wrap">
    <a class="brand" href="/studio" aria-label="Emir Uçgun Studio, home"><b>Emir Uçgun</b><span>Studio</span></a>
    <nav id="nav" class="nav" aria-label="Menu principale" data-en-aria-label="Main menu">
      {nav('/studio/esempi', 'Esempi', 'Examples', 'esempi')}
      {nav('/studio/prezzi', 'Prezzi', 'Prices', 'prezzi')}
      {nav('/studio/come-funziona', 'Come funziona', 'How it works', 'come-funziona')}
      <a class="btn btn-primary" href="{WA}" data-wa><svg class="ico" aria-hidden="true"><use href="#i-wa"/></svg><span lang="it">Richiedi l'analisi gratuita</span><span lang="en">Get the free review</span></a>
    </nav>
    <div class="lang" role="group" aria-label="Lingua" data-en-aria-label="Language">
      <button type="button" data-set-lang="it" aria-pressed="true">IT</button>
      <button type="button" data-set-lang="en" aria-pressed="false">EN</button>
    </div>
    <a class="btn btn-primary btn-sm top-cta" href="{WA}" data-wa><svg class="ico" aria-hidden="true"><use href="#i-wa"/></svg><span lang="it">Analisi gratuita</span><span lang="en">Free review</span></a>
    <button type="button" class="burger" aria-expanded="false" aria-controls="nav"><span class="burger-i" aria-hidden="true"></span>Menu</button>
  </div>
</header>
'''


BAND = f'''
<section id="analisi" class="sec" aria-labelledby="cta-title" data-bar-hide>
  <div class="wrap">
    <div class="band">
      <div>
        <p class="eyebrow"><span lang="it">Analisi gratuita</span><span lang="en">Free review</span></p>
        <h2 id="cta-title"><span lang="it">Scopriamo cosa vi fa perdere clienti.</span><span lang="en">Let's find what's costing you customers.</span></h2>
        <p class="lead"><span lang="it">Il nome del locale basta: vi rispondo io su WhatsApp con 3 cose concrete da migliorare. Gratis, senza impegno.</span><span lang="en">Your restaurant's name is enough: I'll reply myself on WhatsApp with 3 concrete things to improve. Free, no obligation.</span></p>
      </div>
      <form class="form" data-wa-form action="{WA}" method="get" target="_blank">
        <label><span lang="it">Nome del locale</span><span lang="en">Restaurant name</span>
          <input name="locale" type="text" required autocomplete="organization" maxlength="80" placeholder="Es. Trattoria da Gino" data-en-placeholder="E.g. Trattoria da Gino"></label>
        <label><span><span lang="it">Link su Deliveroo, Glovo, Just Eat o Google</span><span lang="en">Link on Deliveroo, Glovo, Just Eat or Google</span> <small><span lang="it">(facoltativo)</span><span lang="en">(optional)</span></small></span>
          <input name="link" type="text" inputmode="url" autocomplete="url" maxlength="300" placeholder="https://…"></label>
        <button class="btn btn-primary" type="submit"><svg class="ico" aria-hidden="true"><use href="#i-wa"/></svg><span lang="it">Richiedi l'analisi su WhatsApp</span><span lang="en">Request the review on WhatsApp</span></button>
        <p class="alt"><span lang="it">Preferite l'email?</span><span lang="en">Prefer email?</span> <a href="mailto:emirucgun@gmail.com" data-mail><span lang="it">Scrivetemi qui</span><span lang="en">Write to me here</span></a></p>
      </form>
    </div>
  </div>
</section>
'''

BOTTOM = f'''
</main>

<footer>
  <div class="wrap">
    <div>
      <b>Emir Uçgun</b>
      <p><span lang="it">Studio per ristoranti · Torino</span><span lang="en">Studio for restaurants · Turin</span></p>
      <nav aria-label="Pagine" data-en-aria-label="Pages" class="mt-8">
        <a href="/studio"><span lang="it">Home</span><span lang="en">Home</span></a>
        <a href="/studio/esempi"><span lang="it">Esempi</span><span lang="en">Examples</span></a>
        <a href="/studio/prezzi"><span lang="it">Prezzi</span><span lang="en">Prices</span></a>
        <a href="/studio/come-funziona"><span lang="it">Come funziona</span><span lang="en">How it works</span></a>
      </nav>
    </div>
    <div>
      <p><strong>Privacy</strong></p>
      <p><span lang="it">Nessun cookie, nessun tracciamento: il sito ricorda solo la lingua scelta. Se mi scrivete, uso i vostri dati solo per rispondervi.</span><span lang="en">No cookies, no tracking: the site only remembers your language. If you write to me, I use your details only to reply.</span></p>
    </div>
    <div>
      <a class="link" href="https://www.emirucgun.com" data-main-site><span lang="it">Il mio profilo professionale</span><span lang="en">My professional profile</span></a>
    </div>
  </div>
</footer>

<div class="stickybar">
  <p class="sb-txt"><b><span lang="it">Analisi gratuita</span><span lang="en">Free review</span></b><span><span lang="it">Gratis, senza impegno</span><span lang="en">Free, no obligation</span></span></p>
  <a class="btn btn-primary" href="{WA}" data-wa><svg class="ico" aria-hidden="true"><use href="#i-wa"/></svg>WhatsApp</a>
</div>
</body>
</html>
'''

PAGES = [
    dict(slug='esempi', out='esempi/index.html', body='esempi.inc',
         title='Esempi: foto dei piatti prima e dopo, profilo Google, menù QR · Emir Uçgun',
         title_en='Examples: dish photos before and after, Google profile, QR menu · Emir Uçgun',
         desc='Foto dei piatti prima e dopo il ritocco, un profilo Google completato, un menù QR IT/EN funzionante e post social per ristoranti di Torino.',
         og_title='Prima e dopo: foto dei piatti, profilo Google e menù QR',
         og_desc='Trascinate per vedere la differenza. Foto reali ritoccate, profilo Google completo e un menù QR da provare.',
         scripts='<script src="/studio/posts-gallery.js" defer></script>\n'),
    dict(slug='prezzi', out='prezzi/index.html', body='prezzi.inc',
         title='Prezzi: sito con menù, foto dei piatti, profilo Google · Emir Uçgun',
         title_en='Prices: website with menu, dish photos, Google profile · Emir Uçgun',
         desc='Pacchetti a prezzo fisso per ristoranti di Torino: Prova con 10 foto, Foto dei piatti, Visibilità, Completo, Sito + Menù e Rinnovo totale, più la gestione mensile. Prima l\'anteprima, poi pagate.',
         og_title='Prezzi chiari per il vostro ristorante: sito, menù, foto e Google',
         og_desc='Sito con menù IT/EN al posto del PDF, foto dei piatti e profilo Google: pacchetti a prezzo fisso e confronto completo.'),
    dict(slug='come-funziona', out='come-funziona/index.html', body='come-funziona.inc',
         title='Come funziona: dall\'analisi gratuita alla consegna · Emir Uçgun',
         title_en='How it works: from the free review to delivery · Emir Uçgun',
         desc='Come lavoro con i ristoranti di Torino: analisi gratuita, anteprima prima di pagare, nessuna password, consegna in 2–⁠5 giorni. Più la guida per fotografare i piatti con il telefono.',
         og_title='Come funziona: semplice, veloce, senza rischi',
         og_desc='Quattro passi, nessuna password, prima l\'anteprima. E una guida per scattare foto dei piatti con il telefono.'),
]

# Feature flags from config.js: `<!-- if:flag -->…<!-- /if -->` in a page body is kept only when the flag is true.
import re
CONFIG = (ROOT / 'config.js').read_text()
FLAGS = {m[0]: m[1] == 'true' for m in re.findall(r'^\s*(\w+):\s*(true|false),', CONFIG, re.M)}


def flags(body):
    return re.sub(r'<!-- if:(\w+) -->(.*?)<!-- /if -->', lambda m: m.group(2) if FLAGS.get(m.group(1)) else '', body, flags=re.S)


for p in PAGES:
    body = flags((ROOT / 'tools' / 'pages' / p['body']).read_text())
    html = head(p) + chrome_top(p['slug']) + '\n<main id="main">\n' + body + BAND + BOTTOM
    out = ROOT / p['out']
    out.parent.mkdir(exist_ok=True)
    out.write_text(html)
    print('wrote', out.relative_to(ROOT.parent))
