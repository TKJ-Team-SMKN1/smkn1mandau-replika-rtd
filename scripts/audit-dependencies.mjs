import { spawnSync } from "node:child_process";
const known="GHSA-fc5q-39xc-vjpf";
const r=spawnSync("npm",["audit","--json"],{encoding:"utf8",timeout:120000,maxBuffer:16*1024*1024});
if(r.error){console.error(r.error.message);process.exit(1);}
let report;try{report=JSON.parse(r.stdout);}catch{console.error("npm audit JSON tidak terbaca.");if(r.stderr)console.error(r.stderr);process.exit(1);}
if(report.error){console.error(report.error.summary||report.error.code);process.exit(1);}
const knownOpen=[],blocking=[];
for(const [name,item] of Object.entries(report.vulnerabilities||{})){
 const via=(item.via||[]).filter(x=>typeof x==="object");
 const onlyKnown=via.length>0&&via.every(x=>String(x.url||x.source||"").includes(known));
 if(item.severity==="critical"||item.severity==="high"){if(onlyKnown)knownOpen.push({name,range:item.range});else blocking.push({name,severity:item.severity,range:item.range});}
}
console.log("npm audit totals:",JSON.stringify(report.metadata?.vulnerabilities||{}));
if(knownOpen.length)console.warn("UNRESOLVED, NOT PATCHED:",JSON.stringify(knownOpen),known);
if(blocking.length){console.error("Unreviewed Critical/High:",JSON.stringify(blocking));process.exit(1);}
console.log("No unreviewed Critical/High findings. Known advisory remains open.");
