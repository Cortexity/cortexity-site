"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import PhoneInput, { isSupportedCountry, isValidPhoneNumber, type Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { ATTRIBUTION_FIELDS, attributionFields } from "@/lib/attribution";
import { debugLog, forLog } from "@/lib/debug";
import { track } from "@/lib/pixel";
import { reportBooking, submitApplication } from "./actions";
import {
  bookingEventId,
  BUDGET,
  CALENDLY_URL,
  CONTACT_EMAIL,
  DETAILS,
  findErrors,
  FORM_STEPS,
  IDEA,
  LIST_SEP,
  MESSAGES,
  OCCUPATION,
  PLATFORMS,
  SIMILAR,
  STAGE,
  START,
  STEP_OF,
  validateField,
  type FieldName,
} from "./fields";

/**
 * /apply, one question per screen: 1 app type → 2 similar apps → 3 stage → 4 platforms → 5 start →
 * 6 budget → 7 occupation → 8 contact (submits: sheet row + Lead) → 9 Calendly
 * (booking: Booked = Yes; Schedule to Meta only when qualified).
 *
 * All form screens are always in the DOM. With JavaScript only the active one is shown
 * (`html.js .apply-step:not([data-active])` is hidden in globals.css); without it they stack and
 * the form posts natively to /api/apply, which redirects to /apply?sent=1 with a Calendly link.
 * Single-choice screens move on as soon as an option is tapped.
 */

const CAL = FORM_STEPS + 1;
const STEPS = CAL;
const NOTE = "I personally review every application.";
type Step = number;

/* ---------- primitives ---------- */

const CARD = "rounded-[28px] border border-[#e5e5ea] bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:p-10";
const FIELD =
  "block w-full rounded-[14px] border bg-[#f5f5f7] px-4 py-3.5 text-[16px] leading-[1.5] text-ink outline-none transition-colors placeholder:text-[#a1a1a6] focus:border-[#1d1d1f]";
const border = (bad: boolean) => (bad ? "border-red" : "border-[#e5e5ea]");
const TITLE = "text-[clamp(1.75rem,1.35rem+1.7vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-ink outline-none";
const PRIMARY =
  "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-pill bg-red px-9 text-[1.0625rem] font-medium tracking-[-0.01em] text-white shadow-[0_10px_30px_rgba(224,32,26,0.3)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto sm:min-w-[14rem]";

function ErrorLine({ message, id }: { message?: string; id?: string }) {
  return message ? (
    <p id={id} className="mt-2 text-small font-medium text-red">
      {message}
    </p>
  ) : null;
}

