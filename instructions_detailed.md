Yep. Here’s a **second, single, clean Markdown file** you can save as:

`VALENTINE_IMPLEMENTATION_TOKENS.md`

It contains:

* **Exact Tailwind class tokens** for every component
* **Motion variants** (copy/paste objects)
* **Runaway No button algorithm spec** with constants + edge-case rules
* **Partycles hook placements**
* **shadcn theming overrides** (fonts, radius, borders, shadows) so it won’t look like default shadcn

---

# VALENTINE_IMPLEMENTATION_TOKENS.md

## 0) Forced stack (must use)

* Next.js App Router + TS
* Tailwind
* shadcn/ui
* Motion
* Rive React runtime
* Partycles

---

## 1) Global tokens (lib/tokens.ts)

### Color constants (reference only)

Use Tailwind arbitrary values in classes instead of hardcoding inline styles everywhere.

* night: `#050508`
* ink: `#0b0b12`
* ivory: `#f3eee6`
* champagne: `#e7c9a9`
* rose: `#e11d48`
* mist: `rgba(243,238,230,0.10)`
* orchidGlow: `rgba(245,166,198,0.18)`

---

## 2) Tailwind “scene” layout classes

### App shell (page root wrapper)

Use this exact wrapper on `app/page.tsx`:

* `min-h-screen w-full overflow-hidden bg-[#050508] text-[#f3eee6]`

### Center stack container (Scene content)

* `relative mx-auto flex min-h-screen w-full max-w-[980px] flex-col items-center justify-center px-6 py-10`

### Content vertical rhythm

Use `gap` based spacing:

* `gap-6 sm:gap-8 md:gap-10`

---

## 3) Ambient background (components/AmbientBackground.tsx)

### Background base layer

Top-level div:

* `pointer-events-none absolute inset-0`

### Vignette layer (div)

* `absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,166,198,0.06)_0%,rgba(5,5,8,0.88)_55%,rgba(5,5,8,0.98)_100%)]`

### Secondary haze layer (div)

* `absolute inset-0 opacity-[0.55] blur-3xl`
* add an animated gradient via CSS keyframes (recommended):

  * class: `bg-[radial-gradient(circle_at_20%_20%,rgba(231,201,169,0.10),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(245,166,198,0.08),transparent_60%),radial-gradient(circle_at_50%_85%,rgba(243,238,230,0.06),transparent_55%)]`

### Film grain overlay (div)

Preferred: CSS noise (no image file required).

* `absolute inset-0 opacity-[0.10] mix-blend-overlay`
* use `bg-[url('/textures/grain.png')] bg-repeat` if you have a grain asset
  or a CSS noise trick if you don’t.

### Dust specks layer (div)

* `absolute inset-0 opacity-[0.35]`
* Render ~16–24 tiny dots using absolutely positioned spans:

  * each dot:

    * `absolute h-[2px] w-[2px] rounded-full bg-[#f3eee6]/20 blur-[0.3px]`

---

## 4) Hearts field (components/HeartsField.tsx)

### Hearts container

* `pointer-events-none absolute inset-0 overflow-hidden`

### Heart element base class

* `absolute select-none opacity-0`
* Visual style (choose ONE):

  1. SVG heart with fill:

     * `drop-shadow-[0_0_16px_rgba(245,166,198,0.10)]`
  2. Text heart (♥) (cleaner than you think if styled):

     * `text-[#f3eee6]/25 blur-[0.2px]`

### Heart animation approach (Motion)

Each heart uses Motion animate keyframes:

* y: `["110vh","-20vh"]`
* x: `["0px","12px","-8px","10px","0px"]`
* opacity: `[0, 0.25, 0.22, 0]`
* rotate: `[-6, 6, -4, 4]`

Duration random: 7–14s
Delay random: 0–6s
Scale random: 0.6–1.2

---

## 5) Hero flower (components/FlowerHeroRive.tsx)

### Wrapper classes

* `relative flex items-center justify-center`
* sizing:

  * `h-[320px] w-[320px] sm:h-[380px] sm:w-[380px] md:h-[520px] md:w-[520px]`

### Glow behind flower (div)

* `absolute inset-0 rounded-full blur-3xl opacity-[0.45]`
* `bg-[radial-gradient(circle,rgba(245,166,198,0.16)_0%,rgba(231,201,169,0.08)_35%,transparent_70%)]`

