Perfect. This is exactly how you want Cursor to build something complex — **structured execution in phases**, not one giant prompt.

Here is your third file. Save it as:

`VALENTINE_IMPLEMENTATION_PLAN.md`

---

# Aarvi Valentine — Implementation Plan (Phased Build)

This document defines the exact phased execution plan for building the Valentine experience.

Do NOT attempt to build everything at once.
Each phase must be fully completed and verified before moving forward.

Stack is fixed:

* Next.js App Router + TypeScript
* Tailwind
* shadcn/ui (themed)
* Motion
* Rive
* Partycles

---

# Phase 1 — Foundation & Visual System

### Goal

Set up project, fonts, global styling, and base layout.
No animations yet. No logic yet.

---

## 1. Install Dependencies

* Motion
* Rive React runtime
* Partycles
* shadcn/ui

---

## 2. Configure Fonts

Load:

* Fraunces (serif display)
* Space Grotesk (sans)

Apply:

* Serif for headlines
* Sans for body/buttons

---

## 3. Tailwind Base Styling

In `globals.css`:

* Set background to `#050508`
* Set text to `#f3eee6`
* Remove any default light theme remnants
* Ensure no white backgrounds exist anywhere

---

## 4. Create Scene Shell

Create `Scene.tsx` with:

* Fullscreen wrapper
* Centered stack layout
* Proper z-index layering structure (even if empty)

Verify:

* Page renders with correct black velvet background
* Fonts look correct
* No default shadcn styling visible

Only proceed once visual base feels premium.

---

# Phase 2 — Ambient Environment

### Goal

Create cinematic background layers before adding content.

---

## 1. AmbientBackground Component

Implement:

* Vignette radial gradient
* Subtle haze glow
* Film grain overlay
* Dust particles (static for now)

Verify:

* Background feels dimensional
* No performance issues
* Still clean and minimal

---

## 2. HeartsField Component

Add floating hearts:

* 24–40 elements
* Motion keyframe drift
* Slow upward movement
* Subtle opacity

Verify:

* Hearts feel elegant, not chaotic
* Performance is smooth

Only move forward once ambient layer feels alive.

---

# Phase 3 — Hero Flower (Rive Integration)

### Goal

Integrate Rive and animate the bloom.

---

## 1. Add Rive File

Place:
public/rive/flower.riv

---

## 2. Create FlowerHeroRive Component

Implement:

* Glow layer behind flower
* Rive canvas
* Entrance Motion animation
* Bloom trigger on mount

---

## 3. Timing Integration

Flower bloom plays on load.

Do NOT add text yet.

Verify:

* Flower bloom feels smooth
* Glow feels premium
* No flashing or layout shift

Only continue once bloom moment feels cinematic.

---

# Phase 4 — Text & Choreography

### Goal

Add phase-based text flow using Motion.

---

## 1. Add Phase State Machine

Phases:

* intro_bloom
* pre_question
* the_ask
* yes_moment

Use timed transitions:

* 0–5s intro_bloom
* 5–7s pre_question
* 7–10s the_ask

---

## 2. Implement AskText Component

Add:

Pre-question line:
Aarvi, I have a question for you

Headline:
Will you be my Valentine?

Include:

* Word stagger animation
* Blur-to-clear transition
* Underline flourish SVG stroke draw

Verify:

* Timing feels natural
* Headline feels like a “moment”
* Nothing feels rushed

Do not implement buttons yet.

---

# Phase 5 — Buttons & Runaway Logic

### Goal

Implement interaction mechanics.

---

## 1. Add Yes & No Buttons

Use shadcn Button but override styling completely.

Add:

* Backdrop plate behind buttons
* Glow on hover (Yes)
* Border shift on hover (No)

---

## 2. Implement No Runaway System

Create `runaway.ts`.

Add:

Constants:

* DANGER_RADIUS
* SAFE_PADDING
* MAX_MOVES_PER_SECOND
* MIN_DIST_FROM_YES
* MIN_DIST_FROM_PREV

Implement:

* Pointer tracking
* Bounding box checks
* Random relocation algorithm
* Motion animation to new position

---

## 3. Teasing Message System

Add:

* Message state
* Escalation logic
* Floating toast UI
* Auto fade out

Verify:

* No button cannot realistically be clicked
* Messages escalate cleanly
* Movement feels playful, not glitchy

Only proceed once interaction is smooth.

---

# Phase 6 — Yes Moment (Climax)

### Goal

Build final emotional payoff.

---

## 1. Create YesMoment Component

Add overlay with:

* Backdrop blur
* Card container
* Heart halo (animated)
* Photo frame
* Caption

---

## 2. Add Partycles Integration

Attach:

* Small burst on Yes hover
* Large burst on Yes click
* Optional sparkle accent

---

## 3. Transition Logic

On Yes click:

1. Fade out ask content
2. Expand heart halo
3. Animate photo in
4. Show caption

Verify:

* Sequence feels satisfying
* Glow and halo feel magical
* Not cheesy, not overdone

---

# Phase 7 — Polish & Performance Pass

### Goal

Make it feel intentional and premium.

---

## 1. Fine-tune Motion Durations

Adjust:

* Text delays
* Button fade timing
* Halo scale bounce
* Heart drift speeds

---

## 2. Reduce Visual Noise

If it feels cluttered:

* Reduce heart opacity
* Reduce glow intensity
* Lower grain opacity

---

## 3. Test on:

* Desktop large screen
* Laptop
* Mobile
* Touch behavior

Ensure:

* No layout shift
* No runaway logic bugs
* Smooth animations

---

# Final Acceptance Criteria

The experience must:

* Feel cinematic
* Feel intentional
* Feel emotionally satisfying
* Not resemble a template
* Not resemble a hackathon demo
* Not resemble default shadcn

It should feel like a short interactive film intro.
