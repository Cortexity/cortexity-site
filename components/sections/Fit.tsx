import { SectionHead } from "../SectionHead";
import { ApplyButton } from "../Button";
import { Reveal } from "../Reveal";
import { Prose, Section, Stack } from "../Section";
import { P, Strong } from "../Text";
import type { Avatar } from "@/lib/avatars";

export function Fit({ avatar }: { avatar: Avatar }) {
  return (
    <Section tone="white" id="fit" labelledBy="fit-title">
      <Reveal>
        <Prose>
          <SectionHead id="fit-title" eyebrow="Who It’s For" title={avatar.fit.title} accent={avatar.fit.accent} sub={avatar.fit.sub} />
          <Stack className="mt-10 sm:mt-12">
            <P>{avatar.fit.first}</P>
            <P>You don&rsquo;t need to be technical.</P>
            <P>You don&rsquo;t need to have founded a company before.</P>
            <P>You don&rsquo;t even need to have every detail figured out.</P>
            <Strong>But you do need to show up.</Strong>
            <P>
              We want {avatar.who} who answer messages, give feedback, make decisions and genuinely
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
