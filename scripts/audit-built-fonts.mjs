import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const fontLibrary = await readFile(path.join(root, "src/styles/font-library.css"), "utf8");

function urlsFrom(css) {
  return [...css.matchAll(/url\(\s*["']([^"']+)["']\s*\)/g)].map((match) => match[1]);
}

async function verifyFont(url, kind) {
  if (!url.startsWith("/fonts/")) throw new Error("Non-local font URL in generated stylesheet: " + url);
  const filePath = path.join(dist, url.replace(/^\//, ""));
  const bytes = await readFile(filePath);
  if (bytes.subarray(0, 80).toString("utf8").startsWith("version https://git-lfs.github.com/spec/v1")) {
    throw new Error("Git LFS pointer was copied into dist instead of the real font: " + url);
  }
  const magic = bytes.subarray(0, 4).toString("hex");
  const valid = kind === "woff2" ? magic === "774f4632" : kind === "opentype" ? magic === "4f54544f" || magic === "00010000" : false;
  if (!valid || bytes.byteLength < 1000) throw new Error("Invalid " + kind + " font asset: " + url);
  return bytes.byteLength;
}

const otfUrls = [...new Set(urlsFrom(fontLibrary).filter((url) => url.startsWith("/fonts/")))];
if (otfUrls.length !== 174) throw new Error("Expected 174 local OTF face references, found " + otfUrls.length);
let otfBytes = 0;
for (const url of otfUrls) otfBytes += await verifyFont(url, "opentype");

async function verifySubsetCss(file, expectedFaces, kind = "woff2", requiresUnicodeRange = true) {
  const css = await readFile(path.join(root, "public/fonts", file), "utf8");
  const faces = (css.match(/@font-face/g) || []).length;
  if (faces !== expectedFaces) throw new Error(file + " expected " + expectedFaces + " @font-face entries, found " + faces);
  if ((requiresUnicodeRange && !css.includes("unicode-range:")) || !css.includes("font-display: swap")) {
    throw new Error(file + " must preserve unicode ranges and font-display: swap.");
  }
  const urls = urlsFrom(css);
  if (urls.length !== expectedFaces) throw new Error(file + " URL count does not match @font-face count.");
  let bytes = 0;
  for (const url of urls) bytes += await verifyFont(url, kind);
  return { faces, bytes };
}

const sc = await verifySubsetCss("noto-sans-sc.css", 101);
const tc = await verifySubsetCss("noto-sans-tc.css", 108);
const hk = await verifySubsetCss("source-han-serif-hk.css", 7, "opentype", false);
console.log("Built font audit passed: OTF=" + otfUrls.length + " (" + otfBytes + " bytes), Noto Sans SC=" + sc.faces + ", Noto Sans TC=" + tc.faces + ", Source Han Serif HK=" + hk.faces + ". All files are real local font binaries.");
