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

      <Reveal className="mx-auto mt-12 max-w-none sm:mt-16 md:mt-[calc(4rem+24px)]">
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
            {PARAGRAPHS.map((p, i) => (
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
