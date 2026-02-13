"use client";

/**
 * AmbientBackground — Cinematic background layers.
 *
 * Layers (bottom to top):
 *  1. Vignette radial gradient
 *  2. Subtle haze glow (warm champagne + orchid)
 *  3. Film grain overlay (CSS noise, animated)
 *  4. Dust specks (tiny scattered dots)
 */

/** Pre-computed dust speck positions (20 dots, deterministic) */
const DUST_SPECKS = [
  { top: "8%", left: "12%" },
  { top: "15%", left: "67%" },
  { top: "22%", left: "34%" },
  { top: "5%", left: "89%" },
  { top: "31%", left: "45%" },
  { top: "42%", left: "78%" },
  { top: "38%", left: "8%" },
  { top: "55%", left: "23%" },
  { top: "48%", left: "91%" },
  { top: "63%", left: "56%" },
  { top: "71%", left: "15%" },
  { top: "67%", left: "82%" },
  { top: "78%", left: "38%" },
  { top: "84%", left: "63%" },
  { top: "76%", left: "5%" },
  { top: "91%", left: "47%" },
  { top: "88%", left: "72%" },
  { top: "95%", left: "28%" },
  { top: "18%", left: "52%" },
  { top: "52%", left: "42%" },
] as const;

const AmbientBackground = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      {/* Layer 1: Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,166,198,0.06)_0%,rgba(5,5,8,0.88)_55%,rgba(5,5,8,0.98)_100%)]" />

      {/* Layer 2: Haze glow */}
      <div className="absolute inset-0 opacity-[0.55] blur-3xl bg-[radial-gradient(circle_at_20%_20%,rgba(231,201,169,0.10),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(245,166,198,0.08),transparent_60%),radial-gradient(circle_at_50%_85%,rgba(243,238,230,0.06),transparent_55%)]" />

      {/* Layer 3: Film grain (CSS noise via SVG filter, animated) */}
      <div
        className="absolute inset-0 opacity-[0.10] mix-blend-overlay animate-grain"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Layer 4: Dust specks */}
      <div className="absolute inset-0 opacity-[0.35]">
        {DUST_SPECKS.map((pos, i) => (
          <span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-[#f3eee6]/20 blur-[0.3px]"
            style={{ top: pos.top, left: pos.left }}
          />
        ))}
      </div>
    </div>
  );
};

export default AmbientBackground;
