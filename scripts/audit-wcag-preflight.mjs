import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
const root=process.cwd(), dist=path.join(root,"dist"), errors=[], warnings=[], htmlFiles=[];
async function walk(dir){let entries;try{entries=await readdir(dir,{withFileTypes:true});}catch{errors.push("Folder dist tidak ditemukan.");return;}for(const e of entries){const f=path.join(dir,e.name);if(e.isDirectory())await walk(f);else if(e.isFile()&&e.name.endsWith(".html"))htmlFiles.push(f);}}
const attr=(tag,name)=>{const m=tag.match(new RegExp(name + "\\s*=\\s*[\"']([^\"']*)[\"']", "i"));return m?m[1]:null;};
await walk(dist);
for(const file of htmlFiles){
 const html=await readFile(file,"utf8"), count=p=>[...html.matchAll(p)].length;
 const fail=m=>errors.push(path.relative(root,file)+": "+m);
 if(!/<html\b[^>]*\blang=["'][^"']+["']/i.test(html))fail("lang tidak ditemukan.");
 if(!/<title>\s*[^<]+\s*<\/title>/i.test(html))fail("title kosong.");
 if(count(/<main\b/gi)!==1)fail("harus tepat satu main.");
 if(count(/<h1\b/gi)!==1)fail("harus tepat satu h1.");
 if(!/<a\b[^>]*href=["']#konten-utama["']/i.test(html))fail("skip link tidak ditemukan.");
 if(!/<main\b[^>]*id=["']konten-utama["'][^>]*tabindex=["']-1["']/i.test(html))fail("main harus id=konten-utama dan tabindex=-1.");
 for(const m of html.matchAll(/<nav\b[^>]*>/gi))if(!/aria-label|aria-labelledby/i.test(m[0]))fail("nav tanpa nama aksesibel.");
 const ids=new Map();for(const m of html.matchAll(/\bid=["']([^"']+)["']/gi))ids.set(m[1],(ids.get(m[1])||0)+1);for(const [id,n] of ids)if(n>1)fail("id duplikat: "+id);
 for(const m of html.matchAll(/<img\b[^>]*>/gi))if(attr(m[0],"alt")===null)fail("img tanpa atribut alt.");
 for(const m of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)){const label=attr(m[0],"aria-label")||attr(m[0],"title")||m[1].replace(/<[^>]+>/g," ").trim();if(!label)fail("button tanpa nama aksesibel.");}
 for(const m of html.matchAll(/<(input|select|textarea)\b[^>]*>/gi)){const id=attr(m[0],"id"),hidden=attr(m[0],"type")==="hidden";const wrapped=new RegExp("<label\\b[^>]*>[\\s\\S]*?<"+m[1]+"\\b[^>]*>[\\s\\S]*?</label>","i").test(html);const labelled=attr(m[0],"aria-label")||attr(m[0],"aria-labelledby")||(id&&(html.includes('for="'+id+'"')||html.includes("for='"+id+"'")))||wrapped;if(!labelled&&!hidden)fail(m[1]+" tanpa label programatik.");}
 for(const m of html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi))if(!/rel=["'][^"']*noopener/i.test(m[0]))fail("target=_blank tanpa rel=noopener.");
 for(const m of html.matchAll(/<(a|button|input|select|textarea)\b[^>]*aria-hidden=["']true["'][^>]*>/gi))fail("elemen interaktif disembunyikan: "+m[1]);
 if(!/<meta\b[^>]*name=["']viewport["']/i.test(html))fail("meta viewport tidak ditemukan.");
}
const fonts=await readFile(path.join(root,"src/styles/font-library.css"),"utf8"),faces=(fonts.match(/@font-face\s*\{/g)||[]).length,families=new Set([...fonts.matchAll(/font-family:\s*["']([^"']+)["']/g)].map(m=>m[1]));
if(faces!==174)errors.push("Jumlah font face berubah: "+faces);if(families.size!==19)errors.push("Jumlah keluarga font berubah: "+families.size);
const css=await readFile(path.join(root,"src/styles/global.css"),"utf8")+await readFile(path.join(root,"src/styles/theme-compat.css"),"utf8");
if(!/:focus-visible/.test(css))errors.push("focus-visible tidak ditemukan.");if(!/prefers-reduced-motion/.test(css))errors.push("reduced-motion tidak ditemukan.");if(!/forced-colors/.test(css))warnings.push("forced-colors perlu pemeriksaan manual.");if(!/--focus-color/.test(css))errors.push("focus token tidak ditemukan.");
if(!css.includes("prefers-contrast: more"))errors.push("prefers-contrast enhancement tidak ditemukan.");
if(!css.includes("forced-colors: active"))errors.push("forced-colors fallback tidak ditemukan.");
if(!css.includes("a:not([class])"))errors.push("inline link underline baseline tidak ditemukan.");
console.log("WCAG 2.2 AA static preflight: "+htmlFiles.length+" halaman; "+faces+" face OTF; "+families.size+" keluarga font.");
for(const w of warnings)console.warn("WARNING:",w);for(const e of errors)console.error("ERROR:",e);
if(errors.length)process.exit(1);console.log("Static preflight passed; this is not WCAG certification.");

/* Contrast-token preflight for the five themes and Dynamic fallback modes. */
const globalCss = await readFile(path.join(root, "src/styles/global.css"), "utf8");
const themeCss = await readFile(path.join(root, "src/styles/theme-compat.css"), "utf8");
const parseVars = (block) => Object.fromEntries([...block.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-f]{3,8})/gi)].map((m) => [m[1], m[2]]));
function blocksFor(css, selector) { let cursor=0; const blocks=[]; while(true) { const at=css.indexOf(selector,cursor); if(at<0) break; const open=css.indexOf("{",at+selector.length); const close=css.indexOf("}",open+1); if(open<0||close<0) break; if(css.slice(at+selector.length,open).trim()==="") blocks.push(css.slice(open+1,close)); cursor=close+1; } return blocks; }
function varsFor(css, selector) { return Object.assign({}, ...blocksFor(css,selector).map(parseVars)); }
const globalRoot=varsFor(globalCss,":root"), compatRoot=varsFor(themeCss,":root");
function luminance(hex) { const raw=hex.slice(1); const full=raw.length===3?[...raw].map(x=>x+x).join(""):raw; const rgb=[0,2,4].map(i=>parseInt(full.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4); return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]; }
function contrast(fg,bg) { const pair=[luminance(fg),luminance(bg)].sort((x,y)=>y-x); return (pair[0]+.05)/(pair[1]+.05); }
const failures=[];
const footerAccessibilitySource = await readFile(path.join(root, "src/components/Footer.astro"), "utf8");
const heroAccessibilitySource = await readFile(path.join(root, "src/components/Hero.jsx"), "utf8");
if (!globalCss.includes(".sdm-search input:focus-visible{outline:3px solid CanvasText;outline-offset:2px;box-shadow:0 0 0 6px Canvas;border-color:var(--focus-color)}")) failures.push("Search input must retain a high-contrast keyboard focus indicator.");
if (globalCss.includes(".sdm-search input:focus{outline:3px solid rgba(")) failures.push("Low-contrast generic search focus override must not replace :focus-visible.");
if (!footerAccessibilitySource.includes("color:rgba(246,239,230,.72);")) failures.push("Footer metadata text contrast reinforcement is missing.");
if (!heroAccessibilitySource.includes("color:rgba(246,239,230,.78);")) failures.push("Hero supporting text contrast reinforcement is missing.");
function checkPalette(name,vars) {
 const pairs=[["body/page",vars["--text-primary"],vars["--page-bg"],4.5],["body/surface",vars["--text-primary"],vars["--surface"],4.5],["muted/page",vars["--text-muted"],vars["--page-bg"],4.5],["muted/surface",vars["--text-muted"],vars["--surface"],4.5],["accent/page",vars["--accent-color"],vars["--page-bg"],4.5],["accent/surface",vars["--accent-color"],vars["--surface"],4.5],["accent/muted",vars["--accent-color"],vars["--surface-muted"],4.5],["button/accent",vars["--accent-contrast"],vars["--accent-color"],4.5],["control/surface",vars["--control-border"],vars["--surface"],3],["control/muted",vars["--control-border"],vars["--surface-muted"],3],["header",vars["--header-text"],vars["--header-surface"],4.5],["hero white","#ffffff",vars["--hero-surface-alt"],4.5],["hero accent",vars["--accent-on-dark"],vars["--hero-surface-alt"],4.5],["mobile active",vars["--header-text"],vars["--header-surface"],4.5],["mobile underline",vars["--accent-color"],vars["--header-surface"],3]];
 for(const [label,fg,bg,min] of pairs) { if(!fg||!bg) { failures.push(name+": missing token "+label); continue; } const value=contrast(fg,bg); if(value+1e-9<min) failures.push(name+": "+label+" "+value.toFixed(2)+":1 (minimum "+min+")"); }
}
for(const theme of ["light","dark","super-black","amoled-black"]) { const selector='html[data-theme="'+theme+'"]'; const vars=Object.assign({},globalRoot,varsFor(globalCss,selector),compatRoot,varsFor(themeCss,selector)); checkPalette(theme,vars); }
const dynamicSelector='html[data-theme="dynamic"]';
const dynamicBlocks=blocksFor(themeCss,dynamicSelector);
const dynamicBase=Object.assign({},globalRoot,varsFor(globalCss,dynamicSelector),compatRoot,parseVars(dynamicBlocks[0]||""));
const dynamicLight=Object.assign({},dynamicBase,parseVars(dynamicBlocks[2]||""));
const dynamicDark=Object.assign({},dynamicBase,parseVars(dynamicBlocks[1]||""),parseVars(dynamicBlocks[4]||""));
checkPalette("dynamic-light-fallback",dynamicLight);
checkPalette("dynamic-dark-fallback",dynamicDark);
if(!globalCss.includes("outline: 3px solid CanvasText")||!globalCss.includes("box-shadow: 0 0 0 6px Canvas")) failures.push("Two-layer CanvasText/Canvas focus ring is missing.");
if(failures.length) { for(const failure of failures) console.error("CONTRAST:",failure); process.exit(1); }
console.log("Theme contrast preflight passed: six fallback palettes; text 4.5:1 and control boundaries 3:1.");
console.warn("Dynamic OS color overrides, gradients, imagery and interactive rendered states still require manual review.");

/* Preferred 44 CSS px target baseline for primary controls. */
const navSource=await readFile(path.join(root,"src/components/Navigasi.astro"),"utf8");
const programSource=await readFile(path.join(root,"src/components/DaftarProgram.jsx"),"utf8");
const noticeSource=await readFile(path.join(root,"src/components/NotifikasiReplika.jsx"),"utf8");
const settingsSource=await readFile(path.join(root,"src/pages/pengaturan.astro"),"utf8");
const targetChecks=[
  ["primary navigation 44px",navSource.includes("min-height:44px")],
  ["mobile menu 44px",navSource.includes(".menu-toggle{display:none;width:44px;height:44px;")],
  ["language selector 44px",navSource.includes(".language-control select{min-height:44px;")],
  ["SDM filter 44px",globalCss.includes(".sdm-filter { min-height: 44px; }")],
  ["program search clear 44px",programSource.includes("min-h-11 min-w-11")],
  ["program search reserves clear-control space",programSource.includes("px-4 pr-16 py-3")],
  ["replica notice close 44px",noticeSource.includes("w-11 h-11 min-w-11 min-h-11")],
  ["replica notice close is an explicit button",noticeSource.includes('type="button"\n          onClick={tutup}')],
  ["theme preview has a named group",settingsSource.includes('role="group" aria-label="Pratinjau komponen antarmuka"')],
  ["theme preview samples are not announced as controls",settingsSource.includes('aria-hidden="true" class="tombol tombol-ukir !w-auto"')]
];
for(const [label,ok] of targetChecks) if(!ok) failures.push("Target baseline missing: "+label);
if(failures.length) { for(const failure of failures) console.error("A11Y:",failure); process.exit(1); }
console.log("Primary target baseline passed: 44 CSS px for navigation, language, filters and key controls.");
