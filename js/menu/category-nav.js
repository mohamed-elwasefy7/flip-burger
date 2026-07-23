/**
 * Category navigation: sticky horizontal chip strip.
 * Native anchor links (#<slug>) → keyboard support for free; Lenis handles
 * the smooth travel. Active chip carries aria-current and auto-scrolls
 * into view inside the strip (never wraps, never overflows the page).
 */

import { str, pickText } from '../core/i18n.js';

let strip = null;
let activeSlug = null;

export function renderCategoryNav(mount, categories, { lenis, reduceMotion }) {
  mount.innerHTML = '';

  const nav = document.createElement('nav');
  nav.className = 'cat-nav';
  nav.setAttribute('aria-label', str('menu.catNavAria'));

  strip = document.createElement('div');
  strip.className = 'cat-nav__strip';

  for (const cat of categories) {
    const link = document.createElement('a');
    link.className = `cat-nav__chip cat-nav__chip--${cat.accent || 'flame-red'}`;
    link.href = `#${cat.slug}`;
    link.dataset.slug = cat.slug;
    link.textContent = pickText(cat, 'name');
    link.addEventListener('click', (event) => {
      const target = document.getElementById(cat.slug);
      if (!target) return;
      event.preventDefault();
      history.replaceState(null, '', `#${cat.slug}`);
      if (lenis && !reduceMotion) {
        lenis.scrollTo(target, { offset: -96, duration: 1 });
      } else {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
    strip.appendChild(link);
  }

  nav.appendChild(strip);
  mount.appendChild(nav);

  if (activeSlug) setActiveCategory(activeSlug, { updateHash: false });
}

/**
 * Favorites chip — exists only while ≥1 valid favorite is saved. Jumps to the
 * saved strip. Appending/removing a chip only changes the horizontal strip
 * (scrollable row) — zero vertical layout shift.
 */
export function setFavChip(count, { lenis, reduceMotion } = {}) {
  if (!strip) return;
  let chip = strip.querySelector('.cat-nav__chip--favs');
  if (!count) {
    chip?.remove();
    return;
  }
  if (!chip) {
    chip = document.createElement('a');
    chip.className = 'cat-nav__chip cat-nav__chip--favs';
    chip.href = '#saved-strip';
    chip.addEventListener('click', (event) => {
      const target = document.getElementById('saved-strip');
      if (!target) return; // strip appears on next render — anchor still valid
      event.preventDefault();
      if (lenis && !reduceMotion) lenis.scrollTo(target, { offset: -140, duration: 1 });
      else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    strip.prepend(chip);
  }
  chip.textContent = `♥ ${str('menu.favorites')} · ${count}`;
}

/**
 * Center the active chip inside the strip by scrolling the STRIP only.
 * Never scrollIntoView here: on an element inside a sticky container,
 * Chromium scrolls the page to the container's static layout position —
 * which yanks the viewport away from the section the user is reading.
 * Delta-based math keeps it RTL-safe.
 */
function centerChip(chip) {
  const box = chip.closest('.cat-nav__strip');
  if (!box) return;
  const sr = box.getBoundingClientRect();
  const cr = chip.getBoundingClientRect();
  const delta = cr.left + cr.width / 2 - (sr.left + sr.width / 2);
  if (Math.abs(delta) < 2) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  box.scrollBy({ left: delta, behavior: reduce ? 'auto' : 'smooth' });
}

export function setActiveCategory(slug, { updateHash = true } = {}) {
  if (!strip) return;
  activeSlug = slug;

  for (const chip of strip.querySelectorAll('.cat-nav__chip')) {
    const isActive = chip.dataset.slug === slug;
    chip.classList.toggle('is-active', isActive);
    if (isActive) {
      chip.setAttribute('aria-current', 'true');
      centerChip(chip);
    } else {
      chip.removeAttribute('aria-current');
    }
  }

  if (updateHash && slug && `#${slug}` !== window.location.hash) {
    history.replaceState(null, '', `#${slug}`);
  }
}
