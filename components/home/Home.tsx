import Image from "next/image";
import { Check } from "lucide-react";
import { AvatarMark } from "../AvatarMark";
import { ApplyButton } from "../Button";
import { Blobs, Dots, Mesh } from "../Decor";
import { FaqItem, FaqList } from "../Faq";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { AppMockup, PhoneTrio, type Screen } from "../placeholders";
import { Reveal } from "../Reveal";
import { Prose, Section } from "../Section";
import { SectionHead } from "../SectionHead";
import { StickyCta } from "../StickyCta";
import { Lead, Muted, P, Strong } from "../Text";

/**
 * The home page (/): product-aware, no prices. Copy approved in the
 * "Cortexity: new home page script" doc. The old founders page lives at /founders.
 */

const BADGES = ["First version in 21 days", "100% satisfaction guarantee", "Fixed price", "You own the code"];

/** Row of small check pills; `dark` for black sections. */
function Badges({ items = BADGES, dark = false, className = "" }: { items?: string[]; dark?: boolean; className?: string }) {
  return (
    <ul className={`flex flex-wrap justify-center gap-2.5 ${className}`}>
      {items.map((b) => (
        <li
          key={b}
          className={`inline-flex items-center gap-2 rounded-pill px-4 py-2 text-[14px] font-medium sm:text-[15px] ${
            dark ? "bg-white/10 text-white" : "bg-white text-ink shadow-[0_2px_10px_rgba(0,0,0,0.06)] ring-1 ring-[#e5e5ea]"
          }`}
        >
          <Check size={16} strokeWidth={2.5} className="text-red" aria-hidden="true" />
          {b}
        </li>
      ))}
    </ul>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap justify-center gap-2">
      {items.map((t) => (
        <li key={t} className="rounded-pill bg-white/10 px-3.5 py-1.5 text-[13px] font-medium text-white/80">
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Horizontal flow of short steps joined by arrows (wraps to a column on phones). */
function Flow({ label, steps }: { label: string; steps: string[] }) {
  return (
    <div className="text-center">
      <p className="text-eyebrow uppercase text-white/50">{label}</p>
      <ol className="mt-4 flex flex-col items-center justify-center gap-2 md:flex-row md:gap-3">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-col items-center gap-2 md:flex-row md:gap-3">
            <span className="rounded-[14px] bg-white/10 px-4 py-3 text-[15px] font-medium text-white">{s}</span>
            {i < steps.length - 1 ? (
              <span aria-hidden="true" className="text-red md:rotate-0 rotate-90">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

const shot = (file: string, alt: string): Screen => ({ src: `/work/${file}`, alt });

/* ---------------- 1. Hero ---------------- */

function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="tone-white relative overflow-hidden px-5 pb-12 pt-28 text-center sm:px-8 sm:pb-16 sm:pt-36">
      <Dots />
      <div className="relative z-10 mx-auto max-w-[60rem]">
        <SectionHead level={1} id="hero-title" title="Your app’s first version," accent="working in 21 days." />
        <Lead className="mx-auto mt-6 max-w-prose text-ink-muted sm:mt-8">
          One fixed price. A new build every week. 100% satisfaction guaranteed.
        </Lead>
        <div id="hero-cta" className="mt-8 flex justify-center sm:mt-10">
          <ApplyButton size="lg" variant="red" note="iPhone · Android · Web">
            Apply to build your app
          </ApplyButton>
        </div>
        <Badges className="mt-8" />
      </div>
      <div className="relative z-10 mt-12 sm:mt-16">
        <PhoneTrio
          priority
          slug="home-hero"
          label="Cortexity"
          screens={[
            { src: "/screens/fit/slowr-1@2x.png", srcSet: "/screens/fit/slowr-1@2x.png 2x, /screens/fit/slowr-1@3x.png 3x", alt: "SLOWR app" },
            shot("calorie-chat.jpg", "AI calorie tracker chat on WhatsApp"),
            { src: "/screens/fit/reflexflow-1@2x.png", srcSet: "/screens/fit/reflexflow-1@2x.png 2x, /screens/fit/reflexflow-1@3x.png 3x", alt: "ReflexFlow app" },
          ]}
        />
      </div>
    </section>
  );
}

/* ---------------- 2. Proof ---------------- */

function Product({
  id,
  name,
  line,
  body,
  tags,
  children,
  first = false,
}: {
  id: string;
  name: string;
  line: string;
  body: string;
  tags: string[];
  children?: React.ReactNode;
  first?: boolean;
}) {
  return (
    <article className={`${first ? "pt-6" : "pt-20 sm:pt-28"} text-center`} aria-labelledby={id}>
      <Reveal>
        <Prose>
          <h3 id={id} className="text-h2 text-balance">{name}</h3>
          <p className="mt-3 text-lead font-semibold text-white">{line}</p>
          <P className="mx-auto mt-4 max-w-prose">{body}</P>
          <Tags items={tags} />
        </Prose>
      </Reveal>
      {children ? <Reveal delay={80} className="mt-10 sm:mt-12">{children}</Reveal> : null}
    </article>
  );
}

function Proof() {
  return (
    <Section tone="black" id="work" labelledBy="work-title">
      <Reveal>
        <Prose>
          <SectionHead id="work-title" title="Built by" accent="Cortexity." sub="Apps we designed, built and launched ourselves, so you can judge the work and not the pitch." />
        </Prose>
      </Reveal>

      <div className="mt-10 sm:mt-12">
        <Product
          first
          id="work-slowr"
          name="SLOWR"
          line="A complete subscription app, live on the App Store."
          body="Guided training, progressive programs, progress tracking and in-app subscriptions. Designed, built and shipped by Cortexity."
          tags={["Subscriptions", "Programs", "Progress tracking", "App Store"]}
        >
          <AppMockup name="Slowr" />
        </Product>

        <Product
          id="work-reflexflow"
          name="ReflexFlow"
          line="A multi-week guided audio program."
          body="Guided audio sessions produced in-house, progressive training and personal progress tracking. If your app needs voice, audio or guided sessions, we have built it."
          tags={["Audio", "Guided programs", "Meditation-style apps"]}
        >
          <AppMockup name="ReflexFlow" />
        </Product>

        <Product
          id="work-pixelogram"
          name="Pixelogram"
          line="1,500 installs in 3 days."
          body="Designed, built and launched by Cortexity."
          tags={["Launch", "Paid ads", "Growth"]}
        />

        <Product
          id="work-calorie"
          name="AI calorie tracker on WhatsApp"
          line="An AI nutrition coach that lives in WhatsApp."
          body="Send a photo of your meal and get calories and macros back in seconds. Behind the chat: an AI model that reads food photos, a full backend and database, an onboarding flow, Stripe subscriptions with free trials, and a web dashboard for each user."
          tags={["AI", "WhatsApp chatbot", "Stripe payments", "Backend and database", "Web dashboard"]}
        >
          <AppMockup
            name="Calorie"
            screens={[
              shot("calorie-onboarding.jpg", "Calorie tracker onboarding: choose your diet"),
              shot("calorie-chat.jpg", "Calorie tracker chat: meal logged with calories and macros"),
              shot("calorie-results.jpg", "Calorie tracker: personal daily plan"),
            ]}
          />
          <div className="mx-auto mt-14 max-w-[60rem] space-y-10">
            <Flow label="How it works" steps={["Photo sent on WhatsApp", "AI reads the meal", "Saved to the database", "Daily progress sent back"]} />
            <Flow label="How it gets paid" steps={["Free trial", "Stripe subscription", "Dashboard and billing"]} />
          </div>
          <div className="mx-auto mt-12 grid max-w-[64rem] grid-cols-1 items-center gap-8 md:grid-cols-[1fr_2.2fr]">
            <div className="mx-auto w-[60vw] max-w-[260px] overflow-hidden rounded-[28px] ring-1 ring-white/10 md:w-full">
              <Image src="/work/calorie-checkout.jpg" alt="Calorie tracker checkout with a 7-day free trial" width={941} height={2040} className="h-auto w-full" />
            </div>
            <div className="overflow-hidden rounded-[20px] ring-1 ring-white/10">
              <Image src="/work/calorie-dashboard.jpg" alt="Calorie tracker web dashboard with subscription and weekly calories" width={1672} height={941} className="h-auto w-full" />
            </div>
          </div>
        </Product>
      </div>

      <Reveal className="mt-20 sm:mt-28">
        <Prose>
          <Strong>Subscriptions, payments, AI, audio, chatbots, dashboards.</Strong>
          <P className="mt-4">Whatever your app needs, we have probably shipped it already.</P>
        </Prose>
      </Reveal>
    </Section>
  );
}

/* ---------------- 3. Benefits ---------------- */

const BENEFITS: { q: string; a: string; img: string; alt: string; badges: string[] }[] = [
  {
    q: "Will it actually get built?",
    a: "Your first working version, with the core of your app running on a real phone, is ready in 21 days. From there you get a new build every week until the full app is finished, so you always know exactly where your app stands. We take it all the way through App Store and Google Play approval. And it comes with a 100% satisfaction guarantee: we keep working until the app does everything we agreed, at no extra charge.",
    img: "/work/benefit-built.jpg",
    alt: "A phone beside a calendar showing 21 and weekly progress tiles",
    badges: ["21 days", "Weekly builds", "Satisfaction guarantee"],
  },
  {
    q: "What will it cost me?",
    a: "One fixed price, agreed before we start. There is no hourly billing and there are no surprise invoices. When the project is finished, everything is yours: the code, the design and the accounts. And if a bug shows up in what we delivered, we fix it free for 30 days after launch.",
    img: "/work/benefit-cost.jpg",
    alt: "A quote marked Fixed price beside a closed red padlock",
    badges: ["Fixed price", "You own the code", "30-day warranty"],
  },
  {
    q: "Who will I be working with?",
    a: "One team that does the whole job: strategy, design, development and backend, for iPhone, Android and web. We take one project at a time, so your app gets our full attention, and you talk directly to the person building it.",
    img: "/work/benefit-team.jpg",
    alt: "One laptop and one phone showing the same app design",
    badges: ["One project at a time", "Direct line", "iPhone, Android and web"],
  },
];

function Benefits() {
  return (
    <Section tone="gray" id="benefits" labelledBy="benefits-title" decor={<Blobs spots={[{ n: 1, className: "-left-48 top-24 w-[420px]", back: true, hideOnMobile: true }]} />}>
      <Reveal>
        <Prose>
          <SectionHead id="benefits-title" title="What you get with" accent="Cortexity." sub="Choosing who builds your app comes down to three questions. Here is how we answer each one." />
        </Prose>
      </Reveal>
      <div className="stagger mx-auto mt-10 grid max-w-[72rem] grid-cols-1 gap-6 sm:mt-12 lg:grid-cols-3">
        {BENEFITS.map((b) => (
          <Reveal key={b.q} className="flex flex-col overflow-hidden rounded-[28px] border border-[#e5e5ea] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <Image src={b.img} alt={b.alt} width={1448} height={1086} sizes="(min-width: 1024px) 380px, 100vw" className="h-auto w-full" />
            <div className="flex flex-1 flex-col p-6 text-left sm:p-8">
              <h3 className="text-h3 text-ink">{b.q}</h3>
              <p className="mt-4 flex-1 text-[17px] leading-[1.55] text-[#3a3a3c]">{b.a}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {b.badges.map((x) => (
                  <li key={x} className="inline-flex items-center gap-1.5 rounded-pill bg-[#f5f5f7] px-3 py-1.5 text-[13px] font-medium text-ink">
                    <Check size={14} strokeWidth={2.5} className="text-red" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- 4. Why us, not them ---------------- */

const ROWS: [string, string, string, string][] = [
  ["First working version", "2 to 3 months", "Unclear", "21 days or less"],
  ["Price", "Hourly, and it grows", "Cheap, then the extras start", "Fixed before we start"],
  ["Who you talk to", "An account manager", "Whoever replies", "The person building it"],
  ["Attention", "One of 10+ clients", "Juggling other jobs", "One project at a time"],
  ["If you’re not happy with the result", "You pay extra for the fixes", "They disappear", "We keep working until you are, at no extra charge"],
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
                  <span className="inline-flex items-start gap-2">
                    <Check size={18} strokeWidth={2.5} className="mt-[3px] shrink-0 text-red" aria-hidden="true" />
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
  ["We talk.", "One call. We go through your app together: what it does, who it is for and what the first version needs. You leave with a price range."],
  ["Your proposal within 24 hours.", "A formal quote with exactly what we build, a clear development timeline and one fixed price, so you know what to expect before you commit."],
  ["Day 21: your first working version.", "The core of your app, working on a real phone. The full app follows in weekly builds."],
  ["Weekly builds.", "Every week you get a new version. You test it, we refine it."],
  ["Launch.", "We submit to the App Store and Google Play and handle the review."],
  ["30 days of cover.", "Any bug in what we delivered, fixed free."],
];

function Process() {
  return (
    <Section tone="gray" id="process" labelledBy="process-title">
      <Reveal>
        <Prose>
          <SectionHead id="process-title" title="From your brief to" accent="the app stores." />
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

/* ---------------- 6. What's included ---------------- */

const INCLUDED: [string, string][] = [
  ["Product strategy", "What goes in the first version and what waits."],
  ["Design", "Every screen, the full user experience and the visual identity."],
  ["Development", "iPhone, Android and web."],
  ["Backend", "Database, user accounts, payments, AI and integrations."],
  ["Testing", "On real devices, every week."],
  ["Launch", "App Store and Google Play submission and approval."],
  ["Ownership", "Code, design and accounts handed over to you."],
];

function Included() {
  return (
    <Section tone="white" id="included" labelledBy="included-title">
      <Reveal>
        <Prose>
          <SectionHead id="included-title" title="One team for" accent="the whole job." sub="You don’t hire a designer, then a developer, then someone for the backend. We do all of it." />
        </Prose>
      </Reveal>
      <Reveal className="stagger mx-auto mt-10 grid max-w-[64rem] grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2">
        {INCLUDED.map(([t, c]) => (
          <div key={t} className="flex gap-4 rounded-[20px] bg-[#f5f5f7] p-5 text-left sm:p-6">
            <Check size={22} strokeWidth={2.5} className="mt-0.5 shrink-0 text-red" aria-hidden="true" />
            <div>
              <h3 className="text-[18px] font-semibold text-ink">{t}</h3>
              <p className="mt-1 text-[16px] leading-[1.5] text-[#3a3a3c]">{c}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}

/* ---------------- 7. Founder ---------------- */

function Founder() {
  const paras = [
    "I’m Joseph, founder of Cortexity.",
    "Before I built apps for clients, I built my own. I designed them, coded them, got them approved and ran the ads that brought in the users.",
    "So I know what you are worried about, because I have been the one paying for it: the developer who goes quiet, the invoice that keeps growing, the app that is always “almost ready”.",
    "That is why Cortexity works differently. One project at a time. A fixed price. A working version in 21 days. And a guarantee in writing.",
  ];
  return (
    <Section tone="gray" id="founder" labelledBy="founder-title">
      <SectionHead id="founder-title" eyebrow="The Founder" title="One person responsible for" accent="getting it done." />
      <Reveal className="mx-auto mt-12">
        <div className="grid grid-cols-1 items-stretch gap-6 rounded-[24px] border border-[#e5e5ea] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.05)] md:grid-cols-2 md:gap-10 md:p-6 lg:gap-12 lg:p-7">
          <div className="relative aspect-[4/5] h-full w-full overflow-hidden rounded-[20px] bg-[#f5f5f7] md:aspect-auto md:min-h-[520px]">
            <Image src="/founder/joseph.jpg" alt="Joseph, founder of Cortexity, at his desk" fill sizes="(min-width: 768px) 46vw, 100vw" quality={88} className="object-cover object-[55%_30%]" />
          </div>
          <div className="flex flex-col justify-center space-y-5 px-2 text-left text-[19px] leading-[1.5] text-[#1d1d1f] md:space-y-6 md:px-4 md:text-[21px]">
            {paras.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="font-semibold">When I take on your app, getting it shipped is my responsibility, not yours.</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ---------------- 8. Who it's for ---------------- */

function Fit() {
  const yes = [
    "You know what your app should do and who it is for.",
    "You have your features worked out, or you already have designs or a prototype.",
    "You are comparing providers and want the one that will actually ship.",
    "You want to start now, not “someday”.",
  ];
  const no = ["You are still deciding whether you want an app at all.", "You are looking for the cheapest quote you can find."];
  return (
    <Section tone="white" id="fit" labelledBy="fit-title">
      <Reveal>
        <Prose>
          <SectionHead id="fit-title" title="This is for people who are" accent="ready to build." />
        </Prose>
      </Reveal>
      <Reveal className="mx-auto mt-10 grid max-w-[64rem] grid-cols-1 gap-6 text-left sm:mt-12 md:grid-cols-2">
        <div className="rounded-[24px] bg-[#f5f5f7] p-6 sm:p-8">
          <h3 className="text-h3">Cortexity is for you if:</h3>
          <ul className="mt-5 space-y-4">
            {yes.map((x) => (
              <li key={x} className="flex gap-3 text-[17px] leading-[1.5] text-[#3a3a3c]">
                <Check size={20} strokeWidth={2.5} className="mt-0.5 shrink-0 text-red" aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[24px] border border-[#e5e5ea] p-6 sm:p-8">
          <h3 className="text-h3">It is not for you if:</h3>
          <ul className="mt-5 space-y-4">
            {no.map((x) => (
              <li key={x} className="flex gap-3 text-[17px] leading-[1.5] text-ink-muted">
                <span aria-hidden="true" className="mt-[11px] h-0.5 w-3 shrink-0 bg-[#c7c7cc]" />
                {x}
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

/* ---------------- 9. FAQ ---------------- */

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
    <Section tone="gray" id="faq" labelledBy="faq-title">
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

/* ---------------- 10. Closing ---------------- */

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
            <SectionHead id="closing-title" title="21 days from now, you could be" accent="holding your app." />
            <Lead className="mx-auto mt-8 max-w-prose text-ink-muted">
              Tell us what you want to build. If it is a fit, we will talk this week and you will have a fixed price straight after.
            </Lead>
            <Badges className="mt-10" />
            <div id="final-cta" className="mt-10 flex justify-center">
              <ApplyButton size="lg" variant="red" note={null}>
                Apply to build your app
              </ApplyButton>
            </div>
            <Muted className="mt-5">We take one project at a time.</Muted>
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
        <Proof />
        <Benefits />
        <Compare />
        <Process />
        <Included />
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
