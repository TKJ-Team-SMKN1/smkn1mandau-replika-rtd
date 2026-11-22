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
  ta: await readJson("public/locales/ta-overrides.json"),
  ms: await readJson("public/locales/ms-completion.json"),
  zh: await readJson("public/locales/zh-completion.json")
};
const expectedReviewedTerms = {
  ja: {
    "Kejuruan yang menyiapkan ": "職業教育は、",
    "tangan,": "実践力を育て、",
    " bukan hanya nilai rapor.": "成績表の点数だけにとどまりません。",
    "Arsip": "アーカイブ", "Kanal resmi": "公式チャンネル",
    "Visi": "ビジョン", "Misi": "ミッション", "Arah sekolah": "学校の方針",
    "Akademik": "学業", "dalam rumpun ": "分野："
  },
  ko: {
    "Kejuruan yang menyiapkan ": "직업교육은 ",
    "tangan,": "실무 역량을 기르고,",
    " bukan hanya nilai rapor.": "성적표의 점수에만 머무르지 않습니다.",
    "Aksi utama": "주요 동작", "Arsip": "아카이브", "Kanal resmi": "공식 채널",
    "Visi": "비전", "Misi": "사명", "Arah sekolah": "학교의 방향",
    "Akademik": "학업", "dalam rumpun ": "계열: "
  },
  ms: {
    "dalam rumpun ": "dalam bidang ",
    "Pameran Pekerjaan Khusus (BKK)": "Bursa Kerja Khusus (BKK)"
  },
  zh: {
    "Visi": "愿景", "Misi": "使命", "Arah sekolah": "学校发展方向",
    "Akademik": "学业", "dalam rumpun ": "所属领域：",
    "Pameran Pekerjaan Khusus (BKK)": "Bursa Kerja Khusus（BKK）"
  },
  ta: {
    "Tema": "தீம்",
    "Kejuruan yang menyiapkan ": "தொழிற்கல்வி ",
    "tangan,": "செய்முறைத் திறன்களை வளர்த்து,",
    " bukan hanya nilai rapor.": "மதிப்பெண்களுடன் மட்டும் நின்றுவிடுவதில்லை.",
    "Pendidikan dalam angka": "கல்விப் புள்ளிவிவரங்கள்",
    "Bertumbuh.": "வளருங்கள்.",
    "Dokumentasi": "ஆவணங்கள்",
    "yang memadai di bengkel maupun laboratorium sekolah.": "பள்ளிப் பயிற்சிப் பட்டறைகள் மற்றும் ஆய்வகங்களில் போதுமான வசதிகள்.",
    "Kenali fungsi setiap teknologi dan mulai dari dokumentasi resminya.": "அதிகாரப்பூர்வ ஆவணங்களைப் பயன்படுத்தி ஒவ்வொரு தொழில்நுட்பத்தின் செயல்பாடுகளையும் அறிந்துகொள்ளுங்கள்.",
    "Riwayat sekolah": "பள்ளியின் வரலாறு",
    "Gedung sekolah berdiri": "பள்ளிக் கட்டிடம் கட்டப்பட்டது",
    "@aria-label:Hapus pencarian": "@aria-label:தேடலை அழிக்கவும்",
    "@placeholder:Contoh: TKJ, listrik, otomotif...": "@placeholder:எ.கா.: TKJ, மின்சாரம், வாகனத் தொழில்நுட்பம்...",
    "Visi": "பார்வை",
    "Misi": "நோக்கம்",
    "Arah sekolah": "பள்ளியின் திசைநோக்கு",
    "Akademik": "கல்வி",
    "dalam rumpun ": "துறையில் ",
    "Program Keahlian": "தொழிற்கல்வித் திட்டங்கள்",
    "Program keahlian": "தொழிற்கல்வித் திட்டங்கள்",
    "Cari program keahlian": "தொழிற்கல்வித் திட்டங்களைத் தேடுங்கள்",
    "Program tidak ditemukan": "தொழிற்கல்வித் திட்டம் கிடைக்கவில்லை",
    "Jelajahi halaman program": "தொழிற்கல்வித் திட்டப் பக்கத்தைப் பாருங்கள்",
    "Halaman ini merangkum informasi publik tentang Bursa Kerja Khusus (BKK) dan Lembaga Sertifikasi Profesi (LSP-P1) yang tercatat dalam arsip sekolah.": "இந்தப் பக்கம், பள்ளி ஆவணக்காப்பகத்தில் பதிவுசெய்யப்பட்டுள்ள Bursa Kerja Khusus (BKK) எனப்படும் சிறப்பு வேலைவாய்ப்பு சேவை மையம் மற்றும் தொழில்முறைத் திறன் சான்றளிப்பு நிறுவனம் (LSP-P1) பற்றிய பொதுத் தகவல்களைச் சுருக்கமாக வழங்குகிறது.",
    "Bahasa pemrograman": "நிரலாக்க மொழிகள்",
    "Markup": "குறியிடல்",
    "Styling": "பாணியமைத்தல்",
    "Query": "வினவல்",
    "Kanal resmi": "அதிகாரப்பூர்வ சேனல்",
    "Arsip": "காப்பகம்",
    "Pameran Pekerjaan Khusus (BKK)": "Bursa Kerja Khusus (BKK)"
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
if (!script.includes("translateSubtree(document.body, {})") || !script.includes('activeLanguage = "id-ID";')) {
  errors.push("Failed locale loading must restore Indonesian source text and language state.");
}
if (!script.includes("localeConfigs") || !script.includes("loadExtraTranslations") || !script.includes("config.overrides")) {
  errors.push("On-demand locale loading or regional overrides are missing.");
}
for (const path of [
  "public/locales/en-GB-overrides.json",
  "public/locales/en-CA-overrides.json",
  "public/locales/ms-SG-overrides.json",
  "public/locales/zh-SG-overrides.json"
]) {
  try {
    const regional = await readJson(path);
    if (!regional || typeof regional !== "object" || Array.isArray(regional)) errors.push("Regional override must be a JSON object: " + path);
  } catch {
    errors.push("Missing or invalid regional override file: " + path);
  }
}
if (!programDirectory.includes('locale === "ta-SG"') || !programDirectory.includes("தொழிற்கல்வித் திட்டங்கள் காட்டப்படுகின்றன")) {
  errors.push("Tamil vocational programme count must use a complete Tamil sentence.");
}
if (!staffDirectory.includes('locale === "ta-SG"') || !staffDirectory.includes("பொருந்தும் பதிவுகள் காட்டப்படுகின்றன")) {
  errors.push("Tamil staff count must use a complete Tamil sentence.");
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
