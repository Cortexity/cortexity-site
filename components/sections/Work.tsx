import { SectionHead } from "../SectionHead";
import { AppMockup } from "../placeholders";
import { Reveal } from "../Reveal";
import { Prose, Section, Stack } from "../Section";
import { P } from "../Text";

function App({
  name,
  heading,
  tagline,
  children,
  first = false,
}: {
  name: string;
  heading: string;
  tagline: string;
  children?: React.ReactNode;
  first?: boolean;
}) {
  return (
    <article
      className={`${first ? "pt-6" : "pt-20 sm:pt-24"} text-center`}
      aria-labelledby={`work-${name.toLowerCase()}`}
    >
      <Reveal>
        <Prose>
          <h3 id={`work-${name.toLowerCase()}`} className="text-h2 text-balance">{heading}</h3>
          <Stack className="mt-6">
            <P>{tagline}</P>
            {children}
          </Stack>
        </Prose>
      </Reveal>
      <Reveal delay={80} className="mt-10 sm:mt-12">
        {/* PLACEHOLDER: pass screens={[{src, alt}, {src, alt}]} when screenshots arrive. */}
        <AppMockup name={name} />
      </Reveal>
    </article>
  );
}

export function Work() {
  return (
    <Section tone="black" id="work" labelledBy="work-title">
      <Reveal>
        <Prose>
          <SectionHead id="work-title" title="Built by" accent="Cortexity." sub="A few of the apps we’ve built, live on the App Store today." />
        </Prose>
      </Reveal>

      <div className="mt-10 sm:mt-12">
        <App
          first
          name="Slowr"
          heading="SLOWR"
          tagline="A men’s wellness app with step-by-step training programs, progress tracking and a monthly subscription, all in one place."
        >
        </App>

        <App
          name="ReflexFlow"
          heading="ReflexFlow"
          tagline="A wellness app for women: a multi-week program they follow from their phone, with guided audio sessions and progress tracking."
        >
        </App>
      </div>
    </Section>
  );
}
