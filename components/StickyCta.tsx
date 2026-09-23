"use client";

import { useEffect, useState } from "react";
import { ApplyButton } from "./Button";

/**
 * Phone-only bar that slides up once the hero's button has scrolled away,
 * and slides back down whenever any in-page "Apply" button is on screen —
 * so there are never two Apply buttons visible at once.
 *
 * The bar itself is transparent: a fade behind the button blends it into the
 * page, white by default and black while a tone-black section (or the
 * footer) sits under the bottom ~120px of the viewport.
 *
 * Relies on the #hero-cta sentinel and on every CTA being an <a href="/apply">
 * inside <main>.
 */
export function StickyCta() {
  const [heroGone, setHeroGone] = useState(false);
  const [ctaOnScreen, setCtaOnScreen] = useState(0);
  const [dark, setDark] = useState(false);

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

    // Which surface is under the bar: observe dark sections against the bottom ~120px band only.
    const darkEls = Array.from(document.querySelectorAll("section.tone-black, footer"));
    const underBar = new Set<Element>();
    let band: IntersectionObserver | null = null;
    const observeBand = () => {
      band?.disconnect();
      underBar.clear();
      band = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) underBar.add(e.target);
            else underBar.delete(e.target);
          }
          setDark(underBar.size > 0);
        },
        { rootMargin: `-${Math.max(0, window.innerHeight - 120)}px 0px 0px 0px` },
      );
      darkEls.forEach((el) => band!.observe(el));
    };
    observeBand();
    window.addEventListener("resize", observeBand);
    return () => {
      io.disconnect();
      band?.disconnect();
      window.removeEventListener("resize", observeBand);
    };
  }, []);

  const show = heroGone && ctaOnScreen === 0;

  return (
    <div
      inert={!show}
      aria-hidden={!show}
      data-dark={dark ? "" : undefined}
      className={[
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 px-5 md:hidden",
        "pb-[max(1rem,env(safe-area-inset-bottom))]",
        "[--sticky-bg:#ffffff] data-dark:[--sticky-bg:#000000]",
        "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        show ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-24"
        style={{ background: "linear-gradient(to top, var(--sticky-bg) 40%, transparent)" }}
      />
      <ApplyButton variant="red" note={null} className="pointer-events-auto shadow-[0_10px_30px_rgba(224,32,26,0.35)]">
        Apply to Build Your App
      </ApplyButton>
    </div>
  );
}
