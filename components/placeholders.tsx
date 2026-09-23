import fs from "node:fs";
import path from "node:path";
import { Parallax } from "./Parallax";

/* ====================================================================
   PLACEHOLDERS — every visual that is waiting on a real asset lives here.

   Screenshots load automatically at build time if these files exist:
     public/screens/padel-1..3.png
     public/screens/slowr-1..3.png
     public/screens/reflexflow-1..3.png
   Passing `screens` explicitly still overrides them. Missing files leave
   an empty slot at the same fixed aspect ratio, so nothing shifts.

   Inventory (also listed in DESIGN.md):
     1. <FounderVideo/>   founder video, 60–90s, 16:9
     2. <PhoneTrio/>      three iPhones showing the finished padel app
     3. <AppMockup/>      SLOWR and ReflexFlow iPhone mockups (three each)
   ==================================================================== */

/**
 * A screenshot dropped into an iPhone frame. `src` is the 2x variant
 * (640 px wide, lanczos-downscaled by scripts/screens.mjs); `srcSet` adds
 * the 3x variant and the original so the browser draws close to 1:1.
 * `width`/`height` describe the 2x variant.
 */
export type Screen = { src: string; alt: string; srcSet?: string; width?: number; height?: number };

/** Default `sizes`: phones are ~320 CSS px on desktop, ~40vw on mobile. */
const DEFAULT_SIZES = "(min-width: 768px) 320px, 40vw";

/** Reads a PNG's native pixel size from its IHDR chunk (build time only). */
function pngSize(rel: string): { width: number; height: number } | null {
  try {
    const fd = fs.openSync(path.join(process.cwd(), "public", rel), "r");
    const buf = Buffer.alloc(24);
    fs.readSync(fd, buf, 0, 24, 0);
    fs.closeSync(fd);
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  } catch {
    return null;
  }
}

/** iPhone 15 Pro screen ratio: 1179 × 2556 px. */
export const SCREEN_ASPECT = "1179 / 2556";

/** Fills gaps in `given` with public/screens/<slug>-<n>.png when the file exists. */
function autoScreens(slug: string, count: number, label: string, given: (Screen | undefined)[] = []) {
  return Array.from({ length: count }, (_, i) => {
    if (given[i]) return given[i];
    const name = `${slug}-${i + 1}.png`;
    const orig = `/screens/${name}`;
    if (!fs.existsSync(path.join(process.cwd(), "public", orig))) return undefined;
    const alt = `${label} app, screen ${i + 1}`;
    const x2 = `/screens/2x/${name}`;
    const x3 = `/screens/3x/${name}`;
    const has = (rel: string) => fs.existsSync(path.join(process.cwd(), "public", rel));
    // Variants come from `node scripts/screens.mjs`; fall back to the original if they are missing.
    if (!has(x2)) return { src: orig, alt, ...(pngSize(orig) ?? {}) };
    const w = (rel: string) => pngSize(rel)?.width ?? 0;
    const candidates = [x2, ...(has(x3) ? [x3] : []), orig];
    const srcSet = candidates.map((rel) => `${rel} ${w(rel)}w`).join(", ");
    return { src: x2, alt, srcSet, ...(pngSize(x2) ?? {}) };
  });
}

/* --------------------------------------------------------------------
   iPhone frame — screenshot inset 3% with a matched inner radius, so a
   black rim shows all round (see lib/tokens.ts).
   -------------------------------------------------------------------- */
