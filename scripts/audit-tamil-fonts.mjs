import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const read = (file) => readFile(path.join(root, file), "utf8");

const [fontCss, libraryCss, i18n] = await Promise.all([
  read("public/fonts/tamil/noto-serif-tamil.css"),
  read("src/styles/font-library.css"),
  read("public/scripts/i18n.js")
]);

const faces = [...fontCss.matchAll(/@font-face\s*\{([\s\S]*?)\}/g)].map((match) => match[1]);
check(faces.length === 6, "Expected six Tamil font faces (400/600/700 normal and italic).");

const expected = new Set([
  "NotoSerifTamil-Regular.ttf|400|normal",
  "NotoSerifTamil-SemiBold.ttf|600|normal",
  "NotoSerifTamil-Bold.ttf|700|normal",
  "NotoSerifTamil-Italic.ttf|400|italic",
  "NotoSerifTamil-SemiBoldItalic.ttf|600|italic",
  "NotoSerifTamil-BoldItalic.ttf|700|italic"
]);

for (const face of faces) {
  const family = face.match(/font-family:\s*["']([^"']+)["']/)?.[1];
  const url = face.match(/url\(["']([^"']+)["']\)/)?.[1];
  const weight = face.match(/font-weight:\s*(\d+)/)?.[1];
  const style = face.match(/font-style:\s*(normal|italic)/)?.[1];
  const key = url ? path.basename(url) + "|" + weight + "|" + style : "";
  check(family === "Noto Serif Tamil Local", "Tamil face has an unexpected font-family.");
  check(expected.has(key), "Unexpected or incorrectly mapped Tamil face: " + key);
  check(face.includes("font-display: swap"), "Tamil face is missing font-display: swap.");
  check(face.includes("unicode-range: U+0B80-0BFF"), "Tamil face is missing the Tamil Unicode range.");
  check(url?.startsWith("/fonts/tamil/ttf/"), "Tamil face must use a local TTF URL: " + url);
  if (url) {
    const bytes = await readFile(path.join(root, "public", url.replace(/^\//, "")));
    const magic = bytes.subarray(0, 4).toString("hex");
    check(bytes.length > 1000, "Tamil font file is unexpectedly small: " + url);
    check(magic === "00010000" || magic === "4f54544f", "Tamil font is not a real OpenType/TrueType binary: " + url);
    check(!bytes.subarray(0, 80).toString("utf8").startsWith("version https://git-lfs.github.com/spec/v1"), "Tamil font is still an LFS pointer: " + url);
  }
}

check(expected.size === new Set(faces.map((face) => {
  const url = face.match(/url\(["']([^"']+)["']\)/)?.[1];
  const weight = face.match(/font-weight:\s*(\d+)/)?.[1];
  const style = face.match(/font-style:\s*(normal|italic)/)?.[1];
  return url ? path.basename(url) + "|" + weight + "|" + style : "";
})).size, "Tamil font face mappings contain duplicates or omissions.");

check(!/https?:\/\//i.test(fontCss), "Tamil stylesheet must not load external font resources.");
check(i18n.includes('"ta-SG": { files: chunkFiles("ta"), overrides: ["/locales/ta-overrides.json"] }'), "ta-SG translation chunks/override are not registered.");
check(i18n.includes('"ta-SG": ["/fonts/tamil/noto-serif-tamil.css"]'), "ta-SG local font stylesheet is not registered.");
check(/document\.documentElement\.lang\s*=\s*documentLanguage\(activeLanguage\)/.test(i18n), "Active locale is not reflected in the document lang attribute.");
check(/html\[lang="ta-SG"\] body[\s\S]*?letter-spacing:\s*normal[\s\S]*?word-spacing:\s*normal[\s\S]*?text-align:\s*start/.test(libraryCss), "Tamil reading defaults (spacing and start alignment) are missing.");
check(libraryCss.includes('"Noto Serif Tamil Local"'), "Tamil local family is missing from the locale font stack.");
const tamilBodyRule = libraryCss.split('html[lang="ta-SG"] body {')[1]?.split("}")[0] || "";
check((tamilBodyRule.match(/letter-spacing:\s*normal\s*;/g) || []).length === 1 && !/letter-spacing:\s*(?!normal\b)/.test(tamilBodyRule), "Tamil body rule must keep normal letter spacing.");

if (errors.length) {
  for (const error of errors) console.error("TAMIL:", error);
  process.exit(1);
}
console.log("Tamil font audit passed: six local TTF faces, real binaries, weights/styles, Unicode range, no CDN, ta-SG loader and typography defaults.");
console.warn("Regional Tamil glyph selection (including Singapore/Malaysia RA forms), shaping and visual rendering still require browser specimen review.");
