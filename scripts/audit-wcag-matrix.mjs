import { readFile } from "node:fs/promises";
import path from "node:path";

const file = path.join(process.cwd(), "docs/WCAG-2.2-A-AA-RELEASE-MATRIX.md");
const source = await readFile(file, "utf8");
const rows = [...source.matchAll(/^\| (\d\.\d\.\d+) \| (.+?) \| (A|AA) \| (Applicable|Conditional) \| (.+?) \|$/gm)];
const ids = rows.map((match) => match[1]);
const expected = [
  "1.1.1","1.2.1","1.2.2","1.2.3","1.2.4","1.2.5","1.3.1","1.3.2","1.3.3","1.3.4","1.3.5",
  "1.4.1","1.4.2","1.4.3","1.4.4","1.4.5","1.4.10","1.4.11","1.4.12","1.4.13",
  "2.1.1","2.1.2","2.1.4","2.2.1","2.2.2","2.3.1","2.4.1","2.4.2","2.4.3","2.4.4","2.4.5","2.4.6","2.4.7","2.4.11",
  "2.5.1","2.5.2","2.5.3","2.5.4","2.5.7","2.5.8","3.1.1","3.1.2","3.2.1","3.2.2","3.2.3","3.2.4","3.2.6","3.3.1","3.3.2","3.3.3","3.3.4","3.3.7","3.3.8","4.1.2","4.1.3"
];
const errors = [];
if (rows.length !== 55) errors.push("Expected 55 WCAG 2.2 Level A/AA matrix rows, found " + rows.length);
if (new Set(ids).size !== ids.length) errors.push("Duplicate WCAG success criterion IDs are present.");
for (const id of expected) if (!ids.includes(id)) errors.push("Missing WCAG success criterion: " + id);
for (const id of ids) if (!expected.includes(id)) errors.push("Unexpected or non-Level-A/AA criterion: " + id);
for (const match of rows) if (!match[5].trim()) errors.push("Missing release-check description for " + match[1]);
if (!source.includes("does not mark any criterion as independently verified")) errors.push("Matrix must state that source preflight is not independent conformance verification.");
if (errors.length) {
  for (const error of errors) console.error("WCAG MATRIX:", error);
  process.exit(1);
}
console.log("WCAG 2.2 release matrix passed: 55 unique Level A/AA criteria, applicability and release checks recorded.");
