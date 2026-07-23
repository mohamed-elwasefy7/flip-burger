/**
 * Cinematic product scene renderer.
 *
 * MOBILE DOM ORDER — ABSOLUTE RULE (identical for every product & scene):
 *   1 image · 2 category label · 3 name · 4 subtitle · 5 description ·
 *   6 ingredients · 7 heat (data-gated) · 8 badges/meta · 9 price ·
 *   10 order CTA · 11 fav/share
 * Content children are authored in exactly that order. Scenes re-compose the
 * MEDIA vs CONTENT placement via CSS grid/absolute on desktop only — never
 * via `order`, never reordering the DOM. The giant "ghost" name is decorative
 * (aria-hidden, absolute, desktop-only) and never affects reading order.
 *
 * Scene comes from menu-renderer (data-driven). Every optional field degrades:
 * empty → the node is not rendered.
 */

import { str, pickText } from '../core/i18n.js';
import { isFavorite } from './favorites.js';

function esc(text) {
  const div = document.createElement('div');
  div.textContent = text ?? '';
  return div.innerHTML;
}

const SCENES = new Set(['stacked', 'split', 'fullbleed', 'twin', 'party', 'drink']);
const MEDIA_SIZES = '(min-width: 1024px) 48vw, 92vw';

function mediaMarkup(product, { eager = false } = {}) {
  const { images = {} } = product;
  const alt = pickText(product, 'imageAlt') || pickText(product, 'name');
  const loadAttrs = eager
    ? 'loading="eager" fetchpriority="high" decoding="async"'
    : 'loading="lazy" decoding="async"';
  const variant = product.category === 'drinks' ? 'product__media--frame' : 'product__media--blend';

  let inner;
  if (images.base && Array.isArray(images.widths) && images.widths.length) {
    const srcset = (ext) => images.widths.map((w) => `${esc(images.base)}-${w}.${ext} ${w}w`).join(', ');
    inner = `
      <picture>
        <source type="image/avif" srcset="${srcset('avif')}" sizes="${MEDIA_SIZES}" />
        <source type="image/webp" srcset="${srcset('webp')}" sizes="${MEDIA_SIZES}" />
        <img class="product__img" src="${esc(images.fallback)}" alt="${esc(alt)}"
          width="${images.w || 1280}" height="${images.h || 1280}" ${loadAttrs} />
      </picture>`;
  } else {
    const fallback = images.fallback || images.desktop || images.tablet || images.mobile;
    if (fallback) {
      inner = `<picture><img class="product__img" src="${esc(fallback)}" alt="${esc(alt)}" width="1200" height="900" ${loadAttrs} /></picture>`;
    } else {
      return `
        <div class="product__media product__media--placeholder tx tx-grain" role="img" aria-label="${esc(alt)}">
          <span class="label label--muted product__media-note">${esc(str('menu.placeholder'))}</span>
        </div>`;
    }
  }

  return `<div class="product__media ${variant}"><div class="product__media-inner">${inner}</div></div>`;
}

function badgesMarkup(product) {
  const badges = [];
  if (product.new) badges.push(`<span class="product__badge product__badge--new">${esc(str('menu.badgeNew'))}</span>`);
  if (product.spicy)
    badges.push(
      `<span class="product__badge product__badge--spicy"><svg class="icon icon--sm icon--flame" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c2.6 3 4.9 5.7 4.9 9.2a4.9 4.9 0 0 1-9.8 0c0-1.5.5-2.9 1.4-4.1.4 1 1 1.7 1.9 2.3-.2-2.6.4-5.2 1.6-7.4Z"/></svg>${esc(str('menu.badgeSpicy'))}</span>`
    );
  if (product.featured)
    badges.push(`<span class="product__badge product__badge--featured">${esc(str('menu.badgeFeatured'))}</span>`);
  if (product.available === false)
    badges.push(`<span class="product__badge product__badge--off">${esc(str('menu.unavailable'))}</span>`);
  return badges.length ? `<div class="product__badges" data-pc>${badges.join('')}</div>` : '';
}

function metaMarkup(product) {
  const bits = [];
  if (product.calories != null) bits.push(`${product.calories} ${esc(str('menu.calories'))}`);
  if (product.prepTime) bits.push(`${esc(product.prepTime)} ${esc(str('menu.prepTime'))}`);
  return bits.length ? `<p class="product__meta" data-pc>${bits.join(' · ')}</p>` : '';
}

/**
 * Heat ladder (Bible §10) — capability shipped dark: renders ONLY when a
 * product carries an integer `heatLevel` 1–5 in menu.json. No product does
 * today, so nothing renders; assigning levels is a data decision, not code.
 */
