import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { Parallax } from "./Parallax";

/** Resolves blob-N.png from public/blobs/ or public/. Returns null if absent. */
function blobSrc(n: number): string | null {
  for (const rel of [`/blobs/blob-${n}.png`, `/blob-${n}.png`]) {
    if (fs.existsSync(path.join(process.cwd(), "public", rel))) return rel;
  }
  return null;
}

export type BlobSpot = {
  n: 1 | 2 | 3 | 4;
  /** Static Tailwind classes: position + width. */
  className: string;
  /** Further back = blurred, slower parallax. */
  back?: boolean;
  hideOnMobile?: boolean;
  delay?: number;
};

/** Floating glass objects at section edges. Renders nothing if files are missing. */
export function Blobs({ spots }: { spots: BlobSpot[] }) {
  const items = spots.map((s) => ({ ...s, src: blobSrc(s.n) })).filter((s) => s.src);
  if (!items.length) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {items.map((s, i) => (
        <Parallax
          key={i}
          max={s.back ? 20 : 45}
          className={`absolute aspect-square ${s.className} ${s.hideOnMobile ? "hidden md:block" : ""}`}
        >
          <div className="float h-full w-full" style={{ animationDelay: `${s.delay ?? i * -3}s` }}>
            <Image
              src={s.src!}
              alt=""
              fill
              sizes="(min-width: 768px) 600px, 320px"
              className={`object-contain saturate-50 brightness-110 ${s.back ? "opacity-80 blur-[6px]" : ""}`}
            />
          </div>
        </Parallax>
      ))}
    </div>
  );
}

/** Faint 24px dot grid. */
export function Dots() {
  return <div aria-hidden="true" className="dots" />;
}

/** Fixed page-wide mesh gradient. */
export function Mesh() {
  return (
    <div aria-hidden="true" className="mesh">
      <i />
      <i />
      <i />
    </div>
  );
}

/** Slow greyscale marquee of portfolio app names (with icons if present). */
export function AppMarquee() {
  const apps = [
    { name: "SLOWR", slug: "slowr" },
    { name: "ReflexFlow", slug: "reflexflow" },
  ].map((a) => {
    const icon = `/screens/${a.slug}-icon.png`;
    return { ...a, icon: fs.existsSync(path.join(process.cwd(), "public", icon)) ? icon : null };
  });
  const row = Array.from({ length: 6 }, () => apps).flat();
  return (
    <div className="marquee mx-auto mt-10 max-w-[56rem] overflow-hidden opacity-40 grayscale sm:mt-12">
      <p className="sr-only">Apps shipped by Cortexity: SLOWR, ReflexFlow.</p>
      <div aria-hidden="true" className="marquee-track flex items-center gap-16">
        {[...row, ...row].map((a, i) => (
          <span key={i} className="flex shrink-0 items-center gap-3 text-[1.375rem] font-semibold tracking-[-0.01em]">
            {a.icon ? <Image src={a.icon} alt="" width={32} height={32} className="rounded-[8px]" /> : null}
            {a.name}
          </span>
        ))}
      </div>
    </div>
  );
}
