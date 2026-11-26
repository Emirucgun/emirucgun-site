#!/usr/bin/env python3
"""Makes the responsive AVIF + WebP copies the studio pages use, from one source image.

    python3 studio/tools/optimize-images.py <source> <out-prefix> <width> [<width> …]

Writes <out-prefix>-<width>.avif and <out-prefix>-<width>.webp for every width (never upscales,
keeps the aspect ratio, strips metadata from the small copies only; the source file is not touched).

Examples (run from the repository root):
    # social posts on /esempi: 360, 720, 1080
    python3 studio/tools/optimize-images.py studio/posts/trattoria-post-1.png studio/posts/opt/trattoria-post-1 360 720 1080
    # before/after photos: 480, 800, 1200 (see "Before/after examples" in studio/README.md)
    python3 studio/tools/optimize-images.py studio/ba/carbonara-before.jpg studio/img/carbonara-before 480 800 1200

Needs Pillow with AVIF support (Pillow >= 11.2, or `pip install pillow-avif-plugin`)."""
import sys
from pathlib import Path
from PIL import Image, ImageOps

WEBP_Q, AVIF_Q = 80, 58  # matched to the existing files: similar size, no visible loss at 1x/2x


def main(argv):
    if len(argv) < 4:
        sys.exit(__doc__)
    src, prefix, widths = Path(argv[1]), argv[2], [int(w) for w in argv[3:]]
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    Path(prefix).parent.mkdir(parents=True, exist_ok=True)
    for w in widths:
        w2 = min(w, im.width)
        copy = im.resize((w2, round(im.height * w2 / im.width)), Image.LANCZOS) if w2 != im.width else im
        for ext, opts in (('avif', dict(quality=AVIF_Q, speed=4)), ('webp', dict(quality=WEBP_Q, method=6))):
            out = f'{prefix}-{w}.{ext}'
            copy.save(out, ext.upper(), **opts)
            print(f'wrote {out}  {copy.width}x{copy.height}  {Path(out).stat().st_size // 1024} KB')


if __name__ == '__main__':
    main(sys.argv)
