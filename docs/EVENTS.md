# FLIP BURGER — Internal Event Layer

**Status:** analytics-*readiness* only. Nothing leaves the page — no network, no third-party service, no storage of events. Events accumulate in an in-memory ring buffer (cap 100) and re-broadcast as DOM `CustomEvent`s so a future privacy-respecting analytics integration can subscribe **without touching any call site**.

Implementation: [`js/core/events.js`](../js/core/events.js).

## Contract

- `track(name, payload)` — records one event. Unknown names are **rejected** (returns `false`); this document's whitelist is the single source of truth.
- Every event auto-carries: `t` (ms since page start), `lang` (`ar`/`en`), and `src` (entry attribution from `?src=` — `box | bag | flyer | story | bio` — only when present).
- **Payload rules:** flat object, primitive values only (string/number/boolean); `null`/objects/functions are dropped. Never any personal data — product ids, category ids and platform ids only.
- Subscribe: `window.addEventListener('flip:track', (e) => e.detail)`.
- Inspect (debug): `window.__flipEvents` (live buffer reference).

## Event whitelist

| Event | Fired when | Payload |
|---|---|---|
| `hero_cta` | A hero call-to-action is tapped | `cta: 'explore' \| 'order'` |
| `category_view` | The scroll-spy activates a different category | `category: <category id>` |
| `product_view` | A product stage crosses mid-viewport (also feeds recently-viewed) | `product: <product id>` |
| `favorite_add` | A product is favorited | `product` |
| `favorite_remove` | A favorite is removed | `product` |
| `share` | The share action is used on a product | `product` |
| `order_sheet_open` | The order sheet opens | `product` (absent for the brand-level sticky-bar open), `links: <count>` |
| `delivery_platform_click` | A real platform link is tapped — the conversion | `platform: keeta \| hungerstation \| jahez`, `product` (when contextual) |

## Adding an event (future)

1. Add the name here, with its payload definition.
2. Add it to the whitelist in `js/core/events.js`.
3. Call `track()` at the interaction point.

Order is deliberate: the doc leads, the code follows.

## Related local storage (not events — conversion memory)

| Key | Contents | Purpose |
|---|---|---|
| `flip-favs` | Product ids | Favorites (no account) |
| `flip-recent` | ≤3 product ids, most recent first | Recently-viewed strip |
| `flip-platform` | One platform id | Last-used delivery platform, shown first with «مرة ثانية؟» |
| `flip-lang` | `ar`/`en` | Language choice |
| `flip-ignited` (session) | `1` | Hero intro plays once per session |

All local, all deletable by the customer, none transmitted anywhere.
