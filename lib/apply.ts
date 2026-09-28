import "server-only";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { after } from "next/server";
import { BUDGET_YES, FIELD_ORDER, findErrors, QUESTIONS, START_EXPLORING, type FieldName } from "@/app/apply/fields";
import { debugLog, forLog } from "@/lib/debug";
import { sendCapiLead } from "@/lib/meta";

export type SubmitResult = { ok: true; eventId: string; qualified: boolean } | { ok: false; error: string; fields?: FieldName[] };

/** Request details the Conversions API needs; read from headers by the caller. */
export type RequestContext = { ip?: string; userAgent?: string; referer?: string };

export function requestContext(h: Headers): RequestContext {
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || undefined;
  return { ip, userAgent: h.get("user-agent") ?? undefined, referer: h.get("referer") ?? undefined };
}

const field = (fd: FormData, name: string, max = 1000) => String(fd.get(name) ?? "").trim().slice(0, max);

const TIMEOUT_MS = 10_000;

/** Option labels are validated server-side so the sheet only ever holds known values. */
const CHOICES = Object.fromEntries(
  QUESTIONS.filter((q) => q.kind === "choice").map((q) => [q.name, (q as { options: string[] }).options]),
) as Record<string, string[]>;

/**
 * Validates an application and forwards it, as JSON, to the Google Apps Script
 * web app (google/apps-script.gs). Shared by the server action (JS on) and the
 * /api/apply route handler (native form POST, JS off).
 */
export async function processApplication(formData: FormData, ctx: RequestContext = {}): Promise<SubmitResult> {
  // Honeypot: bots fill every field; humans never see this one.
  if (String(formData.get("company") ?? "").trim()) return { ok: true, eventId: crypto.randomUUID(), qualified: false };

  const values: Record<string, string> = {};
  for (const name of FIELD_ORDER) values[name] = String(formData.get(name) ?? "").trim().slice(0, 5000);

  // Normalise the WhatsApp number to E.164 (+96170123456) before validating; the sheet stores that form.
  const parsed = parsePhoneNumberFromString(values.whatsapp);
  if (parsed?.isValid()) values.whatsapp = parsed.number;
  const errors = findErrors(values);
  for (const [name, options] of Object.entries(CHOICES)) {
    if (values[name] && !options.includes(values[name])) errors[name as FieldName] = "Choose one of the options";
  }
  const fields = Object.keys(errors) as FieldName[];
  if (fields.length) return { ok: false, error: "Please complete the highlighted fields.", fields };

  const eventId = crypto.randomUUID();
  const qualified = values.budget === BUDGET_YES && values.start !== START_EXPLORING;
  const eventSourceUrl = field(formData, "event_source_url") || ctx.referer || "";
  const tracking = {
    qualified: qualified ? "Yes" : "No",
    eventId,
    fbp: field(formData, "fbp", 200),
    fbc: field(formData, "fbc", 500),
    utmSource: field(formData, "utm_source", 200),
    utmCampaign: field(formData, "utm_campaign", 200),
    utmContent: field(formData, "utm_content", 200),
    landingUrl: field(formData, "landing_url"),
    device: /Mobi|Android|iPhone|iPad|iPod/i.test(ctx.userAgent ?? "") ? "mobile" : "desktop",
  };
  const payload = { submittedAt: new Date().toISOString(), ...values, ...tracking };
  debugLog("server payload", forLog({ ...payload, utmMedium: field(formData, "utm_medium", 200), eventSourceUrl }));

  const url = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SECRET;
  if (!url || !secret) {
    console.error("processApplication: APPS_SCRIPT_URL / APPS_SCRIPT_SECRET are not set");
    return { ok: false, error: "not-configured" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Secret": secret },
      body: JSON.stringify({ secret, ...payload }),
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
      console.error("processApplication: Apps Script replied", res.status, text.slice(0, 300));
      return { ok: false, error: "upstream" };
    }
    // The sheet row and both emails are done (Apps Script replied ok). Conversions API runs after the
    // response is sent, so it never delays or fails the submission.
    after(() =>
      sendCapiLead({
        eventId,
        qualified,
        email: values.email,
        phoneE164: values.whatsapp,
        fbp: tracking.fbp,
        fbc: tracking.fbc,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
        eventSourceUrl,
      }),
    );
    return { ok: true, eventId, qualified };
  } catch (err) {
    console.error("processApplication:", err);
    return { ok: false, error: controller.signal.aborted ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }
}
