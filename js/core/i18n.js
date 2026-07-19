/**
 * Bilingual UI strings (ar default / en) from data/site.json — bundled at
 * build time, zero runtime fetch. Elements opt in via:
 *   data-i18n="path.to.key"       → textContent
 *   data-i18n-aria="path.to.key"  → aria-label
 * Choice persists in localStorage('flip-lang').
 */

import site from '../../data/site.json';

const STORAGE_KEY = 'flip-lang';
let activeLang = site.defaultLang;

function lookup(lang, path) {
  return path.split('.').reduce((node, key) => (node ? node[key] : undefined), site.i18n[lang]);
}

export function currentLang() {
  return activeLang;
}

export function applyLang(lang) {
  if (!site.i18n[lang]) lang = site.defaultLang;
  activeLang = lang;

  const root = document.documentElement;
  root.lang = lang;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = lookup(lang, el.dataset.i18n);
    if (typeof value === 'string') el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const value = lookup(lang, el.dataset.i18nAria);
    if (typeof value === 'string') el.setAttribute('aria-label', value);
  });

  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* private mode — non-fatal */
  }

  window.dispatchEvent(new CustomEvent('flip:langchange', { detail: { lang } }));
}

/** Current-language UI string by dot-path, e.g. str('menu.order'). */
export function str(path) {
  return lookup(activeLang, path) ?? '';
}

/**
 * Bilingual field from a data object: pickText(product, 'name') reads
 * nameAr/nameEn for the active language, falling back to the other.
 */
export function pickText(obj, base) {
  const ar = obj?.[`${base}Ar`];
  const en = obj?.[`${base}En`];
  return (activeLang === 'ar' ? ar || en : en || ar) || '';
}

export function toggleLang() {
  applyLang(activeLang === 'ar' ? 'en' : 'ar');
  return activeLang;
}

export function initI18n() {
  let saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  applyLang(saved || site.defaultLang);
}
