import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const archiveDir = path.join(root, "data/raw-archive/hasil_scrape_smkn1mandau");
const manifestPath = path.join(archiveDir, "daftar_halaman.csv");
const indexPath = path.join(root, "src/data/archive-index.json");
const expectedCount = 100;

function parseCsvLine(line) {
  const values = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') { value += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(value.trim()); value = "";
    } else value += char;
  }
  values.push(value.trim());
  return values;
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function visibleText(html) {
  return decodeEntities(html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")).trim();
}

const csv = await readFile(manifestPath, "utf8");
const lines = csv.split(/\r?\n/).filter(Boolean);
const rows = lines.slice(1).map(parseCsvLine).map(([number, file, sourceUrl]) => ({
  number, file, sourceUrl
})).filter(row => row.file && row.sourceUrl);

if (rows.length !== expectedCount) {
  throw new Error(`Expected ${expectedCount} manifest rows, found ${rows.length}`);
}

const index = JSON.parse(await readFile(indexPath, "utf8"));
if (index.totalFiles !== expectedCount || index.items.length !== expectedCount) {
  throw new Error("archive-index.json does not contain the expected 100 source records");
}

const indexByFile = new Map(index.items.map(item => [item.file, item]));
const seenFiles = new Set();
const hashes = new Map();
const counts = { "search-results": 0, "image-led-or-attachment": 0, "text-rich": 0, "low-text": 0 };
const failures = [];

for (const row of rows) {
  if (seenFiles.has(row.file)) failures.push(`Duplicate manifest filename: ${row.file}`);
  seenFiles.add(row.file);
  const indexed = indexByFile.get(row.file);
  if (!indexed || indexed.sourceUrl !== row.sourceUrl) {
    failures.push(`Manifest/index mismatch: ${row.file}`);
  }
  let parsedUrl;
  try { parsedUrl = new URL(row.sourceUrl); } catch { failures.push(`Invalid source URL: ${row.sourceUrl}`); continue; }
  if (!parsedUrl.hostname.endsWith("smkn1mandau.sch.id")) {
    failures.push(`Unexpected source host: ${row.sourceUrl}`);
  }
  const filePath = path.join(archiveDir, row.file);
  try { await access(filePath); } catch { failures.push(`Missing archived HTML: ${row.file}`); continue; }
  const html = await readFile(filePath, "utf8");
  const text = visibleText(html);
  const imageCount = (html.match(/<img\b/gi) || []).length;
  const hash = createHash("sha256").update(html).digest("hex");
  hashes.set(hash, (hashes.get(hash) || 0) + 1);
  if (row.sourceUrl.includes("/search?") || row.file.includes("_search_")) counts["search-results"] += 1;
  else if (imageCount >= 20 && text.length < 1500) counts["image-led-or-attachment"] += 1;
  else if (text.length >= 1500) counts["text-rich"] += 1;
  else counts["low-text"] += 1;
}

const publicEnv = path.join(root, "public/.env");
try { await access(publicEnv); failures.push("public/.env must stay outside the static webroot"); } catch { /* expected */ }

const duplicateGroups = [...hashes.values()].filter(count => count > 1).length;
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Source archive audit passed: ${rows.length} HTML files; manifest and structured index match.`);
  console.log(`Content shape: ${JSON.stringify(counts)}; duplicate-content groups: ${duplicateGroups}.`);
  console.log("Public webroot check passed: no public/.env file.");
}
