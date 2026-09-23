"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wordmark } from "./Wordmark";

const LINKS = [
  { id: "process", label: "Process" },
  { id: "work", label: "Work" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

/** Floating pill nav with section links; the active link is tracked while scrolling. */
export function Header() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        // Pick the visible section closest to the top band.
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
        else if (entries.every((e) => !e.isIntersecting)) {
          const anyVisible = els.find((el) => {
            const r = el.getBoundingClientRect();
            return r.top < window.innerHeight * 0.4 && r.bottom > window.innerHeight * 0.4;
          });
          setActive(anyVisible ? anyVisible.id : null);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-3 top-3 z-50 md:inset-x-6 md:top-6">
      <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between rounded-pill border border-white/80 bg-white/70 pl-5 pr-2 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-[20px] md:h-[72px] md:pl-8 md:pr-3">
        <Wordmark href="/" />
        <nav aria-label="Sections" className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              aria-current={active === l.id ? "location" : undefined}
              className="relative py-2 text-[14px] font-medium text-ink"
            >
              {l.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-red transition-opacity duration-300 ${active === l.id ? "opacity-100" : "opacity-0"}`}
              />
            </a>
          ))}
        </nav>
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
