# FLIP BURGER — Experience Design V2

| | |
|---|---|
| **Document** | Experience Design V2 — authoritative spec for the next evolution of the FLIP BURGER digital experience |
| **Version** | 2.0 — draft for approval |
| **Date** | 2026-07-23 |
| **Owner** | محمد الوصيفي |
| **Baseline (V1)** | The live site in this repo: zero-framework, GSAP + ScrollTrigger + Lenis, Vite 7, AR-first RTL + EN toggle, 29 products / 4 categories rendered from `data/menu.json`, PWA, GitHub Pages |
| **Status flags** | All Arabic/English copy in this doc is **proposed — pending Mohamed's approval** (same discipline as the `_note` in `data/site.json`). Prices remain intentionally absent until provided. Photography production has not started. |

**How to read this document.** Each of the 25 sections follows the same shape: *intent* → *V2 specification* → *V1 → V2 delta* (what already exists in the repo vs. what changes) → *implementation pointers* (real files) → *acceptance criteria* where measurable. Every spec here is implementable in the existing stack — no framework, no new runtime dependencies beyond GSAP + Lenis, no breaking changes to `menu.json`. V1's hard-won invariants are laws in this document: **CLS = 0.00, reduced-motion collapse, one IntersectionObserver, LANCZOS-only image pipeline, graceful degradation of every optional field.**

---

## Part I — Soul

### 1. Vision

FLIP BURGER is a cloud brand. There is no dining room, no neon sign on a street, no smell of char drifting to the sidewalk. **The website is the only place a customer ever stands.** That reframes the job completely: this is not a menu page for a restaurant — it *is* the restaurant.

**V2 vision statement:** make a screen feel like standing over a real fire — then convert that feeling into a tap on اطلب within sixty seconds.

- **From V1 to V2 in one line:** V1 built a flawless premium menu. V2 turns it into a *craving machine* — every scroll-second is engineered toward one verb.
- **North-star metric:** sessions that end in a delivery-platform tap (Keeta / HungerStation / Jahez). Everything in this document either raises that number or protects the brand equity that raises it long-term.
- **Supporting metrics:** time-to-first-crave (first product fully revealed) < 10s · share taps · PWA installs · QR return visits.

**Five experience principles (the constitution — every later section obeys them):**

1. **Fire is the interface.** Heat, ember, char and glow are not decoration; they are the navigation, the feedback, and the story.
2. **Arabic leads, English struts.** العربي هو الصوت الأساسي — الإنجليزي هو الاستعراض. AR is the default voice (`defaultLang: "ar"`); EN display type (Anton caps) is the swagger layer.
3. **Weight over speed.** Motion is heavy, smooth, controlled, cinematic — never bouncy (the law already written into `css/tokens.css`).
4. **One verb.** اطلب / Order. No carts, no accounts, no second verbs competing.
5. **Nothing decorative that costs a frame.** If an effect can't run at 60fps on a mid-tier Android, it doesn't ship.

---

### 2. Mood

**The mood in one phrase:** منتصف الليل في مطبخ مفتوح على النار — *a midnight open-fire kitchen*. The city is asleep; the grill is not.

**Mood vocabulary** (use these words when briefing designers, photographers, motion work):

| Word | Meaning in practice |
|---|---|
| **Molten** | Reds and oranges behave like liquid metal — deep, slow, glowing from inside (`--glow-fire`) |
| **Charred** | Blacks are warm and layered, never flat `#000` — smoke-stained, seasoned like a grill plate |
| **Matte** | Print-ink surfaces, no gloss, no glassmorphism — the packaging-box finish carried to the screen |
| **Heavyweight** | Type is enormous and confident (`--text-ghost` up to 17rem); motion lands with mass |
| **Loud-quiet** | Loud typography on quiet surfaces — the contrast IS the energy |
| **Vintage-ink** | Distressed cream lettering (`--color-vintage-cream`), boxing-poster heritage |

**Sensory translation table** — a screen can't smell like a grill, so each real sense gets a designed substitute:

| Real sense | Digital substitute |
|---|---|
| Sight of fire | Ember drift, glow breathing, heat-shimmer ambient layers (§4) |
| Sound of sizzle | **Silence.** No audio ever — motion *implies* sizzle. Silence is premium. |
| Touch of heat | Haptic tick on order actions (§17) |
| Smell of char | Macro photography: steam, char edges, frozen sauce drips (§24) |

**Anti-mood — never allowed:** corporate fast-food red-on-white · clinical UI grays · bouncy cartoon easing · neon "gamer RGB" · cold blue light in any photo · sterile stock photography · glossy 3D food renders.

**Reference shelf:** vintage boxing fight posters (ink texture, weight-class typography) · vinyl sleeve matte print · night-market charcoal grills · the FLIP packaging box itself (the origin artifact — matte black, flame ring, lightning bolts, cream lettering).

---

### 3. Brand Story

**The core idea:** *the flip* — اللحظة اللي ينقلب فيها البرجر على الصاج. The point of no return: the char locks in, the juices seal, there's no undo. One confident motion by someone who has done it ten thousand times.

The name carries a double meaning, and the double meaning **is** the brand:

- **اقلب البرجر** — the craft: real fire, real flip.
- **اقلب مزاجك** — the promise: your night flips the moment the box opens.

**Story arc — four beats.** These beats structure the on-site story content (the `قصتنا` nav link currently points at a destination that deserves a real scene in V2) and echo across hero support copy, category intros, and packaging:

| Beat | AR | EN | Where it lives |
|---|---|---|---|
| 1. The fire | النار حقيقية | Real fire | Hero badge + story scene opener |
| 2. The craft | القلبة فن | The flip is craft | Story scene |
| 3. The flip | مزاجك ينقلب | Your mood flips | Story scene → bridges into menu |
| 4. The ask | بطل الليلة عندنا | Tonight's hero is here | Finale scene (§13) |

**Voice rules:** confident Gulf-youth Arabic — short, punchy, spoken rhythm, zero formal stiffness. English is not a translation; it's the hype layer — all-caps Anton, fewer words than the Arabic. Never corporate ("نقدم لكم أجود أنواع…" is banned).

**Slogan status:** اقلب مزاجك / FLIP THE CRAVING is the current dev placeholder (`data/site.json` `_note`) and is strong enough to be the final candidate. Alternate candidate for campaigns: **نار حقيقية. قلبة وحدة.** / **REAL FIRE. ONE FLIP.** Decision is Mohamed's; the site reads slogans from `site.json`, so the swap is a data edit, not a code change.

