"use server";

import { headers } from "next/headers";
import { processApplication, processBooking, requestContext, type BookingInput, type BookingResult, type SubmitResult } from "@/lib/apply";

export type { SubmitResult, BookingResult };

/** Server action used by the form when JavaScript is running. */
export async function submitApplication(formData: FormData): Promise<SubmitResult> {
  return processApplication(formData, requestContext(await headers()));
}

/** Called when the embedded Calendly reports a booking. */
export async function reportBooking(input: BookingInput): Promise<BookingResult> {
  return processBooking(input, requestContext(await headers()));
}
