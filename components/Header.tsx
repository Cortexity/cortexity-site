import Link from "next/link";
import { Wordmark } from "./Wordmark";

/** Floating frosted pill nav. */
export function Header() {
  return (
    <header className="fixed inset-x-3 top-3 z-50 md:inset-x-6 md:top-6">
      <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between rounded-pill border border-white/80 bg-white/70 pl-5 pr-2 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-[20px] md:h-[72px] md:pl-8 md:pr-3">
        <Wordmark href="/" />
        <Link
          href="/apply"
          className="inline-flex h-10 items-center rounded-pill bg-red px-5 text-[0.875rem] font-medium text-white transition-transform hover:-translate-y-0.5 md:h-12 md:px-6 md:text-[0.9375rem]"
        >
          Apply
        </Link>
      </div>
    </header>
  );
}
