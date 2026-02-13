"use client";

import { motion } from "motion/react";
import { type Phase, isPhaseAtLeast, EASE, preQuestionVariants, headlineVariants } from "@/lib/phases";
import { PRE_QUESTION, HEADLINE } from "@/lib/copy";

/**
 * AskText — Phase-driven text choreography.
 *
 * - pre_question: word-staggered "Mahika, I have a question for you"
 *   with an extra pause after "Mahika,"
 * - the_ask: word-staggered headline "Will you be my Valentine?"
 *   + SVG underline flourish after the last word lands
 */

interface AskTextProps {
  phase: Phase;
}

/** Stagger delay per word (seconds) */
const WORD_STAGGER = 0.15;
/** Headline gets a longer per-word stagger for dramatic weight */
const HEADLINE_WORD_STAGGER = 0.22;
/** Extra pause after "Mahika," before the rest of the words */
const MAHIKA_PAUSE = 0.15;

/** Pre-question line with per-word stagger + extra pause after "Mahika," */
const StaggeredPreQuestion = () => {
  const words = PRE_QUESTION.split(" ");

  return (
    <p className="font-sans text-[clamp(16px,1.9vw,20px)] tracking-[0.02em] text-[#f3eee6]/78">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="mr-[0.3em] inline-block last:mr-0"
          initial={preQuestionVariants.initial}
          animate={preQuestionVariants.target}
          transition={{
            duration: preQuestionVariants.duration,
            ease: EASE,
            delay: i * WORD_STAGGER + (i > 0 ? MAHIKA_PAUSE : 0),
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
};

/** Headline with per-word stagger (same style as pre-question) */
const StaggeredHeadline = () => {
  const words = HEADLINE.split(" ");
  /** Total stagger span so flourish knows when to start */
  const lastWordDelay = (words.length - 1) * HEADLINE_WORD_STAGGER;

  return (
    <>
      <h1 className="mt-3 font-serif text-[clamp(30px,4.6vw,58px)] leading-[1.05] tracking-[-0.02em] text-[#f3eee6] drop-shadow-[0_0_22px_rgba(231,201,169,0.10)]">
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="mr-[0.25em] inline-block last:mr-0"
            initial={headlineVariants.initial}
            animate={headlineVariants.target}
            transition={{
              duration: headlineVariants.duration,
              ease: EASE,
              delay: i * HEADLINE_WORD_STAGGER,
            }}
          >
            {word}
          </motion.span>
        ))}
      </h1>
      <UnderlineFlourish delay={lastWordDelay + 0.35} />
    </>
  );
};

/** SVG underline flourish with stroke-draw animation */
const UnderlineFlourish = ({ delay }: { delay: number }) => (
  <svg
    className="mt-4 h-[18px] w-[220px] sm:w-[260px] opacity-[0.95]"
    viewBox="0 0 260 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <motion.path
      d="M2 12 C 40 2, 80 16, 130 9 C 180 2, 220 14, 258 6"
      stroke="rgba(231,201,169,0.80)"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{
        pathLength: { duration: 0.8, ease: EASE, delay },
        opacity: { duration: 0.3, delay },
      }}
    />
  </svg>
);

const AskText = ({ phase }: AskTextProps) => {
  const showPreQuestion = isPhaseAtLeast(phase, "pre_question");
  const showHeadline = isPhaseAtLeast(phase, "the_ask");

  return (
    <div className="relative z-10 flex w-full flex-col items-center text-center">
      {showPreQuestion && <StaggeredPreQuestion />}
      {showHeadline && <StaggeredHeadline />}
    </div>
  );
};

export default AskText;
