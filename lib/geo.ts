/**
 * Visitor country → currency and the A5 "big names".
 *
 * Country comes from Vercel's `x-vercel-ip-country` header. For testing, any
 * landing page accepts `?country=SA|AE|LB|US` to override it (local dev has no
 * geo header, so it falls back to USD).
 *
 * AED and SAR are pegged to the dollar, so the prices are fixed numbers:
 * SAR is the exact conversion (3.75), AED is rounded (3.6725 → 18,500 / 29,500).
 */

export type Country = "SA" | "AE" | "LB" | "OTHER";

export type Locale = {
  country: Country;
  /** Local amounts, e.g. "SAR 18,750". */
  base: string;
  both: string;
  half: string;
  /** "≈ $5,000" style hints, empty for USD visitors. */
  approxBase: string;
  approxBoth: string;
  approxHalf: string;
  /** A5: recognisable shopping apps in the visitor's market. */
  bigNames: string;
  bigOne: string;
};

const USD = { base: "$5,000", both: "$8,000", half: "$2,500" };

const LOCALES: Record<Country, Locale> = {
  SA: {
    country: "SA",
    base: "SAR 18,750",
    both: "SAR 30,000",
    half: "SAR 9,375",
    approxBase: "≈ $5,000",
    approxBoth: "≈ $8,000",
    approxHalf: "≈ $2,500",
    bigNames: "Noon, Namshi and Jarir",
    bigOne: "Noon",
  },
  AE: {
    country: "AE",
    base: "AED 18,500",
    both: "AED 29,500",
    half: "AED 9,250",
    approxBase: "≈ $5,000",
    approxBoth: "≈ $8,000",
    approxHalf: "≈ $2,500",
    bigNames: "Noon, Namshi and Ounass",
    bigOne: "Noon",
  },
  LB: {
    country: "LB",
    ...USD,
    approxBase: "",
    approxBoth: "",
    approxHalf: "",
    bigNames: "ishtari and Karout",
    bigOne: "ishtari",
  },
  OTHER: {
    country: "OTHER",
    ...USD,
    approxBase: "",
    approxBoth: "",
    approxHalf: "",
    bigNames: "Noon and Namshi",
    bigOne: "Noon",
  },
};

function toCountry(code: string | null | undefined): Country | null {
  const c = (code ?? "").trim().toUpperCase();
  if (c === "SA" || c === "AE" || c === "LB") return c;
  if (c) return "OTHER";
  return null;
}

/** Override (`?country=`) wins, then the Vercel geo header, then USD. */
export function getLocale(override: string | string[] | undefined, geoHeader: string | null): Locale {
  const o = Array.isArray(override) ? override[0] : override;
  return LOCALES[toCountry(o) ?? toCountry(geoHeader) ?? "OTHER"];
}

/** "SAR 18,750 (≈ $5,000)" or "$5,000". */
export function withApprox(amount: string, approx: string) {
  return approx ? `${amount} (${approx})` : amount;
}

/** Fills the copy placeholders: {price}, {price8}, {half}, {big names}, {bigOne}. */
export function fill(text: string, loc: Locale) {
  return text
    .replaceAll("{price}", withApprox(loc.base, loc.approxBase))
    .replaceAll("{price8}", withApprox(loc.both, loc.approxBoth))
    .replaceAll("{half}", withApprox(loc.half, loc.approxHalf))
    .replaceAll("{big names}", loc.bigNames)
    .replaceAll("{bigOne}", loc.bigOne);
}
