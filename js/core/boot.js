/**
 * Boot / loading screen.
 *
 * Progress is real, not theatrical — four weighted milestones:
 *   DOM ready (25%) → fonts ready (30%) → hero imagery decoded (35%)
 *   → window load (10%).
 * Timing guarantees: visible ≥ MIN_VISIBLE so the reveal never flickers,
 * hard force-exit at MAX_VISIBLE so a stalled asset can never trap the user.
 * Reduced motion: no animation — bar jumps, overlay fades out immediately.
 *
 * Returns a promise that resolves once the overlay is gone (hero intro
 * chains off it).
 */

const MIN_VISIBLE = 350;
const MAX_VISIBLE = 1800;

export function initBoot({ gsap, lenis, reduceMotion, fastExit = false }) {
  const overlay = document.getElementById('boot');
  const bar = document.getElementById('boot-bar');
  if (!overlay || !bar) return Promise.resolve();

  document.documentElement.classList.add('is-booting');
  lenis?.stop();

  let progress = 0;
  const setProgress = (value) => {
    progress = Math.max(progress, Math.min(1, value));
    if (reduceMotion) {
      bar.style.width = `${progress * 100}%`;
    } else {
      gsap.to(bar, {
        width: `${progress * 100}%`,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  // --- milestones -------------------------------------------------------
  // Gate the exit on what the hero actually needs to look complete on reveal:
  // the two eager hero images (badge + flames) decoded, DOM ready, and fonts
  // settled. NOT window `load` — that would wait on every eager byte and push
  // LCP out for no visual benefit (it stays a progress-bar milestone only).
  const heroAssets = Promise.allSettled(
    ['hero-badge', 'hero-flames-img']
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .map((img) => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()))
  );

  const domReady =
    document.readyState === 'loading'
      ? new Promise((r) => document.addEventListener('DOMContentLoaded', r, { once: true }))
      : Promise.resolve();

  const winLoad =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise((r) => window.addEventListener('load', r, { once: true }));

  let done = 0;
  const bump = (weight) => {
    done += weight;
    setProgress(done);
  };

  domReady.then(() => bump(0.3));
  document.fonts.ready.then(() => bump(0.3));
  heroAssets.then(() => bump(0.4));
  winLoad.then(() => setProgress(1));

  const allLoaded = Promise.all([domReady, document.fonts.ready, heroAssets]);
  const forceExit = new Promise((r) => setTimeout(r, MAX_VISIBLE));
  // QR fast path (?src=box|bag|flyer|story): a returning customer holding the
  // box — no minimum-dwell theater, exit the moment assets are ready.
  const minTime = fastExit ? Promise.resolve() : new Promise((r) => setTimeout(r, MIN_VISIBLE));

  // --- exit -------------------------------------------------------------
  return Promise.race([Promise.all([allLoaded, minTime]), forceExit]).then(
    () =>
      new Promise((resolve) => {
        setProgress(1);

        let unlocked = false;
        let watchdog = 0;
        const unlock = () => {
          if (unlocked) return;
          unlocked = true;
          clearTimeout(watchdog);
          document.documentElement.classList.remove('is-booting');
          lenis?.start();
          overlay.remove();
          resolve();
        };

        // Animation depends on rAF, which browsers suspend in hidden tabs —
        // never let the exit wait on a frame that may not come. The QR fast
        // path also skips the curtain: instant unlock, no theater.
        if (reduceMotion || document.hidden || fastExit) {
          unlock();
          return;
        }

        const tl = gsap
          .timeline({ onComplete: unlock })
          .to(bar.parentElement, { autoAlpha: 0, duration: 0.25, ease: 'power2.out' }, 0.15)
          .to(
            overlay.querySelector('.boot-screen__logo'),
            { y: -14, scale: 1.03, duration: 0.6, ease: 'power3.inOut' },
            0
          )
          .to(overlay, { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' }, 0.3);

        // Watchdog: tab hidden mid-exit (rAF stalls) → finish instantly.
        watchdog = setTimeout(() => {
          tl.kill();
          unlock();
        }, 1600);
      })
  );
}
