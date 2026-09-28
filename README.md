# Cortexity site

The Cortexity landing page (`/`) and the application form (`/apply`). Next.js 16 App Router, TypeScript, Tailwind v4, system fonts. Everything is statically rendered except one server action that forwards applications to a Google Apps Script.

## Run it

```
npm install
npm run dev                              # http://localhost:3000
npm run build                            # must pass clean before committing
npm run start                            # serve the production build
npm run start -- -H 0.0.0.0 -p 3000      # same, reachable from a phone on the LAN at http://<mac-ip>:3000
npm run lint
```

## Routes

| Route | What | Notes |
|---|---|---|
| `/` | Landing page | Twelve sections in `components/sections/`, in the order listed in `app/page.tsx`. |
| `/apply` | Application form | Client form → server action (`app/apply/actions.ts`) → Google Apps Script web app → row in a Google Sheet + Gmail notification. Setup in [`google/SETUP.md`](google/SETUP.md). |
| `/lab` | Internal design lab | Red swatches, blob tints, phone frame, card styles, sharpness swap test. `noindex`. Delete before launch. |

## Environment variables

Copy `.env.example` to `.env.local` (gitignored) and fill in:

| Variable | Meaning |
|---|---|
| `APPS_SCRIPT_URL` | The `/exec` URL of the deployed Apps Script web app. |
| `APPS_SCRIPT_SECRET` | Must equal the `SECRET` constant at the top of `google/apps-script.gs`. |

| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel id. Empty disables the pixel. |
| `META_CAPI_ACCESS_TOKEN` | Conversions API token (server only). Empty disables CAPI. |
| `META_TEST_EVENT_CODE` | Meta Test Events code. Remove in production. |
| `NEXT_PUBLIC_DEBUG_FORM` | `true` logs form payloads for testing. Empty in production. |

Meta Pixel + Conversions API testing: [`TESTING.md`](TESTING.md).

Without the Apps Script variables the form renders and validates but every submission shows the fallback error line. Vercel needs the same two variables in the project settings.

## Where things live

```
app/
  layout.tsx            Metadata, viewport, the html.js / __hydrated fail-safe script, <Hydrated/>
  page.tsx              Landing page: Mesh + Header + sections + StickyCta
  globals.css           Tokens (@theme), tone-* section system, reveal/stagger, cards, accent, mesh, marquee
  icon.svg              Favicon
  apply/
    page.tsx            /apply page shell (header, eyebrow, H1, lead, form, footer)
    ApplyForm.tsx       Client form: cards, pill radios, inline validation, honeypot, thank-you state
    fields.ts           The questions as data + shared validation (client and server)
    actions.ts          "use server" submitApplication(): validates, POSTs JSON to Apps Script, 10s timeout
  lab/page.tsx          Design lab (internal)

components/
  Header.tsx            Floating pill nav; active section tracked with IntersectionObserver
  StickyCta.tsx         Phone-only Apply bar; section-aware white/black fade behind the button
  Hydrated.tsx          Sets window.__hydrated so layout's fail-safe knows the bundle ran
  Reveal.tsx            Fade-up on enter (IntersectionObserver) with a 1200 ms fallback; `stagger` class for grids
  Parallax.tsx          Vertical drift on scroll; `desktopOnly` keeps phone strips untransformed
  PhoneStrip.tsx        Mobile snap-scroll strip for the phone trios (72vw phones, centred start, dots)
  placeholders.tsx      PhoneFrame, PhoneTrio, AppMockup, FounderVideo; autoScreens() picks images at build time
  Section.tsx           Section (tone bands), Prose (centred column), Stack (stanza grouping)
  SectionHead.tsx       EyebrowPill + headline with italic serif accent + sub line
  Text.tsx              H1/H2/H3/P/Lead/Strong/Muted/Eyebrow
  Button.tsx            ApplyButton (pill, red or black, optional note)
  Faq.tsx               FaqList / FaqItem — native <details> rows on white cards
  Decor.tsx             Blobs (glass objects), Mesh (fixed page gradient), Dots (dot grid), AppMarquee
  Footer.tsx            Wordmark + © line, shared by / and /apply
  Wordmark.tsx          "Cortexity" wordmark
  sections/             Hero, Idea, Transformation, Founder, Process, Work, Timeline, Scope, Fit, Pricing, Questions, Closing
  lab/SwapMetrics.tsx   Helper for the /lab sharpness test

lib/tokens.ts           Colour + phone-frame constants (mirrored as CSS variables in globals.css)
scripts/screens.mjs     Generates the exact-fit phone screenshots (below)
google/apps-script.gs   The Apps Script that receives applications
google/SETUP.md         Non-developer setup steps for the sheet, script and env vars
public/screens/         padel-*.png, slowr-*.png, reflexflow-*.png originals + fit/ variants
public/blob-*.png       Decorative glass objects
```

## Phone screenshots

Originals live in `public/screens/<app>-<n>.png` (1 = left phone, 2 = centre, 3 = right; `padel` for the hero/Transformation trio, `slowr` and `reflexflow` for the Work mockups). `node scripts/screens.mjs` writes `public/screens/fit/<app>-<n>@2x.png` and `@3x.png`, resized with Lanczos3 to exactly 2× and 3× the CSS width each slot renders at on a 1280 px viewport (the widths are in the `SLOTS` table at the top of the script; re-measure and re-run whenever `PhoneTrio` / `AppMockup` sizing changes). A source narrower than the target is copied, never upscaled. `PhoneFrame` serves them as `src=@2x` with `srcSet="@2x 2x, @3x 3x"` so a 2× or 3× display draws the bitmap 1:1 instead of resampling it — a near-1:1 downscale in the browser is what made the text look soft before. If the `fit/` files are missing, `autoScreens()` falls back to the originals.

## Before launch

- Set `metadataBase` in `app/layout.tsx` to the production domain.
- Add `app/opengraph-image` and proper icons (only `app/icon.svg` exists).
- Replace `CONTACT_EMAIL` in `app/apply/fields.ts` (the fallback address shown when a submission fails).
- Change the Apps Script `SECRET` from its placeholder to a long random string; update `.env.local` and Vercel to match.
- Delete `app/lab/` and `components/lab/`.
- Add `APPS_SCRIPT_URL` and `APPS_SCRIPT_SECRET` in Vercel → Settings → Environment Variables.
- Record the founder video and pass `src`/`poster` to `<FounderVideo>` in `components/sections/Founder.tsx`.

## Testing note

Check mobile on a real iPhone, not only in emulation. Chromium's iPhone emulation (Playwright) once passed a build in which Safari left all Reveal-wrapped content hidden; the fail-safe in `layout.tsx` and the 1200 ms Reveal fallback exist because of that. For layout work, `npm run start -- -H 0.0.0.0 -p 3000` and open the Mac's LAN IP on the phone.
