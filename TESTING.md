# Testing Meta Pixel + Conversions API

What is wired up:

| Where | Event | When |
|---|---|---|
| Browser (Pixel) | `PageView` | Every page load and client-side route change (`components/MetaPixel.tsx`) |
| Browser (Pixel) | `ViewContent` | `/apply` opens |
| Browser (Pixel) | `Lead` | Successful submit, with `eventID` from the server response |
| Browser (Pixel) | `QualifiedLead` (custom) | Successful **qualified** submit, same `eventID` |
| Server (CAPI) | `Lead` | After the sheet row + emails succeed (`lib/meta.ts`) |
| Server (CAPI) | `QualifiedLead` | Same, only when qualified, same `event_id` |

**Qualified** = Budget is `Yes` **and** Start is not `I’m just exploring for now` (constants `BUDGET_YES` / `START_EXPLORING` in `app/apply/fields.ts`).

## 0. Prerequisites

1. `.env.local` has `NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, `META_TEST_EVENT_CODE`, `NEXT_PUBLIC_DEBUG_FORM=true` (see `.env.example`). `NEXT_PUBLIC_*` values are baked in at build time: restart `npm run dev` / rebuild after changing them.
2. **Redeploy the Apps Script** with the new `google/apps-script.gs` (paste it in, then *Deploy → Manage deployments → ✎ → Version: New version → Deploy*). Without this the new columns stay empty. The script extends the header row of the existing sheet by itself on the next submission.
3. Install the **Meta Pixel Helper** Chrome extension (optional, handy).

## 1. Meta Test Events

1. Events Manager → your pixel → **Test events** tab.
2. Server events: CAPI sends `test_event_code` automatically while `META_TEST_EVENT_CODE` is set, so they show up in this tab.
3. Browser events: in the Test events tab, enter the site URL under *Test browser events* and open it from there (or just keep the tab open while you browse; Pixel Helper confirms fires).
4. Open the site with a fake ad click to test attribution, e.g.
   `http://localhost:3000/?fbclid=TESTCLICK123&utm_source=facebook&utm_campaign=test&utm_content=ad1&utm_medium=paid`
5. Go to `/apply`, submit once **qualified** (Budget: Yes, Start: As soon as possible) and once **unqualified** (e.g. Start: I’m just exploring for now).

Note: the test must run against a URL Meta can associate, and CAPI needs outbound internet from the server. Real submissions write real sheet rows and send real emails; use your own email / number.

### What a correct result looks like

- `PageView` on every page, `ViewContent` once on `/apply`.
- Qualified submit: **`Lead`** listed once with *Received from: Browser and Server* and marked **Deduplicated** (same event ID), plus **`QualifiedLead`** also Browser + Server, deduplicated.
- Unqualified submit: `Lead` (Browser + Server, deduplicated), **no** `QualifiedLead`.
- Server events show matched customer parameters: email, phone, IP, user agent, and `fbp` / `fbc` (fbc present when you arrived with `?fbclid=`).
- Event IDs match the `Event ID` column in the sheet.

## 2. Debug logs (`NEXT_PUBLIC_DEBUG_FORM=true`)

- **Browser console**: `[form-debug] browser payload` — every field plus the hidden attribution fields (fbp, fbc, fbclid, utm_*, landing_url, event_source_url).
- **Server terminal** (`npm run dev` output / Vercel function logs):
  - `[form-debug] server payload` — what is sent to the sheet, incl. qualified, eventId, device.
  - `[form-debug] CAPI request body` — the exact `data` array (hashed `em`/`ph`) and `test_event_code`.
  - `[form-debug] CAPI response` — Meta's status and body; success looks like `{"events_received":2,...}` (1 when unqualified).
- Idea, Why, Top 3 and Anything else are cut to 20 characters + `…`. Name, email and WhatsApp are logged in full. The access token and Apps Script secret are never logged.
- Set the flag to `false` (or remove it) and rebuild: nothing about the form is logged. To remove the feature entirely, set `DEBUG_FORM = false` in `lib/debug.ts` (one line), or delete the `debugLog` calls.

## 3. Sheet columns

After *Anything else* the sheet now has, in order: **Qualified** (Yes/No), **Event ID**, **fbp**, **fbc**, **UTM Source**, **UTM Campaign**, **UTM Content**, **Landing URL**, **Device** (mobile/desktop).

Check for each test submission:
- Qualified matches the rule above.
- Event ID equals the one in the server debug log and in Test Events.
- fbp looks like `fb.1.<timestamp>.<random>` (needs the pixel to have loaded; empty with ad blockers).
- fbc looks like `fb.1.<timestamp>.TESTCLICK123` when you arrived with `?fbclid=`.
- UTM columns and Landing URL match the first URL you opened (stored 30 days in the `cx_attr` cookie; a new fbclid/utm visit replaces it — clear cookies to retest).
- Device is `mobile` from a phone, `desktop` otherwise.

## 4. Disabled states

- No `NEXT_PUBLIC_META_PIXEL_ID`: no pixel script, no browser events; form works.
- No `META_CAPI_ACCESS_TOKEN` (or pixel id): no CAPI calls; form works.
- CAPI error or timeout: logged as `sendCapiLead…`, the applicant still sees the thank-you card (CAPI runs after the response via `after()`).

## Before launch

Done: `META_TEST_EVENT_CODE` has been removed from Vercel, so server events now go to the live Events Manager feed (Overview), not the Test events tab. `NEXT_PUBLIC_META_PIXEL_ID` and `META_CAPI_ACCESS_TOKEN` are set in Vercel.

To test again later, add `META_TEST_EVENT_CODE` back in Vercel (and `NEXT_PUBLIC_DEBUG_FORM=true` if you want the payload logs), redeploy, and remove both again when finished. `NEXT_PUBLIC_DEBUG_FORM` should stay empty in production.