### Flower canvas container

* `relative h-full w-full`
* `drop-shadow-[0_0_28px_rgba(245,166,198,0.10)]`

Motion entrance for the whole hero:

* initial: opacity 0, y 8, filter blur(12px), scale 0.98
* animate: opacity 1, y 0, filter blur(0px), scale 1
* transition: 0.9s, ease cinematic

---

## 6) Text choreography (components/AskText.tsx)

### Text container

* `relative z-10 flex w-full flex-col items-center text-center`

### Pre-question line (sans)

* `font-sans text-[clamp(16px,1.9vw,20px)] tracking-[0.02em] text-[#f3eee6]/78`

### Headline (serif)

* `mt-3 font-serif text-[clamp(30px,4.6vw,58px)] leading-[1.05] tracking-[-0.02em] text-[#f3eee6]`
* subtle glow:

  * `drop-shadow-[0_0_22px_rgba(231,201,169,0.10)]`

### Underline flourish (SVG wrapper)

* `mt-4 h-[18px] w-[220px] sm:w-[260px] opacity-[0.95]`
  Stroke color:
* `stroke-[#e7c9a9]/80`
  Stroke width:
* `stroke-[2.2]`

---

## 7) Buttons (components/ValentineButtons.tsx)

### Buttons container

* `relative z-20 mt-6 flex items-center gap-4 sm:gap-5`
* Put a subtle backdrop plate behind buttons:

  * plate div:

    * `absolute -inset-3 -z-10 rounded-[22px] border border-[rgba(243,238,230,0.10)] bg-[#0b0b12]/35 backdrop-blur-md`

### YES button (shadcn Button with className override)

Use:

* `relative h-12 rounded-2xl px-7 text-[15px] font-medium tracking-[0.02em]`
* base:

  * `bg-[#f3eee6]/10 text-[#f3eee6]`
  * `border border-[#e7c9a9]/40`
* hover:

  * `hover:bg-[#f3eee6]/14 hover:border-[#e7c9a9]/65`
  * `hover:shadow-[0_0_24px_rgba(231,201,169,0.12)]`
* active:

  * `active:scale-[0.98]`

Attach Partycles burst anchor span inside:

* `<span id="yes-reward-anchor" className="absolute inset-0" />`

### NO button (absolutely positioned runaway)

Make NO button use `position: absolute` and Motion animate its `left/top`.

Class:

* `h-12 rounded-2xl px-7 text-[15px] font-medium tracking-[0.02em]`
* base:

  * `bg-transparent text-[#f3eee6]/75`
  * `border border-[rgba(243,238,230,0.18)]`
* hover:

  * `hover:text-[#f3eee6]/90 hover:border-[rgba(243,238,230,0.35)]`
* active:

  * `active:scale-[0.98]`

---

## 8) No button runaway constants (lib/runaway.ts)

Use these defaults:

* `DANGER_RADIUS = 120`
* `SAFE_PADDING = 24`
* `MAX_MOVES_PER_SECOND = 2`
* `MIN_DIST_FROM_YES = 160`
* `MIN_DIST_FROM_PREV = 140`
* `MAX_TRIES = 18`

Rules:

* Candidate position must:

  * keep button fully within viewport (safe padding)
  * not overlap YES bounding box + MIN_DIST_FROM_YES
  * not be too close to previous NO position (MIN_DIST_FROM_PREV)
* Throttle relocations to MAX_MOVES_PER_SECOND

Motion animation for NO reposition:

* duration: random between 0.28–0.38
* ease: cinematic
* rotate: random -2 to +2 degrees

Mobile behavior:

* On `touchstart` near NO, relocate
* If user taps NO, relocate immediately and show message

---

## 9) Teasing messages (lib/copy.ts)

Messages array:

1. `are you sure you want to do that…`
2. `that’s not a good idea 😭`
3. `that’s kinda mean…`
4. `ok but like… why`
5. `you’re really trying huh`
6. `final warning 😤`
7. `Aarvi please 😔`

Message UI styling:

* container:

  * `pointer-events-none absolute left-1/2 top-10 z-30 -translate-x-1/2`
