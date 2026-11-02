import { ApplyButton } from "../Button";
import { AppMarquee, Dots } from "../Decor";
import { HeroVisual } from "../HeroVisual";
import { SectionHead } from "../SectionHead";
import { Lead, Muted, P, Strong } from "../Text";
import type { Avatar } from "@/lib/avatars";
import { fill, type Locale } from "@/lib/geo";

export function Hero({ avatar, loc }: { avatar: Avatar; loc: Locale }) {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="tone-white relative overflow-hidden px-5 pb-8 pt-28 text-center sm:px-8 sm:pb-10 sm:pt-36"
    >
      <Dots />
      <div className="relative z-10 mx-auto max-w-[60rem]">
        <SectionHead
          level={1}
          id="hero-title"
          title={avatar.hero.title}
          accent={avatar.hero.accent}
        />
        <div className="mx-auto mt-6 max-w-prose space-y-3 sm:mt-8">
          <Lead className="text-ink-muted">{fill(avatar.hero.lead, loc)}</Lead>
          <P className="text-ink-muted">{avatar.hero.line}</P>
          <Strong>{fill("One project. One fixed price. {price}.", loc)}</Strong>
        </div>
        <div id="hero-cta" className="mt-8 flex justify-center sm:mt-10">
          <ApplyButton size="lg" variant="red" note={null}>
            Apply to Build Your App
          </ApplyButton>
        </div>
        <Muted className="mt-3 italic">One new project a month.</Muted>
      </div>
      <div className="relative z-10">
        <HeroVisual />
      </div>
      <div className="relative z-10">
        <AppMarquee />
      </div>
    </section>
  );
}
