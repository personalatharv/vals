## Design document: “Aarvi Valentine — One Page Next.js Experience” (forced stack)

### Hard requirements (do not deviate)

* **Next.js (App Router) + TypeScript + Tailwind**
* **Rive** = animated hero flower (centerpiece, bloom sequence)
* **Motion** (Framer Motion successor) = all choreography, entrances, transitions, microinteractions
* **Partycles** = heart/sparkle bursts (hover + “YES” climax)
* **shadcn/ui** = base UI primitives, **heavily themed** so it does *not* look like shadcn

---

## 1) Artistic direction (non-generic, premium)

**Theme:** *Black velvet night* with warm ivory typography, champagne edges, deep rose accents, soft bloom glows, film-grain texture.

**Not allowed:** neon purple gradients, default Inter-only vibe, “techy” glassmorphism, over-bouncy animations.

**Motion language:** slow, cinematic, confident. Like a luxury brand intro.

---

## 2) User experience flow (single page)

**Route:** `/`

### Phase state machine (explicit)

Phases:

1. `intro_bloom` (0–5s)
2. `pre_question` (5–7s)
3. `the_ask` (7–10s)
4. `yes_moment` (on Yes click)

Transitions are timed (Motion) until the user acts.

### What the user sees

#### Phase 1: Intro Bloom

* Black velvet background with subtle moving haze + grain + drifting dust
* **Rive flower** forms: line reveal → petal fill → subtle shimmer
* Hearts slowly drift upward behind/around the flower (ambient layer)

#### Phase 2: Pre-question

Text appears cleanly:

* “Aarvi, I have a question for you”
* Elegant stagger (word-by-word), gentle float, warm ivory

#### Phase 3: The Ask

Headline appears:

* “Will you be my Valentine?”
* Serif display, bloom glow, faint underline flourish drawn in (animated SVG stroke)

Buttons appear:

* `Yes` (inviting, luminous)
* `No` (outlined, dimmer, mischievous)

#### Phase 4: Yes Moment (climax)

* Background subtly deepens and warms
* Heart halo expands behind the photo
* Photo of you two appears with a minimalist “polaroid” frame (not cheesy)
* Partycles heart/sparkle burst and a few extra drifting hearts for 3 seconds
* Caption: “ok yay. i’m the luckiest.”

---

## 3) Forced tech stack details (implementation-level)

### Libraries

* **Rive React runtime** (for `FlowerHeroRive.tsx`)

  * File: `public/rive/flower.riv`
  * Use Rive State Machine input(s):

    * `bloom` (boolean) or trigger `bloomNow`
    * Optional: `pulse` trigger for subtle shimmer after bloom completes

* **Motion** for:

  * phase transitions
  * staggered text entrances
  * underline flourish stroke draw
  * button entrance + hover + tap
  * “No button runaway” position animation

* **Partycles**

  * `useReward` style bursts
  * Trigger on:

    * hovering Yes (tiny hearts)
    * clicking Yes (large hearts + sparkles)
    * optionally: when user repeatedly tries to hit No (tiny “warning spark”)

* **shadcn/ui**

  * Use `Button`, `Card`, maybe `Dialog` (optional)
  * **Theme aggressively**: custom fonts, colors, radius, borders, shadows

---

## 4) File structure (exact)

```
app/
  layout.tsx
  page.tsx
  globals.css

components/
  Scene.tsx
  AmbientBackground.tsx
  FlowerHeroRive.tsx
  HeartsField.tsx
  AskText.tsx
  ValentineButtons.tsx
  YesMoment.tsx

lib/
  phases.ts
  runaway.ts
  copy.ts
  tokens.ts

public/
  rive/flower.riv
  photos/us.jpg
  textures/grain.png (optional if not CSS-noise)
  icons/heart.svg (optional)
```

---

## 5) Visual system (tokens — use everywhere)

### Colors (no generic gradients)

* `night`: `#050508`
* `ink`: `#0B0B12`
* `ivory`: `#F3EEE6`
* `mist`: `rgba(243,238,230,0.10)`
* `champagne`: `#E7C9A9`
* `rose`: `#E11D48`
* `orchidGlow`: `rgba(245,166,198,0.18)` (glow only)

### Typography (must be distinct)

* Display serif: `Fraunces` (headline/ask)
* Sans: `Space Grotesk` (supporting + buttons)

### Radii

* Buttons: `rounded-2xl`
* Cards/photo: `rounded-[28px]` (large, soft)
* Borders: 1px mist

### Shadows/glow (subtle, wide)

* Use soft bloom glows: blurred radial div behind flower/headline
* Avoid sharp drop-shadows

---

## 6) Layout composition (pixel-intent)

### Scene layout

* Fullscreen container `min-h-screen w-full overflow-hidden`
* Center stack with vertical rhythm:

  * Flower (slightly below center)
  * Text above flower
  * Buttons below headline

### Layering order (important)

1. `AmbientBackground` (vignette + haze + grain + dust)
2. `HeartsField` (ambient floating hearts)
3. `FlowerHeroRive` (hero)
4. `Text + Buttons`
5. `Partycles bursts` (overlay on interactions)
6. `YesMoment` overlays the ask scene (but keep flower faintly visible behind)

---

## 7) Motion choreography (exact specs)

**Global easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (cinematic ease)

### Phase timings

* `intro_bloom` starts immediately

  * 0.3s: flower container fades in (opacity 0→1) + blur 12→0 + y 8→0
  * Rive bloom plays from 0.5s → ~4.5s
