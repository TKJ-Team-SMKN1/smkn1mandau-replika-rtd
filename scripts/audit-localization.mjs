import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const script = await readFile(path.join(root, "public/scripts/i18n.js"), "utf8");
const navigation = await readFile(path.join(root, "src/components/Navigasi.astro"), "utf8");
const errors = [];
const localeOptions = [...navigation.matchAll(/<option\s+value="([a-z]{2})"/g)].map((match) => match[1]);
const declared = [...script.matchAll(/^\s{4}([a-z]{2}):\s*\{/gm)];
const counts = {};

for (let index = 0; index < declared.length; index += 1) {
  const locale = declared[index][1];
  const start = declared[index].index + declared[index][0].length - 1;
  const end = index + 1 < declared.length ? declared[index + 1].index : script.indexOf("\n  };", start);
  const block = script.slice(start, end < 0 ? script.length : end);
  counts[locale] = (block.match(/"(?:\\.|[^"\\])*"\s*:/g) || []).length;
}

for (const locale of ["ms", "zh"]) {
  const marker = "Object.assign(translations." + locale + ", {";
  const start = script.indexOf(marker);
  if (start >= 0) {
    const end = script.indexOf("});", start);
    const block = script.slice(start + marker.length, end < 0 ? script.length : end);
    counts[locale] = (counts[locale] || 0) + (block.match(/"(?:\\.|[^"\\])*"\s*:/g) || []).length;
  }
}

const options = new Set(localeOptions);
if (options.size !== 4 || !["id", "en", "ms", "zh"].every((locale) => options.has(locale))) {
  errors.push("Language picker must expose exactly the supported ID, EN, MY and ZH options.");
}
const countFragments = {
  en: ['"Menampilkan": "Showing"', '"dari": "of"', '"nama program.": "vocational programs."'],
  ms: ['"Menampilkan": "Menunjukkan"', '"dari": "daripada"', '"nama program.": "program vokasional."'],
  zh: ['"Menampilkan": "显示"', '"dari": "项，共"', '"nama program.": "个专业。"', '"entri yang cocok": "条匹配记录"'],
};
for (const [locale, fragments] of Object.entries(countFragments)) {
  for (const fragment of fragments) {
    if (!script.includes(fragment)) errors.push("Missing localized dynamic count fragment for " + locale + ": " + fragment);
  }
}

for (const locale of ["en", "ms", "zh"]) {
  if (!declared.some((match) => match[1] === locale) || !counts[locale]) {
    errors.push("Missing or empty translation dictionary: " + locale);
  }
}
if (!script.includes('ms: "ms-MY"') || !script.includes('zh: "zh-CN"') || !script.includes('en: "en"')) {
  errors.push("The active document language is not synchronized with ID-ID, EN, MS-MY and ZH-CN locale tags.");
}
if (!script.includes('const KEY = "smkn1mandau-language";')) {
  errors.push("The language preference key is missing.");
}

console.log("Localization catalog preflight: ID is the source language; translated entries EN=" + (counts.en || 0) + ", MS=" + (counts.ms || 0) + ", ZH=" + (counts.zh || 0) + ".");
console.log("Locale picker: " + localeOptions.join(", ") + ". Runtime translation does not create separate indexable locale URLs.");
for (const error of errors) console.error("ERROR:", error);
if (errors.length) process.exit(1);
console.log("Localization catalog structure passed; linguistic completeness still requires human review.");
