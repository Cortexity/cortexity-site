/**
 * public/screens/*.png → public/screens/2x/*.png (640 px wide) and
 * public/screens/3x/*.png (960 px wide), downscaled with Lanczos3 so the
 * browser draws phones at ~1:1 instead of resampling the 1206 px originals.
 * A source narrower than the target width is copied as-is (never upscaled).
 * Originals are left untouched. Run: node scripts/screens.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.join(process.cwd(), "public", "screens");
const VARIANTS = [
  { dir: "2x", width: 640 },
  { dir: "3x", width: 960 },
];

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

for (const { dir } of VARIANTS) fs.mkdirSync(path.join(SRC, dir), { recursive: true });

for (const f of fs.readdirSync(SRC).filter((f) => f.endsWith(".png")).sort()) {
  const src = path.join(SRC, f);
  const meta = await sharp(src).metadata();
  const line = [`${f} ${meta.width}×${meta.height} ${kb(fs.statSync(src).size)}`];
  for (const { dir, width } of VARIANTS) {
    const out = path.join(SRC, dir, f);
    if (meta.width <= width) {
      fs.copyFileSync(src, out);
      line.push(`${dir}: copied (${meta.width} ≤ ${width})`);
      continue;
    }
    const info = await sharp(src)
      .resize({ width, kernel: sharp.kernel.lanczos3, withoutEnlargement: true })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(out);
    line.push(`${dir}: ${info.width}×${info.height} ${kb(info.size)}`);
  }
  console.log(line.join("  |  "));
}
