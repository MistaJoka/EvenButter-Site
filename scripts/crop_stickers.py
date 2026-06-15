"""One-time: crop the circular sticker art out of the MUNBYN app screenshots.

Each source screenshot (1018x1984) shows one round sticker inside a light-gray
preview panel in the upper portion, with app chrome above and template metadata
(QR code, labels) below. We:
  1. Look only at the preview-panel band (avoids the orange logo + QR code).
  2. Find the bounding box of the dark ink (the sticker linework).
  3. Crop a padded square around it.
  4. Turn near-white into transparency (alpha = 255 - luminance) so the black
     ink stamp sits cleanly on the site's pastel backgrounds, with anti-aliased
     edges.
Also derives logo.png: a tight crop of just the "Even Butter Bake Shop"
wordmark from the center of one sticker (no outer ring, no flavor name).
"""
from pathlib import Path
from PIL import Image

SRC = Path("resources")
OUT = Path("public/images")
FLAVORS_OUT = OUT / "flavors"

# screenshot filename -> output slug
MAPPING = {
    "WhatsApp Image 2026-06-14 at 17.24.25.jpeg": "banana-chip",
    "WhatsApp Image 2026-06-14 at 17.24.35.jpeg": "the-ccc",
    "WhatsApp Image 2026-06-14 at 17.24.45.jpeg": "jam-and-toast",
    "WhatsApp Image 2026-06-14 at 17.25.14.jpeg": "oatmeal-raisin",
    "WhatsApp Image 2026-06-14 at 17.25.25.jpeg": "raspberry-smores",
    "WhatsApp Image 2026-06-14 at 17.25.40.jpeg": "fudge-brownie",
    "WhatsApp Image 2026-06-14 at 17.25.54.jpeg": "marcel",
    "WhatsApp Image 2026-06-14 at 17.26.06.jpeg": "carrot-cake",
    "WhatsApp Image 2026-06-14 at 17.26.16.jpeg": "nougat-crunch",
}

# Analysis band (fraction of height) that contains the preview panel only.
BAND_TOP, BAND_BOTTOM = 0.14, 0.60
DARK = 300          # sum(r,g,b) below this == "ink"
PAD = 0.04          # padding around detected circle, fraction of size
WHITE_CUT = 245     # luminance at/above which alpha is fully 0


def luminance(r, g, b):
    return 0.299 * r + 0.587 * g + 0.114 * b


def detect_bbox(img):
    w, h = img.size
    y0, y1 = int(h * BAND_TOP), int(h * BAND_BOTTOM)
    px = img.load()
    minx, miny, maxx, maxy = w, y1, 0, y0
    step = 2
    for y in range(y0, y1, step):
        for x in range(0, w, step):
            r, g, b = px[x, y][:3]
            if r + g + b < DARK:
                if x < minx: minx = x
                if x > maxx: maxx = x
                if y < miny: miny = y
                if y > maxy: maxy = y
    return minx, miny, maxx, maxy


def to_transparent(img):
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            lum = luminance(r, g, b)
            if lum >= WHITE_CUT:
                a = 0
            else:
                a = int(255 - lum)
            px[x, y] = (r, g, b, a)
    return img


def square_crop(img, bbox, pad=PAD):
    minx, miny, maxx, maxy = bbox
    cx, cy = (minx + maxx) / 2, (miny + maxy) / 2
    side = max(maxx - minx, maxy - miny) * (1 + 2 * pad)
    half = side / 2
    left, top = int(cx - half), int(cy - half)
    right, bottom = int(cx + half), int(cy + half)
    left, top = max(0, left), max(0, top)
    right, bottom = min(img.size[0], right), min(img.size[1], bottom)
    return img.crop((left, top, right, bottom)), (left, top, right, bottom)


def main():
    FLAVORS_OUT.mkdir(parents=True, exist_ok=True)
    logo_done = False
    for fname, slug in MAPPING.items():
        src = SRC / fname
        img = Image.open(src).convert("RGB")
        bbox = detect_bbox(img)
        cropped, box = square_crop(img, bbox)
        out_img = to_transparent(cropped)
        if slug in ("marcel",):
            dest = OUT / f"{slug}.png"
        elif slug == "logo":
            dest = OUT / f"{slug}.png"
        else:
            dest = FLAVORS_OUT / f"{slug}.png"
        out_img.save(dest)
        print(f"{slug:16s} ink_bbox={bbox} crop={box} -> {dest}")

        # Derive the wordmark logo from banana-chip's center.
        if slug == "banana-chip" and not logo_done:
            left, top, right, bottom = box
            cw, ch = right - left, bottom - top
            wl = int(left + cw * 0.205)
            wr = int(left + cw * 0.795)
            wt = int(top + ch * 0.305)
            wb = int(top + ch * 0.665)
            logo = to_transparent(img.crop((wl, wt, wr, wb)))
            logo.save(OUT / "logo.png")
            print(f"{'logo':16s} crop=({wl},{wt},{wr},{wb}) -> {OUT/'logo.png'}")
            logo_done = True


if __name__ == "__main__":
    main()
