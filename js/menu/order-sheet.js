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
import { track } from '../core/events.js';

const PLATFORM_KEY = 'flip-platform';

function rememberedPlatform() {
  try {
    return localStorage.getItem(PLATFORM_KEY);
  } catch {
    return null;
  }
}

let root = null;
let lastOpener = null;
let lenisRef = null;
let keyHandler = null;
let closeTimer = 0;

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
      <hr class="heat-rule order-sheet__rule" aria-hidden="true" />
      <div class="order-sheet__head">
        <div class="order-sheet__heading">
          <span class="label order-sheet__kicker"></span>
          <h3 class="product-name order-sheet__title" id="order-sheet-title"></h3>
        </div>
        <button class="btn btn--ghost btn--icon order-sheet__close" type="button" data-close>
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="order-sheet__body"></div>
    </div>`;
  document.body.appendChild(root);

  root.addEventListener('click', (e) => {
    const platform = e.target.closest('.order-sheet__platform');
    if (platform) {
      const configured = platform.hasAttribute('href');
      track('delivery_platform_click', {
        platform: platform.dataset.platform || 'unknown',
        product: root.dataset.productId || null,
        configured,
      });
      if (!configured) {
        // No real URL yet (production decision 2026-07-23): keep the platform
        // visible and answer the tap honestly. No navigation, nothing faked.
        announceSoon();
        return;
      }
      // Real outbound tap — remember the choice; the link navigates.
      try {
        localStorage.setItem(PLATFORM_KEY, platform.dataset.platform || '');
      } catch {
        /* non-fatal */
      }
      return;
    }
    if (e.target.closest('[data-close]')) closeOrderSheet();
  });
}

/** Approved "link coming soon" message via the shared status toast (aria-live). */
let soonTimer = 0;
function announceSoon() {
  const status = document.getElementById('share-status');
  if (!status) return;
  status.textContent = str('menu.linkSoon');
  clearTimeout(soonTimer);
  soonTimer = setTimeout(() => {
    status.textContent = '';
  }, 3500);
}

export function initOrderSheet({ lenis }) {
  lenisRef = lenis;
  if (!root) build();
}

export function openOrderSheet(product, opener, { links: linksOverride } = {}) {
  if (!root) build();
  lastOpener = opener || document.activeElement;

  // Brand-level open (sticky bar): no product context — the wordmark leads.
  const title = product ? pickText(product, 'name') : 'FLIP BURGER';
  root.dataset.productId = product?.id || '';
  root.querySelector('.order-sheet__kicker').textContent = str('menu.orderVia');
  root.querySelector('.order-sheet__title').textContent = title;
  root.querySelector('.order-sheet__close').setAttribute('aria-label', str('menu.close'));

  // All three platforms always render (production decision 2026-07-23).
  // A platform with a real URL is a link; one without is a same-styled button
  // whose tap answers with the approved "link coming soon" message. URLs are
  // never invented; the remembered platform — a real prior tap — moves to the
  // front with an honest «مرة ثانية؟» tag.
  const configured = new Map(
    (linksOverride ?? (product ? activeOrderLinks(product) : [])).map((l) => [l.id, l.url])
  );
  let platforms = ['keeta', 'hungerstation', 'jahez'];
  const remembered = rememberedPlatform();
  if (remembered && configured.has(remembered)) {
    platforms = [remembered, ...platforms.filter((id) => id !== remembered)];
  }

  track('order_sheet_open', { product: product?.id || null, links: configured.size });

  const body = root.querySelector('.order-sheet__body');
  body.innerHTML = `
    <div class="order-sheet__platforms">
      ${platforms
        .map((id) => {
          const url = configured.get(id);
          const label = `<span>${esc(str(`menu.platforms.${id}`) || id)}</span>`;
          const again =
            id === remembered && url
              ? `<span class="order-sheet__again">${esc(str('menu.orderAgain'))}</span>`
              : '';
          return url
            ? `<a class="btn btn--primary order-sheet__platform${id === remembered ? ' is-remembered' : ''}"
                 href="${esc(url)}" data-platform="${esc(id)}" target="_blank" rel="noopener noreferrer">${label}${again}</a>`
            : `<button class="btn btn--primary order-sheet__platform" type="button" data-platform="${esc(id)}">${label}</button>`;
        })
        .join('')}
    </div>`;

  clearTimeout(closeTimer);
  root.hidden = false;
  // Entrance runs off CSS transitions keyed to .is-open (token durations, so
  // reduced-motion collapses them to instant). Double-rAF guarantees the
  // hidden→visible style flush lands before the class flips.
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-open')));
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
  if (!root || root.hidden || !root.classList.contains('is-open')) return;
  // Exit is faster than entry (Motion Bible law): the un-classed state is the
  // fast-exit transition; `hidden` lands after it so the slide-down is seen.
  root.classList.remove('is-open');
  document.documentElement.classList.remove('sheet-open');
  document.removeEventListener('keydown', keyHandler);
  lenisRef?.start();
  lastOpener?.focus?.();
  lastOpener = null;
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    root.hidden = true;
  }, 220);
}

export function isOrderSheetOpen() {
  return !!root && !root.hidden && root.classList.contains('is-open');
}
