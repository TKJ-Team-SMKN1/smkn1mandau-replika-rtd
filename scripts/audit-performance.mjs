import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const layoutPath = path.join(root, "src/layouts/LayoutUtama.astro");
const fontCssPath = path.join(root, "src/styles/font-library.css");
const configPath = path.join(root, "astro.config.mjs");
const i18nPath = path.join(root, "public/scripts/i18n.js");
const layout = await readFile(layoutPath, "utf8");
const fontCss = await readFile(fontCssPath, "utf8");
const config = await readFile(configPath, "utf8");
const errors = [];
const warnings = [];

const preloadTags = [...layout.matchAll(/<link\b[^>]*\brel="preload"[^>]*>/g)].map((match) => match[0]);
const fontPreloads = preloadTags.filter((tag) => /\bas="font"/.test(tag));
let totalPreloadBytes = 0;

if (fontPreloads.length > 3) errors.push("Font preload count exceeds the three-resource budget.");
for (const tag of fontPreloads) {
  const href = tag.match(/\bhref="([^"]+)"/)?.[1];
  if (!href || !href.startsWith("/fonts/")) {
    errors.push("Every preloaded font must use a same-origin /fonts/ path.");
    continue;
  }
  const filePath = path.resolve(root, "public", href.replace(/^\/+/, ""));
  const publicRoot = path.resolve(root, "public") + path.sep;
  if (!filePath.startsWith(publicRoot)) {
    errors.push("Font preload path escapes the public directory.");
    continue;
  }
  try {
    totalPreloadBytes += (await stat(filePath)).size;
  } catch {
    errors.push("Preloaded font file is missing: " + href);
  }
}

const budgetBytes = 256 * 1024;
if (totalPreloadBytes > budgetBytes) errors.push("Total preloaded font bytes exceed 256 KiB.");
const fontFaces = [...fontCss.matchAll(/@font-face\s*\{[^}]*\}/g)].map((match) => match[0]);
const missingSwap = fontFaces.filter((face) => !/font-display\s*:\s*swap\s*;/.test(face)).length;
if (missingSwap) errors.push(missingSwap + " font-face rules do not use font-display: swap.");
if (!/output\s*:\s*["']static["']/.test(config)) errors.push("Astro output must remain static.");

const i18n = await readFile(i18nPath, "utf8");
const i18nBytes = (await stat(i18nPath)).size;
if (i18nBytes > 128 * 1024) warnings.push("i18n.js exceeds 128 KiB; consider locale chunking before adding more dictionaries.");
if (!i18n.includes("observer?.disconnect();")) errors.push("i18n MutationObserver must disconnect before applying translations to prevent a self-triggering mutation loop.");
if (!i18n.includes("} finally {") || !i18n.includes("observer?.observe(document.body, { childList: true, characterData: true, subtree: true });")) errors.push("i18n MutationObserver must resume observation in finally after translation updates.");
const clientLoadCount = (layout.match(/\bclient:load\b/g) || []).length;
if (clientLoadCount > 1) warnings.push("More than one client:load island is present in the shared layout.");

console.log("Static performance preflight: " + fontPreloads.length + " font preloads; " + totalPreloadBytes + " bytes (budget " + budgetBytes + "); " + fontFaces.length + " font-face rules; i18n.js " + i18nBytes + " bytes; client:load islands " + clientLoadCount + ".");
for (const warning of warnings) console.warn("WARNING:", warning);
for (const error of errors) console.error("ERROR:", error);
if (errors.length) process.exit(1);
console.log("Static performance budgets passed; no live Core Web Vitals claim is made.");
