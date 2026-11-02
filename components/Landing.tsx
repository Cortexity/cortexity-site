import { headers } from "next/headers";
import { Header } from "./Header";
import { Mesh } from "./Decor";
import { StickyCta } from "./StickyCta";
import { Hero } from "./sections/Hero";
import { Idea } from "./sections/Idea";
import { Transformation } from "./sections/Transformation";
import { Founder } from "./sections/Founder";
import { Process } from "./sections/Process";
import { Work } from "./sections/Work";
import { Timeline } from "./sections/Timeline";
import { Scope } from "./sections/Scope";
import { Fit } from "./sections/Fit";
import { Pricing } from "./sections/Pricing";
import { Questions } from "./sections/Questions";
import { Closing } from "./sections/Closing";
import type { Avatar } from "@/lib/avatars";
import { getLocale } from "@/lib/geo";

/**
 * The landing page for one avatar. Avatar-specific copy lives in lib/avatars.ts;
 * prices and A5 brand names follow the visitor's country (lib/geo.ts), so the
 * page renders per request.
 */
export async function Landing({ avatar, country }: { avatar: Avatar; country?: string | string[] }) {
  const loc = getLocale(country, (await headers()).get("x-vercel-ip-country"));
  return (
    <>
      <Mesh />
      <Header />
      <main id="main" data-avatar={avatar.slug}>
        <Hero avatar={avatar} loc={loc} />
        <Idea avatar={avatar} loc={loc} />
        <Transformation avatar={avatar} loc={loc} />
        <Founder who={avatar.who} />
        <Process />
        <Work />
        <Timeline />
        <Scope />
        <Fit avatar={avatar} />
        <Pricing loc={loc} />
        <Questions avatar={avatar} loc={loc} />
        <Closing avatar={avatar} loc={loc} />
      </main>
      <StickyCta />
    </>
  );
}
