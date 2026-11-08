# Testing Meta Pixel + Conversions API

What is wired up:

| Where | Event | When |
|---|---|---|
| Browser (Pixel) | `PageView` | Every page load and client-side route change (`components/MetaPixel.tsx`) |
| Browser (Pixel) | `ViewContent` | `/apply` opens |
| Browser (Pixel) | `Lead` | Step 3 submitted (sheet row written), `eventID` = the sheet's Event ID |
| Server (CAPI) | `Lead` | Same moment, same `event_id` (`lib/apply.ts` → `lib/meta.ts`) |
| Browser (Pixel) | `Schedule` | Calendly reports a booking on step 4, `eventID` = `<Event ID>.booked` |
| Server (CAPI) | `Schedule` | Same moment, same `event_id`; the sheet row gets Booked = Yes |

**Qualified** = booked a call (Schedule). Optimise ads for Schedule. The booking report is signed by the server at submit (HMAC of Event ID + email + WhatsApp with `APPS_SCRIPT_SECRET`), so it can't be faked from outside.

**Avatar** column = the last landing page (`/`, `/fitness`, `/creators`, `/tutors`, `/salons`, `/brands`) viewed before `/apply` (`cx_avatar` cookie, 30 days, set by `components/AvatarMark.tsx`); `(direct)` if none. **Landing URL** still holds the first-touch page.

Testing a booking without a real Calendly booking: on step 4, run this in the browser console:
`window.dispatchEvent(new MessageEvent("message", { origin: "https://calendly.com", data: { event: "calendly.event_scheduled" } }))`

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
5. Go to `/apply`, submit once and book a slot on step 4 (**qualified**), and submit once without booking (**unqualified**).

Note: the test must run against a URL Meta can associate, and CAPI needs outbound internet from the server. Real submissions write real sheet rows and send real emails; use your own email / number.

### What a correct result looks like

- `PageView` on every page, `ViewContent` once on `/apply`.
- Every submit: **`Lead`** listed once with *Received from: Browser and Server* and marked **Deduplicated** (same event ID).
- Booked: **`Schedule`**, Browser + Server, deduplicated (event ID ends in `.booked`).
- Not booked: no `Schedule`.
- Server events show matched customer parameters: email, phone, IP, user agent, and `fbp` / `fbc` (fbc present when you arrived with `?fbclid=`).
- Event IDs match the `Event ID` column in the sheet.

## 2. Debug logs (`NEXT_PUBLIC_DEBUG_FORM=true`)

- **Browser console**: `[form-debug] browser payload` — every field plus the hidden attribution fields (fbp, fbc, fbclid, utm_*, landing_url, event_source_url).
- **Server terminal** (`npm run dev` output / Vercel function logs):
  - `[form-debug] server payload` — what is sent to the sheet, incl. qualified, eventId, device.
  - `[form-debug] CAPI request body` — the exact `data` array (hashed `em`/`ph`) and `test_event_code`.
  - `[form-debug] CAPI response` — Meta's status and body; success looks like `{"events_received":1,...}` for both Lead and Schedule.
  - Every CAPI call logs one line: `sendCapi[Lead]: …` or `sendCapi[Schedule]: …`.
- Idea is cut to 20 characters + `…`. Name, email and WhatsApp are logged in full. The access token and Apps Script secret are never logged.
- Set the flag to `false` (or remove it) and rebuild: nothing about the form is logged. To remove the feature entirely, set `DEBUG_FORM = false` in `lib/debug.ts` (one line), or delete the `debugLog` calls.

## 3. Sheet columns ("Applications v2" tab)

Timestamp, First name, Last name, Email, WhatsApp, Idea, Occupation (their own words), Avatar, **Booked** (No → Yes), **Booked at**, Event ID, fbp, fbc, UTM Source, UTM Campaign, UTM Content, Landing URL, Device.

Check for each test submission:
- Booked flips to Yes (and Booked at fills) within a few seconds of booking.
- Event ID equals the one in the server debug log, in Test Events, and in Calendly (booking → Tracking → utm_content).
- Avatar is the last landing page you opened before /apply.
- fbp / fbc / UTM / Landing URL / Device as before.

The original tab keeps the old one-page-form rows untouched.

## 4. Disabled states

- No `NEXT_PUBLIC_META_PIXEL_ID`: no pixel script, no browser events; form works.
- No `META_CAPI_ACCESS_TOKEN` (or pixel id): no CAPI calls; form works.
- CAPI error or timeout: logged as `sendCapiLead…`, the applicant still sees the thank-you card (CAPI runs after the response via `after()`).

## Before launch

Done: `META_TEST_EVENT_CODE` has been removed from Vercel, so server events now go to the live Events Manager feed (Overview), not the Test events tab. `NEXT_PUBLIC_META_PIXEL_ID` and `META_CAPI_ACCESS_TOKEN` are set in Vercel.

To test again later, add `META_TEST_EVENT_CODE` back in Vercel (and `NEXT_PUBLIC_DEBUG_FORM=true` if you want the payload logs), redeploy, and remove both again when finished. `NEXT_PUBLIC_DEBUG_FORM` should stay empty in production.
