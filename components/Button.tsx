import Link from "next/link";

const DEFAULT_NOTE = "I personally review every application.";

/**
 * Pill button, always → /apply. `red` is the glossy primary; `primary`
 * (legacy name) is the black secondary. A small reassurance line sits
 * underneath unless `note={null}`.
 */
export function ApplyButton({
  children,
  className = "",
  size = "md",
  variant = "primary",
  note = DEFAULT_NOTE,
}: {
  children: React.ReactNode;
  className?: string;
  size?: "md" | "lg";
  variant?: "primary" | "red";
  note?: string | null;
}) {
  const link = (
    <Link
      href="/apply"
      className={[
        "inline-flex w-full items-center justify-center rounded-pill font-medium tracking-[-0.01em] md:w-auto",
        "transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0",
        variant === "red" ? "bg-red text-white" : "bg-btn text-btn-fg",
        size === "lg" ? "min-h-14 px-9 text-[1.0625rem]" : "min-h-12 px-7 text-[1rem]",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
  if (note === null) return link;
  return (
    <span className="flex w-full flex-col items-center gap-3 md:w-auto">
      {link}
      <span className="text-center text-[0.8125rem] text-ink-muted">{note}</span>
    </span>
  );
}
