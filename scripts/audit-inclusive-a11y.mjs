import { readFile } from "node:fs/promises";

const required = [
  ["src/layouts/LayoutUtama.astro", [
    'name="google-site-verification"',
    'FXEeMYJjK8H-7Umv_-T9nwn6mB3St0NFqROlj15T4SY',
    'AksesibilitasKontrol'
  ]],
  ["src/components/AksesibilitasKontrol.astro", [
    'aria-expanded="false"',
    'aria-live="polite"',
    'data-a11y-toggle="contrast"',
    'data-a11y-toggle="motion"',
    'data-a11y-toggle="reading"',
    'data-a11y-toggle="color"',
    'data-a11y-cvd-profile',
    'data-a11y-cvd-strength',
    'P09 — Penyesuaian pribadi',
    'validProfiles = ["P00","P01","P02","P03","P04","P05","P06","P07","P08","P09"]',
    'textSteps = [100, 112, 124, 136, 148, 160, 172, 184, 196, 200]',
    'data-a11y-action="text-up"',
    'data-a11y-action="reset"'
  ]],
  ["src/styles/redesign.css", [
    'html[data-a11y-contrast]',
    'html[data-a11y-motion]',
    'html[data-a11y-reading]',
    'html[data-a11y-color]',
    'html[data-cvd-active]',
    'html[data-cvd-profile="P07"]',
    'html[data-cvd-profile="P08"]',
    'html[data-a11y-text="200"]',
    '@media(forced-colors:active)'
  ]],
  ["src/pages/aksesibilitas.astro", [
    'Tuli dan pengguna nonverbal',
    'Autisme dan kebutuhan kognitif',
    'Fotosensitivitas dan kejang',
    'Buta warna'
  ]],
  ["docs/INCLUSIVE-ACCESSIBILITY-REQUIREMENTS.md", [
    'three-flashes-per-second',
    'single preferred presentation',
    'Release verification'
  ]]
];
const errors = [];
for (const [file, needles] of required) {
  let content = "";
  try { content = await readFile(file, "utf8"); }
  catch { errors.push("Missing required file: " + file); continue; }
  for (const needle of needles) if (!content.includes(needle)) errors.push(file + " missing: " + needle);
}
for (const locale of ["en", "ms", "zh"]) {
  const file = "public/locales/" + locale + "-base.json";
  try {
    const dictionary = JSON.parse(await readFile(file, "utf8"));
    for (const key of [
      "Profil adaptasi warna",
      "Kekuatan penanda",
      "Profil adalah titik awal pengaturan tampilan, bukan tes atau diagnosis. Semua profil memakai penanda non-warna yang konsisten; preset klinis belum mengubah hue secara otomatis karena palet universal per diagnosis belum tervalidasi. Pilih kekuatan penanda sesuai kenyamanan. Informasi penting tetap tidak boleh dibedakan melalui warna saja.",
      "P00 — Default aksesibel",
      "P01 — Bantuan protanomaly",
      "P02 — Bantuan protanopia",
      "P03 — Bantuan deuteranomaly",
      "P04 — Bantuan deuteranopia",
      "P05 — Bantuan tritanomaly",
      "P06 — Bantuan tritanopia",
      "P07 — Ramah monokrom",
      "P08 — Distingsi kuat",
      "P09 — Penyesuaian pribadi",
      "Halus",
      "Seimbang",
      "Lebih tegas",
      "P00 — Default aksesibel",
      "P09 — Penyesuaian pribadi",
      "Profil adaptasi warna diperbarui.",
      "Kekuatan penanda diperbarui.",
      "Penanda warna: mati",
      "Penanda warna: aktif",
      "Preferensi penanda warna diperbarui.",
      "Ukuran teks diperbarui.",
      "Preferensi aksesibilitas diatur ulang.",
      "Preferensi kontras diperbarui.",
      "Preferensi gerakan diperbarui.",
      "Preferensi tampilan baca diperbarui.",
      "Bantuan visual ini menambahkan garis bawah pada tautan dan penanda bentuk pada elemen status. Informasi tidak boleh dibedakan melalui warna saja."
    ]) {
      if (typeof dictionary[key] !== "string" || !dictionary[key].trim()) errors.push(file + " missing translation: " + key);
    }
  } catch { errors.push("Invalid locale JSON: " + file); }
}
let built = "";
try { built = await readFile("dist/index.html", "utf8"); }
catch { errors.push("Missing generated dist/index.html; run the build before this audit."); }
for (const needle of ['name="google-site-verification"', 'FXEeMYJjK8H-7Umv_-T9nwn6mB3St0NFqROlj15T4SY', 'Aksesibilitas', 'a11y-options', 'data-a11y-cvd-profile', 'data-a11y-cvd-strength']) {
  if (!built.includes(needle)) errors.push("Generated homepage is missing: " + needle);
}
if (errors.length) {
  for (const error of errors) console.error("INCLUSIVE A11Y:", error);
  process.exit(1);
}
console.log("Inclusive accessibility preflight passed: Search Console token, shared preference panel, style hooks, user-needs statement and release guidance are present.");
