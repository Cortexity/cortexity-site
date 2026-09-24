import { NextResponse } from "next/server";
import { processApplication } from "@/lib/apply";

/**
 * No-JavaScript fallback for the application form: the <form method="post"
 * action="/api/apply"> posts here natively, the same validation + Apps Script
 * call runs, and the visitor is redirected to /apply?sent=1 (thank-you card)
 * or back to /apply?error=… so nothing is silently lost.
 */
export async function POST(req: Request) {
  const formData = await req.formData();
  const result = await processApplication(formData);
  // Redirect back to the origin the visitor used (req.url carries the bind host, e.g. 0.0.0.0, in dev).
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? (req.url.startsWith("https") ? "https" : "http");
  const to = new URL("/apply", host ? `${proto}://${host}` : req.url);
  if (result.ok) to.searchParams.set("sent", "1");
  else to.searchParams.set("error", result.fields?.length ? "fields" : "send");
  return NextResponse.redirect(to, 303);
}
