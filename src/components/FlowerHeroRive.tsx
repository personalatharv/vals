"use client";

import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { motion } from "motion/react";
import { useEffect, useCallback } from "react";

/**
 * FlowerHeroRive — Animated flower centerpiece using Rive.
 *
 * Structure:
 *  1. Motion entrance wrapper (cinematic fade/blur/scale)
 *  2. Radial glow layer behind canvas
 *  3. Rive canvas with bloom animation + soft radial mask
 *
 * The bloom plays on load via autoplay + optional state machine trigger.
 * A CSS radial mask softly fades the canvas edges to hide the artboard
 * background, creating a natural "bloom glow" effect.
 */
const FlowerHeroRive = () => {
  const { RiveComponent, rive } = useRive({
    src: "/rive/flowers.riv",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  /** Attempt to fire bloom trigger/input after Rive loads */
  const handleBloomTrigger = useCallback(() => {
    if (!rive) return;

    try {
      // Try common state machine names
      const machineNames = ["State Machine 1", "SM", "Bloom", "bloom"];
      for (const name of machineNames) {
        const inputs = rive.stateMachineInputs(name);
        if (inputs && inputs.length > 0) {
          for (const input of inputs) {
            // Fire boolean bloom input
            if (
              input.name.toLowerCase().includes("bloom") &&
              input.type === 56 /* StateMachineInputType.Boolean */
            ) {
              input.value = true;
              return;
            }
            // Fire trigger bloom input
            if (
              input.name.toLowerCase().includes("bloom") &&
              input.type === 58 /* StateMachineInputType.Trigger */
            ) {
              input.fire();
              return;
            }
          }
          break;
        }
      }
    } catch {
      // Rive file may not have these inputs — that's fine, autoplay handles it
    }
  }, [rive]);

  useEffect(() => {
    if (!rive) return;
    // Trigger bloom after 500ms delay (per spec: bloom plays from 0.5s)
    const timer = setTimeout(handleBloomTrigger, 500);
    return () => clearTimeout(timer);
  }, [rive, handleBloomTrigger]);

  return (
    <motion.div
      className="relative flex items-center justify-center h-[320px] w-[320px] sm:h-[380px] sm:w-[380px] md:h-[520px] md:w-[520px]"
      initial={{ opacity: 0, y: 8, filter: "blur(12px)", scale: 0.98 }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Glow layer behind flower */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-[0.45] bg-[radial-gradient(circle,rgba(245,166,198,0.16)_0%,rgba(231,201,169,0.08)_35%,transparent_70%)]"
        aria-hidden="true"
      />

      {/* Rive canvas container — circular clip + radial fade hides artboard bg */}
      <div
        className="relative h-full w-full overflow-hidden rounded-full drop-shadow-[0_0_28px_rgba(245,166,198,0.10)]"
        style={{
          maskImage:
            "radial-gradient(circle at center, black 40%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 40%, transparent 72%)",
        }}
      >
        <RiveComponent
          className="h-full w-full"
          aria-label="Animated blooming flower"
        />
      </div>
    </motion.div>
  );
};

export default FlowerHeroRive;
