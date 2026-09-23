"use server";

import { FIELD_ORDER, findErrors, QUESTIONS, type FieldName } from "./fields";

export type SubmitResult = { ok: true } | { ok: false; error: string; fields?: FieldName[] };

const TIMEOUT_MS = 10_000;

/** Option labels are validated server-side so the sheet only ever holds known values. */
const CHOICES = Object.fromEntries(
  QUESTIONS.filter((q) => q.kind === "choice").map((q) => [q.name, (q as { options: string[] }).options]),
) as Record<string, string[]>;

/**
 * Validates the application and forwards it, as JSON, to the Google Apps
 * Script web app (google/apps-script.gs) that appends a sheet row and
 * emails Joseph. Server-to-server, so no CORS is involved.
 */
export async function submitApplication(formData: FormData): Promise<SubmitResult> {
  // Honeypot: bots fill every field; humans never see this one.
  if (String(formData.get("company") ?? "").trim()) return { ok: true };

  const values: Record<string, string> = {};
  for (const name of FIELD_ORDER) values[name] = String(formData.get(name) ?? "").trim().slice(0, 5000);

  const fields = findErrors(values);
  for (const [name, options] of Object.entries(CHOICES)) {
    if (values[name] && !options.includes(values[name])) fields.push(name as FieldName);
  }
  if (fields.length) return { ok: false, error: "Please complete the highlighted fields.", fields };

  const url = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SECRET;
  if (!url || !secret) {
    console.error("submitApplication: APPS_SCRIPT_URL / APPS_SCRIPT_SECRET are not set");
    return { ok: false, error: "not-configured" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Secret": secret },
      body: JSON.stringify({ secret, submittedAt: new Date().toISOString(), ...values }),
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
      console.error("submitApplication: Apps Script replied", res.status, text.slice(0, 300));
      return { ok: false, error: "upstream" };
    }
    return { ok: true };
  } catch (err) {
    console.error("submitApplication:", err);
    return { ok: false, error: controller.signal.aborted ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }
}
