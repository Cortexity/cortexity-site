"use client";

import { Children, useEffect, useRef, useState } from "react";

const MOBILE = "(max-width: 767px)";

/**
 * Under md: a full-bleed horizontal snap strip (one phone ≈ 72vw, neighbours
 * peeking) that starts on the centre phone, with three dots below it.
 * At md+: a plain `flex items-end justify-center` row — exactly the desktop
 * layout the trios always had. Children are the three <PhoneFrame>s.
 */
export function PhoneStrip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const count = Children.count(children);
  const [active, setActive] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia(MOBILE);

    // Start on the centre phone (instant, no smooth scroll).
    const centre = () => {
      if (!mq.matches) return;
      const mid = el.children[Math.floor(el.children.length / 2)] as HTMLElement | undefined;
      if (!mid) return;
      el.scrollLeft = mid.offsetLeft - (el.clientWidth - mid.offsetWidth) / 2;
    };
    centre();
    mq.addEventListener("change", centre);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Array.prototype.indexOf.call(el.children, e.target));
        }
      },
      { root: el, threshold: 0.6 },
    );
    for (const c of el.children) io.observe(c);
    return () => {
      mq.removeEventListener("change", centre);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={ref}
        tabIndex={0}
        className={`-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-[14vw] pb-24 pt-6 [overscroll-behavior-x:contain] [touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 md:mx-0 md:snap-none md:items-end md:justify-center md:gap-0 md:overflow-visible md:[touch-action:auto] md:px-0 md:pb-0 md:pt-0 ${className}`}
      >
        {children}
      </div>
      <p className="sr-only">Swipe to see more screens.</p>
      <div aria-hidden="true" className="-mt-14 flex justify-center gap-2 md:hidden">
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
              i === active ? "bg-red" : "bg-black/15 [.tone-black_&]:bg-white/25"
            }`}
          />
        ))}
      </div>
    </>
  );
}
