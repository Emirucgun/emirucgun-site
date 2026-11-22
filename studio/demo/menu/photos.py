#!/usr/bin/env python3
"""Makes the web copies of the menu photos. Run it after adding or replacing a photo:

    python3 studio/demo/menu/photos.py            (or: python3 photos.py, from this folder)

For every .jpg in photos/ (only when the .jpg is newer than its copies):
  - dishes (square):  name-240.webp, name-480.webp, name-960.webp
  - cover*.jpg (wide): cover-800 / cover-1600 in .webp and .avif
The page never loads the .jpg itself: it's the master you keep. Needs Pillow 11+ (pip install pillow)."""
from pathlib import Path

from PIL import Image, ImageOps

HERE = Path(__file__).resolve().parent / 'photos'


def save(img, w, out):
    if out.exists() and out.stat().st_mtime >= src.stat().st_mtime:
        return
    r = img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)
    if out.suffix == '.avif':
        r.save(out, 'AVIF', quality=55)
    else:
        r.save(out, 'WEBP', quality=74, method=6)
    print('  ', out.name, f'{out.stat().st_size // 1024} KB')


for src in sorted(HERE.glob('*.jpg')):
    img = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    wide = src.stem.startswith('cover')
    if not wide and img.width != img.height:
        print(f'warning: {src.name} is not square; it will be cropped to a square on the page')
    for w in ((800, 1600) if wide else (240, 480, 960)):
        for ext in (('.avif', '.webp') if wide else ('.webp',)):
            save(img, w, src.with_name(f'{src.stem}-{w}{ext}'))
