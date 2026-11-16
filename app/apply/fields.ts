/**
 * The application form, as data. Shared by the client form (rendering +
 * inline validation) and the server (validation + payload).
 *
 * One question per screen: 1 app type → 2 similar apps → 3 stage → 4 platforms → 5 start →
 * 6 budget → 7 occupation → 8 contact details (submits) → 9 Calendly.
 * Copy approved in the "Cortexity: new home page script" doc, section 11.
 */

import { isValidPhoneNumber } from "libphonenumber-js";

export const CONTACT_EMAIL = "joseph@cortexity.studio";

/**
 * Calendly event embedded on the last screen. Name, email and WhatsApp are pre-filled;
 * the sheet's Event ID is passed as utm_content so every booking can be matched to its row.
 */
export const CALENDLY_URL = "https://calendly.com/josephselwan/intro-call";

/** Event id for the booking event (Schedule), shared by Pixel and CAPI so Meta deduplicates them. */
export const bookingEventId = (eventId: string) => `${eventId}.booked`;

/** Minimum length of the app description; below it Continue shows "N characters remaining". */
export const IDEA_MIN = 10;

export const IDEA = {
  name: "idea",
  label: "What type of app do you want to build?",
  placeholder: "What the app does, who it’s for, and the main things people can do in it.",
  examples: [
    "“An app that shows you available padel courts nearby and lets you book one instantly.”",
    "“An app for personal trainers to give their clients workouts, track their progress and keep everything in one place.”",
    "“An app that shows you nearby restaurants with last-minute availability and lets you reserve a table.”",
  ],
} as const;

export const SIMILAR = {
  name: "similar",
  label: "Any apps similar to what you’re imagining?",
  help: "Optional. App names or links.",
} as const;

export const STAGE = {
  name: "stage",
  label: "Where are you with the idea right now?",
  options: ["It’s mostly an idea", "I’ve done research and planning", "I have designs or wireframes", "I already have a prototype or app"],
} as const;

export const PLATFORMS = {
  name: "platforms",
  label: "Which platforms do you want?",
  help: "Choose all that apply.",
  options: ["iPhone", "Android", "Web app", "Not sure yet"],
} as const;

export const START = {
  name: "start",
  label: "When do you want to start?",
  options: ["As soon as possible", "Within 30 days", "In 1 to 3 months", "Just exploring for now"],
} as const;

export const BUDGET = {
  name: "budget",
  label: "What budget do you have in mind?",
  options: ["Under $10,000", "$10,000 to $20,000", "$20,000 to $50,000", "$50,000+"],
} as const;

export const OCCUPATION = {
  name: "occupation",
  label: "What’s your occupation?",
} as const;

export const DETAILS = [
  { name: "firstName", label: "First name", type: "text", autoComplete: "given-name" },
  { name: "lastName", label: "Last name", type: "text", autoComplete: "family-name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
] as const;

/** Single-choice questions, in screen order. */
export const CHOICES = { stage: STAGE, start: START, budget: BUDGET } as const;

/** Every field the form submits. */
export const FIELD_ORDER = ["idea", "similar", "stage", "platforms", "start", "budget", "occupation", "firstName", "lastName", "email", "whatsapp"] as const;
export type FieldName = (typeof FIELD_ORDER)[number];

/** Number of question screens; the calendar is screen FORM_STEPS + 1. */
export const FORM_STEPS = 8;

/** Which screen each field lives on (1-based), so a server-side error can send the visitor back to it. */
export const STEP_OF: Record<FieldName, number> = {
  idea: 1,
  similar: 2,
  stage: 3,
  platforms: 4,
  start: 5,
  budget: 6,
  occupation: 7,
  firstName: 8,
  lastName: 8,
  email: 8,
  whatsapp: 8,
};

/** Separator used to send the multi-select platforms as one value. */
export const LIST_SEP = ", ";

/**
 * Qualified = worth optimising Meta for. Everyone still books a call; only qualified
 * bookings are sent to Meta as Schedule. Not qualified: budget under $10,000 or just exploring.
 */
export function isQualified(values: Record<string, string | undefined>): boolean {
  return values.budget !== BUDGET.options[0] && values.start !== START.options[3];
}

export const MESSAGES = {
  required: "Required",
  choose: "Choose one",
  chooseAny: "Choose at least one",
  email: "Enter a valid email address",
  phone: "Enter a valid WhatsApp number",
} as const;

const remaining = (n: number) => `${n} character${n === 1 ? "" : "s"} remaining`;

const oneOf = (v: string, options: readonly string[]) => options.includes(v);

/** Validates one field given all current values; returns an error message or null. */
export function validateField(name: FieldName, values: Record<string, string | undefined>): string | null {
  const v = (values[name] ?? "").trim();
  switch (name) {
    case "idea":
      return v.length < IDEA_MIN ? remaining(IDEA_MIN - v.length) : null;
    case "similar":
      return null;
    case "stage":
    case "start":
    case "budget":
      return oneOf(v, CHOICES[name].options) ? null : MESSAGES.choose;
    case "platforms": {
      const picked = v.split(LIST_SEP).filter(Boolean);
      return picked.length && picked.every((p) => oneOf(p, PLATFORMS.options)) ? null : MESSAGES.chooseAny;
    }
    case "occupation":
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

/** Validates the fields of the given screens (all by default), in form order, so the first key is the top-most error. */
export function findErrors(values: Record<string, string | undefined>, steps?: number[]): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  for (const name of FIELD_ORDER) {
    if (steps && !steps.includes(STEP_OF[name])) continue;
    const m = validateField(name, values);
    if (m) errors[name] = m;
  }
  return errors;
}
