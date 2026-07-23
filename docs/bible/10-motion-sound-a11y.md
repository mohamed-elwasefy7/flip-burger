# Chapter 10 — Motion, Sound & Accessibility

*Sections 44–47 · How the experience moves, why it stays silent, and the guarantee that it excludes no one.*

---

## 44. Motion Philosophy & Timing

### 44.1 The philosophy

> **Motion behaves like heat — never like a UI toolkit's default easing curve.**

Things rise the way heat rises: slow, drifting, never snapping. Things settle the way weight settles: decelerating into place with mass, never bouncing. Glow breathes the way embers breathe: cyclical, alive, unhurried. **Why physics-of-heat as the master metaphor:** it makes every animation decision *derivable* instead of debatable — when a new animation is needed, the question is never "what looks cool?" but "what would heat do?" — and it makes FLIP's motion a recognizable brand asset in its own right. A repeat visitor can identify FLIP's motion signature the way they identify its red; a site using library-default bounces is anonymous in motion even if branded in color. The founding law, inherited from the brand's first design system and permanent: **heavy, smooth, controlled, cinematic — never bouncy.**

### 44.2 The four timing tiers

Every animation in the experience declares one tier; the tiers exist so no two motions compete for the same kind of attention at once:

| Tier | Character | Governs | Discipline |
|---|---|---|---|
| **Fast** | Instant physical feedback | Presses, toggles, hovers | Feedback must land inside the perception-of-instant window — a press the customer waits for is a hesitation by the brand |
| **Standard** | Considered but responsive | Sheets, state changes, chips | The workhorse tier; most reactive motion lives here |
| **Reveal** | Cinematic, unhurried | Content entering a scene for the first time | Maximum one reveal playing per viewport at a time — two simultaneous reveals compete; a sequence composes |
| **Ambient** | Slow, cyclical, alive | Ember drift, glow breathing, the scroll cue | The only tier allowed to loop; pauses when off-screen or when the tab is hidden — atmosphere for nobody is battery drain |

### 44.3 Momentum & easing law

Entries **decelerate** into place — arriving with weight, as heavy things do. Exits **accelerate** away, always faster than the corresponding entry — leaving must feel lighter than arriving, because a slow exit reads as the interface clinging (already law in Chapter 8, Section 36.3). Travel distances stay short: a reveal that crosses half the screen reads as theater for its own sake; a reveal that moves a hand's-breadth with mass reads as *arrival*.

### 44.4 The concurrency budget

At any moment, the viewport carries at most: one reveal-tier animation, a small fixed number of ambient layers, plus whatever reactive feedback the customer's own actions generate. **Why budget motion at all:** motion is attention spending — every moving element taxes the stillness that makes the food photography dominant (the supreme color law's kinetic twin). And the budget is also the performance guarantee (Section 48): a motion system with a headcount can promise frame rate; an unbounded one can only hope.

---

## 45. Micro-interactions & Reduced Motion

### 45.1 What micro-interactions are for

Micro-interactions are the small proofs that the interface is **alive and listening**: a chip that visibly acknowledges selection, a favorite that lands with a satisfying char-pop, a share that confirms itself, an image that settles into place as it arrives. Each is scoped tight — quick, purposeful, felt-not-watched — and none may grow into a showpiece; the moment a micro-interaction competes with the photography for attention, it has changed jobs without permission.

### 45.2 The inventory principle

Every micro-interaction in the experience is **inventoried in one place** (the technical spec maintains the authoritative table — element, trigger, behavior, tier, owner) rather than improvised per feature. **Why an inventory:** micro-interactions accumulate silently; unlisted, they drift in style and multiply until the interface fidgets. The inventory makes drift visible, makes the concurrency budget auditable, and gives any new interaction a single question to answer before existing: *which listed pattern does this follow, or why does it deserve a new one?*

### 45.3 Reduced motion: a complete-experience contract

For any customer whose device requests reduced motion, **every** decorative and ambient animation collapses to instant or near-instant — the openings, the reveals, the embers, the breathing glow, all of it — while the experience loses **zero information and zero functionality**. Static ambient states replace animated ones (a held warm glow instead of a breathing one); reveals become simple appearances; the journey, the content, and the two-tap order path remain identical.

**Why this is a first-class contract and not a checkbox:** motion sensitivity is real (vestibular disorders make animated interfaces physically nauseating), and the request is an accessibility need, not a preference toggle. A brand whose identity is *motion-rich* has a higher duty here, not a lower one — the test of the motion system's quality is that the experience still feels confident, warm, and premium when it stands perfectly still. If the still version feels broken, the motion was load-bearing in a way this Bible forbids: motion at FLIP is atmosphere, never structure.

