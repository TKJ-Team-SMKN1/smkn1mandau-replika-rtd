import { spawnSync } from "node:child_process";

const result = spawnSync("npm", ["audit", "--json"], {
  encoding: "utf8",
  timeout: 120000,
  maxBuffer: 16 * 1024 * 1024
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

let report;
try {
  report = JSON.parse(result.stdout);
} catch {
  console.error("npm audit JSON tidak terbaca.");
  if (result.stderr) console.error(result.stderr);
  process.exit(1);
}

if (report.error) {
  console.error(report.error.summary || report.error.code);
  process.exit(1);
}

const totals = report.metadata?.vulnerabilities || {};
const blocking = Object.entries(report.vulnerabilities || {})
  .filter(([, item]) => item.severity === "critical" || item.severity === "high")
  .map(([name, item]) => ({
    name,
    severity: item.severity,
    range: item.range,
    via: item.via
  }));

console.log("npm audit totals:", JSON.stringify(totals));

if (blocking.length > 0) {
  console.error("Critical/High dependency advisories require review:", JSON.stringify(blocking));
  process.exit(1);
}

console.log("No Critical/High dependency advisories reported by npm audit.");
