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
  for (const m of tag.matchAll(/([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    if (m[1].toLowerCase() === name.toLowerCase()) return m[2] ?? m[3] ?? m[4] ?? "";
  }
  return null;
}
function textOnly(value) {
  return value.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ").trim();
}
function fail(file, message) { errors.push(path.relative(dist, file) + ": " + message); }
function warn(file, message) { warnings.push(path.relative(dist, file) + ": " + message); }

await walk(dist);
if (!htmlFiles.length) {
  console.error("Static audit: dist/ tidak ditemukan atau tidak berisi HTML. Jalankan npm run build terlebih dahulu.");
  process.exit(1);
}

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0];
  if (!htmlTag || !attr(htmlTag, "lang")) fail(file, "elemen <html> tidak memiliki atribut lang.");
  if (!/<title\b[^>]*>[\s\S]*?<\/title>/i.test(html)) fail(file, "elemen <title> tidak ditemukan.");
  const mains = [...html.matchAll(/<main\b/gi)];
  if (mains.length !== 1) fail(file, "diharapkan tepat satu <main>, ditemukan " + mains.length + ".");

  const ids = new Map();
  for (const m of html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)) ids.set(m[1], (ids.get(m[1]) || 0) + 1);
  for (const [id, count] of ids) if (count > 1) fail(file, 'id "' + id + '" muncul ' + count + " kali.");

  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    if (attr(m[0], "alt") === null) fail(file, 'gambar <img> tidak memiliki atribut alt (gunakan alt="" untuk dekoratif).');
  }
  for (const m of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)) {
    const tag = m[0].slice(0, m[0].indexOf(">") + 1);
    if (!attr(tag, "aria-label") && !attr(tag, "aria-labelledby") && !textOnly(m[1])) fail(file, "tombol tanpa nama aksesibel.");
  }
  for (const m of html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)) {
    const tag = m[0].slice(0, m[0].indexOf(">") + 1);
    const labelled = attr(tag, "aria-label") || attr(tag, "aria-labelledby") || attr(tag, "title");
    const inner = textOnly(m[1]);
    const imageAlt = [...m[1].matchAll(/<img\b[^>]*>/gi)].some(x => (attr(x[0], "alt") || "").trim());
    if (!labelled && !inner && !imageAlt) warn(file, "tautan tanpa teks/nama aksesibel terdeteksi.");
  }
  for (const m of html.matchAll(/<(input|select|textarea)\b[^>]*>/gi)) {
    const tag = m[0];
    const type = (attr(tag, "type") || "").toLowerCase();
    if (m[1].toLowerCase() === "input" && ["hidden","submit","button","reset","image"].includes(type)) continue;
    const id = attr(tag, "id");
    const labelled = attr(tag, "aria-label") || attr(tag, "aria-labelledby") || attr(tag, "title");
    let hasFor = false;
    if (id) {
      for (const label of html.matchAll(/<label\b[^>]*>/gi)) if (attr(label[0], "for") === id) hasFor = true;
    }
    if (!labelled && !hasFor) warn(file, "kontrol form " + (id ? "#" + id : "(tanpa id)") + " perlu diperiksa labelnya.");
  }

  const headingLevels = [...html.matchAll(/<h([1-6])\b/gi)].map(x => Number(x[1]));
  if (headingLevels.filter(x => x === 1).length !== 1) warn(file, "jumlah heading H1 bukan satu; periksa hierarki halaman.");
  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] > headingLevels[i - 1] + 1) {
      warn(file, "urutan heading melompat dari H" + headingLevels[i - 1] + " ke H" + headingLevels[i] + ".");
      break;
    }
  }

  for (const m of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
    const value = m[1];
    if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/#")) continue;
    const pathname = decodeURIComponent(value.split(/[?#]/)[0]);
    if (!pathname || pathname === "/") continue;
    const candidates = pathname.endsWith("/")
      ? [path.join(dist, pathname, "index.html")]
      : [path.join(dist, pathname), path.join(dist, pathname + ".html"), path.join(dist, pathname, "index.html")];
    let found = false;
    for (const candidate of candidates) { try { await access(candidate); found = true; break; } catch {} }
    if (!found) warn(file, "referensi lokal tidak ditemukan pada hasil build: " + value);
  }
}

const fontCss = await readFile(path.join(root, "src/styles/font-library.css"), "utf8");
const fontUrls = [...fontCss.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(x => x[1]);
let missingFonts = 0;
for (const url of fontUrls) {
  if (url.includes("/public/")) { errors.push("URL font tidak valid (mengandung /public/): " + url); continue; }
  if (!url.startsWith("/")) continue;
  try { await access(path.join(root, "public", url.slice(1))); }
  catch { missingFonts++; errors.push("file font tidak ditemukan: " + url); }
}

const i18n = await readFile(path.join(root, "public/scripts/i18n.js"), "utf8");
const start = i18n.indexOf("const translations =");
if (start < 0) errors.push("objek translations tidak ditemukan pada i18n.js.");
else {
  const open = i18n.indexOf("{", start);
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
  if (end < 0) errors.push("objek translations tidak dapat diparse.");
  else {
    try {
      const dict = vm.runInNewContext("(" + i18n.slice(open, end) + ")", Object.create(null), { timeout: 1000 });
      const languages = ["en", "ms", "zh"];
      const keys = Object.fromEntries(languages.map(lang => [lang, Object.keys(dict[lang] || {})]));
      for (const lang of languages) if (!dict[lang]) errors.push('kamus bahasa "' + lang + '" tidak ditemukan.');
      const union = new Set(languages.flatMap(lang => keys[lang]));
      for (const lang of languages) {
        const missing = [...union].filter(key => !(key in (dict[lang] || {})));
        if (missing.length) warn(path.join(dist, "index.html"), "i18n " + lang + ": " + missing.length + " key belum tersedia dibanding gabungan kamus.");
      }
      console.log("i18n key count:", Object.fromEntries(languages.map(lang => [lang, keys[lang].length])));
    } catch (error) { errors.push("objek translations gagal diparse: " + error.message); }
  }
}

console.log("Static quality audit: " + htmlFiles.length + " HTML pages; " + fontUrls.length + " font-face URLs; " + missingFonts + " missing fonts.");
console.log("Findings: " + errors.length + " error(s), " + warnings.length + " warning(s).");
for (const item of errors) console.error("ERROR", item);
for (const item of warnings.slice(0, 80)) console.warn("WARN", item);
if (warnings.length > 80) console.warn("... " + (warnings.length - 80) + " warning lain disembunyikan.");
if (errors.length) process.exit(1);
