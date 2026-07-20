/**
 * Declarative scroll-reveal engine.
 *
 * Any element marked `data-enter="mask|rise|fade|clip|scale"` animates in
 * when it enters the viewport. Optional `data-enter-stagger` (seconds) on a
 * container staggers its `data-enter` children. One ScrollTrigger.batch per
 * call keeps instance count low.
 *
 * Returns a disposer. Reduced motion / hidden tab → everything set visible
 * instantly (CSS also forces [data-enter] visible under reduced motion).
 */

const VARIANTS = {
  mask: { from: { yPercent: 60, opacity: 0 }, to: { yPercent: 0, opacity: 1 } },
  rise: { from: { y: 42, opacity: 0 }, to: { y: 0, opacity: 1 } },
  fade: { from: { opacity: 0 }, to: { opacity: 1 } },
  clip: {
    from: { opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' },
    to: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' },
  },
  scale: { from: { opacity: 0, scale: 1.08 }, to: { opacity: 1, scale: 1 } },
};

export function initReveal({ gsap, ScrollTrigger, root = document, reduceMotion }) {
  const nodes = [...root.querySelectorAll('[data-enter]')];
  if (!nodes.length) return { dispose() {} };

  if (reduceMotion || document.hidden) {
    gsap.set(nodes, { clearProps: 'all', opacity: 1 });
    return { dispose() {} };
  }

  const ctx = gsap.context(() => {
    ScrollTrigger.batch(nodes, {
      start: 'top 85%',
      once: true,
      onEnter: (batch) => {
        for (const el of batch) {
          const variant = VARIANTS[el.dataset.enter] || VARIANTS.rise;
          const delay = parseFloat(el.dataset.enterAt) || 0;
          const kids = el.dataset.enterStagger
            ? [...el.querySelectorAll('[data-enter-child]')]
            : null;

          if (kids && kids.length) {
            gsap.fromTo(
              kids,
              variant.from,
              {
                ...variant.to,
                duration: 0.85,
                ease: 'expo.out',
                stagger: parseFloat(el.dataset.enterStagger) || 0.08,
                delay,
                onComplete: () => gsap.set(kids, { clearProps: 'willChange' }),
              }
            );
            gsap.set(el, { opacity: 1 });
          } else {
            gsap.fromTo(el, variant.from, {
              ...variant.to,
              duration: 0.9,
              ease: 'expo.out',
              delay,
              onComplete: () => gsap.set(el, { clearProps: 'willChange' }),
            });
          }
        }
      },
    });
  }, root);

  return { dispose: () => ctx.revert() };
}
