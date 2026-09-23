import { FounderVideo } from "../placeholders";
import { SectionHead } from "../SectionHead";
import { Reveal } from "../Reveal";
import { Section, Stack } from "../Section";
import { P, Strong } from "../Text";

export function Founder() {
  return (
    <Section tone="white" id="founder" labelledBy="founder-title">
      <SectionHead id="founder-title" eyebrow="The founder" title="One person responsible for" accent="getting it done." sub="You work directly with me, from the first call to the App Store." />

      <div className="mx-auto mt-12 max-w-[1100px] sm:mt-16">
        {/* PLACEHOLDER: founder video, 60–90s. To drop in the real file:
            <FounderVideo src="/media/founder.mp4" poster="/media/founder-poster.jpg" /> */}
        <Reveal>
          <FounderVideo />
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-14 text-center sm:mt-16">
            <Stack>
              <P>I&rsquo;m Joseph, founder of Cortexity.</P>
              <P>Before building apps for other founders, I built my own.</P>
              <P>And I&rsquo;ve been on the other side of the table.</P>
              <P>
                I&rsquo;ve dealt with developers, designers, changing requirements, things
                breaking, delays, technical problems, and the frustration of realizing halfway
                through a project that something needs to change, only to hear that it
                wasn&rsquo;t part of the original scope.
              </P>
              <P>That&rsquo;s a big part of why I built Cortexity.</P>
              <Strong>When I take on your app, I take responsibility for getting it built.</Strong>
              <P>You shouldn&rsquo;t have to project-manage your developer.</P>
              <P>You shouldn&rsquo;t have to understand the technology.</P>
              <P>
                And you shouldn&rsquo;t be afraid to tell me you&rsquo;ve changed your mind because
                you&rsquo;ve realized the product could be better.
              </P>
              <P>For 21 days, we work on one goal:</P>
              <Strong>
                Turning your idea into the best first version of your app we can build.
              </Strong>
              <P>You bring the vision.</P>
              <P>I&rsquo;ll take care of the rest.</P>
            </Stack>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
