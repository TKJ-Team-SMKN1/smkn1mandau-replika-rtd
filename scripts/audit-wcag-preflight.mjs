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
 for(const m of html.matchAll(/<(input|select|textarea)\b[^>]*>/gi)){const id=attr(m[0],"id"),hidden=attr(m[0],"type")==="hidden";const labelled=attr(m[0],"aria-label")||attr(m[0],"aria-labelledby")||(id&&(html.includes('for="'+id+'"')||html.includes("for='"+id+"'")));if(!labelled&&!hidden)fail(m[1]+" tanpa label programatik.");}
 for(const m of html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi))if(!/rel=["'][^"']*noopener/i.test(m[0]))fail("target=_blank tanpa rel=noopener.");
 for(const m of html.matchAll(/<(a|button|input|select|textarea)\b[^>]*aria-hidden=["']true["'][^>]*>/gi))fail("elemen interaktif disembunyikan: "+m[1]);
 if(!/<meta\b[^>]*name=["']viewport["']/i.test(html))fail("meta viewport tidak ditemukan.");
}
const fonts=await readFile(path.join(root,"src/styles/font-library.css"),"utf8"),faces=(fonts.match(/@font-face\s*\{/g)||[]).length,families=new Set([...fonts.matchAll(/font-family:\s*["']([^"']+)["']/g)].map(m=>m[1]));
if(faces!==174)errors.push("Jumlah font face berubah: "+faces);if(families.size!==19)errors.push("Jumlah keluarga font berubah: "+families.size);
const css=await readFile(path.join(root,"src/styles/global.css"),"utf8")+await readFile(path.join(root,"src/styles/theme-compat.css"),"utf8");
if(!/:focus-visible/.test(css))errors.push("focus-visible tidak ditemukan.");if(!/prefers-reduced-motion/.test(css))errors.push("reduced-motion tidak ditemukan.");if(!/forced-colors/.test(css))warnings.push("forced-colors perlu pemeriksaan manual.");if(!/--focus-color/.test(css))errors.push("focus token tidak ditemukan.");
console.log("WCAG 2.2 AA static preflight: "+htmlFiles.length+" halaman; "+faces+" face OTF; "+families.size+" keluarga font.");
for(const w of warnings)console.warn("WARNING:",w);for(const e of errors)console.error("ERROR:",e);
if(errors.length)process.exit(1);console.log("Static preflight passed; this is not WCAG certification.");
