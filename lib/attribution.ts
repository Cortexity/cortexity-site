/**
 * First-party attribution capture (browser only).
 * On the first visit that carries fbclid / utm_* (or the very first visit at all),
 * store them with the landing URL in the `cx_attr` cookie for 30 days.
 */

const COOKIE = "cx_attr";
const MAX_AGE = 60 * 60 * 24 * 30;
const KEYS = ["fbclid", "utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

export type Attribution = Partial<Record<(typeof KEYS)[number] | "landing_url" | "ts", string>>;

function readCookie(name: string): string {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
}

export function readAttribution(): Attribution {
  try {
    return JSON.parse(readCookie(COOKIE) || "{}");
  } catch {
    return {};
  }
}

export function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const fresh: Attribution = {};
  for (const k of KEYS) {
    const v = params.get(k);
    if (v) fresh[k] = v.slice(0, 500);
  }
  const existing = readCookie(COOKIE);
  // Keep the first touch; a new ad click (fbclid / utm) replaces it.
  if (existing && !Object.keys(fresh).length) return;
  const value: Attribution = { ...fresh, landing_url: window.location.href.slice(0, 1000), ts: String(Date.now()) };
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
}

/** Hidden-field values sent with the application. */
export function attributionFields(): Record<string, string> {
  const a = readAttribution();
  let fbc = readCookie("_fbc");
  // No _fbc cookie yet but we saw an fbclid: build it in Meta's format.
  if (!fbc && a.fbclid) fbc = `fb.1.${a.ts ?? Date.now()}.${a.fbclid}`;
  return {
    fbp: readCookie("_fbp"),
    fbc,
    fbclid: a.fbclid ?? "",
    utm_source: a.utm_source ?? "",
    utm_medium: a.utm_medium ?? "",
    utm_campaign: a.utm_campaign ?? "",
    utm_content: a.utm_content ?? "",
    landing_url: a.landing_url ?? "",
    event_source_url: window.location.href,
  };
}

export const ATTRIBUTION_FIELDS = ["fbp", "fbc", "fbclid", "utm_source", "utm_medium", "utm_campaign", "utm_content", "landing_url", "event_source_url"] as const;
