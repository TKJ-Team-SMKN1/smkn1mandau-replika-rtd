import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const script = await readFile(path.join(root, "public/scripts/i18n.js"), "utf8");
const navigation = await readFile(path.join(root, "src/components/Navigasi.astro"), "utf8");
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

console.log("Localization preflight: on-demand base dictionaries EN=" + counts.en + ", MS=" + counts.ms + ", ZH=" + counts.zh + "; archive/UI extras EN=" + extraCounts.en + ", MS=" + extraCounts.ms + ", ZH=" + extraCounts.zh + ".");
console.log("Locale picker: " + localeOptions.join(", ") + ". Runtime translation does not create separate indexable locale URLs.");
for (const error of errors) console.error("ERROR:", error);
if (errors.length) process.exit(1);
console.log("Localization bundle structure passed; linguistic completeness still requires human review.");
