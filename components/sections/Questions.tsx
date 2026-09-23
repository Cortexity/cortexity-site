import { SectionHead } from "../SectionHead";
import { FaqItem, FaqList } from "../Faq";
import { Reveal } from "../Reveal";
import { Prose, Section } from "../Section";
import { P, Strong } from "../Text";

export function Questions() {
  return (
    <Section tone="white" id="faq" labelledBy="questions-title">
      <Reveal>
        <Prose>
          <SectionHead id="questions-title" eyebrow="FAQ" title="Questions you" accent="probably have." sub="Straight answers to what founders ask first." />
        </Prose>
        <div className="mx-auto mt-12 max-w-[48rem] sm:mt-16">
          <FaqList>
            <FaqItem question="Can you really build my app in 21 days?">
              <P>If we accept your project, that&rsquo;s the commitment.</P>
              <P>
                Before we start, I&rsquo;ll talk through the idea with you and understand what
                we&rsquo;re getting into.
              </P>
              <P>Once we take it on, our job is to get it built.</P>
            </FaqItem>

            <FaqItem question="What if I change my mind about something halfway through?">
              <P>Then tell me.</P>
              <P>Seriously.</P>
              <P>
                Seeing your idea become a real product will change the way you think about it.
              </P>
              <P>That&rsquo;s part of building something new.</P>
              <P>
                During the 21 days, we&rsquo;ll keep refining the product with you. You&rsquo;re
                not going to receive an extra invoice because you wanted a screen redesigned or
                realized something should work differently.
              </P>
              <P>
                If you make a major change that affects the 21-day timeline, I&rsquo;ll tell you
                immediately and we&rsquo;ll figure out the best way forward together.
              </P>
            </FaqItem>

            <FaqItem question="What happens after the 21 days?">
              <P>Once the build is complete, the app is yours.</P>
              <P>We&rsquo;ll then handle the App Store submission process with you.</P>
              <P>
                If you want to keep improving the product afterward, new features, larger
                updates, Android or further development, we can keep working together and agree
                on the next phase separately.
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
                project, we can simply scope the next phase together.
              </P>
            </FaqItem>

            <FaqItem question="Can you build Android too?">
              <P>Yes.</P>
              <P>Our $5,000 build is focused on iPhone.</P>
              <P>
                If you also want an Android version, tell us during your application and
                we&rsquo;ll discuss the best way to approach both platforms.
              </P>
            </FaqItem>

            <FaqItem question="Is App Store submission included?">
              <P>Yes.</P>
              <P>We handle the submission process after the 21-day build.</P>
              <P>
                Apple controls the review and approval process, so the time Apple takes to
                approve an app isn&rsquo;t counted as part of the 21 days.
              </P>
              <P>If Apple comes back with something that needs addressing, we&rsquo;ll work through it.</P>
            </FaqItem>

            <FaqItem question="Do I own everything?">
              <P>Yes.</P>
              <P>
                Once the project is completed and the final payment is made, the finished app,
                code and project are yours.
              </P>
              <Strong>It&rsquo;s your product. It should belong to you.</Strong>
            </FaqItem>

            <FaqItem question="Do I need to know anything about building apps?">
              <P>No.</P>
              <P>You shouldn&rsquo;t have to.</P>
              <P>You know the idea, the customer and the problem you&rsquo;re trying to solve.</P>
              <Strong>We&rsquo;ll take care of the technology.</Strong>
            </FaqItem>
          </FaqList>
        </div>
      </Reveal>
    </Section>
  );
}