---

## Part II — Systems

### 4. Motion System

**Philosophy (unchanged law from `css/tokens.css`):** heavy, smooth, controlled, cinematic — never bouncy. V2 adds the physics metaphor that makes every animation decision automatic: **motion behaves like heat.** Things rise the way heat rises, settle the way weight settles, glow the way embers breathe. Nothing "pops."

**Three tiers of motion** — every animation in V2 must declare its tier:

| Tier | Duration token | Driver | Examples | Rules |
|---|---|---|---|---|
| **Ambient** | `--motion-ambient` 2600ms loops | Time | Ember drift, glow breathing, heat shimmer, scroll-cue fall | GPU-only (transform/opacity), max **2 layers in viewport**, paused when offscreen (IntersectionObserver) and when `document.hidden` |
| **Reactive** | `--motion-fast` 160ms / `--motion-standard` 340ms | User input | Press, hover, chip select, sheet open, toggle | Input-to-feedback < 100ms; exits faster than entries |
| **Narrative** | `--motion-reveal` 850ms | Scroll / lifecycle | Scene reveals, wordmark ignition, category crossfade, boot exit | Max **1 narrative animation at a time** per viewport |

**Concurrency budget:** 1 narrative + 2 ambient + unlimited reactive. Single rAF loop through the GSAP ticker — no `setInterval`, no second loops.

**Easing assignments:**

| Motion | Ease token |
|---|---|
| Entries / reveals | `--ease-entry` |
| Exits / dismissals | `--ease-exit` |
| Signature moments (ignition, boot exit) | `--ease-out-heavy` |
| Continuous transforms (crossfades, parallax) | `--ease-cinematic` |

**Distance discipline:** reveal translateY 24–48px maximum (long travel reads cheap) · scale range 0.96 → 1 maximum · rotation only in §17 premium tilts (≤3°).

**ScrollTrigger discipline.** V1 ships exactly one ScrollTrigger set (burger parallax; desktop + motion-OK; fully disposed on language re-render — no leaks). That restraint is why TBT ≈ 60ms. V2 law: all new scroll-driven motion registers through **one central module** — extend `js/menu/product-motion.js` or introduce `js/core/motion.js` — with a single `kill()`/`rebuild()` path invoked by the language re-render. **Hard cap: ≤ 4 ScrollTrigger instances alive.** Everything else rides the existing single IntersectionObserver (`js/core/reveal.js`).

**Lenis:** keep V1 configuration. No scroll hijack, no snap-scroll on desktop, native touch momentum respected. Lenis smoothness is the *feel* of the site; it is never used to take the wheel.

**Reduced motion contract (extends V1):** the token collapse in `tokens.css` already zeroes CSS animation. V2 adds the JS side: one shared `motionOK()` gate (`matchMedia('(prefers-reduced-motion: reduce)')`) guards **every** GSAP timeline; ambient layers render as static gradients; every section of this doc inherits this contract silently.

---

### 5. Color Psychology

The palette is extracted from the packaging box (see `css/tokens.css` header) — V2's contribution is the *why* and the *discipline*, so every future decision protects what makes it convert.

**Why this palette sells food:**

| Color | Token | Psychology |
|---|---|---|
| Flame red `#c92d1c` | `--color-flame-red` | Appetite + urgency. The most studied hunger trigger in food retail — but only against dark, where it reads *fire*, not *discount*. |
| Fire orange `#e25822` | `--color-fire-orange` | Warmth, abundance, the mid-tone of real flame. Bridges red and yellow so gradients read as one fire (`--grad-ember`). |
| Warm yellow `#f6a81c` | `--color-warm-yellow` | Energy and joy — the lightning bolts. Scarce by design: the rarest color on the site. |
| Layered warm blacks | `--color-black → --color-surface-elevated` | The premium night context. Their real job: make food photography the brightest, most saturated object on every screen. |
| Vintage cream `#f2e6c9` | `--color-vintage-cream` | Human, hand-made, trustworthy. Ink on paper, not pixels on glass. |

**The hierarchy law:** on any viewport, **the food image is the most saturated object.** UI fire colors support the food; they never compete with it. This is the single most important color rule in the document.

**Red discipline:** `--color-flame-red` may cover **< 8% of any viewport** — except at two deliberate spike moments: CTA surfaces (§11) and Inferno-heat products (§10). A spike only works because the baseline is disciplined.

**Layered-blacks law:** never flat `#000` (existing tokens comment — now law). Depth comes from stepping the four-black ladder (`black → charcoal → surface → surface-elevated`), never from introducing new hues. Sections alternate ladder steps; elevation = a step up the ladder + `--edge-highlight`.

**Heat mapping per category** — implemented through the existing `--cat-glow-1/2`, `--cat-accent`, `--cat-tone`, `--cat-ember` tokens (overridden per `.menu-category--<id>`):

| Category | Room temperature | Glow | `--cat-ember` |
|---|---|---|---|
| Burgers | The main fire — hottest | Molten red (default tokens) | 1.0 |
| Appetizers | The fryer line | Fire-orange shift | 0.8 |
| Party Box | Celebration heat | Red + yellow allowed (bolts) | 0.9 |
| Drinks | The cooldown | Deep amber, lowest intensity | 0.4 |

**Drinks stay warm.** The cooldown is expressed by *lowering* ember intensity and shifting to deep amber — **never** by introducing blue. Blue would break the room (§2 anti-mood).

**Text + semantic rules:** cream primary, `#b4a488` secondary (≥6:1 — existing). Yellow is reserved for badges, bolts and heat-line peaks — never body text. Unavailable products: photo desaturated to ~60% + the existing غير متوفر حالياً label in cream — no grays, no red error styling.

---

### 6. Typography

**The cast:**

| Font | Role | Notes |
|---|---|---|
| **Anton** | EN display — the swagger | Temporary licensed OFL stand-in for the distressed packaging lettering (existing tokens comment). Swap slot: change `--font-display-en` in `css/tokens.css` — single source of truth, zero other edits. |
| **Almarai** (bold weights) | AR display + AR body companion | Carries the Arabic voice at every scale |
| **Archivo** | EN body / UI | Workhorse; disappears into usefulness |

