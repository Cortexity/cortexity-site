# Handoff: new home page + screening form

Owner: Joseph (Cortexity). Joseph makes all decisions; confirm before changing copy or design.

## Where things are
- Repo: `Cortexity/cortexity-site`, branch `home-product-aware` (NOT merged; master is live).
- Preview: https://cortexity-site-git-home-product-aware-joseph-selwans-projects.vercel.app
- Approved copy: "Cortexity: new home page script" doc, https://claude.ai/artifact/RVmaVQXYFBULwhDBxZvPYw
  (later chat edits below override the doc).
- Joseph's Mac folders: `~/Desktop/Cortexity Studio` (site copy, old offer/form docs), `~/Documents/6-avatar-ad-pipeline` (old avatar ads).
- Leads sheet: Google Drive "Cortexity Applications". Meta ads: account JS Media Agency (2313730419099601), campaign `CX | Leads-Schedule…` is PAUSED.

## Done on the branch
- `/` = new product-aware home page: `components/home/Home.tsx` (all copy inline). No prices.
- `/founders` = old founders page, unchanged (`app/founders/page.tsx`, avatar path `/founders`).
- Real screenshots: `public/screens/pixelogram-1..3.png`, `iqcalorie-1..3.png` (+ `fit/` sizes via `node scripts/screens.mjs`; slots added). App icons `public/screens/*-icon.png` (App Store; IQ Calorie from WhatsApp avatar). App band (`AppMarquee` in `components/Decor.tsx`) shows SLOWR, ReflexFlow, Pixelogram, IQ Calorie.
- `/apply`: one question per screen (`app/apply/fields.ts`, `ApplyForm.tsx`): app type, similar apps (optional), stage, platforms (multi), start, budget range, occupation, contact, then Calendly for everyone.
- Qualified = budget not "Under $10,000" AND start not "Just exploring for now". Lead fires on submit; Schedule (Pixel + CAPI) only for qualified bookings. Flag is in the booking HMAC (`lib/apply.ts`).
- Apps Script (`google/apps-script.gs`): version 3 rows go to new tab "Applications v3" with Qualified + new answers; bookings matched v3 then v2. `testV3_` for editor test.

## Design rules (Joseph was very clear)
- Reuse existing components and section styles only. No new layouts.
- NO AI-generated images on the site. Real screenshots only.
- Every word must have a purpose; no fluff or cringe lines.
- Say "IQ Calorie", not "AI calorie tracker". Don't say "on your iPhone" (we build iPhone, Android, web).
- Guarantee = "100% satisfaction guarantee" (we keep working until satisfied, at no extra charge). Never "money back" or "delivery guarantee".

## Open, in order
1. ~~**Seal**~~ DONE (0d354dd): `components/Seal.tsx`, pure SVG, `dark` prop for black bands. Under the cards in "Your build"; beside the final Apply button in Closing (stacked above it on phones). Centre says "100% / CORTEXITY": awaiting Joseph's OK on the "CORTEXITY" line.
2. **Benefit headings** (proposed, awaiting Joseph's OK): "Working in 21 days." / "One fixed price. 100% satisfaction guaranteed." / "Built by the founder himself." instead of the question headings.
3. Joseph to confirm new wording not in the doc: Pixelogram line, build-card platform lines, "Fixed price, quoted within 24 hours of our call."
4. Joseph redeploys the Apps Script (paste file → Deploy → Manage deployments → Edit → New version). Must happen BEFORE go-live, or v3 rows land in the legacy tab.
5. Test on preview: one qualified + one unqualified application; check sheet rows, both emails, Meta events (Schedule only for qualified).
6. Go live (merge to master) only on Joseph's OK.

## Core selling points (for upcoming ad creatives)
1. Working first version in 21 days.
2. One fixed price, 100% satisfaction guaranteed.
3. Built by the founder himself, one project at a time.
Support: weekly builds, you own the code, 30 days of bug fixes, shipped apps as proof.

## Notes
- `npm run build` must pass before pushing. Commit with Joseph's git name/email; push with `git -c push.negotiate=true push`.
- kie.ai: model `gpt-image-2-6/economy-text-to-image`, 5 credits/image, balance ~644. Not to be used for site images. Always report credits used.
