import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { after } from "next/server";
import { bookingEventId, CALENDLY_URL, FIELD_ORDER, findErrors, occupationValue, type FieldName } from "@/app/apply/fields";
import { AVATARS } from "@/lib/avatars";
import { debugLog, forLog } from "@/lib/debug";
import { sendCapi } from "@/lib/meta";

export type SubmitResult =
  | { ok: true; eventId: string; bookingToken: string; whatsapp: string }
  | { ok: false; error: string; fields?: FieldName[] };

export type BookingResult = { ok: boolean };

/** Request details the Conversions API needs; read from headers by the caller. */
export type RequestContext = { ip?: string; userAgent?: string; referer?: string };

export function requestContext(h: Headers): RequestContext {
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || undefined;
  return { ip, userAgent: h.get("user-agent") ?? undefined, referer: h.get("referer") ?? undefined };
}

const field = (fd: FormData, name: string, max = 1000) => String(fd.get(name) ?? "").trim().slice(0, max);

const TIMEOUT_MS = 10_000;

/** Landing-page paths the Avatar column accepts; anything else (or nothing) is "(direct)". */
const AVATAR_PATHS = new Set(Object.values(AVATARS).map((a) => a.path));
export const DIRECT = "(direct)";

/**
 * Ties a booking report to the application it belongs to: the server signs
 * eventId + email + WhatsApp at submit, the browser sends the signature back when
 * Calendly reports a booking. Stops anyone from posting fake bookings / CAPI events.
 */
function bookingToken(eventId: string, email: string, whatsapp: string) {
  const key = process.env.APPS_SCRIPT_SECRET ?? "";
  return createHmac("sha256", key).update(`${eventId}|${email.toLowerCase()}|${whatsapp}`).digest("hex");
}

function sameToken(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** POSTs JSON to the Apps Script web app (google/apps-script.gs); true when it answers {"ok":true}. */
async function postToSheet(body: Record<string, unknown>, label: string): Promise<{ ok: boolean; error?: string }> {
  const url = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SECRET;
  if (!url || !secret) {
    console.error(`${label}: APPS_SCRIPT_URL / APPS_SCRIPT_SECRET are not set`);
    return { ok: false, error: "not-configured" };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Secret": secret },
      body: JSON.stringify({ secret, ...body }),
      redirect: "follow", // Apps Script web apps answer with a 302 to the result.
      signal: controller.signal,
      cache: "no-store",
    });
    const text = await res.text();
    let ok = res.ok;
    try {
      ok = ok && JSON.parse(text)?.ok === true;
    } catch {
      ok = false;
    }
    if (!ok) {
      console.error(`${label}: Apps Script replied`, res.status, text.slice(0, 300));
      return { ok: false, error: "upstream" };
    }
    return { ok: true };
  } catch (err) {
    console.error(`${label}:`, err);
    return { ok: false, error: controller.signal.aborted ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Validates an application and forwards it to the sheet ("Applications v2" tab).
 * Shared by the server action (JS on) and the /api/apply route handler (native form POST, JS off).
 * Meta: Lead (CAPI here, Pixel in the browser with the same event id).
 */
export async function processApplication(formData: FormData, ctx: RequestContext = {}): Promise<SubmitResult> {
  // Honeypot: bots fill every field; humans never see this one.
  if (String(formData.get("company") ?? "").trim()) {
    return { ok: true, eventId: crypto.randomUUID(), bookingToken: "", whatsapp: "" };
  }

  const values: Record<string, string> = {};
  for (const name of FIELD_ORDER) values[name] = String(formData.get(name) ?? "").trim().slice(0, name === "idea" ? 5000 : 200);

  // Normalise the WhatsApp number to E.164 (+96170123456) before validating; the sheet stores that form.
  const parsed = parsePhoneNumberFromString(values.whatsapp);
  if (parsed?.isValid()) values.whatsapp = parsed.number;
  const errors = findErrors(values);
  const fields = Object.keys(errors) as FieldName[];
  if (fields.length) return { ok: false, error: "Please complete the highlighted fields.", fields };

  const avatarRaw = field(formData, "avatar", 100);
  const eventId = crypto.randomUUID();
  const eventSourceUrl = field(formData, "event_source_url") || ctx.referer || "";
  const payload = {
    version: 2,
    submittedAt: new Date().toISOString(),
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    whatsapp: values.whatsapp,
    idea: values.idea,
    occupation: occupationValue(values.occupation, values.occupationOther),
    avatar: AVATAR_PATHS.has(avatarRaw) ? avatarRaw : DIRECT,
    eventId,
    fbp: field(formData, "fbp", 200),
    fbc: field(formData, "fbc", 500),
    utmSource: field(formData, "utm_source", 200),
    utmCampaign: field(formData, "utm_campaign", 200),
    utmContent: field(formData, "utm_content", 200),
    landingUrl: field(formData, "landing_url"),
    device: /Mobi|Android|iPhone|iPad|iPod/i.test(ctx.userAgent ?? "") ? "mobile" : "desktop",
    calendlyUrl: CALENDLY_URL, // the applicant's confirmation email links to it
  };
  debugLog("server payload", forLog({ ...payload, utmMedium: field(formData, "utm_medium", 200), eventSourceUrl }));

  const sent = await postToSheet(payload, "processApplication");
  if (!sent.ok) return { ok: false, error: sent.error ?? "upstream" };

  // The sheet row and both emails are done. CAPI runs after the response is sent, so it never delays or fails the submission.
  after(() =>
    sendCapi(["Lead"], {
      eventId,
      email: values.email,
      phoneE164: values.whatsapp,
      fbp: payload.fbp,
      fbc: payload.fbc,
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      eventSourceUrl,
    }),
  );
  return { ok: true, eventId, bookingToken: bookingToken(eventId, values.email, values.whatsapp), whatsapp: values.whatsapp };
}

export type BookingInput = {
  eventId: string;
  bookingToken: string;
  email: string;
  whatsapp: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl?: string;
};

/**
 * Calendly reported a booking in the browser: mark the sheet row Booked = Yes and
 * send Schedule + QualifiedLead to the Conversions API (Pixel fires the same two
 * in the browser with the same event id).
 */
export async function processBooking(i: BookingInput, ctx: RequestContext = {}): Promise<BookingResult> {
  const eventId = String(i.eventId ?? "").slice(0, 100);
  const email = String(i.email ?? "").trim().slice(0, 200);
  const whatsapp = String(i.whatsapp ?? "").trim().slice(0, 40);
  if (!eventId || !i.bookingToken || !sameToken(String(i.bookingToken), bookingToken(eventId, email, whatsapp))) {
    console.error("processBooking: bad token");
    return { ok: false };
  }

  after(() =>
    sendCapi(["Schedule", "QualifiedLead"], {
      eventId: bookingEventId(eventId),
      email,
      phoneE164: whatsapp,
      fbp: String(i.fbp ?? "").slice(0, 200),
      fbc: String(i.fbc ?? "").slice(0, 500),
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      eventSourceUrl: String(i.eventSourceUrl ?? "").slice(0, 1000) || ctx.referer,
    }),
  );

  const sent = await postToSheet({ action: "booked", eventId, bookedAt: new Date().toISOString() }, "processBooking");
  debugLog("booking", { eventId, sheet: sent.ok });
  return { ok: sent.ok };
}
