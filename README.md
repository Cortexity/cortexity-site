# Cortexity — marketing site

The landing page for Cortexity, a boutique iOS app studio. Next.js (App Router, TypeScript), Tailwind CSS v4, Geist Sans via `next/font`. Statically generated; deploys to Vercel with no configuration.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (also type-checks)
npm run start      # serve the production build
npm run lint       # eslint
```

## Routes

| Route    | Status                                                                 |
| -------- | ---------------------------------------------------------------------- |
| `/`      | Landing page — every section of `cortexity_landing_page.md`, in order. |
| `/apply` | Placeholder. The application form is the next task; every CTA already links here. |

## Where things live

```
app/
  layout.tsx              font, metadata, the html.js flag for reveal animations
  globals.css             design tokens (colours, type scale, widths) + a little CSS
  page.tsx                composes the landing page sections in order
  apply/page.tsx          placeholder route
components/
  placeholders.tsx        ← every visual waiting on a real asset (video, iPhone frames)
  sections/*.tsx          one file per landing-page section, copy lives here
  Text.tsx                H1/H2/H3/P/Lead/Strong/Muted/Eyebrow primitives
  Section.tsx             Section / Prose / Stack layout primitives
  Button.tsx              the single primary button (always → /apply)
  Wordmark.tsx            CORTEXITY wordmark + tagline
  Header.tsx, Faq.tsx, PhaseStrip.tsx, Reveal.tsx, StickyCta.tsx
DESIGN.md                 palette, type, spacing, wordmark options, placeholder inventory
```

## Dropping in real assets

See **DESIGN.md → Placeholders**. In short: put files in `public/`, then pass `src`/`screens` props at the call sites in `components/sections/` — the frames already have fixed aspect ratios, so nothing shifts.

## Before launch

- Set `metadataBase` in `app/layout.tsx` to the production domain and add an `app/opengraph-image.png` (1200×630).
- Add a real `favicon.ico` / `app/icon.png`.
- Build the `/apply` form from `cortexity_application_form.md`.

## Audit (mobile, Lighthouse 13.5, production build)

Performance 99 · Accessibility 100 · Best Practices 100 · SEO 100
FCP 0.9 s · LCP 1.8 s · TBT 80 ms · CLS 0 · Speed Index 0.9 s
