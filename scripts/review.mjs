/**
 * npm run review — screenshots every section of the production build at 1440px
 * into review/. Requires `npm run build` first (the script runs it if .next is missing).
 * Set CHROME_PATH to use a system Chromium instead of Playwright's download.
 */
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "review");
const PORT = 3111;
const WIDTH = 1440;
const CAP = 1400;
const IDS = ["hero", "problem", "transformation", "founder", "process", "work", "timeline", "scope", "fit", "pricing", "faq", "start"];

if (!fs.existsSync(path.join(ROOT, ".next"))) execSync("npm run build", { stdio: "inherit" });
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT);

const server = spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: "ignore" });
const ready = async () => {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`http://localhost:${PORT}/`)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("server did not start");
};

try {
  await ready();
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
  const page = await browser.newPage({ viewport: { width: WIDTH, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
  // Trigger lazy images and reveals, then settle.
  await page.evaluate(async () => {
    document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-visible"));
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
    // Force every lazy image to load and wait for decode.
    const imgs = Array.from(document.images);
    imgs.forEach((i) => (i.loading = "eager"));
    await Promise.all(imgs.map((i) => (i.complete ? i.decode().catch(() => {}) : new Promise((r) => { i.onload = i.onerror = r; }).then(() => i.decode().catch(() => {})))));
  });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: path.join(OUT, "nav.png"), clip: { x: 0, y: 0, width: WIDTH, height: 120 } });

  const files = ["nav.png"];
  for (const id of IDS) {
    const box = await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top + window.scrollY, height: r.height };
    }, id);
    if (!box) continue;
    const parts = Math.ceil(box.height / CAP);
    for (let i = 0; i < parts; i++) {
      const y = box.top + i * CAP;
      const h = Math.min(CAP, box.top + box.height - y);
      const name = parts > 1 ? `${id}-${String.fromCharCode(97 + i)}.png` : `${id}.png`;
      await page.screenshot({ path: path.join(OUT, name), fullPage: true, clip: { x: 0, y, width: WIDTH, height: h } });
      files.push(name);
    }
  }
  await browser.close();
  console.log(files.join("\n"));
} finally {
  server.kill();
}
