# Cortexity — design notes

The site is a long, quiet piece of writing with a few objects in it. Everything below exists to keep it that way: one accent, one button, one type family, and a lot of air.

## 1. Palette

| Token        | Hex       | Use                                                                 |
| ------------ | --------- | ------------------------------------------------------------------- |
| `paper`      | `#F6F3EE` | Page background. Warm off-white — paper, not a screen.              |
| `ink`        | `#1A1814` | All primary text. Warm near-black; pure `#000` looks harsh on paper.|
| `ink-muted`  | `#6E675E` | Secondary lines (the "italic" lines in the copy, captions, footer). |
| `line`       | `#E3DED5` | Hairline dividers between sections and rows.                        |
| `surface`    | `#ECE8E1` | Quiet panels: the pricing card, empty iPhone screens, video poster. |
| `clay`       | `#A8471F` | **The accent.** CTA buttons, eyebrow labels, one key line.          |
| `clay-deep`  | `#8F3B18` | Button hover/active.                                                |
| `bezel`      | `#1C1A17` | iPhone frame body and Dynamic Island.                               |

Contrast (WCAG): ink on paper 16.0:1 · ink-muted on paper 5.0:1 · clay on paper 5.3:1 · paper text on clay buttons 5.3:1 · ink-muted on surface 4.6:1. Everything clears AA; body text clears AAA.

### Why clay

The audience arrives from Facebook and Instagram on a phone, so the page is competing with a feed whose accent is blue. Anything blue, purple or teal reads as "another tech landing page" before a word is read. A deep, slightly burnt terracotta does three things at once: it belongs to the same warm family as the paper (so the page feels like one material rather than a white template with a coloured button), it is unmistakably not a SaaS palette, and it is the colour of the Mediterranean — clay, stone, tile — without becoming a flag or a cliché. It is used sparingly: the six CTA buttons, the small tracked labels (DAY 1, 21 DAYS LATER, FIRST DAYS…), the quote rule, and exactly one line of copy — *"Let's figure out how to make it work."* — which is the argument of the whole page.

Dark mode is intentionally not supported; the warm paper is the identity.

## 2. Typography

**Family:** Geist Sans, loaded through `next/font/google` (self-hosted, `display: swap`). Geist Mono is not loaded — there was no real reason to. Geist has no italic face, so lines the source marks in italics are set smaller and muted (`Muted`) rather than synthetically slanted.

Fluid scale between 375 px and 1280 px (tokens in `globals.css`):

| Token          | Size                       | Line   | Tracking  | Weight | Used for                                   |
| -------------- | -------------------------- | ------ | --------- | ------ | ------------------------------------------ |
| `text-display` | 42 → 76 px                 | 1.02   | −0.035em  | 600    | The h1 only.                               |
| `text-h2`      | 32 → 52 px                 | 1.06   | −0.03em   | 600    | Section headings.                          |
| `text-h3`      | 22 → 28 px                 | 1.2    | −0.02em   | 600    | Sub-headings (Product, SLOWR, FAQ items…). |
| `text-lead`    | 20 → 24 px                 | 1.35   | −0.012em  | 400    | Opening line, quotes, FAQ questions.       |
| `text-body`    | 17 → 19 px                 | 1.5    | 0         | 400    | Everything else.                           |
| `text-small`   | 15 px                      | 1.45   | 0         | 400    | Muted lines, strip copy, footer.           |
| `text-eyebrow` | 12 px, uppercase           | 1      | +0.18em   | 500    | DAY 1 / 21 DAYS LATER / phase labels.      |

Bold lines in the copy are `font-semibold` at body size, never a size jump — the writing's emphasis, not the layout's. Headings use `text-wrap: balance`. Body copy is capped at `max-w-prose` (40 rem ≈ 65–70 characters). Every short line in the source is its own `<p>`; nothing was merged.

## 3. Spacing

Base unit 4 px (Tailwind default).

| Thing                              | Mobile      | ≥ 640 px    | ≥ 1024 px   |
| ---------------------------------- | ----------- | ----------- | ----------- |
| Section padding (top and bottom)   | 80 px       | 112 px      | 144 px      |
| Page gutter                        | 20 px       | 32 px       | 32 px       |
| Heading → first paragraph          | 40 px       | 48 px       | 48 px       |
| Between paragraphs (`Stack`)       | 20 px       | 20 px       | 20 px       |
| Between paragraph groups           | 40 px       | 48 px       | 48 px       |
| Paragraphs → button                | 40 px       | 48 px       | 48 px       |
| Content max width (`max-w-wide`)   | —           | —           | 1152 px     |
| Prose max width (`max-w-prose`)    | 640 px      | 640 px      | 640 px      |

Sections are separated by a single hairline (`line`) plus the padding above — no background bands, no cards, no icons. The only filled panel on the page is the pricing block.

Buttons: pill, 52–56 px tall, full width on phones, intrinsic width from 768 px. One style. Focus ring is a 2 px clay outline offset 4 px, shared by every interactive element.

Motion: a 14 px fade-up on sections as they enter the viewport (`Reveal`), 0.7 s, opacity and transform only. It is gated behind `html.js` so content can never be stuck hidden, and disabled under `prefers-reduced-motion`. No library.

## 4. Wordmark

Three treatments were considered. All are plain text in Geist — no logo file, which suits a one-person studio and means it renders crisply at any size, in email signatures, and in the App Store "by" line.

**A — Tracked (recommended, implemented).**
`CORTEXITY` in Geist Medium, uppercase, letter-spacing 0.24 em at 13 px (header) and 0.26 em at 22 px (footer). Tagline "From idea to app." underneath in sentence case, muted. Wide tracking reads as a house mark rather than a headline — the way a fashion house or an architecture practice signs its work. It stays out of the way at the top of the page and carries the footer on its own. This is `components/Wordmark.tsx`.

