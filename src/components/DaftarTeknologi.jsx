import {useMemo,useState} from "react";
const ITEMS=[
["Python","Bahasa pemrograman","Automasi, analisis data, scripting, backend, dan machine learning.","https://docs.python.org/3/"],
["JavaScript","Bahasa pemrograman","Bahasa utama untuk interaksi web dan aplikasi lintas lingkungan JavaScript.","https://developer.mozilla.org/en-US/docs/Web/JavaScript"],
["TypeScript","Bahasa pemrograman","Superset JavaScript dengan pemeriksaan tipe statis saat pengembangan.","https://www.typescriptlang.org/docs/"],
["Java","Bahasa pemrograman","Bahasa berorientasi objek untuk aplikasi JVM, backend, dan Android.","https://dev.java/learn/"],
["C","Bahasa pemrograman","Bahasa sistem untuk sistem operasi dan perangkat tertanam.","https://en.cppreference.com/w/c"],
["C++","Bahasa pemrograman","Bahasa sistem dan aplikasi berkinerja tinggi.","https://en.cppreference.com/w/cpp"],
["C#","Bahasa pemrograman","Bahasa utama ekosistem .NET untuk aplikasi dan layanan.","https://learn.microsoft.com/dotnet/csharp/"],
["Go","Bahasa pemrograman","Bahasa terkompilasi untuk layanan jaringan dan perangkat lunak konkuren.","https://go.dev/doc/"],
["Rust","Bahasa pemrograman","Bahasa sistem yang menekankan keamanan memori dan konkurensi.","https://doc.rust-lang.org/book/"],
["Kotlin","Bahasa pemrograman","Bahasa modern untuk JVM, Android, dan target multiplatform.","https://kotlinlang.org/docs/home.html"],
["Swift","Bahasa pemrograman","Bahasa untuk aplikasi ekosistem Apple dan server-side Swift.","https://www.swift.org/documentation/"],
["Dart","Bahasa pemrograman","Bahasa yang digunakan Flutter untuk aplikasi lintas platform.","https://dart.dev/guides"],
["Ruby","Bahasa pemrograman","Bahasa dinamis untuk scripting, otomasi, dan pengembangan aplikasi.","https://www.ruby-lang.org/en/documentation/"],
["R","Bahasa pemrograman","Bahasa dan lingkungan komputasi statistik serta visualisasi data.","https://www.r-project.org/other-docs.html"],
["HTML","Teknologi web","Bahasa markup untuk struktur dokumen web; bukan bahasa pemrograman umum.","https://html.spec.whatwg.org/"],
["CSS","Teknologi web","Bahasa stylesheet untuk tata letak dan tampilan antarmuka.","https://www.w3.org/Style/CSS/"],
["Node.js","Teknologi web","Runtime JavaScript berbasis V8 untuk tooling dan layanan server.","https://nodejs.org/en/learn"],
["React","Teknologi web","Pustaka untuk membangun antarmuka berbasis komponen.","https://react.dev/learn"],
["Astro","Teknologi web","Framework web berorientasi konten dengan islands architecture.","https://docs.astro.build/"],
["Vite","Teknologi web","Build tool dan development server frontend modern.","https://vite.dev/guide/"],
["Linux","Platform & infrastruktur","Keluarga sistem operasi open-source untuk server, jaringan, dan perangkat.","https://www.kernel.org/doc/html/latest/"],
["Git","Platform & infrastruktur","Sistem kontrol versi terdistribusi untuk melacak perubahan source code.","https://git-scm.com/doc"],
["Docker","Platform & infrastruktur","Platform container untuk mengemas dan menjalankan aplikasi.","https://docs.docker.com/"],
["PostgreSQL","Platform & infrastruktur","Sistem basis data relasional open-source.","https://www.postgresql.org/docs/"],
["SQLite","Platform & infrastruktur","Mesin basis data SQL embedded tanpa server terpisah.","https://www.sqlite.org/docs.html"],
["Redis","Platform & infrastruktur","Data store in-memory untuk cache dan antrean.","https://redis.io/docs/latest/"],
["Bash","Platform & infrastruktur","Shell dan bahasa scripting untuk otomasi Unix-like.","https://www.gnu.org/software/bash/manual/"],
["PowerShell","Platform & infrastruktur","Shell lintas platform dan bahasa scripting administrasi sistem.","https://learn.microsoft.com/powershell/"],
["GCC","Compiler & toolchain","GNU Compiler Collection untuk C, C++, dan bahasa lainnya.","https://gcc.gnu.org/onlinedocs/"],
["Clang / LLVM","Compiler & toolchain","Clang adalah frontend C-family; LLVM menyediakan infrastruktur optimisasi dan code generation.","https://clang.llvm.org/docs/"],
["rustc","Compiler & toolchain","Compiler resmi Rust untuk menghasilkan executable atau artefak target.","https://doc.rust-lang.org/rustc/"],
["Go toolchain","Compiler & toolchain","Toolchain Go mencakup compiler, linker, formatter, test runner, dan build.","https://go.dev/src/cmd/compile/README"],
["javac","Compiler & toolchain","Compiler Java yang menerjemahkan source menjadi bytecode JVM.","https://docs.oracle.com/en/java/javase/25/docs/specs/man/javac.html"],
["CPython","Compiler & toolchain","Implementasi referensi Python; source dikompilasi menjadi bytecode sebelum dieksekusi.","https://devguide.python.org/compiler/"],
["TypeScript (tsc)","Compiler & toolchain","Compiler TypeScript untuk pemeriksaan tipe dan emit JavaScript.","https://www.typescriptlang.org/docs/handbook/compiler-options.html"],
["Roslyn / csc","Compiler & toolchain","Platform compiler .NET untuk C# dan Visual Basic.","https://github.com/dotnet/roslyn"],
["Kotlin Compiler","Compiler & toolchain","Compiler Kotlin dengan target JVM, JavaScript, dan Native sesuai dukungan.","https://kotlinlang.org/docs/command-line.html"],
["Swift Compiler","Compiler & toolchain","Compiler Swift untuk membangun modul dan aplikasi.","https://www.swift.org/documentation/"],
["Dart Compiler","Compiler & toolchain","Toolchain Dart mendukung mode JIT untuk pengembangan dan AOT untuk deployment.","https://dart.dev/tools/dart-compile"],
["CMake","Build system","Sistem konfigurasi lintas platform yang menghasilkan build files.","https://cmake.org/documentation/"],
["Ninja","Build system","Build system kecil dan cepat untuk menjalankan perintah build.","https://ninja-build.org/manual.html"],
["GNU Make","Build system","Build automation berbasis aturan dependensi dan target.","https://www.gnu.org/software/make/manual/"],
["Cargo","Build system","Package manager dan build tool resmi Rust; bukan compiler itu sendiri.","https://doc.rust-lang.org/cargo/"],
["Gradle","Build system","Build automation untuk proyek JVM, Android, dan lainnya.","https://docs.gradle.org/current/userguide/userguide.html"],
["Maven","Build system","Build dan dependency management untuk proyek Java.","https://maven.apache.org/guides/"]
].map(([name,group,description,url])=>({name,group,description,url}));
const FILTERS=["Semua","Bahasa pemrograman","Teknologi web","Platform & infrastruktur","Compiler & toolchain","Build system"];
export default function DaftarTeknologi(){const[q,SQ]=useState("");const[f,SF]=useState("Semua");const rows=useMemo(()=>{const t=q.trim().toLocaleLowerCase("id");return ITEMS.filter(x=>(f==="Semua"||x.group===f)&&(!t||`${x.name} ${x.group} ${x.description}`.toLocaleLowerCase("id").includes(t)));},[q,f]);return <div>
<div className="max-w-3xl mb-7"><label htmlFor="cari-teknologi" className="block text-sm font-bold text-malam mb-2">Cari bahasa, teknologi, compiler, atau build system</label><input id="cari-teknologi" type="search" value={q} onChange={e=>SQ(e.target.value)} placeholder="Contoh: Rust, LLVM, Docker, CMake..." autoComplete="off" className="w-full min-h-12 rounded-xl border border-malam/20 bg-white px-4 py-3 text-malam placeholder:text-tinta-pudar/60 shadow-sm focus:border-ukir focus:outline-none focus:ring-2 focus:ring-ukir/20"/></div>
<div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter kategori teknologi">{FILTERS.map(x=><button key={x} type="button" aria-pressed={f===x} onClick={()=>SF(x)} className={`rounded-lg border px-3 py-2 text-sm font-semibold ${f===x?"border-malam bg-malam text-white":"border-malam/20 bg-white text-malam hover:border-ukir"}`}>{x}</button>)}</div>
<p className="mb-5 text-sm text-tinta-pudar" aria-live="polite">Menampilkan <strong className="text-malam">{rows.length}</strong> dari {ITEMS.length} referensi.</p>
{rows.length?<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{rows.map(x=><article key={x.name} className="kartu flex flex-col !p-5"><div className="flex items-start justify-between gap-3 mb-3"><h3 className="font-judul text-lg text-malam">{x.name}</h3><span className="text-[.65rem] font-semibold rounded-full bg-gading text-malam px-2.5 py-1">{x.group}</span></div><p className="text-sm text-tinta-pudar leading-relaxed flex-1">{x.description}</p><a className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-ukir hover:underline" href={x.url} target="_blank" rel="noopener noreferrer">Dokumentasi / referensi ↗</a></article>)}</div>:<div className="rounded-2xl border border-dashed border-malam/25 bg-white/70 px-6 py-12 text-center"><p className="font-judul text-xl text-malam mb-2">Tidak ada hasil yang cocok</p><p className="text-sm text-tinta-pudar">Ubah kata kunci atau kategori.</p><button type="button" onClick={()=>{SQ("");SF("Semua");}} className="tombol tombol-ukir !w-auto mt-5">Atur ulang filter</button></div>}
<p className="mt-7 text-xs text-tinta-pudar leading-relaxed">Materi belajar mandiri, bukan daftar mata pelajaran resmi. HTML dan CSS adalah markup/stylesheet; SQL adalah bahasa kueri. Compiler, runtime, dan build system memiliki fungsi berbeda. PHP tidak termasuk.</p></div>}
