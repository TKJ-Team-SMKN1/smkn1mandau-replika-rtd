import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { SITE_URL } from "../site-config.mjs";

const outputDirectory = path.resolve("dist");
const excludedRoutes = new Set(["/pengaturan", "/404"]);

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
  const relative = path.relative(outputDirectory, file).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.slice(0, -"index.html".length)}`;
  if (relative.endsWith(".html")) return `/${relative.slice(0, -".html".length)}`;
  return null;
}

const files = await collectHtml(outputDirectory);
const routes = [...new Set(files.map(routeFromFile).filter(Boolean))]
  .filter((route) => !excludedRoutes.has(route))
  .sort((a, b) => a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b));

if (routes.length === 0) throw new Error("Tidak ada halaman HTML untuk sitemap.");

const entries = routes.map((route) => {
  const location = new URL(route, SITE_URL).toString();
  return `  <url><loc>${location.replaceAll("&", "&amp;")}</loc></url>`;
}).join("\n");
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
await writeFile(path.join(outputDirectory, "sitemap.xml"), xml, "utf8");
console.log(`Sitemap generated: ${routes.length} indexable routes.`);
