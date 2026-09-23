import { Blobs } from "../Decor";
import { SectionHead } from "../SectionHead";
import { Reveal } from "../Reveal";
import { Prose, Section, Stack } from "../Section";
import { H3, Muted, P, Strong } from "../Text";

const ICONS: Record<string, React.ReactNode> = {
  Product: <><path d="M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3Z"/><path d="M9.5 19.5h5M10.5 22h3"/></>,
  Design: <><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.7 1.6-1.5 0-.5-.3-.9-.5-1.3-.3-.4-.5-.8-.5-1.3 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5c0-4-4-7.3-9-7.3Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7.5" r="1"/><circle cx="15" cy="7.8" r="1"/></>,
  Development: <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/></>,
  Refinement: <><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></>,
  Launch: <><path d="M12 15c-1.5-1-3-2.5-3.5-4.5C9.5 6 12.5 3 17 3c0 4.5-3 7.5-7.5 8.5"/><path d="M9 12.5 6 13l-2 3 4 .5M11.5 15l-.5 3-3 2-.5-4"/><circle cx="14.5" cy="7.5" r="1.3"/></>,
};

/** 56px icon tile with an SF Symbols-style line icon in red. */
function IconTile({ name }: { name: string }) {
  return (
    <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[var(--tile)]">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e0201a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {ICONS[name]}
      </svg>
    </span>
  );
}

function StepTop({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center justify-between">
      <IconTile name={title} />
      <span aria-hidden="true" className="accent text-[28px] leading-none">{n}</span>
    </div>
  );
}

/** Compact tile: icon + number on one row, title, then the copy. */
function Step({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="card flex flex-col p-8 text-left sm:p-10">
      <StepTop n={n} title={title} />
      <H3 className="mt-6 text-[26px] font-semibold leading-tight text-white">{title}</H3>
      <Stack className="mx-0 mt-4 max-w-none text-[17px] [--muted:#c7c7cc]">{children}</Stack>
    </li>
  );
}

/** Full-width band: headline on the left, the copy on the right. */
function Band({
  n,
  title,
  headline,
  children,
}: {
  n: string;
  title: string;
  headline: string;
  children: React.ReactNode;
}) {
  return (
    <li className="card grid grid-cols-1 gap-10 p-10 text-left sm:p-14 md:col-span-2 md:grid-cols-[38fr_62fr] md:gap-12">
      <div>
        <StepTop n={n} title={title} />
        <p className="mt-6 text-[12px] font-medium uppercase leading-none tracking-[0.14em] text-[#c7c7cc]">{title}</p>
        <H3 className="mt-3 font-semibold text-white">{headline}</H3>
      </div>
      <Stack className="mx-0 max-w-none text-[17px] [--muted:#c7c7cc]">{children}</Stack>
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
          <Stack className="mt-10 sm:mt-12">
            <P>You don&rsquo;t need to hire a designer.</P>
            <P>Then find a developer.</P>
            <P>Then figure out the backend.</P>
            <P>Then find someone else when something breaks.</P>
            <P>Then work out how to get the thing onto the App Store.</P>
            <Strong>Cortexity handles the whole process.</Strong>
          </Stack>
        </Prose>
      </Reveal>

      <Reveal className="stagger mt-14 grid grid-cols-1 items-stretch gap-5 sm:mt-20 md:grid-cols-2">
      <ol className="contents">
        <Step n="01" title="Product">
          <P>We take what&rsquo;s in your head and turn it into a product that makes sense.</P>
          <P>What should the app actually do? What belongs in the first version?</P>
          <P>We&rsquo;ll figure that out together.</P>
        </Step>

        <Step n="02" title="Design">
          <P>We design the entire experience: screens, interactions, navigation and visual identity.</P>
          <P>It should look like a product you&rsquo;re proud to put your name on.</P>
        </Step>

        <Step n="03" title="Development">
          <P>
            The application, backend, database, APIs, integrations and technical infrastructure
            needed to make the product work are our responsibility.
          </P>
          <P>You don&rsquo;t need to know what any of those things mean.</P>
        </Step>

        <Step n="05" title="Launch">
          <P>When the app is finished, we don&rsquo;t hand you a folder and disappear.</P>
          <P>
            App Store submission is included. We&rsquo;ll take care of getting it submitted and
            work through the process with you.
          </P>
          <Muted>
            Apple controls its own review timeline, so App Store review takes place after the
            21-day build.
          </Muted>
        </Step>

        <Band n="04" title="Refinement" headline="You are allowed to change your mind.">
          <P>This is where Cortexity is different.</P>
          <P>You&rsquo;ll see the product as it develops.</P>
          <P>If something doesn&rsquo;t feel right, tell me.</P>
          <P>
            If seeing the real app makes you realize there&rsquo;s a better way to do something,
            tell me.
          </P>
          <P>If I think there&rsquo;s a better solution, I&rsquo;ll tell you too.</P>
          <P>We won&rsquo;t blindly follow a plan that no longer makes sense.</P>
          <Strong className="text-white">We&rsquo;re here to build a great first product.</Strong>
        </Band>
      </ol>
      </Reveal>
    </Section>
  );
}
