/**
 * Landing page copy per avatar (the six ad sets). Only these sections change per
 * avatar; everything else on the page is shared. Approved copy: the
 * "Cortexity: website copy for 6 avatars" doc.
 *
 * Placeholders, filled per visitor country by lib/geo.ts:
 *   {price} {price8} {half} {big names} {bigOne}
 *
 * A line is a muted paragraph (string), a statement ({ s }) or a grey noise line ({ g }).
 */

export type Line = string | { s: string } | { g: string };

export type AvatarSlug = "founders" | "fitness" | "creators" | "tutors" | "salons" | "brands";

export type Avatar = {
  slug: AvatarSlug;
  /** URL path. */
  path: string;
  /** <title> without the " — Cortexity" suffix handling (full title). */
  title: string;
  description: string;
  hero: { title: string; accent: string; lead: string; line: string };
  problem: { title: string; accent: string; sub: string; body: Line[]; turn: Line[] };
  /** public/screens/<screens>-1..3.png */
  screens: string;
  screensLabel: string;
  day1: string;
  after: Line[];
  fit: { title: string; accent: string; sub: string; first: string };
  closing: { title: string; accent: string; lines: Line[] };
  faq: { q: string; a: string[] };
};

const PRICE_LINE: Line = { s: "21 days. {price}. Done for you." };
const SIMPLE: Line = { s: "It can be simple." };
const PAYING: Line = { s: "That’s the transformation you’re paying for." };

