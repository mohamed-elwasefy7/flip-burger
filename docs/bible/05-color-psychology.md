# Chapter 05 — Color Psychology

*Sections 20–22 · Why each color exists, exactly when it may appear, and what every state means. This palette is not decoration — it is the appetite engine.*

---

## 20. The Palette & What Each Color Means

### 20.1 Origin: extracted, not invented

Every color in this system is extracted directly from FLIP's physical packaging-box artwork — matte black base, flame-red printed ink, burnt orange flame mids, warm-yellow lightning bolts, distressed cream lettering. **Why extraction matters:** a palette derived from a real, printed, physical object feels *inevitable* — the screen and the box are visibly the same world, which is exactly the promise-audit continuity the journey depends on (Chapter 2, Section 10). An invented "digital brand palette" beside a differently-colored box would split the brand into two worlds at the exact moment of unboxing.

### 20.2 The five voices of the palette

Each color is a voice with a psychological job. Reference values live in the technical spec and token sheet; this table is the *meaning* layer that governs their use.

| Color | Voice | Psychological job | Why this specific shade |
|---|---|---|---|
| **Flame red** | The shout | Appetite trigger and urgency — the most studied hunger color in food retail | A deep *ink* red, not a bright candy red. Candy red reads as toys and discount stickers; ink red on dark reads as fire and seriousness. Against FLIP's warm blacks it reads *molten*; against white it would read *clearance sale* — which is one reason the world stays dark |
| **Fire orange** | The bridge | Warmth and abundance; the mid-tone that makes red-to-yellow gradients read as one continuous flame | Sits at the precise midpoint where a gradient stays *combustion* instead of becoming *a rainbow slider* |
| **Warm yellow** | The spark | Peak energy, joy, the lightning-bolt moment | The rarest color in the system **by design** — scarcity is what makes it register as "peak heat" rather than "another accent." The moment yellow becomes common, the brand loses its exclamation point |
| **Warm blacks (the ladder)** | The night | The stage — premium darkness that makes food the brightest object alive on screen | Never flat black: warmed toward ember-brown so darkness reads as *a room with the lights low near a fire*, not as *nothing* (full ladder logic in Chapter 4, Section 19) |
| **Vintage cream** | The handwriting | Humanity, craft, trust — ink on paper | Distinct from white on purpose: white is clinical and digital; cream is printed and human. Cream is the color of everything FLIP *says*; fire colors are everything FLIP *feels* |

### 20.3 The supporting cast

A muted warm tan serves as the secondary text voice — quieter than cream, still warm, holding comfortable reading contrast on every surface. **Gray is banned.** Any neutral gray anywhere in the system reads as "disabled," "corporate," or "cold" — three words from the anti-personality list (Chapter 1, Section 1.4). Where other design systems reach for gray, FLIP reaches for a dimmer warm tone.

---

## 21. Usage Rules & the Category Heat Map

### 21.1 The supreme law

> **The food photograph is always the most saturated object on screen.**

Every other color rule descends from this one. The UI's fire colors *frame* the food; they never compete with it. This is why the interface's reds and oranges are inky and restrained rather than fluorescent — a UI that out-saturates a burger has stolen from its own product. When auditing any screen, squint: if anything pulls the eye harder than the food, that thing is wrong.

### 21.2 The red-discipline rule

Flame red occupies **well under a tenth of any viewport** as baseline, with exactly two sanctioned spikes: call-to-action surfaces, and peak-heat product moments (the Inferno tier). **Why rationing works:** color meaning is spent by use. Red used everywhere means nothing anywhere; red used at a tenth of the screen means *this, exactly this, is the hot thing*. The discipline is what converts red from decoration into instruction.

### 21.3 The category heat map

Each menu category occupies a defined position on the palette's temperature spectrum, expressed through its room's ambient glow color, glow intensity, and ember density (the fire ladder, Chapter 4, Section 16.2):

| Category | Position | Ambient expression | Why |
|---|---|---|---|
| Burgers | **Hottest** | Molten red glow, fullest ember | The flagship earns the maximum heat — this is the room the whole site was built around |
| Appetizers | Warm | Fire-orange shift, lighter ember | The fryer line: energetic but subordinate to the main fire |
| Party Box | Celebration heat | Red *plus* yellow accents — the only room where the spark color joins the ambience | The lightning-bolt festivity of a group night; yellow's rarity makes this room feel like an occasion |
| Drinks | **Coolest — of the warm spectrum** | Deep amber, ember at its lowest live setting | The cooldown chapter, expressed through *less fire* — never through cold color |

### 21.4 The blue prohibition

The drinks cooldown — and every other "cool" moment — is achieved by **reducing warmth, never by introducing blue.** No blue, no teal, no cool gray, anywhere, ever, including photography (Chapter 6) and any future video. One blue element would puncture the "you are near a fire" illusion the entire experience is built on; it is the single fastest way to make FLIP look like every other delivery listing. This is the palette's one absolute prohibition, and it has no exceptions — including "refreshing" drink marketing instincts.

### 21.5 Yellow's contract

Warm yellow appears in exactly three contexts: badges at peak significance, the heat-line pattern's crest, and Party Box celebration accents. It is never body text (its luminance on dark backgrounds fatigues sustained reading), never a large fill, never a background. Yellow is the brand's exclamation point — and a page of exclamation points is a page of noise.

---

## 22. Semantic & State Colors

### 22.1 States without a "system palette"

Conventional design systems bolt on green/amber/red semantic colors for success/warning/error. FLIP **refuses the convention**: those colors would import document-world signals into fire-world, and — fatally — red already means *appetite and heat* here, so red-as-error would poison the brand's most valuable color association. Instead, every state is expressed within the existing palette:

| State | Expression | Why this expression |
|---|---|---|
| **Success / confirmation** | A quiet cream toast, brief and factual (تم نسخ رابط المنتج) | Confirmation is certainty, and certainty at FLIP is calm — celebration is reserved for food, not for UI events |
| **Unavailable product** | Photo desaturated toward the stage's darkness + cream label (غير متوفر حالياً) | The item recedes into the night rather than being branded with an error mark; absence expressed as *dimmed*, not *broken* |
| **Coming soon** | Standard cream text, warm-direct tone (روابط الطلب قريباً) | Honesty needs no special color; it needs plain words on the brand's own surfaces |
| **Offline** | The menu remains fully readable; ordering paths state their reason in cream | Losing signal dims capability, not dignity — no alarm styling for something that isn't the customer's fault |
| **Error (true failure)** | Warm-direct copy, composed tone, no red | Red is appetite. An error in red would teach customers that FLIP's most important color means *problem* — an unaffordable lesson |
| **Focus (keyboard)** | A cream ring with a fine flame offset | Visibility for accessibility (Chapter 10) delivered in the brand's own materials rather than a browser-default blue — which would also violate the blue prohibition |

### 22.2 Contrast obligations

Cream on the black ladder holds far beyond minimum reading contrast; the secondary warm tan is tuned to remain comfortably readable on every ladder rung; the CTA's cream-on-red pairing is verified against accessibility contrast floors (the working pair is documented in the token sheet and technical spec). The governing rule: **contrast compliance is checked against the darkest and lightest rung a text style can ever sit on**, not just its usual home — because ambient glow shifts the ground beneath text, and a color that passes only in one room fails the system.

### 22.3 The one-glance audit

A correctly-colored FLIP screen passes this audit in one glance: the food is the brightest, most saturated thing; red appears only where heat or action lives; yellow appears once or not at all; everything readable is cream or warm tan; nothing is blue, gray, or cold. If a screen needs explanation to pass, it fails.
