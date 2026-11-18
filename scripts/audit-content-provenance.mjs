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

const archiveRoot = path.join(root, "data/raw-archive/hasil_scrape_smkn1mandau");
function decodeEntities(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}
function normalizeText(value) {
  return decodeEntities(value)
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .normalize("NFKC")
    .toLocaleLowerCase("id")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
const sourceTextCache = new Map();
async function getSourceText(file) {
  if (!sourceTextCache.has(file)) {
    const html = await readFile(path.join(archiveRoot, file), "utf8");
    sourceTextCache.set(file, normalizeText(html));
  }
  return sourceTextCache.get(file);
}
function requireSourceText(source, expected, label) {
  if (!source.includes(normalizeText(expected))) {
    errors.push(`Source content mismatch: ${label} was not found in its archived HTML.`);
  }
}

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


for (const event of events.entries) {
  if (!Array.isArray(event.sourceEvidenceTerms) || event.sourceEvidenceTerms.length < 2) {
    errors.push(`events.json: ${event.title} is missing source evidence terms.`);
    continue;
  }
  const sourceText = await getSourceText(event.sourceFile);
  for (const term of event.sourceEvidenceTerms) {
    requireSourceText(sourceText, term, `event ${event.title}: ${term}`);
  }
}
if (events.entries.filter((event) => event.dateStatus === "source-date-conflict").length !== 1 ||
    !events.entries.some((event) => event.sourceFile === "063_2023_09_kegiatan-workshop-pembelajaran-guru_html.html" &&
      event.dateStatus === "source-date-conflict")) {
  errors.push("The known September 2023 workshop date conflict must remain explicitly flagged.");
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


const homepageText = await getSourceText("002_index.html");
for (const program of programs.entries) {
  requireSourceText(homepageText, program.nama, `program ${program.singkatan}`);
}

const historyText = await getSourceText("004_2022_04_sejarah-sekolah_html.html");
for (const token of [
  "tahun 1999",
  "SMK Swasta Handayani",
  "05864/109.8.4/MN-2000",
  "08 Juli 2000",
  "Keputusan Bupati Bengkalis No.113 Tahun 2002",
]) {
  requireSourceText(historyText, token, `school history: ${token}`);
}

const identity = datasets["src/data/school-profile.json"].identity;
const identityText = await getSourceText(identity.sourceFile);
for (const token of [
  identity.name,
  "Pipa Air Bersih",
  "Simpang Padang",
  "Bathin Solapan",
  "Bengkalis",
]) {
  requireSourceText(identityText, token, `school identity: ${token}`);
}

const schoolProfile = datasets["src/data/school-profile.json"];
const visionText = await getSourceText(schoolProfile.vision.sourceFile);
requireSourceText(visionText, schoolProfile.vision.text, "school vision");
for (const mission of schoolProfile.mission) {
  requireSourceText(visionText, mission, `school mission: ${mission}`);
}


const units = datasets["src/data/units.json"];
const bkkUnit = units.units.find((unit) => unit.id === "bkk");
const lspUnit = units.units.find((unit) => unit.id === "lsp-p1");
if (!bkkUnit || !lspUnit) {
  errors.push("units.json must contain BKK and LSP-P1 records.");
} else {
  if (bkkUnit.historicalActivities.length !== 7 ||
      bkkUnit.visionMissionStatus !== "no-readable-vision-mission-text-in-archived-html") {
    errors.push("BKK historical activity count or vision-mission archive limitation is missing.");
  }
  for (const activity of bkkUnit.historicalActivities) {
    const sourceText = await getSourceText(activity.sourceFile);
    for (const term of activity.evidenceTerms ?? []) {
      requireSourceText(sourceText, term, `BKK activity ${activity.title}: ${term}`);
    }
  }
  const lspText = await getSourceText(lspUnit.missionSourceFile);
  requireSourceText(lspText, lspUnit.vision, "LSP-P1 vision");
  for (const mission of lspUnit.mission) {
    requireSourceText(lspText, mission, `LSP-P1 mission: ${mission.slice(0, 40)}`);
  }
  const lspUpdateText = await getSourceText(lspUnit.programsSourceFile);
  for (const program of lspUnit.programsIn2023Update) {
    requireSourceText(lspUpdateText, program, `LSP-P1 program: ${program}`);
  }
}


const facilitiesText = await getSourceText(facilities.historicalSnapshot.sourceFile);
for (const term of [
  "22 ruang kelas belajar",
  "1 ruang bengkel bersama",
  "1 ruang labor komputer",
  "2 ruang wc",
  "26 lokal",
  "3 ruang komputer",
  "6 bengkel praktek",
  "1 ruang aula",
  "4 wc siswa",
  "3 wc guru",
  "1 wc kepala sekolah",
  "1 ruang mushalla",
  "jaringan internet yang dilengkapi dengan wifi",
]) {
  requireSourceText(facilitiesText, term, `historical facilities: ${term}`);
}

async function getSourceImageNames(file) {
  const html = await readFile(path.join(archiveRoot, file), "utf8");
  return new Set([...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)/gi)].map((match) => {
    const pathPart = match[1].split(/[?#]/)[0].split("/").pop();
    try { return decodeURIComponent(pathPart).toLowerCase(); }
    catch { return pathPart.toLowerCase(); }
  }));
}
const facilityImageNames = await getSourceImageNames("007_2022_05_fasilitas_html.html");
for (const item of facilities.visualEvidence) {
  if (!facilityImageNames.has(item.sourceFilename.toLowerCase())) {
    errors.push(`Facilities image label ${item.sourceFilename} is absent from archived HTML.`);
  }
}
const extracurricularImageNames = await getSourceImageNames(extracurriculars.source.sourceFile);
for (let index = 1; index <= extracurriculars.visualAssetCount; index += 1) {
  if (!extracurricularImageNames.has(`${index}.jpg`)) {
    errors.push(`Extracurricular image asset ${index}.jpg is absent from archived HTML.`);
  }
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
  console.log(`Source text checks passed: 10 programs, 3 history milestones, school identity, vision, and 6 mission statements.`);
  console.log(`Route/data bindings passed: ${routeBindings.length} page or component bindings.`);
  console.log(`Dataset checks passed: ${staff.entries.length} staff snapshots, ${programs.entries.length} programs, ${events.entries.length} historical events.`);
  console.log("Unverified current inventory and extracurricular data remain explicitly unverified.");
}
