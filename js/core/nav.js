/**
 * Site navigation behavior:
 *  - elevation: transparent over the hero → dark elevated surface after ~24px
 *  - language toggle button
 *  - smooth in-page scrolling for [data-scroll-to] triggers (falls back to
 *    native jumps without Lenis / under reduced motion)
 */

import { toggleLang } from './i18n.js';

const ELEVATE_AT = 24;

export function initNav({ lenis, reduceMotion }) {
  const nav = document.getElementById('site-nav');

  if (nav) {
    const update = (y) => nav.classList.toggle('is-scrolled', y > ELEVATE_AT);
    update(window.scrollY);

    if (lenis) {
      lenis.on('scroll', ({ scroll }) => update(scroll));
    } else {
      window.addEventListener('scroll', () => update(window.scrollY), { passive: true });
    }
  }

  const langBtn = document.getElementById('lang-toggle');
  langBtn?.addEventListener('click', () => toggleLang());

  document.querySelectorAll('[data-scroll-to]').forEach((el) => {
    el.addEventListener('click', (event) => {
      const target = document.querySelector(el.dataset.scrollTo);
      if (!target) return;
      event.preventDefault();
      if (lenis && !reduceMotion) {
        lenis.scrollTo(target, { offset: -8, duration: 1.1 });
      } else {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  });
}
