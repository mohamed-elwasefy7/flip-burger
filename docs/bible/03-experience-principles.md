# Chapter 03 — Experience Principles

*Sections 11–13 · How every screen should feel, how conflicts between feelings get resolved, and what each surface owes the customer.*

---

## 11. The Nine Principles

Nine words describe how every FLIP screen should feel. Each principle carries a **test question** — the fastest way to audit a design without a committee. A screen that fails its relevant test gets revised, no matter who designed it.

| # | Principle | What it means at FLIP | Test question |
|---|---|---|---|
| 1 | **Fire** | Heat is the emotional through-line: glow, ember, char in every scene | "Does this scene feel like it's near a flame — or near an office light?" |
| 2 | **Fast** | Perceived speed is brand personality, not a lab number | "Does the customer ever *feel* like they're waiting?" |
| 3 | **Confident** | The brand states; it never apologizes, hedges, or over-explains | "Could this copy be read aloud without sounding like a disclaimer?" |
| 4 | **Premium** | Feels expensive without adding a riyal of cost or a second of delay | "Does this make the food look worth its price — or just look busy?" |
| 5 | **Luxury** | Restraint and negative space, never ornamentation | "Am I adding decoration, or adding room for the food to breathe?" |
| 6 | **Minimal** | One idea per screen; one call-to-action per moment | "If I removed this element, would anyone actually miss it?" |
| 7 | **Modern** | Craft-forward; never dated by chasing a current UI trend | "Will this still look considered in two years?" |
| 8 | **Fresh** | Nothing feels stale — content, badges, reveals stay current | "Would this feel true to someone scanning the same box twice this month?" |
| 9 | **Energetic** | Motion has intent and direction; nothing moves idly | "Is this animation earning its frame budget, or moving because it can?" |

### 11.1 Worked examples — pass and fail

Principles are only real when they reject things. Three concrete rulings, recorded so future debates can cite precedent:

- **A looping flame video background behind the whole menu.** Fails *Fast* (weight), *Minimal* (competes with food), and *Energetic* (motion without intent). Rejected — ambient ember layers achieve the fire feeling at a fraction of the cost. Fire ≠ literal video of fire everywhere.
- **An exclamation mark on the order button (اطلب الآن!).** Fails *Confident* — a brand sure of its food doesn't shout at the moment of purchase. The period-free, exclamation-free اطلب is the entire persuasion.
- **A "٪٢٠ خصم اليوم فقط" countdown banner.** Fails *Premium* and the honesty policy simultaneously. FLIP runs real offers through the delivery platforms where offers belong; the brand site never wears a discount-store costume.

---

## 12. Conflict Resolution

### 12.1 The priority order

Principles collide daily: *Energetic* wants motion, *Minimal* wants stillness; *Premium* wants a considered pause, *Fast* wants no pauses at all. Unresolved, these conflicts get settled by whoever argues longest. Resolved, they get settled by this fixed order:

> **Fast → Confident → Fire → Premium/Luxury → Minimal → Modern → Fresh → Energetic**

Read it as: never sacrifice speed for anything; given speed, never sacrifice the brand's confident voice; given both, protect the fire-world; then premium restraint beats minimalist emptiness; and pure motion-for-motion's-sake (*Energetic* alone) loses to everything above it.

### 12.2 Why this specific order

- **Fast first** because speed failures are the only ones the customer punishes *before experiencing anything else* — a slow cinematic site is judged as slow, never as cinematic.
- **Confident second** because voice inconsistency compounds: one apologetic screen makes every confident screen read as a costume.
- **Fire third** because it is the differentiator — but it sits below Fast and Confident because a fire-world nobody waits for, delivered hesitantly, serves no one.
- **Energetic last** because it is the most abundant instinct and the least scarce resource; motion ideas are cheap, restraint is expensive.

### 12.3 Three precedents, decided by the order

| Conflict | Tension | Ruling |
|---|---|---|
| Boot sequence: cinematic opening vs. instant load | Premium vs. Fast | Fast wins the *ceiling* (hard time cap, skip paths for returners and slow connections); Premium wins *within* that ceiling (the opening exists, but capped). Neither principle is deleted — Fast sets the boundary, Premium fills it. |
| Hero: add a third CTA for the challenge campaign? | Fresh/Energetic vs. Minimal/Confident | Confident + Minimal win: two CTAs maximum, forever. Campaigns get expressed *inside* the menu (heat ladder, badges), not by crowding the front door. |
| Product reveals: longer, more elaborate animation? | Energetic vs. Fast/Minimal | Fast wins: the reveal budget is fixed; elaboration must fit inside it or be cut. An animation the customer waits for has already failed. |

---

## 13. Per-Surface Feel Standards

Every surface in the experience has a defined *feel target* — the adjective pair it must hit — because "make it feel premium" is unactionable while "this surface is theatrical-brief" is a spec.

| Surface | Feel target | The standard |
|---|---|---|
| **Boot / opening** | Theatrical, brief | The one moment of permitted theater; hard-capped, skipped for returners. It is a curtain, not a lobby. |
| **Hero** | Vast, igniting | The biggest visual breath on the site; everything oversized; exactly two CTAs. |
| **Menu bridge** | A held breath | Deliberately quiet transitional beat between hero spectacle and menu appetite; small type, smoke, one line of copy. Its quietness makes both neighbors louder. |
| **Category rooms** | Distinct, atmospheric | Each room instantly distinguishable by heat and pacing with eyes half-closed; the walk between rooms is felt, not announced. |
| **Product stages** | Craveable, self-contained | The food owns the frame; every decision-relevant fact present; CTA arrives last in the reading order. |
| **Order sheet** | Swift, remembering | The counter, not a lobby: two taps, remembered platform, product context carried through. |
| **Toasts & feedback** | Quiet, certain | One at a time, brief, factual (تم نسخ رابط المنتج) — confirmation, never celebration. |
| **Empty / coming-soon states** | Honest, promising | A placeholder must look like a promise, never like a bug: روابط الطلب قريباً states reality plainly and stays on-brand. |
| **Offline state** | Dignified | The saved menu remains readable; only ordering (which truly needs network) declines, with its reason stated. Losing signal never means losing the restaurant. |
| **404 / error** | Composed, in-world | Even the wrong turn stays inside the fire-world; a branded dead-end that offers the way home, never a raw error page. |

### 13.1 The standard behind the standards

Each feel target above is derivable from the same procedure: identify what the customer is *doing* on the surface (arriving, deciding, recovering, waiting), identify which principle pair serves that action best, and delete everything on the surface that serves neither. When a future surface is invented — a campaign page, a seasonal drop, a physical-presence screen someday — this procedure generates its feel target; the table grows, but the method doesn't change.
