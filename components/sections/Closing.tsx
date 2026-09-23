import { ApplyButton } from "../Button";
import { Reveal } from "../Reveal";
import { Prose, Section, Stack } from "../Section";
import { Wordmark } from "../Wordmark";
import { Blobs, Dots } from "../Decor";
import { SectionHead } from "../SectionHead";
import { H3, Muted, P, Strong } from "../Text";

export function Closing() {
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
            <SectionHead id="closing-title" eyebrow="Start" title="Three weeks from now, this could be" accent="on your iPhone." sub="Tell me about the idea. I read every application myself." />
            <Stack className="mt-10 sm:mt-12">
              <P>Not in your Notes.</P>
              <P>Not something you keep telling people you&rsquo;re going to build someday.</P>
              <Strong>A real product.</Strong>
              <P>If you have an app idea you&rsquo;re serious about, tell us about it.</P>
              <P>I&rsquo;ll personally review what you send.</P>
              <P>
                If I think Cortexity is the right fit, I&rsquo;ll contact you directly and
                we&rsquo;ll talk about the product.
              </P>
            </Stack>

            <div className="mt-14 sm:mt-20">
              <H3>Your idea. Our responsibility.</H3>
              <Strong className="mt-4">21 days. $5,000.</Strong>
              <div id="final-cta" className="mt-8 flex justify-center sm:mt-10">
                <ApplyButton size="lg" variant="red">Apply to Build Your App</ApplyButton>
              </div>
              <Muted className="mt-5">Cortexity accepts a limited number of projects at a time.</Muted>
            </div>
          </Prose>
        </Reveal>
      </Section>

      <footer className="tone-white relative px-5 sm:px-8">
        <div className="mx-auto flex max-w-wide flex-col items-center gap-8 py-14 text-center sm:py-16">
          <Wordmark size="lg" tagline />
          <p className="text-small text-ink-muted">&copy; {new Date().getFullYear()} Cortexity</p>
        </div>
      </footer>
    </>
  );
}
