import { Header } from "@/components/Header";
import { Mesh } from "@/components/Decor";
import { StickyCta } from "@/components/StickyCta";
import { Hero } from "@/components/sections/Hero";
import { Idea } from "@/components/sections/Idea";
import { Transformation } from "@/components/sections/Transformation";
import { Founder } from "@/components/sections/Founder";
import { Process } from "@/components/sections/Process";
import { Work } from "@/components/sections/Work";
import { Timeline } from "@/components/sections/Timeline";
import { Scope } from "@/components/sections/Scope";
import { Fit } from "@/components/sections/Fit";
import { Pricing } from "@/components/sections/Pricing";
import { Questions } from "@/components/sections/Questions";
import { Closing } from "@/components/sections/Closing";

/**
 * Landing page. Sections follow cortexity_landing_page.md in order.
 * Placeholders for real assets are documented in components/placeholders.tsx.
 */
export default function Home() {
  return (
    <>
      <Mesh />
      <Header />
      <main id="main">
        <Hero />
        <Idea />
        <Transformation />
        <Founder />
        <Process />
        <Work />
        <Timeline />
        <Scope />
        <Fit />
        <Pricing />
        <Questions />
        <Closing />
      </main>
      <StickyCta />
    </>
  );
}
