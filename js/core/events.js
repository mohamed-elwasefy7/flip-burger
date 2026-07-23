/**
 * Internal analytics-readiness event layer. LOCAL ONLY — nothing ever leaves
 * the page: no network, no third-party, no storage. Events land in an
 * in-memory ring buffer and re-broadcast as `flip:track` CustomEvents so a
 * future (privacy-respecting) analytics integration can subscribe without
 * touching any call site. Contract documented in docs/EVENTS.md.
 */

const NAMES = new Set([
  'hero_cta',
  'category_view',
  'product_view',
  'favorite_add',
  'favorite_remove',
  'share',
  'order_sheet_open',
  'delivery_platform_click',
]);

const CAP = 100;
const buffer = [];

// Source attribution (Bible §42 taxonomy): ?src=box|bag|flyer|story|bio.
// Read once; attached to every event payload. Never any personal data.
let srcTag = null;
try {
  srcTag = new URLSearchParams(window.location.search).get('src') || null;
} catch {
  srcTag = null;
}

/** Flat, primitive-only payloads — drop anything else (privacy rule). */
function sanitize(payload) {
  const out = {};
  for (const [k, v] of Object.entries(payload || {})) {
    if (v == null) continue;
    const t = typeof v;
    if (t === 'string' || t === 'number' || t === 'boolean') out[k] = v;
  }
  return out;
}

/**
 * Record an event. Unknown names are rejected (returns false) so the
 * whitelist in docs/EVENTS.md stays the single source of truth.
 */
export function track(name, payload) {
  if (!NAMES.has(name)) return false;
  const event = {
    name,
    t: Math.round(performance.now()),
    lang: document.documentElement.lang || null,
    ...(srcTag ? { src: srcTag } : {}),
    ...sanitize(payload),
  };
  buffer.push(event);
  if (buffer.length > CAP) buffer.shift();
  window.dispatchEvent(new CustomEvent('flip:track', { detail: event }));
  return true;
}

export function entrySource() {
  return srcTag;
}

// Debug/inspection handle (live reference; read-only by convention).
window.__flipEvents = buffer;
