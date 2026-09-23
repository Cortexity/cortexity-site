"use client";

import { useEffect, useState } from "react";

type Row = { label: string; css: number; dpr2: number; src: string; srcset: string; transforms: string };

/** Reads the rendered <img> inside each [data-swap] box and lists what the browser actually did. */
export function SwapMetrics() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    // Measure after layout/images settle, in a callback (not synchronously in the effect body).
    const id = window.setTimeout(() => {
    const boxes = Array.from(document.querySelectorAll<HTMLElement>("[data-swap]"));
    setRows(
      boxes.map((box) => {
        const img = box.querySelector("img")!;
        const w = img.getBoundingClientRect().width;
        const t: string[] = [];
        let el: HTMLElement | null = img;
        while (el && el !== box.parentElement) {
          const cs = getComputedStyle(el);
          // Tailwind v4 uses the individual `translate`/`rotate`/`scale` properties, so read those too.
          const parts = [
            cs.transform !== "none" ? `transform ${cs.transform}` : "",
            cs.translate && cs.translate !== "none" && cs.translate !== "0px" ? `translate ${cs.translate}` : "",
            cs.rotate && cs.rotate !== "none" ? `rotate ${cs.rotate}` : "",
            cs.scale && cs.scale !== "none" ? `scale ${cs.scale}` : "",
          ].filter(Boolean);
          if (parts.length) t.push(`${el.tagName.toLowerCase()}: ${parts.join(", ")}`);
          el = el.parentElement;
        }
        return {
          label: box.dataset.swap!,
          css: Math.round(w),
          dpr2: Math.round(w * 2),
          src: img.getAttribute("src") || "",
          srcset: img.getAttribute("srcset") || "—",
          transforms: t.length ? t.join(" · ") : "none",
        };
      }),
    );
    }, 800);
    return () => window.clearTimeout(id);
  }, []);
  if (!rows.length) return null;
  return (
    <table className="mt-8 w-full text-left text-[13px]">
      <thead className="text-ink-muted">
        <tr>
          {["", "CSS width", "px @ DPR 2", "src", "srcset", "transforms (img → box)"].map((h) => (
            <th key={h} className="border-b border-[#e5e5ea] py-2 pr-4 font-medium">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} className="align-top">
            <td className="py-2 pr-4 font-semibold">{r.label}</td>
            <td className="py-2 pr-4">{r.css}px</td>
            <td className="py-2 pr-4">{r.dpr2}px</td>
            <td className="py-2 pr-4 break-all">{r.src}</td>
            <td className="py-2 pr-4 break-all">{r.srcset}</td>
            <td className="py-2 pr-4 break-all">{r.transforms}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
