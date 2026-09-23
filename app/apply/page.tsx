import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { H1, Lead, Muted } from "@/components/Text";

export const metadata: Metadata = {
  title: "Apply to Build Your App",
  description: "Tell me a little about what you want to build.",
  robots: { index: false },
};

/**
 * PLACEHOLDER ROUTE — the application form is built in the next task
 * from cortexity_application_form.md. Every CTA on the landing page
 * already links here, so nothing else needs to change when it lands.
 */
export default function ApplyPage() {
  return (
    <>
      <Header />
      <main id="main" className="mx-auto w-full max-w-wide px-5 pb-24 pt-36 sm:px-8 sm:pt-48">
        <div className="max-w-prose">
          <H1>Apply to Build Your App</H1>
          <Lead className="mt-8">Tell me a little about what you want to build.</Lead>
          <Muted className="mt-10">The application form is on its way.</Muted>
          <Link
            href="/"
            className="mt-6 inline-block text-small font-medium text-ink underline-offset-4 hover:underline"
          >
            <span aria-hidden="true">← </span>Back
          </Link>
        </div>
      </main>
    </>
  );
}