All self-hosted woff2, subset, `font-display: optional`, preloaded (existing — do not touch; this is why web-font CLS is zero).

**Bilingual display law:** when Arabic is active, Arabic *leads*. Anton runs tall and narrow, so Almarai display sizes get an optical bump of **+4–6%** against the same slot to hold the stage with equal authority. Exception: **product names stay in Anton caps even in AR mode** — BLACK TWINS, RED HIT, MID NIGHT are logos, not sentences (matches current `nameEn` rendering; the Arabic name accompanies at subtitle scale — current `nameAr` transliterations remain flagged for review per the `menu.json` `_note`).

**Scale (existing tokens — unchanged) + V2 usage laws:**

- `--text-hero` (13vw → 10rem): wordmark only. Once per site.
- `--text-title`: category chapter headings.
- `--text-product`: product names — huge, unapologetic.
- `--text-ghost` (22vw → 17rem): **texture, not text.** Max one ghost element per viewport; opacity ≤ 0.08 cream or ≤ 0.12 category accent; `aria-hidden="true"` always; never overlapping the reading column.
- `--text-lead` / `--text-base` / `--text-small` / `--text-label`: supporting hierarchy.

**Micro-rules:**

- Tracking: Anton +0.01em only at ≥ 4rem. **Never letter-space Arabic** — it breaks letter joining; use word-spacing if a line needs air.
- Numerals: Western digits in both languages, `tabular-nums` for prices/calories (existing renderer behavior — keep).
- Rhythm law: never two display sizes adjacent without a `--text-label` eyebrow between them — the label is the breath between shouts.
- Line length: body copy ≤ 65ch inside `--container-narrow`.

---

### 7. Scene Layout

**Reframe:** the site is not sections on a page — it is **six stages in one continuous camera move** through one dark kitchen. The visitor never "navigates"; they walk deeper.

**The stage sequence** (existing DOM anchors in parentheses):

```
Boot (#boot)  →  Hero (.hero)  →  Bridge (#menu, .bridge.tx.tx-smoke)
→  Category rooms (#menu-list, .menu-zone)  →  Product spotlights (#menu-products)
→  Order finale + footer (V2 NEW — last stop before the footer)
```

**Every scene is three layers**, mapped to the existing z-registry in `tokens.css`:

| Layer | Z token | Contents |
|---|---|---|
| Texture | `--z-texture` | Grain, smoke (`tx-smoke` class exists on the bridge — extend the `tx-*` pattern in `css/effects.css`) |
| Ambient | between texture and content | Category glow, embers, heat shimmer |
| Content | `--z-content` | Type, images, controls |

Nav (`--z-nav`), sticky order bar (`--z-sticky`, §19), sheet (`--z-modal`), toasts (`--z-toast`) and boot (`--z-boot`) float above the stages — the registry already reserves every slot.

**Composition:** the 4/8/12 grid (`.grid` in `css/utilities.css`) governs content; stages themselves bleed full-width. Content max `--container-max` (80rem); reading columns `--container-narrow` (60rem). Scene vertical padding `--space-9`/`--space-10` — scenes breathe; on mobile, one product owns the viewport at a time.

**Scene rhythm** (density curve is deliberate): full-bleed hero → narrow quiet bridge (the breather) → alternating split product stages (`layout: image-right/left` — already a per-product field in `menu.json`) → **dense drinks grid** (tempo change, §9) → wide finale.

**Continuity law:** the background never hard-cuts. `--cat-tone` washes crossfade between rooms (§15) so the whole scroll reads as one continuous space.

---

## Part III — Scenes

### 8. Hero

**Job description:** three seconds to communicate *real fire, real brand, scroll down* — then get out of the way.

**Composition (V2, building on existing ids):**

1. **Flames stage** — `#hero-flames-img` (the existing flames set: `assets/images/flames-stage-*.{webp,jpg}`) + `#hero-embers` ambient layer. The flames image is the LCP element: it must be preloaded, `fetchpriority="high"`, and never blocked behind JS.
2. **Wordmark ignition** — `#hero-wordmark` reveals with a bottom-up mask wipe, 850ms `--ease-out-heavy`, as if lit from below. **Once per session** (`sessionStorage: flip.ignited`) — returning visitors get the wordmark instantly. Implemented as a CSS mask/clip-path animation so it can never delay interactivity.
3. **Badge** — `#hero-badge`, `--text-label`: **الرياض · نار حقيقية** / **RIYADH · REAL FIRE** *(copy pending approval)*.
4. **Slogan + support** — from `site.json` (اقلب مزاجك + support line — placeholder status noted).
5. **CTA pair** — primary استكشف المنيو (Lenis smooth-scroll to `#menu`), secondary اطلب الآن (order path, §12). Magnetic behavior on desktop (§17).
6. **Scroll cue** — `#scroll-cue`: a single ember that *falls* while ambient embers *rise* — the inversion quietly points down. 2600ms ambient loop.

**Scroll-out parallax:** flames 0.85 speed · embers 1.1 · wordmark 1.0 — registered in the central motion module (§4), desktop + motion-OK only, within the ≤4 ScrollTrigger cap.

**Acceptance criteria:** LCP < 2.5s on mid-tier Android 4G · wordmark legible at 320px width · ignition animation adds 0ms to TTI · hero fully functional with JS disabled except motion (image, type and anchor CTA are plain HTML).

---

### 9. Category Experience

**Concept:** each category is a **room** in the kitchen. The chip nav is walking between rooms, not filtering a table.

**The four rooms:**

| Room | Concept | AR intro line *(proposed — pending approval)* | EN | Treatment |
|---|---|---|---|---|
| Burgers | The main fire | من النار مباشرة | Straight off the fire | Hottest: molten red glow, heaviest ember, slowest reveals — the headline chapter |
| Appetizers | The fryer line | الافتتاحية قبل البطل | The opening act | Orange crackle; lighter, ~15% faster reveals |
| Party Box | The big night | لليلة اللي تسوى | For the nights that count | Widest stages, red + yellow celebration, group energy |
| Drinks | The cooldown | طفّي الحريقة | Put out the fire | Lowest amber ember; compact grid; quick rhythm |

**Category intro cards:** each room opens with a chapter card — ghost category name (`--text-ghost` at accent tint) + AR title (`--text-title`) + the one-line mood copy above. The `descriptionAr/En` fields already exist **empty** in `menu.json` categories — V2 fills them (data edit; renderer already degrades gracefully when empty, so partial approval still ships).

