import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Hydrated } from "@/components/Hydrated";
import { MetaPixel } from "@/components/MetaPixel";
import { PIXEL_ID, pixelBaseCode } from "@/lib/pixel";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cortexity.studio"),
  title: {
    default: "Cortexity — Your app idea. Built in 21 days.",
    template: "%s — Cortexity",
  },
  description:
    "You bring the idea. We take care of everything else. Strategy, design, development, testing and App Store submission. One project. One fixed price. $5,000.",
  openGraph: {
    title: "Cortexity — Your app idea. Built in 21 days.",
    description:
      "You bring the idea. We take care of everything else. One project. One fixed price. $5,000.",
    url: "https://www.cortexity.studio",
    siteName: "Cortexity",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        {/* Marks the document as JS-capable before first paint, so the
            reveal-on-scroll styles only ever hide content when JS will
            reveal it again. Fail-safe: if the React bundle has not run
            (window.__hydrated, set by <Hydrated/>) within 2.5s, drop the
            class again so nothing stays hidden. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');setTimeout(function(){if(!window.__hydrated){document.documentElement.classList.remove('js')}},2500)",
          }}
        />
        {/* Meta Pixel base code; only when NEXT_PUBLIC_META_PIXEL_ID is set. PageView is fired by <MetaPixel/>. */}
        {PIXEL_ID ? <script dangerouslySetInnerHTML={{ __html: pixelBaseCode(PIXEL_ID) }} /> : null}
      </head>
      <body className="flex min-h-full flex-col">
        <Hydrated />
        <MetaPixel />
        {PIXEL_ID ? (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`} />
          </noscript>
        ) : null}
        {children}
      </body>
    </html>
  );
}
