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

// Google Search Console verification files are plain-text ownership tokens, not
// content pages. Exclude only root-level files whose name and exact body match
// Google's verification format; keep the public verification file untouched.
const publicHtmlFiles = [];
for (const file of htmlFiles) {
  const relative = path.relative(dist, file).split(path.sep).join("/");
  // Third-party font packages may ship standalone specimen/license HTML; these are not site pages.
  if (relative.startsWith("fonts/")) continue;
  if (/^google[0-9a-f]+\.html$/i.test(relative)) {
    const filename = path.basename(file);
    const content = await readFile(file, "utf8");
    if (content.trim() === `google-site-verification: ${filename}`) continue;
  }
  publicHtmlFiles.push(file);
}
htmlFiles.length = 0;
htmlFiles.push(...publicHtmlFiles);

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


const sourceKeys = JSON.parse(await readFile(path.join(root, "public/locales/id-source-keys.json"), "utf8"));
const enFiles = [
  "public/locales/en-base.json",
  "public/locales/en-extra-1.json",
  "public/locales/en-extra-2.json",
  "public/locales/en-extra-3.json",
  "public/locales/en-extra-4.json"
];
const msFiles = [
  "public/locales/ms-base.json",
  "public/locales/ms-extra-1.json",
  "public/locales/ms-extra-2.json",
  "public/locales/ms-extra-3.json",
  "public/locales/ms-extra-4.json",
  "public/locales/ms-completion.json"
];
const zhFiles = [
  "public/locales/zh-base.json",
  "public/locales/zh-extra-1.json",
  "public/locales/zh-extra-2.json",
  "public/locales/zh-extra-3.json",
  "public/locales/zh-extra-4.json",
  "public/locales/zh-completion.json"
];
const chunkFiles = (prefix) => Array.from({ length: 13 }, (_, index) =>
  `public/locales/${prefix}-${String(index + 1).padStart(2, "0")}.json`
);
const localeDefinitions = {
  "en-US": enFiles,
  "en-GB": [...enFiles, "public/locales/en-GB-overrides.json"],
  "en-AU": [...enFiles, "public/locales/en-GB-overrides.json"],
  "en-CA": [...enFiles, "public/locales/en-CA-overrides.json"],
  "en-SG": [...enFiles, "public/locales/en-GB-overrides.json"],
  "ms-MY": msFiles,
  "ms-SG": [...msFiles, "public/locales/ms-SG-overrides.json"],
  "zh-CN": zhFiles,
  "zh-SG": [...zhFiles, "public/locales/zh-SG-overrides.json"],
  "ja-JP": chunkFiles("ja"),
  "ko-KR": [...chunkFiles("ko"), "public/locales/ko-overrides.json"],
  "ta-SG": [...chunkFiles("ta"), "public/locales/ta-overrides.json"]
};
const dictionaries = {};
for (const [locale, files] of Object.entries(localeDefinitions)) {
  const dictionary = {};
  for (const relativePath of files) {
    try {
      const chunk = JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
      if (!chunk || typeof chunk !== "object" || Array.isArray(chunk)) {
        fail(path.join(dist, "index.html"), "berkas kamus " + relativePath + " bukan objek JSON.");
        continue;
      }
      Object.assign(dictionary, chunk);
    } catch (error) {
      fail(path.join(dist, "index.html"), "berkas kamus " + relativePath + " tidak dapat dibaca: " + error.message);
    }
  }
  dictionaries[locale] = dictionary;
  const invalid = Object.entries(dictionary).filter(([, value]) => typeof value !== "string" || !value.trim());
  if (invalid.length) fail(path.join(dist, "index.html"), "i18n " + locale + ": nilai terjemahan kosong atau bukan string: " + invalid.map(([key]) => key).join(" | "));
  const missing = sourceKeys.filter((key) => !(key in dictionary));
  if (missing.length) fail(path.join(dist, "index.html"), "i18n " + locale + ": " + missing.length + " source key belum tersedia; contoh: " + missing.slice(0, 8).join(" | "));
}

const sourceFiles = [];
async function collectSourceFiles(dir) {
  let items;
  try { items = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) await collectSourceFiles(full);
    else if (/\.(astro|jsx|js)$/.test(item.name)) sourceFiles.push(full);
  }
}
await collectSourceFiles(path.join(root, "src"));
const sourceTexts = await Promise.all(sourceFiles.map((file) => readFile(file, "utf8")));
const activeKeys = sourceKeys.filter((key) => sourceTexts.some((source) => source.includes(key.trim())));
for (const [locale, dictionary] of Object.entries(dictionaries)) {
  const missing = activeKeys.filter((key) => !(key in dictionary));
  if (missing.length) warn(path.join(dist, "index.html"), "i18n " + locale + ": " + missing.length + " key aktif belum tersedia: " + missing.slice(0, 20).join(" | "));
}
console.log("i18n dictionary key counts:", Object.fromEntries(Object.entries(dictionaries).map(([locale, dictionary]) => [locale, Object.keys(dictionary).length])));

console.log("Static audit: " + htmlFiles.length + " halaman HTML publik; Google Search Console verification files excluded; " + fontUrls.length + " referensi font.");
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
