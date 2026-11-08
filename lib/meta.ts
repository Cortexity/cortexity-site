import "server-only";
import { createHash } from "node:crypto";
import { debugLog } from "@/lib/debug";

/**
 * Meta Conversions API (server side). Disabled cleanly when either
 * NEXT_PUBLIC_META_PIXEL_ID or META_CAPI_ACCESS_TOKEN is missing.
 * Never throws. Always logs exactly one line per call, prefixed "sendCapi[<events>]" and free of
 * personal data: "CAPI ok: events_received=N", "CAPI skipped: …", or the error.
 *
 * Events sent by the site:
 *   form submit    → Lead                        (event_id = the sheet's Event ID)
 *   Calendly booked → Schedule                   (event_id = "<Event ID>.booked")
 */

const GRAPH = "https://graph.facebook.com/v21.0";
const TIMEOUT_MS = 8_000;

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

export type CapiInput = {
  eventId: string;
  email: string;
  phoneE164: string;
  fbp?: string;
  fbc?: string;
  ip?: string;
  userAgent?: string;
  eventSourceUrl?: string;
};

export async function sendCapi(events: string[], i: CapiInput): Promise<void> {
  const tag = `sendCapi[${events.join("+")}]`;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) {
    console.log(`${tag}: CAPI skipped: missing pixel id / token`);
    return;
  }

  const user_data: Record<string, unknown> = {};
  const email = i.email.trim().toLowerCase();
  const phone = i.phoneE164.replace(/\D/g, "");
  if (email) user_data.em = [sha256(email)];
  if (phone) user_data.ph = [sha256(phone)];
  if (i.fbp) user_data.fbp = i.fbp;
  if (i.fbc) user_data.fbc = i.fbc;
  if (i.ip) user_data.client_ip_address = i.ip;
  if (i.userAgent) user_data.client_user_agent = i.userAgent;

  const event_time = Math.floor(Date.now() / 1000);
  const base = { event_time, event_id: i.eventId, action_source: "website", event_source_url: i.eventSourceUrl || undefined, user_data };
  const data = events.map((event_name) => ({ event_name, ...base }));

  const body: Record<string, unknown> = { data };
  const testCode = process.env.META_TEST_EVENT_CODE;
  if (testCode) body.test_event_code = testCode;

  debugLog("CAPI request body", body); // the token is in the URL, never in the body

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${GRAPH}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });
    const text = await res.text();
    debugLog("CAPI response", { status: res.status, body: text.slice(0, 1000) });
    if (!res.ok) {
      console.error(`${tag}: Meta replied`, res.status, text.slice(0, 300));
    } else {
      let received: unknown = "?";
      try {
        received = JSON.parse(text)?.events_received ?? "?";
      } catch {}
      console.log(`${tag}: CAPI ok: events_received=${received}`);
    }
  } catch (err) {
    // Only the message: the error could otherwise carry the request URL (and token).
    console.error(`${tag} failed:`, controller.signal.aborted ? "timeout" : err instanceof Error ? err.message : "unknown error");
  } finally {
    clearTimeout(timer);
  }
}
