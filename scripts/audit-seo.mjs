import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { SITE_URL } from "../site-config.mjs";

const dist = path.resolve("dist");
const errors = [];
async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtml(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(fullPath);
  }
  return files;
}
function routeFromFile(file) {
  const relative = path.relative(dist, file).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.slice(0, -"index.html".length)}`;
  if (relative.endsWith(".html")) return `/${relative.slice(0, -".html".length)}`;
  return null;
}

const [sitemap, robots, htmlFiles] = await Promise.all([
  readFile(path.join(dist, "sitemap.xml"), "utf8"),
  readFile(path.join(dist, "robots.txt"), "utf8"),
  collectHtml(dist)
]);
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\\/loc>/g)].map((match) => match[1]);
if (sitemapUrls.length === 0) errors.push("Sitemap tidak memiliki URL.");
if (new Set(sitemapUrls).size !== sitemapUrls.length) errors.push("Sitemap memiliki URL duplikat.");
for (const value of sitemapUrls) {
  try {
    const url = new URL(value);
    if (url.origin !== new URL(SITE_URL).origin) errors.push(`Origin sitemap tidak sesuai: ${value}`);
    if (url.pathname === "/pengaturan" || url.pathname === "/pengaturan/") errors.push("Halaman pengaturan tidak boleh masuk sitemap.");
  } catch { errors.push(`URL sitemap tidak valid: ${value}`); }
}
if (!robots.includes(`Sitemap: ${new URL("/sitemap.xml", SITE_URL)}`)) errors.push("robots.txt tidak menunjuk sitemap yang benar.");
if (!robots.includes("Allow: /")) errors.push("robots.txt harus mengizinkan halaman publik.");

for (const file of htmlFiles) {
  const route = routeFromFile(file);
  if (!route || route === "/404") continue;
  const html = await readFile(file, "utf8");
  const canonicalMatches = [...html.matchAll(/<link\\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/gi)];
  if (canonicalMatches.length !== 1) {
    errors.push(`${route}: harus memiliki tepat satu canonical (ditemukan ${canonicalMatches.length}).`);
    continue;
  }
  const expected = new URL(route, SITE_URL).toString();
  if (canonicalMatches[0][1] !== expected) errors.push(`${route}: canonical tidak cocok dengan ${expected}.`);
  const hasNoindex = /<meta\\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
  if (route === "/pengaturan" && !hasNoindex) errors.push("Halaman pengaturan harus noindex.");
  if (route !== "/pengaturan" && hasNoindex) errors.push(`${route}: halaman publik tidak terduga noindex.`);
}

if (errors.length) {
  console.error("SEO preflight gagal:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`SEO preflight OK: ${sitemapUrls.length} sitemap URLs; ${htmlFiles.length} HTML files checked.`);
