import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseIndonesianDateRange } from "../src/utils/formatIndonesianDate.js";

const root = process.cwd();
const readJson = async (relativePath) =>
  JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
const readText = async (relativePath) =>
  readFile(path.join(root, relativePath), "utf8");
const script = await readText("public/scripts/i18n.js");
const navigation = await readText("src/components/Navigasi.astro");
const localeDateScript = await readText("public/scripts/locale-dates.js");
const layout = await readText("src/layouts/LayoutUtama.astro");
const programDirectory = await readText("src/components/DaftarProgram.jsx");
const staffDirectory = await readText("src/components/DirektoriSDM.jsx");
const eventsPage = await readText("src/pages/kegiatan.astro");
const unitsPage = await readText("src/pages/unit-sekolah.astro");
const errors = [];

const expectedLocales = [
  "id-ID", "en-US", "en-GB", "en-AU", "en-CA", "en-SG",
  "ms-MY", "ms-SG", "zh-CN", "zh-SG", "ko-KR", "ja-JP", "ta-SG"
];
const localeOptions = [...navigation.matchAll(/<option\s+value="([a-z]{2}(?:-[A-Z]{2})?)"/g)].map((match) => match[1]);
const sourceKeys = await readJson("public/locales/id-source-keys.json");

const localeFiles = {
  "en": [
    "public/locales/en-base.json",
    "public/locales/en-extra-1.json",
    "public/locales/en-extra-2.json",
    "public/locales/en-extra-3.json",
    "public/locales/en-extra-4.json"
  ],
  "ms": [
    "public/locales/ms-base.json",
    "public/locales/ms-extra-1.json",
    "public/locales/ms-extra-2.json",
    "public/locales/ms-extra-3.json",
    "public/locales/ms-extra-4.json",
    "public/locales/ms-completion.json"
  ],
  "zh": [
    "public/locales/zh-base.json",
    "public/locales/zh-extra-1.json",
    "public/locales/zh-extra-2.json",
    "public/locales/zh-extra-3.json",
    "public/locales/zh-extra-4.json",
    "public/locales/zh-completion.json"
  ],
  "ja": Array.from({ length: 13 }, (_, i) => `public/locales/ja-${String(i + 1).padStart(2, "0")}.json`),
  "ko": Array.from({ length: 13 }, (_, i) => `public/locales/ko-${String(i + 1).padStart(2, "0")}.json`),
  "ta": Array.from({ length: 13 }, (_, i) => `public/locales/ta-${String(i + 1).padStart(2, "0")}.json`)
};

const dictionaries = {};
for (const [locale, files] of Object.entries(localeFiles)) {
  const merged = {};
  for (const relativePath of files) {
    try {
      const chunk = await readJson(relativePath);
      if (!chunk || typeof chunk !== "object" || Array.isArray(chunk)) {
        errors.push("Locale chunk is not a JSON object: " + relativePath);
        continue;
      }
      Object.assign(merged, chunk);
    } catch {
      errors.push("Missing or invalid locale JSON: " + relativePath);
    }
  }
  dictionaries[locale] = merged;
  const missing = sourceKeys.filter((key) => !Object.prototype.hasOwnProperty.call(merged, key));
  if (missing.length) errors.push(locale + " is missing " + missing.length + " source keys; first missing: " + missing.slice(0, 5).join(" | "));
  if (Object.values(merged).some((value) => typeof value !== "string" || !value.trim())) {
    errors.push("Locale bundle contains an empty/non-text translation: " + locale);
  }
}

const reviewedOverrides = {
  ja: await readJson("public/locales/ja-overrides.json"),
  ko: await readJson("public/locales/ko-overrides.json"),
  ta: await readJson("public/locales/ta-overrides.json")
};
const expectedReviewedTerms = {
  ja: { "Arsip": "アーカイブ", "Kanal resmi": "公式チャンネル" },
  ko: { "Aksi utama": "주요 동작", "Arsip": "아카이브", "Kanal resmi": "공식 채널" },
  ta: {
    "Bahasa pemrograman": "நிரலாக்க மொழிகள்",
    "Markup": "குறியிடல்",
    "Styling": "பாணியமைத்தல்",
    "Query": "வினவல்",
    "Kanal resmi": "அதிகாரப்பூர்வ சேனல்",
    "Arsip": "காப்பகம்"
  }
};
for (const [locale, expected] of Object.entries(expectedReviewedTerms)) {
  for (const [key, value] of Object.entries(expected)) {
    if (reviewedOverrides[locale][key] !== value) {
      errors.push("Missing reviewed terminology override for " + locale + ": " + key);
    }
  }
}

