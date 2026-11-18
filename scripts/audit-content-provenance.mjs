import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), "utf8"));
const archive = await readJson("src/data/archive-index.json");
const dataFiles = [
  "src/data/staff.json",
  "src/data/programs.json",
  "src/data/events.json",
  "src/data/facilities.json",
  "src/data/extracurriculars.json",
  "src/data/school-profile.json",
  "src/data/units.json",
];
const datasets = Object.fromEntries(await Promise.all(
  dataFiles.map(async (file) => [file, await readJson(file)])
));
const errors = [];
const archiveByFile = new Map(archive.items.map((item) => [item.file, item]));

if (archive.totalFiles !== 100 || archive.items.length !== 100) {
  errors.push(`Expected 100 archive records; found ${archive.items.length}.`);
}
if (archiveByFile.size !== archive.items.length) {
  errors.push("Archive index contains duplicate filenames.");
}

let verifiedReferences = 0;
function inspectReferences(value, location) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => inspectReferences(item, `${location}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;

  for (const urlKey of Object.keys(value).filter((key) =>
    key === "url" || key === "sourceUrl" || key.endsWith("SourceUrl")
  )) {
    const fileKey = urlKey === "url" || urlKey === "sourceUrl"
      ? "sourceFile"
      : urlKey.replace(/Url$/, "File");
    const sourceUrl = value[urlKey];
    const sourceFile = value[fileKey];
    if (typeof sourceUrl !== "string" || !sourceUrl.startsWith("http")) continue;
    if (typeof sourceFile !== "string" || !sourceFile) {
      errors.push(`${location}: ${urlKey} has no matching ${fileKey}.`);
      continue;
    }
    const archived = archiveByFile.get(sourceFile);
    if (!archived) {
      errors.push(`${location}: source file ${sourceFile} is absent from archive-index.json.`);
      continue;
    }
    if (archived.sourceUrl !== sourceUrl) {
      errors.push(`${location}: URL mismatch for ${sourceFile}; index has ${archived.sourceUrl}.`);
      continue;
    }
    verifiedReferences += 1;
  }

  for (const [key, child] of Object.entries(value)) {
    inspectReferences(child, location ? `${location}.${key}` : key);
  }
}

for (const [file, dataset] of Object.entries(datasets)) {
  if (!dataset.schemaVersion || !dataset.observedAt) {
    errors.push(`${file}: missing schemaVersion or observedAt metadata.`);
  }
  inspectReferences(dataset, file);
}

const staff = datasets["src/data/staff.json"];
const staffCounts = staff.entries.reduce((counts, item) => {
  counts[item.category] = (counts[item.category] || 0) + 1;
  return counts;
}, {});
if (staff.entries.length !== staff.counts.total ||
    staffCounts.pimpinan !== staff.counts.leadership ||
    staffCounts.guru !== staff.counts.teachers ||
    staffCounts.layanan !== staff.counts.services) {
  errors.push("staff.json category totals do not match its declared counts.");
}
if (new Set(staff.entries.map((item) => item.id)).size !== staff.entries.length) {
  errors.push("staff.json contains duplicate entry IDs.");
}

const programs = datasets["src/data/programs.json"];
if (programs.entries.length !== 10 ||
    new Set(programs.entries.map((item) => item.id)).size !== programs.entries.length) {
  errors.push("programs.json must contain 10 entries with unique IDs.");
}

const events = datasets["src/data/events.json"];
if (events.entries.length !== events.count ||
    new Set(events.entries.map((item) => item.sourceFile)).size !== events.entries.length) {
  errors.push("events.json count or source-file uniqueness check failed.");
}

const facilities = datasets["src/data/facilities.json"];
if (facilities.currentInventory.status !== "not-verified" ||
    facilities.currentInventory.items.length !== 0) {
  errors.push("facilities.json must not imply a verified current inventory.");
}

const extracurriculars = datasets["src/data/extracurriculars.json"];
if (extracurriculars.activities.length !== 0 ||
    !extracurriculars.note || !extracurriculars.source.sourceFile) {
  errors.push("extracurriculars.json must preserve its explicit verification limitation.");
}

const routeBindings = [
  ["src/pages/profil.astro", ["../data/school-profile.json", "../data/programs.json"]],
  ["src/pages/kegiatan.astro", ["../data/events.json"]],
  ["src/pages/fasilitas.astro", ["../data/facilities.json"]],
  ["src/pages/ekstrakurikuler.astro", ["../data/extracurriculars.json"]],
  ["src/pages/unit-sekolah.astro", ["../data/units.json"]],
  ["src/components/DirektoriSDM.jsx", ["../data/staff.json"]],
  ["src/components/DaftarProgram.jsx", ["../data/programs.json"]],
];

for (const [file, imports] of routeBindings) {
  let source;
  try {
    source = await readFile(path.join(root, file), "utf8");
  } catch {
    errors.push(`Missing page/component binding file: ${file}.`);
    continue;
  }
  for (const importPath of imports) {
    if (!source.includes(importPath)) {
      errors.push(`${file}: expected data import ${importPath} is missing.`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Content provenance audit passed: ${verifiedReferences} source references resolve to the 100-record archive index.`);
  console.log(`Route/data bindings passed: ${routeBindings.length} page or component bindings.`);
  console.log(`Dataset checks passed: ${staff.entries.length} staff snapshots, ${programs.entries.length} programs, ${events.entries.length} historical events.`);
  console.log("Unverified current inventory and extracurricular data remain explicitly unverified.");
}
