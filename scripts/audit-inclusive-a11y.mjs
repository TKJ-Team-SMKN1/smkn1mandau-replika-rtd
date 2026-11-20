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
    'data-a11y-action="text-up"',
    'data-a11y-action="reset"'
  ]],
  ["src/styles/redesign.css", [
    'html[data-a11y-contrast]',
    'html[data-a11y-motion]',
    'html[data-a11y-reading]',
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
if (errors.length) {
  for (const error of errors) console.error("INCLUSIVE A11Y:", error);
  process.exit(1);
}
console.log("Inclusive accessibility preflight passed: Search Console token, shared preference panel, style hooks, user-needs statement and release guidance are present.");
