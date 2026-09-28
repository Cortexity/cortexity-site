"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";
import { trackPageView } from "@/lib/pixel";

/** Fires PageView on first load and every client-side route change; captures attribution once per load. */
export function MetaPixel() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      captureAttribution();
    } catch {}
  }, []);
  useEffect(() => {
    trackPageView();
  }, [pathname]);
  return null;
}
