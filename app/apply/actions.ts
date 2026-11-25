"use server";

import { headers } from "next/headers";
import {
  processApplication,
  processBooking,
  processRaise,
  requestContext,
  type BookingInput,
  type BookingResult,
  type RaiseInput,
  type RaiseResult,
  type SubmitResult,
} from "@/lib/apply";

export type { SubmitResult, BookingResult, RaiseResult };

/** Server action used by the form when JavaScript is running. */
export async function submitApplication(formData: FormData): Promise<SubmitResult> {
  return processApplication(formData, requestContext(await headers()));
}

/** Called when the embedded Calendly reports a booking. */
export async function reportBooking(input: BookingInput): Promise<BookingResult> {
  return processBooking(input, requestContext(await headers()));
}

/** "I can stretch my budget" on the "Less than $5,000" screen. */
export async function raiseBudget(input: RaiseInput): Promise<RaiseResult> {
  return processRaise(input);
}
