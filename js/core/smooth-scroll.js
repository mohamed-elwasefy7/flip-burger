/**
 * Lenis smooth scroll, synced to the GSAP ticker so ScrollTrigger
 * and Lenis share a single rAF loop (no double-render cost).
 * Disabled entirely for users who prefer reduced motion.
 */

import Lenis from 'lenis';

export function initSmoothScroll(gsap, ScrollTrigger) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return null;

  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.1,
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
