/**
 * The application form, as data. Shared by the client form (rendering +
 * inline validation) and the server action (validation + payload).
 */

import { isValidPhoneNumber } from "libphonenumber-js";

export const CONTACT_EMAIL = "hello@cortexity.app";

/** Option strings the "qualified" rule depends on (lib/apply.ts). Used verbatim in QUESTIONS below. */
export const BUDGET_YES = "Yes";
export const START_EXPLORING = "I’m just exploring for now";

export type Field =
  | { kind: "textarea"; name: string; label: string; help: string; rows: number; required: boolean; examples?: string[] }
  | { kind: "choice"; name: string; label: string; help?: string; options: string[]; required: boolean };

export const QUESTIONS: Field[] = [
  {
    kind: "textarea",
    name: "idea",
    label: "What’s your app idea?",
    help: "Explain it to me like you would to a friend. What does the app do, and why would someone use it? Feel free to add as much detail as you need to.",
    rows: 6,
    required: true,
    examples: [
      "“An app that shows you available padel courts nearby and lets you book one instantly.”",
      "“An app that lets people in Beirut find and book trusted cleaners for their home.”",
      "“An app that shows you nearby restaurants with last-minute availability and lets you reserve a table.”",
      "“An app for personal trainers to give their clients workouts, track their progress and keep everything in one place.”",
      "“An app where people can find activities and things to do in Lebanon based on where they are and who they’re with.”",
    ],
  },
  {
    kind: "textarea",
    name: "why",
    label: "Why do you want to build this app?",
    help: "Tell me what made you want to build it. Maybe it’s a problem you’ve experienced yourself, something you’ve noticed people struggling with, a business opportunity you’ve spotted, or simply an idea you can’t stop thinking about.",
    rows: 5,
    required: true,
  },
  {
    kind: "textarea",
    name: "users",
    label: "Who will be your users / customers?",
    help: "Tell me about the kind of person who would download this app and why they’d want it.",
    rows: 3,
    required: true,
  },
  {
    kind: "textarea",
    name: "top3",
    label: "What are the 3 most important things someone should be able to do in the app?",
    help: "Don’t worry about every feature. Just tell me the three things that matter to you the most.",
    rows: 4,
    required: true,
  },
  {
    kind: "textarea",
    name: "similar",
    label: "Are there any apps that are similar to what you’re imagining?",
    help: "Share 1–3 apps if you know any. They don’t need to do exactly the same thing. They could have similar features, design, or just something you like about how they work. App names or links are both fine.",
    rows: 3,
    required: false,
  },
  {
    kind: "choice",
    name: "stage",
    label: "Where are you with the idea right now?",
    options: ["It’s mostly an idea", "I’ve done some research or planning", "I have designs or wireframes", "I already have a prototype or app"],
    required: true,
  },
  {
    kind: "choice",
    name: "platforms",
    label: "Which platforms do you want your app built for?",
    options: ["iPhone ($5,000)", "iPhone + Android ($8,000)", "I’m not sure yet"],
    help: "For iPhone + Android, we build your iPhone app first in 21 days, then build the Android version as a second phase.",
    required: true,
  },
  {
    kind: "choice",
    name: "start",
    label: "When would you like to start?",
    options: ["As soon as possible", "Within the next 30 days", "Within 1–3 months", START_EXPLORING],
    required: true,
  },
  {
    kind: "choice",
    name: "budget",
    label: "Cortexity projects start at $5,000. Are you comfortable with that investment?",
    options: [BUDGET_YES, "Potentially, I’d like to discuss it", "Not currently"],
    required: true,
  },
];

export const DETAILS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
] as const;

export const ANYTHING_ELSE: Field = {
  kind: "textarea",
  name: "anything",
  label: "Anything else I should know?",
  help: "If there’s anything else about the idea, business, features, designs, existing work or what you’re trying to achieve, add it here.",
  rows: 4,
  required: false,
};

/** Every field name the form submits, in sheet-column order. */
export const FIELD_ORDER = ["name", "email", "whatsapp", "idea", "why", "users", "top3", "similar", "stage", "platforms", "start", "budget", "anything"] as const;
export type FieldName = (typeof FIELD_ORDER)[number];

export const REQUIRED: FieldName[] = ["idea", "why", "users", "top3", "stage", "platforms", "start", "budget", "name", "email", "whatsapp"]; // form order, so the first error is the top-most

export const MESSAGES = {
  required: "Required",
  email: "Enter a valid email address",
  phone: "Enter a valid WhatsApp number",
  detail: "A little more detail helps me understand. A couple of sentences is enough.",
} as const;

/** Questions that need at least 20 characters. */
const MIN_DETAIL: FieldName[] = ["idea", "why", "top3"];

/** Validates one field; returns an error message or null. */
export function validateField(name: FieldName, raw: string | undefined): string | null {
  const v = (raw ?? "").trim();
  if (REQUIRED.includes(name) && !v) return MESSAGES.required;
  if (!v) return null;
  if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return MESSAGES.email;
  if (name === "whatsapp" && !isValidPhoneNumber(v)) return MESSAGES.phone;
  if (MIN_DETAIL.includes(name) && v.length < 20) return MESSAGES.detail;
  return null;
}

/** Validates every field, in form order, so the first key is the top-most error. */
export function findErrors(values: Record<string, string>): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  for (const name of REQUIRED) {
    const m = validateField(name, values[name]);
    if (m) errors[name] = m;
  }
  return errors;
}
