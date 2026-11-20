import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { SITE_URL } from "../site-config.mjs";

const dist = path.resolve("dist");
const errors = [];
const canonicalUrls = [];
const seenTitles = new Map();

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

async function isGoogleVerificationFile(file) {
  const relative = path.relative(dist, file).split(path.sep).join("/");
  if (!/^google[0-9a-f]+\.html$/i.test(relative)) return false;
  const filename = path.basename(file);
  const content = await readFile(file, "utf8");
  return content.trim() === `google-site-verification: ${filename}`;
}

function routeFromFile(file) {
  const relative = path.relative(dist, file).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.slice(0, -"index.html".length)}`;
  if (relative.endsWith(".html")) return `/${relative.slice(0, -".html".length)}`;
  return null;
}

function tagsWithAttribute(html, tagName, attribute, value) {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<${tagName}\\b[^>]*\\b${attribute}=["']${escaped}["'][^>]*>`, "gi");
  return [...html.matchAll(pattern)].map((match) => match[0]);
}

function attributeValue(tag, attribute) {
  const match = tag.match(new RegExp(`\\b${attribute}=["']([^"']*)["']`, "i"));
  return match?.[1] ?? null;
}

const [sitemap, robots, allHtmlFiles] = await Promise.all([
  readFile(path.join(dist, "sitemap.xml"), "utf8"),
  readFile(path.join(dist, "robots.txt"), "utf8"),
  collectHtml(dist)
]);
const htmlFiles = [];
for (const file of allHtmlFiles) {
  if (!await isGoogleVerificationFile(file)) htmlFiles.push(file);
}
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
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

  const titleMatches = [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)];
  if (titleMatches.length !== 1 || !titleMatches[0][1].trim()) {
    errors.push(`${route}: harus memiliki tepat satu judul halaman yang tidak kosong.`);
  } else {
    const title = titleMatches[0][1].trim();
    const previousRoute = seenTitles.get(title);
    if (previousRoute) errors.push(`${route}: judul duplikat dengan ${previousRoute}.`);
    else seenTitles.set(title, route);
  }

  const descriptionTags = tagsWithAttribute(html, "meta", "name", "description");
  if (descriptionTags.length !== 1 || !attributeValue(descriptionTags[0] ?? "", "content")?.trim()) {
    errors.push(`${route}: harus memiliki tepat satu meta description yang tidak kosong.`);
  }

  const canonicalTags = tagsWithAttribute(html, "link", "rel", "canonical");
  if (canonicalTags.length !== 1) {
    errors.push(`${route}: harus memiliki tepat satu canonical (ditemukan ${canonicalTags.length}).`);
  } else {
    const canonical = attributeValue(canonicalTags[0], "href");
    const expected = new URL(route, SITE_URL).toString();
    if (canonical !== expected) errors.push(`${route}: canonical tidak cocok dengan ${expected}.`);
    else canonicalUrls.push(canonical);
  }

  const sitemapLinks = tagsWithAttribute(html, "link", "rel", "sitemap");
  if (sitemapLinks.length !== 1 || attributeValue(sitemapLinks[0] ?? "", "href") !== "/sitemap.xml") {
    errors.push(`${route}: harus menautkan /sitemap.xml melalui rel=sitemap.`);
  }

  for (const property of ["og:title", "og:description", "og:url", "og:image"]) {
    const tags = tagsWithAttribute(html, "meta", "property", property);
    if (tags.length !== 1 || !attributeValue(tags[0] ?? "", "content")?.trim()) {
      errors.push(`${route}: metadata ${property} harus tersedia tepat satu kali dan tidak kosong.`);
    }
    if (property === "og:url" && tags.length === 1) {
      const canonical = canonicalTags.length === 1 ? attributeValue(canonicalTags[0], "href") : null;
      if (attributeValue(tags[0], "content") !== canonical) errors.push(`${route}: og:url harus sama dengan canonical.`);
    }
    if (property === "og:image" && tags.length === 1) {
      const expectedImage = new URL("/android-chrome-512x512.png", SITE_URL).toString();
      if (attributeValue(tags[0], "content") !== expectedImage) errors.push(`${route}: og:image harus menunjuk PNG social preview yang benar.`);
      const altTags = tagsWithAttribute(html, "meta", "property", "og:image:alt");
      if (altTags.length !== 1 || !attributeValue(altTags[0] ?? "", "content")?.trim()) {
        errors.push(`${route}: og:image:alt harus tersedia tepat satu kali dan tidak kosong.`);
      }
    }
  }

  const twitterCards = tagsWithAttribute(html, "meta", "name", "twitter:card");
  if (twitterCards.length !== 1 || attributeValue(twitterCards[0] ?? "", "content") !== "summary_large_image") {
    errors.push(`${route}: twitter:card harus memiliki satu nilai summary.`);
  }

  const twitterImages = tagsWithAttribute(html, "meta", "name", "twitter:image");
  const expectedTwitterImage = new URL("/android-chrome-512x512.png", SITE_URL).toString();
  if (twitterImages.length !== 1 || attributeValue(twitterImages[0] ?? "", "content") !== expectedTwitterImage) {
    errors.push(`${route}: twitter:image harus menunjuk PNG social preview yang benar.`);
  }

  const robotsTags = tagsWithAttribute(html, "meta", "name", "robots");
  if (robotsTags.length !== 1) errors.push(`${route}: harus memiliki tepat satu meta robots.`);
  const robotsContent = attributeValue(robotsTags[0] ?? "", "content")?.toLowerCase() ?? "";
  const isSettingsRoute = route === "/pengaturan" || route === "/pengaturan/";
  if (isSettingsRoute && !robotsContent.includes("noindex")) errors.push("Halaman pengaturan harus noindex.");
  if (!isSettingsRoute && robotsContent.includes("noindex")) errors.push(`${route}: halaman publik tidak terduga noindex.`);
}

const indexableCanonicalUrls = canonicalUrls.filter((url) => {
  const pathname = new URL(url).pathname;
  return pathname !== "/pengaturan" && pathname !== "/pengaturan/" && pathname !== "/404";
});
const sitemapSet = new Set(sitemapUrls);
for (const url of indexableCanonicalUrls) {
  if (!sitemapSet.has(url)) errors.push(`Canonical halaman publik tidak ada di sitemap: ${url}`);
}
for (const url of sitemapUrls) {
  if (!indexableCanonicalUrls.includes(url)) errors.push(`Sitemap memuat URL yang bukan canonical halaman publik: ${url}`);
}

if (errors.length) {
  console.error("SEO preflight gagal:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`SEO preflight OK: ${sitemapUrls.length} canonical sitemap URLs; ${htmlFiles.length} public HTML files checked; Google Search Console verification files excluded; unique titles and descriptions, Open Graph, Twitter Card, and sitemap discovery validated.`);
