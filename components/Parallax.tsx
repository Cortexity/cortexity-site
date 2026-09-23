"use client";

import { useEffect, useRef } from "react";

/**
 * Drifts its content up to `max`px against the scroll. Off under reduced
 * motion, and off under md when `desktopOnly` is set: a transformed /
 * will-change ancestor around a touch scroll container (the phone strip)
 * breaks touch scrolling in WebKit, so the wrapper stays inert on phones.
 */
export function Parallax({
  children,
  max = 30,
  className = "",
  desktopOnly = false,
}: {
  children: React.ReactNode;
  max?: number;
  className?: string;
  desktopOnly?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (desktopOnly && !window.matchMedia("(min-width: 768px)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1..1
      el.style.transform = `translate3d(0, ${(Math.max(-1, Math.min(1, p)) * max).toFixed(1)}px, 0)`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [max, desktopOnly]);
  return (
    <div ref={ref} className={`${desktopOnly ? "md:will-change-transform" : "will-change-transform"} ${className}`}>
      {children}
    </div>
  );
}
