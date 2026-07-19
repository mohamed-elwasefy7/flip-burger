/**
 * Hero: entrance timeline (chained off the boot promise), desktop-only
 * parallax, and a small ember particle field inside the visual stage.
 * Every motion path is gated on prefers-reduced-motion — reduced users get
 * static, fully visible content (CSS also forces [data-reveal] visible).
 */

const EMBER_COUNT = 8;

function cssVarSeconds(name) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const ms = parseFloat(raw);
  return raw.endsWith('ms') ? ms / 1000 : ms;
}

function heroIntro(gsap) {
  const reveal = cssVarSeconds('--motion-reveal') || 0.85;
  const pick = (name) => document.querySelector(`[data-reveal="${name}"]`);

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo(pick('mark'), { autoAlpha: 0, y: 26, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: reveal })
    .fromTo(pick('slogan'), { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: reveal }, '-=55%')
    .fromTo(pick('support'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: reveal * 0.8 }, '-=60%')
    .fromTo(
      pick('stage'),
      { autoAlpha: 0, y: 40, scale: 0.97 },
      { autoAlpha: 1, y: 0, scale: 1, duration: reveal * 1.15 },
      '-=55%'
    )
    .fromTo(pick('ctas'), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: reveal * 0.75 }, '-=70%')
    .fromTo(pick('cue'), { autoAlpha: 0 }, { autoAlpha: 1, duration: reveal * 0.6 }, '-=40%');

  return tl;
}

function heroParallax(gsap, ScrollTrigger) {
  const mm = gsap.matchMedia();

  mm.add(
    {
      desktop: '(min-width: 1024px)',
      motionOK: '(prefers-reduced-motion: no-preference)',
    },
    (ctx) => {
      if (!(ctx.conditions.desktop && ctx.conditions.motionOK)) return;

      const scrub = {
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      };

      gsap.to('.hero__stage', { y: -46, ...scrub });
      gsap.to('.hero__glow', { y: -80, ...scrub });
      gsap.to('.hero__smoke--a', { y: -60, ...scrub });
      gsap.to('.hero__smoke--b', { y: -30, ...scrub });
    }
  );
}

function spawnEmbers(gsap) {
  const host = document.getElementById('hero-embers');
  if (!host) return;

  for (let i = 0; i < EMBER_COUNT; i++) {
    const ember = document.createElement('span');
    ember.className = 'ember';
    ember.style.insetInlineStart = `${8 + Math.random() * 84}%`;
    const scale = 0.5 + Math.random() * 0.9;

    gsap.to(ember, {
      y: () => -(120 + Math.random() * 160),
      x: () => (Math.random() - 0.5) * 50,
      opacity: 0,
      scale,
      duration: 3 + Math.random() * 3.5,
      delay: Math.random() * 4,
      repeat: -1,
      ease: 'sine.out',
      onRepeat() {
        ember.style.insetInlineStart = `${8 + Math.random() * 84}%`;
      },
      onStart() {
        gsap.set(ember, { opacity: 0.9 });
      },
    });

    host.appendChild(ember);
  }
}

export function initHero({ gsap, ScrollTrigger, bootDone, reduceMotion }) {
  if (reduceMotion) return; // CSS keeps everything visible and static

  bootDone.then(() => {
    if (document.hidden) {
      // rAF is suspended in hidden tabs — show final states synchronously
      // instead of queuing a timeline that cannot advance.
      gsap.set('.hero [data-reveal]', { autoAlpha: 1, y: 0, scale: 1 });
      spawnEmbers(gsap);
      return;
    }
    heroIntro(gsap);
    spawnEmbers(gsap);
  });

  heroParallax(gsap, ScrollTrigger);
}