* bubble:

  * `rounded-2xl border border-[rgba(243,238,230,0.12)] bg-[#0b0b12]/55 px-4 py-2 text-[14px] tracking-[0.01em] text-[#f3eee6]/80 backdrop-blur-md`
  * glow:

    * `shadow-[0_0_22px_rgba(245,166,198,0.10)]`

Message Motion:

* initial: opacity 0, y -6, filter blur(8px)
* animate: opacity 1, y 0, filter blur(0px)
* exit: opacity 0, y -4, filter blur(8px)
* lifetime: ~1.6s

---

## 10) Yes moment (components/YesMoment.tsx)

### Overlay wrapper

* `absolute inset-0 z-40 flex items-center justify-center px-6`
* backplate:

  * `absolute inset-0 bg-[#050508]/55 backdrop-blur-[2px]`

### Card container (shadcn Card with override)

* `relative w-full max-w-[520px] rounded-[28px] border border-[rgba(243,238,230,0.12)] bg-[#0b0b12]/55 p-5 sm:p-6 backdrop-blur-md`
* shadow:

  * `shadow-[0_0_46px_rgba(231,201,169,0.10)]`

### Heart halo (behind photo)

Halo wrapper:

* `absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-[0.95] blur-[0.2px]`
  Halo glow:
* `drop-shadow-[0_0_26px_rgba(245,166,198,0.16)]`

Halo animation (Motion):

* scale: 0.6 → 1.1 → 1
* opacity: 0 → 1
* duration: 0.65s
* ease: cinematic

### Photo frame

Image container:

* `relative overflow-hidden rounded-[24px] border border-[rgba(243,238,230,0.16)] bg-[#050508]`
  Add subtle “polaroid” feel:
* outer:

  * `p-2`
* image:

  * `aspect-[4/5] w-full object-cover`
* shadow:

  * `shadow-[0_0_30px_rgba(0,0,0,0.55)]`

Photo entrance Motion:

* initial: opacity 0, y 16, rotate -1.5
* animate: opacity 1, y 0, rotate 0
* duration: 0.55s

### Caption

* `mt-4 text-center font-sans text-[15px] tracking-[0.02em] text-[#f3eee6]/78`

---

## 11) Phase transition Motion variants (lib/phases.ts)

Use these variant objects (copy/paste as-is into TS):

Scene fade:

* initial: `{ opacity: 0 }`
* animate: `{ opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }`
* exit: `{ opacity: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }`

Pre-question text:

* initial: `{ opacity: 0, y: 10, filter: "blur(6px)" }`
* animate: `{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }`

Headline:

* initial: `{ opacity: 0, scale: 0.98, filter: "blur(10px)" }`
* animate: `{ opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }`

Buttons:

* initial: `{ opacity: 0, y: 12, filter: "blur(10px)" }`
* animate: `{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.12 } }`

---

## 12) Partycles placement (exact)

* On YES hover:

  * Trigger a small hearts reward from the YES button anchor.
* On YES click:

  * Trigger a large hearts + sparkles reward from center of YesMoment (or same anchor).
* Optional on repeated NO attempts:

  * Tiny sparkle near the message toast.

Implementation notes:

* Create an element with an id for `useReward` target:

  * `id="yes-reward-anchor"`
* Attach `useReward("yes-reward-anchor", "hearts", {...})`
* Attach another for sparkles if desired:

  * `useReward("yes-reward-anchor", "confetti" or "sparkles", {...})`

---

## 13) shadcn theming overrides (globals.css + tailwind config)

Required:

* Load fonts: Fraunces + Space Grotesk
* Set CSS variables for radius to large
* Override base shadcn colors to night/ink/ivory

Minimum “not shadcn” feel:

* Avoid default neutral backgrounds
* Always use mist borders + soft glow shadows
* Use big radii and warm ivory text

---

## 14) Cursor instruction (implementation-oriented)

Implement the one-page Next.js scene with the exact class tokens above. Use Rive for the flower (public/rive/flower.riv) with a bloom sequence. Use Motion for all transitions, text staggers, button entrances, underline flourish stroke draw, runaway No animations, and yes reveal choreography. Use Partycles for hearts/sparkles bursts on Yes hover and Yes click. Use shadcn Button/Card primitives but override with the classes in this document so the UI is not recognizable as shadcn. Implement the No runaway logic with the constants and rules above, with escalating messages styled exactly as specified. Use the cinematic easing curve everywhere: [0.16, 1, 0.3, 1].
