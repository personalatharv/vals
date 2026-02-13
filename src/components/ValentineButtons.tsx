"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useReward } from "partycles";
import { Button } from "@/components/ui/button";
import { type Phase, isPhaseAtLeast, EASE, buttonsVariants } from "@/lib/phases";
import { YES_LABEL, NO_LABEL, TEASE_MESSAGES } from "@/lib/copy";
import {
  DANGER_RADIUS,
  THROTTLE_MS,
  computeNewPosition,
  distanceBetween,
  rectCenter,
} from "@/lib/runaway";

/**
 * ValentineButtons — Yes + runaway No buttons with teasing messages.
 *
 * The No button starts inline next to Yes in the flex row.
 * On first cursor approach it reads its own rect, switches to
 * fixed positioning, and starts running away.
 */

interface ValentineButtonsProps {
  phase: Phase;
  onYes: () => void;
}

interface TeasePos {
  x: number;
  y: number;
}

const ValentineButtons = ({ phase, onYes }: ValentineButtonsProps) => {
  const showButtons = isPhaseAtLeast(phase, "the_ask");

  // Has the No button escaped the flex row yet?
  const [escaped, setEscaped] = useState(false);
  const [noPos, setNoPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [noAttempts, setNoAttempts] = useState(0);
  const [teaseMessage, setTeaseMessage] = useState<string | null>(null);
  const [teasePos, setTeasePos] = useState<TeasePos>({ x: 0, y: 0 });

  const yesRef = useRef<HTMLButtonElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const lastMoveTime = useRef(0);
  const teaseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noDuration = useRef(0.32);
  const noRotate = useRef(0);

  // Partycles — small hearts on hover (click burst handled by YesMoment)
  const { reward: hoverHearts } = useReward("yes-reward-anchor", "hearts", {
    particleCount: 8,
    spread: 40,
    startVelocity: 8,
    decay: 0.92,
    lifetime: 60,
    elementSize: 12,
    colors: ["#f5a6c6", "#e7c9a9", "#f3eee6"],
  });

  const handleYesHover = useCallback(() => {
    hoverHearts();
  }, [hoverHearts]);

  /** Relocate the No button and show tease message near it */
  const relocateNo = useCallback(() => {
    const now = Date.now();
    if (now - lastMoveTime.current < THROTTLE_MS) return;
    lastMoveTime.current = now;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const noBounds = noRef.current?.getBoundingClientRect();
    const yesBounds = yesRef.current?.getBoundingClientRect() ?? null;
    const buttonW = noBounds?.width ?? 100;
    const buttonH = noBounds?.height ?? 48;

    // On first escape, read current inline rect and switch to fixed
    if (!escaped && noBounds) {
      setEscaped(true);
      // Seed noPos with current inline position so first animation
      // starts from the right spot
      const startPos = { x: noBounds.left, y: noBounds.top };
      const prevCenter = rectCenter(noBounds);
      const newPos = computeNewPosition(vw, vh, buttonW, buttonH, yesBounds, prevCenter);
      if (newPos) {
        noDuration.current = 0.3;
        noRotate.current = (Math.random() - 0.5) * 4;

        const teaseX = Math.min(Math.max(newPos.x, 10), vw - 240);
        const teaseY = Math.max(newPos.y - 44, 10);
        setTeasePos({ x: teaseX, y: teaseY });

        // Set start pos first so initial render is at the inline spot,
        // then immediately set target pos so Motion animates between them
        setNoPos(startPos);
        requestAnimationFrame(() => setNoPos(newPos));
      }
    } else {
      const prevCenter = noBounds ? rectCenter(noBounds) : null;
      const newPos = computeNewPosition(vw, vh, buttonW, buttonH, yesBounds, prevCenter);

      if (newPos) {
        noDuration.current = 0.28 + Math.random() * 0.1;
        noRotate.current = (Math.random() - 0.5) * 4;

        const teaseX = Math.min(Math.max(newPos.x, 10), vw - 240);
        const teaseY = Math.max(newPos.y - 44, 10);
        setTeasePos({ x: teaseX, y: teaseY });

        setNoPos(newPos);
      }
    }

    // Cycle through tease messages
    const attempt = noAttempts + 1;
    setNoAttempts(attempt);
    const msgIndex = (attempt - 1) % TEASE_MESSAGES.length;
    setTeaseMessage(TEASE_MESSAGES[msgIndex]);

    // Auto-hide message after 1.6s
    if (teaseTimeout.current) clearTimeout(teaseTimeout.current);
    teaseTimeout.current = setTimeout(() => setTeaseMessage(null), 1600);
  }, [noAttempts, escaped]);

  /** Track pointer and trigger runaway when cursor enters danger radius */
  useEffect(() => {
    if (!showButtons) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!noRef.current) return;
      const noBounds = noRef.current.getBoundingClientRect();
      const noCenter = rectCenter(noBounds);
      const cursor = { x: e.clientX, y: e.clientY };

      if (distanceBetween(cursor, noCenter) < DANGER_RADIUS) {
        relocateNo();
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [showButtons, relocateNo]);

  // Cleanup tease timeout
  useEffect(() => {
    return () => {
      if (teaseTimeout.current) clearTimeout(teaseTimeout.current);
    };
  }, []);

  if (!showButtons) return null;

  /** Shared No button classes */
  const noButtonClasses =
    "h-12 rounded-2xl px-7 text-[15px] font-medium tracking-[0.02em] bg-transparent text-[#f3eee6]/75 border border-[rgba(243,238,230,0.18)] hover:text-[#f3eee6]/90 hover:border-[rgba(243,238,230,0.35)] active:scale-[0.98] transition-colors cursor-pointer";

  return (
    <>
      {/* Buttons entrance wrapper */}
      <motion.div
        className="relative z-20 mt-6 flex items-center gap-4 sm:gap-5"
        initial={buttonsVariants.initial}
        animate={buttonsVariants.target}
        transition={{ duration: buttonsVariants.duration, ease: EASE, delay: buttonsVariants.delay }}
      >
        {/* Backdrop plate */}
        <div
          className="absolute -inset-3 -z-10 rounded-[22px] border border-[rgba(243,238,230,0.10)] bg-[#0b0b12]/35 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Yes button */}
        <Button
          ref={yesRef}
          variant="ghost"
          className="relative h-12 rounded-2xl px-7 text-[15px] font-medium tracking-[0.02em] bg-[#f3eee6]/10 text-[#f3eee6] border border-[#e7c9a9]/40 hover:bg-[#f3eee6]/14 hover:border-[#e7c9a9]/65 hover:shadow-[0_0_24px_rgba(231,201,169,0.12)] active:scale-[0.98] transition-all"
          onClick={onYes}
          onMouseEnter={handleYesHover}
          aria-label="Yes, be my Valentine"
          tabIndex={0}
        >
          <span id="yes-reward-anchor" className="absolute inset-0" />
          {YES_LABEL}
        </Button>

        {/* No button — inline until first escape */}
        {!escaped && (
          <button
            ref={noRef}
            className={noButtonClasses}
            onClick={(e) => {
              e.preventDefault();
              relocateNo();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              relocateNo();
            }}
            aria-label="No"
            tabIndex={0}
          >
            {NO_LABEL}
          </button>
        )}
      </motion.div>

      {/* No button — fixed positioned after escape, runs away */}
      {escaped && (
        <motion.button
          ref={noRef}
          className={`fixed z-20 ${noButtonClasses}`}
          animate={{
            left: noPos.x,
            top: noPos.y,
            rotate: noAttempts > 0 ? noRotate.current : 0,
          }}
          transition={{ duration: noDuration.current, ease: EASE }}
          onClick={(e) => {
            e.preventDefault();
            relocateNo();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            relocateNo();
          }}
          aria-label="No"
          tabIndex={0}
        >
          {NO_LABEL}
        </motion.button>
      )}

      {/* Teasing message toast — positioned near the No button */}
      <AnimatePresence>
        {teaseMessage && (
          <motion.div
            key={`${teaseMessage}-${noAttempts}`}
            className="pointer-events-none fixed z-50"
            style={{ left: teasePos.x, top: teasePos.y }}
            initial={{ opacity: 0, y: 4, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(8px)" }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="whitespace-nowrap rounded-2xl border border-[rgba(243,238,230,0.12)] bg-[#0b0b12]/55 px-4 py-2 text-[13px] tracking-[0.01em] text-[#f3eee6]/80 backdrop-blur-md shadow-[0_0_22px_rgba(245,166,198,0.10)]">
              {teaseMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ValentineButtons;