export function PhoneFrame({
  screen,
  className = "",
  priority = false,
  tilt = 0,
  sizes = DEFAULT_SIZES,
}: {
  screen?: Screen;
  /** Kept for API compatibility. */
  label?: string;
  className?: string;
  /** `sizes` for the srcset; defaults to DEFAULT_SIZES. */
  sizes?: string;
  /** Above the fold: eager + high fetch priority. */
  priority?: boolean;
  /** Degrees. Rotated frames get translateZ/backface hints against blur. */
  tilt?: number;
}) {
  return (
    <div
      className={`@container ${className}`}
      data-placeholder={screen ? undefined : "phone-screen"}
      style={
        tilt
          ? { transform: `rotate(${tilt}deg) translateZ(0)`, willChange: "transform", backfaceVisibility: "hidden", imageRendering: "auto" }
          : undefined
      }
    >
      <div className="relative rounded-[14.5cqw] bg-black p-[3cqw] shadow-[0_40px_80px_rgba(0,0,0,0.28)]">
        <div className="relative overflow-hidden rounded-[11.5cqw] bg-black" style={{ aspectRatio: SCREEN_ASPECT }}>
          {screen ? (
            // Plain <img> with a srcset of pre-downscaled variants (see scripts/screens.mjs), never resampled by an optimizer.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={screen.src}
              srcSet={screen.srcSet}
              sizes={screen.srcSet ? sizes : undefined}
              alt={screen.alt}
              width={screen.width}
              height={screen.height}
              decoding="async"
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-[#f5f5f7] to-white" />
          )}
          <div aria-hidden="true" className="absolute left-1/2 top-[3cqw] h-[8.5cqw] w-[30cqw] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}

/** Soft white radial glow for phones sitting on black. */
function Glow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[1200px] w-[1200px] max-w-[200vw] -translate-x-1/2 -translate-y-1/2"
      style={{ background: "radial-gradient(circle 600px at center, rgba(255,255,255,0.06), transparent 70%)" }}
    />
  );
}

/* --------------------------------------------------------------------
   1. FOUNDER VIDEO — 60–90 seconds, 16:9.
   -------------------------------------------------------------------- */
export function FounderVideo({
  src,
  poster,
  captions,
  className = "",
}: {
  src?: string;
  poster?: string;
  captions?: string;
  className?: string;
}) {
  return (
    <figure
      className={`relative overflow-hidden rounded-[28px] bg-black ${className}`}
      style={{ aspectRatio: "16 / 9" }}
      data-placeholder={src ? undefined : "founder-video"}
    >
      {src ? (
        <video className="absolute inset-0 h-full w-full object-cover" controls playsInline preload="none" poster={poster}>
          <source src={src} />
          {captions ? <track kind="captions" src={captions} srcLang="en" label="English" default /> : null}
        </video>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#2a2a2d_0%,#111113_45%,#000_100%)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              aria-hidden="true"
              className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/80 backdrop-blur-sm sm:h-28 sm:w-28"
            >
              <svg width="30" height="34" viewBox="0 0 22 24" fill="none" className="ml-1.5 h-7 w-7 sm:h-9 sm:w-9">
                <path d="M2 2.6v18.8c0 1.2 1.3 2 2.4 1.4l16.2-9.4a1.6 1.6 0 0 0 0-2.8L4.4 1.2C3.3.6 2 1.4 2 2.6Z" fill="#ffffff" />
              </svg>
            </span>
          </div>
          <figcaption className="absolute bottom-0 left-0 px-5 pb-4 text-eyebrow uppercase text-[#6e6e73] sm:px-7 sm:pb-6">
            Joseph, founder · 60–90 sec
          </figcaption>
        </div>
      )}
    </figure>
  );
}

/* --------------------------------------------------------------------
   2. THREE IPHONES — the finished padel app. [left, centre, right].
   -------------------------------------------------------------------- */
export function PhoneTrio({
  screens,
  className = "",
  glow = false,
  priority = false,
}: {
  screens?: (Screen | undefined)[];
  className?: string;
  /** Radial glow behind the phones (use on black sections). */
  glow?: boolean;
  priority?: boolean;
}) {
  const [left, centre, right] = autoScreens("padel", 3, "Padel", screens);
  return (
    <div
      className={`relative mx-auto w-full max-w-[56rem] ${className}`}
      data-placeholder={left && centre && right ? undefined : "padel-app-trio"}
    >
      {glow ? <Glow /> : null}
      <Parallax className="relative flex items-end justify-center">
        <PhoneFrame screen={left} priority={priority} className="relative z-0 -mr-[5%] mb-[4%] w-[33%]" />
        <PhoneFrame screen={centre} priority={priority} className="relative z-10 w-[40%]" />
        <PhoneFrame screen={right} priority={priority} className="relative z-0 -ml-[5%] mb-[4%] w-[33%]" />
      </Parallax>
    </div>
  );
}

/* --------------------------------------------------------------------
   3. APP MOCKUPS — SLOWR / ReflexFlow. Centre phone straight and raised 40px,
   outer phones tilted ±6°, no filters or scaling. `screens` is [left, centre, right].
   -------------------------------------------------------------------- */
export function AppMockup({
  name,
  screens,
  className = "",
  glow = true,
}: {
  name: string;
  screens?: (Screen | undefined)[];
  className?: string;
  glow?: boolean;
}) {
  const slug = name.toLowerCase();
  const [left, centre, right] = autoScreens(slug, 3, name, screens);
  return (
    <div
      className={`relative mx-auto w-full max-w-[56rem] pt-10 ${className}`}
      data-placeholder={left && centre && right ? undefined : `${slug}-mockups`}
    >
      {glow ? <Glow /> : null}
      <Parallax className="relative flex items-end justify-center">
        <PhoneFrame screen={left} tilt={-6} className="relative z-0 -mr-[4%] w-[32%]" />
        <PhoneFrame screen={centre} className="relative z-10 w-[34%] -translate-y-10" />
        <PhoneFrame screen={right} tilt={6} className="relative z-0 -ml-[4%] w-[32%]" />
      </Parallax>
    </div>
  );
}
