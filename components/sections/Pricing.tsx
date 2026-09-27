import { ApplyButton } from "../Button";
import { Blobs } from "../Decor";
import { Reveal } from "../Reveal";
import { Prose, Section, Stack } from "../Section";
import { SectionHead } from "../SectionHead";
import { H3, P, Strong } from "../Text";

const BASE = [
  "Product strategy",
  "Full app design",
  "Development",
  "Backend, database & APIs",
  "Testing",
  "Refinement throughout the build",
  "App Store submission",
  "Full ownership of the app and code",
];

function Check() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none" className="mt-[3px] shrink-0">
      <circle cx="10" cy="10" r="10" fill="#e0201a" />
      <path d="m6 10.2 2.6 2.6L14.2 7" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Plan({ name, price, items }: { name: string; price: string; items: string[] }) {
  return (
    <div className="card card-dark flex flex-col p-8 text-left sm:p-10">
      <p className="text-small font-medium uppercase tracking-[0.12em] text-ink-muted">{name}</p>
      <p className="mt-3 text-[clamp(2.5rem,2rem+2vw,3.5rem)] font-semibold leading-none tracking-[-0.03em]">{price}</p>
      <ul className="mt-8 flex-1 space-y-3">
        {items.map((it) => (
          <li key={it} className="flex gap-3 text-body text-[#c7c7cc]">
            <Check />
            <span>{it}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex justify-center">
        <ApplyButton variant="red" note="No payment until we’ve spoken and both said yes.">
          Apply to Build Your App
        </ApplyButton>
      </div>
    </div>
  );
}

export function Pricing() {
  return (
    <Section
      tone="black"
      id="pricing" labelledBy="pricing-title"
      decor={
        <Blobs spots={[{ n: 4, className: "-left-40 top-[38%] w-[340px]", hideOnMobile: true }]} />
      }
    >
      <Reveal>
        <Prose>
          <SectionHead
            id="pricing-title"
            eyebrow="Pricing"
            title="$5,000."
            accent="Start to finish."
            sub="One fixed price, paid in two halves."
          />
          <Stack className="mt-10 sm:mt-12">
            <P>No hourly rate.</P>
            <P>No paying a designer separately.</P>
            <P>No development bill that grows every week.</P>
            <P>No paying extra because you asked for another revision during the project.</P>
          </Stack>
        </Prose>
      </Reveal>

      <Reveal className="mt-12 text-center sm:mt-14">
        <H3 className="text-h2">
          Your Cortexity build: <span className="text-red">$5,000</span>
        </H3>
        <div className="mx-auto mt-6 grid max-w-[40rem] grid-cols-1 gap-2 sm:grid-cols-2">
          <Strong>$2,500 to start.</Strong>
          <Strong>$2,500 when your app is finished.</Strong>
        </div>
        <Stack className="mt-6">
          <P>
            That includes the 21-day product build, design, development, testing, refinement,
            App Store submission and full ownership of the finished project.
          </P>
        </Stack>
      </Reveal>

      <Reveal className="stagger mx-auto mt-12 grid max-w-[60rem] grid-cols-1 gap-5 sm:mt-14 md:grid-cols-2">
        <Plan name="iPhone" price="$5,000" items={BASE} />
        <Plan name="iPhone + Android" price="$8,000" items={[...BASE, "Android built as a second phase"]} />
      </Reveal>

      <Reveal className="mt-12 sm:mt-14">
        <Prose>
          <Stack>
            <P>Before you pay anything, I&rsquo;ll talk with you about your idea.</P>
            <P>
              I&rsquo;ll make sure I understand what you want to build and that Cortexity is the
              right studio for it. If it isn&rsquo;t, I&rsquo;ll tell you.
            </P>
          </Stack>
        </Prose>
      </Reveal>
    </Section>
  );
}
