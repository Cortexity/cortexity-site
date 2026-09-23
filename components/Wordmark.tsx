import Link from "next/link";

/** Cortexity wordmark: "Cortexity" in SF Pro Display Semibold. */
export function Wordmark({
  size = "sm",
  tagline = false,
  href,
  className = "",
}: {
  size?: "sm" | "lg";
  tagline?: boolean;
  href?: string;
  className?: string;
}) {
  const mark = (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`font-semibold tracking-[-0.01em] text-ink ${size === "lg" ? "text-[24px]" : "text-[21px]"}`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        Cortexity
      </span>
    </span>
  );
  const body = href ? (
    <Link href={href} aria-label="Cortexity — home" className="inline-block">
      {mark}
    </Link>
  ) : (
    mark
  );
  return (
    <div className={className}>
      {body}
      {tagline ? <p className="mt-2 text-small text-ink-muted">From idea to app.</p> : null}
    </div>
  );
}
