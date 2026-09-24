import { SectionHead } from "../SectionHead";
import { ApplyButton } from "../Button";
import { Reveal } from "../Reveal";
import { Prose, Section, Stack } from "../Section";
import { P, Strong } from "../Text";

export function Fit() {
  return (
    <Section tone="white" id="fit" labelledBy="fit-title">
      <Reveal>
        <Prose>
          <SectionHead id="fit-title" eyebrow="Who It’s For" title="This is for founders who are" accent="serious about building." sub="For founders ready to stop thinking about it and build it." />
          <Stack className="mt-10 sm:mt-12">
            <P>
              Cortexity makes sense for you if you&rsquo;ve been thinking about an app and
              you&rsquo;re ready to actually do something about it.
            </P>
            <P>You don&rsquo;t need to be technical.</P>
            <P>You don&rsquo;t need to have founded a company before.</P>
            <P>You don&rsquo;t even need to have every detail figured out.</P>
            <Strong>You do need to care.</Strong>
            <P>
              We want founders who answer messages, give feedback, make decisions and genuinely
              want to see their product exist.
            </P>
            <P>In return, you&rsquo;ll get that same commitment from me.</P>
            <P>
              We deliberately take on very few projects because when we&rsquo;re building yours,{" "}
              <strong className="font-semibold">we want to be all in.</strong>
            </P>
            <P>
              If you&rsquo;re casually exploring an idea, looking for the cheapest possible
              developer, or collecting ten quotes before deciding whether you even want to build
              anything, we&rsquo;re probably not the right fit.
            </P>
          </Stack>

          <Stack className="mt-10 sm:mt-12">
            <P>If you&rsquo;re thinking:</P>
            <p className="text-lead font-semibold tracking-[-0.015em]">
              <strong className="font-semibold">
                &ldquo;I want to finally build this properly.&rdquo;
              </strong>
            </p>
            <P>Then we should talk.</P>
          </Stack>

          <div className="mt-8 flex justify-center sm:mt-10">
            <ApplyButton>Tell Us What You Want to Build</ApplyButton>
          </div>
        </Prose>
      </Reveal>
    </Section>
  );
}
