"""
FLIP BURGER — real menu image pipeline (Part 5).

Reads the official product photos and emits responsive sets:
  assets/images/menu/<category>/<slug>-{1280,800,480}.{avif,webp} + <slug>-1280.jpg

Rules: LANCZOS downscale only — no crop, no filters, composition untouched.
Transparent PNGs are flattened onto brand black (#0D0906) for jpg/avif/webp
photo output (photos here are opaque anyway). Idempotent; skips up-to-date
outputs unless --force.

Run:  python scripts/build-menu-images.py [--force]
"""

import sys
from pathlib import Path

from PIL import Image, features

SRC_ROOT = Path(
    r"C:\Users\Owner\Desktop\شغل كلود\المطاعم - التسويق\صور المنيو\فليب برجر"
    r"\منيو فيلب برجر (اختيارك)\1- منيو فيلب برجر"
)
OUT_ROOT = Path(__file__).resolve().parent.parent / "assets" / "images" / "menu"
BRAND_BLACK = (13, 9, 6)
WIDTHS = (1280, 800, 480)

# (category folder, out dir, [(source filename, slug), ...])
MANIFEST = [
    ("BURGER", "burger", [
        ("BLACK TWINS.png", "black-twins"),
        ("CLASSICO BEEF.png", "classico-beef"),
        # classico-chicken (fried) removed from the menu 2026-07-23; the
        # grilled build carries the CLASSICO CHICKEN name now (slug kept).
        ("CLASSICO CHICKEN  GRILLED.png", "classico-chicken-grilled"),
        ("MID NIGHT.png", "mid-night"),
        ("RED HEAD.png", "red-head"),
        ("RED HIT.png", "red-hit"),
    ]),
    ("APPETIZERS", "appetizers", [
        ("CHICKEN TENDERS.png", "chicken-tenders"),
        ("FRIES BOX.png", "fries-box"),
        ("MOZZARELLA STICKS.png", "mozzarella-sticks"),
        ("ONION RINGS.png", "onion-rings"),
        ("WEDGES POTATO.png", "wedges-potato"),
    ]),
    ("PARTY BOX", "party-box", [
        ("SMALL PARTY 12 PCS.png", "small-party-12"),
        ("BIG PARTY 24 PCS.png", "big-party-24"),
        ("FRIES MIX FLIP GATHERING.png", "fries-mix-flip-gathering"),
    ]),
    ("DRINKS", "drinks", [
        ("PEPSI.jpg", "pepsi"),
        ("DIET PEPSI.jpg", "diet-pepsi"),
        ("SEVEN UP.jpg", "seven-up"),
        ("DIET SEVEN UP.jpg", "diet-seven-up"),
        ("MIRINDA ORANGE.jpg", "mirinda-orange"),
        ("MIRINDA LEMON.jpg", "mirinda-lemon"),
        ("MOUNTAIN DEW.jpg", "mountain-dew"),
        ("KINZA COLA.jpg", "kinza-cola"),
        ("KINZA DIET COLA.png", "kinza-diet-cola"),
        ("KINZA LEMON.jpg", "kinza-lemon"),
        ("KINZA DIET LEMON.png", "kinza-diet-lemon"),
        ("KINZA LEMON MIX.avif", "kinza-lemon-mix"),
        ("KINZA ORANGE.jpg", "kinza-orange"),
        ("SMALL WATER NOVA.jpg", "small-water-nova"),
    ]),
]


def flatten(img: Image.Image) -> Image.Image:
    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGBA")
        base = Image.new("RGB", img.size, BRAND_BLACK)
        base.paste(img, mask=img.getchannel("A"))
        return base
    return img.convert("RGB")


def build(force: bool) -> None:
    if not features.check("avif"):
        sys.exit("Pillow AVIF support missing — pip install pillow-avif-plugin")

    total_src = 0
    print(f"{'file':44} {'avif':>7} {'webp':>7} {'jpg':>8}")
    for src_folder, out_folder, items in MANIFEST:
        out_dir = OUT_ROOT / out_folder
        out_dir.mkdir(parents=True, exist_ok=True)
        for filename, slug in items:
            src = SRC_ROOT / src_folder / filename
            if not src.exists():
                print(f"!! MISSING SOURCE: {src}")
                continue
            total_src += 1

            # purge stale outputs for this slug (width set may change)
            for old in out_dir.glob(f"{slug}-*.*"):
                old.unlink()

            img = flatten(Image.open(src))
            src_w = img.size[0]
            # real widths only — never upscale, never emit duplicate sizes
            widths = sorted({w for w in WIDTHS if w < src_w} | {min(src_w, max(WIDTHS))})

            for width in widths:
                if width == src_w:
                    scaled = img
                else:
                    h = round(img.size[1] * width / src_w)
                    scaled = img.resize((width, h), Image.LANCZOS)
                scaled.save(out_dir / f"{slug}-{width}.avif", "AVIF", quality=62)
                scaled.save(out_dir / f"{slug}-{width}.webp", "WEBP", quality=82, method=6)
                if width == widths[-1]:
                    scaled.save(out_dir / f"{slug}-{width}.jpg", "JPEG", quality=84, optimize=True, progressive=True)
                    largest = scaled.size

            big = widths[-1]
            sizes = tuple(
                (out_dir / f"{slug}-{big}.{ext}").stat().st_size // 1024 for ext in ("avif", "webp", "jpg")
            )
            print(
                f"{out_folder}/{slug:38} widths={widths} {largest[0]}x{largest[1]} "
                f"{sizes[0]}KB/{sizes[1]}KB/{sizes[2]}KB"
            )

    print(f"\n{total_src} source photos processed → {OUT_ROOT}")


if __name__ == "__main__":
    build(force="--force" in sys.argv)
