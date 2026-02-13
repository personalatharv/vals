"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useReward } from "partycles";
import { Card } from "@/components/ui/card";
import { EASE } from "@/lib/phases";
import { YES_CAPTION, YES_CAPTION_LINE2 } from "@/lib/copy";

/**
 * YesMoment — The emotional climax.
 *
 * Full-screen overlay with:
 *  - Backdrop blur
 *  - Heart halo expanding behind
 *  - Polaroid photo frame sliding in
 *  - Caption fading in word-by-word
 *  - Partycles hearts burst at center
 */

/** Stagger delay per caption word */
const CAPTION_WORD_STAGGER = 0.12;
/** Delay before photo starts — gives the heart halo time to draw + breathe */
const PHOTO_DELAY = 1.9;
/** Delay before caption starts (after photo entrance finishes) */
const CAPTION_DELAY = PHOTO_DELAY + 0.6;
/** When the Partycles burst fires (just before photo slides in) */
const BURST_DELAY = 1600;

/** SVG heart outline for the halo */
const HeartHaloSVG = () => (
  <svg
    viewBox="0 0 512 512"
    className="h-full w-full"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <motion.path
      d="M256 448l-30.164-27.211C118.718 322.927 48 258.636 48 180.396 48 117.818 96.818 69 159.396 69c35.424 0 69.461 16.535 96.604 42.633C283.143 85.535 317.18 69 352.604 69 415.182 69 464 117.818 464 180.396c0 78.24-70.718 142.531-177.836 240.393L256 448z"
      stroke="rgba(245,166,198,0.35)"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{
        pathLength: { duration: 1.2, ease: EASE, delay: 0.1 },
        opacity: { duration: 0.4, delay: 0.1 },
      }}
    />
  </svg>
);

/** Staggered caption text (two lines) */
const StaggeredCaption = () => {
  const line1Words = YES_CAPTION.split(" ");
  const line2Words = YES_CAPTION_LINE2.split(" ");
  const line2StartDelay = CAPTION_DELAY + line1Words.length * CAPTION_WORD_STAGGER + 0.3;

  return (
    <div className="mt-4 flex flex-col items-center gap-1.5 text-center font-sans text-[15px] tracking-[0.02em] text-[#f3eee6]/78">
      <p>
        {line1Words.map((word, i) => (
          <motion.span
            key={i}
            className="mr-[0.3em] inline-block last:mr-0"
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.35,
              ease: EASE,
              delay: CAPTION_DELAY + i * CAPTION_WORD_STAGGER,
            }}
          >
            {word}
          </motion.span>
        ))}
      </p>
      <p>
        {line2Words.map((word, i) => (
          <motion.span
            key={i}
            className="mr-[0.3em] inline-block last:mr-0"
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.35,
              ease: EASE,
              delay: line2StartDelay + i * CAPTION_WORD_STAGGER,
            }}
          >
            {word}
          </motion.span>
        ))}
      </p>
    </div>
  );
};

const YesMoment = () => {
  // Partycles burst at center
  const { reward: burstHearts } = useReward("yes-moment-anchor", "hearts", {
    particleCount: 40,
    spread: 80,
    startVelocity: 18,
    decay: 0.92,
    lifetime: 120,
    elementSize: 18,
    colors: ["#f5a6c6", "#e7c9a9", "#f3eee6", "#e11d48"],
  });

  const { reward: burstSparkles } = useReward("yes-moment-anchor", "sparkles", {
    particleCount: 20,
    spread: 60,
    startVelocity: 14,
    decay: 0.9,
    lifetime: 80,
    elementSize: 12,
    colors: ["#f5a6c6", "#e7c9a9", "#f3eee6"],
  });

  // Fire bursts just before the photo slides in
  useEffect(() => {
    const timer = setTimeout(() => {
      burstHearts();
      burstSparkles();
    }, BURST_DELAY);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {/* Backplate */}
      <motion.div
        className="absolute inset-0 bg-[#050508]/55 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        aria-hidden="true"
      />

      {/* Card container */}
      <Card className="relative w-full max-w-[520px] flex-col items-center rounded-[28px] border border-[rgba(243,238,230,0.12)] bg-[#0b0b12]/55 p-5 shadow-[0_0_46px_rgba(231,201,169,0.10)] backdrop-blur-md sm:p-6">
        {/* Heart halo behind photo */}
        <motion.div
          className="absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-[0.95] blur-[0.2px]"
          style={{
            filter: "drop-shadow(0 0 26px rgba(245,166,198,0.16))",
          }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [0.6, 1.1, 1], opacity: 1 }}
          transition={{
            scale: { duration: 0.65, ease: EASE, times: [0, 0.7, 1] },
            opacity: { duration: 0.4, ease: EASE },
          }}
          aria-hidden="true"
        >
          <HeartHaloSVG />
        </motion.div>

        {/* Partycles anchor at center */}
        <span
          id="yes-moment-anchor"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        />

        {/* Photo frame — polaroid style */}
        <motion.div
          className="relative overflow-hidden rounded-[24px] border border-[rgba(243,238,230,0.16)] bg-[#050508] p-2 shadow-[0_0_30px_rgba(0,0,0,0.55)]"
          initial={{ opacity: 0, y: 16, rotate: -1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: PHOTO_DELAY }}
        >
          <Image
            src="/photos/ayan_mahika_picture.jpg"
            alt="Us"
            width={480}
            height={600}
            className="aspect-[4/5] w-full rounded-[18px] object-cover"
            priority
          />
        </motion.div>

        {/* Caption */}
        <StaggeredCaption />
      </Card>
    </motion.div>
  );
};

export default YesMoment;
