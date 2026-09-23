import { Children, isValidElement, type ReactNode } from "react";
import { P, Strong } from "./Text";

export type Tone = "white" | "gray" | "black";

/** Full-bleed section with its own background tone. Spacing does the separating. */
export function Section({
  id,
  children,
  className = "",
  tone = "white",
  labelledBy,
  decor,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: Tone;
  labelledBy?: string;
  /** Background objects (blobs, dots) rendered behind the content. */
  decor?: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`tone-${tone} relative overflow-hidden px-5 sm:px-8`}>
      {decor}
      <div className={`relative z-10 mx-auto w-full max-w-wide py-24 sm:py-32 lg:py-40 ${className}`}>
        {children}
      </div>
    </section>
  );
}

/** Centred block. Headlines may run wider; body copy is capped by <Stack>. */
export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[56rem] text-center ${className}`}>{children}</div>;
}

function textLength(n: ReactNode): number {
  if (typeof n === "string" || typeof n === "number") return String(n).length;
  if (Array.isArray(n)) return n.reduce<number>((a, c) => a + textLength(c), 0);
  if (isValidElement(n)) return textLength((n.props as { children?: ReactNode }).children);
  return 0;
}

/**
 * Groups copy into stanzas: consecutive short <P> lines sit 6px apart
 * (max three per stanza); a long paragraph, a statement line (<Strong>)
 * or any other element starts a new stanza, 40px away.
 */
export function Stack({
  children,
  className = "",
  bullets = false,
}: {
  children: ReactNode;
  className?: string;
  gap?: "sm" | "md" | "lg";
  /** Red bullet at each stanza, left-aligned. */
  bullets?: boolean;
}) {
  const stanzas: { kind: "lines" | "stmt" | "other"; items: ReactNode[] }[] = [];
  let cur: ReactNode[] = [];
  const flush = () => {
    if (cur.length) stanzas.push({ kind: "lines", items: cur });
    cur = [];
  };
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) continue;
    if (child.type === P) {
      const long = textLength((child.props as { children?: ReactNode }).children) > 110;
      if (long || cur.length >= 3) flush();
      cur.push(child);
      if (long) flush();
    } else {
      flush();
      stanzas.push({ kind: child.type === Strong ? "stmt" : "other", items: [child] });
    }
  }
  flush();
  return (
    <div className={`flow mx-auto max-w-prose ${bullets ? "flow-bullets" : ""} ${className}`}>
      {stanzas.map((s, i) => (
        <div key={i} className={`stanza is-${s.kind}`}>
          {s.items}
        </div>
      ))}
    </div>
  );
}