* `pre_question` enters at ~5s
* `the_ask` enters at ~7s

### Text animation style

* Pre-question: stagger per word, each word:

  * opacity 0→1
  * y 10→0
  * blur 6→0
* Headline: opacity 0→1 + blur 10→0 + slight scale 0.98→1
* Underline flourish: SVG path stroke animation (draw from 0% to 100%)

### Button animations

* Buttons appear with:

  * y 12→0
  * opacity 0→1
  * slight delay after headline

Hover:

* Yes: soft halo ring expands slightly + Partycles mini hearts
* No: border brightens slightly (to bait interaction)

---

## 8) Ambient hearts (HeartsField)

**Goal:** elegant drift, not confetti chaos.

Implementation:

* Render 24–40 heart elements (SVG or div with background)
* Each heart has randomized:

  * start x
  * delay
  * duration 7–14s
  * scale 0.6–1.2
  * opacity 0.12–0.35
* Animate upward with slight horizontal sway (Motion keyframes)

Visual:

* Hearts are mostly `mist/ivory` with occasional faint `orchidGlow` blur behind a few

---

## 9) The “No button runaway” (must be smooth + impossible)

### Behavior rules

* Desktop: No relocates when cursor enters a danger radius
* Mobile: No relocates on touchstart near it OR on tap attempt

### Key variables

* `dangerRadius = 120px`
* `maxMovesPerSecond = 2`
* `safePadding = 24px` from viewport edges
* “No” must never overlap “Yes” bounds

### Runaway algorithm (explicit)

* Track button bounds via `getBoundingClientRect()`
* Track cursor pos via `pointermove`
* Compute distance from cursor to No center
* If distance < dangerRadius:

  * increment `noAttempts`
  * compute a new target position:

    * random within viewport safe zone
    * reject if too close to Yes or offscreen
  * animate to new position using Motion:

    * duration 0.28–0.38s
    * ease-out
    * small rotation ±2deg

### Teasing message system

Messages array (lowercase, intimate):

1. “are you sure you want to do that…”
2. “that’s not a good idea 😭”
3. “that’s kinda mean…”
4. “ok but like… why”
5. “you’re really trying huh”
6. “final warning 😤”
7. “Aarvi please 😔”

Logic:

* message index = `min(noAttempts, messages.length-1)`
* Show as a floating toast near top-center OR near No button
* Only keep last 1–2 visible, fade out after 1.6s

---

## 10) Yes Moment (photo + heart halo)

### Layout

* Centered `Card` with:

  * Heart halo behind (SVG outline draw + glow)
  * Photo frame
  * Caption text

### Motion

* On Yes click:

  1. Buttons + ask text fade out (0.25s)
  2. Heart halo expands (scale 0.6→1.1→1) + opacity 0→1 (0.6s)
  3. Photo slides in from y 16→0, rotate -1.5deg→0deg (0.55s)
  4. Caption appears with staggered words (0.35s)

### Partycles climax

* Burst hearts + sparkles at the center of the halo
* Then increase ambient hearts density for 3 seconds

---

## 11) shadcn theming so it doesn’t look like shadcn

### Must-do changes

* Replace default font stack with Fraunces + Space Grotesk
* Custom button styles:

  * No default gray/neutral button look
  * Use ivory + champagne borders, subtle glow, large radius
* Add custom shadows + borders (mist) + backdrop blur for CTA area
* Use your own spacing rhythm and type scale (not default templates)

### Component usage (minimum)

* `Button` for Yes/No
* `Card` for the Yes photo moment
* Avoid lots of standard shadcn components that scream “template”

---

## 12) Copy (exact strings)

* Pre-question: `Aarvi, I have a question for you`
* Ask: `Will you be my Valentine?`
* Buttons: `Yes` / `No`
* Yes caption: `ok yay. i’m the luckiest.`
* No tease messages: listed above

---

## 13) Assets checklist (you must provide)

* `public/rive/flower.riv` (Rive animated flower with bloom)
* `public/photos/us.jpg` (your photo)
* Optional: `textures/grain.png` if you don’t do CSS noise

---

## 14) Done definition (acceptance criteria)

* Flower bloom is **Rive-driven** and feels premium
* All entrances/transitions are **Motion** with cinematic ease
* Hearts + sparkles bursts use **Partycles**
* UI uses **shadcn**, but styling is custom enough to be unrecognizable as shadcn
* No button is effectively unclickable and relocates smoothly
* Teasing messages trigger progressively and look clean, not spammy
* Yes reveals photo + heart halo with a satisfying “final scene” payoff

---

## v0 / Claude Code build instruction (pasteable)

“Build a single-page Next.js App Router site using TypeScript + Tailwind. MUST use Rive (React runtime) for an animated flower hero (`public/rive/flower.riv`), Motion for all choreography/transitions, Partycles for heart/sparkle reward bursts, and shadcn/ui primitives but heavily themed to not look like shadcn. The background is black velvet with vignette + subtle haze + film grain. The site plays an intro bloom, then shows: ‘Aarvi, I have a question for you’, then ‘Will you be my Valentine?’ with Yes/No buttons. Yes triggers a heart halo and reveals `public/photos/us.jpg` with a minimalist frame + caption. No button runs away from cursor using a proximity radius and shows escalating teasing messages. Implement component structure: Scene, AmbientBackground, FlowerHeroRive, HeartsField, AskText, ValentineButtons, YesMoment. Use a cinematic easing curve and avoid neon gradients.”
