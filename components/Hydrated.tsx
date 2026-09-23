"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __hydrated?: boolean;
  }
}

/**
 * Flags that the client bundle ran. layout.tsx's inline script removes the
 * `js` class (un-hiding every Reveal block) if this flag is still unset
 * 2.5s after load, so a failed bundle never leaves the page blank.
 */
export function Hydrated() {
  useEffect(() => {
    window.__hydrated = true;
  }, []);
  return null;
}
