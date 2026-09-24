import Image from "next/image";
import { Parallax } from "./Parallax";

/**
 * Hero key visual: liquid chrome-and-red shape resolving into iPhones.
 * Desktop shows the full 16:9 plate; phones get a 4:5 crop of the right
 * side (public/hero/liquid-mobile.jpg, made from x 45%–100% of the source).
 * Edges are masked and vignetted in CSS (.hero-visual) so the cream plate
 * never reads as a rectangle on the white page.
 */
export function HeroVisual() {
  const alt = "Liquid chrome and red flowing into a row of iPhones";
  return (
    <Parallax desktopOnly max={24} className="relative -mx-5 mt-10 sm:-mx-8 sm:mt-14 md:mx-auto md:max-w-[80rem]">
      <figure className="hero-visual relative aspect-[4/5] w-full overflow-hidden md:aspect-video">
        {/* Phones: the right-hand crop, taller. */}
        <Image
          src="/hero/liquid-mobile.jpg"
          alt={alt}
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[78%_50%] md:hidden"
        />
        {/* Desktop: the full plate. Source is 1670 px wide, served as is on 2× displays (never upscaled). */}
        <Image
          src="/hero/liquid.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          quality={90}
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="hidden object-cover md:block"
        />
      </figure>
    </Parallax>
  );
}
