import Image from "next/image";
import { SectionHead } from "../SectionHead";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

/** Copy paragraphs; `B` marks the phrases set in semibold. */
function B({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold">{children}</strong>;
}

const PARAGRAPHS: React.ReactNode[] = [
  <>
    Hi, I&rsquo;m Joseph, founder of Cortexity. <B>I design and build iPhone apps for founders</B>, from the
    first call to the App Store.
  </>,
  <>
    Before building apps for other founders, I built my own. <B>I&rsquo;ve been the client.</B> The delays, the
    vague answers, the &ldquo;that wasn&rsquo;t in the scope&rdquo;. That&rsquo;s why Cortexity exists.
  </>,
  <>
    <B>When I take on your app, I take responsibility for getting it built.</B> You shouldn&rsquo;t have to
    project-manage your developer or understand the technology. You should feel free to change your mind when
    the product could be better.
  </>,
  <>
    For 21 days we work on one goal: <B>the best first version of your app we can build.</B> You bring the
    vision. I&rsquo;ll take care of the rest.
  </>,
  <>
    And yes &mdash; <B>I&rsquo;m the one who answers your messages.</B>
  </>,
];

export function Founder() {
  return (
    <Section tone="white" id="founder" labelledBy="founder-title">
      <SectionHead id="founder-title" eyebrow="The founder" title="One person responsible for" accent="getting it done." sub="You work directly with me, from the first call to the App Store." />

      <Reveal className="mx-auto mt-12 max-w-[64rem] sm:mt-16">
        <div className="grid grid-cols-1 items-center gap-8 rounded-[24px] border border-[#e5e5ea] bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:p-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10 lg:gap-14 lg:p-10">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-[#f5f5f7]">
            <Image
              src="/founder/joseph.jpg"
              alt="Joseph, founder of Cortexity, at his desk"
              fill
              sizes="(min-width: 768px) 420px, 100vw"
              quality={88}
              className="object-cover object-[60%_30%]"
            />
          </div>
          <div className="space-y-4 text-left text-body text-[#1d1d1f]">
            {PARAGRAPHS.map((p, i) => (
              <p key={i} className="relative pl-[18px]">
                <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-1.5 w-1.5 rounded-full bg-[#e0201a]" />
                {p}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
