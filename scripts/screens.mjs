/** One-off: public/screens/*.png → public/screens/optimized/*.webp at native size (q95, effort 6). */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.join(process.cwd(), "public", "screens");
const OUT = path.join(SRC, "optimized");
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(SRC).filter((f) => f.endsWith(".png"))) {
  const out = path.join(OUT, f.replace(/\.png$/, ".webp"));
  const info = await sharp(path.join(SRC, f)).webp({ quality: 95, effort: 6 }).toFile(out);
  console.log(`${f} → optimized/${path.basename(out)}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB (png ${(fs.statSync(path.join(SRC, f)).size / 1024).toFixed(0)} KB)`);
}
