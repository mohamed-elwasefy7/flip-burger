/**
 * Menu orchestrator: loads data/menu.json, renders category nav + product
 * sections, wires actions (order / favorite / share), keeps the active
 * category in sync with scrolling via ONE IntersectionObserver, re-renders
 * on language change, and honors #hash deep links after boot.
 */

import { loadMenu } from './menu-loader.js';
import { renderCategoryNav, setActiveCategory } from './category-nav.js';
import { renderProduct } from './product-section.js';
import { initOrderSheet, openOrderSheet, closeOrderSheet, isOrderSheetOpen } from './order-sheet.js';
import { toggleFavorite } from './favorites.js';
import { shareProduct } from './share.js';
import { initProductMotion } from './product-motion.js';
import { initAtmosphere, setMood } from './menu-atmosphere.js';
import { initReveal } from '../core/reveal.js';
import { str, pickText } from '../core/i18n.js';

let data = null;
let ctx = null;
let spy = null;
let motion = null;
let reveal = null;
let productIndex = new Map();

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
    render(navMount, listMount);
  });

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

function categoryIntro(cat) {
  const intro = document.createElement('header');
  intro.className = 'category-intro';
  const desc = pickText(cat, 'description');
  intro.innerHTML = `
    <span class="category-intro__kicker label" data-enter="rise">${escText(str('menu.catNavAria'))}</span>
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

  let first = true;
  for (const cat of data.categories) {
    const wrap = document.createElement('div');
    wrap.className = `menu-category menu-category--${cat.id}`;
    wrap.id = cat.slug;
    wrap.dataset.cat = cat.id;
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', pickText(cat, 'name'));

    wrap.appendChild(categoryIntro(cat));

    const products = data.byCategory.get(cat.id);
    products.forEach((product, i) => {
      productIndex.set(product.id, product);
      // First product's image loads eagerly (likely near-viewport after the
      // hero); everything below lazy-loads.
      wrap.appendChild(renderProduct(product, cat, { eager: first, scene: sceneFor(product, cat, i) }));
      first = false;
    });
    listMount.appendChild(wrap);
  }

  observeSections(listMount);
  motion = initProductMotion({ listMount, gsap: ctx.gsap, ScrollTrigger: ctx.ScrollTrigger, reduceMotion: ctx.reduceMotion });
  reveal = initReveal({ gsap: ctx.gsap, ScrollTrigger: ctx.ScrollTrigger, root: listMount, reduceMotion: ctx.reduceMotion });
}

/* Scroll spy: active category chip + ambient mood. Reveals live in
   product-motion.js with their own lookahead observer. */
function observeSections(listMount) {
  spy?.disconnect();

  const sections = [...listMount.querySelectorAll('.product')];
  if (!sections.length) return;

  spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const cat = entry.target.closest('.menu-category');
        if (cat) {
          setActiveCategory(cat.id);
          setMood(cat.dataset.cat);
        }
      }
    },
    { rootMargin: '-35% 0px -45% 0px', threshold: 0 }
  );

  sections.forEach((s) => spy.observe(s));
}

function bindActions(listMount) {
  listMount.addEventListener('click', (event) => {
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
      if (!ctx.reduceMotion && ctx.gsap && !document.hidden) {
        ctx.gsap.fromTo(
          favBtn.querySelector('.icon'),
          { scale: 0.7 },
          { scale: 1, duration: 0.45, ease: 'back.out(2.5)' }
        );
      }
      return;
    }

    const shareBtn = event.target.closest('[data-share]');
    if (shareBtn) {
      shareProduct(product, pickText(product, 'name'));
    }
  });
}

function honorDeepLink() {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (!hash) return;
  const target = document.getElementById(hash) || document.getElementById(`product-${hash}`);
  if (!target) return;
  if (ctx.lenis && !ctx.reduceMotion) {
    ctx.lenis.scrollTo(target, { offset: -96, immediate: true });
  } else {
    target.scrollIntoView();
  }
}
