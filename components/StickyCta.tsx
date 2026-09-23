"use client";

import { useEffect, useState } from "react";
import { ApplyButton } from "./Button";

/**
 * Phone-only bar that slides up once the hero's button has scrolled away,
 * and slides back down whenever any in-page "Apply" button is on screen —
 * so there are never two Apply buttons visible at once.
 *
 * Relies on the #hero-cta sentinel and on every CTA being an <a href="/apply">
 * inside <main>.
 */
export function StickyCta() {
  const [heroGone, setHeroGone] = useState(false);
  const [ctaOnScreen, setCtaOnScreen] = useState(0);

  useEffect(() => {
    const hero = document.getElementById("hero-cta");
    const ctas = Array.from(document.querySelectorAll('main a[href="/apply"]'));
    if (!hero || !("IntersectionObserver" in window)) return;

    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) {
          // "Gone" once the hero button is above the top of the viewport.
          setHeroGone(!e.isIntersecting && e.boundingClientRect.top < 0);
        } else {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
      }
      setCtaOnScreen(visible.size);
    });
    io.observe(hero);
    ctas.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const show = heroGone && ctaOnScreen === 0;

  return (
    <div
      inert={!show}
      aria-hidden={!show}
      className={[
        "fixed inset-x-0 bottom-0 z-40 bg-white/80 backdrop-blur-xl px-5 pt-3 md:hidden",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        show ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
    >
      <ApplyButton variant="red" note={null}>Apply to Build Your App</ApplyButton>
    </div>
  );
}
