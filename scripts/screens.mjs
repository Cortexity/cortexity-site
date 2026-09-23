/**
 * Exact-fit phone screenshots.
 *
 * public/screens/<name>-<n>.png → public/screens/fit/<name>-<n>@2x.png and @3x.png,
 * resized (Lanczos3) to exactly 2× / 3× the CSS width the <img> renders at on a
 * 1280 px viewport, so the browser draws it 1:1 on 2× and 3× displays instead of
 * resampling. Never upscales: a source narrower than the target is copied as-is.
 * Originals are left untouched. Run: node scripts/screens.mjs
 *
 * CSS widths were measured with Playwright (getBoundingClientRect().width of each
 * phone <img>, rotation disabled) at viewport 1280 — re-measure and update SLOTS
 * whenever PhoneTrio / AppMockup sizing changes.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

/** Measured CSS width of slot 1 (left), 2 (centre), 3 (right) at viewport 1280. */
const SLOTS = {
  padel: [277.95, 336.89, 277.95], // PhoneTrio (hero + Transformation, identical sizes)
  slowr: [335.7, 389.84, 335.7], // AppMockup
  reflexflow: [335.7, 389.84, 335.7], // AppMockup
};
const DENSITIES = [2, 3];

const SRC = path.join(process.cwd(), "public", "screens");
const OUT = path.join(SRC, "fit");
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

// Older variant folders are superseded by fit/.
for (const old of ["2x", "3x", "optimized"]) fs.rmSync(path.join(SRC, old), { recursive: true, force: true });
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

for (const f of fs.readdirSync(SRC).filter((f) => /^[a-z]+-\d\.png$/.test(f)).sort()) {
  const [, name, n] = f.match(/^([a-z]+)-(\d)\.png$/);
  const css = SLOTS[name]?.[Number(n) - 1];
  if (!css) {
    console.warn(`${f}: no slot width in SLOTS, skipped`);
    continue;
  }
  const src = path.join(SRC, f);
  const meta = await sharp(src).metadata();
  const line = [`${f} ${meta.width}×${meta.height} ${kb(fs.statSync(src).size)}  css ${css}px`];
  for (const d of DENSITIES) {
    const width = Math.round(css * d);
    const out = path.join(OUT, `${name}-${n}@${d}x.png`);
    if (meta.width <= width) {
      fs.copyFileSync(src, out);
      line.push(`@${d}x: copied (${meta.width} ≤ ${width})`);
      continue;
    }
    const info = await sharp(src)
      .resize({ width, kernel: sharp.kernel.lanczos3, withoutEnlargement: true })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(out);
    line.push(`@${d}x: ${info.width}×${info.height} ${kb(info.size)}`);
  }
  console.log(line.join("  |  "));
}
