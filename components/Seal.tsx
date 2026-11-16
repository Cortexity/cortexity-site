/**
 * "100% Satisfaction Guaranteed" seal, drawn in the site palette (red #E0201A, ink/white).
 * Pure SVG: scalloped red rosette, inner disc in the band colour, ring text on a circular path.
 * `dark` = for tone-black bands (black disc, white type).
 */

const RED = "#E0201A";

/** Scalloped rosette edge: N bumps between radii rIn and rOut, centred at 100,100. */
function scallopPath(n = 28, rIn = 88, rOut = 99): string {
  const pt = (r: number, a: number) => `${(100 + r * Math.cos(a)).toFixed(2)} ${(100 + r * Math.sin(a)).toFixed(2)}`;
  const step = (Math.PI * 2) / n;
  let d = `M ${pt(rIn, 0)}`;
  for (let i = 0; i < n; i++) {
    const mid = step * (i + 0.5);
    const end = step * (i + 1);
    d += ` Q ${pt(rOut + 4, mid)} ${pt(rIn, end)}`;
  }
  return `${d} Z`;
}

const EDGE = scallopPath();

/** Five-point star centred at cx,cy with outer radius r. */
function star(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(2)} ${(cy + rr * Math.sin(a)).toFixed(2)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

export function Seal({
  id,
  dark = false,
  className = "",
}: {
  /** Unique per page: used for the text path id. */
  id: string;
  dark?: boolean;
  className?: string;
}) {
  const disc = dark ? "#000000" : "#FFFFFF";
  const ink = dark ? "#FFFFFF" : "#1D1D1F";
  const top = `seal-top-${id}`;
  const bot = `seal-bot-${id}`;
  const font = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif';

  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="100% satisfaction guaranteed"
      className={`block select-none ${className}`}
    >
      <defs>
        {/* Top arc: clockwise over the top, glyphs point outward. */}
        <path id={top} d="M 38 100 A 62 62 0 0 1 162 100" />
        {/* Bottom arc: anticlockwise under the bottom, glyphs point inward (reads upright). */}
        <path id={bot} d="M 28 100 A 72 72 0 0 0 172 100" />
      </defs>

      {/* Red rosette */}
      <path d={EDGE} fill={RED} />
      {/* Inner disc + double ring */}
      <circle cx="100" cy="100" r="82" fill={disc} />
      <circle cx="100" cy="100" r="78" fill="none" stroke={RED} strokeWidth="2" />
      <circle cx="100" cy="100" r="55" fill="none" stroke={RED} strokeWidth="1.25" />

      {/* Ring text */}
      <g fill={ink} fontFamily={font} fontSize="13" fontWeight="700" letterSpacing="1.4">
        <text>
          <textPath href={`#${top}`} startOffset="50%" textAnchor="middle">
            SATISFACTION
          </textPath>
        </text>
        <text>
          <textPath href={`#${bot}`} startOffset="50%" textAnchor="middle">
            GUARANTEED
          </textPath>
        </text>
      </g>
      {/* Stars at 9 and 3 o'clock */}
      <g fill={ink}>
        <path d={star(33.5, 100, 4.5)} />
        <path d={star(166.5, 100, 4.5)} />
      </g>

      {/* Centre */}
      <text
        x="100"
        y="108"
        textAnchor="middle"
        fill={ink}
        fontFamily={font}
        fontSize="34"
        fontWeight="700"
        letterSpacing="-1.2"
      >
        100<tspan fill={ink}>%</tspan>
      </text>
      <line x1="76" y1="121" x2="124" y2="121" stroke={RED} strokeWidth="1.25" />
      <text
        x="100"
        y="134"
        textAnchor="middle"
        fill={ink}
        fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif'
        fontSize="8.5"
        fontWeight="600"
        letterSpacing="1.6"
      >
        CORTEXITY
      </text>
    </svg>
  );
}
