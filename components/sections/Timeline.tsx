import { SectionHead } from "../SectionHead";
import { Reveal } from "../Reveal";
import { Prose, Section } from "../Section";

const WEEKS = [
  {
    label: "Week 1",
    title: "We understand the idea.",
    line: "One conversation. Then we design.",
    bullets: [
      "We talk through the idea, who it’s for, and how you imagine it working.",
      "We define the main features for version one.",
      "First screens on your phone by the end of the week.",
    ],
  },
  {
    label: "Week 2",
    title: "We make it real.",
    line: "Screens become flows. Flows become features.",
    bullets: [
      "The core of the app works, on your iPhone.",
      "You use it every day and tell me what feels wrong.",
      "We change it. No meter. No scope conversation.",
    ],
  },
  {
    label: "Week 3",
    title: "We make it better. Then we ship.",
    line: "The details that make it feel finished.",
    bullets: [
      "Refinement and polish, together.",
      "App Store submission, handled with you.",
      "The app, the design, the code: yours.",
    ],
  },
];

function Check() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none" className="mt-[4px] shrink-0">
      <circle cx="10" cy="10" r="10" fill="#e0201a" />
      <path d="m6 10.2 2.6 2.6L14.2 7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Timeline() {
  return (
    <Section tone="white" id="timeline" labelledBy="timeline-title">
      <Reveal>
        <Prose>
          <SectionHead id="timeline-title" eyebrow="The Process" title="What the next" accent="21 days look like." sub="Three weeks, three phases, one working app." />
        </Prose>
      </Reveal>

      <Reveal className="stagger mx-auto mt-10 max-w-[44rem] sm:mt-12">
        <ol className="contents">
          {WEEKS.map((w, i) => (
            <li key={w.label} className="relative border-l-2 border-[#e5e5ea] pb-12 pl-10 last:pb-0 sm:pl-14">
              <span className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-red text-[0.875rem] font-semibold text-white">
                {i + 1}
              </span>
              <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.14em] text-ink-muted">{w.label}</p>
              <div className="card p-7 text-left sm:p-9">
                <h3 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.015em] text-white">{w.title}</h3>
                <p className="mt-2 text-[15px] text-white/70">{w.line}</p>
                <ul className="mt-6 space-y-3">
                  {w.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-[17px] leading-snug text-[#e5e5ea]">
                      <Check />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}
