/**
 * Typographic primitives. The landing copy is written as many short,
 * single-line paragraphs; these keep each one as its own <p> so the rhythm
 * of the writing survives intact.
 */

type Kids = { children: React.ReactNode; className?: string; id?: string };

export function H1({ children, className = "", id }: Kids) {
  return (
    <h1 id={id} className={`text-display text-balance ${className}`}>
      {children}
    </h1>
  );
}

export function H2({ children, className = "", id }: Kids) {
  return (
    <h2 id={id} className={`mx-auto max-w-[15em] text-h2 text-balance ${className}`}>
      {children}
    </h2>
  );
}

export function H3({ children, className = "", id }: Kids) {
  return (
    <h3 id={id} className={`text-h3 text-balance ${className}`}>
      {children}
    </h3>
  );
}

/** Standard body paragraph. */
export function P({ children, className = "" }: Kids) {
  return <p className={`line text-body text-ink-muted ${className}`}>{children}</p>;
}

/** Larger opening paragraph. */
export function Lead({ children, className = "" }: Kids) {
  return <p className={`text-lead ${className}`}>{children}</p>;
}

/** Bold line in the copy — rendered as its own emphasised paragraph. */
/** Statement line: bold copy rendered large, full colour, on its own. */
export function Strong({ children, className = "" }: Kids) {
  return (
    <p className={`stmt text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] font-semibold leading-[1.2] tracking-[-0.015em] text-fg text-balance ${className}`}>
      <strong className="font-semibold">{children}</strong>
    </p>
  );
}

/**
 * Lines the source marks in italics. Geist ships no italic face, and a
 * synthesised slant looks cheap, so these are set smaller and muted instead.
 */
export function Muted({ children, className = "" }: Kids) {
  return <p className={`text-small text-ink-muted ${className}`}>{children}</p>;
}

/** Small tracked uppercase label (DAY 1, 21 DAYS LATER, FIRST DAYS…). */
export function Eyebrow({ children, className = "" }: Kids) {
  return (
    <p className={`text-eyebrow uppercase text-ink-muted ${className}`}>{children}</p>
  );
}
