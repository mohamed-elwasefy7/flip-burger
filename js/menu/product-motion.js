/**
 * Scene-aware product motion.
 *
 * One IntersectionObserver reveals each `.product` with a timeline chosen by
 * its `data-scene` — so no two scene types animate the same way. Desktop +
 * motion-OK adds restrained parallax (image drifts inside its frame, ghost
 * type counter-moves). Magnetic buttons wired here too.
 *
 * Contract preserved from the previous version: returns { dispose() }, adds
 * `.is-revealed` (CSS glow hooks), reduced-motion / hidden-tab show everything
 * instantly, transform/opacity only, will-change cleared on complete.
 */

import { initMagnetic } from '../core/fx.js';

const REVEAL = 0.9;

const media = (s) => s.querySelector('.product__media');
const items = (s) => [...s.querySelectorAll('[data-pc]')];
const ghost = (s) => s.querySelector('.product__ghost');
const img = (s) => s.querySelector('.product__img, .product__media-inner');

function markRevealed(s) {
  s.classList.add('is-revealed');
}

export function initProductMotion({ listMount, gsap, ScrollTrigger, reduceMotion }) {
  const sections = [...listMount.querySelectorAll('.product')];
  if (!sections.length) return { dispose() {} };

  initMagnetic({ gsap, reduceMotion, root: listMount });

  if (reduceMotion) {
    sections.forEach(markRevealed);
    return { dispose() {} };
  }

  const ctx = gsap.context(() => {
    const instant = document.hidden;

    for (const s of sections) {
      if (instant) {
        markRevealed(s);
        continue;
      }
      gsap.set(media(s), { autoAlpha: 0 });
      gsap.set(items(s), { autoAlpha: 0 });
      if (ghost(s)) gsap.set(ghost(s), { autoAlpha: 0 });
    }

    const reveal = (s) => {
      markRevealed(s);
      const scene = s.dataset.scene || 'stacked';
      const m = media(s);
      const its = items(s);
      const g = ghost(s);
      const finish = () => gsap.set([m, ...its, g].filter(Boolean), { clearProps: 'willChange' });
      gsap.set([m, ...its, g].filter(Boolean), { willChange: 'transform, opacity' });

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: finish });

      // Media entrance varies by scene.
      const mediaFrom = {
        stacked: { autoAlpha: 0, scale: 1.08, yPercent: 6 },
        split: { autoAlpha: 0, xPercent: 14, clipPath: 'inset(0 0 0 20%)' },
        fullbleed: { autoAlpha: 0, scale: 1.12 },
        twin: { autoAlpha: 0, scale: 1.1, yPercent: 8 },
        party: { autoAlpha: 0, scale: 1.14, clipPath: 'inset(10% 6% 10% 6%)' },
        drink: { autoAlpha: 0, y: 26 },
      }[scene] || { autoAlpha: 0, y: 24 };

      tl.fromTo(m, mediaFrom, {
        autoAlpha: 1, scale: 1, x: 0, y: 0, xPercent: 0, yPercent: 0,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: scene === 'drink' ? REVEAL * 0.7 : REVEAL * 1.25,
      });

      if (g) {
        tl.fromTo(g, { autoAlpha: 0, yPercent: scene === 'split' ? 0 : 18, xPercent: scene === 'split' ? -8 : 0 },
          { autoAlpha: 1, yPercent: 0, xPercent: 0, duration: REVEAL }, '-=85%');
      }

      // Content: staggered, direction depends on scene rhythm.
      const contentFrom =
        scene === 'split' ? { autoAlpha: 0, x: 30 }
        : scene === 'drink' ? { autoAlpha: 0, y: 16 }
        : { autoAlpha: 0, yPercent: 40 };
      tl.fromTo(
        its,
        contentFrom,
        {
          autoAlpha: 1, x: 0, y: 0, yPercent: 0,
          duration: scene === 'drink' ? REVEAL * 0.55 : REVEAL * 0.7,
          stagger: scene === 'party' ? 0.11 : scene === 'drink' ? 0.05 : 0.07,
        },
        g ? '-=70%' : '-=60%'
      );
    };

    const seen = new WeakSet();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || seen.has(e.target)) continue;
          seen.add(e.target);
          io.unobserve(e.target);
          reveal(e.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.18 }
    );
    if (!instant) sections.forEach((s) => io.observe(s));

    // Parallax — desktop + motion-OK. Food drifts inside its frame; ghost
    // counter-moves for depth. Skip drinks (calm) and placeholders.
    const mm = gsap.matchMedia();
    mm.add({ desktop: '(min-width: 1024px)', ok: '(prefers-reduced-motion: no-preference)' }, (c) => {
      if (!(c.conditions.desktop && c.conditions.ok)) return;
      for (const s of sections) {
        if (s.dataset.scene === 'drink') continue;
        const scrub = { ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: true } };
        const im = img(s);
        if (im) gsap.fromTo(im, { yPercent: -6 }, { yPercent: 6, ...scrub });
        const g = ghost(s);
        if (g) gsap.fromTo(g, { yPercent: 10 }, { yPercent: -10, ...scrub });
      }
    });

    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState !== 'complete') window.addEventListener('load', onLoad, { once: true });

    return () => {
      io.disconnect();
      window.removeEventListener('load', onLoad);
    };
  }, listMount);

  return { dispose: () => ctx.revert() };
}