**Chip nav** (`#menu-cat-nav`, `js/menu/category-nav.js`): sticky under the main nav; scroll-spy active state (existing, via the shared IO). V2 adds: ember underline tick on the active chip (§14) and mobile snap + auto-centering (§19).

**Ambient handover** (`js/menu/menu-atmosphere.js`): rooms crossfade over 850ms. **Implementation law:** crossfade two stacked glow layers by opacity — never animate the CSS custom properties themselves (custom-property interpolation forces repaint; two-layer opacity stays on the compositor).

**The drinks exception:** 14 of the 29 SKUs are drinks. They do **not** get spotlight stages — that would double scroll length with the least differentiated products. Drinks render as a compact card grid (2-col mobile / 4-col desktop), can photography doing the work, no ghost type per drink. This tempo change *is* the cooldown narrative (§13) — a rendering branch in `js/menu/product-section.js` keyed by category.

---

### 10. Product Experience

**The heart of the site.** Every burger, appetizer and box is a spotlight stage (rendered by `js/menu/product-section.js`, animated by `js/menu/product-motion.js`).

**Stage anatomy (back to front):**

1. Ghost name — `--text-ghost`, one per viewport, `aria-hidden`
2. Product image — floating on `--shadow-elevated`; hot items (heat ≥ 4) add `--glow-fire`
3. Name — `--text-product`, Anton caps (+ AR name at subtitle scale)
4. Subtitle / description — existing optional fields, graceful when absent
5. Ingredient chips — staggered reveal, 40ms apart
6. Meta row — calories سعرة · prepTime دقيقة (existing strings, existing optional fields)
7. Order CTA — اطلب (§11)

**Reveal choreography** (one 850ms narrative timeline per stage, triggered by the existing shared IntersectionObserver — **not** per-product ScrollTriggers): image settles (scale 0.96→1, y 32→0) → name wipes in → chips stagger → CTA fades in last. The CTA arriving last is intentional: crave first, ask second.

**The heat ladder (V2 signature feature).** Proposed backward-compatible field in `menu.json`:

```json
{ "heatLevel": 0 }   // optional, 0–5; absent → no indicator renders
```

- Levels 1–4: ember-dot scale (filled dots in `--color-fire-orange`).
- **Level 5 = INFERNO:** name takes `--grad-ember` text fill + a slow glow pulse (ambient tier), badge reads إنفيرنو 🔥. This is the on-site anchor for the **#تقدر_توصل_انفيرنو** challenge (the viral heat-ladder concept from the FLIP name bank: Chill → Warm → Fire → Lava → Blaze → Inferno).
- Natural candidates in current data: RED HIT, RED HEAD. Assigning levels is Mohamed's call — pure data edit, no code dependency.

**Badges** (existing: جديد / حار / مميز): top-start of the image. Shimmer sweep on مميز only, once per session per product (§14).

**Favorites** (`js/menu/favorites.js`, existing): heart char-pop micro (§14); persisted in localStorage. V2 adds: a المفضلة chip appears in the category nav only when ≥ 1 favorite exists — zero UI cost for new visitors.

**Share** (`js/menu/share.js`, existing): per-product URL hash opens the site scrolled to that product with a highlight ring (§15). V2 adds **per-product OG images** — generated at build time in `scripts/` (static files, zero runtime cost) so every shared link unfurls as a branded product card. Every share becomes an ad (§25).

**Mobile stage:** full-viewport scene; image 4:5 portrait filling the upper ~55%; CTA inside the scene's first screenful. Vertical native scroll only — no horizontal swipe hijack (§19).

**Placeholder state** (existing: الصورة النهائية قريباً): keep the premium panel; V2 adds a faint ember silhouette of a burger so the promise looks intentional, never broken.

---

### 11. CTA Experience

**One verb: اطلب.** Never "buy," never "add to cart" — there is no cart; the delivery platforms own checkout. The entire CTA system exists to make one tap inevitable.

**The CTA ladder** (top of page to bottom):

| Surface | AR | EN | Behavior |
|---|---|---|---|
| Nav pill (persistent) | اطلب الآن | Order Now | Opens order sheet (§12) |
| Hero primary | استكشف المنيو | Explore Menu | Smooth-scroll to `#menu` |
| Hero secondary | اطلب الآن | Order Now | Opens order sheet |
| Per-product | اطلب | Order | Opens sheet **pre-loaded with that product's context** |
| Sticky mobile bar — **V2 NEW** | اطلب | Order | Appears after the bridge; shows current category label; hides when sheet opens (§19) |
| Finale scene — **V2 NEW** | جاهز؟ اطلب الآن | Ready? Order Now | The biggest اطلب on the site — last scroll stop (§13) |

*(All copy pending approval.)*

**Anatomy:** `--grad-flame` fill · cream label (the `--color-btn-red-*` pair already guarantees ≥ 4.8:1) · `--radius-md` · `--control-height` (48px) · press = scale 0.97 + `--shadow-inner`, 160ms `--ease-exit` · release rebounds on `--ease-entry`.

**Idle ember pulse:** primary CTAs breathe `--glow-fire` opacity 0.6 → 1.0 on the 2600ms ambient cycle. **Law: maximum one pulsing CTA per viewport** — when the sticky bar is visible, it wins and all others hold still. A room full of pulsing buttons is a discount store.

**Never:** two primary CTAs adjacent · red *outline* buttons (red is a fill or nothing) · gray disabled states — unavailable is expressed as the cream قريباً treatment, not disability styling.

---

### 12. Ordering Experience

**The honest truth of the funnel:** conversion completes inside Keeta, HungerStation or Jahez. The site's whole job is to **hand off hot, fast, and remembered.**

**The flow — two taps from any product to a platform app:**

```
اطلب (anywhere)  →  order sheet slides up (340ms --ease-entry)
→  platform card tap  →  deep link out. Done.
```

The bottom sheet exists (`js/menu/order-sheet.js`); platform names are already localized in `site.json` (كيتا / هنقرستيشن / جاهز). V2 upgrades:

