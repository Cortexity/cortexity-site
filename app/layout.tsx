import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // TODO(launch): set metadataBase to the production domain once it is known,
  // and add an opengraph-image (see DESIGN.md → Placeholders).
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
            reveal it again. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
