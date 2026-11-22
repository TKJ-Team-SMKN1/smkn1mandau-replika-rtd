import { access, readFile } from "node:fs/promises";
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
  const valid = kind === "woff2" ? magic === "774f4632" : kind === "opentype" || kind === "truetype" ? magic === "4f54544f" || magic === "00010000" : false;
  if (!valid || bytes.byteLength < 1000) throw new Error("Invalid " + kind + " font asset: " + url);
  return bytes.byteLength;
}

for (const directory of ["fonts/noto-sans-sc/static", "fonts/noto-sans-tc/static"]) {
  try {
    await access(path.join(dist, directory));
    throw new Error("Redundant static CJK font copies must not ship in dist: " + directory);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

const fontUrls = [...new Set(urlsFrom(fontLibrary).filter((url) => url.startsWith("/fonts/")))];
const otfUrls = fontUrls.filter((url) => url.endsWith(".otf"));
const woff2Urls = fontUrls.filter((url) => url.endsWith(".woff2"));
const ttfUrls = fontUrls.filter((url) => url.endsWith(".ttf"));
if (otfUrls.length !== 174) throw new Error("Expected 174 local OTF references, found " + otfUrls.length);
if (woff2Urls.length !== 2) throw new Error("Expected 2 local WOFF2 references for GenZui Sans, found " + woff2Urls.length);
if (ttfUrls.length !== 21) throw new Error("Expected 21 local TTF references for Japanese/Korean families, found " + ttfUrls.length);
let otfBytes = 0;
let woff2Bytes = 0;
let ttfBytes = 0;
for (const url of otfUrls) otfBytes += await verifyFont(url, "opentype");
for (const url of woff2Urls) woff2Bytes += await verifyFont(url, "woff2");
for (const url of ttfUrls) ttfBytes += await verifyFont(url, "truetype");

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
console.log("Built font audit passed: OTF=" + otfUrls.length + " (" + otfBytes + " bytes), WOFF2=" + woff2Urls.length + " (" + woff2Bytes + " bytes), TTF=" + ttfUrls.length + " (" + ttfBytes + " bytes), Noto Sans SC=" + sc.faces + ", Noto Sans TC=" + tc.faces + ", Source Han Serif HK=" + hk.faces + ". All files are real local font binaries.");
