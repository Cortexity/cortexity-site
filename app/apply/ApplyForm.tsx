"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { P } from "@/components/Text";
import { submitApplication } from "./actions";
import { ANYTHING_ELSE, CONTACT_EMAIL, DETAILS, findErrors, MESSAGES, QUESTIONS, validateField, type Field, type FieldName } from "./fields";

const NOTE = "I personally review every application.";

/* ---------- primitives ---------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[24px] border border-[#e5e5ea] bg-white p-7 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:p-9 ${className}`}>
      {children}
    </div>
  );
}

function Question({ n, label, help, htmlFor }: { n?: number; label: string; help?: string; htmlFor?: string }) {
  return (
    <>
      <h2 className="text-h3">
        {n ? <span className="accent mr-2">{n}.</span> : null}
        {htmlFor ? <label htmlFor={htmlFor}>{label}</label> : label}
      </h2>
      {help ? <P className="mt-3 max-w-prose">{help}</P> : null}
    </>
  );
}

function ErrorLine({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-small font-medium text-red">{message}</p> : null;
}

const FIELD =
  "block w-full rounded-[14px] border bg-[#f5f5f7] px-4 py-3.5 text-[16px] leading-[1.5] text-ink outline-none transition-colors placeholder:text-[#a1a1a6] focus:border-[#1d1d1f]";
const border = (bad: boolean) => (bad ? "border-red" : "border-[#e5e5ea]");

function Textarea({ f, bad }: { f: Extract<Field, { kind: "textarea" }>; bad: boolean }) {
  return (
    <textarea
      id={f.name}
      name={f.name}
      rows={f.rows}
      aria-invalid={bad || undefined}
      className={`${FIELD} ${border(bad)} mt-5 resize-y`}
    />
  );
}

function Choice({ f, bad }: { f: Extract<Field, { kind: "choice" }>; bad: boolean }) {
  return (
    <fieldset className="mt-5" aria-invalid={bad || undefined}>
      <legend className="sr-only">{f.label}</legend>
      <div className={`flex flex-wrap gap-2.5 ${bad ? "rounded-[18px] outline outline-1 outline-offset-4 outline-red" : ""}`}>
        {f.options.map((o) => (
          <label key={o} className="cursor-pointer">
            <input type="radio" name={f.name} value={o} className="peer sr-only" />
            <span className="inline-flex min-h-11 items-center rounded-pill border border-transparent bg-[#f5f5f7] px-5 text-[16px] font-medium text-ink transition-colors peer-checked:bg-[#1d1d1f] peer-checked:text-white peer-focus-visible:border-[#1d1d1f] hover:bg-[#ebebef] peer-checked:hover:bg-[#1d1d1f]">
              {o}
            </span>
          </label>
        ))}
      </div>
      {f.help ? <P className="mt-4 max-w-prose text-small">{f.help}</P> : null}
    </fieldset>
  );
}

function Examples({ lines }: { lines: string[] }) {
  return (
    <details className="qa group mt-4">
      <summary className="inline-flex items-center gap-2 text-small font-medium text-ink">
        <span aria-hidden="true" className="qa-glyph flex h-6 w-6 items-center justify-center rounded-full bg-[#f5f5f7] text-[#6e6e73] transition-colors group-hover:text-red">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        Examples
      </summary>
      <ul className="qa-body mt-3 space-y-2 pl-8">
        {lines.map((l) => (
          <li key={l} className="text-small text-ink-muted">
            {l}
          </li>
        ))}
      </ul>
    </details>
  );
}

/* ---------- the form ---------- */

