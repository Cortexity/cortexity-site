import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { EyebrowPill } from "@/components/SectionHead";
import { H1, Lead, Muted } from "@/components/Text";
import { ApplyForm } from "./ApplyForm";

export const metadata: Metadata = {
  title: "Apply to Build Your App",
  description: "Tell me a little about what you want to build.",
};

export default function ApplyPage() {
  return (
    <>
      <Header />
      <main id="main" className="tone-gray mx-auto w-full max-w-[44rem] px-5 pb-24 pt-32 sm:px-8 sm:pt-44">
        <div className="text-center">
          <EyebrowPill>Apply</EyebrowPill>
          <H1 className="mx-auto mt-6 max-w-[12em]">Apply to Build Your App</H1>
          <Lead className="mx-auto mt-6 max-w-prose">Tell me a little about what you want to build.</Lead>
          <Muted className="mx-auto mt-4 max-w-prose">
            You don’t need a specification or technical knowledge. Just explain the idea as clearly as you can.
          </Muted>
        </div>
        <div className="mt-14 sm:mt-16">
          <ApplyForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
