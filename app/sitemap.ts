import type { MetadataRoute } from "next";

const BASE = "https://www.cortexity.studio";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "monthly", priority: 1 },
    ...["fitness", "creators", "tutors", "salons", "brands"].map((p) => ({ url: `${BASE}/${p}`, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: `${BASE}/apply`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