export function ApplyForm({ initialDone = false, initialError }: { initialDone?: boolean; initialError?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const submitting = useRef(false);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [phone, setPhone] = useState<string | undefined>();
  const [failed, setFailed] = useState(initialError === "send");
  const [done, setDone] = useState(initialDone);
  const [pending, startTransition] = useTransition();

  // Errors clear the moment a field becomes valid, without waiting for the next submit.
  const revalidate = (name: FieldName, value: string) =>
    setErrors((prev) => {
      if (!(name in prev)) return prev;
      const m = validateField(name, value);
      if (m === prev[name]) return prev;
      const next = { ...prev };
      if (m) next[name] = m;
      else delete next[name];
      return next;
    });
  const onInput = (e: React.FormEvent<HTMLFormElement>) => {
    const t = e.target as HTMLInputElement | HTMLTextAreaElement;
    if (t?.name && t.name !== "whatsapp") revalidate(t.name as FieldName, t.value);
  };

  useEffect(() => {
    if (!done) return;
    doneRef.current?.scrollIntoView({ block: "start" });
    doneRef.current?.focus({ preventScroll: true });
  }, [done]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting.current) return; // no double submit
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("whatsapp", phone ?? ""); // the library's state is E.164; the visible input holds the formatted text
    const values: Record<string, string> = {};
    fd.forEach((v, k) => (values[k] = String(v)));
    const found = findErrors(values);
    if (values.whatsapp && !isValidPhoneNumber(values.whatsapp)) found.whatsapp = MESSAGES.phone;
    setErrors(found);
    setFailed(false);
    const firstBad = Object.keys(found)[0];
    if (firstBad) {
      const first = form.querySelector<HTMLElement>(`[data-field="${firstBad}"]`);
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      (first?.querySelector("textarea, input:not([type=hidden])") as HTMLElement | null)?.focus({ preventScroll: true });
      return;
    }
    submitting.current = true;
    startTransition(async () => {
      try {
        const res = await submitApplication(fd);
        if (res.ok) {
          setDone(true);
        } else {
          if (res.fields?.length) setErrors(Object.fromEntries(res.fields.map((f) => [f, MESSAGES.required])));
          setFailed(true);
        }
      } finally {
        submitting.current = false;
      }
    });
  };

  if (done) {
    return (
      <Card className="scroll-mt-28 text-center">
        <h2 ref={doneRef} tabIndex={-1} className="text-h2 outline-none">
          Got it.
        </h2>
        <P className="mx-auto mt-5 max-w-prose">
          I’ll read your application myself and reply within 48 hours. If it’s a fit, we’ll set up a call.
        </P>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-pill bg-[#1d1d1f] px-7 text-[1rem] font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
        >
          Back to Cortexity
        </Link>
      </Card>
    );
  }

  return (
    <form ref={formRef} method="post" action="/api/apply" onSubmit={onSubmit} onInput={onInput} noValidate className="relative space-y-5">
      {initialError === "fields" ? (
        <p role="alert" className="text-center text-small font-medium text-red">
          Please complete every required question, then submit again.
        </p>
      ) : null}
      {QUESTIONS.map((f, i) => {
        const n = i + 1;
        const bad = f.name in errors;
        return (
          <Card key={f.name} className="scroll-mt-28">
            <div data-field={f.name}>
              <Question n={n} label={f.label} help={f.kind === "textarea" ? f.help : undefined} htmlFor={f.kind === "textarea" ? f.name : undefined} />
              {f.kind === "textarea" && f.examples ? <Examples lines={f.examples} /> : null}
              {f.kind === "textarea" ? <Textarea f={f} bad={bad} /> : <Choice f={f} bad={bad} />}
              <ErrorLine message={errors[f.name as FieldName]} />
            </div>
          </Card>
        );
      })}

      <Card>
        <h2 className="text-h3">Your details</h2>
        <div className="mt-5 space-y-5">
          {DETAILS.map((d) => {
            const bad = d.name in errors;
            return (
              <div key={d.name} data-field={d.name}>
                <label htmlFor={d.name} className="block text-[15px] font-medium text-ink">
                  {d.label}
                </label>
                <input
                  id={d.name}
                  name={d.name}
                  type={d.type}
                  autoComplete={d.autoComplete}
                  aria-invalid={bad || undefined}
                  className={`${FIELD} ${border(bad)} mt-2`}
                />
                <ErrorLine message={errors[d.name]} />
              </div>
            );
          })}
          <div data-field="whatsapp">
            <label htmlFor="whatsapp" className="block text-[15px] font-medium text-ink">
              WhatsApp number
            </label>
            {/* Country selector + number; the value is E.164 (e.g. +96170123456) and is what the sheet receives. */}
            <PhoneInput
              id="whatsapp"
              name="whatsapp"
              international
              withCountryCallingCode
              countryCallingCodeEditable={false}
              defaultCountry="LB"
              value={phone}
              onChange={(v) => {
                setPhone(v);
                revalidate("whatsapp", v ?? "");
              }}
              className={`phone-field ${border("whatsapp" in errors)} mt-2`}
              numberInputProps={{ autoComplete: "tel", "aria-invalid": "whatsapp" in errors || undefined }}
            />
            <ErrorLine message={errors.whatsapp} />
          </div>
        </div>
      </Card>

      <Card>
        <div data-field={ANYTHING_ELSE.name}>
          <Question n={QUESTIONS.length + 1} label={ANYTHING_ELSE.label} help={ANYTHING_ELSE.kind === "textarea" ? ANYTHING_ELSE.help : undefined} htmlFor={ANYTHING_ELSE.name} />
          {ANYTHING_ELSE.kind === "textarea" ? <Textarea f={ANYTHING_ELSE} bad={false} /> : null}
        </div>
      </Card>

      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending || undefined}
          className="inline-flex min-h-14 w-full items-center justify-center rounded-pill bg-red px-9 text-[1.0625rem] font-medium tracking-[-0.01em] text-white shadow-[0_10px_30px_rgba(224,32,26,0.35)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 md:w-auto"
        >
          {pending ? "Sending…" : "Submit Your Application"}
        </button>
        <span className="text-center text-[0.8125rem] text-ink-muted">{NOTE}</span>
        {failed ? (
          <p role="alert" className="mt-1 text-center text-small font-medium text-red">
            Something went wrong. Please email me at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>{" "}
            instead.
          </p>
        ) : null}
      </div>
    </form>
  );
}
