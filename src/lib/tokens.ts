/** Design tokens for the Valentine experience */

export const colors = {
  night: "#050508",
  ink: "#0b0b12",
  ivory: "#f3eee6",
  champagne: "#e7c9a9",
  rose: "#e11d48",
  mist: "rgba(243,238,230,0.10)",
  orchidGlow: "rgba(245,166,198,0.18)",
} as const;

/** Cinematic easing curve — used everywhere */
export const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;
