/**
 * Section header pattern: eyebrow pill → headline with an italic serif
 * red accent on its final words → one line of sub-copy. Faded rules
 * flank the headline on desktop.
 */
export function EyebrowPill({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow-pill inline-flex items-center gap-2 rounded-pill border border-[#e5e5ea] px-3.5 py-2 text-[12px] font-medium uppercase leading-none tracking-[0.12em] text-[#1d1d1f] md:px-4 md:py-[9px] md:text-[13px] [.tone-black_&]:border-white/[0.14] [.tone-black_&]:text-white">
      <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full bg-[#e0201a]" />
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
  eyebrow: string;
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
      <EyebrowPill>{eyebrow}</EyebrowPill>
      <div className="mt-6 flex items-center justify-center gap-8">
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
