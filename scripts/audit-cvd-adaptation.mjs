import { readFile } from "node:fs/promises";

const componentPath = "src/components/AksesibilitasKontrol.astro";
const cssPath = "src/styles/redesign.css";
const docPath = "docs/CVD-ADAPTATION-UIUX.md";
const component = await readFile(componentPath, "utf8");
const css = await readFile(cssPath, "utf8");
const docs = await readFile(docPath, "utf8");
const errors = [];
const profiles = ["P00","P01","P02","P03","P04","P05","P06","P07","P08","P09"];
for (const profile of profiles) {
  if (!component.includes('value="' + profile + '"')) errors.push("Missing profile option: " + profile);
}
for (const marker of [
  'const key = "smkn1mandau-a11y"',
  'cvdProfile: "P00"',
  'cvdStrength: "balanced"',
  'localStorage.getItem(key)',
  'localStorage.setItem(key, JSON.stringify(prefs))',
  'root.toggleAttribute("data-cvd-active", prefs.cvdProfile !== "P00")',
  'prefs = { ...defaults }'
]) if (!component.includes(marker)) errors.push("Component missing behavior: " + marker);
for (const marker of [
  'html[data-cvd-active]',
  'html[data-cvd-strength="subtle"]',
  'html[data-cvd-strength="balanced"]',
  'html[data-cvd-strength="stronger"]',
  'html[data-cvd-profile="P07"]',
  'html[data-cvd-profile="P08"]',
  '@media(forced-colors:active)'
]) if (!css.includes(marker)) errors.push("Stylesheet missing adaptation: " + marker);
if (css.includes("hue-rotate(")) errors.push("Do not add unvalidated global hue rotation.");
if (!docs.includes("not ten diagnoses") || !docs.includes("does not apply per-diagnosis hue matrices")) {
  errors.push("Documentation must state profile and clinical validation boundaries.");
}
for (const locale of ["en","ms","zh"]) {
  const path = "public/locales/" + locale + "-base.json";
  const dictionary = JSON.parse(await readFile(path, "utf8"));
  for (const key of ["Profil adaptasi warna","Kekuatan penanda", ...profiles.map((p,i) => [
    "P00 — Default aksesibel","P01 — Bantuan protanomaly","P02 — Bantuan protanopia",
    "P03 — Bantuan deuteranomaly","P04 — Bantuan deuteranopia","P05 — Bantuan tritanomaly",
    "P06 — Bantuan tritanopia","P07 — Ramah monokrom","P08 — Distingsi kuat",
    "P09 — Penyesuaian pribadi"
  ][i]), "Halus","Seimbang","Lebih tegas"]) {
    if (typeof dictionary[key] !== "string" || !dictionary[key].trim()) errors.push(path + " missing key: " + key);
  }
}
if (errors.length) {
  for (const error of errors) console.error("CVD AUDIT:", error);
  process.exit(1);
}
console.log("CVD adaptation source audit passed: 10 profiles, reversible local preferences, cue-strength controls, localization, and no global hue filter.");
