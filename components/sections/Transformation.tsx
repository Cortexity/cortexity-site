import { SectionHead } from "../SectionHead";
import { ApplyButton } from "../Button";
import { PhoneTrio } from "../placeholders";
import { Reveal } from "../Reveal";
import { Prose, Section, Stack } from "../Section";
import { Eyebrow, P, Strong } from "../Text";
import { lines } from "../Lines";
import type { Avatar } from "@/lib/avatars";
import { fill, type Locale } from "@/lib/geo";

export function Transformation({ avatar, loc }: { avatar: Avatar; loc: Locale }) {
  return (
    <Section tone="white" id="transformation" labelledBy="transformation-title">
      <Prose>
        {avatar.slug === "founders" ? (
          <SectionHead id="transformation-title" title="An idea today. A real product" accent="21 days later." sub="From one sentence to a working iPhone app." />
        ) : (
          <SectionHead id="transformation-title" title="What you tell us on Day 1. What you get on" accent="Day 21." />
        )}
      </Prose>

      {/* DAY 1 */}
      <Reveal className="mt-10 sm:mt-12">
        <Prose>
          <Eyebrow>Day 1</Eyebrow>
          <blockquote className="mx-auto mt-5 max-w-[30rem] text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] font-semibold leading-[1.25] tracking-[-0.015em]">
            &ldquo;{fill(avatar.day1, loc)}&rdquo;
          </blockquote>
          {avatar.slug === "founders" ? (
            <Stack className="mt-8">
            <P>That&rsquo;s enough to start.</P>
            <Strong>Your idea doesn&rsquo;t need to arrive as a specification.</Strong>
            <P>You don&rsquo;t need wireframes.</P>
            <P>You don&rsquo;t need technical knowledge.</P>
            <P>
              You don&rsquo;t need to know what database to use, which API you need, or how the
              app should be architected.
            </P>
            <Strong>You just need the idea.</Strong>
            <P>We take it from there.</P>
          </Stack>
          ) : (
            <Stack className="mt-8">
              <P>That&rsquo;s enough to start.</P>
              <Strong>No specification. No technical knowledge.</Strong>
              <P>We take it from there.</P>
            </Stack>
          )}
        </Prose>
      </Reveal>

      {/* ↓ */}
      <div className="my-10 flex justify-center sm:my-14" aria-hidden="true">
        <svg width="20" height="44" viewBox="0 0 20 44" fill="none" className="text-ink-muted">
          <path d="M10 1v41M1.5 33.5 10 42l8.5-8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 21 DAYS LATER */}
      <Reveal>
        <Prose>
          <Eyebrow>21 days later</Eyebrow>
        </Prose>
        {/* PLACEHOLDER: three iPhones showing the finished padel app.
            To drop in real screenshots: screens={[{src, alt}, {src, alt}, {src, alt}]} */}
        <PhoneTrio className="mt-10 sm:mt-14" slug={avatar.screens} label={avatar.screensLabel} />
        <Prose className="mt-10">
          <Stack>{lines(avatar.after, loc)}</Stack>
          <div className="mt-8 flex justify-center sm:mt-10">
            <ApplyButton>Apply to Build Your App</ApplyButton>
          </div>
        </Prose>
      </Reveal>
    </Section>
  );
}
