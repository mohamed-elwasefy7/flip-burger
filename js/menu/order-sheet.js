/**
 * Order bottom sheet (single instance):
 *  - no platform links  → localized "ordering links coming soon"
 *  - one platform       → that platform only
 *  - multiple platforms → platform selector
 * Focus moves in on open and returns to the opener on close.
 * Esc / overlay click / close button all dismiss. Lenis pauses while open.
 */

import { str, pickText } from '../core/i18n.js';
import { activeOrderLinks } from './menu-loader.js';

let root = null;
let lastOpener = null;
let lenisRef = null;
let keyHandler = null;

function esc(text) {
  const div = document.createElement('div');
  div.textContent = text ?? '';
  return div.innerHTML;
}

function build() {
  root = document.createElement('div');
  root.className = 'order-sheet';
  root.hidden = true;
  root.innerHTML = `
    <div class="overlay order-sheet__overlay" data-close></div>
    <div class="sheet order-sheet__panel" role="dialog" aria-modal="true" aria-labelledby="order-sheet-title">
      <div class="sheet__handle" aria-hidden="true"></div>
      <div class="order-sheet__head">
        <h3 class="product-name order-sheet__title" id="order-sheet-title"></h3>
        <button class="btn btn--ghost btn--icon order-sheet__close" type="button" data-close>
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="order-sheet__body"></div>
    </div>`;
  document.body.appendChild(root);

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeOrderSheet();
  });
}

export function initOrderSheet({ lenis }) {
  lenisRef = lenis;
  if (!root) build();
}

export function openOrderSheet(product, opener) {
  if (!root) build();
  lastOpener = opener || document.activeElement;

  const title = pickText(product, 'name');
  root.querySelector('.order-sheet__title').textContent = `${str('menu.orderVia')} — ${title}`;
  root.querySelector('.order-sheet__close').setAttribute('aria-label', str('menu.close'));

  const links = activeOrderLinks(product);
  const body = root.querySelector('.order-sheet__body');

  if (links.length === 0) {
    body.innerHTML = `
      <p class="order-sheet__empty-title body-copy body-copy--strong">${esc(str('menu.noLinks'))}</p>
      <p class="order-sheet__empty-hint body-copy">${esc(str('menu.noLinksHint'))}</p>`;
  } else {
    body.innerHTML = `
      <div class="order-sheet__platforms">
        ${links
          .map(
            (l) => `
          <a class="btn btn--primary order-sheet__platform" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">
            ${esc(str(`menu.platforms.${l.id}`) || l.id)}
          </a>`
          )
          .join('')}
      </div>`;
  }

  root.hidden = false;
  document.documentElement.classList.add('sheet-open');
  lenisRef?.stop();

  keyHandler = (e) => {
    if (e.key === 'Escape') {
      closeOrderSheet();
    } else if (e.key === 'Tab') {
      trapTab(e);
    }
  };
  document.addEventListener('keydown', keyHandler);

  (root.querySelector('.order-sheet__platform') || root.querySelector('.order-sheet__close')).focus();
}

/** Keep Tab focus cycling inside the dialog panel (aria-modal contract). */
function trapTab(event) {
  const panel = root.querySelector('.order-sheet__panel');
  const focusable = panel.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && (active === first || !panel.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
    event.preventDefault();
    first.focus();
  }
}

export function closeOrderSheet() {
  if (!root || root.hidden) return;
  root.hidden = true;
  document.documentElement.classList.remove('sheet-open');
  document.removeEventListener('keydown', keyHandler);
  lenisRef?.start();
  lastOpener?.focus?.();
  lastOpener = null;
}

export function isOrderSheetOpen() {
  return !!root && !root.hidden;
}
