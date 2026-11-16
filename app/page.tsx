import type { Metadata } from "next";
import { Home } from "@/components/home/Home";

/** Home page: product-aware, no prices. The old founders page lives at /founders. */
export const metadata: Metadata = {
  title: { absolute: "Cortexity — Your app’s first version, working in 21 days." },
  description:
    "iPhone, Android and web apps. One fixed price, a new build every week and a 100% satisfaction guarantee. First working version in 21 days.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return <Home />;
}
