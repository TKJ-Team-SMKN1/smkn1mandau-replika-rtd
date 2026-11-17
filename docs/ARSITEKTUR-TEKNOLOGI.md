# Arsitektur Bahasa dan Teknologi Website

Status: Phase 2 implementation baseline  
Produk: website sekolah statis, bukan IDE daring dan bukan portal katalog teknologi.

## Prinsip

Bahasa dan toolchain hanya dipakai jika memiliki tanggung jawab nyata pada website atau pipeline build. Daftar kandidat bukan instruksi untuk memasang semua compiler. Tidak ada teknologi yang ditambahkan sebagai pajangan.

## Stack yang benar-benar dipakai

| Teknologi | Peran |
|---|---|
| HTML | Struktur semantik halaman dan komponen Astro |
| CSS | Design tokens, lima tema, responsive layout, accessibility |
| JavaScript | Interaksi browser dan komponen React yang sudah ada |
| TypeScript | Theme controller bertipe dan pemeriksaan proyek |
| Node.js 24 | Runtime development/build dan CI |
| Astro 7 | Framework utama, static rendering |
| React 18 | Island interaktif yang memerlukan state browser |
| Vite 7 | Dev server dan bundling melalui Astro |
| Tailwind CSS 4 | Utility styling melalui plugin Vite resmi |
| Astro Check / TypeScript | Pemeriksaan diagnostik sebelum build |
| V8 | Engine JavaScript yang disediakan Node/browser, bukan dependency yang dibundel |
| npm | Dependency management |

## Compiler dan build pipeline

- Astro Check menjalankan diagnostik dan type-checking Astro/TypeScript.
- Astro build menghasilkan situs statis.
- Vite menangani bundling melalui Astro.
- Tailwind CSS Vite plugin memproses utility CSS.
- GitHub Actions menjalankan pemeriksaan, sintaks skrip browser, dan build.
- Tidak ada runtime compiler di sisi pengunjung.

## Evaluasi kandidat bahasa

| Kandidat | Keputusan saat ini | Dasar |
|---|---|---|
| JavaScript | Dipakai | Interaksi browser dan komponen existing |
| TypeScript | Dipakai | Theme engine dan type checking |
| Python | Belum dipakai | Belum ada kebutuhan data-processing yang memerlukan runtime |
| SQL | Belum dipakai | Tidak ada database relasional pada arsitektur static saat ini |
| Java, C/C++, C#, Go, Rust | Tidak dipasang | Tidak ada service backend/native yang dibutuhkan |
| Kotlin, Swift, Dart | Tidak dipasang | Produk adalah website, bukan aplikasi native |
| Ruby, R, Julia, Zig, Lua, Elixir, Scala, Haskell, OCaml, Fortran, Assembly, Solidity | Tidak dipasang | Belum ada kebutuhan produk yang membenarkan runtime/compiler |

Keputusan bukan penilaian kualitas bahasa. Kandidat dapat dievaluasi kembali jika kebutuhan produk berubah.

## Evaluasi toolchain

| Toolchain | Keputusan |
|---|---|
| TypeScript Compiler / Astro Check | Dipakai |
| Vite | Dipakai melalui Astro |
| V8 | Disediakan oleh Node/browser |
| GCC, Clang/LLVM, rustc, Go Toolchain, javac, Roslyn | Tidak dibutuhkan untuk build website |
| CPython | Tidak dibutuhkan selama tidak ada tooling Python |
| SpiderMonkey | Engine browser alternatif, bukan dependency proyek |
| Kotlin Compiler, Swift Compiler | Tidak dibutuhkan |
| CMake, Ninja, GNU Make, Cargo, Gradle, Maven | Tidak dibutuhkan karena tidak ada native source/service yang dibangun |

## Theme dan UI architecture

- Lima mode menggunakan satu pengendali tema dan semantic CSS tokens: Light, Dark, Super Black, AMOLED Black, dan Dynamic Color.
- `src/styles/theme-compat.css` memetakan utility warna lama ke token tema agar halaman yang sudah ada mengikuti tema tanpa menulis ulang seluruh markup sekaligus.
- Hero dan area bermerek mempertahankan permukaan gelap dengan teks kontras; area konten, kartu, form, dan navigasi mengikuti token tema.
- Dynamic Color pada web berarti mengikuti system color scheme dan CSS system colors browser (misalnya Canvas, CanvasText, dan AccentColor) dengan fallback `prefers-color-scheme`. Website tidak mengklaim dapat membaca palet wallpaper Android Material You.
- Preferensi tema disimpan di localStorage perangkat; tidak dikirim ke server.
- Theme switching tidak memerlukan library tambahan.

## Halaman dan transparansi proyek

- Halaman `/tentang` menjelaskan status replika independen, batas informasi, sumber publik, privasi preferensi tema, dan stack teknis aktual.
- Navigasi utama dan footer mengarah ke halaman Tentang.
- Konten profil, program, personel, dan arsip pengumuman tetap merujuk ke register sumber; halaman Tentang tidak membuat klaim operasional baru.

## Batas arsitektur

- Output tetap static-first.
- Tidak ada online code execution.
- Tidak ada microservices tanpa kebutuhan.
- Tidak ada database eksternal pada tahap ini.
- Tidak ada perubahan deployment atau konfigurasi Vercel.
- Konten sekolah tetap bersumber dan memiliki provenance.
