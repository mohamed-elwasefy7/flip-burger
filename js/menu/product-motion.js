/**
 * Product reveal motion + burger parallax.
 *
 * - One IntersectionObserver drives reveals (no per-section ScrollTrigger).
 * - Four distinct category patterns — never the same stagger 29 times:
 *     burgers    masked clip reveal, 1.04→1 settle, vertical title
 *     appetizers quicker tight stagger, small rise
 *     party-box  centered scale settle
 *     drinks     calm single fade/rise
 * - Parallax: burgers only, desktop + motion-OK, transform-only scrub.
 * - will-change applied at animation start, cleared on complete.
 * - dispose() reverts everything (used before every language re-render).
 * - Reduced motion / hidden tab: content set visible instantly.
 */

const REVEAL_BASE = 0.85;

function contentChildren(section) {
  return [...section.querySelector('.product__content').children];
}

function markRevealed(section) {
  section.classList.add('is-revealed'); // CSS hook (burger glow etc.)
}

export function initProductMotion({ listMount, gsap, ScrollTrigger, reduceMotion }) {
  const sections = [...listMount.querySelectorAll('.product')];
  if (!sections.length) return { dispose() {} };

  // Reduced motion: no hiding, no timelines, glow handled statically by CSS.
  if (reduceMotion) {
    sections.forEach(markRevealed);
    return { dispose() {} };
  }

  const ctx = gsap.context(() => {
    const instant = document.hidden; // rAF suspended → show synchronously

    for (const section of sections) {
      if (instant) {
        markRevealed(section);
        continue;
      }
      gsap.set(section.querySelector('.product__media'), { autoAlpha: 0 });
      gsap.set(contentChildren(section), { autoAlpha: 0 });
    }

    const reveal = (section) => {
      markRevealed(section);
      const media = section.querySelector('.product__media');
      const items = contentChildren(section);
      const cat = section.closest('.menu-category')?.dataset.cat || 'burgers';
      const done = (els) => () => gsap.set(els, { clearProps: 'all' });

      gsap.set([media, ...items], { willChange: 'transform, opacity' });

      const tl = gsap.timeline({ onComplete: done([media, ...items]) });

      switch (cat) {
        case 'appetizers':
          tl.fromTo(
            media,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: REVEAL_BASE * 0.7, ease: 'power3.out' }
          ).fromTo(
            items,
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: REVEAL_BASE * 0.55, ease: 'power2.out', stagger: 0.06 },
            '-=55%'
          );
          break;

        case 'party-box':
          tl.fromTo(
            media,
            { autoAlpha: 0, scale: 1.06 },
            { autoAlpha: 1, scale: 1, duration: REVEAL_BASE * 1.1, ease: 'power3.out' }
          ).fromTo(
            items,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: REVEAL_BASE * 0.6, ease: 'power2.out', stagger: 0.07 },
            '-=60%'
          );
          break;

        case 'drinks':
          tl.fromTo(
            [media, ...items],
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: REVEAL_BASE * 0.55, ease: 'power2.out', stagger: 0.04 }
          );
          break;

        default: // burgers — strongest treatment
          tl.fromTo(
            media,
            { autoAlpha: 0, scale: 1.04, clipPath: 'inset(10% 6% 10% 6%)' },
            {
              autoAlpha: 1,
              scale: 1,
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: REVEAL_BASE * 1.25,
              ease: 'power3.out',
            }
          )
            .fromTo(
              items.slice(0, 2), // category label + title: vertical reveal
              { autoAlpha: 0, y: 34 },
              { autoAlpha: 1, y: 0, duration: REVEAL_BASE * 0.8, ease: 'power3.out', stagger: 0.09 },
              '-=70%'
            )
            .fromTo(
              items.slice(2),
              { autoAlpha: 0, y: 20 },
              { autoAlpha: 1, y: 0, duration: REVEAL_BASE * 0.6, ease: 'power2.out', stagger: 0.06 },
              '-=50%'
            );
      }
    };

    const seen = new WeakSet();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || seen.has(entry.target)) continue;
          seen.add(entry.target);
          io.unobserve(entry.target);
          reveal(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.2 }
    );
    if (!instant) sections.forEach((s) => io.observe(s));

    // Parallax — burgers only, desktop + motion-OK. Small, transform-only.
    const mm = gsap.matchMedia();
    mm.add(
      { desktop: '(min-width: 1024px)', motionOK: '(prefers-reduced-motion: no-preference)' },
      (mmCtx) => {
        if (!(mmCtx.conditions.desktop && mmCtx.conditions.motionOK)) return;
        for (const section of listMount.querySelectorAll('.menu-category--burgers .product')) {
          gsap.to(section.querySelector('.product__media'), {
            y: -22,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      }
    );

    // Positions can shift once late images decode.
    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState !== 'complete') {
      window.addEventListener('load', onLoad, { once: true });
    }

    return () => {
      io.disconnect();
      window.removeEventListener('load', onLoad);
    };
  }, listMount);

  return {
    dispose() {
      ctx.revert(); // kills timelines, matchMedia, ScrollTriggers, listeners
    },
  };
}
