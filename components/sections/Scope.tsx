import { SectionHead } from "../SectionHead";
import { Reveal } from "../Reveal";
import { Prose, Section, Stack } from "../Section";
import { P, Strong } from "../Text";

export function Scope() {
  return (
    <Section tone="gray" id="scope" labelledBy="scope-title">
      <Reveal>
        <Prose>
          <SectionHead id="scope-title" eyebrow="No Scope Creep" title="No “that’s outside the scope” every time" accent="you have an idea." sub="Changing your mind is part of building something good." />
          <Stack className="mt-10 sm:mt-12">
            <P>
              A product you imagined three weeks ago won&rsquo;t always be the product you want
              after you&rsquo;ve actually seen and used it.
            </P>
            <Strong>That&rsquo;s normal.</Strong>
            <P>
              For the 21 days we&rsquo;re working together, you&rsquo;re not going to be charged
              every time you ask us to change a button, rethink a screen or improve how something
              works.
            </P>
            <P>Ask for changes as often as you like.</P>
            <P>There is no hourly bill.</P>
            <P>
              There is no awkward conversation because you&rsquo;ve used your allotted number of
              revisions.
            </P>
            <Strong>We&rsquo;re building the product together.</Strong>
            <P>
              If you ask for a big change that needs more time, we&rsquo;ll adjust the timeline
              together.
            </P>
          </Stack>

          <Stack className="mt-10 sm:mt-12">
            <P>But our default response to a better idea isn&rsquo;t:</P>
            <p className="text-lead text-ink-muted">&ldquo;That&rsquo;s outside the scope.&rdquo;</p>
            <P>It&rsquo;s:</P>
            <p className="text-h3 font-semibold text-red">
              <strong className="font-semibold">
                &ldquo;Let&rsquo;s figure out how to make it work.&rdquo;
              </strong>
            </p>
          </Stack>
        </Prose>
      </Reveal>
    </Section>
  );
}
