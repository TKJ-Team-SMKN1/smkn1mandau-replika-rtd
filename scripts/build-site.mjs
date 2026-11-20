import { access, mkdir, rename, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const archiveRoot = path.join(root, "node_modules", ".cache", "smkn1-cjk-static-fonts");
const directories = [
  [path.join(root, "public/fonts/noto-sans-sc/static"), path.join(archiveRoot, "noto-sans-sc/static")],
  [path.join(root, "public/fonts/noto-sans-tc/static"), path.join(archiveRoot, "noto-sans-tc/static")]
];

async function exists(target) {
  try { await access(target); return true; } catch (error) { if (error.code === "ENOENT") return false; throw error; }
}

function run(label, command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32"
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(label + " failed with exit code " + result.status);
}

const moved = [];
try {
  for (const [source, archived] of directories) {
    if (await exists(archived) && !(await exists(source))) {
      await mkdir(path.dirname(source), { recursive: true });
      await rename(archived, source);
    }
  }
  await rm(archiveRoot, { recursive: true, force: true });

  for (const [source, archived] of directories) {
    if (!(await exists(source))) continue;
    await mkdir(path.dirname(archived), { recursive: true });
    await rename(source, archived);
    moved.push([source, archived]);
  }

  const astro = path.join(root, "node_modules", ".bin", process.platform === "win32" ? "astro.cmd" : "astro");
  run("Astro build", astro, ["build"]);
  run("Built font audit", process.execPath, ["scripts/audit-built-fonts.mjs"]);
  run("Sitemap generation", process.execPath, ["scripts/generate-sitemap.mjs"]);
  run("PNG, social preview, and security.txt audit", process.execPath, ["scripts/audit-assets.mjs"]);
} finally {
  for (const [source, archived] of moved.reverse()) {
    if (await exists(archived)) {
      await mkdir(path.dirname(source), { recursive: true });
      await rename(archived, source);
    }
  }
  await rm(archiveRoot, { recursive: true, force: true });
}
