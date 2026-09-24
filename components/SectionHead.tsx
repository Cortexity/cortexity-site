/**
 * Section header pattern: optional plain eyebrow label → headline with an
 * italic serif red accent on its final words → one line of sub-copy. Faded
 * rules flank the headline on desktop.
 */
/** Plain uppercase label (kept under its old name; /apply uses it too). */
export function EyebrowPill({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[20px] font-semibold uppercase leading-none tracking-[0.12em] text-[#e0201a] md:text-[22px]">
      {children}
    </p>
  );
}

export function SectionHead({
  id,
  eyebrow,
  title,
  accent,
  sub,
  level = 2,
  className = "",
}: {
  id: string;
  eyebrow?: string;
  /** Headline text before the accent. */
  title: string;
  /** Final words, set in red italic serif. */
  accent: string;
  sub?: string;
  level?: 1 | 2;
  className?: string;
}) {
  const Tag = level === 1 ? "h1" : "h2";
  return (
    <div className={`mx-auto max-w-[64rem] text-center ${className}`}>
      {eyebrow ? <EyebrowPill>{eyebrow}</EyebrowPill> : null}
      <div className={`${eyebrow ? "mt-5" : ""} flex items-center justify-center gap-8`}>
        <span aria-hidden="true" className="hidden h-px max-w-[140px] flex-1 bg-gradient-to-l from-current to-transparent opacity-10 lg:block" />
        <Tag id={id} className={`${level === 1 ? "text-display" : "text-h2"} max-w-[15em] text-balance`}>
          {title} <em className="accent">{accent}</em>
        </Tag>
        <span aria-hidden="true" className="hidden h-px max-w-[140px] flex-1 bg-gradient-to-r from-current to-transparent opacity-10 lg:block" />
      </div>
      {sub ? <p className="mx-auto mt-5 max-w-prose text-lead text-ink-muted">{sub}</p> : null}
    </div>
  );
}
