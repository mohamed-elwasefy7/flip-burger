/**
 * FLIP BURGER — application entry.
 * Order matters: i18n first (paints correct language before reveal),
 * then motion engine, boot sequence, nav, and the hero chained off boot.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSmoothScroll } from './core/smooth-scroll.js';
import { initPWA } from './core/pwa.js';
import { initI18n } from './core/i18n.js';
import { track, entrySource } from './core/events.js';
import { initBoot } from './core/boot.js';
import { initNav } from './core/nav.js';
import { initHero } from './sections/hero.js';
import { initMenu } from './menu/menu-renderer.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Phase 3: Motion Bible live. Flip back to true to park all GSAP/Lenis motion
// behind the static foundation experience (kill-switch, not a redesign).
const foundationMode = false;
const motionDisabled = foundationMode || reduceMotion;

if (foundationMode) {
  document.documentElement.classList.add('phase-foundation');
}

gsap.registerPlugin(ScrollTrigger);

initI18n();

// QR / packaging fast path (Bible §42): tagged physical entries skip the
// cinematic opening and land at the menu. Bio/social (or untagged) traffic
// keeps the full hero — first impressions get the complete opening.
const FAST_SRC = new Set(['box', 'bag', 'flyer', 'story']);
const fastPath = FAST_SRC.has(entrySource());

const lenis = foundationMode ? null : initSmoothScroll(gsap, ScrollTrigger);
initPWA();

const bootDone = initBoot({ gsap, lenis, reduceMotion: motionDisabled, fastExit: fastPath });
initNav({ lenis, reduceMotion: motionDisabled });
initHero({ gsap, ScrollTrigger, bootDone, reduceMotion: motionDisabled });
initMenu({ lenis, gsap, ScrollTrigger, reduceMotion: motionDisabled, bootDone });

// Fast-path landing itself happens in the menu module (post-render, via
// honorDeepLink) — scrolling before the menu renders would clamp short.

// hero_cta events — delegated; anchors keep their native behavior.
document.querySelector('.hero__ctas')?.addEventListener('click', (e) => {
  const btn = e.target.closest('a, button');
  if (!btn) return;
  track('hero_cta', { cta: btn.classList.contains('btn--primary') ? 'explore' : 'order' });
});
