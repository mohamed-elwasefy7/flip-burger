# FLIP BURGER — EXPERIENCE DESIGN BIBLE V3 — EXECUTIVE SUMMARY

**Compressed digest of the full Bible. The complete, authoritative 52-section chaptered Bible lives in [docs/bible/](bible/00-INDEX.md) — where this summary and the full Bible differ, the full Bible wins.**

| | |
|---|---|
| **Document class** | Executive Summary of the Experience Design Bible V3 (full version: [bible/00-INDEX.md](bible/00-INDEX.md)) |
| **Scope** | Every future design decision and every line of code answers to this document |
| **Country** | Saudi Arabia |
| **Audience** | 18–40, mobile-first, delivery-native, social-native |
| **Platforms** | Mobile (primary) · Desktop · QR Menu · PWA |
| **Relationship to other docs** | This Bible is the parent strategic document. `docs/EXPERIENCE-DESIGN-V2.md` is the **technical build spec** for the current live site — it translates Parts of this Bible into GSAP timelines, CSS tokens, and file-level implementation. Where the two disagree, this Bible wins; V2 gets revised to match. |
| **Reality check** | FLIP Burger today is a **cloud brand**: no dining room, no counter, no physical signage a customer walks past. Every experience principle in this document is shaped by that one fact — the screen is not a menu for the restaurant, **the screen is the restaurant.** |
| **Honesty policy** | This Bible does not invent products, metrics, or capabilities that do not exist. Where a category (Chicken, Loaded Fries, Desserts, Kids) or channel (Table QR, NFC, sound, AI generation) is aspirational rather than live today, it is explicitly marked **[FUTURE]**. Nothing here is filler; futures are planned, not fabricated. |

---

## Table of Contents

1. Brand DNA
2. Customer Journey
3. Experience Principles
4. Visual Language Bible
5. Color Psychology
6. Photography Bible
7. Product Storytelling
8. Hero Experience
9. Navigation System
10. Product Page Experience
11. Conversion Psychology
12. QR Experience
13. Motion Bible
14. Sound [Future]
15. Accessibility
16. Performance Budget
17. SEO
18. AI Content System [Future]
19. Design Tokens
20. Future Roadmap

---

# PART 1 — BRAND DNA

### 1.1 Brand Personality & Values

FLIP Burger's personality is built on a single mechanical fact turned into a metaphor: **the flip.** The moment a patty turns on a hot flat-top, char locking in on one side, raw heat meeting the other — that is the brand's entire personality compressed into one gesture. Confident. Irreversible. Done by someone who has done it ten thousand times and still respects the fire.

**Personality axis (use this to judge every future decision — copy, motion, photography, partnerships):**

| Axis | FLIP sits here | Not here | Why it matters |
|---|---|---|---|
| Formal ←→ Street | Street, but skilled-street — not sloppy | Corporate-polite, apologetic | The audience (18–40, Gulf, social-native) disengages from brands that sound like a press release. Skilled-street reads as authentic without reading as amateur. |
| Loud ←→ Quiet | Loud typography, quiet UI chrome | Loud everywhere (screams "cheap"), quiet everywhere (reads "boring") | Loudness has to be *earned and rationed* — see Part 5's red-discipline rule. A brand loud everywhere has no crescendo left for the thing that should actually be loud: the food. |
| Playful ←→ Serious | Serious about craft, playful about culture (memes, challenges, slang) | Playful about food quality, serious about tone-of-voice | Trust the fire, joke about everything around it. Never joke about whether the burger is good. |
| Local ←→ Global | Riyadh-local soul, globally-legible craft (American-style burger built with real fire) | Generic "international fast food" | The brand needs to feel like it belongs to Riyadh's own night culture, not like an imported franchise playbook. |

**Core values (in priority order — when two values conflict, the higher one wins):**

1. **Real fire, no shortcuts.** Every photography, copy, and motion decision must be defensible against the question: "does this feel like it came off an actual flame?" If a choice makes the product feel manufactured, it is wrong, no matter how polished it looks.
2. **Respect the customer's time.** The audience is ordering food on a Thursday night scrolling a phone one-handed. Every friction point removed from scan-to-order is worth more than any visual flourish.
3. **Never look cheap to look premium.** FLIP is priced as a quality cloud brand, not a discount aggregator listing. The experience must justify a price above the lowest bidder on the delivery app.
4. **Culture-fluent, not culture-borrowing.** Gulf slang, TikTok formats, and Riyadh humor are used because the team lives in that culture — not sprinkled on as a marketing trick. If a reference wouldn't land naturally in a voice note between friends, it doesn't ship.

### 1.2 Target Audience & Customer Emotions

**Primary audience:** 18–40, Riyadh-based (expandable to other KSA cities), delivery-app-native, discovers food brands through short-form video before they discover them through search. This audience does not "visit a restaurant's website" as a category of behavior — they tap a link from a Story, a bio, or a scanned box, expecting an immediate payoff.

**Emotional journey the experience must produce, in order:**

| Stage | Target emotion | What produces it | What kills it |
|---|---|---|---|
| First 3 seconds | *"Whoa, this isn't a normal menu."* | Cinematic hero, real fire imagery, confident typography | Slow load, generic stock-photo burger, a spinner |
| Browsing | *"I want that."* (craving, not "that looks fine") | Macro food photography, one product at a time, no clutter | Grid-of-thumbnails fatigue, tiny inconsistent photos |
| Deciding | *"This one. Now."* | Clear hierarchy, honest badges, no decision fatigue | Too many equally-weighted choices, hidden info forcing back-and-forth |
| Ordering | *"That was easy."* | Two taps to the delivery app, remembered platform preference | Forced account creation, dead links, unclear which app to open |
| Waiting | *(brand goes quiet — this belongs to the delivery platform)* | — | FLIP should not pretend to own the delivery tracking experience; it owns the craving and the tap, not the courier |
| Unboxing | *"That's exactly what I expected — better, even."* | Packaging that matches the digital promise; QR that continues the story | A physical box that looks nothing like the site that sold it |
| Return trigger | *"I'm scanning that box again."* | Box QR fast-path, remembered favorites, a reason to come back (heat-ladder challenge, new drop) | No connective tissue between one order and the next |

**The emotion FLIP is not chasing:** comfort, nostalgia, family-dinner warmth. That is Kristo's emotional lane (a different brand in this operator's portfolio — see cross-brand note in Part 1.5). FLIP's lane is **appetite, confidence, and a little bit of dare** (the heat ladder, the challenge culture).

### 1.3 Competitive Positioning

FLIP does not compete against the international fast-food giants on price or footprint — it cannot, and should not try. It competes on **experience density per riyal**: a cloud-only operation can pour everything that would have gone into a physical dining room (rent, front-of-house staff, interior design) into the digital experience and the product itself instead.

**Positioning map:**

