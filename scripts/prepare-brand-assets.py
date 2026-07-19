"""
FLIP BURGER — brand asset pipeline.

Sources (official files, never modified in place):
  LOGO_SRC : 5000x5000 transparent circular badge logo.
  PDFS     : packaging dieline / brand guideline PDFs (embedded-image extraction).

Outputs:
  assets/logo/   flip-logo-source.png (verbatim copy), logo-{1024,512,192}.webp,
                 logo-{1024,192}.png fallbacks
  assets/icons/  icon-192.png, icon-512.png, icon-512-maskable.png,
                 apple-touch-icon.png  (replace Part-1 placeholders, same names)
  <scratch>/pdf-extract/  candidate packaging art pulled from PDFs, for review
                          before anything is promoted into assets/images/.

Run:  python scripts/prepare-brand-assets.py [scratch_dir]
"""

import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
LOGO_SRC = Path(r"C:\Users\Owner\Downloads\Circular-Transparent-Logos-70cm\Flip-Burger-Circular-Transparent.png")
PDFS = [
    Path(r"C:\Users\Owner\Downloads\flip-burger-professional-dieline-390x390x90mm.pdf"),
    Path(r"C:\Users\Owner\Downloads\professional-box-dielines-390x330x60mm\flip-burger-professional-dieline-390x330x60mm.pdf"),
    Path(r"C:\Users\Owner\Downloads\ماطعم\FLIP_Burger\FLIP_Burger_Packaging_Dielines.pdf"),
    Path(r"C:\Users\Owner\Downloads\ماطعم\FLIP_Burger\FLIP_Burger_Brand_Guidelines.pdf"),
]
BRAND_BLACK = (13, 9, 6)  # --color-black #0D0906

LOGO_DIR = ROOT / "assets" / "logo"
ICON_DIR = ROOT / "assets" / "icons"
# Provenance copy of the untouched source lives OUTSIDE assets/ so the 18 MB
# original is never copied into the production dist/ bundle.
BRAND_SRC_DIR = ROOT / "brand-src"


def load_logo() -> Image.Image:
    img = Image.open(LOGO_SRC).convert("RGBA")
    alpha = img.getchannel("A")
    lo, hi = alpha.getextrema()
    print(f"logo source: {img.size[0]}x{img.size[1]}, alpha range {lo}..{hi} "
          f"({'transparent OK' if lo < 250 else 'NO TRANSPARENCY!'})")
    return img


def save_variant(img: Image.Image, size: int, stem: str, png: bool) -> None:
    out = img.resize((size, size), Image.LANCZOS)
    out.save(LOGO_DIR / f"{stem}-{size}.webp", "WEBP", quality=88, method=6)
    if png:
        out.save(LOGO_DIR / f"{stem}-{size}.png", "PNG", optimize=True)
    print(f"  logo variant {size}px" + (" (+png)" if png else ""))


def flatten_on_black(img: Image.Image, canvas: int, logo_ratio: float) -> Image.Image:
    base = Image.new("RGBA", (canvas, canvas), (*BRAND_BLACK, 255))
    target = int(canvas * logo_ratio)
    scaled = img.resize((target, target), Image.LANCZOS)
    off = (canvas - target) // 2
    base.alpha_composite(scaled, (off, off))
    return base.convert("RGB")


def build_logo_assets() -> None:
    LOGO_DIR.mkdir(parents=True, exist_ok=True)
    ICON_DIR.mkdir(parents=True, exist_ok=True)
    BRAND_SRC_DIR.mkdir(parents=True, exist_ok=True)

    shutil.copy2(LOGO_SRC, BRAND_SRC_DIR / "flip-logo-source.png")
    print("copied source -> brand-src/flip-logo-source.png (out of assets/, never shipped)")

    img = load_logo()
    # webp only — every reference in markup/CSS uses .webp (universal support).
    save_variant(img, 1024, "logo", png=False)
    save_variant(img, 512, "logo", png=False)
    save_variant(img, 192, "logo", png=False)

    # PWA icons — opaque brand black so launcher tiles stay on-brand.
    flatten_on_black(img, 192, 0.94).save(ICON_DIR / "icon-192.png", "PNG", optimize=True)
    flatten_on_black(img, 512, 0.94).save(ICON_DIR / "icon-512.png", "PNG", optimize=True)
    # Maskable: keep the badge inside the ~80% safe zone.
    flatten_on_black(img, 512, 0.78).save(ICON_DIR / "icon-512-maskable.png", "PNG", optimize=True)
    flatten_on_black(img, 180, 0.94).save(ICON_DIR / "apple-touch-icon.png", "PNG", optimize=True)
    print("PWA icons regenerated (192 / 512 / 512-maskable / apple-touch-180)")


def extract_pdf_images(scratch: Path) -> None:
    try:
        from pypdf import PdfReader
    except ImportError:
        print("pypdf missing — skipping PDF extraction")
        return

    out_dir = scratch / "pdf-extract"
    out_dir.mkdir(parents=True, exist_ok=True)
    for pdf in PDFS:
        if not pdf.exists():
            print(f"missing: {pdf}")
            continue
        try:
            reader = PdfReader(pdf)
        except Exception as exc:  # noqa: BLE001 — report and continue
            print(f"unreadable {pdf.name}: {exc}")
            continue
        count = 0
        for p_idx, page in enumerate(reader.pages):
            try:
                images = page.images
            except Exception:
                continue
            for i_idx, im in enumerate(images):
                name = f"{pdf.stem}_p{p_idx + 1}_{i_idx}{Path(im.name).suffix or '.png'}"
                (out_dir / name).write_bytes(im.data)
                count += 1
        print(f"{pdf.name}: extracted {count} embedded image(s)")


def promote_flames_stage(scratch: Path) -> None:
    """Official packaging flame panel (transparent RGBA, empty badge circle)
    extracted from flip-burger-professional-dieline-390x330x60mm.pdf.
    Becomes the hero visual backdrop; the official logo layers into the
    empty circle at runtime — no redrawing, all official pixels."""
    src = scratch / "pdf-extract" / "flip-burger-professional-dieline-390x330x60mm_p1_12.jp2"
    if not src.exists():
        print(f"flames panel not found at {src} — skipping")
        return
    out_dir = ROOT / "assets" / "images"
    out_dir.mkdir(parents=True, exist_ok=True)
    im = Image.open(src)
    im.load()
    for width in (1600, 800):
        h = round(im.size[1] * width / im.size[0])
        scaled = im.resize((width, h), Image.LANCZOS)
        scaled.save(out_dir / f"flames-stage-{width}.webp", "WEBP", quality=86, method=6)
        print(f"  flames-stage-{width}.webp ({width}x{h})")
    # <picture> <img> fallback for the (vanishingly rare) no-webp client.
    # Flattened on brand black — visually identical over the near-black hero,
    # ~150 KB vs a 1.9 MB transparent PNG. The .hero__badge covers the circle.
    fh = round(im.size[1] * 1600 / im.size[0])
    flat = Image.new("RGB", (1600, fh), BRAND_BLACK)
    flat.paste(im.resize((1600, fh), Image.LANCZOS), mask=im.getchannel("A"))
    flat.save(out_dir / "flames-stage-1600.jpg", "JPEG", quality=84, optimize=True, progressive=True)
    print("  flames-stage-1600.jpg fallback")


if __name__ == "__main__":
    build_logo_assets()
    scratch = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / ".pdf-scratch"
    extract_pdf_images(scratch)
    promote_flames_stage(scratch)
    print("done")
