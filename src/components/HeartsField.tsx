"use client";

import { motion } from "motion/react";

/**
 * HeartsField — Ambient floating hearts layer.
 *
 * 30 hearts drift slowly upward with gentle horizontal sway.
 * Mostly mist/ivory tinted, with a few orchidGlow accents.
 * Uses Motion keyframe animations for smooth, infinite drift.
 */

/** Deterministic heart configuration (pre-randomized) */
interface HeartConfig {
  id: number;
  startX: number;     // % across viewport
  delay: number;      // seconds
  duration: number;   // seconds
  scale: number;      // 0.6–1.2
  hasGlow: boolean;   // orchidGlow accent on select hearts
}

const HEART_COUNT = 30;

/** Generate a seeded set of heart configs */
const generateHearts = (): HeartConfig[] => {
  const hearts: HeartConfig[] = [];
  for (let i = 0; i < HEART_COUNT; i++) {
    // Deterministic pseudo-random using index-based formulas
    const seed = (i * 137.5) % 100;
    hearts.push({
      id: i,
      startX: (i * 3.37 + seed * 0.17) % 100,
      delay: (i * 0.73 + (seed * 0.04)) % 6,
      duration: 7 + ((i * 1.13 + seed * 0.05) % 7),
      scale: 0.6 + ((i * 0.47 + seed * 0.003) % 0.6),
      hasGlow: i % 7 === 0, // ~4 hearts get the orchidGlow accent
    });
  }
  return hearts;
};

const HEARTS = generateHearts();

/** Inline SVG heart path — subtle pink tint so they're visible on the dark bg */
const HeartSVG = ({ hasGlow }: { hasGlow: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={hasGlow ? "drop-shadow-[0_0_18px_rgba(245,166,198,0.28)]" : "drop-shadow-[0_0_14px_rgba(245,166,198,0.16)]"}
  >
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={hasGlow ? "rgba(245,166,198,0.45)" : "rgba(245,166,198,0.30)"}
    />
  </svg>
);

const HeartsField = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {HEARTS.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute select-none"
          style={{
            left: `${heart.startX}%`,
            top: 0,
            scale: heart.scale,
          }}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{
            y: ["110vh", "-20vh"],
            x: ["0px", "12px", "-8px", "10px", "0px"],
            opacity: [0, 0.4, 0.35, 0],
            rotate: [-6, 6, -4, 4],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <HeartSVG hasGlow={heart.hasGlow} />
        </motion.div>
      ))}
    </div>
  );
};

export default HeartsField;
