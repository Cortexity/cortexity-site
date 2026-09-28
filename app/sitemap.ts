import type { MetadataRoute } from "next";

const BASE = "https://www.cortexity.studio";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/apply`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