```
                    PREMIUM FEEL
                         |
        Global QSR  •    |    • FLIP BURGER
     (generic app        |      (cinematic digital-first,
      listing, low       |       real fire, confident brand)
      differentiation)   |
  ---------------------- + ----------------------  DELIVERY-APP-ONLY  →  PHYSICAL PRESENCE
                         |
     Anonymous cloud •   |    • Established local
     kitchens (no        |      dine-in chains
      brand identity)    |      (physical overhead,
                         |       slower digital innovation)
                    BUDGET FEEL
```

FLIP's white space: **the most cinematic, most digitally-native food brand in its category in the Gulf**, competing with Awwwards-level web craft against competitors who are still running templated aggregator listings. The website itself is a competitive moat that a "just get it on the apps" cloud kitchen cannot casually replicate.

**Named-adjacent references used as craft benchmarks, not tone benchmarks** (i.e. "build like this," not "sound like this"): Apple product pages (restraint, one hero at a time), Tesla configurators (confidence, minimal chrome), Awwwards food/hospitality sites (motion craft). Five Guys and Shake Shack are referenced for **menu simplicity discipline** — small, confident lineups outsell sprawling ones because they remove decision fatigue (see Part 11.2).

### 1.4 Voice, Tone & Brand Philosophy

**Voice** is what FLIP always sounds like. **Tone** is how that voice adjusts to context. FLIP has one voice and three tones.

