import { SectionHead } from "../SectionHead";
import { FaqItem, FaqList } from "../Faq";
import { Reveal } from "../Reveal";
import { Prose, Section } from "../Section";
import { P } from "../Text";

export function Questions() {
  return (
    <Section tone="white" id="faq" labelledBy="questions-title">
      <Reveal>
        <Prose>
          <SectionHead id="questions-title" eyebrow="FAQ" title="Questions you" accent="probably have." sub="Straight answers to what founders ask first." />
        </Prose>
        <div className="mx-auto mt-10 max-w-[48rem] sm:mt-12">
          <FaqList>
            <FaqItem question="Can you really build my app in 21 days?">
              <P>Yes. That&rsquo;s the promise.</P>
              <P>
                Before we start, we talk through the idea so I know exactly what we&rsquo;re
                building.
              </P>
            </FaqItem>

            <FaqItem question="What if I change my mind about something halfway through?">
              <P>Just tell me and we&rsquo;ll work it out.</P>
              <P>Seeing the real app always changes how you think about it. That&rsquo;s normal.</P>
              <P>
                During the 21 days, we&rsquo;ll keep refining the product with you. You&rsquo;re
                not going to receive an extra invoice because you wanted a screen redesigned or
                realized something should work differently.
              </P>
              <P>
                If you make a major change that affects the 21-day timeline, I&rsquo;ll tell you
                right away and we&rsquo;ll adjust the delivery date together.
              </P>
            </FaqItem>

            <FaqItem question="What happens after the 21 days?">
              <P>Once the build is complete, the app is yours.</P>
              <P>We&rsquo;ll then handle the App Store submission process with you.</P>
              <P>
                Want to keep building after that? New features and bigger updates are a new
                project, priced on its own.
              </P>
              <P>You&rsquo;re not locked into Cortexity.</P>
            </FaqItem>

            <FaqItem question="What if something breaks after the project?">
              <P>
                If something we delivered isn&rsquo;t working the way it&rsquo;s supposed to,
                we&rsquo;ll fix it.
              </P>
              <P>
                We&rsquo;re not going to hand you the app on Day 21 and pretend we&rsquo;ve never
                met.
              </P>
              <P>
                For new features, redesigns or continued product development after the initial
                project, we simply start a new project together, billed separately.
              </P>
            </FaqItem>

            <FaqItem question="Can you build Android too?">
              <P>Yes. iPhone is $5,000. iPhone plus Android is $8,000.</P>
              <P>We build the iPhone app first, then the Android version, so each one feels native.</P>
              <P>Tell us in your application if you want both.</P>
            </FaqItem>

            <FaqItem question="Is App Store submission included?">
              <P>Yes.</P>
              <P>We handle the submission process after the 21-day build.</P>
              <P>
                Apple controls the review and approval process, so the time Apple takes to
                approve an app isn&rsquo;t counted as part of the 21 days.
              </P>
              <P>If Apple comes back with something that needs addressing, we&rsquo;ll work through it until the app is live.</P>
            </FaqItem>

            <FaqItem question="Do I own everything?">
              <P>Yes.</P>
              <P>
                Once the project is completed and the final payment is made, the finished app,
                code and project are yours.
              </P>
              <P>It&rsquo;s your product.</P>
            </FaqItem>

            <FaqItem question="How is payment made?">
              <P>Payment is made via Whish.</P>
              <P>The project starts once the 50% deposit is received.</P>
            </FaqItem>

            <FaqItem question="Do I need to know anything about building apps?">
              <P>No.</P>
              <P>You shouldn&rsquo;t have to.</P>
              <P>You know the idea, the customer and the problem you&rsquo;re trying to solve.</P>
              <P>We take care of the rest.</P>
            </FaqItem>
          </FaqList>
        </div>
      </Reveal>
    </Section>
  );
}
