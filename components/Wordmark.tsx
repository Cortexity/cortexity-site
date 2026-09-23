import Link from "next/link";

/** Cortexity mark: a small red square + "Cortexity" in SF Pro Display Semibold. */
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
      <span aria-hidden="true" className={`${size === "lg" ? "h-3 w-3" : "h-2.5 w-2.5"} rounded-[3px] bg-red`} />
      <span
        className={`font-display font-semibold tracking-[-0.02em] ${size === "lg" ? "text-[24px]" : "text-[20px]"}`}
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
