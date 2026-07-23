/**
 * Menu orchestrator: loads data/menu.json, renders category nav + product
 * sections, wires actions (order / favorite / share), keeps the active
 * category in sync with scrolling via ONE IntersectionObserver, re-renders
 * on language change, and honors #hash deep links after boot.
 */

import { loadMenu, unionOrderLinks } from './menu-loader.js';
import { renderCategoryNav, setActiveCategory, setFavChip } from './category-nav.js';
import { renderProduct } from './product-section.js';
import { initOrderSheet, openOrderSheet, closeOrderSheet, isOrderSheetOpen } from './order-sheet.js';
import { toggleFavorite, favoritesList } from './favorites.js';
import { buildSavedStrip, recordView } from './saved-strip.js';
import { shareProduct } from './share.js';
import { initProductMotion } from './product-motion.js';
import { initAtmosphere, setMood } from './menu-atmosphere.js';
import { initReveal } from '../core/reveal.js';
import { str, pickText } from '../core/i18n.js';
import { track, entrySource } from '../core/events.js';

let data = null;
let ctx = null;
let spy = null;
let motion = null;
let reveal = null;
let productIndex = new Map();
let lastViewedId = null;
let lastTrackedCat = null;

/** Product id targeted by the current hash, if any. */
function hashProductId() {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  return hash.startsWith('product-') ? hash.slice('product-'.length) : null;
}

export async function initMenu({ lenis, gsap, ScrollTrigger, reduceMotion, bootDone }) {
  const navMount = document.getElementById('menu-cat-nav');
  const listMount = document.getElementById('menu-products');
  if (!navMount || !listMount) return;

  ctx = { lenis, gsap, ScrollTrigger, reduceMotion };
  initOrderSheet({ lenis });
  initAtmosphere(document.getElementById('menu-list'), { gsap, reduceMotion });

  try {
    data = await loadMenu();
  } catch (err) {
    console.error('[flip] menu load failed:', err);
    return;
  }

  injectMenuSchema();
  render(navMount, listMount);
  bindActions(listMount);

  window.addEventListener('flip:langchange', () => {
    if (isOrderSheetOpen()) closeOrderSheet();
    // Re-anchor to the product actually on stage (the spy rewrites the hash
    // to the category while browsing, so the hash alone loses the product).
    const anchor = lastViewedId ? `#product-${lastViewedId}` : window.location.hash;
    render(navMount, listMount);
    // Small settle delay: Lenis re-measures via async observers after the
    // rebuild; an immediate re-honor lands on stale geometry.
    if (anchor) setTimeout(() => honorDeepLink(anchor), 200);
  });

  ensureOrderBar();
  (bootDone || Promise.resolve()).then(honorDeepLink);
}

/**
 * Inject the full Menu graph (sections + items) as JSON-LD, sourced from
 * data/menu.json so it never drifts from the visible menu. Canonical English
 * names; prices omitted until real prices exist. Runs once (crawlers that
 * render JS pick it up; the static Restaurant/Organization schema covers the
 * rest). Idempotent — replaces any prior node.
 */
function injectMenuSchema() {
  const base = location.origin + location.pathname;
  const graph = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${base}#menu`,
    name: 'FLIP BURGER Menu',
    inLanguage: ['ar', 'en'],
    hasMenuSection: data.categories.map((cat) => ({
      '@type': 'MenuSection',
      name: cat.nameEn || cat.nameAr,
      hasMenuItem: data.byCategory.get(cat.id).map((p) => ({
        '@type': 'MenuItem',
        name: p.nameEn || p.nameAr,
      })),
    })),
  };

  let node = document.getElementById('menu-schema');
  if (!node) {
    node = document.createElement('script');
    node.type = 'application/ld+json';
    node.id = 'menu-schema';
    document.head.appendChild(node);
  }
  node.textContent = JSON.stringify(graph);
}

/**
 * Deterministic cinematic scene per product (no consecutive repeats within a
 * category; special-cased twins + category-specific rhythms).
 */
function sceneFor(product, category, indexInCat) {
  if (product.id === 'black-twins') return 'twin';
  if (category.id === 'party-box') return 'party';
  if (category.id === 'drinks') return 'drink';
  const rotation =
    category.id === 'appetizers'
      ? ['split', 'stacked', 'fullbleed']
      : ['stacked', 'split', 'fullbleed'];
  return rotation[indexInCat % rotation.length];
}