---

## 46. Sound [FUTURE]

### 46.1 The current position: silence, deliberately

The FLIP experience ships **silent**, and this is a decision, not an omission. Food-delivery browsing happens overwhelmingly in silent-phone contexts — in bed, in meetings, on a bus, beside a sleeping child — and unsolicited audio is among the fastest ways to make a customer close a tab in mild panic. Beyond etiquette, silence is positioning: motion *implies* the sizzle (Chapter 2's sensory-substitute table); an interface confident enough to stay quiet reads premium, the way a good restaurant doesn't play its own radio ads at the table.

### 46.2 Where sound could someday earn a place

If sound ever enters the experience, it enters under three conditions: **opt-in only** (an explicit, visible toggle — never autoplay, never default-on), **scarce** (one or two moments, not a soundtrack), and **meaningful** (tied to intent, not decoration). The candidates worth prototyping when that day comes:

| Candidate | Moment | Why it might earn its place |
|---|---|---|
| A single sizzle tick | The platform-card tap that completes an order | An auditory confirmation at the one moment of highest intent — the satisfying "click" of the deal closing |
| Ambient kitchen bed | An explicit "immersion" toggle for those who want it | The full fire-world for the customer who asks for it — and only them |
| Sound design for the social motion loops | Off-site, in each platform's native conventions | The loops (Chapter 6, Section 28) live where sound-on is culturally expected; this is the *right* home for FLIP's audio identity today |

Any future implementation revisits this section first; the burden of proof is on the sound, not on the silence.

---

## 47. Accessibility

### 47.1 The standard and the reason

FLIP targets **WCAG 2.2 Level AA as a floor, not a ceiling** — and treats the commitment as inseparable from the premium claim: an experience that silently excludes customers using assistive technology, or larger text, or calmer motion, is not premium — it is premium-*looking*, for only some people. A brand built on hospitality-through-software (Chapter 2's memory-as-hospitality) cannot practice selective hospitality.

### 47.2 The practical guarantees

| Area | Guarantee | Why it's shaped this way |
|---|---|---|
| **Touch** | Every interactive target is comfortably thumb-sized, with real spacing between adjacent targets — strictest in the ordering flow | A mis-tap near the order sheet has real-money consequence; precision demands are a design failure, not a user failure |
| **Contrast** | All text meets AA contrast on every surface it can ever sit on — audited against the darkest *and* lightest rung of the black ladder, because ambient glow shifts the ground under text | A color that passes in one room and fails in another fails the system (Chapter 5, Section 22.2) |
| **Screen readers** | Coherent landmark structure; one page-level heading; category and product headings in true hierarchy; icon-only controls carry names; decorative layers (ghost type, embers, textures) are hidden from assistive tech; badges and heat levels carry text equivalents (مستوى الحرارة ٥ من ٥), never color alone | The non-visual experience must present the same hierarchy — image, name, detail, action — the visual one does; atmosphere is for eyes, information is for everyone |
| **Keyboard & alternate input** | The complete journey — browse, favorite, share, order, platform handoff — is operable by keyboard alone; the order sheet traps focus while open and returns it to the trigger on close; focus is always visible, styled in the brand's cream-and-flame ring (Chapter 5, Section 22.1), never a default blue outline | The blue prohibition and accessibility cooperate: the focus ring is *more* visible than a browser default, and on-brand |
| **Motion** | The reduced-motion contract of Section 45.3, in full | — |
| **Language & direction** | Right-to-left Arabic is the *default* layout, engineered with full polish — not a mirrored afterthought of an English design; the toggle swaps language and direction cleanly; English product names inside Arabic context are marked so screen readers pronounce them correctly | Arabic is the brand's primary voice (Chapter 1, Section 4.1); an RTL experience that feels second-class contradicts the brand's own identity |
| **Redundant paths** | No gesture shortcut (long-press, swipe) is ever the *only* way to reach any action — every shortcut shadows a visible control | Shortcuts are conveniences for some, never gates for others |

### 47.3 The audit habit

Accessibility at FLIP is verified continuously — automated checks in the build pipeline plus a recurring manual pass (keyboard-only journey, screen-reader journey, reduced-motion journey, 200% text zoom) — because accessibility regressions arrive silently with ordinary feature work, and a guarantee that isn't re-verified is a memory, not a guarantee. The full technical gate list lives with the performance gates in the build spec; the standard it enforces lives here.
