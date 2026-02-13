/** Phase state machine and Motion variants */

export type Phase = "intro_bloom" | "pre_question" | "the_ask" | "yes_moment";

/** Phase ordering for comparison */
const PHASE_ORDER: Record<Phase, number> = {
  intro_bloom: 0,
  pre_question: 1,
  the_ask: 2,
  yes_moment: 3,
};

/** Returns true if the current phase is at or past the target phase */
export const isPhaseAtLeast = (current: Phase, target: Phase): boolean =>
  PHASE_ORDER[current] >= PHASE_ORDER[target];

/** Cinematic easing — used by all variants */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Pre-question word entrance values (animation applied per-word with stagger) */
export const preQuestionVariants = {
  initial: { opacity: 0, y: 10, filter: "blur(6px)" },
  target: { opacity: 1, y: 0, filter: "blur(0px)" },
  duration: 0.6,
};

/** Headline entrance values */
export const headlineVariants = {
  initial: { opacity: 0, scale: 0.98, filter: "blur(10px)" },
  target: { opacity: 1, scale: 1, filter: "blur(0px)" },
  duration: 0.75,
};

/** Buttons entrance values (used in Phase 5) */
export const buttonsVariants = {
  initial: { opacity: 0, y: 12, filter: "blur(10px)" },
  target: { opacity: 1, y: 0, filter: "blur(0px)" },
  duration: 0.65,
  delay: 0.12,
};
