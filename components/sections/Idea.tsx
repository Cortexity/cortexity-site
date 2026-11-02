import { SectionHead } from "../SectionHead";
import { ApplyButton } from "../Button";
import { lines } from "../Lines";
import { Reveal } from "../Reveal";
import { Prose, Section, Stack } from "../Section";
import type { Avatar } from "@/lib/avatars";
import { fill, type Locale } from "@/lib/geo";

/** The problem section: the avatar's pain, then the turn ("It can be simple."). */
export function Idea({ avatar, loc }: { avatar: Avatar; loc: Locale }) {
  const { problem } = avatar;
  return (
    <Section tone="white" id="problem" labelledBy="idea-title">
      <Reveal>
        <Prose>
          <SectionHead id="idea-title" title={fill(problem.title, loc)} accent={fill(problem.accent, loc)} sub={problem.sub} />
          <Stack className="mt-10 sm:mt-12">{lines(problem.body, loc)}</Stack>
          <Stack className="mt-10 sm:mt-12">{lines(problem.turn, loc)}</Stack>
          <div className="mt-8 flex justify-center sm:mt-10">
            <ApplyButton>{avatar.slug === "founders" ? "Tell Us Your Idea" : "Apply to Build Your App"}</ApplyButton>
          </div>
        </Prose>
      </Reveal>
    </Section>
  );
}
