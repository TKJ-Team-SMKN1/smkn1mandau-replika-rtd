import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const dist = path.join(root, "dist");
const errors = [];
const warnings = [];
const htmlFiles = [];

async function walk(dir) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}

function attr(tag, name) {
  const match = tag.match(new RegExp("\\b" + name + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))", "i"));
  return match ? (match[1] ?? match[2] ?? match[3] ?? "") : null;
}
function visibleText(value) {
  return value.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim();
}
function fail(file, message) { errors.push(path.relative(dist, file) + ": " + message); }
function warn(file, message) { warnings.push(path.relative(dist, file) + ": " + message); }

await walk(dist);
if (!htmlFiles.length) {
  console.error("Audit gagal: dist/ tidak ditemukan atau tidak berisi HTML. Jalankan npm run build terlebih dahulu.");
  process.exit(1);
}

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
  if (!attr(htmlTag, "lang")) fail(file, "elemen <html> tidak memiliki atribut lang.");
  if (!/<title\b[^>]*>[\s\S]*?<\/title>/i.test(html)) fail(file, "elemen <title> tidak ditemukan.");
  if (!/<meta\b[^>]*name=["']viewport["']/i.test(html)) fail(file, "meta viewport tidak ditemukan.");
  const mainCount = [...html.matchAll(/<main\b/gi)].length;
  if (mainCount !== 1) fail(file, "diharapkan tepat satu landmark <main>, ditemukan " + mainCount + ".");

  const ids = new Map();
  for (const match of html.matchAll(/\bid=["']([^"']+)["']/gi)) ids.set(match[1], (ids.get(match[1]) ?? 0) + 1);
  for (const [id, count] of ids) if (count > 1) fail(file, 'id "' + id + '" muncul ' + count + " kali.");

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    if (attr(match[0], "alt") === null) fail(file, 'gambar tidak memiliki atribut alt; gunakan alt="" untuk gambar dekoratif.');
  }
  for (const match of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)) {
    const opening = match[0].slice(0, match[0].indexOf(">") + 1);
    if (!attr(opening, "aria-label") && !attr(opening, "aria-labelledby") && !visibleText(match[1])) fail(file, "tombol tanpa nama aksesibel.");
  }
  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    if (attr(match[0], "target") !== "_blank") continue;
    const rel = (attr(match[0], "rel") ?? "").toLowerCase().split(/\s+/);
    if (!rel.includes("noopener")) fail(file, 'tautan target="_blank" harus memakai rel="noopener".');
  }

  const headings = [...html.matchAll(/<h([1-6])\b/gi)].map(match => Number(match[1]));
  if (headings.filter(level => level === 1).length !== 1) warn(file, "jumlah H1 bukan satu; periksa hierarki heading manual.");
  for (let i = 1; i < headings.length; i++) {
    if (headings[i] > headings[i - 1] + 1) {
      warn(file, "hierarki heading melompat dari H" + headings[i - 1] + " ke H" + headings[i] + ".");
      break;
    }
  }
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
    const value = match[1];
    if (!value.startsWith("/") || value.startsWith("//")) continue;
    const pathname = decodeURIComponent(value.split(/[?#]/)[0]);
    if (!pathname || pathname === "/") continue;
    const candidates = pathname.endsWith("/")
      ? [path.join(dist, pathname, "index.html")]
      : [path.join(dist, pathname), path.join(dist, pathname + ".html"), path.join(dist, pathname, "index.html")];
    let found = false;
    for (const candidate of candidates) { try { await access(candidate); found = true; break; } catch {} }
    if (!found) warn(file, "referensi lokal tidak ditemukan di dist/: " + value);
  }
}

const fontCss = await readFile(path.join(root, "src/styles/font-library.css"), "utf8");
const fontUrls = [...fontCss.matchAll(/url\(\s*(?:"([^"]+)"|'([^']+)'|([^\)\s]+))\s*\)/g)].map(match => match[1] ?? match[2] ?? match[3]);
for (const url of fontUrls) {
  if (url.includes("/public/")) { fail(path.join(dist, "index.html"), "URL font tidak valid: " + url); continue; }
  if (!url.startsWith("/")) continue;
  try { await access(path.join(root, "public", url.slice(1))); }
  catch { fail(path.join(dist, "index.html"), "file font tidak ditemukan: " + url); }
}


const i18n = await readFile(path.join(root, "public/scripts/i18n.js"), "utf8");
const translationsStart = i18n.indexOf("const translations =");
if (translationsStart < 0) fail(path.join(dist, "index.html"), "objek translations tidak ditemukan.");
else {
  const open = i18n.indexOf("{", translationsStart);
  let depth = 0, quote = null, escaped = false, end = -1;
  for (let i = open; i < i18n.length; i++) {
    const ch = i18n[i], next = i18n[i + 1];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "\`") { quote = ch; continue; }
    if (ch === "/" && next === "/") { i = i18n.indexOf("\n", i); if (i < 0) break; continue; }
    if (ch === "/" && next === "*") { i = i18n.indexOf("*/", i + 2); if (i < 0) break; i++; continue; }
    if (ch === "{") depth++;
    if (ch === "}") { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  if (end < 0) fail(path.join(dist, "index.html"), "objek translations tidak dapat diparse.");
  else {
    try {
      const dictionaries = vm.runInNewContext("(" + i18n.slice(open, end) + ")", Object.create(null), { timeout: 1000 });
      const languages = ["en", "ms", "zh"];
      const keySets = Object.fromEntries(languages.map(language => [language, Object.keys(dictionaries[language] || {})]));
      for (const language of languages) {
        if (!dictionaries[language]) fail(path.join(dist, "index.html"), "kamus bahasa " + language + " tidak ditemukan.");
      }
      const allKeys = new Set(languages.flatMap(language => keySets[language]));
      for (const language of languages) {
        const missing = [...allKeys].filter(key => !(key in (dictionaries[language] || {})));
        if (missing.length) warn(path.join(dist, "index.html"), "i18n " + language + ": " + missing.length + " key belum tersedia: " + missing.join(" | "));
      }
      console.log("i18n dictionary key counts:", Object.fromEntries(languages.map(language => [language, keySets[language].length])));
    } catch (error) {
      fail(path.join(dist, "index.html"), "objek translations gagal diparse: " + error.message);
    }
  }
}

console.log("Static audit: " + htmlFiles.length + " halaman HTML; " + fontUrls.length + " referensi font.");
if (warnings.length) {
  console.warn("\nWarnings (" + warnings.length + "):");
  for (const warning of warnings) console.warn(" - " + warning);
}
if (errors.length) {
  console.error("\nErrors (" + errors.length + "):");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}
console.log("Static audit passed. Peringatan perlu ditinjau manual; ini bukan sertifikasi WCAG.");
