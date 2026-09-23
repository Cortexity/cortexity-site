import { SectionHead } from "../SectionHead";
import { ApplyButton } from "../Button";
import { Reveal } from "../Reveal";
import { Prose, Section, Stack } from "../Section";
import { P, Strong } from "../Text";

export function Idea() {
  return (
    <Section tone="white" id="problem" labelledBy="idea-title">
      <Reveal>
        <Prose>
          <SectionHead id="idea-title" eyebrow="The problem" title="You’ve had the idea." accent="Now make it real." sub="Most app ideas never make it out of the Notes app." />
          <Stack className="mt-12 sm:mt-16">
            <P>Maybe it&rsquo;s been sitting in your Notes for six months.</P>
            <P>Maybe you&rsquo;ve talked about it with friends.</P>
            <P>
              Maybe you can already picture exactly how it should work. You just have no idea
              how to actually build it.
            </P>
            <P>And when you start looking into development, you&rsquo;re completely overwhelmed:</P>
            <P className="text-ink-muted">
              Designers. Developers. Technical decisions. Quotes. Timelines. APIs. Databases.
              Architecture. Bugs. Unresponsive developer. Vague answers. No updates for two
              weeks. App Store rejections.
            </P>
            <P>Suddenly, building your idea feels like too much stress.</P>
          </Stack>
          <Stack className="mt-10 sm:mt-12">
            <Strong>It can be simple AND easy.</Strong>
            <P>That&rsquo;s our job.</P>
            <P>Bring us the idea.</P>
            <P>
              We&rsquo;ll help you think through the product, design it, build it, refine it with
              you, and turn it into a real iPhone app.
            </P>
            <Strong>21 days. $5,000. Done for you.</Strong>
          </Stack>
          <div className="mt-10 flex justify-center sm:mt-12">
            <ApplyButton>Tell Us Your Idea</ApplyButton>
          </div>
        </Prose>
      </Reveal>
    </Section>
  );
}
