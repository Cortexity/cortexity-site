import type { Metadata } from "next";
import { headers } from "next/headers";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ApplyForm } from "./ApplyForm";

export const metadata: Metadata = {
  title: "Apply to Build Your App",
  description: "Tell me a little about what you want to build.",
};

/** Two-letter country for the WhatsApp picker: ?country= override (testing), then Vercel geo, then US. */
function phoneCountry(override: string | string[] | undefined, geo: string | null) {
  const pick = (v: string | null | undefined) => {
    const c = (v ?? "").trim().toUpperCase();
    return /^[A-Z]{2}$/.test(c) ? c : null;
  };
  return pick(Array.isArray(override) ? override[0] : override) ?? pick(geo) ?? "US";
}

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string; country?: string | string[] }>;
}) {
  const { sent, error, country } = await searchParams;
  const defaultCountry = phoneCountry(country, (await headers()).get("x-vercel-ip-country"));
  return (
    <>
      <Header />
      <main id="main" className="tone-gray mx-auto w-full max-w-[40rem] px-4 pb-20 pt-28 sm:px-8 sm:pt-36">
        <h1 className="sr-only">Apply to Build Your App</h1>
        <ApplyForm initialDone={sent === "1"} initialError={error} defaultCountry={defaultCountry} />
      </main>
      <Footer />
    </>
  );
}
