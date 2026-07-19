/**
 * Product sharing: Web Share API when available, clipboard fallback with an
 * announced (aria-live) confirmation.
 */

import { str } from '../core/i18n.js';

let statusEl = null;
let statusTimer = 0;

function announce(message) {
  if (!statusEl) statusEl = document.getElementById('share-status');
  if (!statusEl) return;
  statusEl.textContent = message;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    statusEl.textContent = '';
  }, 3500);
}

export function productUrl(productId) {
  const url = new URL(window.location.href);
  url.hash = `product-${productId}`;
  return url.toString();
}

export async function shareProduct(product, title) {
  const url = productUrl(product.id);

  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return;
    } catch (err) {
      if (err?.name === 'AbortError') return; // user closed the share sheet
      // fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    announce(str('menu.copied'));
  } catch {
    // Last resort: legacy execCommand copy via a temp input.
    const input = document.createElement('input');
    input.value = url;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    input.remove();
    announce(str(ok ? 'menu.copied' : 'menu.shareFail'));
  }
}
