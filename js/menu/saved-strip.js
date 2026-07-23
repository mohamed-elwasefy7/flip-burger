/**
 * Saved strip — one compact utility row combining favorites (≤3) and
 * recently-viewed (≤3, local-only, ids without timestamps beyond order).
 * Renders ONLY when real local data exists; otherwise returns null and no
 * DOM is produced. Deliberately quiet: label-scale heading, small tiles,
 * no ghost type, no ambient — a utility layer, never a stage.
 */

import { str, pickText } from '../core/i18n.js';
import { favoritesList, pruneFavorites } from './favorites.js';

const RECENT_KEY = 'flip-recent';
const RECENT_CAP = 3;
const FAV_CAP = 3;

function readRecent() {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeRecent(list) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable — recents just won't persist */
  }
}

/** Record a product view: most-recent-first, deduped, hard-capped. */
export function recordView(id) {
  if (!id) return;
  const list = readRecent().filter((x) => x !== id);
  list.unshift(id);
  writeRecent(list.slice(0, RECENT_CAP));
}

export function recentList() {
  return readRecent();
}

function tile(product, kind) {
  const name = pickText(product, 'name');
  const img = product.images?.base
    ? `${product.images.base}-${Math.min(...(product.images.widths || [480]))}.webp`
    : product.images?.fallback || '';
  const a = document.createElement('a');
  a.className = `saved-strip__tile saved-strip__tile--${kind}`;
  a.href = `#product-${product.id}`;
  a.dataset.savedJump = product.id;
  a.innerHTML = `
    ${img ? `<img class="saved-strip__thumb" src="${img}" alt="" width="56" height="56" loading="lazy" decoding="async" />` : ''}
    <span class="saved-strip__name">${escapeText(name)}</span>
    ${kind === 'fav' ? '<svg class="icon icon--sm saved-strip__heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5S4 15.3 4 9.9A4.4 4.4 0 0 1 8.4 5.5c1.5 0 2.9.8 3.6 2a4.2 4.2 0 0 1 3.6-2A4.4 4.4 0 0 1 20 9.9c0 5.4-8 10.6-8 10.6Z"/></svg>' : ''}`;
  return a;
}

function escapeText(text) {
  const div = document.createElement('div');
  div.textContent = text ?? '';
  return div.innerHTML;
}

/**
 * Build the strip element, or return null when there is nothing real to show.
 * Also prunes stale ids (removed products) from both stores.
 */
export function buildSavedStrip(productIndex) {
  const validIds = new Set(productIndex.keys());

  const favs = pruneFavorites(validIds).slice(-FAV_CAP).reverse();
  const recentAll = recentList().filter((id) => validIds.has(id));
  writeRecent(recentAll.slice(0, RECENT_CAP)); // prune stale recents too
  // Never show the same product twice — favorites win the slot.
  const recent = recentAll.filter((id) => !favs.includes(id)).slice(0, RECENT_CAP);

  if (!favs.length && !recent.length) return null;

  const section = document.createElement('section');
  section.className = 'saved-strip';
  section.id = 'saved-strip';
  section.setAttribute('aria-label', str('menu.saved'));

  const heading = document.createElement('h2');
  heading.className = 'label saved-strip__heading';
  heading.textContent = str('menu.saved');
  section.appendChild(heading);

  const row = document.createElement('div');
  row.className = 'saved-strip__row';

  if (favs.length) {
    const group = document.createElement('div');
    group.className = 'saved-strip__group';
    group.innerHTML = `<span class="label label--muted saved-strip__tag">${escapeText(str('menu.favorites'))}</span>`;
    favs.forEach((id) => group.appendChild(tile(productIndex.get(id), 'fav')));
    row.appendChild(group);
  }

  if (recent.length) {
    const group = document.createElement('div');
    group.className = 'saved-strip__group';
    group.innerHTML = `<span class="label label--muted saved-strip__tag">${escapeText(str('menu.recent'))}</span>`;
    recent.forEach((id) => group.appendChild(tile(productIndex.get(id), 'recent')));
    row.appendChild(group);
  }

  section.appendChild(row);
  return section;
}
