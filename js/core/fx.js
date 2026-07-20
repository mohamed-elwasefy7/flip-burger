/**
 * Shared visual FX: a lightweight canvas ember field and desktop magnetic
 * buttons. Both are no-ops under reduced motion. One shared rAF via the GSAP
 * ticker; the ember field pauses when its host scrolls out of view.
 */

/**
 * Rising ember particle field painted onto a <canvas class="fx-embers">.
 * Count scales with viewport and the category's --cat-ember multiplier.
 * @returns {{ dispose(): void, setIntensity(mult:number): void }}
 */
export function createEmberField(canvas, { gsap, reduceMotion }) {
  if (!canvas || reduceMotion) return { dispose() {}, setIntensity() {} };

  const ctx = canvas.getContext('2d', { alpha: true });
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const BASE = mobile ? 7 : 16;
  let intensity = 1;
  let particles = [];
  let w = 0;
  let h = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let visible = true;

  const HUES = ['246, 168, 28', '226, 88, 34', '201, 45, 28'];

  function resize() {
    const r = canvas.getBoundingClientRect();
    w = r.width;
    h = r.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function make(initial) {
    return {
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + Math.random() * 20,
      r: 0.6 + Math.random() * 1.8,
      vy: 0.25 + Math.random() * 0.75,
      vx: (Math.random() - 0.5) * 0.35,
      life: 0,
      ttl: 180 + Math.random() * 220,
      hue: HUES[(Math.random() * HUES.length) | 0],
    };
  }

  function seed() {
    const target = Math.max(3, Math.round(BASE * intensity));
    particles = Array.from({ length: target }, () => make(true));
  }

  function tick() {
    if (!visible || !w) return;
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.life++;
      p.y -= p.vy;
      p.x += p.vx + Math.sin(p.life * 0.03) * 0.2;
      const fade = 1 - p.life / p.ttl;
      if (p.y < -10 || fade <= 0) Object.assign(p, make(false));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue}, ${Math.max(0, fade) * 0.85})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${p.hue}, 0.6)`;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  const io = new IntersectionObserver(
    ([e]) => { visible = e.isIntersecting; },
    { threshold: 0 }
  );
  io.observe(canvas);

  const onResize = debounce(resize, 200);
  window.addEventListener('resize', onResize, { passive: true });
  resize();
  gsap.ticker.add(tick);

  return {
    dispose() {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', onResize);
      io.disconnect();
    },
    setIntensity(mult) {
      intensity = mult;
      seed();
    },
  };
}

/** Desktop-only magnetic pull toward the pointer on `.magnetic` elements. */
export function initMagnetic({ gsap, reduceMotion, root = document }) {
  if (reduceMotion || !window.matchMedia('(hover: hover) and (min-width: 1024px)').matches) return;

  root.querySelectorAll('.magnetic').forEach((el) => {
    const strength = 0.34;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: mx * strength, y: my * strength, duration: 0.4, ease: 'power3.out' });
    };
    const reset = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', reset);
  });
}

function debounce(fn, ms) {
  let t = 0;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}