1. **Product context.** The sheet header shows the product that launched it — thumbnail + name — so the handoff feels like a continuation, not a restart. (Sheet launched from nav/hero/finale shows the brand mark instead.)
2. **Platform memory.** Last-used platform persists (`localStorage: flip.platform`); its card moves to first position with a subtle ring and the label **مرة ثانية؟** / *Again?* Habit is the cheapest retention mechanism that exists.
3. **Per-product deep links.** The `orderLinks` field already exists in the product schema — when platforms provide product-level URLs, the sheet links straight to the item; otherwise it falls back to the store link. Data edit only.
4. **Future slots, designed now:** WhatsApp order + phone-call cards, hidden until their data exists in `site.json` — the same graceful-degradation pattern the renderer already uses everywhere.

**No-links state** (existing: روابط الطلب قريباً + hint): keep as-is — it is already honest and well-toned.

**Sheet accessibility (§22 contract):** focus trap · ESC + backdrop + swipe-down close (visible drag handle, §19) · focus returns to the triggering button.

**The exit moment:** the platform-card tap is *the conversion*. It gets the haptic tick (§17). If the OS returns the user to the tab, a quiet toast: **تم — كمّل طلبك في التطبيق** / *Done — finish your order in the app.*

---

## Part IV — Choreography

### 13. Scroll Narrative

**The scroll is a story: one night at the grill, start to finish.** The user doesn't browse a menu — they walk through ignition, heat, feast, cooldown, and the ask.

**Chapter map:**

| Chapter | Anchor | Narrative beat |
|---|---|---|
| Ignition | Hero | The spark: brand + promise |
| The invitation | Bridge (existing: جاهز تقلبها؟) | Smoke texture, quiet breath, pull downward |
| The main fire | Burgers | Longest, hottest chapter — the headliners |
| The crackle | Appetizers | Faster rhythm, orange heat |
| The feast | Party Box | **The wide shot** — scale jump from one burger to the whole table; a narrative beat, not just a category |
| The cooldown | Drinks | Visual relief; quietly sells order completeness (§25) |
| The ask | Finale — **V2 NEW** | Biggest اطلب + platform cards inline; the story's closing line |
| Credits | Footer | Location, hours, socials |

