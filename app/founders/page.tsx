import type { Metadata } from "next";
import { Landing } from "@/components/Landing";
import { AVATARS } from "@/lib/avatars";

/** The original founders (A6) landing page, moved here from / unchanged. */
export const metadata: Metadata = {
  title: { absolute: AVATARS.founders.title },
  description: AVATARS.founders.description,
  alternates: { canonical: "/founders" },
};

export default async function FoundersPage({ searchParams }: { searchParams: Promise<{ country?: string | string[] }> }) {
  const { country } = await searchParams;
  return <Landing avatar={AVATARS.founders} country={country} />;
}