**B — Tight, with a period.**
`CORTEXITY.` in Geist Semibold, uppercase, letter-spacing −0.03 em, with the full stop in clay. Confident and Apple-adjacent; the accent dot gives it a signature. Rejected because the page's headlines already use exactly this tight-semibold voice, so the mark would compete with the h1 sitting a few hundred pixels below it, and because it spends the accent on decoration.

**C — Stacked lockup.**
Treatment A with the tagline set on a second line at 0.6× the mark's size, both left-aligned, a 1 px `line` rule between them. Best for a square avatar or an app icon, where the tagline needs to travel with the mark. Not needed on the site; it is what treatment A becomes when `tagline` is passed, minus the rule.

To switch: `Wordmark.tsx` is ~40 lines; both header and footer use it.

## 5. Placeholders — what to swap when assets arrive

All placeholder markup lives in **`components/placeholders.tsx`**. When real assets arrive you do not edit that file — you pass props at the call sites listed below. Every slot has a fixed aspect ratio, so nothing shifts when an image loads. Empty slots carry a `data-placeholder="…"` attribute, so `grep data-placeholder` in the browser's element inspector finds what is still missing.

| # | What                                   | Spec                                                                                   | Where to edit                                                                                              |
| - | -------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1 | **Founder video** (60–90 s)            | 16:9. MP4 (H.264) + a JPEG poster frame. Optional WebVTT captions.                     | `components/sections/Founder.tsx` → `<FounderVideo src="/media/founder.mp4" poster="/media/founder.jpg" captions="/media/founder.vtt" />` |
| 2 | **Three iPhones — finished padel app** | Three screenshots, **1179 × 2556 px** (iPhone 15/16 Pro Simulator export). PNG or JPEG. | `components/sections/Transformation.tsx` → `<PhoneTrio screens={[{src:'/apps/padel-1.png', alt:'…'}, {…}, {…}]} />` — order is left, centre, right |
| 3 | **SLOWR mockups**                      | Two screenshots, 1179 × 2556 px.                                                       | `components/sections/Work.tsx` → first `<App … />` → `<AppMockup name="Slowr" screens={[{…}, {…}]} />` (front, back) |
| 4 | **ReflexFlow mockups**                 | Two screenshots, 1179 × 2556 px.                                                       | `components/sections/Work.tsx` → second `<App … />` → same as above                                        |
| 5 | Open Graph image                       | 1200 × 630 px.                                                                         | Add `app/opengraph-image.png`; set `metadataBase` in `app/layout.tsx`.                                      |
| 6 | Favicon / app icon                     | 32 px `favicon.ico` and 512 px `app/icon.png`.                                          | Drop into `app/`; Next picks them up.                                                                      |
| 7 | `/apply` form                          | Copy in `cortexity_application_form.md`.                                               | `app/apply/page.tsx` (currently a placeholder page).                                                       |

Screenshots go through `next/image` (`fill`, `object-cover`) with `sizes` hints already set, so they are served responsively. Put files under `public/` and reference them from `/`.

The iPhone frame (`PhoneFrame`) is CSS only: bezel, screen radius and Dynamic Island are all in container-query units, so it can be dropped at any width and stays in proportion. If you later want a photographic frame instead, replace the inside of `PhoneFrame` only — the `Screen` prop contract stays the same.

## 6. Judgement calls

- **Italic lines → muted.** Geist has no italic; a faux italic would look cheap. Lines marked `*…*` in the source ("We take on a limited number of projects at a time.", the Apple review note, "That's outside the scope.", the closing note, the tagline) are set in `text-small` / `ink-muted` instead.
- **Typographic quotes.** Straight quotes and apostrophes from the markdown are set as curly (’ “ ”). The words are unchanged.
- **"Roughly, it goes like this." sits at the top** of "What the next 21 days look like.", directly under the heading, before the four narrative sub-sections — it reads as an overview, and on a phone it lets a skimmer get the shape before the detail. It is small, hairline-framed and uses the same eyebrow style as DAY 1 so it recedes rather than competes. Moving it to the end of the section is a one-line change in `components/sections/Timeline.tsx`.
- **Headings.** The first `#` is the only `<h1>`; every other `#` is an `<h2>`; `###` and the `##` under "Built by Cortexity." / "$5,000." / the closing section are `<h3>`, so the outline is a proper tree.
- **Copy paragraphs marked bold** are their own `<p><strong>` at body size. The one inline bold ("…**we want to be all in.**") stays inline.
- **The "overwhelmed" list** ("Designers. Developers. Technical decisions…") is set in `ink-muted` so it reads as noise the reader is drowning in, rather than as a claim.
- **Accent on one line of copy.** "Let's figure out how to make it work." is in clay. Nothing else in the body is.
- **Sticky CTA (phones only).** A full-width Apply bar slides up once the hero button has scrolled off, and slides away whenever any in-page Apply button is visible, so two never show at once. It is `inert` while hidden.
- **Header.** Wordmark left, a plain text link "Apply →" right. Not a button — there is one button style, and it is reserved for the in-copy CTAs.
- **Footer** adds one line the source doesn't have: `© <year> Cortexity`. Remove it in `components/sections/Closing.tsx` if you'd rather not.
- **Founder video is 16:9**, not 4:5 — safer if the video is shot landscape, and it sits inside the prose column. If Joseph films portrait, change the `aspectRatio` in `FounderVideo` to `4 / 5` and the box will simply be taller.
- **`/apply` is `noindex`** while it is a placeholder. Remove `robots: { index: false }` when the form ships.
- **No framer-motion.** The only motion is the CSS reveal; it didn't earn a 30 KB dependency.