function heatMarkup(product) {
  const level = product.heatLevel;
  if (!Number.isInteger(level) || level < 1) return '';
  const lvl = Math.min(level, 5);
  const dots = Array.from(
    { length: 5 },
    (_, i) => `<span class="product__heat-dot${i < lvl ? ' is-lit' : ''}" aria-hidden="true"></span>`
  ).join('');
  return `
    <div class="product__heat${lvl >= 5 ? ' product__heat--inferno' : ''}" data-pc
      role="img" aria-label="${esc(str('menu.heat'))} ${lvl}/5">${dots}</div>`;
}

function pickList(product, base) {
  const lang = document.documentElement.lang;
  const primary = lang === 'ar' ? product[`${base}Ar`] : product[`${base}En`];
  const fallback = lang === 'ar' ? product[`${base}En`] : product[`${base}Ar`];
  return (primary?.length ? primary : fallback) || [];
}

export function renderProduct(product, category, { eager = false, scene = 'stacked', index = 0, total = 0 } = {}) {
  scene = SCENES.has(scene) ? scene : 'stacked';
  const name = pickText(product, 'name');
  const subtitle = pickText(product, 'subtitle');
  const description = pickText(product, 'description');
  const ingredientsList = pickList(product, 'ingredients');
  const catName = pickText(category, 'name');
  const fav = isFavorite(product.id);
  const unavailable = product.available === false;

  const article = document.createElement('article');
  article.className = `product product--scene-${scene} product--accent-${esc(product.accent)}`;
  article.id = `product-${product.id}`;
  article.dataset.category = category.id;
  article.dataset.productId = product.id;
  article.dataset.scene = scene;
  article.setAttribute('aria-labelledby', `product-title-${product.id}`);

  // Decorative giant name behind the product (desktop only, aria-hidden).
  const ghost =
    scene === 'stacked' || scene === 'split' || scene === 'twin'
      ? `<span class="product__ghost" aria-hidden="true">${esc(name)}</span>`
      : '';

  // Editorial index — decorative plate numeral (aria-hidden, absolute; never
  // part of the reading order). Drinks grid stays clean without it.
  const editorialIndex =
    index && scene !== 'drink'
      ? `<span class="product__index" aria-hidden="true">${String(index).padStart(2, '0')}</span>`
      : '';
  const counter = index && total && scene !== 'drink' ? `<span class="product__cat-count">${String(index).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>` : '';

  article.innerHTML = `
    ${ghost}
    ${editorialIndex}
    ${mediaMarkup(product, { eager })}
    <div class="product__content">
      <span class="label product__cat" data-pc>${esc(catName)}${counter}</span>
      <h3 class="product-name product__title" id="product-title-${product.id}" data-pc>${esc(name)}</h3>
      ${subtitle ? `<p class="product__subtitle" data-pc>${esc(subtitle)}</p>` : ''}
      ${description ? `<p class="body-copy product__desc" data-pc>${esc(description)}</p>` : ''}
      ${
        ingredientsList.length
          ? `<ul class="product__ingredients" data-pc>${ingredientsList.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`
          : ''
      }
      ${heatMarkup(product)}
      ${badgesMarkup(product)}
      ${metaMarkup(product)}
      ${
        product.price != null
          ? `<p class="price product__price" data-pc>${esc(String(product.price))}<span class="price__currency">${esc(product.currency)}</span></p>`
          : ''
      }
      <div class="product__actions" data-pc>
        <button class="btn btn--primary product__order magnetic" type="button" data-order ${unavailable ? 'disabled' : ''}>
          <span>${esc(str('menu.order'))}</span>
          <svg class="icon icon--sm product__order-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M13 5l7 7-7 7"/></svg>
        </button>
        <button class="btn btn--secondary btn--icon product__fav${fav ? ' is-fav' : ''}" type="button" data-fav
          aria-pressed="${fav}" aria-label="${esc(str(fav ? 'menu.favRemove' : 'menu.favAdd'))}">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5S4 15.3 4 9.9A4.4 4.4 0 0 1 8.4 5.5c1.5 0 2.9.8 3.6 2a4.2 4.2 0 0 1 3.6-2A4.4 4.4 0 0 1 20 9.9c0 5.4-8 10.6-8 10.6Z"/></svg>
        </button>
        <button class="btn btn--secondary btn--icon product__share" type="button" data-share
          aria-label="${esc(str('menu.share'))}">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="2.6"/><circle cx="17.5" cy="5.5" r="2.6"/><circle cx="17.5" cy="18.5" r="2.6"/><path d="m8.4 10.8 6.8-4M8.4 13.2l6.8 4"/></svg>
        </button>
      </div>
    </div>`;

  return article;
}
