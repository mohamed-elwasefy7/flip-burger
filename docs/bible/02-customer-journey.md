# Chapter 02 — Customer Journey

*Sections 6–10 · The complete path from first TikTok glimpse to the second scanned box — and where each stage can fail.*

---

## 6. The Journey Map

### 6.1 The full loop

FLIP's journey is a **loop, not a funnel**. A funnel ends at purchase; FLIP's economics depend on the box in the customer's hands starting the next cycle. The map:

>     TikTok / Instagram clip
>            │  (promise made)
>            ▼
>     Tap link / scan QR ──────────────┐
>            │                          │ returning customer:
>            ▼                          │ fast path, skips the
>     HERO — the front door             │ theatrical opening
>            │                          │
>            ▼                          │
>     BROWSE — walking the rooms        │
>     (Burgers → Appetizers →           │
>      Party Box → Drinks)              │
>            │                          │
>            ▼                          │
>     CONSIDER — one product page       │
>            │                          │
>            ▼                          │
>     DECIDE — tap اطلب                 │
>            │                          │
>            ▼                          │
>     HANDOFF — Keeta / HungerStation   │
>               / Jahez completes it    │
>            │                          │
>            ▼                          │
>     WAIT — (brand goes quiet)         │
>            │                          │
>            ▼                          │
>     UNBOX — packaging + box QR ───────┘
>            (promise kept → loop restarts)

### 6.2 Stage ownership

A journey map is only useful if it is honest about what the brand controls. FLIP fully owns the site experience and the packaging; it partially owns social (algorithms mediate); it does **not** own checkout, payment, or delivery — the platforms do. Design effort concentrated on stages FLIP doesn't own is wasted; design effort at the *handoff boundaries* (the tap out to a platform, the box arriving back) is the highest-leverage work in the whole journey, because boundaries are where customers get dropped.

### 6.3 Journey KPIs

| Stage | Metric | Why this metric |
|---|---|---|
| Land | Interactive time on mid-tier Android | The door either opens fast or the customer leaves |
| Browse | Scroll depth reaching the first product | Measures whether the hero's promise pulled anyone inward |
| Consider | Time-to-first-crave (first product fully revealed) | Under 10 seconds — appetite is a momentum game |
| Decide | Platform-link CTR per session | **The north-star metric** — everything else serves it |
| Handoff | Sheet-open → platform-tap rate | Detects friction at the last, most expensive step |
| Return | Share of sessions arriving via box/bag QR | Measures whether the loop actually loops |

---

## 7. Before the Scan — Acquisition

### 7.1 The journey starts on someone else's platform

The customer's first FLIP experience is almost never the website — it is a 2-second cheese-pull clip, a heat-challenge video, or a friend's Story, seen minutes or days before any scan or tap. **The site therefore never makes a first impression cold; it pays off a promise made elsewhere.** This reframes the hero's job (Chapter 8): not "introduce the brand" but "confirm the customer arrived at the thing they saw."

### 7.2 Channel roles

| Channel | Job | What the site owes it |
|---|---|---|
| TikTok / Reels | Craving ignition at scale; challenge culture | Visual continuity — the wordmark, flame-red-on-black, and type must be recognizable within half a second of landing |
| Instagram bio link | The permanent doorway | Full hero experience — this is majority first-time traffic |
| Story swipe-ups | Time-sensitive pushes (drops, campaigns) | Fast path landing — story traffic is impulsive; do not make it re-watch an intro |
| Friend's shared product link | Peer endorsement, the strongest acquisition | The link must unfurl as a branded product card and open directly on that product, already highlighted |
| The physical box QR | Retention re-entry (Section 10) | The fastest possible path — this customer has already been converted once |

### 7.3 The promise-payoff contract

Every piece of social content makes an implicit promise the site must keep. A slow-motion flip clip promises *cinema* — the site must feel cinematic. A challenge video promises *heat* — the heat ladder must be findable within one scroll of landing. Marketing and site design are therefore not separate disciplines with separate documents; both answer to this Bible, and a campaign that promises something the site doesn't deliver is a brand defect, not a marketing success.

---

## 8. Scan → Hero → Browse

### 8.1 The trust window

Between a scan (pointing a camera at a sticker and trusting it) or a tap and the first rendered paint, the customer extends a small act of trust. This window must resolve in single-digit seconds on a mid-tier Android over 4G, and the **very first visible frame must already be brand-true**: the warm-black background and flame-red relationship arrive with the first paint itself, before any image or font, so that even a slow connection shows *FLIP loading* rather than *a white page loading something unknown*.

### 8.2 First-visit vs. returning-visit doors

One door does not fit both visitors. The first-timer deserves the full theatrical opening (the ignition, the reveal — Chapter 8, Section 34); the returner who scanned the box in their kitchen deserves to be treated like a regular, not a tourist:

