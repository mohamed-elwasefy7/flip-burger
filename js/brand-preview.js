/**
 * Brand preview page logic (internal only, not part of the production app):
 * palette grid rendered from live computed tokens, spacing scale demo,
 * RTL/lang toggle, button loading-state demo.
 */

const PALETTE_TOKENS = [
  '--color-black',
  '--color-charcoal',
  '--color-surface',
  '--color-surface-elevated',
  '--color-flame-red',
  '--color-flame-red-deep',
  '--color-fire-orange',
  '--color-warm-yellow',
  '--color-vintage-cream',
  '--color-text-secondary',
  '--color-border',
  '--color-overlay',
];

const SPACE_TOKENS = Array.from({ length: 10 }, (_, i) => `--space-${i + 1}`);

function readToken(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function renderPalette() {
  const grid = document.getElementById('palette-grid');
  if (!grid) return;

  grid.innerHTML = PALETTE_TOKENS.map((token) => {
    const value = readToken(token);
    return `
      <div class="swatch">
        <div class="swatch__chip" style="background:${value}"></div>
        <div class="swatch__meta">
          <span class="swatch__name">${token}</span>
          <span class="swatch__hex">${value}</span>
        </div>
      </div>`;
  }).join('');
}

function renderSpacing() {
  const host = document.getElementById('space-demo');
  if (!host) return;

  host.innerHTML = SPACE_TOKENS.map((token) => {
    const value = readToken(token);
    return `
      <div class="row">
        <code>${token} · ${value}</code>
        <div class="bar" style="width:${value}"></div>
      </div>`;
  }).join('');
}

function initRtlToggle() {
  const btn = document.getElementById('toggle-rtl');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const root = document.documentElement;
    const toRtl = root.dir !== 'rtl';
    root.dir = toRtl ? 'rtl' : 'ltr';
    root.lang = toRtl ? 'ar' : 'en';
  });
}

function initLoadingDemo() {
  const trigger = document.getElementById('loading-trigger');
  const target = document.getElementById('loading-demo');
  if (!trigger || !target) return;

  trigger.addEventListener('click', () => {
    const loading = target.classList.toggle('is-loading');
    target.setAttribute('aria-busy', String(loading));
  });
}

renderPalette();
renderSpacing();
initRtlToggle();
initLoadingDemo();