function categoryIntro(cat, position) {
  const intro = document.createElement('header');
  intro.className = 'category-intro';
  // Editorial chapter card: numbered kicker + ghost name behind the title.
  // Intro line comes from the category data when present, else the localized
  // per-category line in site.json (menu.catIntro) — both degrade to nothing.
  const desc = pickText(cat, 'description') || str(`menu.catIntro.${cat.id}`);
  const num = String(position + 1).padStart(2, '0');
  const ghost = cat.nameEn || cat.nameAr || '';
  intro.innerHTML = `
    <span class="category-intro__ghost" aria-hidden="true">${escText(ghost)}</span>
    <span class="category-intro__kicker label" data-enter="rise"><span class="category-intro__num">${num}</span>${escText(str('menu.chapter'))}</span>
    <h2 class="title-section category-intro__name" data-enter="mask">${escText(pickText(cat, 'name'))}</h2>
    <hr class="heat-rule category-intro__rule" data-enter="fade" data-enter-at="0.15" />
    ${desc ? `<p class="body-copy category-intro__desc" data-enter="rise" data-enter-at="0.1">${escText(desc)}</p>` : ''}`;
  return intro;
}

function escText(text) {
  const div = document.createElement('div');
  div.textContent = text ?? '';
  return div.innerHTML;
}

function render(navMount, listMount) {
  renderCategoryNav(navMount, data.categories, ctx);

  motion?.dispose();
  reveal?.dispose();
  listMount.innerHTML = '';
  productIndex = new Map();
  for (const cat of data.categories) {
    for (const p of data.byCategory.get(cat.id)) productIndex.set(p.id, p);
  }

  // Saved strip (favorites + recently viewed) — renders only when real local
  // data exists; a quiet utility row between the bridge and the first room.
  const strip = buildSavedStrip(productIndex);
  if (strip) listMount.appendChild(strip);
  setFavChip(favoritesList().filter((id) => productIndex.has(id)).length, ctx);

  let first = true;
  data.categories.forEach((cat, catPos) => {
    const wrap = document.createElement('div');
    wrap.className = `menu-category menu-category--${cat.id}`;
    wrap.id = cat.slug;
    wrap.dataset.cat = cat.id;
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', pickText(cat, 'name'));

    wrap.appendChild(categoryIntro(cat, catPos));

    const products = data.byCategory.get(cat.id);
    products.forEach((product, i) => {
      productIndex.set(product.id, product);
      // First product's image loads eagerly (likely near-viewport after the
      // hero); everything below lazy-loads.
      wrap.appendChild(
        renderProduct(product, cat, {
          eager: first,
          scene: sceneFor(product, cat, i),
          index: i + 1,
          total: products.length,
        })
      );
      first = false;
    });
    listMount.appendChild(wrap);
  });

  observeSections(listMount);
  motion = initProductMotion({
    listMount,
    gsap: ctx.gsap,
    ScrollTrigger: ctx.ScrollTrigger,
    reduceMotion: ctx.reduceMotion,
    // Direct product links are high-intent: the target reveals instantly so
    // the CTA is available the moment the customer lands.
    instantId: hashProductId(),
  });
  reveal = initReveal({ gsap: ctx.gsap, ScrollTrigger: ctx.ScrollTrigger, root: listMount, reduceMotion: ctx.reduceMotion });
}

/* Scroll spy: active category chip + ambient mood. Reveals live in
   product-motion.js with their own lookahead observer. */
function observeSections(listMount) {
  spy?.disconnect();

  // Intros count as "the category on stage": the taller editorial chapter
  // cards mean a chip-click can land with the first product still below the
  // spy band — the intro filling the band must activate its category.
  const sections = [...listMount.querySelectorAll('.category-intro, .product')];
  if (!sections.length) return;

  spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const cat = entry.target.closest('.menu-category');
        if (cat) {
          setActiveCategory(cat.id);
          setMood(cat.dataset.cat);
          setOrderBarCategory(cat.dataset.cat);
          if (cat.dataset.cat !== lastTrackedCat) {
            lastTrackedCat = cat.dataset.cat;
            track('category_view', { category: cat.dataset.cat });
          }
        }
        // "Viewed" = the product stage crossed mid-viewport — works in both
        // motion and reduced-motion modes; consecutive duplicates ignored.
        const id = entry.target.classList.contains('product')
          ? entry.target.dataset.productId
          : null;
        if (id && id !== lastViewedId) {
          lastViewedId = id;
          recordView(id);
          track('product_view', { product: id });
        }
      }
    },
    { rootMargin: '-35% 0px -45% 0px', threshold: 0 }
  );

  sections.forEach((s) => spy.observe(s));
}

