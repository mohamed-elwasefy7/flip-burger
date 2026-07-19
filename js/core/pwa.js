/**
 * PWA wiring: service worker registration + install prompt capture.
 * SW registers only in production builds so dev never caches stale modules.
 */

export function initPWA() {
  registerServiceWorker();
  captureInstallPrompt();
}

function registerServiceWorker() {
  if (!import.meta.env.PROD) return;
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .catch((err) => console.error('[flip] SW registration failed:', err));
  });
}

/**
 * Stores the deferred beforeinstallprompt event and announces availability
 * via `flip:can-install`. The install UI (built in a later part) listens for
 * that event and calls window.flipInstallPrompt.prompt().
 */
function captureInstallPrompt() {
  window.flipInstallPrompt = null;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    window.flipInstallPrompt = event;
    window.dispatchEvent(new CustomEvent('flip:can-install'));
  });

  window.addEventListener('appinstalled', () => {
    window.flipInstallPrompt = null;
    window.dispatchEvent(new CustomEvent('flip:installed'));
  });
}
