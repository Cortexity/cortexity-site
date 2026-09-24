import { Blobs } from "../Decor";
import { SectionHead } from "../SectionHead";
import { Reveal } from "../Reveal";
import { Prose, Section } from "../Section";
import { Strong } from "../Text";

/** SF-Symbols-style line icons, centred in a 24×24 viewBox, drawn white inside the red circle. */
const ICONS: Record<string, React.ReactNode> = {
  Product: <><path d="M12 3.5a6 6 0 0 0-3.4 10.95c.55.4.9 1 .9 1.65V17h5v-.9c0-.65.35-1.25.9-1.65A6 6 0 0 0 12 3.5Z" /><path d="M10 20h4" /></>,
  Design: <><path d="M20 4c-3.5.5-7.5 3-10 6.5l-1 1.5 3 3 1.5-1C17 11.5 19.5 7.5 20 4Z" /><path d="M9 12c-2 0-3.5 1.2-3.9 3.2-.2 1.2-.6 2.4-1.6 3.3 2.9.5 6.5-.3 7.5-3" /></>,
  Development: <><path d="M9 4H8a2 2 0 0 0-2 2v3.5A2.5 2.5 0 0 1 3.5 12 2.5 2.5 0 0 1 6 14.5V18a2 2 0 0 0 2 2h1" /><path d="M15 4h1a2 2 0 0 1 2 2v3.5a2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0-2.5 2.5V18a2 2 0 0 1-2 2h-1" /></>,
  Refinement: <><path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h11M19 17h1" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="17" cy="17" r="2" /></>,
  Launch: <><path d="M20.5 3.5 3.5 10l7 3 3 7 7-16.5Z" /><path d="m10.5 13 10-9.5" /></>,
};

function Symbol({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e0201a] shadow-[inset_0_-2px_0_rgba(0,0,0,0.12),0_6px_16px_rgba(224,32,26,0.28)] transition-transform duration-200 ease-out group-hover:scale-[1.06] md:h-14 md:w-14"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px] md:h-6 md:w-6">
        {ICONS[name]}
      </svg>
    </span>
  );
}

const STEPS: { title: string; copy: React.ReactNode }[] = [
  { title: "Product", copy: <>We turn what&rsquo;s in your head into a first version worth building.</> },
  { title: "Design", copy: <>Every screen and every interaction, designed so you&rsquo;re proud to put your name on it.</> },
  { title: "Development", copy: <>App, backend, database, APIs. You never need to know what any of it means.</> },
  { title: "Refinement", copy: <>You see it as it&rsquo;s built. Change your mind as often as you like. No meter.</> },
  { title: "Launch", copy: <>We submit it to the App Store and stay with you through review.</> },
];

/** One editorial row (inside a single white card): number | title | one sentence, sharing a baseline. Hairlines separate rows. */
function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <li className="group border-[#e5e5ea] py-[22px] text-left md:grid md:grid-cols-[3rem_4rem_11rem_minmax(0,1fr)] md:items-baseline md:gap-x-8 md:py-[26px] lg:gap-x-10 [&+li]:border-t">
      {/* Mobile: number + circle + title on one row. Desktop: `contents` hands all three to the grid. */}
      <div className="flex items-center gap-3 md:contents">
        <span aria-hidden="true" className="accent block text-[2rem] leading-none md:text-[2.75rem]">
          {n}
        </span>
        <span className="flex justify-center md:self-center">
          <Symbol name={title} />
        </span>
        <h3 className="text-[21px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#1d1d1f] md:text-[24px]">
          {title}
        </h3>
      </div>
      <p className="mt-2 max-w-[34rem] text-[16px] leading-[1.5] text-[#3a3a3c] md:mt-0 md:text-[19px] md:leading-[1.45]">{children}</p>
    </li>
  );
}

export function Process() {
  return (
    <Section
      tone="gray"
      id="process" labelledBy="process-title"
      decor={<Blobs spots={[{ n: 3, className: "-right-64 top-[42%] w-[520px]", back: true, hideOnMobile: true }]} />}
    >
      <Reveal>
        <Prose>
          <SectionHead id="process-title" eyebrow="What’s included" title="Everything between the idea and" accent="the App Store." sub="Product, design, development and launch, handled by one person." />
          <Strong className="mt-10 sm:mt-12">Cortexity handles the whole process.</Strong>
        </Prose>
      </Reveal>

      <Reveal className="stagger mx-auto mt-10 max-w-[60rem] rounded-[24px] border border-[#e5e5ea] bg-white px-5 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:mt-12 md:px-10 md:py-2">
        <ol className="contents">
          {STEPS.map((s, i) => (
            <Step key={s.title} n={String(i + 1)} title={s.title}>
              {s.copy}
            </Step>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}
