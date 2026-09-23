import { Blobs } from "../Decor";
import { SectionHead } from "../SectionHead";
import { Reveal } from "../Reveal";
import { Prose, Section } from "../Section";
import { Strong } from "../Text";

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
    <li className="group border-[#e5e5ea] py-[22px] text-left md:grid md:grid-cols-[3rem_11rem_minmax(0,1fr)] md:items-baseline md:gap-x-8 md:py-[26px] lg:gap-x-10 [&+li]:border-t">
      {/* Mobile: number + title on one baseline row. Desktop: `contents` hands both to the grid. */}
      <div className="flex items-baseline gap-3 md:contents">
        <span
          aria-hidden="true"
          className="accent block text-[2rem] leading-none transition-colors duration-300 md:text-[2.75rem] md:group-hover:text-[#1d1d1f]"
        >
          {n}
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

      <Reveal className="stagger mx-auto mt-12 max-w-[60rem] rounded-[24px] border border-[#e5e5ea] bg-white px-5 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:mt-16 md:px-10 md:py-2">
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
