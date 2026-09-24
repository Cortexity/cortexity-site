"use server";

import { processApplication, type SubmitResult } from "@/lib/apply";

export type { SubmitResult };

/** Server action used by the form when JavaScript is running. */
export async function submitApplication(formData: FormData): Promise<SubmitResult> {
  return processApplication(formData);
}