| Visitor | Detected via | Experience |
|---|---|---|
| First-time | No prior session state; bio/social entry | Full cinematic hero — the brand's one chance at a first impression |
| Same-session return | Session state | No boot theater; instant hero |
| Box / bag QR arrival | Tagged entry path | Skips the opening entirely; lands at the menu bridge, greeted as a returner |

**Why this is a journey decision, not a technical detail:** replaying an intro to someone holding your empty box tells them you don't remember them. Memory — even this lightweight, account-free memory — is hospitality.

### 8.3 Browsing as walking, not filtering

Once inside, the customer walks a continuous vertical path through four distinct rooms (Burgers → Appetizers → Party Box → Drinks), each with its own heat, pacing, and personality (Chapter 7). Browsing succeeds when the customer never has to ask "what else is there?" — the next room is always announcing itself at the edge of the current one. It fails when the experience collapses into a filterable database, because databases inform but never seduce.

---

## 9. Consider → Decide → Handoff

### 9.1 Consideration: the highest-stakes screens

The product page is where "maybe" becomes "yes" or "keep scrolling." The full hierarchy lives in Chapter 8 (Section 37); the journey-level law is **self-containment**: every product page must contain everything needed to decide — image, name, what's in it, heat level, price when available — without scrolling elsewhere to compare. The moment a customer must hold two products in working memory across screens, decision fatigue starts, and fatigue's resolution is usually "close the tab," not "pick one."

### 9.2 Decision: one tap, one verb

The decision is a single tap on اطلب. Everything before built appetite; everything after must be frictionless. The target is **two taps from any product to an open delivery-platform app** — one on اطلب, one on the platform card. Every additional tap between craving and platform measurably bleeds orders, because appetite decays in seconds, not minutes.

### 9.3 The handoff: FLIP's last controlled moment

The tap on a platform card is simultaneously the site's conversion and its exit. Three design obligations at this boundary:

1. **Continuity** — the order sheet shows *which product* launched it, so the handoff feels like a continuation of the craving, not a restart into a generic app.
2. **Memory** — the customer's last-used platform is remembered and offered first (مرة ثانية؟ / *Again?*), removing a repeated decision from every future order.
3. **Grace** — when platform links aren't yet live, the state says so honestly (روابط الطلب قريباً) rather than pretending or hiding.

### 9.4 The wait: designed silence

Between platform handoff and doorbell, FLIP deliberately goes quiet. No fake tracking, no notification theater the brand has no infrastructure to honor. **Why silence is a decision and not an absence:** pretending to own a stage the platforms actually control creates failure points FLIP cannot fix — a "tracking" screen that contradicts the platform's own tracking destroys more trust than silence ever could. The brand's next word is physical: the box.

---

## 10. Delivery, Unboxing, Return & Loyalty

### 10.1 Unboxing: the promise audit

The box is the only moment the digital promise gets physically audited. A customer who scrolled a cinematic fire-world and then receives a box that looks like generic packaging experiences the gap as *dishonesty*, even if the food is excellent. Therefore packaging design answers to the same visual language as the site (Chapter 4): matte black, flame-red ink, cream lettering — the box must look like the website made physical, because in brand terms, it is.

### 10.2 The box QR: the loop's hinge

Printed inside the box lid — positioned so it faces the customer at the exact moment of peak satisfaction — the QR restarts the journey (full specification in Chapter 9, Section 42). It arrives at the fastest, most familiar version of the experience and greets the customer as a regular: رجعت؟ البطل ينتظر / *Back for more?* This single printed square is FLIP's entire retention infrastructure today, and it is enough — because it re-enters the customer's world at the one moment their appetite for FLIP was just proven right.

### 10.3 Loyalty without a loyalty program

FLIP has no accounts, points, or tiers today — and this Bible treats that as a constraint to design *well within*, not to apologize for. Loyalty is built from three honest, lightweight mechanisms:

| Mechanism | What it remembers | Why it works |
|---|---|---|
| Platform memory | The delivery app you used last time | Removes one decision per repeat order; habit is the cheapest loyalty there is |
| Favorites | The products you marked | Turns the second visit into a personalized shortcut with zero signup cost |
| Cultural hook | Nothing on-device — the heat-ladder challenge lives in culture | Gives people a reason to return, post, and dare friends that no points program can buy |

### 10.4 Memory as hospitality

The thread through this whole chapter: **memory is the digital version of a host who remembers your order.** Every remembered preference, every skipped intro, every "again?" is hospitality performed by software. A future loyalty program (Chapter 11, Section 52) may formalize this, but the principle precedes any program: FLIP treats returning customers as regulars, with or without an account system.
