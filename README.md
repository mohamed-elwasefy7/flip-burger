# FLIP BURGER — Digital Experience

The official premium digital experience for **FLIP BURGER**: brand website, digital menu, QR menu, delivery landing page, and installable PWA — deployed on GitHub Pages.

Arabic-first (RTL) with a live English toggle. Cinematic, data-driven, zero-framework.

---

## Overview

- **Stack:** HTML5, CSS3, modern JS (ES Modules) — no framework. [GSAP](https://gsap.com) + ScrollTrigger (motion), [Lenis](https://lenis.darkroom.engineering) (smooth scroll), [Vite 7](https://vitejs.dev) (dev + build).
- **Content:** 29 real products across 4 categories (Burgers · Appetizers · Party Box · Drinks), rendered **entirely from `data/menu.json`** — no product markup in HTML.
- **Bilingual:** `ar` (default, RTL) / `en` (toggle), strings in `data/site.json`. Self-hosted fonts (Anton · Archivo · Almarai), zero runtime Google Fonts.
- **PWA:** installable, offline-capable, maskable icons.
- **Deploy:** push to `main` → GitHub Actions builds and publishes to Pages automatically.

## Folder structure

```
flip-burger/
├── index.html              # entry: head (SEO/PWA/schema), boot, nav, hero, menu mounts
├── 404.html                # branded static 404 (self-contained, noindex)
├── brand.html              # internal design-system preview (noindex, dev-only)
├── assets/
│   ├── fonts/              # self-hosted woff2 + fonts.css (font-display: optional)
│   ├── icons/              # PWA + favicon icons (real logo)
│   ├── images/            # hero flames + menu/<category>/<slug>-<w>.{avif,webp,jpg}
│   └── logo/              # logo-{192,512,1024}.webp
├── css/                    # main.css → reset, tokens, brand, components, utilities,
│                           #            sections, menu, product-experience
├── js/
│   ├── main.js            # orchestration
│   ├── core/              # i18n, boot, nav, pwa, smooth-scroll
│   ├── sections/hero.js
│   └── menu/              # loader, renderer, category-nav, product-section,
│                           # product-motion, menu-atmosphere, order-sheet,
│                           # favorites, share
├── data/                   # menu.json (products/categories) · site.json (UI strings)
├── manifest.json · sw.js · robots.txt · sitemap.xml
├── scripts/                # asset pipeline + QA tooling (Node/Python, not shipped)
├── brand-src/              # 18 MB logo original — provenance only, gitignored, never shipped
└── .github/workflows/deploy.yml
```

## Commands

```bash
npm install         # install dependencies
npm run dev         # dev server → http://localhost:5173
npm run build       # production build → dist/
npm run preview     # serve dist/ → http://localhost:4175
npm run verify      # full QA suite (needs preview running) — 44 automated checks
npm run lighthouse  # Lighthouse mobile against preview
npm run assets      # regenerate logo variants + PWA icons + hero flames (Python + Pillow)
npm run menu-images # regenerate responsive menu image sets (Python + Pillow)
npm run shots       # screenshot helper (CDP via system Edge)
```

## Build & deploy (GitHub Pages)

1. Create a repo (e.g. `flip-burger`), push this folder to `main`.
2. Repo → **Settings → Pages → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml` → `npm ci` → `npm run build` → publishes `dist/`.

`base: './'` (relative) makes the site work under **any** repo subpath *and* custom domains with no config. SW scope, manifest `start_url`/`scope`, and the 404 home-link all resolve relative to the deploy path. `.nojekyll` is emitted automatically.

**Before launch — replace placeholders:** search-and-replace `REPLACE-ME.github.io/flip-burger` in `index.html`, `robots.txt`, `sitemap.xml` with the real domain.

## Image pipeline

Source photos live outside the repo; `scripts/build-menu-images.py` emits, per product, `assets/images/menu/<category>/<slug>-{480,800,1280}.{avif,webp}` + a `-<max>.jpg` fallback (LANCZOS downscale only — **composition untouched**, no crop/filters, never upscaled). `scripts/prepare-brand-assets.py` produces logo variants, PWA icons (incl. maskable), and the hero flames set from the official artwork.

The renderer builds a real `<picture>` per product: AVIF → WebP `srcset` (`sizes` accurate) → JPG `<img>` fallback, dimensions reserved (zero CLS), first product eager/high-priority, the rest lazy.

## Adding a product

Add one object to `products[]` in `data/menu.json` and drop its images — **no HTML/JS edits, no rebuild** (menu.json is fetched at runtime, network-first). Minimum:

```json
{
  "id": "new-item", "category": "burgers",
  "nameAr": "…", "nameEn": "NEW ITEM",
  "images": { "base": "assets/images/menu/burger/new-item",
              "widths": [480,800,1280],
              "fallback": "assets/images/menu/burger/new-item-1280.jpg",
              "w": 1280, "h": 1280 },
  "imageAltAr": "…", "imageAltEn": "NEW ITEM",
  "layout": "image-right", "background": "charcoal", "accent": "flame-red"
}
```
Optional fields (`subtitle*`, `description*`, `ingredients*`, `price`, `calories`, `prepTime`, `orderLinks`, `new`/`spicy`/`featured`) **degrade gracefully** — an empty field renders nothing (no empty label, no gap). No image → a premium placeholder panel.

## Adding a category

Add an object to `categories[]` (`id`, `nameAr/En`, `slug`, `order`, `visible`, `accent`) and give its products that `category`. An empty category is auto-hidden. The nav chip, category intro, ambient mood and (optional) art-direction class (`.menu-category--<id>`) all follow automatically.

## Updating prices

Prices are intentionally **absent** (not yet provided) — the price node is not rendered, and the layout is balanced without it. When ready, add `"price": 32` (number) to each product in `menu.json`. It appears automatically with tabular numerals and localized currency (`currency`, default `SAR`). **No redesign, no code change.**

## Localization

- Default language + all UI strings: `data/site.json` (`ar` / `en`). `defaultLang` sets first paint; visitors toggle via the nav. Choice persists in `localStorage`.
- Product fields are bilingual (`*Ar` / `*En`); `pickText()` picks the active language with fallback to the other.
- Arabic product names are currently transliterations pending review (flagged in `menu.json` `_note`).
- RTL/LTR is handled with logical properties throughout; the menu re-renders on toggle with no duplicated listeners/observers.

## Performance notes

- **Zero web-font CLS:** critical fonts self-hosted in `assets/fonts/` with `font-display: optional` + preloaded (`fonts.css`, loaded via a vite-ignored link so URLs stay stable/preloadable). Only used subsets/weights ship (Latin + Arabic).
- **CLS = 0**, **TBT ≈ 60 ms** (measured, Lighthouse). Transform/opacity-only animations; `will-change` applied per-animation and cleared on complete.
- One IntersectionObserver drives reveals + scroll-spy; burger parallax is the only ScrollTrigger set (desktop + motion-OK), fully disposed on language re-render — no leaks, no duplicate handlers.
- Responsive AVIF/WebP/JPG, lazy loading, first product prioritized. `prefers-reduced-motion` disables all motion and shows every section instantly.
- The cinematic boot overlay gates first meaningful paint by design (see QA notes); it never traps the user (hard cap, hidden-tab fast path).

## Service worker / cache

Bump `VERSION` in `sw.js` on any cache-shape change (old caches purge on activate). Strategy: navigations network-first with cached-shell fallback; `menu.json` network-first; hashed bundles/images/fonts stale-while-revalidate. SW registers in production builds only (dev stays cache-free).
