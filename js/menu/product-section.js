/**
 * Reusable product section renderer.
 *
 * MOBILE DOM ORDER — ABSOLUTE RULE (identical for every product):
 *   1 image · 2 category label · 3 name · 4 subtitle · 5 description ·
 *   6 ingredients · 7 price · 8 order CTA · 9 favorite/share controls
 * The markup is authored in exactly that order; desktop layout variants
 * (image-right / image-left / centered from menu.json) re-place the media
 * via grid-template-areas only — never via `order`.
 *
 * Every optional field degrades: empty → the node is not rendered at all.
 */

import { str, pickText } from '../core/i18n.js';
import { isFavorite } from './favorites.js';

function esc(text) {
  const div = document.createElement('div');
  div.textContent = text ?? '';
  return div.innerHTML;
}

const LAYOUTS = new Set(['image-right', 'image-left', 'centered']);

const MEDIA_SIZES = '(min-width: 1024px) 44vw, 92vw';

function mediaMarkup(product, { eager = false } = {}) {
  const { images = {} } = product;
  const alt = pickText(product, 'imageAlt') || pickText(product, 'name');
  const loadAttrs = eager
    ? 'loading="eager" fetchpriority="high" decoding="async"'
    : 'loading="lazy" decoding="async"';

  // Category treatment: dark food photos blend into the section; white
  // drink photos sit inside a framed dark plate (image pixels untouched).
  const variant = product.category === 'drinks' ? 'product__media--frame' : 'product__media--blend';

  // Responsive set form (Part 5+): { base, widths[], fallback, w, h }
  // → AVIF srcset + WebP srcset + JPG fallback.
  if (images.base && Array.isArray(images.widths) && images.widths.length) {
    const srcset = (ext) => images.widths.map((w) => `${esc(images.base)}-${w}.${ext} ${w}w`).join(', ');
    return `
      <div class="product__media ${variant}">
        <picture>
          <source type="image/avif" srcset="${srcset('avif')}" sizes="${MEDIA_SIZES}" />
          <source type="image/webp" srcset="${srcset('webp')}" sizes="${MEDIA_SIZES}" />
          <img src="${esc(images.fallback)}" alt="${esc(alt)}"
            width="${images.w || 1280}" height="${images.h || 1280}" ${loadAttrs} />
        </picture>
      </div>`;
  }

  // Legacy flat form (Part 4 schema): explicit per-breakpoint files.
  const fallback = images.fallback || images.desktop || images.tablet || images.mobile;
  if (fallback) {
    const sources = [
      images.desktop && `<source media="(min-width: 1024px)" srcset="${esc(images.desktop)}" />`,
      images.tablet && `<source media="(min-width: 768px)" srcset="${esc(images.tablet)}" />`,
      images.mobile && `<source srcset="${esc(images.mobile)}" />`,
    ]
      .filter(Boolean)
      .join('');
    return `
      <div class="product__media">
        <picture>${sources}
          <img src="${esc(fallback)}" alt="${esc(alt)}" width="1200" height="900" ${loadAttrs} />
        </picture>
      </div>`;
  }

  // Premium neutral placeholder — no fake food, no broken image icons.
  return `
    <div class="product__media product__media--placeholder tx tx-grain" role="img" aria-label="${esc(alt)}">
      <span class="label label--muted product__media-note">${esc(str('menu.placeholder'))}</span>
    </div>`;
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
  return badges.length ? `<div class="product__badges">${badges.join('')}</div>` : '';
}

function metaMarkup(product) {
  const bits = [];
  if (product.calories != null) bits.push(`${product.calories} ${esc(str('menu.calories'))}`);
  if (product.prepTime) bits.push(`${esc(product.prepTime)} ${esc(str('menu.prepTime'))}`);
  return bits.length ? `<p class="product__meta">${bits.join(' · ')}</p>` : '';
}

function pickList(product, base) {
  const lang = document.documentElement.lang;
  const primary = lang === 'ar' ? product[`${base}Ar`] : product[`${base}En`];
  const fallback = lang === 'ar' ? product[`${base}En`] : product[`${base}Ar`];
  return (primary?.length ? primary : fallback) || [];
}

export function renderProduct(product, category, { eager = false } = {}) {
  const name = pickText(product, 'name');
  const subtitle = pickText(product, 'subtitle');
  const description = pickText(product, 'description');
  const ingredientsList = pickList(product, 'ingredients');
  const catName = pickText(category, 'name');
  const layout = LAYOUTS.has(product.layout) ? product.layout : 'centered';
  const fav = isFavorite(product.id);
  const unavailable = product.available === false;

  const article = document.createElement('article');
  article.className = `product product--${layout} product--bg-${esc(product.background)} product--accent-${esc(product.accent)}`;
  article.id = `product-${product.id}`;
  article.dataset.category = category.id;
  article.dataset.productId = product.id;
  article.setAttribute('aria-labelledby', `product-title-${product.id}`);

  article.innerHTML = `
    ${mediaMarkup(product, { eager })}
    <div class="product__content">
      <span class="label product__cat">${esc(catName)}</span>
      <h3 class="product-name product__title" id="product-title-${product.id}">${esc(name)}</h3>
      ${subtitle ? `<p class="product__subtitle">${esc(subtitle)}</p>` : ''}
      ${description ? `<p class="body-copy product__desc">${esc(description)}</p>` : ''}
      ${
        ingredientsList.length
          ? `<ul class="product__ingredients">${ingredientsList.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`
          : ''
      }
      ${badgesMarkup(product)}
      ${metaMarkup(product)}
      ${
        product.price != null
          ? `<p class="price product__price">${esc(String(product.price))}<span class="price__currency">${esc(product.currency)}</span></p>`
          : ''
      }
      <div class="product__actions">
        <button class="btn btn--primary product__order" type="button" data-order ${unavailable ? 'disabled' : ''}>
          ${esc(str('menu.order'))}
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
