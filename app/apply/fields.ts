/**
 * The application form, as data. Shared by the client form (rendering +
 * inline validation) and the server (validation + payload).
 *
 * Four screens: 1 idea → 2 occupation → 3 contact details (submits) → 4 Calendly.
 */

import { isValidPhoneNumber } from "libphonenumber-js";

export const CONTACT_EMAIL = "hello@cortexity.app";

/**
 * Calendly event embedded on the last screen. Name, email and WhatsApp are pre-filled;
 * the sheet's Event ID is passed as utm_content so every booking can be matched to its row.
 */
export const CALENDLY_URL = "https://calendly.com/josephselwan/intro-call";

/** Event id for the booking events (Schedule + QualifiedLead), shared by Pixel and CAPI so Meta deduplicates them. */
export const bookingEventId = (eventId: string) => `${eventId}.booked`;

export const IDEA = {
  name: "idea",
  label: "What’s your app idea?",
  help: "Explain it like you would to a friend. What does the app do, and why would someone use it? A couple of sentences is enough.",
  examples: [
    "“An app that shows you available padel courts nearby and lets you book one instantly.”",
    "“An app for personal trainers to give their clients workouts, track their progress and keep everything in one place.”",
    "“An app that shows you nearby restaurants with last-minute availability and lets you reserve a table.”",
  ],
} as const;

export const OTHER = "Other";

export const OCCUPATION = {
  name: "occupation",
  label: "What do you do?",
  help: "Pick the one closest to you.",
  options: [
    "Fitness coach",
    "Content creator",
    "Tutor or teacher",
    "Salon or beauty owner",
    "Brand or shop owner",
    "Founder or entrepreneur",
    OTHER,
  ],
} as const;

export const DETAILS = [
  { name: "firstName", label: "First name", type: "text", autoComplete: "given-name" },
  { name: "lastName", label: "Last name", type: "text", autoComplete: "family-name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
] as const;

/** Every field the form submits. `occupationOther` is the text typed after choosing "Other". */
export const FIELD_ORDER = ["idea", "occupation", "occupationOther", "firstName", "lastName", "email", "whatsapp"] as const;
export type FieldName = (typeof FIELD_ORDER)[number];

/** Which screen each field lives on (1-based), so a server-side error can send the visitor back to it. */
export const STEP_OF: Record<FieldName, 1 | 2 | 3> = {
  idea: 1,
  occupation: 2,
  occupationOther: 2,
  firstName: 3,
  lastName: 3,
  email: 3,
  whatsapp: 3,
};

export const MESSAGES = {
  required: "Required",
  choose: "Choose one",
  email: "Enter a valid email address",
  phone: "Enter a valid WhatsApp number",
  detail: "A little more detail helps me understand. A couple of sentences is enough.",
} as const;

/** Validates one field given all current values; returns an error message or null. */
export function validateField(name: FieldName, values: Record<string, string | undefined>): string | null {
  const v = (values[name] ?? "").trim();
  switch (name) {
    case "idea":
      if (!v) return MESSAGES.required;
      return v.length < 20 ? MESSAGES.detail : null;
    case "occupation":
      return (OCCUPATION.options as readonly string[]).includes(v) ? null : MESSAGES.choose;
    case "occupationOther":
      return (values.occupation ?? "").trim() === OTHER && !v ? MESSAGES.required : null;
    case "firstName":
    case "lastName":
      return v ? null : MESSAGES.required;
    case "email":
      if (!v) return MESSAGES.required;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : MESSAGES.email;
    case "whatsapp":
      if (!v) return MESSAGES.required;
      return isValidPhoneNumber(v) ? null : MESSAGES.phone;
  }
}

/** Validates the fields of the given steps (all by default), in form order, so the first key is the top-most error. */
export function findErrors(values: Record<string, string | undefined>, steps: number[] = [1, 2, 3]): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  for (const name of FIELD_ORDER) {
    if (!steps.includes(STEP_OF[name])) continue;
    const m = validateField(name, values);
    if (m) errors[name] = m;
  }
  return errors;
}

/** The value stored in the sheet's Occupation column: the chip, or "Other: <what they typed>". */
export function occupationValue(occupation: string, other: string) {
  return occupation === OTHER ? `${OTHER}: ${other.trim()}` : occupation;
}
