import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { SITE_URL } from "../site-config.mjs";

const root = path.resolve(".");
const publicRoot = path.join(root, "public");
const distRoot = path.join(root, "dist");
const errors = [];
const expectedPngs = [
  ["favicon-32x32.png", 32, 32],
  ["apple-touch-icon.png", 180, 180],
  ["android-chrome-192x192.png", 192, 192],
  ["android-chrome-512x512.png", 512, 512],
  ["images/replika-logo.png", 800, 200]
];

async function exists(file) {
  try { await readFile(file); return true; } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtml(file));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(file);
  }
  return files;
}

for (const [relative, width, height] of expectedPngs) {
  const file = path.join(publicRoot, relative);
  let data;
  try { data = await readFile(file); }
  catch { errors.push(`PNG tidak ditemukan: public/${relative}`); continue; }

  const validSignature = data.length >= 24 &&
    data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (!validSignature) {
    errors.push(`File bukan PNG valid: public/${relative}`);
    continue;
  }
  const actualWidth = data.readUInt32BE(16);
  const actualHeight = data.readUInt32BE(20);
  if (actualWidth !== width || actualHeight !== height) {
    errors.push(`Dimensi public/${relative} salah: ${actualWidth}x${actualHeight}, diharapkan ${width}x${height}.`);
  }
  if (!await exists(path.join(distRoot, relative))) errors.push(`PNG tidak tersalin ke dist: ${relative}`);
}

const manifest = JSON.parse(await readFile(path.join(publicRoot, "site.webmanifest"), "utf8"));
for (const icon of manifest.icons ?? []) {
  const relative = icon.src.replace(/^\//, "");
  const file = path.join(publicRoot, relative);
  if (!await exists(file)) errors.push(`Ikon manifest tidak ditemukan: ${icon.src}`);
  if (!await exists(path.join(distRoot, relative))) errors.push(`Ikon manifest tidak tersalin ke dist: ${icon.src}`);
  if (icon.type !== "image/png") errors.push(`Tipe ikon manifest harus image/png: ${icon.src}`);
}

const schoolLogoPath = "1000553256_Real-ESRGANv3-anime_1025_065246.png";
const schoolLogoFile = path.join(publicRoot, schoolLogoPath);
try {
  const logoData = await readFile(schoolLogoFile);
  const validLogoPng = logoData.length >= 24 &&
    logoData.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (!validLogoPng) errors.push(`Logo sekolah bukan PNG valid: public/${schoolLogoPath}`);
  if (!await exists(path.join(distRoot, schoolLogoPath))) errors.push(`Logo sekolah tidak tersalin ke dist: ${schoolLogoPath}`);
} catch {
  errors.push(`Logo sekolah HD tidak ditemukan: public/${schoolLogoPath}`);
}

const securityPath = ".well-known/security.txt";
const securityFile = path.join(publicRoot, securityPath);
const security = await readFile(securityFile, "utf8");
const requiredFields = ["Contact:", "Expires:", "Canonical:"];
for (const field of requiredFields) {
  if (!security.split(/\r?\n/).some((line) => line.startsWith(field))) errors.push(`security.txt kehilangan field ${field}`);
}
const expiresLine = security.split(/\r?\n/).find((line) => line.startsWith("Expires:"));
if (expiresLine && !(Date.parse(expiresLine.slice("Expires:".length).trim()) > Date.now())) {
  errors.push("security.txt sudah kedaluwarsa atau tanggal Expires tidak valid.");
}
const canonicalLine = security.split(/\r?\n/).find((line) => line.startsWith("Canonical:"));
const expectedSecurityUrl = new URL("/.well-known/security.txt", SITE_URL).toString();
if (canonicalLine?.slice("Canonical:".length).trim() !== expectedSecurityUrl) {
  errors.push(`security.txt Canonical harus ${expectedSecurityUrl}`);
}
if (!await exists(path.join(distRoot, securityPath))) errors.push("security.txt tidak tersalin ke dist.");

const allHtmlFiles = await collectHtml(distRoot);
const htmlFiles = [];
for (const file of allHtmlFiles) {
  const relative = path.relative(distRoot, file).split(path.sep).join("/");
  if (!/^google[0-9a-f]+\.html$/i.test(relative)) {
    htmlFiles.push(file);
    continue;
  }
  const filename = path.basename(file);
  const content = await readFile(file, "utf8");
  if (content.trim() !== `google-site-verification: ${filename}`) htmlFiles.push(file);
}
const expectedOgImage = new URL("/1000553256_Real-ESRGANv3-anime_1025_065246.png", SITE_URL).toString();
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  if (!html.includes(`property="og:image" content="${expectedOgImage}"`) &&
      !html.includes(`content="${expectedOgImage}" property="og:image"`)) {
    errors.push(`${path.relative(distRoot, file)} tidak memiliki og:image PNG yang benar.`);
  }
  if (!html.includes('property="og:image:alt"')) errors.push(`${path.relative(distRoot, file)} tidak memiliki og:image:alt.`);
  if (!html.includes('name="twitter:card" content="summary_large_image"')) {
    errors.push(`${path.relative(distRoot, file)} tidak memiliki Twitter summary_large_image.`);
  }
}

if (errors.length) {
  console.error("Asset dan metadata audit gagal:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Asset audit OK: ${expectedPngs.length} PNG signature/dimension checks; ${(manifest.icons ?? []).length} manifest icons; security.txt; OG/Twitter image metadata pada ${htmlFiles.length} halaman.`);
