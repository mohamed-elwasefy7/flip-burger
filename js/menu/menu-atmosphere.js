/**
 * Menu ambient atmosphere — ONE gradient layer for the whole menu zone,
 * cross-faded between category moods via data-mood (CSS transitions do the
 * work; no per-section effects, no hard cuts, no randomness).
 */

let zone = null;

export function initAtmosphere(menuZone) {
  zone = menuZone;
  if (!zone || zone.querySelector('.menu-ambient')) return;

  const layer = document.createElement('div');
  layer.className = 'menu-ambient';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = '<div class="menu-ambient__red"></div><div class="menu-ambient__orange"></div>';
  zone.prepend(layer);
}

export function setMood(categoryId) {
  if (zone && zone.dataset.mood !== categoryId) {
    zone.dataset.mood = categoryId;
  }
}
