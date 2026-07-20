/**
 * Menu ambient atmosphere — ONE layer for the whole menu zone: a cross-faded
 * fire/orange glow (CSS, driven by data-mood) plus a shared ember field whose
 * intensity shifts per active category (burgers hottest → drinks near-calm).
 * No per-section effects, no hard cuts, no randomness on load.
 */

import { createEmberField } from '../core/fx.js';

const EMBER_BY_CATEGORY = {
  burgers: 1.15,
  appetizers: 0.7,
  'party-box': 1.3,
  drinks: 0.15,
};

let zone = null;
let embers = null;

export function initAtmosphere(menuZone, fxCtx) {
  zone = menuZone;
  if (!zone || zone.querySelector('.menu-ambient')) return;

  const layer = document.createElement('div');
  layer.className = 'menu-ambient';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = `
    <div class="menu-ambient__red"></div>
    <div class="menu-ambient__orange"></div>
    <canvas class="fx-embers menu-ambient__embers" id="menu-embers"></canvas>`;
  zone.prepend(layer);

  if (fxCtx) {
    embers = createEmberField(document.getElementById('menu-embers'), fxCtx);
    embers.setIntensity(EMBER_BY_CATEGORY.burgers);
  }
}

export function setMood(categoryId) {
  if (zone && zone.dataset.mood !== categoryId) {
    zone.dataset.mood = categoryId;
    embers?.setIntensity(EMBER_BY_CATEGORY[categoryId] ?? 0.6);
  }
}
