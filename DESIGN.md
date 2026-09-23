# Cortexity — design system as built

This documents the site as it is in the code. `app/globals.css` and `lib/tokens.ts` are the source of truth; if this file and the code disagree, the code wins.

## Principles

Apple-adjacent: white page, near-black ink, one red, system fonts, generous vertical space. The page is a sequence of full-bleed bands — mostly white, one soft grey, two black — and the black bands carry the product (Work) and the price (Pricing). Every section headline ends in an italic serif accent set in red (`SectionHead`'s `accent` prop), which is the only place a serif appears apart from the step numbers in Process. Body copy is written as many short single-line paragraphs; `Stack` groups them into stanzas so the rhythm of the writing survives. Cards are used sparingly and are always the same shape: 24px radius, one hairline, one soft shadow.

## Palette

| Token | Hex | Used for |
|---|---|---|
| `white` | `#FFFFFF` | Page background, text on black bands and dark cards |
| `ink` | `#1D1D1F` | Text, black buttons, dark cards, focus rings |
| `muted` | `#6E6E73` | Secondary copy (`text-ink-muted`) on light bands |
| `gray` | `#F5F5F7` | Eyebrow pills, form fields, light tiles |
| `line` | `#E5E5EA` | Hairlines, card borders, field borders |
| `red` | `#E0201A` | Accent words, red buttons, dots, step numbers, the `$5,000` |
| black band | `#000000` | `tone-black` section background |

Additional greys that appear in code but are not tokens: `#3A3A3C` (Process sentences), `#C7C7CC` (muted copy inside dark cards), `#A1A1A6` (form placeholders).

### Section tones

`<Section tone="white|gray|black">` sets a class that flips these CSS variables for everything inside it:

| Class | Background | `--fg` | `--muted` | `--card` | `--btn-bg` / `--btn-fg` |
|---|---|---|---|---|---|
| `tone-white` | transparent (page mesh shows through) | `#1D1D1F` | `#6E6E73` | `#F5F5F7` | `#1D1D1F` / `#FFFFFF` |
| `tone-gray` | transparent | `#1D1D1F` | `#6E6E73` | `#FFFFFF` | `#1D1D1F` / `#FFFFFF` |
| `tone-black` | `#000000` | `#FFFFFF` | `rgb(255 255 255 / 0.62)` | `rgb(255 255 255 / 0.08)` | `#FFFFFF` / `#000000` |

Tailwind reads them as `text-fg`, `text-ink-muted`, `bg-card`, `bg-btn`, `text-btn-fg`. Current assignment: Hero, Idea, Transformation, Founder, Timeline, Fit, Questions, Closing are white; Process and Scope are grey; Work and Pricing are black. (`tone-white` and `tone-gray` have the same background today; grey is a semantic hook, the visual difference comes from the white cards those sections use.)

The page background is `Mesh`: a fixed white layer with three slowly drifting radial gradients (two red at 6–8 % alpha, one ink at 5 %), so "white" bands are never flat.

## Typography

Font stacks (`@theme` in globals.css):

```
--font-sans:    -apple-system, BlinkMacSystemFont, "SF Pro Text",    "Helvetica Neue", sans-serif
--font-display: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif   (h1–h3, wordmark)
.accent:        "New York", ui-serif, Georgia, "Times New Roman", serif — italic, weight 500, red, letter-spacing -0.01em
```

Fluid scale, as defined (375 px → 1280 px):

| Utility | Size | Line height | Tracking | Weight |
|---|---|---|---|---|
| `text-display` | `clamp(2.75rem, 1.6rem + 4.9vw, 5rem)` | 1.05 | -0.03em | 600 |
| `text-h2` | `clamp(2.25rem, 1.5rem + 3.2vw, 4rem)` | 1.08 | -0.02em | 600 |
| `text-h3` | `clamp(1.375rem, 1.2rem + 0.75vw, 1.75rem)` | 1.2 | -0.02em | 600 |
| `text-lead` | `clamp(1.25rem, 1.15rem + 0.45vw, 1.5rem)` | 1.35 | -0.012em | — |
| `text-body` | `clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)` | 1.5 | — | — |
| `text-small` | `0.9375rem` | 1.45 | — | — |
| `text-eyebrow` | `0.75rem` | 1 | 0.18em | 500 (uppercase) |

Primitives in `components/Text.tsx`: `H1` (display), `H2` (h2, max 15em), `H3`, `P` (body, muted, class `line`), `Lead`, `Muted` (small, muted — used for the lines the source marks in italics, since the system UI font's italic is not worth using at small sizes), `Eyebrow`, and `Strong`: a statement line rendered as its own `<p><strong>` at `clamp(1.5rem, 1.2rem + 1.2vw, 2rem)`, semibold, full-colour, `text-balance`. Straight quotes in the source are set curly.

## Layout primitives

`Section` — full-bleed band with `tone`, `overflow-hidden`, `px-5 sm:px-8`, inner `max-w-wide` (72rem) with `py-24 sm:py-32 lg:py-40`, optional `decor` slot rendered behind the content. Sections carry `scroll-margin-top: 104px` for the floating header.

`Prose` — centred column, `max-w-[56rem]`, `text-center`. Headlines may run this wide; copy is capped by `Stack`.

`Stack` — the stanza engine. It walks its children and groups them: consecutive short `P` lines (≤110 characters) sit 6px apart, at most three per stanza; a long `P`, a `Strong`, or any other element starts a new stanza. Stanzas are 40px apart, 48px either side of a `Strong`. When one lines-stanza follows another, the first line of the second is set in full colour (`--fg`) to break the run of grey. `bullets` adds a 12px red square at each stanza (Founder). Width `max-w-prose` = 35rem.

`SectionHead` — `EyebrowPill` (pill, `#F5F5F7`, 12px uppercase, 0.14em tracking, red dot) → headline (`text-h2`, or `text-display` at `level={1}`) whose final words are `<em class="accent">` → optional sub line in `text-lead` muted. Two faded hairlines flank the headline at `lg+`.

Cards — `.card` is `#1D1D1F` on light bands and white on `tone-black` (border `#E5E5EA`, shadow `0 8px 24px rgba(0,0,0,0.05)`); it always has a 24px radius, `translateY(-4px)` on hover and a 0.35s ease. `.card-dark` keeps the dark look even on black (Pricing). The Process list, the FAQ rows (`FaqItem`, 32px radius) and every form card use the *white* card recipe directly in Tailwind: `rounded-[24px] border border-[#e5e5ea] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.05)]`.

Buttons — `ApplyButton`: pill, `min-h-12 px-7` (or `min-h-14 px-9` for `size="lg"`), `variant="red"` (`#E0201A`/white) or the black default, full width under `md`, `-translate-y-0.5` on hover, optional note "I personally review every application." underneath. The header's Apply is the same pill at 40/48px. The form's submit is a real `<button>` in the red style plus a red shadow.

## Components

| Component | What it does |
|---|---|
| `Header` | Fixed floating pill (`bg-white/70`, blur 20px), wordmark left, section links (Process/Work/Pricing/FAQ) with a red underline on the active section, red Apply pill right. Links hidden under `md`. |
| `StickyCta` | Phones only. Slides up once `#hero-cta` has scrolled above the viewport, slides away while any `main a[href="/apply"]` is on screen, `inert` when hidden. The bar is transparent; a 96px gradient behind the button fades to `--sticky-bg`, which flips from `#fff` to `#000` (`data-dark`) while a `section.tone-black` or the footer overlaps the bottom 120px of the viewport. |
| `Reveal` | Adds `is-visible` when the element enters (`rootMargin 0 0 -40px`, threshold 0.01) and unconditionally after 1200 ms. CSS fades from `opacity 0, translateY(24px)` over 0.5s. With `className="stagger"` the wrapper stays put and its children (or the children of a `.contents` child) fade 60 ms apart. |
| Fail-safe (`layout.tsx` + `Hydrated`) | An inline script adds `html.js` before paint so reveal styles only hide content JS will show; `<Hydrated/>` sets `window.__hydrated` on mount, and if that is still unset after 2.5 s the script removes `js` so nothing stays hidden if the bundle never runs. |
| `Parallax` | Drifts content up to `max` px against scroll (`translate3d`, rAF). Off under reduced motion; with `desktopOnly` it also does nothing under `md` and drops `will-change`, because a transformed ancestor breaks touch scrolling of the phone strip in WebKit. |
| `PhoneStrip` | Under `md`: a full-bleed horizontal snap strip (see Phone mockups). At `md+` it is a plain `flex items-end justify-center` row. |
| `Blobs` | Glass-object PNGs (`public/blob-1..4.png`) placed per section, `saturate-50 brightness-110`, `back` = blurred 6px at 80 % opacity with less parallax, `hideOnMobile`. |
| `Mesh` / `Dots` | Page-wide drifting gradient; faint 24px dot grid with a radial mask (hero, closing). |
| `AppMarquee` | Greyscale, 40 % opacity marquee of shipped app names, 40 s loop, masked edges. |
| `FaqList` / `FaqItem` | Native `<details class="qa">`, plus-glyph that rotates 45° when open, body fades in. |
| `Footer` | Wordmark (24px) with the tagline "From idea to app." and `© <year> Cortexity`. |
| `/apply` form | Ten white cards, one per question; textareas and text inputs at 16px on `#F5F5F7` with a 14px radius and an ink border on focus; single-choice questions are pill radios (`#F5F5F7`, selected `#1D1D1F`/white) backed by real `<input type=radio>`; a native `<details>` for the examples; inline "Required" lines in red with scroll-to-first-error; a honeypot named `company`; a "Got it." card on success. |

## Phone mockups

`PhoneFrame` is a container-query box: black outer with `rounded-[14.5cqw]` and `p-[3cqw]` (the inset from `lib/tokens.ts`), an inner black screen at the iPhone 15 Pro ratio `1179 / 2556` with `rounded-[11.5cqw]`, the screenshot as a plain `<img>` with `object-cover`, and a Dynamic Island pill (`30cqw × 8.5cqw`, `top 3cqw`). Shadow `0 40px 80px rgba(0,0,0,0.28)`.

Desktop layouts (`md+`):

| Trio | Container | Left | Centre | Right |
|---|---|---|---|---|
| `PhoneTrio` (hero, Transformation) | `max-w-[56rem]` | `w-[33%] -mr-[5%] mb-[4%]` | `w-[40%]` | `w-[33%] -ml-[5%] mb-[4%]` |
| `AppMockup` (Work) | `max-w-[72rem]`, `Glow` radius 760px | `w-[31%] -mr-[5%]`, rotate -6° | `w-[36%] -translate-y-10` | `w-[31%] -ml-[5%]`, rotate 6° |

Tilt is applied as `md:[transform:rotate(±6deg)_translateZ(0)]` with `will-change`, `backface-visibility: hidden` and `image-rendering: auto`, so the rotation gets its own compositor layer and no filter ever touches the bitmap.

Images are exact-fit: `scripts/screens.mjs` produces `fit/<app>-<n>@2x.png` and `@3x.png` at exactly 2× and 3× the measured CSS width of each slot at 1280 px (padel 277.95 / 336.89 / 277.95, slowr and reflexflow 335.7 / 389.84 / 335.7), Lanczos3, never upscaled. `PhoneFrame` serves `src=@2x`, `srcSet="@2x 2x, @3x 3x"`, `width`/`height` = the CSS size. The reason: the originals are 1206 px wide and were being drawn at ~670 device pixels, and a browser downscale that close to 1:1 — then resampled again for the rotation — is what blurred the UI text. Under `md` the phones are ~281 CSS px wide, so the @2x file is mildly downscaled; acceptable.

Mobile strip (`PhoneStrip`, under `md`): full-bleed via `-mx-5 sm:-mx-8`, `flex gap-4`, `overflow-x auto`, `snap-x snap-mandatory`, `overscroll-behavior-x: contain`, `touch-action: pan-x pan-y`, hidden scrollbar, `px-[14vw]` so the first and last phone can centre. Each phone is `w-[72vw] flex-none snap-center`, no tilt. On mount `scrollLeft` is set so the centre phone is centred (instant, once; re-applied only when the media query flips). Three 6px dots sit below (`gap-2`), the active one red, the others `black/15` on light bands and `white/25` inside `tone-black`; the active index is the child whose centre is nearest the strip centre, recomputed on a rAF-throttled `scroll` event. The strip is `tabIndex=0` and has an sr-only "Swipe to see more screens." The `Parallax` wrapper around each trio is `desktopOnly`.

## Motion

| What | How | Duration |
|---|---|---|
| Section reveal | `opacity 0 → 1`, `translateY(24px → 0)`, `cubic-bezier(0.22,1,0.36,1)` | 0.5 s, stagger 60 ms per child |
| Card hover | `translateY(-4px)` | 0.35 s |
| Button hover | `translateY(-2px)` | 0.2 s |
| Header underline | opacity | 0.3 s |
| Sticky CTA | `translateY(100% ↔ 0)` | 0.5 s; gradient colour change is instant |
| Process number hover | red → ink | 0.3 s |
| Blobs | `float` keyframes (±12–14px, ±2–3° rotate) + scroll parallax (20px back, 45px front) | 10 s alternate |
| Mesh | three gradients drifting | 60 s alternate |
| Marquee | `translateX(-50%)` | 40 s linear |
| FAQ | glyph rotates 45°, body fades in | 0.35 s / 0.4 s |

Under `prefers-reduced-motion: reduce` every entry above is disabled: reveals render immediately, cards and buttons don't lift, blobs, mesh and marquee stop, the FAQ opens without animation, `Parallax` does nothing, and `scroll-behavior` is `auto`. No animation library; everything is CSS plus three small hooks (Reveal, Parallax, PhoneStrip).

## Judgement calls that still apply

- Lines the source marks in italics ("We take on a limited number of projects at a time.", the closing note, the tagline) are set as `Muted` — small and grey — rather than italic.
- Straight quotes and apostrophes from the copy are set curly; the words are unchanged.
- The first `#` is the only `<h1>`; section titles are `<h2>`; app names, plan names, process steps and form questions are `<h3>`/`<h2>` inside their own labelled regions, so the outline is a tree.
- The "overwhelmed" list ("Designers. Developers. Technical decisions…") is muted so it reads as noise, not as a claim.
- Red on copy is reserved: the `$5,000` in Pricing, the Scope statement, and the accent words of each headline. Nothing else in the body is red.
- Sticky CTA on phones only; never two Apply buttons on screen at once.
- The header's Apply is a red pill, matching the in-copy CTAs (the earlier plain-link version was dropped).
- Footer adds one line the source doesn't have: `© <year> Cortexity`.
- Founder video is 16:9; change `aspectRatio` in `FounderVideo` if the video is shot portrait.
- The Process section is a single white card of five hairline-separated rows (number | title | one sentence, baseline-aligned) rather than five cards; the copy was cut to one sentence per step because card layouts could not hold the longer text.
- Phone screenshots are pre-scaled offline instead of using `next/image`, so no optimizer ever resamples them.

## Remaining placeholders

- Founder video (`FounderVideo` renders a dark play-button placeholder until `src`/`poster` are passed in `components/sections/Founder.tsx`).
- Open Graph image and proper icons (`app/icon.svg` is the only icon; `metadataBase` is unset).
- `CONTACT_EMAIL` in `app/apply/fields.ts` is `hello@cortexity.app` until the real address exists.
- App icons for the marquee: `public/screens/<slug>-icon.png` is picked up automatically if present.
