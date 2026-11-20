import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseIndonesianDateRange } from "../src/utils/formatIndonesianDate.js";

const root = process.cwd();
const script = await readFile(path.join(root, "public/scripts/i18n.js"), "utf8");
const navigation = await readFile(path.join(root, "src/components/Navigasi.astro"), "utf8");
const localeDateScript = await readFile(path.join(root, "public/scripts/locale-dates.js"), "utf8");
const layout = await readFile(path.join(root, "src/layouts/LayoutUtama.astro"), "utf8");
const programDirectory = await readFile(path.join(root, "src/components/DaftarProgram.jsx"), "utf8");
const staffDirectory = await readFile(path.join(root, "src/components/DirektoriSDM.jsx"), "utf8");
const eventsPage = await readFile(path.join(root, "src/pages/kegiatan.astro"), "utf8");
const unitsPage = await readFile(path.join(root, "src/pages/unit-sekolah.astro"), "utf8");
const errors = [];
const localeOptions = [...navigation.matchAll(/<option\s+value="([a-z]{2})"/g)].map((match) => match[1]);
const baseLocaleFiles = {
  en: "public/locales/en-base.json",
  ms: "public/locales/ms-base.json",
  zh: "public/locales/zh-base.json"
};
const extraLocaleFiles = {
  en: ["public/locales/en-extra-1.json", "public/locales/en-extra-2.json", "public/locales/en-extra-3.json", "public/locales/en-extra-4.json"],
  ms: ["public/locales/ms-extra-1.json", "public/locales/ms-extra-2.json", "public/locales/ms-extra-3.json", "public/locales/ms-extra-4.json"],
  zh: ["public/locales/zh-extra-1.json", "public/locales/zh-extra-2.json", "public/locales/zh-extra-3.json", "public/locales/zh-extra-4.json"]
};
const counts = {};
const extraCounts = {};
const expectedCountTranslations = {
  en: { "Menampilkan": "Showing", "dari": "of", "nama program.": "vocational programs." },
  ms: { "Menampilkan": "Menunjukkan", "dari": "daripada", "nama program.": "program vokasional." },
  zh: { "Menampilkan": "显示", "dari": "项，共", "nama program.": "个专业。", "entri yang cocok": "条匹配记录" }
};

for (const locale of ["en", "ms", "zh"]) {
  let base = {};
  try {
    base = JSON.parse(await readFile(path.join(root, baseLocaleFiles[locale]), "utf8"));
  } catch {
    errors.push("Missing or invalid base locale JSON: " + baseLocaleFiles[locale]);
  }
  counts[locale] = Object.keys(base).length;
  if (counts[locale] < 300) errors.push("Base locale dictionary unexpectedly small for " + locale + ": " + counts[locale]);

  const merged = { ...base };
  for (const relativePath of extraLocaleFiles[locale]) {
    try {
      const extra = JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
      Object.assign(merged, extra);
    } catch {
      errors.push("Missing or invalid extra locale JSON: " + relativePath);
    }
  }
  extraCounts[locale] = Object.keys(merged).length - counts[locale];

  for (const key of ["Kegiatan sekolah · arsip publik", "Fasilitas sekolah", "Bursa Kerja Khusus (BKK)"]) {
    if (!Object.prototype.hasOwnProperty.call(merged, key)) errors.push("Missing locale key for " + locale + ": " + key);
  }
  for (const [key, expected] of Object.entries(expectedCountTranslations[locale])) {
    if (base[key] !== expected) errors.push("Missing or incorrect dynamic count translation for " + locale + ": " + key);
  }
  if (Object.values(merged).some((value) => typeof value !== "string" || !value.trim())) {
    errors.push("Locale bundle contains an empty/non-text translation: " + locale);
  }
}

const options = new Set(localeOptions);
if (options.size !== 4 || !["id", "en", "ms", "zh"].every((locale) => options.has(locale))) {
  errors.push("Language picker must expose exactly the supported ID, EN, MY and ZH options.");
}
if (!script.includes('ms: "ms-MY"') || !script.includes('zh: "zh-CN"') || !script.includes('en: "en"')) {
  errors.push("The active document language is not synchronized with ID-ID, EN, MS-MY and ZH-CN locale tags.");
}
if (!script.includes('const KEY = "smkn1mandau-language";')) errors.push("The language preference key is missing.");
if (!script.includes("baseLocaleFiles") || !script.includes("loadExtraTranslations")) errors.push("On-demand locale loading is missing.");

const range = parseIndonesianDateRange("8–10 September 2023");
const single = parseIndonesianDateRange("7 November 2023");
if (range?.start !== "2023-09-08" || range?.end !== "2023-09-10") errors.push("Indonesian date-range parser returned an incorrect ISO range.");
if (single?.start !== "2023-11-07" || single?.end !== null) errors.push("Indonesian single-date parser returned an incorrect ISO date.");
if (parseIndonesianDateRange("September 2023 (date sequence unverified)") !== null) errors.push("Unverified historical date text must remain unparsed.");

if (!localeDateScript.includes("Intl.DateTimeFormat") || !layout.includes('/scripts/locale-dates.js')) errors.push("Locale-aware date formatter is not wired into the shared layout.");
if (!eventsPage.includes("data-locale-date") || !unitsPage.includes("data-locale-date")) errors.push("Historical event/unit dates are not marked for locale formatting.");
if (!programDirectory.includes("Intl.NumberFormat") || !staffDirectory.includes("Intl.NumberFormat")) errors.push("Dynamic program/staff counts are not formatted using the active locale.");
for (const locale of ["id-ID", "en", "ms-MY", "zh-CN"]) {
  try {
    new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date("2023-09-08T12:00:00Z"));
    new Intl.NumberFormat(locale).format(1234567);
  } catch {
    errors.push("Intl locale formatting is unavailable for " + locale);
  }
}

console.log("Localization preflight: on-demand base dictionaries EN=" + counts.en + ", MS=" + counts.ms + ", ZH=" + counts.zh + "; archive/UI extras EN=" + extraCounts.en + ", MS=" + extraCounts.ms + ", ZH=" + extraCounts.zh + ".");
console.log("Locale picker: " + localeOptions.join(", ") + ". Runtime translation does not create separate indexable locale URLs.");
for (const error of errors) console.error("ERROR:", error);
if (errors.length) process.exit(1);
console.log("Localization bundle structure passed; linguistic completeness still requires human review.");
