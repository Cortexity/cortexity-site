/** Design tokens — the single source of truth. Mirrored as CSS vars in app/globals.css. */
export const T = {
  red: "#E0201A",
  ink: "#1D1D1F",
  muted: "#6E6E73",
  gray: "#F5F5F7",
  line: "#E5E5EA",
  white: "#FFFFFF",
  /** iPhone frame: screenshot inset as % of frame width, outer radius in cqw. */
  phoneInset: 3,
  phoneRadius: 14.5,
} as const;
