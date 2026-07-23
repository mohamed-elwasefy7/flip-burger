/**
 * Hero cinematic sequence: entrance timeline (chained off boot), scroll-linked
 * burger scale + layered parallax, and a canvas ember field. All motion gated
 * on prefers-reduced-motion / hidden tab (content stays visible either way).
 */

import { createEmberField, initMagnetic } from '../core/fx.js';

const q = (sel) => document.querySelector(sel);
const hero = (name) => document.querySelector(`[data-hero="${name}"]`);

function intro(gsap) {
  const words = document.querySelectorAll('.hero__word');
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  tl.set('.hero__inner', { autoAlpha: 1 })
    .from(hero('seal'), { autoAlpha: 0, scale: 0.6, y: 20, duration: 0.7 })
    .from(
      words,
      { yPercent: 115, autoAlpha: 0, duration: 1.1, stagger: 0.12 },
      '-=0.35'
    )
    .from(
      hero('stage'),
      { autoAlpha: 0, scale: 1.14, clipPath: 'inset(6% 4% 6% 4%)', duration: 1.3, ease: 'power4.out' },
      '-=0.9'
    )
    .from(hero('slogan'), { autoAlpha: 0, yPercent: 60, duration: 0.9 }, '-=0.9')
    .from(hero('support'), { autoAlpha: 0, y: 22, duration: 0.7 }, '-=0.6')
    .from(hero('ctas'), { autoAlpha: 0, y: 20, duration: 0.6 }, '-=0.45')
    .from(q('.hero__cue'), { autoAlpha: 0, duration: 0.5 }, '-=0.2');

  return tl;
}

function parallax(gsap, ScrollTrigger) {
  const mm = gsap.matchMedia();
  mm.add(
    { desktop: '(min-width: 1024px)', ok: '(prefers-reduced-motion: no-preference)' },
    (c) => {
      if (!(c.conditions.desktop && c.conditions.ok)) return;
      const scrub = (extra = {}) => ({
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, ...extra },
      });
      // Burger surges forward and drifts up as the hero scrolls away.
      gsap.to(hero('stage'), { scale: 1.18, yPercent: -16, ...scrub() });
      gsap.to('.hero__wordmark', { yPercent: -30, letterSpacing: '0.12em', ...scrub() });
      gsap.to(hero('slogan'), { yPercent: -60, autoAlpha: 0.2, ...scrub() });
      gsap.to('.hero__glow', { yPercent: -20, scale: 1.2, ...scrub() });
      gsap.to('.fx-smoke--a', { yPercent: -40, ...scrub() });
      gsap.to('.fx-smoke--b', { yPercent: -24, ...scrub() });
      gsap.to('.hero__inner', { autoAlpha: 0, ...scrub({ start: 'top top', end: '70% top' }) });
    }
  );
}

/** Returning-visitor reveal: one weighted rise, no staged theater. */
function fastReveal(gsap) {
  gsap.fromTo(
    '.hero__inner',
    { autoAlpha: 0, y: 14 },
    { autoAlpha: 1, y: 0, duration: 0.45, ease: 'expo.out' }
  );
}

const IGNITED_KEY = 'flip-ignited';

export function initHero({ gsap, ScrollTrigger, bootDone, reduceMotion }) {
  const ember = createEmberField(document.getElementById('hero-embers'), { gsap, reduceMotion });
  initMagnetic({ gsap, reduceMotion, root: document.querySelector('.hero') });

  if (reduceMotion) return; // content visible via CSS; embers already skipped

  let ignited = false;
  try {
    ignited = sessionStorage.getItem(IGNITED_KEY) === '1';
  } catch {
    /* private mode — treat as first visit */
  }

  bootDone.then(() => {
    if (document.hidden) {
      gsap.set('.hero__inner, [data-hero]', { clearProps: 'all', autoAlpha: 1 });
      return;
    }
    // The full cinematic ignition plays once per session; a returning visitor
    // gets the hero instantly-ish — repetition turns theater into a toll booth.
    if (ignited) {
      fastReveal(gsap);
      return;
    }
    try {
      sessionStorage.setItem(IGNITED_KEY, '1');
    } catch {
      /* non-fatal */
    }
    intro(gsap);
  });

  parallax(gsap, ScrollTrigger);
  void ember;
}
