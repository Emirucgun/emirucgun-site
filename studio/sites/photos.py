#!/usr/bin/env python3
"""Photo slots for the restaurant sites. Called by build.mjs with a JSON manifest; you don't run it by hand.

For every slot (hero, story, dish photos) listed in a site's data file:
  1. if the .jpg doesn't exist yet, draws a quiet placeholder of the right size, labelled with the
     file name, so the page never shows a broken image. Replace it with the real photo, same name.
  2. writes WebP copies 480 and 960 px wide next to it (name-480.webp, name-960.webp), again only
     when the .jpg is newer than them. The pages serve these to phones; the .jpg is the fallback.
Needs Pillow (pip install pillow)."""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

REPO = Path(__file__).resolve().parents[2]
WIDTHS = (480, 960)


def font(size):
    for name in ('DejaVuSans.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 'Arial.ttf'):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def hex_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def placeholder(path, w, h, bg, fg, label):
    img = Image.new('RGB', (w, h), hex_rgb(bg))
    d = ImageDraw.Draw(img)
    line = tuple(int(a * 0.9 + b * 0.1) for a, b in zip(hex_rgb(bg), hex_rgb(fg)))
    m = min(w, h) // 24
    d.rectangle([m, m, w - m, h - m], outline=line, width=3)  # a quiet frame: flat colour keeps the file small
    cx, cy = w // 2, h // 2
    r = min(w, h) // 7
    d.ellipse([cx - r, cy - r - 30, cx + r, cy + r - 30], outline=hex_rgb(fg), width=4)  # a plate
    d.ellipse([cx - r // 2, cy - r // 2 - 30, cx + r // 2, cy + r // 2 - 30], outline=hex_rgb(fg), width=2)
    f1, f2 = font(max(22, w // 30)), font(max(16, w // 46))
    for text, f, y in (('FOTO IN ARRIVO', f1, cy + r + 10), (label, f2, cy + r + 10 + max(22, w // 30) + 14)):
        tw = d.textlength(text, font=f)
        d.text((cx - tw / 2, y), text, font=f, fill=hex_rgb(fg))
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, 'JPEG', quality=80, optimize=True, progressive=True)
    print('  placeholder', path.relative_to(REPO))


def webps(path):
    src_time = path.stat().st_mtime
    img = None
    for w in WIDTHS:
        out = path.with_name(f'{path.stem}-{w}.webp')
        if out.exists() and out.stat().st_mtime >= src_time:
            continue
        if img is None:
            img = ImageOps.exif_transpose(Image.open(path)).convert('RGB')
        copy = img.copy()
        if copy.width > w:
            copy = copy.resize((w, round(copy.height * w / copy.width)), Image.LANCZOS)
        copy.save(out, 'WEBP', quality=78, method=6)
        print('  webp', out.relative_to(REPO))


def main():
    slots = json.loads(Path(sys.argv[1]).read_text())
    for s in slots:
        path = REPO / s['src'].lstrip('/')
        if not path.exists():
            placeholder(path, s['width'], s['height'], s['bg'], s['fg'], path.name)
        webps(path)


if __name__ == '__main__':
    main()
