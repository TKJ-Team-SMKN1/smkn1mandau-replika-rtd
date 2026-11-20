import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");
const fontsRoot = path.join(publicRoot, "fonts");

if (process.env.MATERIALIZE_LFS_FONTS === "0") {
  console.log("Font materialization skipped by MATERIALIZE_LFS_FONTS=0.");
  process.exit(0);
}

const css = await readFile(path.join(root, "src/styles/font-library.css"), "utf8");
const referencedUrls = [...css.matchAll(/url\(\s*["']([^"']+)["']\s*\)/g)]
  .map((match) => match[1])
  .filter((url) => url.startsWith("/fonts/"));
const uniqueUrls = [...new Set(referencedUrls)];
if (!uniqueUrls.length) throw new Error("No local font URLs were found in font-library.css.");

const ref = process.env.FONT_LFS_REF || process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || "main";
const concurrency = Math.max(1, Math.min(6, Number(process.env.FONT_LFS_CONCURRENCY || 4)));
const queue = [...uniqueUrls];
let materialized = 0;
let alreadyReal = 0;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const encodeSegment = (value) => encodeURIComponent(value).replace(/[!'()*]/g, (char) => "%" + char.charCodeAt(0).toString(16).toUpperCase());

async function materialize(urlPath) {
  const relativePath = decodeURIComponent(urlPath.replace(/^\//, ""));
  const filePath = path.resolve(publicRoot, relativePath);
  if (!filePath.startsWith(fontsRoot + path.sep)) throw new Error("Font path escaped public/fonts: " + urlPath);

  const pointer = await readFile(filePath, "utf8");
  if (!pointer.startsWith("version https://git-lfs.github.com/spec/v1")) {
    alreadyReal += 1;
    return;
  }

  const oid = pointer.match(/^oid sha256:([a-f0-9]{64})$/m)?.[1];
  const expectedSize = Number(pointer.match(/^size (\d+)$/m)?.[1]);
  if (!oid || !Number.isSafeInteger(expectedSize) || expectedSize <= 0) {
    throw new Error("Malformed Git LFS pointer: " + urlPath);
  }

  const encodedPath = relativePath.split("/").map(encodeSegment).join("/");
  const mediaUrl = "https://media.githubusercontent.com/media/TKJ-Team-SMKN1/smkn1mandau-replika-rtd/" + encodeSegment(ref) + "/" + encodedPath;
  let response;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      response = await fetch(mediaUrl, { headers: { Accept: "application/octet-stream" } });
      if (response.ok) break;
      if (attempt === 2) throw new Error("LFS download failed (" + response.status + "): " + urlPath);
    } catch (error) {
      if (attempt === 2) throw error;
    }
    await delay(350 * (attempt + 1));
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.byteLength !== expectedSize) {
    throw new Error("LFS size mismatch for " + urlPath + ": expected " + expectedSize + ", received " + bytes.byteLength);
  }
  const actualOid = createHash("sha256").update(bytes).digest("hex");
  if (actualOid !== oid) throw new Error("LFS SHA-256 mismatch for " + urlPath);

  const magic = bytes.subarray(0, 4).toString("hex");
  if (magic !== "4f54544f" && magic !== "00010000") {
    throw new Error("Downloaded file is not a valid OpenType font: " + urlPath);
  }

  await writeFile(filePath, bytes);
  materialized += 1;
}

async function worker() {
  while (queue.length) {
    const next = queue.shift();
    await materialize(next);
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
console.log("LFS font materialization complete: " + materialized + " downloaded, " + alreadyReal + " already real, " + uniqueUrls.length + " referenced OTF assets. Ref: " + ref);
