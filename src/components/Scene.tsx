"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import AmbientBackground from "@/components/AmbientBackground";
import HeartsField from "@/components/HeartsField";
import FlowerHeroRive from "@/components/FlowerHeroRive";
import AskText from "@/components/AskText";
import ValentineButtons from "@/components/ValentineButtons";
import YesMoment from "@/components/YesMoment";
import { type Phase, EASE } from "@/lib/phases";

/**
 * Scene — Root visual shell for the Valentine experience.
 *
 * Orchestrates the phase state machine:
 *  0s  -> intro_bloom   (flower fades in, Rive bloom plays)
 *  3s  -> pre_question  (pre-question text staggers in)
 *  5s  -> the_ask       (headline word stagger + underline flourish)
 *  ?   -> yes_moment    (triggered by Yes click)
 *
 * Layering order (bottom to top):
 *  1. AmbientBackground  (z-0)
 *  2. HeartsField        (z-10)
 *  3. FlowerHeroRive     (z-20)
 *  4. Text + Buttons     (z-30)
 *  5. YesMoment          (z-40)
 */
const Scene = () => {
  const [phase, setPhase] = useState<Phase>("intro_bloom");
  const isYesMoment = phase === "yes_moment";

  useEffect(() => {
    const preQuestionTimer = setTimeout(() => setPhase("pre_question"), 3000);
    const theAskTimer = setTimeout(() => setPhase("the_ask"), 5000);

    return () => {
      clearTimeout(preQuestionTimer);
      clearTimeout(theAskTimer);
    };
  }, []);

  const handleYes = useCallback(() => {
    setPhase("yes_moment");
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050508] text-[#f3eee6]">
      {/* Layer 1: Ambient Background (z-0) */}
      <AmbientBackground />

      {/* Layer 2: Hearts Field (z-10) */}
      <HeartsField />

      {/* Content stack */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[980px] flex-col items-center justify-center gap-6 px-6 py-10 sm:gap-8 md:gap-10">
        {/* Layer 3: Flower Hero (z-20) */}
        <FlowerHeroRive />

        {/* Layer 4: Ask content (z-30) — fades out on yes_moment */}
        <AnimatePresence>
          {!isYesMoment && (
            <motion.div
              key="ask-content"
              className="flex w-full flex-col items-center"
              exit={{ opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <AskText phase={phase} />
              <ValentineButtons phase={phase} onYes={handleYes} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Layer 5: YesMoment overlay (z-40) */}
      <AnimatePresence>
        {isYesMoment && <YesMoment />}
      </AnimatePresence>
    </div>
  );
};

export default Scene;