**The heat-line (V2 signature):** a 2px fixed progress bar at the top of the viewport using the existing `--grad-heat-line` gradient. Fill = scroll progress via a single `scaleX` transform (rAF-throttled from Lenis's scroll event). Because the gradient peaks yellow mid-way, the bar *literally* passes through peak heat as you cross the feast — the scroll position becomes a heat curve. Cost: one composited transform.

**Chapter transitions:** `--cat-tone` washes crossfade (§15); the next room's ghost category name starts revealing at ~85% of the previous chapter — the peek pulls the user forward.

**Scroll-spy:** existing shared IO drives chip states; V2 extends the same observer entries to tick chapter markers on the heat-line. No new observers.

**No scroll-jack — law.** The story is told by what you pass, never by taking the wheel. Lenis provides the feel; the user keeps the steering.

**Length check:** 29 products, but 14 collapse into the drinks grid (§9) — total journey ≈ 12–14 mobile viewports. Right-sized for a menu; repeat visitors get the QR fast path (§20) that skips straight to the rooms.

---

### 14. Micro Animations

**Inventory** — every micro-interaction in V2, specified once, owned in one file:

| Element | Trigger | Spec | Duration | File |
|---|---|---|---|---|
| Category chip | select / scroll-spy | Ember underline draws inline-start → inline-end; bg steps to `--color-surface-elevated` | 340ms `--ease-cinematic` | `category-nav.js` |
| Favorite heart | tap | **Char-pop:** scale 1 → 1.25 → 1; 3 ember particles rise + fade (particles desktop-only) | 340ms | `favorites.js` |
| Share button | tap | Ring ripple from tap point + existing toast تم نسخ رابط المنتج | 340ms + toast | `share.js` |
| مميز badge | first in-view | Cream shimmer sweep, **once per session per product** | 600ms | `menu-renderer.js` |
| Price | first in-view (when prices land) | Count-up 0 → price, tabular numerals — schema-ready, dormant until data arrives | 600ms | `menu-renderer.js` |
| Product image | decode complete | Opacity 0 → 1 + scale 1.02 → 1 (box pre-reserved — CLS stays 0) | 340ms | renderer |
| Toast | any | Slide up + fade; auto-dismiss 2.4s; **one at a time** (`--z-toast`) | 340ms | shared |
| Nav bar | scroll past hero | Charcoal + blur fade-in | 340ms | `js/core/nav.js` |
| Sticky order bar | pass bridge | Slide up from bottom edge | 340ms `--ease-entry` | new, §19 |
| Sheet platform cards | sheet open | Stagger 40ms, y 12 → 0 | 340ms | `order-sheet.js` |
| Scroll cue | ambient | Single ember falls, fades, resets | 2600ms loop | `js/sections/hero.js` |

**Laws:** transform/opacity only · `will-change` applied at animation start and **cleared on complete** (V1's pattern — now law) · nothing loops except the ambient tier · every entry in this table sits behind `motionOK()` · durations only from motion tokens — no bespoke milliseconds.

---

### 15. Transitions

**Language toggle — the veil.** V1 re-renders the menu cleanly (no duplicate listeners/observers — preserve that machinery). V2 wraps it in a **cream-on-black veil**: overlay fades in 160ms → swap + RTL/LTR direction flip happen fully hidden → veil fades out 340ms. The most violent DOM moment on the site becomes a page-turn. Where `document.startViewTransition` exists, use it as the veil's implementation — feature-detected, zero polyfill, identical fallback.

**Category ambient crossfade:** two stacked glow layers, opacity crossfade 850ms `--ease-cinematic` (§9's compositor-only law).

**Sheet physics:** up 340ms `--ease-entry`; down 260ms `--ease-exit`. **Exits are always faster than entries — site-wide law.** Leaving must never feel slower than arriving.

**Share-link arrival:** Lenis scrolls to the target product, then a highlight ring fades over 850ms — you arrive *at* something, and it acknowledges you.

**Boot → Hero (the one theatrical moment):** boot bar completes → the boot overlay lifts as a curtain (translateY −100%, 850ms `--ease-out-heavy`) revealing the hero **already ignited underneath**. The existing hard-cap and hidden-tab fast path (`js/core/boot.js`) are untouchable.

**Law:** no transition exceeds 850ms, ever. Nothing blocks input except boot — which is capped.

---

### 16. Loading

**Boot overlay** (existing `#boot` / `#boot-logo` / `#boot-bar` with hard cap + hidden-tab fast path — all preserved). V2 refinements:

- Explicit total cap **≤ 1.8s** — the curtain (§15) lifts at cap even mid-bar.
- Bar fill uses `--grad-heat-line`.
- Logo gets a single ember flicker at ~80% progress — one flicker, amplitude-limited (§22), not a loop.
- One boot line, no rotation theater: **على النار الآن** / **ON THE FIRE** *(pending approval)*.

**Boot skip conditions (V2 new):** `?src=` QR entries (§20) · `Save-Data` request hint · same-session return (`sessionStorage: flip.booted`) · reduced-motion (fade 160ms instead). The cinematic boot is a first-impression tool, not a toll booth.

**Menu images:** dimension reservation already guarantees CLS 0 — keep. V2 adds the **ember skeleton**: `--color-surface-elevated` panel with a slow `--grad-char` shimmer until decode, then the §14 settle. First product stays eager/`fetchpriority=high`, rest lazy (existing renderer behavior).

**`menu.json` freshness:** network-first fetch exists. V2 UX rule: if a cached menu rendered and fresh data arrives, re-render silently **only if** the user hasn't scrolled into the menu yet; otherwise queue the swap until idle. Content must never jump mid-read.

**Fonts:** `font-display: optional` + preload (existing) means text renders instantly or swaps invisibly — no loading choreography needed or wanted.

**Offline (PWA exists):** cached shell + quiet toast **أنت أوفلاين — المنيو المحفوظ معك** / *You're offline — your saved menu is here*. Order CTAs show a reason-attached disabled state (platforms need network) — the only allowed "disabled" on the site.

---

### 17. Premium Interactions

Signature details that separate premium from template. **Every item: gated by pointer/device capability + `motionOK()` + perf headroom, and degrades silently.** None may appear in reduced-motion.

| Interaction | Platform | Spec |
|---|---|---|
| **Magnetic CTAs** | Desktop (`pointer: fine`) | Primary buttons attract the cursor within an 80px radius; translate ≤ 6px; spring back on `--ease-out-heavy`. GSAP `quickTo`, single rAF. |
| **Image tilt** | Desktop hover | Product image perspective tilt ≤ 3°; glow bias follows cursor side. **No gyroscope tilt on mobile** — battery + motion-sickness. |
| **Cursor ember** | Desktop, flagged | 2px ember dot lagging the cursor 80ms inside product stages only. **OFF by default** behind `localStorage: flip.ember` — taste risk; review before any launch. |
| **Haptics** | Mobile (supported browsers) | `navigator.vibrate(10)` on: platform-card tap (the conversion), favorite add, Inferno CTA press. **Never on scroll.** |
| **Long-press quick sheet** | Mobile | 500ms press on product image → quick actions (favorite / share / order). Complements visible buttons, never replaces them (§22 law). |
| **Hover detailing** | Desktop | Product name ember-underline draw; meta chips lift 2px on `--shadow-soft`. |
| **Signature chrome** | All | `::selection` in flame-red/cream; thin charcoal scrollbar with ember thumb (WebKit). The details nobody mentions but everybody feels. |

---

## Part V — Surfaces

### 18. Desktop

Desktop is **the cinematic cut** — the version you show on a big screen. It is not the primary order surface (§19 is), so it optimizes for immersion and brand memory.

- **Split stages:** 12-col grid; image takes 6–7 cols, text 5–6, sides alternating per the existing `layout` field (`image-right` / `image-left`) in `menu.json`.
- **Ghost type full-bleed** behind stages; ambient layers bleed edge-to-edge beyond `--container-max` so ultrawide monitors never show dead margins.
- **Parallax on:** the existing burger-parallax pattern (image 0.9 vs text 1.0) is the model for all V2 scroll depth — registered centrally (§4).
- **Hover complete:** every interactive element has a hover + focus treatment (§17 list). Desktop users read polish through hover.
- **Wide-shot moments:** Party Box stages stretch to 10 cols — the feast gets the widest frame on the site. Drinks grid runs 4-col.
- **Nav:** full links (المنيو · قصتنا · موقعنا) + language toggle + اطلب الآن pill (existing structure).
- **No custom cursor** by default — custom cursors on food sites read as gimmick within seconds (the §17 ember stays behind its flag).

---

### 19. Mobile

**Mobile is where the orders happen.** A delivery brand fed by TikTok/Instagram traffic lives on 360–430px screens — mobile is designed *first*; desktop is the trailer.

- **Thumb map:** every order action lives in the bottom half of the screen.
- **Sticky order bar (V2 headline feature):** 56px + `env(safe-area-inset-bottom)`; `--grad-flame` اطلب + current category context label; slides in after the bridge (§14); hides when the sheet opens. It means the answer to "how do I order?" is always: *your thumb is already on it.*
- **Chip nav:** horizontal scroll with `scroll-snap-align`; the active chip auto-centers (`scrollIntoView({inline:'center'})` in `category-nav.js`).
- **Product scenes:** full-viewport; 4:5 image in the top ~55%; name, meta and اطلب all inside the scene's first screenful.
- **Gestures:** native vertical scroll only. Sheet closes by swipe-down on a **visible drag handle**. No horizontal product carousels — hidden content doesn't sell (discoverability > density).
- **Data budget:** the 480/800 image tiers serve mobile (`sizes` already accurate); full first-visit browse ≤ 3MB target.
- **Safe areas:** `env(safe-area-inset-*)` on nav, sticky bar, sheet, toasts.
- **Type check:** `--text-hero`'s clamp floor must hold without wrap at 320px (QA gate).

**The one-hand test (acceptance criterion):** on a 360×780 device, a first-time visitor completes hero → product → platform handoff using only the right thumb, in under 60 seconds.

---

### 20. QR Experience

The packaging box is the brand's only physical touchpoint — its QR is the bridge from the real night back to the digital kitchen.

**Surfaces + entry URLs:**

| Surface | URL | Experience on arrival |
|---|---|---|
| Packaging box (primary) | `/?src=box` | Boot skipped (§16) · land at the bridge with the heat-line already warm · one-time toast: **رجعت؟ البطل ينتظر** / *Back for more?* — box scanners have already ordered once; greet them like regulars |
| Delivery bag sticker | `/?src=bag` | Same fast path, no toast |
| IG / TikTok bio | `/?src=bio` | Full hero (first-impression traffic) |
| Story swipe-ups | `/?src=story` | Fast path to the bridge |

`src` values mirror into UTM parameters when analytics land (§25) — the taxonomy is designed now so the data is clean later.

**QR print specification:**

- Cream modules on matte black (brand-true); flame-red finder rings **only if scan-tested** — fallback is full cream.
- Quiet zone ≥ 4 modules · minimum print 2×2cm · error correction **M** (use Q only if a center logo is added — and skip the center logo below 3×3cm).
- **Field test standard:** scans at 3cm distance, in low light, through bag-sticker gloss — the doorstep reality, not the studio.
- Box placement: inner lid face — the lid opens toward the customer at the exact moment of peak brand love. Campaign seasons add **#تقدر_توصل_انفيرنو** beside it.

**PWA hook:** second QR visit → the install moment (`js/core/pwa.js` exists): **ثبّت المنيو — أسرع من التطبيقات** / *Install the menu — faster than the apps.* *(Copy pending approval.)*

**Acceptance criterion:** box scan → interactive menu < 4s on mid-tier Android over 4G.

---

## Part VI — Guardrails

### 21. Performance Constraints

Hard budgets. A feature that busts a budget doesn't ship — **regressions block merge.**

| Metric | Budget | Note |
|---|---|---|
| LCP | < 2.5s | Mid-tier Android, 4G, cold cache |
| CLS | **= 0.00 exact** | V1's achievement — held, not approximated |
| TBT | < 100ms | V1 ≈ 60ms → all V2 features share ≤ 40ms headroom |
| INP | < 200ms | Press feedback ≤ 100ms (§4) |
| Scroll | 60fps | Snapdragon 6-series reference device |
| JS | ≤ V1 + 15KB gz | Total, all V2 features included |
| Runtime deps | GSAP + Lenis **only** | Law — no additions, no swaps |
| Menu image | ≤ 120KB avg | AVIF 800w tier |
| Fonts | No new families | Subsets only, existing pipeline |
| ScrollTriggers | ≤ 4 alive | §4 central-module cap |
| Observers | 1 IntersectionObserver | V1 pattern — held |

**Runtime discipline:** ambient layers pause when offscreen (shared IO) and on `document.hidden` · particle counts halve after 5min idle or on visibility churn (thermal courtesy) · single GSAP ticker, no parallel loops.

**Feature flags:** every V2 feature (ignition, heat-line, sticky bar, veil, magnetic, tilt, haptics, ember cursor…) toggles independently from one config object — perf bisection stays a 30-second job, and launch can ship any safe subset.

**QA gates per PR:** `npm run verify` (extend the existing 44-check suite with V2 checks: sticky-bar behavior, veil, heat-line, boot skip paths) + `npm run lighthouse` against preview.

---

### 22. Accessibility

Target: **WCAG 2.2 AA.** The premium claim is void if the experience excludes people.

- **Contrast:** cream on blacks ≥ 12:1 · secondary `#b4a488` ≥ 6:1 (existing) · CTA pair ≥ 4.8:1 (existing `--color-btn-red-*`) · warm yellow never used as text.
- **Motion:** token collapse (existing) + `motionOK()` JS gate on every timeline (§4) · ambient layers become static gradients · **no flashing above 3/s** — the boot flicker is a single event; ember pulses are amplitude-limited slow breathes.
- **Structure:** landmark regions; one `h1` (the wordmark), `h2` per category, `h3` per product — heading order survives the language re-render. Skip link exists (تخطَّ إلى المحتوى) — preserved.
- **RTL:** logical properties throughout (existing law — binding on all V2 CSS); direction-implying icons flip with `dir`.
- **Keyboard:** complete path hero → chips → product → sheet → platform link. Sheet: focus trap, ESC close, focus returns to trigger (§12). Focus style: 2px cream ring + 1px flame offset, `:focus-visible` only.
- **Screen readers:** product stages are `article`s with accessible names · the sheet announces its product context · toasts are `aria-live="polite"` · ghost type and all ambient/texture layers are `aria-hidden` · badge meanings carried by text (جديد / حار / مميز — existing strings), never color alone · heat ladder gets an accessible label (مستوى الحرارة ٥ من ٥).
- **Touch:** ≥ 44px targets (`--tap-target` exists) · long-press is never the only path to any action (§17 law).
- **Language:** `lang` + `dir` swap on toggle (existing) · EN product names inside AR context carry per-element `lang="en"`.

---

## Part VII — Art Direction

### 23. Image Style

**One rule above all: the food is the only light source that matters.** Every frame is built so the product is the brightest, warmest, most saturated thing in it — the UI's layered blacks (§5) exist to guarantee it.

**The dark-stage system:**

- Backdrop: matte charcoal/black (the `#17100b` family) — seamless, no texture competing with char texture on the food.
- One warm key light; food occupies ≥ 60% of frame; negative space is stage, not emptiness.
- **Consistency contract:** same backdrop family, same key-angle family, same scale logic across all 29 SKUs and every future addition — the menu must read as *one shoot*, even when photographed months apart.

**Ratios:** burgers/appetizers 4:5 or 1:1 (current assets run ≈ 3:4 e.g. 1086×1448 — the pipeline preserves them; new shoots standardize on 4:5) · party box 1:1 or 4:3 top-down · drinks 1:1, centered can/bottle.

**Pipeline invariants (README law — restated as binding):** `scripts/build-menu-images.py` performs LANCZOS downscale **only** — no crop, no filters, never upscaled. Composition is decided at the shoot, not in the build. In-UI, photos receive **no CSS filters** — heat is conveyed by the glow layers around the image, never by cooking the image itself.

**Placeholder art:** missing photos render the existing premium panel (الصورة النهائية قريباً) + V2's faint ember silhouette — a placeholder must look like a promise, never like a bug.

---

### 24. Food Photography Style

**Shot recipes by product type:**

| Type | Recipe |
|---|---|
| **Burger hero** | ¾ view, camera low (10–15° above table level), stack built tall, steam visible, char edges catching the key. The default stage shot for all 7 burgers. |
| **Cheese pull macro** | BLACK TWINS + any مميز item — the social-currency shot. |
| **Cross-section** | One per patty base (beef / chicken) — the build-honesty shot; nothing sells trust like the inside. |
| **Appetizers** | Overhead cascade or 45° box-overflow — abundance energy (fries mid-tumble, rings stacked leaning). |
| **Party box** | Top-down full spread, **hands reaching in** — the only shots with people; they carry scale + the gathering story (فرحة الجمعة). |
| **Drinks** | Existing brand-can shots suffice per-SKU. One hero variant for the chapter intro: backlit condensation on black. |

**Light recipe:** one hard key, 45° side-back, warm gel (~3200K feel) · black flags on the opposite side — the shadow side stays *deep* · a small cream bounce only to lift packaging logos · steam read via backlight. **Banned:** ring lights, flat softbox e-commerce lighting, HDR flattening.

**Styling truth:** real char marks, visible seasoning, sauce frozen mid-drip. Props: a black tray, a cream napkin — maximum. No lifestyle clutter, no fake garnish forests, nothing on the table that isn't sold.

**Motion masters (social + future hero video):** 2-second loops, vertical 9:16 masters (square crops derived): the flip in slow-mo · cheese stretch · flame lick behind a patty · box-lid-open reveal. These four loops are a complete TikTok/Reels ammunition kit.

**Don't, ever:** white backgrounds · blue-tinted light · flat overhead burger shots (kills the stack) · visible studio edges · AI-generated or AI-"enhanced" food (a trust killer for a food brand — one caught fake costs more than every real shoot combined).

---

## Part VIII — Business

### 25. Conversion Strategy

**The funnel this design serves:**

```
Reach (TikTok/IG)  →  Land (hero — or QR fast path)  →  Crave (product stages, §10)
→  Tap اطلب  →  Platform handoff (§12)  →  …box arrives  →  Box QR (§20)  →  return visit
```

**Measurement:** primary = platform-link CTR per session. Secondary: scroll depth at first CTA tap · sheet-open → link-tap rate · platform-memory reuse rate · share taps · PWA installs · `src` distribution (box/bag/bio/story). *Note: GitHub Pages has no server analytics — a privacy-light client tool (Plausible-class) is post-V2; the `src`/UTM taxonomy is designed now so day-one data is clean.*

**The conversion levers built into this document:**

| Lever | Section | Mechanism |
|---|---|---|
| Sticky mobile bar | §19 | Recovers order intent at any scroll depth — the thumb is always on اطلب |
| Product-context sheet | §12 | No re-deciding after the tap; the crave carries through the handoff |
| Platform memory | §12 | مرة ثانية؟ — habit formation without an account system |
| Heat ladder + Inferno | §10 | #تقدر_توصل_انفيرنو gives the menu a game and the audience a flex — UGC engine |
| مميز shimmer | §14 | Gentle choice guidance toward hero products |
| Party Box wide stage | §18 | The biggest ticket gets the biggest frame — AOV lever |
| Drinks-before-finale order | §13 | Completeness nudge: the cooldown chapter quietly asks "والمشروبات؟" |
| Finale scene | §13 | The last thing a fully-scrolled visitor sees is the biggest ask on the site |
| Per-product OG images | §10 | Every shared link unfurls as a branded ad |
| Box QR return path | §20 | Retention loop with zero app-store friction |

**Honesty rules (brand-protection):** no fake scarcity, no countdown theater, no dark patterns — premium trust compounds; cheap urgency spends it. جديد stays only while true (30 days max, then the flag comes off in `menu.json`).

**When prices arrive** (the schema is ready — `"price": 32` per product, auto-renders with tabular numerals + SAR): display plainly, round SAR numbers, no `.95` games. Price always appears **after** the crave content in the stage — below image and name, never before them. The order of information is the sales pitch.

---

## Appendix A — Proposed `menu.json` extensions (all optional, all backward-compatible)

```json
{
  "heatLevel": 5,          // 0–5 · absent → no indicator renders (§10)
  "ogImage": "assets/og/red-hit.jpg"   // per-product share card, build-generated (§10)
}
```

Plus data fills (no schema change): `categories[].descriptionAr/En` (§9 room copy) · `heatLevel` assignments · eventual `price` / `orderLinks` per product. Every field follows the existing law: **absent → renders nothing, breaks nothing.**

## Appendix B — Suggested build order (each phase ships behind flags, verify-suite green)

1. **Foundations** — central motion module + `motionOK()` gate · feature-flag config · language veil · heat-line.
2. **Scenes** — hero ignition + scroll cue · category rooms (intro cards, ambient crossfade, drinks grid) · product stage choreography + heat ladder.
3. **Conversion layer** — sticky mobile bar · order-sheet upgrades (context, platform memory) · finale scene.
4. **Premium** — magnetic CTAs · image tilt · haptics · long-press quick sheet · signature chrome.
5. **Surfaces** — QR entry paths + boot skips · per-product OG build step · print QR spec handoff.

## Appendix C — New copy inventory (all pending Mohamed's approval)

| Surface | AR | EN |
|---|---|---|
| Hero badge | الرياض · نار حقيقية | RIYADH · REAL FIRE |
| Boot line | على النار الآن | ON THE FIRE |
| Category intro — burgers | من النار مباشرة | Straight off the fire |
| Category intro — appetizers | الافتتاحية قبل البطل | The opening act |
| Category intro — party box | لليلة اللي تسوى | For the nights that count |
| Category intro — drinks | طفّي الحريقة | Put out the fire |
| Sticky bar CTA | اطلب | Order |
| Finale CTA | جاهز؟ اطلب الآن | Ready? Order Now |
| Platform memory chip | مرة ثانية؟ | Again? |
| Post-handoff toast | تم — كمّل طلبك في التطبيق | Done — finish your order in the app |
| Offline toast | أنت أوفلاين — المنيو المحفوظ معك | You're offline — your saved menu is here |
| QR return toast | رجعت؟ البطل ينتظر | Back for more? |
| PWA install prompt | ثبّت المنيو — أسرع من التطبيقات | Install the menu — faster than the apps |
| Inferno badge | إنفيرنو | INFERNO |
| Heat ladder aria | مستوى الحرارة ٥ من ٥ | Heat level 5 of 5 |
| Campaign hashtag | #تقدر_توصل_انفيرنو | — |

*Existing strings (slogan, bridge, menu UI, platforms) live in `data/site.json` and keep their placeholder-until-approved status.*
