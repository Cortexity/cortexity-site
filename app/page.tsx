import { Landing } from "@/components/Landing";
import { AVATARS } from "@/lib/avatars";

/** Home page = A6 first-time founders. The other avatars live in app/[avatar]. */
export default async function Home({ searchParams }: { searchParams: Promise<{ country?: string | string[] }> }) {
  const { country } = await searchParams;
  return <Landing avatar={AVATARS.founders} country={country} />;
}