function Help({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 max-w-prose text-[1.0625rem] leading-[1.5] text-ink-muted">{children}</p>;
}

function Arrow() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Examples({ lines }: { lines: readonly string[] }) {
  return (
    <details className="qa group mt-4">
      <summary className="inline-flex cursor-pointer items-center gap-2 text-small font-medium text-ink">
        <span aria-hidden="true" className="qa-glyph flex h-6 w-6 items-center justify-center rounded-full bg-[#f5f5f7] text-[#6e6e73] transition-colors group-hover:text-red">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        See examples
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

/** JS-only Continue button under a question screen. */
function Continue({ onClick }: { onClick: () => void }) {
  return (
    <div className="js-only mt-8 flex justify-end">
      <button type="button" onClick={onClick} className={PRIMARY}>
        Continue <Arrow />
      </button>
    </div>
  );
}

/** Back button + "Step n of 9" + a segmented bar. JS only. */
function Progress({ step, onBack }: { step: Step; onBack?: () => void }) {
  return (
    <div className="js-only mb-5 sm:mb-6">
      <div className="flex h-10 items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="-ml-2 inline-flex h-10 items-center gap-1 rounded-pill px-2 text-[15px] font-medium text-ink transition-colors hover:text-red"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        ) : (
          <span />
        )}
        <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-muted" aria-live="polite">
          Step {step} of {STEPS}
        </span>
      </div>
      <div className="mt-3 grid gap-1" style={{ gridTemplateColumns: `repeat(${STEPS}, minmax(0, 1fr))` }} aria-hidden="true">
        {Array.from({ length: STEPS }, (_, i) => (
          <span key={i} className="h-1 overflow-hidden rounded-full bg-[#e5e5ea]">
            <span className={`block h-full rounded-full bg-red transition-[width] duration-500 ease-out ${i < step ? "w-full" : "w-0"}`} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- choice cards ---------- */

/** Large tappable option cards: radios (single choice) or checkboxes (multi). Native inputs, so they post without JS. */
function Choices({
  name,
  options,
  multiple = false,
  onPick,
}: {
  name: string;
  options: readonly string[];
  multiple?: boolean;
  onPick?: () => void;
}) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-3" role={multiple ? "group" : "radiogroup"}>
      {options.map((o) => (
        <label
          key={o}
          className="flex cursor-pointer items-center gap-4 rounded-[16px] border border-[#e5e5ea] bg-[#f5f5f7] px-5 py-4 text-[17px] font-medium text-ink transition-colors hover:border-[#c7c7cc] has-[:checked]:border-red has-[:checked]:bg-[rgba(224,32,26,0.06)]"
        >
          <input
            type={multiple ? "checkbox" : "radio"}
            name={name}
            value={o}
            onChange={onPick}
            className={`h-5 w-5 shrink-0 accent-[#e0201a] ${multiple ? "rounded" : ""}`}
          />
          {o}
        </label>
      ))}
    </div>
  );
}

/* ---------- Calendly ---------- */

type CalendlyApi = {
  initInlineWidget: (o: {
    url: string;
    parentElement: HTMLElement;
    prefill?: Record<string, unknown>;
    utm?: Record<string, string>;
    resize?: boolean;
  }) => void;
};
declare global {
  interface Window {
    Calendly?: CalendlyApi;
  }
}

const CALENDLY_JS = "https://assets.calendly.com/assets/external/widget.js";

function CalendlyEmbed({
  prefill,
  eventId,
  onBooked,
}: {
  prefill: { firstName: string; lastName: string; email: string; whatsapp: string };
  eventId: string;
  onBooked: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(() => typeof window !== "undefined" && !!window.Calendly);
  const booked = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!loaded || !el || !window.Calendly) return;
    el.innerHTML = "";
    window.Calendly.initInlineWidget({
      url: CALENDLY_URL,
      parentElement: el,
      prefill: {
        name: `${prefill.firstName} ${prefill.lastName}`.trim(),
        firstName: prefill.firstName,
        lastName: prefill.lastName,
        email: prefill.email,
        // Calendly's first custom question (set it up as "WhatsApp number"); ignored if there is none.
        customAnswers: { a1: prefill.whatsapp },
      },
      // Lets every booking be matched to its sheet row (Calendly → booking → Tracking: utm_content = Event ID).
      utm: { utmSource: "cortexity.studio", utmMedium: "apply", utmContent: eventId },
      resize: true, // the embed grows to its content (no scroll-inside-scroll on phones)
    });
  }, [loaded, prefill.firstName, prefill.lastName, prefill.email, prefill.whatsapp, eventId]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return;
      const name = (e.data as { event?: string } | null)?.event;
      if (name === "calendly.event_scheduled" && !booked.current) {
        booked.current = true;
        onBooked();
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onBooked]);

  return (
    <>
      <Script src={CALENDLY_JS} strategy="afterInteractive" onReady={() => setLoaded(true)} />
      <div ref={ref} className="calendly-embed -mx-6 mt-4 min-h-[680px] sm:-mx-8">
        <div className="flex h-40 items-center justify-center text-small text-ink-muted">Loading calendar…</div>
      </div>
      <noscript>
        <a href={CALENDLY_URL} className="underline">
          Open the calendar
        </a>
      </noscript>
    </>
  );
}

/* ---------- the form ---------- */

export function ApplyForm({
  initialDone = false,
  initialError,
  defaultCountry = "US",
}: {
  initialDone?: boolean;
  initialError?: string;
  defaultCountry?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const headings = useRef<Partial<Record<Step, HTMLElement | null>>>({});
  const submitting = useRef(false);
  const firstRender = useRef(true);

  const [step, setStep] = useState<Step>(1);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [phone, setPhone] = useState<string | undefined>();
  const [failed, setFailed] = useState(initialError === "send");
  const [lead, setLead] = useState<{
    eventId: string;
    bookingToken: string;
    qualified: boolean;
    firstName: string;
    lastName: string;
    email: string;
    whatsapp: string;
  } | null>(null);
  const [booked, setBooked] = useState(false);
  const [pending, startTransition] = useTransition();
  const country: Country = isSupportedCountry(defaultCountry) ? (defaultCountry as Country) : "US";

  // ViewContent once per visit; hidden attribution fields filled for the no-JS-post path too.
  const viewed = useRef(false);
  useEffect(() => {
    if (!viewed.current) {
      viewed.current = true;
      track("ViewContent");
    }
    try {
      const form = formRef.current;
      for (const [k, v] of Object.entries(attributionFields())) {
        const el = form?.elements.namedItem(k);
        if (el instanceof HTMLInputElement) el.value = v;
      }
    } catch {}
  }, []);

  /* --- browser Back / Forward moves between screens --- */
  useEffect(() => {
    try {
      history.replaceState({ ...history.state, applyStep: 1 }, "");
    } catch {}
    const onPop = (e: PopStateEvent) => {
      const s = (e.state?.applyStep ?? 1) as Step;
      // After submitting, the form screens are done: stay on the calendar.
      setStep((cur) => (cur === CAL ? CAL : s >= 1 && s <= FORM_STEPS ? s : 1));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const goTo = useCallback((s: Step, push = true) => {
    setStep(s);
    if (push) {
      try {
        history.pushState({ ...history.state, applyStep: s }, "");
      } catch {}
    }
  }, []);

  // On every screen change: bring the card into view and move focus to the new screen.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Each screen starts at the top, like a new screen in an app.
    if (window.scrollY > 0) window.scrollTo({ top: 0 });
    const desktop = window.matchMedia("(pointer: fine)").matches;
    const firstId = step === 2 ? "#similar" : step === 7 ? "#occupation" : step === FORM_STEPS ? "#firstName" : null;
    const firstInput = firstId && desktop ? formRef.current?.querySelector<HTMLInputElement>(firstId) : null;
    (firstInput ?? headings.current[step])?.focus({ preventScroll: true });
  }, [step, booked]);

  const values = () => {
    const fd = new FormData(formRef.current ?? undefined);
    const v: Record<string, string> = {};
    fd.forEach((val, k) => (v[k] = String(val)));
    v.platforms = fd.getAll("platforms").map(String).join(LIST_SEP);
    v.whatsapp = phone ?? "";
    return v;
  };

  // Errors clear the moment a field becomes valid, without waiting for the next Continue.
  const revalidate = (name: FieldName, override?: Record<string, string>) =>
    setErrors((prev) => {
      if (!(name in prev)) return prev;
      const m = validateField(name, { ...values(), ...override });
      if (m === prev[name]) return prev;
      const next = { ...prev };
      if (m) next[name] = m;
      else delete next[name];
      return next;
    });
  const onInput = (e: React.FormEvent<HTMLFormElement>) => {
    const t = e.target as HTMLInputElement | HTMLTextAreaElement;
    if (!t?.name || t.name === "whatsapp" || !(t.name in STEP_OF)) return;
    if (t.type === "radio" || t.type === "checkbox") {
      revalidate(t.name as FieldName);
      return;
    }
    // The idea's "N characters remaining" only shows after Continue; typing clears it.
    if (t.name === "idea")
      setErrors((prev) => {
        if (!prev.idea) return prev;
        const next = { ...prev };
        delete next.idea;
        return next;
      });
    else revalidate(t.name as FieldName);
  };

  /** Validates one screen; focuses the first bad field. */
  const check = (s: number) => {
    const found = findErrors(values(), [s]);
    setErrors((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(STEP_OF) as FieldName[]) if (STEP_OF[k] === s) delete next[k];
      return { ...next, ...found };
    });
    const firstBad = Object.keys(found)[0];
    if (firstBad) {
      const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${firstBad}"]`);
      (el?.querySelector("textarea, input:not([type=hidden])") as HTMLElement | null)?.focus({ preventScroll: true });
      return false;
    }
    return true;
  };

  const next = (s: number) => {
    if (check(s)) goTo(s + 1);
  };
  /** Single choice: move on right after the tap, so the selection is seen for a moment. */
  const pickNext = (s: number) => window.setTimeout(() => next(s), 220);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < FORM_STEPS) return next(step); // Enter on an earlier screen = Continue
    if (step !== FORM_STEPS || submitting.current) return;
    if (!check(FORM_STEPS)) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("whatsapp", phone ?? ""); // the library's state is E.164; the visible input holds the formatted text
    fd.set("platforms", fd.getAll("platforms").map(String).join(LIST_SEP)); // one joined value
    try {
      // _fbp / _fbc / avatar are read now, at submit time, so a pixel that loaded late is still captured.
      for (const [k, v] of Object.entries(attributionFields())) fd.set(k, v);
    } catch {}
    const all = findErrors(Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)])));
    const firstBad = Object.keys(all)[0] as FieldName | undefined;
    if (firstBad) {
      setErrors(all);
      goTo(STEP_OF[firstBad]);
      return;
    }
    if (phone && !isValidPhoneNumber(phone)) {
      setErrors({ whatsapp: MESSAGES.phone });
      return;
    }
    debugLog("browser payload", forLog(Object.fromEntries(fd.entries())));
    submitting.current = true;
    setFailed(false);
    startTransition(async () => {
      try {
        const res = await submitApplication(fd);
        if (res.ok) {
          // Same eventID as the server's Conversions API Lead, so Meta deduplicates them.
          track("Lead", {}, res.eventId);
          setLead({
            eventId: res.eventId,
            bookingToken: res.bookingToken,
            qualified: res.qualified,
            firstName: String(fd.get("firstName") ?? "").trim(),
            lastName: String(fd.get("lastName") ?? "").trim(),
            email: String(fd.get("email") ?? "").trim(),
            whatsapp: res.whatsapp || phone || "",
          });
          // Replace, so browser Back from the calendar leaves /apply instead of resubmitting.
          setStep(CAL);
          try {
            history.replaceState({ ...history.state, applyStep: CAL }, "");
          } catch {}
        } else if (res.fields?.length) {
          const errs = Object.fromEntries(res.fields.map((f) => [f, validateField(f, values()) ?? MESSAGES.required]));
          setErrors(errs);
          goTo(Math.min(...res.fields.map((f) => STEP_OF[f])));
        } else {
          setFailed(true);
        }
      } catch {
        setFailed(true);
      } finally {
        submitting.current = false;
      }
    });
  };

  const onBooked = useCallback(() => {
    if (!lead) return;
    // Only qualified bookings reach Meta (Pixel here, CAPI on the server), so they alone train the ads.
    if (lead.qualified) track("Schedule", {}, bookingEventId(lead.eventId));
    setBooked(true);
    let tracking: Record<string, string> = {};
    try {
      tracking = attributionFields();
    } catch {}
    reportBooking({
      eventId: lead.eventId,
      bookingToken: lead.bookingToken,
      qualified: lead.qualified,
      email: lead.email,
      whatsapp: lead.whatsapp,
      fbp: tracking.fbp,
      fbc: tracking.fbc,
      eventSourceUrl: tracking.event_source_url,
    }).catch(() => {});
  }, [lead]);

  /* ---------- no-JS thank-you (redirect from /api/apply) ---------- */
  if (initialDone) {
    return (
      <div className={`${CARD} text-center`}>
        <h2 className={TITLE}>Got it. One last step.</h2>
        <Help>Pick a time for a short call and we’ll talk through your idea.</Help>
        <a href={CALENDLY_URL} className={`${PRIMARY} mt-8`}>
          Pick a time <Arrow />
        </a>
      </div>
    );
  }

  /* ---------- calendar screen: booked ---------- */
  if (step === CAL && booked && lead) {
    return (
      <div ref={topRef} className="apply-step scroll-mt-28" data-active="">
        <div className={`${CARD} text-center`}>
          <span aria-hidden="true" className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f5f7] text-red">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2 ref={(el) => void (headings.current[CAL] = el)} tabIndex={-1} className={`${TITLE} mt-6`}>
            You’re booked, {lead.firstName}.
          </h2>
          <Help>
            The invite is on its way to {lead.email}. I’ll read your idea before we talk.
          </Help>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-pill bg-[#1d1d1f] px-7 text-[1rem] font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
          >
            Back to Cortexity
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- calendar ---------- */
  if (step === CAL && lead) {
    return (
      <div ref={topRef} className="apply-step scroll-mt-28" data-active="">
        <Progress step={CAL} />
        <div className={CARD}>
          <h2 ref={(el) => void (headings.current[CAL] = el)} tabIndex={-1} className={TITLE}>
            Pick a time for a call.
          </h2>
          <Help>Thanks, {lead.firstName}. Your application is in. Choose a time below and we’ll talk through your idea.</Help>
          <CalendlyEmbed prefill={lead} eventId={lead.eventId} onBooked={onBooked} />
        </div>
      </div>
    );
  }

  /* ---------- 1–3: the form ---------- */
  const bad = (n: FieldName) => n in errors;
  return (
    <div ref={topRef} className="scroll-mt-28">
      <Progress step={step} onBack={step > 1 ? () => history.back() : undefined} />
      <form ref={formRef} method="post" action="/api/apply" onSubmit={onSubmit} onInput={onInput} noValidate className={`${CARD} relative`}>
        {initialError === "fields" ? (
          <p role="alert" className="mb-6 text-small font-medium text-red">
            Please complete every required question, then submit again.
          </p>
        ) : null}

        {/* 1. App type */}
        <section className="apply-step" data-active={step === 1 ? "" : undefined}>
          <div data-field="idea">
            <h2 ref={(el) => void (headings.current[1] = el)} tabIndex={-1} className={TITLE}>
              <label htmlFor="idea">{IDEA.label}</label>
            </h2>
            <Examples lines={IDEA.examples} />
            <textarea
              id="idea"
              name="idea"
              rows={5}
              aria-invalid={bad("idea") || undefined}
              aria-describedby={bad("idea") ? "idea-error" : undefined}
              placeholder={IDEA.placeholder}
              className={`${FIELD} ${border(bad("idea"))} mt-5 resize-y`}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  next(1);
                }
              }}
            />
            <ErrorLine id="idea-error" message={errors.idea} />
          </div>
          <Continue onClick={() => next(1)} />
        </section>

        {/* 2. Similar apps (optional) */}
        <section className="apply-step" data-active={step === 2 ? "" : undefined}>
          <div data-field="similar">
            <h2 ref={(el) => void (headings.current[2] = el)} tabIndex={-1} className={TITLE}>
              <label htmlFor="similar">{SIMILAR.label}</label>
            </h2>
            <Help>{SIMILAR.help}</Help>
            <input id="similar" name="similar" type="text" autoComplete="off" className={`${FIELD} ${border(false)} mt-6`} />
          </div>
          <Continue onClick={() => next(2)} />
        </section>

        {/* 3. Stage */}
        <section className="apply-step" data-active={step === 3 ? "" : undefined}>
          <fieldset data-field="stage">
            <legend className="w-full">
              <h2 ref={(el) => void (headings.current[3] = el)} tabIndex={-1} className={TITLE}>
                {STAGE.label}
              </h2>
            </legend>
            <Choices name="stage" options={STAGE.options} onPick={() => pickNext(3)} />
            <ErrorLine message={errors.stage} />
          </fieldset>
          <Continue onClick={() => next(3)} />
        </section>

        {/* 4. Platforms (multi) */}
        <section className="apply-step" data-active={step === 4 ? "" : undefined}>
          <fieldset data-field="platforms">
            <legend className="w-full">
              <h2 ref={(el) => void (headings.current[4] = el)} tabIndex={-1} className={TITLE}>
                {PLATFORMS.label}
              </h2>
            </legend>
            <Help>{PLATFORMS.help}</Help>
            <Choices name="platforms" options={PLATFORMS.options} multiple />
            <ErrorLine message={errors.platforms} />
          </fieldset>
          <Continue onClick={() => next(4)} />
        </section>

        {/* 5. Start */}
        <section className="apply-step" data-active={step === 5 ? "" : undefined}>
          <fieldset data-field="start">
            <legend className="w-full">
              <h2 ref={(el) => void (headings.current[5] = el)} tabIndex={-1} className={TITLE}>
                {START.label}
              </h2>
            </legend>
            <Choices name="start" options={START.options} onPick={() => pickNext(5)} />
            <ErrorLine message={errors.start} />
          </fieldset>
          <Continue onClick={() => next(5)} />
        </section>

        {/* 6. Budget */}
        <section className="apply-step" data-active={step === 6 ? "" : undefined}>
          <fieldset data-field="budget">
            <legend className="w-full">
              <h2 ref={(el) => void (headings.current[6] = el)} tabIndex={-1} className={TITLE}>
                {BUDGET.label}
              </h2>
            </legend>
            <Choices name="budget" options={BUDGET.options} onPick={() => pickNext(6)} />
            <ErrorLine message={errors.budget} />
          </fieldset>
          <Continue onClick={() => next(6)} />
        </section>

        {/* 7. Occupation */}
        <section className="apply-step" data-active={step === 7 ? "" : undefined}>
          <div data-field="occupation">
            <h2 ref={(el) => void (headings.current[7] = el)} tabIndex={-1} className={TITLE}>
              <label htmlFor="occupation">{OCCUPATION.label}</label>
            </h2>
            <input
              id="occupation"
              name="occupation"
              type="text"
              autoComplete="organization-title"
              aria-invalid={bad("occupation") || undefined}
              className={`${FIELD} ${border(bad("occupation"))} mt-6`}
            />
            <ErrorLine message={errors.occupation} />
          </div>
          <Continue onClick={() => next(7)} />
        </section>

        {/* 8. Contact */}
        <section className="apply-step" data-active={step === FORM_STEPS ? "" : undefined}>
          <h2 ref={(el) => void (headings.current[FORM_STEPS] = el)} tabIndex={-1} className={TITLE}>
            Where can I reach you?
          </h2>
          <Help>Last step before you pick a time for a call.</Help>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {DETAILS.map((d) => (
              <div key={d.name} data-field={d.name} className={`min-w-0 ${d.name === "email" ? "sm:col-span-2" : ""}`}>
                <label htmlFor={d.name} className="block text-[15px] font-medium text-ink">
                  {d.label}
                </label>
                <input
                  id={d.name}
                  name={d.name}
                  type={d.type}
                  autoComplete={d.autoComplete}
                  inputMode={d.type === "email" ? "email" : undefined}
                  aria-invalid={bad(d.name) || undefined}
                  className={`${FIELD} ${border(bad(d.name))} mt-2`}
                />
                <ErrorLine message={errors[d.name]} />
              </div>
            ))}
            <div data-field="whatsapp" className="min-w-0 sm:col-span-2">
              <label htmlFor="whatsapp" className="block text-[15px] font-medium text-ink">
                WhatsApp number
              </label>
              {/* Country selector + number; the value is E.164 (e.g. +966501234567) and is what the sheet receives. */}
              <PhoneInput
                id="whatsapp"
                name="whatsapp"
                international
                withCountryCallingCode
                countryCallingCodeEditable={false}
                defaultCountry={country}
                value={phone}
                onChange={(v) => {
                  setPhone(v);
                  revalidate("whatsapp", { whatsapp: v ?? "" });
                }}
                className={`phone-field ${border(bad("whatsapp"))} mt-2`}
                numberInputProps={{ autoComplete: "tel", "aria-invalid": bad("whatsapp") || undefined }}
              />
              <ErrorLine message={errors.whatsapp} />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:items-end">
            <button type="submit" disabled={pending} aria-busy={pending || undefined} className={PRIMARY}>
              {pending ? "Sending…" : (
                <>
                  Continue to booking <Arrow />
                </>
              )}
            </button>
            <span className="text-center text-[0.8125rem] text-ink-muted">
              {NOTE} See our{" "}
              <Link href="/privacy" className="underline underline-offset-4">
                Privacy Policy
              </Link>
              .
            </span>
            {failed ? (
              <p role="alert" className="mt-1 text-center text-small font-medium text-red sm:text-right">
                Something went wrong. Please email me at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
                  {CONTACT_EMAIL}
                </a>{" "}
                instead.
              </p>
            ) : null}
          </div>
        </section>

        {/* Attribution (fbclid, utm_*, landing URL, _fbp, _fbc, avatar); refreshed again at submit. */}
        {ATTRIBUTION_FIELDS.map((k) => (
          <input key={k} type="hidden" name={k} defaultValue="" />
        ))}

        {/* Honeypot: hidden from people, filled by bots. */}
        <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </form>
      {/* Warm the Calendly script while they type their details, so the calendar opens instantly. */}
      {step === FORM_STEPS ? <Script src={CALENDLY_JS} strategy="lazyOnload" /> : null}
    </div>
  );
}
