import { SectionHead } from "../SectionHead";
import { AppMockup } from "../placeholders";
import { Reveal } from "../Reveal";
import { Prose, Section, Stack } from "../Section";
import { P, Strong } from "../Text";

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
  children: React.ReactNode;
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
            <Strong>{tagline}</Strong>
            {children}
          </Stack>
        </Prose>
      </Reveal>
      <Reveal delay={80} className="mt-10 sm:mt-12">
        {/* PLACEHOLDER: pass screens={[{src, alt}, {src, alt}]} when screenshots arrive. */}
        <AppMockup name={name} />
        <p className="mt-8 text-center text-small font-semibold">
          <strong className="font-semibold">Designed. Built. Shipped by Cortexity.</strong>
        </p>
      </Reveal>
    </article>
  );
}

export function Work() {
  return (
    <Section tone="black" id="work" labelledBy="work-title">
      <Reveal>
        <Prose>
          <SectionHead id="work-title" title="Built by" accent="Cortexity." sub="Two apps, designed, built and shipped to the App Store." />
          <Stack className="mt-10 sm:mt-12">
            <Strong>Some of the products we&rsquo;ve designed, developed and shipped.</Strong>
            <P>Real apps. Available on the App Store.</P>
          </Stack>
        </Prose>
      </Reveal>

      <div className="mt-10 sm:mt-12">
        <App
          first
          name="Slowr"
          heading="SLOWR"
          tagline="Men’s wellness, reimagined as a product."
        >
          <P>
            A complete iOS experience built around guided training, progressive programs,
            education, progress tracking and subscriptions.
          </P>
        </App>

        <App
          name="ReflexFlow"
          heading="ReflexFlow"
          tagline="A private guided wellness experience for women."
        >
          <P>
            A multi-week iOS program combining guided audio, progressive training and personal
            progress tracking.
          </P>
        </App>
      </div>
    </Section>
  );
}