function bindActions(listMount) {
  listMount.addEventListener('click', (event) => {
    // Saved-strip tiles: smooth-travel to the product (native anchor fallback).
    const jump = event.target.closest('[data-saved-jump]');
    if (jump) {
      const target = document.getElementById(`product-${jump.dataset.savedJump}`);
      if (target) {
        event.preventDefault();
        history.replaceState(null, '', `#product-${jump.dataset.savedJump}`);
        if (ctx.lenis && !ctx.reduceMotion) ctx.lenis.scrollTo(target, { offset: -96, duration: 1 });
        else target.scrollIntoView({ behavior: ctx.reduceMotion ? 'auto' : 'smooth' });
      }
      return;
    }

    const article = event.target.closest('.product');
    if (!article) return;
    const product = productIndex.get(article.dataset.productId);
    if (!product) return;

    const orderBtn = event.target.closest('[data-order]');
    if (orderBtn) {
      openOrderSheet(product, orderBtn);
      return;
    }

    const favBtn = event.target.closest('[data-fav]');
    if (favBtn) {
      const nowFav = toggleFavorite(product.id);
      favBtn.setAttribute('aria-pressed', String(nowFav));
      favBtn.setAttribute('aria-label', str(nowFav ? 'menu.favRemove' : 'menu.favAdd'));
      favBtn.classList.toggle('is-fav', nowFav);
      track(nowFav ? 'favorite_add' : 'favorite_remove', { product: product.id });
      // Chip count updates live (horizontal strip — no vertical shift). The
      // strip itself refreshes in place only if already rendered; a first-ever
      // favorite surfaces it on the next render, never mid-scroll (CLS = 0).
      setFavChip(favoritesList().filter((id) => productIndex.has(id)).length, ctx);
      refreshSavedStripInPlace();
      if (!ctx.reduceMotion && ctx.gsap && !document.hidden) {
        // Char-pop: swell and settle with weight — no elastic bounce.
        ctx.gsap.timeline()
          .to(favBtn.querySelector('.icon'), { scale: 1.25, duration: 0.15, ease: 'power2.out' })
          .to(favBtn.querySelector('.icon'), { scale: 1, duration: 0.2, ease: 'power2.inOut' });
      }
      return;
    }

    const shareBtn = event.target.closest('[data-share]');
    if (shareBtn) {
      track('share', { product: product.id });
      shareProduct(product, pickText(product, 'name'));
    }
  });
}

/** Rebuild the strip's contents only when it already exists on the page —
 *  same slot, same single-row height, zero layout shift. */
function refreshSavedStripInPlace() {
  const existing = document.getElementById('saved-strip');
  if (!existing) return;
  const fresh = buildSavedStrip(productIndex);
  if (fresh) existing.replaceWith(fresh);
  else existing.remove(); // last favorite removed and no recents → gone
}

/* --------------------------------------------------------------------------
   Sticky mobile order bar (Bible §19) — one persistent اطلب under the thumb.
   Visible only while the menu zone is on screen (mobile/tablet; CSS hides it
   ≥1024px and while the sheet is open). Opens the brand-level order sheet
   with the union of real platform links — honest "coming soon" until links
   exist in the data.
   -------------------------------------------------------------------------- */
let orderBar = null;
let orderBarIO = null;

function ensureOrderBar() {
  if (orderBar) return;
  orderBar = document.createElement('div');
  orderBar.className = 'order-bar';
  orderBar.innerHTML = `
    <span class="order-bar__context label label--muted"></span>
    <button class="btn btn--primary order-bar__cta" type="button"></button>`;
  document.body.appendChild(orderBar);

  const cta = orderBar.querySelector('.order-bar__cta');
  cta.textContent = str('menu.order');
  cta.addEventListener('click', () => {
    openOrderSheet(null, cta, { links: unionOrderLinks(data) });
  });

  const zone = document.getElementById('menu-list');
  if (zone) {
    orderBarIO = new IntersectionObserver(
      ([entry]) => orderBar.classList.toggle('is-visible', entry.isIntersecting),
      { rootMargin: '-15% 0px 0px 0px', threshold: 0 }
    );
    orderBarIO.observe(zone);
  }

  window.addEventListener('flip:langchange', () => {
    cta.textContent = str('menu.order');
    setOrderBarCategory(lastTrackedCat);
  });
}

function setOrderBarCategory(catId) {
  if (!orderBar || !catId) return;
  const cat = data.categories.find((c) => c.id === catId);
  orderBar.querySelector('.order-bar__context').textContent = cat ? pickText(cat, 'name') : '';
}

const FAST_SRC = new Set(['box', 'bag', 'flyer', 'story']);

function honorDeepLink(hashOverride) {
  const hash = decodeURIComponent((hashOverride ?? window.location.hash).slice(1));
  // QR fast path with no deeper link: land at the menu (deep links win).
  const target = hash
    ? document.getElementById(hash) || document.getElementById(`product-${hash}`)
    : FAST_SRC.has(entrySource())
      ? document.getElementById('menu')
      : null;
  if (!target) return;
  if (ctx.lenis && !ctx.reduceMotion) {
    // Re-measure first: after a re-render (or before first Lenis tick) the
    // cached scroll limit is stale and an immediate scroll would clamp short.
    ctx.lenis.resize?.();
    ctx.lenis.scrollTo(target, { offset: -96, immediate: true, force: true });
  } else {
    target.scrollIntoView();
  }
}
