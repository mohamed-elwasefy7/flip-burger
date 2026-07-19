/**
 * Loads and normalizes data/menu.json at runtime (network-first via the
 * service worker, so menu edits go live without a rebuild).
 * Adding a product/category later = one JSON object, nothing else.
 */

export async function loadMenu() {
  const res = await fetch('./data/menu.json', { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`menu.json ${res.status}`);
  const raw = await res.json();

  const categories = (raw.categories || [])
    .filter((c) => c && c.visible !== false && c.id)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((c) => ({ ...c, slug: c.slug || c.id }));

  const byCategory = new Map(categories.map((c) => [c.id, []]));
  for (const p of raw.products || []) {
    if (!p || !p.id || p.visible === false) continue;
    if (!byCategory.has(p.category)) continue; // hidden/unknown category → skip
    byCategory.get(p.category).push(normalizeProduct(p, raw.currency));
  }

  // Categories with zero products don't render (nav without content = confusion).
  const populated = categories.filter((c) => byCategory.get(c.id).length > 0);

  return { currency: raw.currency || 'SAR', categories: populated, byCategory };
}

function normalizeProduct(p, fallbackCurrency) {
  return {
    layout: 'image-right',
    background: 'charcoal',
    accent: 'flame-red',
    available: true,
    images: {},
    orderLinks: {},
    ingredientsAr: [],
    ingredientsEn: [],
    ...p,
    currency: p.currency || fallbackCurrency || 'SAR',
  };
}

/** Truthy platform links in a stable display order. */
export function activeOrderLinks(product) {
  return ['keeta', 'hungerstation', 'jahez']
    .map((id) => ({ id, url: (product.orderLinks?.[id] || '').trim() }))
    .filter((l) => l.url);
}
