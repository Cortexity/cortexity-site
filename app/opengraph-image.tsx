import { ImageResponse } from "next/og";

// Palette from DESIGN.md. No custom fonts: ImageResponse's built-in sans is used.
const INK = "#1D1D1F";
const MUTED = "#6E6E73";
const RED = "#E0201A";

export const alt = "Cortexity — Your app idea. Built in 21 days. One project. One fixed price. $5,000.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FFFFFF",
          padding: "72px 80px",
          color: INK,
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 600, letterSpacing: "-0.02em" }}>Cortexity</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 88, fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            <span>Your app idea. Built in&nbsp;</span>
            <span style={{ color: RED }}>21 days.</span>
          </div>
          <div style={{ display: "flex", marginTop: 32, fontSize: 36, color: MUTED }}>One project. One fixed price. $5,000.</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