export const AVATARS: Record<AvatarSlug, Avatar> = {
  founders: {
    slug: "founders",
    path: "/",
    title: "Cortexity — Your app idea. Built in 21 days.",
    description:
      "You bring the idea. We take care of everything else. Strategy, design, development, testing and App Store submission. One project. One fixed price. $5,000.",
    hero: {
      title: "Your app idea. Built in",
      accent: "21 days.",
      lead: "Quoted $10,000 to $500,000 for your app idea? Ours is {price}, fixed.",
      line: "Strategy. Design. Development. Testing. App Store submission.",
    },
    problem: {
      title: "You’ve had the idea.",
      accent: "Now make it real.",
      sub: "Most app ideas never make it out of the Notes app.",
      body: [
        "Maybe it’s been sitting in your Notes for six months.",
        "Maybe you’ve talked about it with friends.",
        "Maybe you can already picture exactly how it should work. You just have no idea how to actually build it.",
        "And when you start looking into development, you’re completely overwhelmed:",
        { g: "Designers. Developers. Technical decisions. Quotes. Timelines. APIs. Databases. Architecture. Bugs. Unresponsive developer. Vague answers. No updates for two weeks. App Store rejections." },
        "Suddenly, building your idea feels like too much stress.",
      ],
      turn: [
        { s: "It can be simple AND easy." },
        "That’s our job.",
        "Bring us the idea.",
        "We’ll help you think through the product, design it, build it, refine it with you, and turn it into a real iPhone app.",
        PRICE_LINE,
      ],
    },
    screens: "padel",
    screensLabel: "Padel",
    day1: "What if there was an app that showed me every available padel court nearby and let me book one instantly?",
    after: [
      { s: "A beautifully designed, working iPhone app." },
      "Something you can hold in your hand.",
      "Something you can show people.",
      "Something your first customers can actually use.",
      PAYING,
    ],
    fit: {
      title: "This is for founders who are",
      accent: "serious about building.",
      sub: "For founders ready to stop thinking about it and build it.",
      first:
        "Cortexity is for you if you’ve been thinking about an app for too long, or if you’ve tried to build one before and it went badly.",
    },
    closing: {
      title: "Three weeks from now, this could be",
      accent: "on your iPhone.",
      lines: ["Stop telling people about it.", { s: "Hand them the app instead." }],
    },
    faq: {
      q: "Why are other quotes so much higher?",
      a: [
        "Agencies quote for big teams, long timelines and open-ended scope.",
        "We build one focused first version in 21 days, for one fixed price, and you own all of it.",
      ],
    },
  },

  fitness: {
    slug: "fitness",
    path: "/fitness",
    title: "Cortexity — Your coaching app. Built in 21 days.",
    description:
      "Quoted $30,000 for a fitness coaching app? We build yours in 21 days for one fixed price. Programs, workouts, progress tracking and monthly subscriptions.",
    hero: {
      title: "Your coaching app. Built in",
      accent: "21 days.",
      lead: "Quoted $30,000 for a fitness coaching app? We build yours for {price}, fixed.",
      line: "Programs. Workouts. Progress tracking. Monthly subscriptions. App Store submission.",
    },
    problem: {
      title: "You can only train so many people",
      accent: "one hour at a time.",
      sub: "Your income stops the moment your sessions do.",
      body: [
        "Your calendar is full.",
        "You send every program by hand on WhatsApp and answer the same questions all day.",
        "At the end of every month, you chase each client to get paid.",
        "No sessions, no income. Not when you’re sick, not when you travel.",
        "You’ve thought about your own app. Then someone quoted you $30,000 and six months.",
        { g: "Developers. Designers. Payments. Workout videos. Progress tracking. App Store rejections." },
        "So it stays an idea.",
      ],
      turn: [
        SIMPLE,
        "Bring us your method.",
        "We’ll turn it into an app your clients pay for every month and train with, without you in the room.",
        PRICE_LINE,
      ],
    },
    screens: "fitness",
    screensLabel: "Ironform coaching",
    day1: "What if my clients could follow my programs, log their workouts and track their progress in my own app, and pay me monthly for it?",
    after: [
      { s: "Your own coaching app, live on the App Store." },
      "Your programs, your name, your price.",
      "Clients train with you without booking a session.",
      "Income that doesn’t depend on your calendar.",
      PAYING,
    ],
    fit: {
      title: "This is for coaches who are",
      accent: "ready to scale.",
      sub: "For trainers who want to coach hundreds, not just the next hour.",
      first: "Cortexity is for you if your clients already trust your method and you’re ready to package it.",
    },
    closing: {
      title: "Three weeks from now, your clients could be training",
      accent: "in your app.",
      lines: ["Stop trading every hour for one session.", { s: "Let your app coach while you rest." }],
    },
    faq: {
      q: "Can clients pay me monthly inside the app?",
      a: [
        "Yes. We set up in-app subscriptions through Apple, so clients pay you every month and you see it in your dashboard.",
        "Apple keeps its standard commission (15% for most small businesses).",
      ],
    },
  },

  creators: {
    slug: "creators",
    path: "/creators",
    title: "Cortexity — Your own creator app. Built in 21 days.",
    description:
      "Think your own app costs $50,000? We build it in 21 days for one fixed price. Members-only content and monthly subscriptions, paid by your followers.",
    hero: {
      title: "Your own creator app. Built in",
      accent: "21 days.",
      lead: "Think your own app costs $50,000? It’s {price}, fixed.",
      line: "Members-only content. Monthly subscriptions. Your brand. App Store submission.",
    },
    problem: {
      title: "Millions of views. Your income still waits for",
      accent: "the next brand deal.",
      sub: "Your audience is yours. Your income shouldn’t belong to the algorithm.",
      body: [
        "You post every day.",
        "The algorithm decides who sees it.",
        "Brand deals come and go.",
        "Your most loyal followers would pay for more of you. There’s just nowhere for them to do it.",
        { g: "Developers. Payments. Subscriptions. App Store rules. Months of back and forth." },
        "So you keep giving it all away for free.",
      ],
      turn: [
        SIMPLE,
        "Bring us your idea.",
        "We’ll build the app your followers pay for every month: your content, your brand, your price.",
        PRICE_LINE,
      ],
    },
    screens: "creators",
    screensLabel: "Lara’s Kitchen membership",
    day1: "What if my most loyal followers paid me monthly for exclusive content, in my own app?",
    after: [
      { s: "Your own membership app, live on the App Store." },
      "Your content, behind your own paywall.",
      "Followers who pay you every month.",
      "Income that doesn’t wait for a brand deal.",
      PAYING,
    ],
    fit: {
      title: "This is for creators who are",
      accent: "ready to own their income.",
      sub: "For creators whose audience already wants more.",
      first: "Cortexity is for you if your followers already ask for more than your posts give them.",
    },
    closing: {
      title: "Three weeks from now, your followers could be paying you",
      accent: "every month.",
      lines: ["Stop giving everything away for free.", { s: "Give your best followers a reason to pay." }],
    },
    faq: {
      q: "Do I need a huge following?",
      a: [
        "No. A few hundred loyal followers paying monthly is already real income.",
        "We’ll go through your numbers on the first call, before you pay anything.",
      ],
    },
  },

  tutors: {
    slug: "tutors",
    path: "/tutors",
    title: "Cortexity — Your own learning app. Built in 21 days.",
    description:
      "Think your own learning app costs $50,000? We build it in 21 days for one fixed price. Courses, video lessons and monthly subscriptions, paid to you.",
    hero: {
      title: "Your own learning app. Built in",
      accent: "21 days.",
      lead: "Think your own learning app costs $50,000? It’s {price}, fixed.",
      line: "Courses. Video lessons. Quizzes. Monthly subscriptions. App Store submission.",
    },
    problem: {
      title: "You do the teaching.",
      accent: "The platform takes the cut.",
      sub: "Your students should pay you, not a marketplace.",
      body: [
        "Your lessons fill up.",
        "But every hour you teach is an hour you have to be there.",
        "Tutoring platforms take a cut of every session and list you next to hundreds of other tutors.",
        "You’ve thought about your own app. Then you heard what it costs.",
        { g: "Developers. Video hosting. Payments. Subscriptions. App Store rejections." },
        "So you keep renting someone else’s platform.",
      ],
      turn: [
        SIMPLE,
        "Bring us your courses.",
        "We’ll turn them into an app students subscribe to, so they learn from your lessons any time and pay you directly.",
        PRICE_LINE,
      ],
    },
    screens: "tutors",
    screensLabel: "Math with Nour",
    day1: "What if students could subscribe to my courses and learn from my lessons any time, in my own app?",
    after: [
      { s: "Your own learning app, live on the App Store." },
      "Your lessons, your name, your price.",
      "Students who learn from you any time, anywhere.",
      "Income that keeps coming in while you’re not teaching.",
      PAYING,
    ],
    fit: {
      title: "This is for tutors who are",
      accent: "ready to teach at scale.",
      sub: "For tutors whose students already ask for more.",
      first: "Cortexity is for you if students already come to you by name and you’re ready to reach more of them.",
    },
    closing: {
      title: "Three weeks from now, your students could be learning",
      accent: "in your app.",
      lines: ["Stop trading every hour for one student.", { s: "Teach once. Reach hundreds." }],
    },
    faq: {
      q: "Do students pay me directly?",
      a: [
        "Yes. Students subscribe inside your app through Apple, and the money comes to you, not a tutoring platform.",
        "Apple keeps its standard commission (15% for most small businesses).",
      ],
    },
  },

  salons: {
    slug: "salons",
    path: "/salons",
    title: "Cortexity — Your salon’s own app. Built in 21 days.",
    description:
      "Quoted $30,000 for your own app? We build your salon’s app in 21 days for one fixed price. Online booking, reminders and rewards that bring clients back.",
    hero: {
      title: "Your salon’s own app. Built in",
      accent: "21 days.",
      lead: "Quoted $30,000 for your own app? Get yours for {price}, fixed.",
      line: "Online booking. Rewards. Offers for your regulars. App Store submission.",
    },
    problem: {
      title: "Your chairs should be full.",
      accent: "Not your WhatsApp.",
      sub: "Every missed message is a missed booking.",
      body: [
        "Clients book by WhatsApp and voice notes, often late at night.",
        "Someone has to reply between appointments.",
        "Reply too late, and they book somewhere else.",
        "No-shows leave empty chairs. Every empty chair is lost money.",
        "Your offers go out as Instagram stories that disappear in 24 hours.",
        "Your salon looks premium. A WhatsApp chat doesn’t.",
        { g: "Developers. Booking systems. Calendars. Rewards. App Store rejections." },
        "So you keep running it all from your phone.",
      ],
      turn: [
        SIMPLE,
        "Bring us your salon.",
        "We’ll build your salon its own app. Clients book themselves in seconds, get a reminder before they come, and earn a reward every visit.",
        PRICE_LINE,
      ],
    },
    screens: "salons",
    screensLabel: "Maison Rima booking",
    day1: "What if my clients could book themselves, show up on time, and earn a reward every visit, in my salon’s own app?",
    after: [
      { s: "Your salon’s own app, live on the App Store." },
      "Clients book themselves, day or night.",
      "Reminders that cut no-shows.",
      "Rewards that bring them back to you, not the salon next door.",
      PAYING,
    ],
    fit: {
      title: "This is for salon owners who are",
      accent: "ready for a full book every week.",
      sub: "For salons that run on regulars.",
      first: "Cortexity is for you if your regulars keep your salon running and you want more of them, every week.",
    },
    closing: {
      title: "Three weeks from now, your clients could be booking",
      accent: "in your salon’s app.",
      lines: ["Stop running a premium salon from WhatsApp.", { s: "Let your clients book themselves." }],
    },
    faq: {
      q: "Will my clients actually download it?",
      a: ["Yes, if it’s the fastest way to book with you and every visit earns them something. That’s exactly what we build first."],
    },
  },

  brands: {
    slug: "brands",
    path: "/brands",
    title: "Cortexity — Your brand’s own shopping app. Built in 21 days.",
    description:
      "Think your own shopping app costs $50,000? We build it in 21 days for one fixed price. Your store on your customers’ phones, with offers that bring them back.",
    hero: {
      title: "Your brand’s own shopping app. Built in",
      accent: "21 days.",
      lead: "Think your own shopping app costs $50,000? It’s {price}, fixed.",
      line: "Your store. Member offers. Loyalty points. App Store submission.",
    },
    problem: {
      title: "You sell like a real brand.",
      accent: "You still look like an Instagram shop.",
      sub: "Customers trust the brands already on their phone.",
      body: [
        "Every sale starts with an ad, and ads keep getting more expensive.",
        "Customers buy once, then forget your name.",
        "To reach them again, you pay for another ad.",
        "Next to {big names}, you look small and new, so new customers hesitate.",
        "{big names} don’t have this problem. Their app is already on your customer’s phone.",
        { g: "Developers. Product catalogue. Checkout. Payments. App Store rejections." },
        "So you stay an Instagram page and a website.",
      ],
      turn: [
        SIMPLE,
        "Bring us your brand.",
        "We’ll build your brand its own shopping app, on your customers’ phones like {big names}. You send them offers directly, and they come back without another ad.",
        PRICE_LINE,
      ],
    },
    screens: "brands",
    screensLabel: "Sahra shopping",
    day1: "What if my brand had its own app, like {bigOne}, and my customers came back without me paying for another ad?",
    after: [
      { s: "Your brand’s own shopping app, live on the App Store." },
      "On their home screen, next to {big names}.",
      "Offers you send straight to their phone.",
      "Repeat sales without another ad.",
      PAYING,
    ],
    fit: {
      title: "This is for brand owners who are",
      accent: "ready to play in the big league.",
      sub: "For brands that already sell and want to be taken seriously.",
      first: "Cortexity is for you if your products already sell and you’re tired of paying for every customer twice.",
    },
    closing: {
      title: "Three weeks from now, your brand could sit",
      accent: "next to {big names}.",
      lines: ["Stop looking like an Instagram shop.", { s: "Look like the brand you already are." }],
    },
    faq: {
      q: "Does it work with my existing online store?",
      a: [
        "Yes, we can connect your app to your existing store.",
        "Every store is set up differently, so we review yours first and agree the timeline before you pay anything.",
      ],
    },
  },
};

/** The five avatar pages that live under their own path (founders is the home page). */
export const AVATAR_PATHS = ["fitness", "creators", "tutors", "salons", "brands"] as const;
