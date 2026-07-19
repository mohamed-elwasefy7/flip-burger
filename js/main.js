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
import { initBoot } from './core/boot.js';
import { initNav } from './core/nav.js';
import { initHero } from './sections/hero.js';
import { initMenu } from './menu/menu-renderer.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

gsap.registerPlugin(ScrollTrigger);

initI18n();

const lenis = initSmoothScroll(gsap, ScrollTrigger);
initPWA();

const bootDone = initBoot({ gsap, lenis, reduceMotion });
initNav({ lenis, reduceMotion });
initHero({ gsap, ScrollTrigger, bootDone, reduceMotion });
initMenu({ lenis, gsap, ScrollTrigger, reduceMotion, bootDone });