**Voice constants:**
- Short sentences. Spoken rhythm, not written rhythm — every line should sound like it could be said out loud in one breath.
- Gulf-youth Arabic as the primary voice (اقلب مزاجك, not "نقدّم لكم"). English is the hype layer — fewer words, all caps, louder.
- Confidence without arrogance: FLIP states facts about itself (نار حقيقية / real fire), it doesn't compare itself to competitors by name or insult them.
- Never corporate. Banned phrases: "نفخر بتقديم," "we are pleased to offer," "premium quality ingredients" (show it, don't claim it).

**Three tones:**

| Tone | When | Example |
|---|---|---|
| **Confident-quiet** | Product pages, ordering flow, transactional UI | اطلب / Order — no exclamation marks, no hype needed when the food is already doing the work |
| **Hype** | Hero, campaigns, social captions, challenges | #تقدر_توصل_انفيرنو — loud, playful, dares the audience |
| **Warm-direct** | Error states, offline messages, "coming soon" states | روابط الطلب قريباً — honest, no fake urgency, no corporate apology |

**Brand philosophy in one sentence:** *FLIP does not sell burgers online — it recreates the feeling of standing next to real fire, then gets out of the way so the customer can order.*

### 1.5 Restaurant Identity (Cloud Brand Reality)

FLIP has no physical dining room today. This is not a limitation to hide — it is the design brief. Every square centimeter of budget and attention that a dine-in brand would spend on interior design, signage, and front-of-house experience, FLIP spends on:

1. **The digital experience** (this Bible, and the live site it governs).
2. **The packaging** (the only physical touchpoint — see Part 12.2).
3. **The photography** (the only "interior" the customer ever sees — see Part 6).

**Cross-brand note (context, not scope):** FLIP sits alongside other cloud-kitchen brands in the same operator's portfolio (a Lebanese concept, an Italian-pasta concept, a Najdi-flatbread concept — each with its own Bible and its own emotional lane). FLIP's differentiator inside that family is **fire, youth culture, and dare** — the loudest, most youth-coded brand in the portfolio. This Bible should never be diluted toward the calmer, more heritage-driven tone of sibling brands.

**Implication for every later Part:** because there is no physical space, the website's job description is not "support the restaurant" — it **is** the restaurant. Load time is the door. The hero is the entrance. The product page is the table. The order sheet is the counter. Treat every section of this document with that weight.

---

# PART 2 — CUSTOMER JOURNEY

### 2.1 Before the Scan

The journey does not start when the QR is scanned — it starts on TikTok or Instagram, minutes or days earlier. The audience sees a 2-second cheese-pull clip, a heat-ladder challenge video, or a friend's Story before they ever reach the site. **This means the site must pay off a promise made somewhere else**, not make a first impression cold.

**Design implication:** hero pacing, color, and typography must be recognizable in under half a second to anyone who has seen FLIP content on social — the wordmark, the flame-red-on-black relationship, and the Anton display type are the visual "hook" that must survive the jump from a 9:16 video to a full site.

### 2.2 The Scan-to-Hero Moment

Between the physical scan (a box, a bag sticker, a poster) and the hero rendering, there is a moment of trust extended by the customer — they've just pointed their camera at a sticker and trusted it to take them somewhere real. This moment must resolve **fast** (Part 16 budget: interactive in under 4 seconds on a mid-tier Android over 4G) and must **immediately confirm** they landed in the right place — the flame-red-on-black relationship has to be visible before any content has even finished loading, which is why it lives in the very first paint (background color, not an image).

### 2.3 Discovery (Hero → Categories)

Once inside, the customer is not "browsing a menu" in the spreadsheet sense — they are **walking through rooms** (see Part 9 and the Scene Layout concept in the V2 technical spec). Discovery succeeds when the customer never has to ask "what else is there?" — category identity (distinct heat level, distinct ambient tone) makes the four sections (Burgers, Appetizers, Party Box, Drinks) feel like distinct chapters rather than filter tabs on a database.

### 2.4 Consideration (Product Pages)

This is the highest-stakes screen in the entire experience. The customer has narrowed to "maybe this one" and now decides "yes" or "keep scrolling." See Part 10 for the full hierarchy; the journey-level insight is: **consideration time should feel instant, not effortful.** If a customer has to scroll up to compare two products, the information architecture has failed — every product page must be self-contained enough to decide from, without cross-referencing.

### 2.5 Decision (Ordering)

The decision moment is a single tap on اطلب. Everything before this point has been building appetite; everything after this point (Part 12, order sheet) must remove friction, not add it. The single most important journey metric is **taps-from-craving-to-platform-handoff**, and the target is two.

### 2.6 Delivery Wait & Arrival

FLIP does not own this stage — Keeta, HungerStation, and Jahez do. The brand's discipline here is **restraint**: no attempt to fake a tracking experience, no push notifications the brand doesn't actually have infrastructure for. The one thing FLIP does own during this stage is the **packaging** — the box the courier hands over is the brand's last controlled touchpoint before the food itself does the talking.

### 2.7 Return Visits, Loyalty & Memory

Because there is no loyalty account system today, "memory" is deliberately lightweight and honest: a remembered delivery-platform preference (localStorage, not a login), a remembered favorites list, and — most importantly — a **cultural hook** that brings people back on its own: the heat ladder and the Inferno challenge give the brand a reason to be shared and rescanned that has nothing to do with a points program. This is loyalty through culture, not through infrastructure the brand doesn't yet have.

---

# PART 3 — EXPERIENCE PRINCIPLES

### 3.1 The Experience Principles

Nine words describe how every screen in the FLIP experience should feel. Each is paired with the *test* used to verify a design decision honors it.

| Principle | What it means here | Test question |
|---|---|---|
| **Fire** | Heat is the interface's emotional through-line — glow, ember, char | "Does this scene feel like it's near a flame, or near an office light?" |
| **Fresh** | Nothing feels stale — reveals, photography, and copy status are current | "Would this still feel true if a customer scanned the same box twice this month?" |
| **Fast** | Perceived speed matters as much as measured speed | "Does the customer feel like they're waiting, even if the number says otherwise?" |
| **Energetic** | Motion has intent and direction, never idle | "Is this animation earning its frame budget, or just moving because it can?" |
| **Confident** | The brand states, it doesn't apologize or over-explain | "Could this copy be read out loud without sounding like a disclaimer?" |
| **Minimal** | One idea per screen, one CTA per moment | "If I removed this element, would the customer actually miss it?" |
| **Modern** | Craft-forward, never dated by trend-chasing | "Will this still look considered in two years, or does it lean on a 2026 UI fad?" |
| **Premium** | Feels expensive without adding a single cent to delivery cost | "Does this make the food look worth the price, or does it just look busy?" |
| **Luxury** | Restraint and negative space, not ornamentation | "Am I adding decoration, or am I adding room for the food to breathe?" |

### 3.2 Principle Conflict Resolution

Principles will conflict. **Energetic** wants motion; **Minimal** wants restraint. **Fast** wants brevity; **Premium** wants a considered pause (the boot curtain, Part 8). When two principles pull in opposite directions, resolve in this order: **Fast → Confident → Fire → Premium/Luxury → Minimal → Modern → Fresh → Energetic.** In practice this means: never sacrifice load speed for a premium flourish, but once speed is protected, a considered cinematic pause (fire, premium) outranks pure minimalism, and pure decoration (energetic-for-its-own-sake) loses to everything above it.

---

# PART 4 — VISUAL LANGUAGE BIBLE

### 4.1 Grid, Spacing & Structure

The grid is 4 columns on mobile, 8 on tablet, 12 on desktop — a standard responsive foundation chosen deliberately *because* it is standard: FLIP's differentiation is meant to come from motion, photography, and color, not from an exotic grid that fights legibility. Spacing follows a 4px-anchored scale from 4px to 128px. **Why 4px-anchored:** it is fine enough to make dense UI (badges, chips, meta rows) feel considered, and coarse enough that scene-level spacing (128px between chapters) reads as deliberate breathing room, not an accident of a fluid calculation.

**Structural rule:** content lives inside a maximum reading width even on ultra-wide desktop monitors; ambient/atmospheric layers (glow, texture, ghost type) are the only elements permitted to bleed full-width. This keeps typography legible while letting mood fill the whole screen — the content is a stage set inside an environment, not a webpage that happens to have a background image.

### 4.2 Shape & Material Language

**Corners:** intentionally under-rounded relative to current soft-UI trends. Buttons and panels use small-to-medium radii (structured, like the edges of the physical packaging box), never pill-everything or fully-square-everything. **Why:** the packaging box itself has crisp, printed-ink edges — FLIP's UI should read as an extension of that printed object, not as a generic "friendly app" aesthetic borrowed from software categories that have nothing to do with fire and food.

**Material references, ranked by how much they should show up:**

1. **Matte print-ink** (dominant) — flat, confident color fields with subtle grain, like the box itself.
2. **Charcoal/metal** (secondary) — the flat-top grill surface: dark, slightly reflective at grazing angles only, never glossy head-on.
3. **Glass** (minimal, functional only) — used only where real UI affordance requires it (a sheet's blur backdrop), never as a decorative "glassmorphism" trend layer. Glass reads as *cold*, which fights the fire principle.
4. **Smoke** (atmospheric only) — soft, low-opacity, never obscuring content — smoke is mood, not texture on top of things people need to read.

### 4.3 Fire, Smoke & Light as Visual Elements

Fire, smoke and light are treated as **systemic elements**, not one-off decorations dropped into the hero and forgotten. Each has a defined role:

- **Fire (ember/glow):** the ambient heartbeat of every scene — breathing glow behind category rooms, a pulse on primary CTAs, a shimmer on the hottest products. Fire is *slow* (2.6-second breathing cycle) — fast fire reads as an alert, not an atmosphere.
- **Smoke:** transition material — smoke textures appear at chapter boundaries (the bridge between hero and menu, category-to-category crossfades) as a scene-change device, the way a film uses a wipe or a fade.
- **Light:** always warm-sourced, always motivated by "there is a flame somewhere off-screen." No cold key lights, no blue rim lights, ever — this rule is absolute across UI glow, product photography, and any future video content.

### 4.4 Typography & Iconography System

Typography is deliberately oversized and confident — see Part 19 for the full token scale. The system pairs a **display voice** (Anton — tall, distressed, poster-like; a temporary licensed stand-in until a custom brand display face exists) with a **body/UI workhorse** (Archivo) and an **Arabic display/body companion** (Almarai, carrying equal visual authority, not treated as a secondary/smaller afterthought to the Latin type).

**Iconography:** minimal, line-based, used only for functional affordances (share, favorite, close, order platforms) — never decorative icon sets. **Why:** an icon-heavy interface competes with the photography for attention; FLIP's "icon budget" is small on purpose so every glyph that does appear carries real weight.

**Illustration:** none, by design. FLIP's visual world is built from real photography and typography, not illustrated assets — illustration would introduce a "friendly cartoon" register that undercuts the "real fire" premise (Principle: Confident, Part 3).

### 4.5 Pattern, Texture & Motion-as-Visual-Language

Texture (grain, smoke, subtle noise on flat color fields) exists to prevent the layered-black surfaces from reading as flat digital color — it is the visual equivalent of the packaging box's printed-ink finish. Pattern is used sparingly: the heat-line gradient (red → yellow → red) is the one recurring "pattern" motif, reused across the scroll-progress indicator, badge treatments, and CTA glow — a single signature gradient repeated with intent reads as a system; five different decorative gradients read as noise.

**Motion as a visual element in its own right** (expanded fully in Part 13): the *way* something moves is as much a brand asset as its color. Heavy, weighted, never-bouncy motion is as identifiable to a repeat visitor as the flame-red color itself — this is why the Motion Bible exists as its own Part rather than a footnote to visual design.

---

# PART 5 — COLOR PSYCHOLOGY

### 5.1 Primary & Secondary Palette Meaning

This palette is not a generic "food app" palette — it is extracted directly from FLIP's actual packaging-box artwork (matte black base, flame-red printed ink, burnt orange, warm-yellow lightning bolts, distressed cream lettering), which is why it feels inevitable rather than arbitrary.

| Color | Hex (reference) | Psychological role | Why *this* shade specifically |
|---|---|---|---|
| Flame red | `#c92d1c` | Appetite trigger, urgency, the brand's loudest voice | A deep, ink-like red rather than a bright candy red — candy red reads as a toy or a discount sticker; ink red reads as printed, permanent, serious about fire |
| Fire orange | `#e25822` | Warmth, abundance, the bridge tone that makes red-to-yellow gradients read as one flame | Sits at the exact midpoint that keeps `--grad-ember` looking like combustion, not like a rainbow slider |
| Warm yellow | `#f6a81c` | Peak energy, joy, scarcity-by-design | Used the least of the three — scarcity is what makes it register as "peak heat" rather than "just another accent" |
| Layered warm blacks | `#0d0906` → `#281c13` | The night context that makes food the brightest thing on screen | Never a flat `#000` — a true black photographs as "no lighting design," while a warm black photographs as "considered, intentional darkness" |
| Vintage cream | `#f2e6c9` | Human warmth, hand-craft, trust | Reads as ink-on-paper rather than pixels-on-glass — it is the color of the brand's *handwriting*, distinct from its *fire* |

### 5.2 Contextual Usage Rules

**The one rule that governs all others: the food photograph must always be the most saturated object on screen.** Every color decision in the UI exists to frame the food, never to compete with it.

**Red-discipline rule:** flame red should occupy well under a tenth of any given viewport as a baseline, reserved for two deliberate spikes — CTA surfaces and the hottest heat-ladder products. A color used everywhere loses its ability to mean "urgent" or "hot" at the one moment that matters; scarcity is what gives red its power.

**Category heat-mapping:** each menu category is assigned a position on the palette's heat spectrum — Burgers sit at the hottest, most saturated end; Drinks sit at the coolest end of the *warm* spectrum. Critically, "cooldown" for Drinks is expressed by **dialing down ember intensity and shifting toward deep amber — never by introducing blue.** Blue anywhere in this system (even for "refreshing" drinks) breaks the fire-world illusion the entire brand depends on.

**Semantic color rules:** cream is the only body-text color; secondary information uses a muted warm tone, never gray (gray reads as "disabled" or "corporate," neither of which belongs in this brand); yellow is reserved exclusively for badges, energy-bolts, and heat-peak moments — it never appears as body text, where its high luminance would fatigue the reader.

---

# PART 6 — PHOTOGRAPHY BIBLE

Photography is FLIP's *interior design*. Because there is no physical dining room, the photograph is the only "room" a customer ever stands in — this Part is intentionally the most granular in the Bible.

### 6.1 Camera, Lens & Composition

**Camera angle:** the default hero angle for a burger is low — roughly 10–15° above the table plane, looking slightly up at the stack. **Why:** a low angle makes a burger look tall and imposing (the stack is the hero), while a straight-down overhead angle flattens a burger into a circle and hides exactly the layering that makes it look craveable. Overhead framing is reserved for foods where the *spread* is the story (party boxes, fries cascades) rather than the *height*.

**Lens choice:** a mid-telephoto macro perspective (visually, roughly 85–100mm equivalent) compresses the background and isolates the subject with shallow depth of field on the far edges only — the food itself stays fully sharp edge-to-edge; only the environment beyond it falls soft. **Why not a wide lens:** wide lenses introduce distortion at close range that makes a burger look bulbous or cartoonish — the opposite of the confident, real-object feeling FLIP needs.

**Composition rule:** the product occupies at least 60% of the frame, with generous negative "stage" space around it rather than tight cropping — the negative space is not empty, it is where the ambient glow and ghost typography live in the final composited page (see the V2 technical spec, Part "Product Experience").

### 6.2 Food Styling & Fire/Steam Technique

**Styling truth rule:** every element in frame must be edible and real — real char marks from actual contact with heat, real melted cheese, sauce captured mid-drip rather than pre-set into a static pool. No styling glue, no motor oil standing in for sauce, no cotton-ball smoke. **Why this matters more for FLIP than most food brands:** the entire premise is "real fire" — a single instance of obviously faked styling, if ever noticed by the audience, would undermine the brand's single most important claim.

**Steam capture technique:** steam is photographed live off the actual hot product in a controlled cool room (temperature differential produces visible steam) rather than added digitally — real steam has organic, non-repeating movement that reads instantly as authentic to a generation raised on identifying AI-generated and over-retouched content.

**Fire capture (behind-the-product flame shots):** photographed as a separate controlled element (open flame or a professional flame effect rig) and composited only when the geometry and color temperature genuinely match the product shot — a mismatched flame color temperature is one of the fastest ways professional food photography starts to look "stock."

### 6.3 Category-Specific Shot Recipes

| Category | Primary shot | Supporting shots | Distinct treatment |
|---|---|---|---|
| **Burgers** | ¾ view, low angle, full stack visible | Cheese-pull macro (hero products only), cross-section (shows the build honestly) | Warmest light, most char detail, tallest framing |
| **Chicken** *(when live)* | Same ¾ low-angle language as burgers, for family recognition | Crispy-texture macro (breading/skin detail) | Slightly brighter highlight to sell crunch/texture over char |
| **Appetizers / Sides** | 45° cascade — fries mid-tumble, rings stacked leaning | Overhead spread for shareable items | Faster, "crackling" energy — less posed than the burger hero shots |
| **Loaded Fries** *(when live)* | 45°, toppings avalanche visible from the side, not buried under an overhead angle | Cross-section showing base-to-topping layers | Treated as a "build" shot family, closer to burgers than to plain sides |
| **Party Box** | Top-down full spread with hands reaching in | Lid-open reveal | The only shots with people — they exist purely to sell scale and shared-occasion energy |
| **Drinks** | Straight-on, backlit, condensation visible on the can/bottle | Category-intro hero: backlit condensation on pure black | Cooler, calmer energy — the visual "exhale" after the food shots |
| **Desserts** *(when live)* | Close macro, single hero angle, warm light | Cross-section for layered items | Should read as the "reward" beat — softest lighting in the entire system |
| **Kids** *(when live)* | Bright, simple, single-item framing, no clutter | — | Slightly higher key-light than the adult lineup — approachable without losing the brand's dark-stage identity |

### 6.4 Editing, Retouching & Delivery Specs

**Retouching philosophy:** enhance, never fabricate. Acceptable: exposure, contrast, selective saturation lift on the food itself, minor cleanup of stray crumbs or fingerprints on packaging. Unacceptable: adding cheese pull that wasn't there, painting in steam, AI-generating or AI-"enhancing" any food image. **Why this is a hard line, not a guideline:** food photography that gets caught being faked is one of the fastest ways a delivery-app audience turns hostile in the comments — it costs far more in trust than any single "perfect" shot is worth.

**Aspect ratios:** burgers and appetizers shoot 4:5 or 1:1; party boxes shoot 1:1 or 4:3 top-down; drinks shoot 1:1. These ratios are chosen to serve the product page's portrait-dominant mobile layout (Part 10) without ever requiring a crop that cuts into the top of a stack or the edge of a spread.

**Compression standard:** modern format-first delivery (AVIF primary, WebP fallback, JPG last-resort), multiple width tiers so mobile never downloads a desktop-sized asset, average per-image weight held to a strict budget (see Part 16) — a beautiful photograph that adds a second of load time has already lost the customer before they see it.

---

# PART 7 — PRODUCT STORYTELLING

### 7.1 Category Personality Framework

Every category must feel like a distinct *room*, not a filtered view of the same table. The framework below is what makes that true — each category gets its own temperature, pace, and narrative role in the overall scroll story (expanded in Part 9 and the V2 technical spec's Scroll Narrative section).

| Category | Narrative role | Temperature | Pace |
|---|---|---|---|
| Burgers | The headline act — "why you came" | Hottest | Slowest, most reveal-heavy |
| Chicken *(future)* | The craft-alternative — same fire, different protein | Hot | Same pacing family as Burgers |
| Appetizers | The opening act — builds appetite before the main event | Warm | Faster, crackling energy |
| Loaded Fries *(future)* | The indulgence beat — a build, not just a side | Warm-hot | Similar treatment to burgers, smaller scale |
| Party Box | The wide shot — scale jump from one product to a shared table | Celebration heat | Widest framing, group energy |
| Drinks | The cooldown — narrative relief after the feast | Coolest (still warm-toned, never cold) | Fastest, most compact — a grid, not individual spotlight stages |
| Desserts *(future)* | The reward — the story's dessert, literally and narratively | Warm, soft | Slow, indulgent, closing-chapter energy |
| Kids *(future)* | The approachable aside — simple, bright, uncomplicated | Neutral-warm | Simple, no ladder, no challenge framing |

### 7.2 Burgers & Chicken

**Burgers** are the brand's flagship category and carry the most storytelling weight: every burger page tells a three-beat micro-story — *the build* (ingredients revealed in sequence), *the char* (the visual proof of real fire), and *the bite* (implied by the cheese-pull or cross-section detail shot). Naming direction leans into invented, mixed-heritage names and boxing/fight culture (confident, combative, a little theatrical) — consistent with the brand's "confident-street" personality axis (Part 1.1).

**Chicken** *(future category)* inherits the burger family's visual and narrative treatment rather than getting its own separate identity — the story is "same fire, same craft, different protein," not a competing sub-brand. This keeps a future chicken launch feeling like a natural extension rather than a bolt-on.

### 7.3 Sides, Loaded Fries & Party Boxes

**Appetizers/Sides** exist to build appetite before the main event — their photography and copy should feel *faster* and *lighter* than the burger chapter, functioning almost like a trailer. **Loaded Fries** *(future)* should be treated as a build in their own right (layered, photographed like a small burger rather than a plain side) — this is a common category-expansion opportunity for cloud burger brands and deserves its own visual family from day one of planning, even before it exists on the menu.

**Party Box** is the only category whose photography includes people — reaching hands, a shared table — because its entire narrative job is to sell an *occasion* (a gathering, a group order) rather than an individual craving. It is also the widest framing in the entire site (Part 18 of the V2 technical spec assigns it the widest desktop grid span for exactly this reason).

### 7.4 Drinks, Desserts & Kids

**Drinks** are deliberately under-dramatized relative to food — they render as a dense, efficient grid rather than individual spotlight stages, because 14+ SKUs of near-identical canned beverages do not carry enough narrative distinctness to justify one full "room" each; giving them equal narrative weight to a burger would dilute the whole story's pacing. Their job is completeness and a tonal "exhale," not spectacle.

**Desserts** *(future)* and **Kids** *(future)* are named in this Bible specifically so that, when either category launches, the team has a personality framework ready rather than reverse-engineering one under launch pressure. Desserts should be the story's emotional reward beat (soft light, slow pace, indulgent copy); Kids should deliberately step outside the heat-ladder/challenge framing — nothing about a children's item should be styled as "hot" or "dared."

---

# PART 8 — HERO EXPERIENCE

### 8.1 The Opening Screen & First 3 Seconds

The hero is the front door of a restaurant that has no physical front door — it carries all the weight a real entrance, host stand, and first waft of kitchen smell would carry in a dine-in brand. In the first three seconds, before any product has been seen, the customer must register three things in this order: **(1) this is FLIP** (color + wordmark recognition, see Part 2.1), **(2) this is fire, not a generic burger app** (flame imagery, warm dark staging), **(3) there is somewhere to go** (a visible scroll cue or CTA).

**Why three seconds, specifically:** it is roughly the attention budget a social-native audience extends to a link tapped from a Story or bio before bouncing — the hero has to win, not earn, that budget.

### 8.2 Logo Reveal & CTA Strategy

The wordmark should not simply appear — it should feel *ignited*, as though lit from below, echoing the brand's central "flip" metaphor even in its very first frame. This reveal is a first-visit moment only; a returning customer (tracked lightly via session state) should never sit through the same theatrical beat twice — repetition turns a signature moment into an annoyance.

**CTA strategy:** the hero carries exactly two calls to action, never more — one that invites exploration (اطلب بعد ما تتصفّح / "explore the menu") and one that shortcuts straight to ordering for customers who already know what they want. A hero with three or more competing CTAs signals indecision about what the brand wants the customer to do next; FLIP always knows.

---

# PART 9 — NAVIGATION SYSTEM

### 9.1 Gesture & Scroll Language

Navigation through FLIP is primarily **vertical and continuous** — the customer scrolls through a sequence of rooms rather than jumping between disconnected pages. Horizontal gestures are reserved narrowly: category-chip selection (a single row of quick-jump chips) and nothing else — there is no horizontal product carousel anywhere in the experience, because content hidden behind a swipe is content that does not sell. Every product a customer might crave must be reachable by the one gesture that never fails on any device: scrolling down.

**Why continuous vertical scroll over a tabbed/paginated menu:** pagination forces the customer to make a navigational decision ("which category next?") before they've even seen what's in front of them; continuous scroll lets appetite build naturally, chapter to chapter, the way a real meal builds course to course.

### 9.2 Progress, Transitions & Micro-interactions

**Progress indication** exists so a customer scrolling a long menu never feels lost — a persistent, lightweight signal of "how far into the menu am I" (realized in the technical spec as a heat-tinted progress line) doubles as an atmospheric element rather than a bare utility bar, consistent with the "fire is the interface" principle (Part 3.1).

**Transition grammar:** moving between chapters (categories) should never feel like a hard cut — a brief atmospheric crossfade (color-temperature shift, ember-density shift) signals "you've entered a new room" without breaking the sense of one continuous space. Moving within a chapter (between products) should feel lighter and faster than moving between chapters — the weight of a transition should always match the *size* of the narrative step being taken.

**Micro-interactions** (favoriting, sharing, badge reveals, chip selection) exist to make small moments of engagement feel tactile and rewarding without ever demanding attention away from the food photography — see Part 13.4 for the full motion treatment of each.

---

# PART 10 — PRODUCT PAGE EXPERIENCE

### 10.1 Visual Hierarchy & Reading Flow

Every product page follows one reading order, without exception, because consistency is what lets a customer's eye move faster with every subsequent product they view: **image first, name second, supporting detail third, price fourth (when present), action last.** The image leads because craving is visual before it is verbal; the CTA trails last because the customer should already want the item by the time they reach the button — a CTA that arrives too early reads as pushy rather than earned.

**Balance rule:** a product page should never feel crowded even when every optional field (subtitle, description, ingredients, calories, prep time, badges) is present, and should never feel empty when most of those fields are absent. This is achieved by treating every optional field as additive rather than structural — the layout's core skeleton is just image + name + CTA, and everything else layers on top without shifting that skeleton's weight or position.

### 10.2 Price, Badges & Trust Signals

**Price**, when present, is treated as confirming information rather than persuasive information — it appears after the customer has already been sold by the photography and name, never positioned to compete with them for first attention. Pricing is displayed plainly, in round, honest numbers, with no artificial ".95" discount psychology — FLIP's premium positioning (Part 1.3) depends on pricing reading as confident, not as a bargain trying to look cheaper than it is.

**Badges** (new, spicy, featured/chef's-pick) are trust signals, and trust signals only work if they are scarce and honest. A "featured" badge on every third item stops meaning anything; a "new" badge left on past its actual newness window becomes a small, cumulative credibility loss. The discipline of *removing* badges on schedule is as important as the discipline of adding them.

**Ingredients/description** fields exist for the customer who wants to verify before committing (allergies, preferences, curiosity) — they are secondary-hierarchy by design, present for those who look, invisible in weight for those who don't need them.

---

# PART 11 — CONVERSION PSYCHOLOGY

### 11.1 Best-Seller, Chef's Pick & Bundle Logic

**Best-seller signaling** works because it outsources a decision to the crowd — a customer paralyzed between seven burgers relaxes the moment one is marked as what most people already chose. This only works if the signal is true; a fabricated "best seller" tag, once suspected, poisons every other trust signal on the page.

**Chef's/Featured recommendation** serves a different psychological job than best-seller: it is a *curated* endorsement rather than a *crowd* endorsement, useful specifically for newer or less-obvious items that haven't had time to earn organic popularity yet. The two signals should never both appear on the same item — stacking them dilutes both into generic "trust me" noise.

**Bundles** (the Party Box family) work by trading a small per-item discount for a much larger average order value, and by solving the specific decision fatigue of group ordering ("what does everyone want?") — a bundle is not merely a price trick, it is a decision-fatigue product in its own right, and should be marketed on that convenience, not just on savings.

### 11.2 Urgency, Anchoring & Decision Fatigue

**Urgency**, where used at all, must be real: a genuinely limited-time item, a genuinely closing order window — never a fake countdown timer or fabricated low-stock warning. FLIP's premium positioning cannot coexist with the same manipulative urgency tactics used by discount aggregator listings; the moment a customer catches one fake countdown, they assume every signal on the site is fake.

**Anchoring** happens naturally through category order and framing rather than through explicit "compare" tables — placing the Party Box (highest basket value) with the widest, most celebratory framing on the page makes every individual burger feel reasonably priced by comparison, without ever stating a comparison outright.

**Decision fatigue reduction** is the single most underrated conversion lever available to FLIP, precisely because the menu is genuinely small (roughly two dozen core food items across four categories, per the live product catalog). A small, confident menu — the same discipline that has made simple-menu burger concepts thrive against sprawling-menu competitors — converts better than a large one specifically *because* there is less to decide between. FLIP should resist any future pressure to sprawl the menu just to look more "complete"; smallness is a feature, not a gap.

### 11.3 Social Proof, Habit & Repeat Ordering

**Social proof** at FLIP's current scale comes primarily from culture, not from review counts or star ratings (which the site does not currently display and should not fabricate) — the heat-ladder challenge (#تقدر_توصل_انفيرنو) is itself a social-proof engine: every person who posts themselves attempting the hottest item is proof, in the audience's own native format, that this brand is worth trying.

**Habit formation** without a loyalty-account system is achieved through lightweight, honest memory: a remembered delivery-platform choice removes a repeated decision every return visit, and a remembered favorites list turns a first order into a personalized shortcut for the second one. Neither requires the customer to sign up for anything — the habit is formed by convenience, not by a rewards mechanic.

**Repeat ordering** is ultimately driven by the one channel FLIP fully controls end-to-end: the packaging. A box QR that leads back to a fast, familiar, still-craveable experience is worth more to repeat-order rate than any on-site gimmick, because it re-enters the customer's world at the exact physical moment their appetite for FLIP was just satisfied.

---

# PART 12 — QR EXPERIENCE

### 12.1 QR Surface Map

| Surface | Status | Purpose | Experience on arrival |
|---|---|---|---|
| Packaging box | **Live** | Primary return-visit driver | Fast-path landing, skips the cinematic boot, greets a repeat customer like a regular |
| Delivery bag sticker | **Live** | Secondary return-visit driver | Same fast path, quieter tone (no greeting toast — this customer is mid-delivery, not mid-browse) |
| Social bio / Story links | **Live** | Primary acquisition driver | Full cinematic hero — this is first-impression traffic and deserves the complete opening |
| Flyer / poster | **Planned** | Local/offline acquisition | Same fast-path treatment as the box — a physical print in the wild deserves the same instant-payoff respect as packaging |
| Table QR | **[FUTURE — requires a physical counter/dine-in presence]** | On-premise ordering | Not applicable until FLIP has any physical point of presence; specified here so the team isn't designing this cold if that day comes |
| NFC tap | **[FUTURE]** | Frictionless box/bag tap-to-order | Would inherit the same fast-path landing as box QR — NFC is a delivery mechanism for the same destination, not a different experience |

**Why every physical surface routes through a tagged fast path rather than the full hero:** a customer scanning a box or bag has almost certainly already been through the full hero once before (they already have the food in hand); making them sit through the theatrical opening a second time treats a returning customer worse than a first-time one, which is backwards.

### 12.2 PWA & Offline Strategy

The installable app (PWA) exists to close the gap between "visits a website" and "has an app" without the cost, friction, and app-store approval overhead of building a native app the brand's current scale doesn't yet justify. Its value proposition to the customer must be stated honestly and specifically — faster access than reopening a delivery-platform app to search for the brand again — not a vague "install our app" ask with no clear payoff.

**Offline behavior** is treated as a dignity issue, not just a technical fallback: a customer who loses signal mid-browse should see their already-loaded menu remain fully readable, with only the ordering handoff (which genuinely requires network, since it hands off to third-party delivery apps) showing a clear, honest, reason-attached unavailable state — never a broken blank screen, and never a fake "working" spinner over a dead connection.

---

# PART 13 — MOTION BIBLE

### 13.1 Motion Philosophy & Timing System

**Philosophy in one line: motion behaves like heat, not like a UI toolkit's default easing curve.** Things rise the way heat rises (slow, drifting, never snapping to a stop), settle the way real weight settles (a small overshoot-free deceleration, never a bounce), and glow the way embers breathe (slow, cyclical, alive without being busy). This is what makes FLIP's motion recognizable as *FLIP's* motion rather than "a nice animation library used by hundreds of other sites" — the timing values themselves become a piece of brand identity.

**Timing tiers**, each with a defined role so that no two animations on screen ever compete for the same kind of attention at the same time:

| Tier | Feel | Governs |
|---|---|---|
| Fast | Instant physical feedback | Presses, toggles, hover states |
| Standard | Considered but responsive | Panel opens, state changes |
| Reveal | Cinematic, unhurried | Content entering the scene for the first time |
| Ambient | Slow, cyclical, alive | Glow, ember drift, breathing effects that loop indefinitely |

**Momentum and easing rule:** entries decelerate into place with weight (never a linear or bouncy arrival); exits accelerate away faster than entries arrived — leaving should always feel quicker than arriving, because lingering on the way out reads as friction, not elegance.

### 13.2 Micro-interactions & Reduced Motion

**Micro-interactions** are the small proofs that the interface is alive and listening: a chip that visibly acknowledges selection, a favorite action that feels satisfying rather than merely functional, a share action that confirms itself clearly. Each one is scoped tightly — a small, quick, purposeful movement, never a showpiece animation competing with the food photography for attention. **Discipline rule:** at most one "showpiece" (narrative-tier) animation should be active in the viewport at any moment; ambient and micro-interaction motion can layer, but two large cinematic reveals fighting for attention at once reads as chaotic rather than premium.

**Reduced motion is a first-class contract, not an afterthought.** Any customer whose device or OS requests reduced motion receives the entire experience with all decorative and ambient animation collapsed to instant or near-instant — every section, every reveal, every ember effect described anywhere in this Bible must degrade gracefully to a static equivalent that loses zero information and zero functionality. This is treated as an accessibility non-negotiable (see Part 15), never as an edge case worth skipping under deadline pressure.

---

# PART 14 — SOUND [FUTURE]

Sound is not part of the live experience today, and this Bible does not currently recommend adding it as a default-on feature — ambient food-delivery browsing overwhelmingly happens in public, silent-phone contexts (on a bus, in a meeting, next to a sleeping roommate), and unsolicited audio is one of the fastest ways to make a customer close a tab in mild panic.

**Where sound could someday add real value, opt-in only, never autoplaying:** a subtle sizzle cue tied deliberately to a single high-intent moment (the platform-tap that completes an order, functioning like a satisfying "confirmation click"); ambient environmental sound as an optional toggle for customers who want fuller immersion; sound design for future video content (the motion-master food clips described in Part 6) which lives on social platforms with their own native sound conventions, not on the site itself. Any future sound implementation must default to off and require an explicit, visible opt-in — never assume the customer wants audio just because the brand does.

---

# PART 15 — ACCESSIBILITY

### 15.1 WCAG Compliance Framework

FLIP targets WCAG 2.2 Level AA compliance as a floor, not a ceiling. This is treated as inseparable from the premium positioning of the brand (Part 1.3): a "premium" experience that silently excludes customers using assistive technology, or customers who simply prefer larger touch targets and calmer motion, is not actually premium — it is premium-looking for only part of the audience.

### 15.2 Practical Accessibility Rules

- **Touch targets:** every interactive element meets a minimum comfortable tap size — no small icon-only buttons crammed together, especially in the ordering flow where a mis-tap has real consequence.
- **Contrast:** body text against every background surface meets or exceeds AA contrast ratios; the brand's signature warm-yellow accent is never used for body text specifically because its high luminance against dark backgrounds fails sustained-reading contrast comfort even where it technically passes a contrast checker.
- **Screen readers:** every scene has a coherent semantic structure (proper heading levels, one primary heading per page, descriptive labels on icon-only controls) so a screen-reader user experiences the same product hierarchy — image, name, detail, action — that a sighted user experiences visually.
- **Motion sensitivity:** covered fully in Part 13.2 — reduced-motion is a complete-experience contract, not a partial degradation.
- **Keyboard/alternate input:** every action reachable by touch or mouse (browsing, favoriting, sharing, ordering) must also be reachable by keyboard alone, with visible focus states styled consistently with the brand's ember-glow visual language rather than a generic browser-default outline that clashes with the dark theme.
- **Language switching:** the interface fully supports right-to-left Arabic and left-to-right English with equal visual polish in both directions — RTL is not a "translated afterthought" layout, it is the *default* layout given Arabic is the brand's primary voice (Part 1.4).

---

# PART 16 — PERFORMANCE BUDGET

Performance is treated as a **brand attribute**, not an engineering nice-to-have — every second of delay directly contradicts the "Fast" experience principle (Part 3.1) and directly costs conversions at the exact moment appetite is highest.

### 16.1 Core Web Vitals & Lighthouse Targets

| Metric | Target | Why this specific bar |
|---|---|---|
| Largest Contentful Paint (LCP) | Under 2.5 seconds, tested on a mid-tier Android device over a realistic 4G connection | This is the moment the hero's dominant visual element (flame imagery/wordmark) is judged "arrived" — beyond this window, the cinematic effect is wasted on a customer who has already started doubting the page loaded |
| Cumulative Layout Shift (CLS) | As close to zero as the platform allows | Nothing undermines a "premium" feeling faster than content jumping under a customer's thumb mid-tap — every image and dynamic element must reserve its space before content arrives |
| Interaction to Next Paint (INP) | Under 200 milliseconds | A tap on اطلب that hesitates, even briefly, reads as the brand hesitating |
| Total Blocking Time | Kept low enough that scrolling and tapping never stutter during page load | The customer is often mid-scroll while assets are still arriving — blocking that scroll is one of the most noticeable performance failures a customer can experience |

### 16.2 Caching, Lazy Loading & Offline

**Caching strategy:** the shell of the experience (navigation, fonts, core structure) should be available near-instantly on repeat visits, while content that genuinely changes (the live menu data) always prefers a fresh network fetch first, falling back to a cached copy only when offline — this ordering matters because a stale menu (wrong prices, a removed item still showing as orderable) is a worse failure mode than a slightly slower fresh fetch.

**Lazy loading:** only the very first product a customer will see loads with priority; everything below the fold loads as the customer approaches it — this keeps the initial payload lean without ever making a customer wait for an image that's already scrolled into view.

**Offline resilience:** covered in Part 12.2 — a previously-visited menu should remain fully browsable with no network at all, because a customer's data connection dropping is not a reason for the brand's most important surface to go blank.

---

# PART 17 — SEO

### 17.1 Structured Data & Sharing

Every product should carry machine-readable structured data (name, image, category, availability) so that search engines and any future AI-driven discovery surfaces can correctly represent FLIP's menu rather than guessing at it from raw page text — this matters increasingly as customers discover food brands through AI assistants and voice search, not only through traditional search results pages.

**Open Graph / sharing:** every shareable link (a specific product, the site itself) must unfurl with a branded, on-message image and title when pasted into a chat or posted to social — a shared link that unfurls as a blank gray box or a generic site icon is a wasted, free advertising impression at the exact moment a customer was excited enough about a product to share it with a friend.

### 17.2 Indexing Strategy

The live, customer-facing menu experience should be fully indexable and discoverable; any internal, development-only, or placeholder surfaces (an internal design-system preview page, a branded error page) should be explicitly excluded from indexing so search results only ever surface pages meant for customers. Sitemap and robots configuration should be kept current as the site's real deployed domain, never left pointing at placeholder values — a search engine or social platform crawling a broken placeholder URL actively damages discoverability rather than merely failing to help it.

---

# PART 18 — AI CONTENT SYSTEM [FUTURE]

This Part describes a **future capability roadmap**, not a live system. Nothing here is implemented today; it exists so that when AI-assisted content production becomes part of the workflow, it inherits the same brand discipline as everything else in this Bible rather than being bolted on ad hoc.

### 18.1 AI Image/Video Generation Future

**The hard line, restated from Part 6.4:** AI-generated or AI-"enhanced" imagery must never be used to depict the actual food product itself, under any future workflow. The one claim FLIP cannot afford to have doubted is "this is what real fire actually does to real food" — a single instance of the audience correctly identifying an AI-generated food image would do disproportionate damage to that claim.

**Where AI generation genuinely could help, once mature enough to meet the brand's photography bar:** background/atmosphere elements that are not the food itself (ambient smoke or ember texture assets, provided they are indistinguishable in quality from the real practical effects they'd replace), rapid concept exploration for campaign art *before* a real photography or video shoot, and social-content variation (resizing, reframing existing real footage for different platform aspect ratios) rather than generating new footage from nothing.

### 18.2 Automated Content Pipeline

**Automated product pages:** as the menu grows, a templated pipeline that turns a structured data entry (name, category, description, image set) into a fully-styled product page with zero manual layout work is a natural efficiency gain — the product page hierarchy defined in Part 10 is deliberately rigid and rule-based specifically so it can be automated later without redesigning it from scratch.

**Future automation roadmap:** automated resizing/compression of new photography into every required format and tier (already a live, non-AI pipeline today — see the technical build spec); automated social-caption drafting in the brand's established voice (Part 1.4) as a first-draft assist, always human-reviewed before publishing, never auto-posted; automated detection of stale badges (a "new" tag that has silently outlived its honesty window, per Part 10.2) so trust-signal discipline doesn't depend entirely on someone remembering a date.

---

# PART 19 — DESIGN TOKENS

Design tokens are the atomic values every other Part in this Bible ultimately compiles down to. They are listed here as a **conceptual reference table** — the literal implementation values live in the technical build spec (`docs/EXPERIENCE-DESIGN-V2.md`) and its underlying stylesheet, and must always be kept in sync with the principles below.

| Token category | What it governs | Governing principle from this Bible |
|---|---|---|
| **Spacing** | The 4px-anchored scale from tight UI spacing to full chapter breathing room | Part 4.1 — fine enough for density, coarse enough for drama |
| **Radius** | Corner treatment across buttons, panels, cards | Part 4.2 — structured, printed-ink edges, never fully pill-shaped or fully square |
| **Shadow** | Depth cues that lift elevated surfaces (sheets, modals, floating product imagery) off the base scene | Part 4.2 — real dimensional depth, not flat card-stacking |
| **Opacity** | Ambient-layer intensity, disabled/unavailable states, ghost-typography texture levels | Part 4.5 / Part 5.2 — scarcity and restraint as a deliberate visual value |
| **Timing** | The four motion tiers (fast / standard / reveal / ambient) | Part 13.1 — the timing system is itself a brand asset |
| **Color** | The full palette and its category heat-mapping | Part 5 in full |
| **Typography** | The display/body/Arabic-companion type scale, from UI labels to oversized hero wordmark scale | Part 4.4 / Part 6 (photography's typographic overlay treatment) |

**Governing rule for all tokens:** a token exists to enforce consistency, not to be overridden ad hoc for a single component. Any one-off value introduced outside this token system should be treated as a signal that either a new token is genuinely needed (and should be added here first, then implemented) or that the design under review has drifted from the Bible and needs to be corrected back toward it — never the reverse.

---

# PART 20 — FUTURE ROADMAP

This roadmap sequences future work by **narrative and business priority**, not by technical convenience — each phase should ship as a complete, coherent experience upgrade rather than a pile of disconnected feature flags.

### Phase 1 — Foundation Completion

Finish and polish everything this Bible and its technical companion already specify for the current four-category menu: the full scroll narrative, the heat-ladder system, the conversion levers in Part 11, and the accessibility/performance floors in Parts 15–16. **Why first:** every later phase assumes this foundation is solid; expanding the menu or adding channels before the core experience is fully realized compounds technical debt rather than brand value.

### Phase 2 — Category Expansion

Introduce the categories already given a personality framework in Part 7 but not yet live — Chicken as a direct extension of the burger family, Loaded Fries as their own build-forward sub-story, and eventually Desserts and Kids. **Why in this order:** Chicken and Loaded Fries extend existing craving patterns with minimal new narrative invention; Desserts and Kids require genuinely new tonal registers (reward, approachability) and should wait until the team has bandwidth to do them justice rather than reusing the fire/heat-ladder framing where it doesn't belong.

### Phase 3 — Channel Expansion

Extend the QR surface map (Part 12.1) into its currently-planned-but-not-live surfaces (flyers/posters at first, then any print or partner placement), and evaluate NFC as a friction-reducing complement to QR on packaging — not a replacement, since QR remains universally scannable without any special hardware.

### Phase 4 — Intelligence Layer

Introduce the AI-assisted content pipeline described in Part 18, once its output quality can be held to the same non-negotiable authenticity bar as human-shot photography (Part 6.4) — this phase is explicitly gated on quality, not on calendar time. In parallel, evaluate lightweight, privacy-respecting analytics (referenced but not yet implemented in the technical build spec) so future decisions in this Bible can be grounded in real conversion data rather than intuition alone.

### Future Expansion

Longer-horizon possibilities that remain directionally consistent with everything above, to be revisited only once Phases 1–4 are genuinely complete: a physical point of presence (which would activate the currently-future Table QR and in-person experience Parts of this Bible), a formal loyalty mechanic (built on top of, not replacing, the honest lightweight memory described in Part 11.3), and sound design for a genuinely opt-in, immersive experience tier (Part 14). None of these are commitments — they are placeholders so that if FLIP's business grows into needing them, the team is extending a considered plan rather than improvising one under pressure.

---

## Closing Note

This Bible describes a brand that behaves as if it has always known exactly what it is: real fire, confident voice, one verb, no shortcuts. Every section above exists to protect that clarity as the team, the menu, and the channels grow — when in doubt, the fastest way to resolve any future design question is to ask which choice a brand this confident would actually make, and build that.
