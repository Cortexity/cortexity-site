/** Stacked native <details> rows on soft card backgrounds — no hairlines. */
export function FaqList({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

export function FaqItem({
  question,
  children,
  open = false,
}: {
  question: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details className="qa group rounded-[32px] border border-[#e5e5ea] bg-white px-7 text-left text-ink shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:px-10" open={open}>
      <summary className="flex items-center justify-between gap-6 py-7 sm:py-8">
        <h3 className="text-lead font-semibold tracking-[-0.015em]">{question}</h3>
        <span aria-hidden="true" className="qa-glyph flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f5f5f7] text-[#6e6e73] transition-colors group-hover:text-red">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </summary>
      <div className="qa-body max-w-prose space-y-4 pb-8">{children}</div>
    </details>
  );
}
