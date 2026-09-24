import { ApplyButton } from "../Button";
import { AppMarquee, Dots } from "../Decor";
import { HeroVisual } from "../HeroVisual";
import { SectionHead } from "../SectionHead";
import { Lead, Muted, P, Strong } from "../Text";

export function Hero() {
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
          title="Your app idea. Built in"
          accent="21 days."
        />
        <div className="mx-auto mt-6 max-w-prose space-y-3 sm:mt-8">
          <Lead className="text-ink-muted">You bring the idea. We take care of everything else.</Lead>
          <P className="text-ink-muted">Strategy. Design. Development. Testing. App Store submission.</P>
          <Strong>One project. One fixed price. $5,000.</Strong>
        </div>
        <div id="hero-cta" className="mt-8 flex justify-center sm:mt-10">
          <ApplyButton size="lg" variant="red" note="No payment until we've talked about your idea.">
            Apply to Build Your App
          </ApplyButton>
        </div>
        <Muted className="mt-3">We take on a limited number of projects at a time.</Muted>
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
