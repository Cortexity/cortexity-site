import Link from "next/link";

/**
 * The Cortexity wordmark — treatment A ("Tracked") from DESIGN.md.
 * Uppercase Geist Medium, wide letter-spacing, optional tagline underneath.
 * Pure text: it scales, prints, and needs no asset.
 */
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
    <span
      className={
        size === "lg"
          ? "block text-[1.375rem] font-medium uppercase tracking-[0.26em]"
          : "block text-[1.125rem] font-semibold uppercase tracking-[0.2em]"
      }
    >
      Cortexity
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
      {tagline ? (
        <p
          className={
            size === "lg"
              ? "mt-3 text-lead text-ink-muted"
              : "mt-1.5 text-small text-ink-muted"
          }
        >
          From idea to app.
        </p>
      ) : null}
    </div>
  );
}
