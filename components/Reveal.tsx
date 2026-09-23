"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle fade-up when an element enters the viewport. CSS does the work
 * (see .reveal in globals.css); this only toggles a class once.
 * Content stays visible if JavaScript never runs — the hidden state is
 * gated behind `html.js`, which layout.tsx sets inline before paint.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Stagger, in ms. */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.classList.add("is-visible");
    if (!("IntersectionObserver" in window)) {
      show();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            show();
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.01 },
    );
    io.observe(el);
    // Hard fallback: never leave content hidden if the observer misfires (seen on iOS Safari).
    const timer = window.setTimeout(show, 1200);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
