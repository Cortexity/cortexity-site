import type { Metadata } from "next";
import Image from "next/image";
import { PhoneFrame } from "@/components/placeholders";

export const metadata: Metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
};

const REDS = [
  { id: "A", hex: "#e0201a" },
  { id: "B", hex: "#E0201A" },
  { id: "C", hex: "#D70015" },
  { id: "D", hex: "#C8102E" },
];

const SECTIONS = [
  ["reds", "1 · Red swatches"],
  ["blobs", "2 · Blob tints"],
  ["phones", "3 · Phone frame"],
  ["cards", "4 · Card styles"],
  ["timeline", "5 · Process timeline"],
];

const PADEL = { src: "/screens/padel-2.png", alt: "Padel app, screen 2", width: 853, height: 1844 };

function lighten(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.min(255, Math.round(v + (255 - v) * amt));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => c(v).toString(16).padStart(2, "0")).join("")}`;
}
function darken(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.round(v * (1 - amt)));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => c(v).toString(16).padStart(2, "0")).join("")}`;
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.14em] text-ink-muted">{children}</p>;
}

function Pill({ hex, flat }: { hex: string; flat?: boolean }) {
  const style = flat
    ? { background: hex }
    : {
        background: `linear-gradient(180deg, ${lighten(hex, 0.08)}, ${darken(hex, 0.12)})`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 24px ${hex}59`,
      };
  return (
    <span className="inline-flex min-h-12 items-center justify-center rounded-pill px-7 text-[1rem] font-medium text-white" style={style}>
      Apply to Build Your App
    </span>
  );
}


const PRODUCT = (
  <>
    <span className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#f5f5f7]">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e0201a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3Z" />
        <path d="M9.5 19.5h5M10.5 22h3" />
      </svg>
    </span>
    <h3 className="mt-6 text-h3">Product</h3>
    <div className="mt-4 space-y-1.5 text-body text-current/70">
      <p>We take what&rsquo;s in your head and turn it into a product that makes sense.</p>
      <p>What should the app actually do? What does the user experience? What belongs in the first version?</p>
      <p>We&rsquo;ll figure that out together.</p>
    </div>
  </>
);

const WEEKS = [
  {
    label: "Week 1",
    title: "First, we understand the idea.",
    lines: [
      "We talk.",
      "You explain what you’ve been thinking about, who it’s for, why you believe it should exist and how you imagine it working.",
      "We’ll ask questions, challenge things where necessary, and turn the idea into something we can start building.",
    ],
  },
  {
    label: "Week 2",
    title: "Then, we make it real.",
    lines: [
      "You’ll start seeing your product take shape.",
      "Not months from now.",
      "During the project.",
      "Screens become flows. Flows become features. Features become a working app on your iPhone.",
    ],
  },
  {
    label: "Week 3",
    title: "Then, we make it better.",
    lines: [
      "You use it.",
      "We use it.",
      "We find what feels wrong.",
      "We change it.",
      "You realize something should work differently? We talk about it and change direction.",
      "The product gets better as it becomes real.",
    ],
  },
];

export default function Lab() {
  return (
    <main className="tone-white mx-auto max-w-[80rem] px-5 py-16 sm:px-8">
      <h1 className="text-h2">Lab</h1>
      <p className="mt-2 text-ink-muted">Design variants, side by side. Not linked from the site.</p>
      <nav className="mt-6 flex flex-wrap gap-2">
        {SECTIONS.map(([id, name]) => (
          <a key={id} href={`#${id}`} className="rounded-pill bg-[#f5f5f7] px-4 py-2 text-small font-medium hover:bg-[#e5e5ea]">
            {name}
          </a>
        ))}
      </nav>

      {/* 1 · REDS */}
      <section id="reds" className="mt-20 scroll-mt-8">
        <h2 className="text-h3">1 · Red swatches</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {REDS.map((r) => (
            <div key={r.id} className="rounded-[24px] border border-[#e5e5ea] bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <Label>{r.id} · {r.hex}</Label>
              <p className="text-h2">
                Built in <em className="accent" style={{ color: r.hex }}>21 days.</em>
              </p>
              <div className="mt-8 flex flex-wrap gap-8">
                <div>
                  <Label>Flat</Label>
                  <Pill hex={r.hex} flat />
                </div>
                <div>
                  <Label>Gradient</Label>
                  <Pill hex={r.hex} />
                </div>
              </div>
              <div className="mt-6 h-3 rounded-full" style={{ background: r.hex }} />
            </div>
          ))}
        </div>
      </section>

      {/* 2 · BLOBS */}
      <section id="blobs" className="mt-24 scroll-mt-8">
        <h2 className="text-h3">2 · Blob tints</h2>
        {[
          { name: "As is", filter: "none", overlay: false },
          { name: "Desaturated 50% · brightness +10%", filter: "saturate(0.5) brightness(1.1)", overlay: false },
          { name: "Greyscale + faint red overlay", filter: "grayscale(1)", overlay: true },
        ].map((v) => (
          <div key={v.name} className="mt-8">
            <Label>{v.name}</Label>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="relative aspect-square overflow-hidden rounded-[24px] bg-[#f5f5f7]">
                  <Image src={`/blob-${n}.png`} alt={`Blob ${n}`} fill sizes="300px" className="object-contain p-4" style={{ filter: v.filter }} />
                  {v.overlay ? <div className="absolute inset-0 bg-[#e0201a] mix-blend-multiply opacity-[0.14]" /> : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* 3 · PHONES */}
      <section id="phones" className="mt-24 scroll-mt-8">
        <h2 className="text-h3">3 · Phone frame</h2>
        <div className="mt-6 grid gap-10 sm:grid-cols-3">
          <div>
            <Label>Site frame · inset 3%</Label>
            <PhoneFrame screen={PADEL} />
          </div>
          <div>
            <Label>Tilted −6°</Label>
            <PhoneFrame screen={PADEL} tilt={-6} />
          </div>
          <div>
            <Label>Tilted +6°</Label>
            <PhoneFrame screen={PADEL} tilt={6} />
          </div>
        </div>
      </section>

      {/* 4 · CARDS */}
      <section id="cards" className="mt-24 scroll-mt-8">
        <h2 className="text-h3">4 · Card styles</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <Label>Current · dark</Label>
            <div className="rounded-[24px] bg-[#f5f5f7] p-4">
              <div className="glass p-8">{PRODUCT}</div>
            </div>
          </div>
          <div>
            <Label>Solid white · 1px #E5E5EA · soft shadow</Label>
            <div className="rounded-[24px] bg-[#f5f5f7] p-4">
              <div className="rounded-[24px] border border-[#e5e5ea] bg-white p-8 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">{PRODUCT}</div>
            </div>
          </div>
          <div>
            <Label>Dark #1D1D1F · white text</Label>
            <div className="rounded-[24px] bg-[#f5f5f7] p-4">
              <div className="rounded-[24px] bg-[#1d1d1f] p-8 text-white [&_span]:bg-white/10">{PRODUCT}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 · TIMELINE */}
      <section id="timeline" className="mt-24 scroll-mt-8">
        <h2 className="text-h3">5 · Process timeline</h2>
        <div className="mx-auto mt-10 max-w-[44rem]">
          <ol className="relative border-l-2 border-[#e5e5ea] pl-10 sm:pl-14">
            {WEEKS.map((w, i) => (
              <li key={w.label} className="relative pb-14 last:pb-0">
                <span className="absolute -left-[calc(2.5rem+17px)] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-red text-[0.875rem] font-semibold text-white sm:-left-[calc(3.5rem+17px)]">
                  {i + 1}
                </span>
                <Label>{w.label}</Label>
                <div className="rounded-[24px] border border-[#e5e5ea] bg-white p-7 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:p-9">
                  <h3 className="text-h3">{w.title}</h3>
                  <div className="mt-4 space-y-1.5 text-body text-ink-muted">
                    {w.lines.map((l) => (
                      <p key={l} className={l === "The product gets better as it becomes real." ? "pt-4 text-[1.375rem] font-semibold text-ink" : ""}>{l}</p>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