const expectedCountTranslations = {
  en: { "Menampilkan": "Showing", "dari": "of", "nama program.": "vocational programs." },
  ms: { "Menampilkan": "Menunjukkan", "dari": "daripada", "nama program.": "program vokasional." },
  zh: { "Menampilkan": "显示", "dari": "项，共", "nama program.": "个专业。", "entri yang cocok": "条匹配记录" },
  ja: { "Menampilkan": "表示：", "dari": "件中", "nama program.": "件の専門課程。" },
  ko: { "Menampilkan": "표시:", "dari": "개 중", "nama program.": "개 전공 프로그램." }
};
for (const [locale, expected] of Object.entries(expectedCountTranslations)) {
  const base = locale === "ja" || locale === "ko"
    ? await readJson(`public/locales/${locale}-overrides.json`)
    : await readJson(`public/locales/${locale}-base.json`);
  for (const [key, value] of Object.entries(expected)) {
    if (base[key] !== value) errors.push("Missing or incorrect dynamic count translation for " + locale + ": " + key);
  }
}

const options = new Set(localeOptions);
if (options.size !== expectedLocales.length || expectedLocales.some((locale) => !options.has(locale))) {
  errors.push("Language picker must expose exactly these 13 BCP 47 locales: " + expectedLocales.join(", "));
}
for (const locale of expectedLocales) {
  if (!script.includes('"' + locale + '"')) errors.push("Runtime locale configuration is missing " + locale);
}
for (const legacy of ['id: "id-ID"', 'en: "en-US"', 'ms: "ms-MY"', 'zh: "zh-CN"']) {
  if (!script.includes(legacy)) errors.push("Legacy language preference alias is missing: " + legacy);
}
if (!script.includes('const KEY = "smkn1mandau-language";')) errors.push("The language preference key is missing.");
if (!script.includes("localeConfigs") || !script.includes("loadExtraTranslations") || !script.includes("config.overrides")) {
  errors.push("On-demand locale loading or regional overrides are missing.");
}

const range = parseIndonesianDateRange("8–10 September 2023");
const single = parseIndonesianDateRange("7 November 2023");
if (range?.start !== "2023-09-08" || range?.end !== "2023-09-10") errors.push("Indonesian date-range parser returned an incorrect ISO range.");
if (single?.start !== "2023-11-07" || single?.end !== null) errors.push("Indonesian single-date parser returned an incorrect ISO date.");
if (parseIndonesianDateRange("September 2023 (date sequence unverified)") !== null) errors.push("Unverified historical date text must remain unparsed.");

if (!localeDateScript.includes("Intl.DateTimeFormat") || !layout.includes('/scripts/locale-dates.js')) errors.push("Locale-aware date formatter is not wired into the shared layout.");
if (!eventsPage.includes("data-locale-date") || !unitsPage.includes("data-locale-date")) errors.push("Historical event/unit dates are not marked for locale formatting.");
if (!programDirectory.includes("Intl.NumberFormat") || !staffDirectory.includes("Intl.NumberFormat")) errors.push("Dynamic program/staff counts are not formatted using the active locale.");

for (const locale of expectedLocales) {
  try {
    new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date("2023-09-08T12:00:00Z"));
    new Intl.NumberFormat(locale).format(1234567);
  } catch {
    errors.push("Intl locale formatting is unavailable for " + locale);
  }
}

console.log("Localization preflight: source keys=" + sourceKeys.length + "; EN=" + Object.keys(dictionaries.en).length + ", MS=" + Object.keys(dictionaries.ms).length + ", ZH=" + Object.keys(dictionaries.zh).length + ", JA=" + Object.keys(dictionaries.ja).length + ", KO=" + Object.keys(dictionaries.ko).length + ", TA=" + Object.keys(dictionaries.ta).length + ".");
console.log("Locale picker: " + localeOptions.join(", ") + ". Runtime translation does not create separate indexable locale URLs.");
for (const error of errors) console.error("ERROR:", error);
if (errors.length) process.exit(1);
console.log("Localization bundle structure passed; linguistic completeness still requires human review.");
