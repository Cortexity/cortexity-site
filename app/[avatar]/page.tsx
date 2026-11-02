import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Landing } from "@/components/Landing";
import { AVATARS, AVATAR_PATHS, type AvatarSlug } from "@/lib/avatars";

/** /fitness, /creators, /tutors, /salons, /brands — one page per ad set. Anything else 404s. */
export const dynamicParams = false;

export function generateStaticParams() {
  return AVATAR_PATHS.map((avatar) => ({ avatar }));
}

function find(slug: string) {
  return (AVATAR_PATHS as readonly string[]).includes(slug) ? AVATARS[slug as AvatarSlug] : null;
}

export async function generateMetadata({ params }: { params: Promise<{ avatar: string }> }): Promise<Metadata> {
  const a = find((await params).avatar);
  if (!a) return {};
  return {
    title: { absolute: a.title },
    description: a.description,
    alternates: { canonical: a.path },
    openGraph: { title: a.title, description: a.description, url: a.path, siteName: "Cortexity", type: "website", locale: "en_GB" },
  };
}

export default async function AvatarPage({
  params,
  searchParams,
}: {
  params: Promise<{ avatar: string }>;
  searchParams: Promise<{ country?: string | string[] }>;
}) {
  const a = find((await params).avatar);
  if (!a) notFound();
  const { country } = await searchParams;
  return <Landing avatar={a} country={country} />;
}
