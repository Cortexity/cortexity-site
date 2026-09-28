/**
 * Form debug logging (testing only). Every debug log in the app goes through
 * this file, so turning the feature off for good is a one-line change:
 * make DEBUG_FORM `false`.
 *
 * NEXT_PUBLIC_DEBUG_FORM is inlined into the browser bundle at build time and
 * read at runtime on the server. Anything other than "true" logs nothing.
 */
export const DEBUG_FORM = process.env.NEXT_PUBLIC_DEBUG_FORM === "true";

/** Long free-text answers are cut to 20 characters in logs. */
const LONG_TEXT = ["idea", "why", "top3", "anything"];
const cut = (v: string) => (v.length > 20 ? `${v.slice(0, 20)}…` : v);

/** Copy of a form payload that is safe-ish to print while testing. */
export function forLog(values: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(values)) {
    if (k === "secret" || k === "access_token") continue; // never printed
    out[k] = LONG_TEXT.includes(k) && typeof v === "string" ? cut(v) : v;
  }
  return out;
}

export function debugLog(label: string, data: unknown) {
  if (!DEBUG_FORM) return;
  console.log(`[form-debug] ${label}`, data);
}
