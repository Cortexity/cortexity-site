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

/** One editorial row: number | title | one sentence. Hairlines separate rows. */
function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <li className="group grid grid-cols-1 border-[#e5e5ea] py-9 text-left first:pt-0 last:pb-0 sm:py-11 sm:first:pt-0 sm:last:pb-0 md:grid-cols-[7rem_minmax(0,18rem)_1fr] md:items-start md:gap-x-10 [&+li]:border-t">
      <span
        aria-hidden="true"
        className="accent block text-[clamp(3rem,2.5rem+2vw,5rem)] leading-[0.9] transition-colors duration-300 md:text-[clamp(3.5rem,3rem+2vw,5rem)] md:group-hover:text-[#1d1d1f]"
      >
        {n}
      </span>
      <h3 className="mt-2 text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#1d1d1f] md:mt-0">
        {title}
      </h3>
      <p className="mt-2 max-w-[34rem] text-body text-[#6e6e73] md:mt-0">{children}</p>
    </li>
  );
}

export function Process() {
  return (
    <Section
      tone="gray"
      id="process" labelledBy="process-title"
      decor={<Blobs spots={[{ n: 3, className: "-right-56 top-24 w-[560px]", back: true, hideOnMobile: true }]} />}
    >
      <Reveal>
        <Prose>
          <SectionHead id="process-title" eyebrow="What’s included" title="Everything between the idea and" accent="the App Store." sub="Product, design, development and launch, handled by one person." />
          <Strong className="mt-10 sm:mt-12">Cortexity handles the whole process.</Strong>
        </Prose>
      </Reveal>

      <Reveal className="stagger mx-auto mt-14 max-w-[60rem] sm:mt-20">
        <ol className="contents">
          {STEPS.map((s, i) => (
            <Step key={s.title} n={String(i + 1).padStart(2, "0")} title={s.title}>
              {s.copy}
            </Step>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}
