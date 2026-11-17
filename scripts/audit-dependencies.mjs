import { spawnSync } from "node:child_process";
const knownAdvisory = "GHSA-fc5q-39xc-vjpf";
const result = spawnSync("npm", ["audit", "--json"], { encoding: "utf8", timeout: 120000, maxBuffer: 16 * 1024 * 1024 });
if (result.error) { console.error(result.error.message); process.exit(1); }
let report;
try { report = JSON.parse(result.stdout); }
catch { console.error("npm audit JSON tidak terbaca."); if (result.stderr) console.error(result.stderr); process.exit(1); }
if (report.error) { console.error(report.error.summary || report.error.code); process.exit(1); }

function onlyKnownChain(name, seen = new Set()) {
  if (seen.has(name)) return false;
  const item = report.vulnerabilities?.[name];
  if (!item || !Array.isArray(item.via) || item.via.length === 0) return false;
  const next = new Set(seen);
  next.add(name);
  return item.via.every((entry) => {
    if (typeof entry === "string") return onlyKnownChain(entry, next);
    return String(entry.url || "").includes(knownAdvisory);
  });
}

const knownOpen = [];
const blocking = [];
for (const [name, item] of Object.entries(report.vulnerabilities || {})) {
  if (item.severity === "critical" || item.severity === "high") {
    if (onlyKnownChain(name)) knownOpen.push({ name, severity: item.severity, range: item.range });
    else blocking.push({ name, severity: item.severity, range: item.range, via: item.via });
  }
}
console.log("npm audit totals:", JSON.stringify(report.metadata?.vulnerabilities || {}));
if (knownOpen.length) {
  console.warn("UNRESOLVED, NOT PATCHED (transitive chain to known advisory):", JSON.stringify(knownOpen));
  console.warn(knownAdvisory + " remains open; upstream currently lists no patched version.");
}
if (blocking.length) {
  console.error("Unreviewed Critical/High:", JSON.stringify(blocking));
  process.exit(1);
}
console.log("No unreviewed Critical/High findings. Known advisory remains open.");
