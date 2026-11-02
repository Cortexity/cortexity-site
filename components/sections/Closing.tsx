import { ApplyButton } from "../Button";
import { Reveal } from "../Reveal";
import { Prose, Section, Stack } from "../Section";
import { Footer } from "../Footer";
import { Blobs, Dots } from "../Decor";
import { SectionHead } from "../SectionHead";
import { H3, Muted, P, Strong } from "../Text";
import { lines } from "../Lines";
import type { Avatar } from "@/lib/avatars";
import { fill, type Locale } from "@/lib/geo";

export function Closing({ avatar, loc }: { avatar: Avatar; loc: Locale }) {
  return (
    <>
      <Section
        tone="white"
        id="start" labelledBy="closing-title"
        decor={
          <>
            <Dots />
            <Blobs
              spots={[
                { n: 3, className: "-left-36 bottom-0 w-[220px] md:-left-44 md:bottom-10 md:w-[440px]", back: true },
                { n: 2, className: "-right-28 top-24 w-[300px]", hideOnMobile: true },
              ]}
            />
          </>
        }
      >
        <Reveal>
          <Prose>
            <SectionHead id="closing-title" title={avatar.closing.title} accent={fill(avatar.closing.accent, loc)} sub="Tell me about the idea. I read every application myself." />
            <Stack className="mt-10 sm:mt-12">
              {lines(avatar.closing.lines, loc)}
              <P>If you have an app idea you&rsquo;re serious about, tell us about it.</P>
              <P>I&rsquo;ll personally review what you send.</P>
              <P>
                If I think Cortexity is the right fit, I&rsquo;ll contact you directly and
                we&rsquo;ll talk about the product.
              </P>
            </Stack>

            <div className="mt-12 sm:mt-14">
              <H3>Your idea. Our responsibility.</H3>
              <Strong className="mt-4">{fill("21 days. {price}.", loc)}</Strong>
              <div id="final-cta" className="mt-8 flex justify-center sm:mt-10">
                <ApplyButton size="lg" variant="red">Apply to Build Your App</ApplyButton>
              </div>
              <Muted className="mt-5 italic">One new project a month.</Muted>
            </div>
          </Prose>
        </Reveal>
      </Section>

      <Footer />
    </>
  );
}
