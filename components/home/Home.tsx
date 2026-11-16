import Image from "next/image";
import {
  Braces,
  Database,
  FlaskConical,
  KeyRound,
  Lightbulb,
  Palette,
  Receipt,
  Rocket,
  Timer,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { AvatarMark } from "../AvatarMark";
import { ApplyButton } from "../Button";
import { AppMarquee, Blobs, Dots, Mesh } from "../Decor";
import { FaqItem, FaqList } from "../Faq";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { HeroVisual } from "../HeroVisual";
import { AppMockup } from "../placeholders";
import { Reveal } from "../Reveal";
import { Prose, Section, Stack } from "../Section";
import { Seal } from "../Seal";
import { SectionHead } from "../SectionHead";
import { StickyCta } from "../StickyCta";
import { Lead, Muted, P, Strong } from "../Text";

/**
 * The home page (/): product-aware, no prices. Copy approved in the
 * "Cortexity: new home page script" doc. Built only from the site's existing
 * components and section styles. The old founders page lives at /founders.
 */

/* ---------------- shared bits (same marks as the original Pricing / Process sections) ---------------- */

/** Red disc with a white tick (the original Pricing check). */
function Check({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 20 20" fill="none" className="mt-[3px] shrink-0">
      <circle cx="10" cy="10" r="10" fill="#e0201a" />
      <path d="m6 10.2 2.6 2.6L14.2 7" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Grey disc with a cross, for "not for you". */
function Cross({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 20 20" fill="none" className="mt-[3px] shrink-0">
      <circle cx="10" cy="10" r="10" fill="#d1d1d6" />
      <path d="m7 7 6 6M13 7l-6 6" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Tinted disc with a Lucide icon (the original Process symbol); tint deepens on row hover. */
function Symbol({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[rgba(224,32,26,0.07)] transition-colors duration-200 group-hover:bg-[rgba(224,32,26,0.12)] md:h-[60px] md:w-[60px]"
    >
      <Icon size={26} strokeWidth={1.5} color="#e0201a" />
    </span>
  );
}

const BADGES = ["First version in 21 days", "100% satisfaction guarantee", "Fixed price", "You own the code"];

/** Trust line: red-disc ticks with plain text, no boxes. */
function Badges({ className = "" }: { className?: string }) {
  return (
    <ul className={`mx-auto flex max-w-[48rem] flex-wrap justify-center gap-x-7 gap-y-3 ${className}`}>
      {BADGES.map((b) => (
        <li key={b} className="flex items-center gap-2 text-[15px] font-medium text-ink sm:text-[16px]">
          <Check size={17} />
          <span className="mt-[2px]">{b}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- 1. Hero (original layout: headline, CTA, liquid visual, app band) ---------------- */

function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="tone-white relative overflow-hidden px-5 pb-8 pt-28 text-center sm:px-8 sm:pb-10 sm:pt-36">
      <Dots />
      <div className="relative z-10 mx-auto max-w-[60rem]">
        <SectionHead level={1} id="hero-title" title="Your app’s first version," accent="working in 21 days." />
        <div className="mx-auto mt-6 max-w-prose sm:mt-8">
          <Lead className="text-ink-muted">One fixed price. 100% satisfaction guaranteed.</Lead>
        </div>
        <div id="hero-cta" className="mt-8 flex justify-center sm:mt-10">
          <ApplyButton size="lg" variant="red" note={null}>
            Apply to build your app
          </ApplyButton>
        </div>
        <Muted className="mt-3">iPhone · Android · Web</Muted>
        <Badges className="mt-8" />
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

/* ---------------- 2. Proof (original Work layout) ---------------- */

function App({
  name,
  slug,
  heading,
  line,
  body,
  first = false,
}: {
  name: string;
  slug: string;
  heading: string;
  line: string;
  body: string;
  first?: boolean;
}) {
  return (
    <article className={`${first ? "pt-6" : "pt-20 sm:pt-24"} text-center`} aria-labelledby={`work-${slug}`}>
      <Reveal>
        <Prose>
          <h3 id={`work-${slug}`} className="text-h2 text-balance">{heading}</h3>
          <Stack className="mt-6">
            <Strong>{line}</Strong>
            <P>{body}</P>
          </Stack>
        </Prose>
      </Reveal>
      <Reveal delay={80} className="mt-10 sm:mt-12">
        <AppMockup name={name} slug={slug} />
      </Reveal>
    </article>
  );
}

function Work() {
  return (
    <Section tone="black" id="work" labelledBy="work-title">
      <Reveal>
        <Prose>
          <SectionHead id="work-title" title="Built by" accent="Cortexity." sub="Apps we designed, built and launched ourselves, so you can judge the work and not the pitch." />
        </Prose>
      </Reveal>

      <div className="mt-10 sm:mt-12">
        <App
          first
          name="SLOWR"
          slug="slowr"
          heading="SLOWR"
          line="A complete subscription app, live on the App Store."
          body="Guided training, progressive programs, progress tracking and in-app subscriptions."
        />
        <App
          name="ReflexFlow"
          slug="reflexflow"
          heading="ReflexFlow"
          line="A multi-week guided audio program."
          body="Guided audio sessions produced in-house, progressive training and personal progress tracking. If your app needs voice, audio or guided sessions, we have built it."
        />
        <App
          name="Pixelogram"
          slug="pixelogram"
          heading="Pixelogram"
          line="1,500 installs in 3 days."
          body="A puzzle game with hundreds of levels and a picture gallery. Designed, built and launched by Cortexity."
        />
        <App
          name="IQ Calorie"
          slug="iqcalorie"
          heading="IQ Calorie"
          line="An AI nutrition coach that lives in WhatsApp."
          body="Send a photo of your meal and get calories and macros back in seconds. Behind the chat: an AI model that reads food photos, a full backend and database, an onboarding flow, Stripe subscriptions with free trials, and a dashboard for each user."
        />
      </div>

      <Reveal className="mt-20 sm:mt-24">
        <Prose>
          <Strong>Subscriptions, payments, AI, audio, chatbots, dashboards.</Strong>
          <P className="mt-4">Whatever your app needs, we have probably shipped it already.</P>
        </Prose>
      </Reveal>
    </Section>
  );
}

/* ---------------- 3. Benefits (white cards, Process icon discs) ---------------- */

const BENEFITS: { q: string; lead: string; items: string[]; icon: LucideIcon }[] = [
  {
    q: "First version ready in 21 days.",
    lead: "The core of your app, running on a real phone.",
    items: ["A new build every week after that", "You test every build on your own phone", "Finished when it’s approved on the App Store and Google Play"],
    icon: Timer,
  },
  {
    q: "One fixed price. 100% satisfaction guaranteed.",
    lead: "Agreed before we start.",
    items: ["No hourly billing, no surprise invoices", "You own the code, the design and the accounts", "Free bug fixes for 30 days after launch"],
    icon: Receipt,
  },
  {
    q: "Built by the founder himself.",
    lead: "Joseph designs and builds your app.",
    items: ["You talk to him directly, from the first call to launch", "One project at a time", "Your app gets our full attention"],
    icon: UserRound,
  },
];

function Benefits() {
  return (
    <Section tone="gray" id="benefits" labelledBy="benefits-title" decor={<Blobs spots={[{ n: 1, className: "-left-48 top-24 w-[420px]", back: true, hideOnMobile: true }]} />}>
      <Reveal>
        <Prose>
          <SectionHead id="benefits-title" eyebrow="Benefits" title="What you get with" accent="Cortexity." />
        </Prose>
      </Reveal>
      <Reveal className="stagger mx-auto mt-10 grid max-w-[72rem] grid-cols-1 gap-5 sm:mt-12 lg:grid-cols-3">
        {BENEFITS.map((b) => (
          <div key={b.q} className="group rounded-[24px] border border-[#e5e5ea] bg-white p-7 text-left shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:p-8">
            <Symbol icon={b.icon} />
            <h3 className="mt-6 text-[21px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#1d1d1f] md:text-[24px]">{b.q}</h3>
            <p className="mt-3 text-[16px] leading-[1.5] text-ink-muted md:text-[18px] md:leading-[1.5]">{b.lead}</p>
            <ul className="mt-6 space-y-3">
              {b.items.map((it) => (
                <li key={it} className="flex gap-3 text-[16px] leading-[1.45] text-[#3a3a3c] md:text-[17px]">
                  <Check />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}

/* ---------------- 4. Why us, not them ---------------- */

const ROWS: [string, string, string, string][] = [
  ["First working version", "2 to 3 months", "Unclear", "21 days or less"],
  ["Price", "Hourly, and it grows", "Cheap, then the extras start", "Fixed before we start"],
  ["Who you talk to", "An account manager", "Whoever replies", "The person building it"],
  ["Attention", "One of 10+ clients", "Juggling other jobs", "One project at a time"],
  ["If you’re not happy with the result", "You pay extra for the fixes", "They disappear", "We keep working until you are 100% satisfied, at no extra charge"],
  ["Who owns the code", "Often locked in", "Unclear", "100% yours"],
  ["After launch", "A new contract", "Gone", "30 days of free bug fixes"],
  ["Have launched their own apps", "Rarely", "No", "Yes"],
];

function Compare() {
  return (
    <Section tone="white" id="compare" labelledBy="compare-title">
      <Reveal>
        <Prose>
          <SectionHead id="compare-title" title="You have other quotes." accent="Here is the difference." />
        </Prose>
      </Reveal>
      <Reveal className="mx-auto mt-10 max-w-[64rem] overflow-x-auto sm:mt-12">
        <table className="w-full min-w-[640px] border-separate border-spacing-0 overflow-hidden rounded-[24px] border border-[#e5e5ea] text-left text-[15px] sm:text-[16px]">
          <thead>
            <tr className="bg-[#f5f5f7]">
              <th scope="col" className="w-[24%] px-5 py-4" />
              <th scope="col" className="px-5 py-4 font-semibold text-ink-muted">Typical agency</th>
              <th scope="col" className="px-5 py-4 font-semibold text-ink-muted">Freelancer or offshore team</th>
              <th scope="col" className="bg-red px-5 py-4 font-semibold text-white">Cortexity</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([label, a, b, c]) => (
              <tr key={label} className="[&>*]:border-t [&>*]:border-[#e5e5ea]">
                <th scope="row" className="px-5 py-4 font-semibold text-ink">{label}</th>
                <td className="px-5 py-4 text-ink-muted">{a}</td>
                <td className="px-5 py-4 text-ink-muted">{b}</td>
                <td className="bg-[rgba(224,32,26,0.05)] px-5 py-4 font-semibold text-ink">
                  <span className="inline-flex items-start gap-2.5">
                    <Check />
                    {c}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
      <Reveal className="mt-10 sm:mt-12">
        <Prose>
          <Strong>The cheapest quote is the most expensive one when the app never ships.</Strong>
        </Prose>
      </Reveal>
    </Section>
  );
}

/* ---------------- 5. How it works ---------------- */

const STEPS: [string, string][] = [
  ["Apply.", "Tell us what you want to build. It takes two minutes."],
  ["We get on a call.", "We go through your app together: what it does, who it is for and what the first version needs. You leave with a price range."],
  ["Your proposal within 24 hours.", "A formal quote with exactly what we build, a clear development timeline and one fixed price, so you know what to expect before you commit."],
  ["Day 21: your first working version.", "The core of your app, working on a real phone. The full app follows in weekly builds."],
  ["Weekly builds.", "Every week you get a new version. You test it, we refine it."],
  ["Launch.", "We submit to the App Store and Google Play and handle the review."],
  ["30 days of cover.", "Any bug in what we delivered, fixed free."],
];

function HowItWorks() {
  return (
    <Section tone="gray" id="process" labelledBy="process-title">
      <Reveal>
        <Prose>
          <SectionHead id="process-title" eyebrow="How It Works" title="From your brief to" accent="the app stores." />
        </Prose>
      </Reveal>
      <Reveal className="mx-auto mt-10 max-w-[56rem] rounded-[24px] border border-[#e5e5ea] bg-white px-5 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:mt-12 md:px-10 md:py-2">
        <ol>
          {STEPS.map(([t, c], i) => (
            <li key={t} className="flex gap-4 border-[#e5e5ea] py-5 text-left md:gap-6 md:py-6 [&+li]:border-t">
              <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(224,32,26,0.08)] text-[16px] font-semibold text-red md:h-12 md:w-12 md:text-[18px]">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[19px] font-semibold leading-[1.25] tracking-[-0.015em] text-ink md:text-[22px]">{t}</h3>
                <p className="mt-1.5 text-[16px] leading-[1.5] text-[#3a3a3c] md:text-[18px]">{c}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}

/* ---------------- 6. What's included (original Process rows) ---------------- */

const INCLUDED: { title: string; copy: string; icon: LucideIcon }[] = [
  { title: "Product", copy: "What goes in the first version and what waits.", icon: Lightbulb },
  { title: "Design", copy: "Every screen, the full user experience and the visual identity.", icon: Palette },
  { title: "Development", copy: "iPhone, Android and web.", icon: Braces },
  { title: "Backend", copy: "Database, user accounts, payments, AI and integrations.", icon: Database },
  { title: "Testing", copy: "On real devices, every week.", icon: FlaskConical },
  { title: "Launch", copy: "App Store and Google Play submission and approval.", icon: Rocket },
  { title: "Ownership", copy: "Code, design and accounts handed over to you.", icon: KeyRound },
];

function Included() {
  return (
    <Section tone="white" id="included" labelledBy="included-title" decor={<Blobs spots={[{ n: 3, className: "-right-64 top-[42%] w-[520px]", back: true, hideOnMobile: true }]} />}>
      <Reveal>
        <Prose>
          <SectionHead id="included-title" eyebrow="What’s Included" title="One team for" accent="the whole job." sub="You don’t hire a designer, then a developer, then someone for the backend. We do all of it." />
        </Prose>
      </Reveal>
      <Reveal className="stagger mx-auto mt-10 max-w-[60rem] rounded-[24px] border border-[#e5e5ea] bg-white px-5 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:mt-12 md:px-10 md:py-2">
        <ol className="contents">
          {INCLUDED.map((s) => (
            <li key={s.title} className="group border-[#e5e5ea] py-[22px] text-left md:grid md:grid-cols-[3.5rem_11rem_minmax(0,1fr)] md:items-center md:gap-x-8 md:py-[26px] lg:gap-x-10 [&+li]:border-t">
              <div className="flex items-center gap-3 md:contents">
                <span className="flex justify-center">
                  <Symbol icon={s.icon} />
                </span>
                <h3 className="text-[21px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#1d1d1f] md:text-[24px]">{s.title}</h3>
              </div>
              <p className="mt-2 max-w-[34rem] text-[16px] leading-[1.5] text-[#3a3a3c] md:mt-0 md:text-[19px] md:leading-[1.45]">{s.copy}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}

/* ---------------- 7. Your build (original Pricing section, no prices; iPhone, Android and web) ---------------- */

const BASE = [
  "Product strategy",
  "Full app design",
  "Development",
  "Backend, database & APIs",
  "Testing on real devices, every week",
  "First working version in 21 days",
  "100% satisfaction guarantee",
  "Full ownership of the app and code",
  "30 days of free bug fixes after launch",
];

function Plan({ name, items }: { name: string; items: string[] }) {
  return (
    <div className="card card-dark flex flex-col p-8 text-left sm:p-10">
      <p className="text-small font-medium uppercase tracking-[0.12em] text-ink-muted">Your build</p>
      <p className="mt-3 text-[clamp(2rem,1.6rem+1.6vw,2.75rem)] font-semibold leading-none tracking-[-0.03em]">{name}</p>
      <p className="mt-2 text-small text-ink-muted">Fixed price, quoted within 24 hours of our call.</p>
      <ul className="mt-8 flex-1 space-y-3">
        {items.map((it) => (
          <li key={it} className="flex gap-3 text-body text-[#c7c7cc]">
            <Check />
            <span>{it}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex justify-center">
        <ApplyButton variant="red" note={null}>
          Apply to build your app
        </ApplyButton>
      </div>
    </div>
  );
}

function Build() {
  return (
    <Section tone="black" id="build" labelledBy="build-title" decor={<Blobs spots={[{ n: 4, className: "-left-40 top-[38%] w-[340px]", hideOnMobile: true }]} />}>
      <Reveal>
        <Prose>
          <SectionHead id="build-title" eyebrow="Your Build" title="One fixed price." accent="Start to finish." sub="Agreed before we start. No hourly rate, no separate designer, and no bill that grows every week." />
        </Prose>
      </Reveal>

      <Reveal className="stagger mx-auto mt-12 grid max-w-[72rem] grid-cols-1 gap-5 sm:mt-14 lg:grid-cols-3">
        <Plan name="Mobile app" items={[...BASE.slice(0, 4), "iPhone and Android", ...BASE.slice(4), "App Store and Google Play submission"]} />
        <Plan name="Web app" items={[...BASE.slice(0, 4), "Works in any browser, desktop and mobile", ...BASE.slice(4), "Launch on your own domain"]} />
        <Plan name="Mobile + web" items={[...BASE.slice(0, 4), "iPhone, Android and web from one backend", ...BASE.slice(4), "Store submission and web launch"]} />
      </Reveal>

      <Reveal className="mt-12 sm:mt-14">
        <Prose>
          <Seal id="build" dark className="mx-auto mb-12 w-[160px] sm:w-[222px]" />
          <Stack>
            <P>Before you pay anything, we go through your app on a call.</P>
            <P>Within 24 hours you get a formal quote with the exact scope, a clear development timeline and one fixed price.</P>
          </Stack>
        </Prose>
      </Reveal>
    </Section>
  );
}

/* ---------------- 8. Founder (original layout) ---------------- */

function Founder() {
  const paras: React.ReactNode[] = [
    <>I&rsquo;m Joseph, founder of Cortexity.</>,
    <>
      Before I built apps for clients, I built my own. I designed them, coded them, got them approved and ran the ads that brought in the users.
    </>,
    <>
      So I know what you are worried about, because I have been the one paying for it: the developer who goes quiet, the invoice that keeps growing, the
      app that is always &ldquo;almost ready&rdquo;.
    </>,
    <>That is why Cortexity works differently. One project at a time. A fixed price. A working version in 21 days. And a guarantee in writing.</>,
    <strong key="last" className="font-semibold">When I take on your app, getting it shipped is my responsibility, not yours.</strong>,
  ];
  return (
    <Section tone="white" id="founder" labelledBy="founder-title">
      <SectionHead id="founder-title" eyebrow="The Founder" title="One person responsible for" accent="getting it done." sub="You work directly with me, from the first call to the app stores." />
      <Reveal className="mx-auto mt-12 max-w-none">
        <div className="grid grid-cols-1 items-stretch gap-6 rounded-[24px] border border-[#e5e5ea] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.05)] md:grid-cols-2 md:gap-10 md:p-6 lg:gap-12 lg:p-7">
          <div className="relative aspect-[4/5] h-full w-full overflow-hidden rounded-[20px] bg-[#f5f5f7] md:aspect-auto md:min-h-[560px] lg:min-h-[640px]">
            <Image
              src="/founder/joseph.jpg"
              alt="Joseph, founder of Cortexity, at his desk"
              fill
              sizes="(min-width: 1280px) 560px, (min-width: 768px) 46vw, 100vw"
              quality={88}
              className="object-cover object-[55%_30%]"
            />
          </div>
          <div className="flex flex-col justify-center space-y-5 px-2 text-left text-[19px] leading-[1.5] text-[#1d1d1f] md:space-y-6 md:px-4 md:text-[21px] lg:px-6 lg:text-[22px]">
            {paras.map((p, i) => (
              <p key={i} className="relative pl-[22px] md:pl-6">
                <span aria-hidden="true" className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-[#e0201a] md:top-[0.55em] md:h-2 md:w-2" />
                {p}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ---------------- 9. Who it's for ---------------- */

function Fit() {
  const yes = [
    "You know what your app should do and who it is for.",
    "You have your features worked out, or you already have designs or a prototype.",
    "You are comparing providers and want the one that will actually ship.",
    "You want to start now, not “someday”.",
  ];
  const no = ["You are still deciding whether you want an app at all.", "You are looking for the cheapest quote you can find."];
  return (
    <Section tone="gray" id="fit" labelledBy="fit-title">
      <Reveal>
        <Prose>
          <SectionHead id="fit-title" eyebrow="Who It’s For" title="This is for people who are" accent="ready to build." />
        </Prose>
      </Reveal>
      <Reveal className="stagger mx-auto mt-10 grid max-w-[64rem] grid-cols-1 gap-5 text-left sm:mt-12 md:grid-cols-2">
        <div className="rounded-[24px] border border-[#e5e5ea] bg-white p-7 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:p-9">
          <h3 className="text-[21px] font-semibold tracking-[-0.02em] text-[#1d1d1f] md:text-[24px]">Cortexity is for you if:</h3>
          <ul className="mt-6 space-y-4">
            {yes.map((x) => (
              <li key={x} className="flex gap-3 text-[17px] leading-[1.5] text-[#3a3a3c]">
                <Check />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[24px] border border-[#e5e5ea] bg-white p-7 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:p-9">
          <h3 className="text-[21px] font-semibold tracking-[-0.02em] text-[#1d1d1f] md:text-[24px]">It is not for you if:</h3>
          <ul className="mt-6 space-y-4">
            {no.map((x) => (
              <li key={x} className="flex gap-3 text-[17px] leading-[1.5] text-ink-muted">
                <Cross />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <Reveal className="mt-10">
        <Prose>
          <P>We take one project at a time, so we only take projects we know we can deliver.</P>
        </Prose>
      </Reveal>
    </Section>
  );
}

/* ---------------- 10. FAQ ---------------- */

const FAQ: [string, string][] = [
  ["How much does it cost?", "Every app is different, so we give you one fixed price after a short call. Once it is agreed, it does not change."],
  ["What happens on the call?", "We go through your app together: what it does, who it is for and what the first version needs. You get a price range on the call. Within 24 hours you receive a formal quote with the exact scope, a clear development timeline and one fixed price."],
  ["What exactly do I get in 21 days?", "A first working version of your app: real screens and real features you can use and show people. From there you get a new build every week until launch."],
  ["How long until the full app is live?", "It depends on the size of the app. You get the full timeline, with dates, in your proposal before you commit to anything."],
  ["What does the satisfaction guarantee mean?", "We keep working until the app does everything we agreed, at no extra charge."],
  ["Do I own the code?", "Yes. The code, the design and every account are 100% yours."],
  ["Do you build for iPhone and Android?", "Yes, and web apps too. Tell us which you need when you apply."],
  ["Can I change things during the build?", "Yes. You see a new version every week, so you can react to the real app, not to a document."],
  ["What happens after launch?", "Any bug in what we delivered is fixed free for 30 days. If you want new features after that, we plan the next phase together."],
  ["I already have designs or a prototype. Can you work from those?", "Yes. That usually makes the build faster."],
  ["Will you sign an NDA?", "Yes."],
];

function Questions() {
  return (
    <Section tone="white" id="faq" labelledBy="faq-title">
      <Reveal>
        <Prose>
          <SectionHead id="faq-title" eyebrow="FAQ" title="Questions you" accent="probably have." />
        </Prose>
        <div className="mx-auto mt-10 max-w-[48rem] sm:mt-12">
          <FaqList>
            {FAQ.map(([q, a]) => (
              <FaqItem key={q} question={q}>
                <P>{a}</P>
              </FaqItem>
            ))}
          </FaqList>
        </div>
      </Reveal>
    </Section>
  );
}

/* ---------------- 11. Closing (original layout) ---------------- */

function Closing() {
  return (
    <>
      <Section
        tone="white"
        id="start"
        labelledBy="closing-title"
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
            <Seal id="closing" dark className="mx-auto mb-10 w-[176px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.18)] sm:mb-12 sm:w-[220px]" />
            <SectionHead id="closing-title" title="Built right," accent="or we keep working." />
            <Stack className="mt-10 sm:mt-12">
              <P>Every app we build is covered by our 100% satisfaction guarantee.</P>
              <P>If anything we agreed on isn’t right, we keep working until it is, at no extra charge.</P>
            </Stack>
            <Badges className="mt-10" />
            <div id="final-cta" className="mt-10 flex justify-center">
              <ApplyButton size="lg" variant="red" note={null}>
                Apply to build your app
              </ApplyButton>
            </div>
            <Muted className="mt-5 italic">We take one project at a time.</Muted>
          </Prose>
        </Reveal>
      </Section>
      <Footer />
    </>
  );
}

export function Home() {
  return (
    <>
      <Mesh />
      <Header />
      <main id="main" data-avatar="home">
        <Hero />
        <Work />
        <Benefits />
        <Compare />
        <HowItWorks />
        <Included />
        <Build />
        <Founder />
        <Fit />
        <Questions />
        <Closing />
      </main>
      <StickyCta />
      <AvatarMark path="/" />
    </>
  );
}
