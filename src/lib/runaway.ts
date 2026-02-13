/**
 * No-button runaway logic.
 *
 * Constants + relocation algorithm that finds a safe random
 * position for the No button away from cursor, Yes button,
 * and viewport edges — but within a constrained jump radius
 * so it feels playful, not glitchy.
 */

export const DANGER_RADIUS = 72;
export const SAFE_PADDING = 24;
export const MAX_MOVES_PER_SECOND = 2;
export const MIN_DIST_FROM_YES = 100;
export const MIN_DIST_FROM_PREV = 80;
export const MAX_JUMP_DISTANCE = 500;
export const MIN_JUMP_DISTANCE = 150;
export const MAX_TRIES = 24;

/** Throttle interval in ms derived from MAX_MOVES_PER_SECOND */
export const THROTTLE_MS = 1000 / MAX_MOVES_PER_SECOND;

interface Point {
  x: number;
  y: number;
}

/** Euclidean distance between two points */
export const distanceBetween = (a: Point, b: Point): number =>
  Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

/** Center of a DOMRect */
export const rectCenter = (r: DOMRect): Point => ({
  x: r.left + r.width / 2,
  y: r.top + r.height / 2,
});

/**
 * Clamp a value between min and max.
 */
const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

/**
 * Find a random safe position for the No button within a
 * constrained jump radius of its current position.
 *
 * Returns {x, y} as top-left coordinates for fixed positioning,
 * or null if no valid position found (extremely unlikely).
 */
export const computeNewPosition = (
  viewportW: number,
  viewportH: number,
  buttonW: number,
  buttonH: number,
  yesBounds: DOMRect | null,
  prevPos: Point | null,
): Point | null => {
  const yesCenter = yesBounds ? rectCenter(yesBounds) : null;

  let bestCandidate: Point | null = null;
  let bestScore = -Infinity;

  for (let attempt = 0; attempt < MAX_TRIES; attempt++) {
    let x: number;
    let y: number;

    if (prevPos) {
      // Jump a random distance within [MIN_JUMP_DISTANCE, MAX_JUMP_DISTANCE]
      const angle = Math.random() * Math.PI * 2;
      const dist = MIN_JUMP_DISTANCE + Math.random() * (MAX_JUMP_DISTANCE - MIN_JUMP_DISTANCE);
      x = prevPos.x + Math.cos(angle) * dist;
      y = prevPos.y + Math.sin(angle) * dist;

      // Clamp to viewport
      x = clamp(x, SAFE_PADDING, viewportW - buttonW - SAFE_PADDING);
      y = clamp(y, SAFE_PADDING, viewportH - buttonH - SAFE_PADDING);
    } else {
      // First move — random within viewport
      x = SAFE_PADDING + Math.random() * (viewportW - buttonW - SAFE_PADDING * 2);
      y = SAFE_PADDING + Math.random() * (viewportH - buttonH - SAFE_PADDING * 2);
    }

    // Center of candidate button
    const candidateCenter: Point = { x: x + buttonW / 2, y: y + buttonH / 2 };

    // Score: prefer candidates far from Yes and far from previous position
    let score = 0;

    // Check: not too close to Yes button
    if (yesCenter) {
      const distToYes = distanceBetween(candidateCenter, yesCenter);
      if (distToYes < MIN_DIST_FROM_YES) {
        score -= (MIN_DIST_FROM_YES - distToYes);
      } else {
        score += distToYes * 0.5;
      }
    }

    // Check: not too close to previous No position
    if (prevPos) {
      const distToPrev = distanceBetween(candidateCenter, prevPos);
      if (distToPrev < MIN_DIST_FROM_PREV) {
        score -= (MIN_DIST_FROM_PREV - distToPrev) * 2;
      } else {
        score += distToPrev;
      }
    }

    // Track best candidate
    if (score > bestScore) {
      bestScore = score;
      bestCandidate = { x, y };
    }

    // Accept if both constraints pass
    const okYes = !yesCenter || distanceBetween(candidateCenter, yesCenter) >= MIN_DIST_FROM_YES;
    const okPrev = !prevPos || distanceBetween(candidateCenter, prevPos) >= MIN_DIST_FROM_PREV;

    if (okYes && okPrev) {
      return { x, y };
    }
  }

  // All attempts exhausted — return best candidate
  return bestCandidate;
};
