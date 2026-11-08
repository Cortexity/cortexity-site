import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CONTACT_EMAIL } from "@/app/apply/fields";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Cortexity collects, why, and how to have it deleted.",
};

const UPDATED = "8 November 2026";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em] text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-[1.0625rem] leading-[1.6] text-ink-muted">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main" className="tone-white mx-auto w-full max-w-[44rem] px-5 pb-20 pt-28 sm:px-8 sm:pt-36">
        <h1 className="text-[clamp(2rem,1.5rem+2vw,3rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-ink">
          Privacy Policy
        </h1>
        <p className="mt-3 text-small text-ink-muted">Last updated {UPDATED}</p>

        <Block title="Who we are">
          <p>Cortexity designs and builds mobile apps. This policy covers cortexity.studio and the application form on it.</p>
        </Block>

        <Block title="What we collect">
          <p>
            When you apply: your first and last name, email, WhatsApp number, your app idea and your occupation.
          </p>
          <p>
            Automatically: which page you visited before applying, whether you used a phone or a computer, and ad
            details such as the campaign you came from. We use cookies, including the Meta Pixel, to measure our ads.
          </p>
        </Block>

        <Block title="Why we use it">
          <p>To review your application, contact you about it, schedule a call with you, and measure which ads work.</p>
          <p>We never sell your information.</p>
        </Block>

        <Block title="Who we share it with">
          <p>Only the services that run this process:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Google (Sheets and Gmail), where applications are stored and emails are sent from</li>
            <li>Calendly, if you book a call</li>
            <li>Meta, for ad measurement: we send your email and phone number in scrambled (hashed) form</li>
            <li>Vercel, which hosts this website</li>
          </ul>
        </Block>

        <Block title="How long we keep it">
          <p>As long as we need it to talk with you about your project, or until you ask us to delete it.</p>
        </Block>

        <Block title="Your choices">
          <p>
            You can ask to see, correct or delete your information at any time by emailing{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-ink underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            . You can also block cookies in your browser settings.
          </p>
        </Block>
      </main>
      <Footer />
    </>
  );
}
