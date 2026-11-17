# Sistem Tipografi Lokal

Seluruh font diambil dari aset yang sudah berada di `public/fonts/`; tidak ada Google Fonts atau CDN font eksternal.

## Inventaris yang terdaftar

18 keluarga font dan 174 berkas OTF terdaftar di `src/styles/font-library.css`:

| Keluarga | Peran utama |
| --- | --- |
| Anton | Display heading pendek |
| Archivo | Heading dan hierarki institusional |
| Azeret Mono | Label, metadata, penanda teknis |
| Bagnard | Eyebrow/display dekoratif terbatas |
| Crimson Pro | Kutipan dan teks editorial |
| Familjen Grotesk | Heading sekunder dan antarmuka |
| Literata | Kutipan dan judul editorial |
| Lora | Narasi historis dan catatan panjang |
| M PLUS 1 | Fallback multilingual |
| M PLUS 1 Code | Fallback monospace multilingual |
| M PLUS 2 | Fallback multilingual |
| M PLUS Code Latin 50 | Fallback kode Latin |
| M PLUS Code Latin 60 | Fallback kode Latin |
| M PLUS U | Fallback multilingual |
| Nunito | Teks penjelas dan ringkasan |
| Outfit | Teks utama |
| Reglo | Angka/tanggal display |
| Office Code Pro | Fallback monospace |
| Office Code Pro D | Fallback monospace dengan dotted zero |

Catatan: inventaris memuat Office Code Pro dan varian dotted-zero Office Code Pro D sebagai dua keluarga CSS terpisah.

## Aturan pemuatan

- Semua deklarasi memakai `font-display: swap`.
- Deklarasi `@font-face` tidak otomatis mengunduh berkas. Browser mengambil file hanya ketika keluarga, bobot, dan gaya yang sesuai benar-benar dipakai.
- Hanya Outfit Regular dan Archivo Bold yang dipreload secara global. Anton Regular dipreload hanya pada halaman Profil dan Pengumuman yang memakai display heading tersebut.
- M PLUS disusun sebagai fallback setelah font utama agar glyph non-Latin dapat ditangani tanpa memaksa unduhan besar pada halaman Latin biasa.
- File sumber tetap OTF pada tahap ini. Konversi/subset WOFF2 dapat menjadi pekerjaan optimasi terpisah setelah verifikasi visual dan ukuran output.
- Jangan menambahkan preload untuk semua keluarga atau semua bobot; itu akan mengalahkan pemuatan sesuai kebutuhan.

## Pemetaan visual

- Display: Anton, Reglo, Bagnard.
- Institusional/UI: Archivo, Familjen Grotesk, Outfit, Nunito.
- Editorial: Crimson Pro, Literata, Lora.
- Monospace: Azeret Mono, Office Code Pro, Office Code Pro D.
- Multilingual fallback: M PLUS 1, M PLUS 2, M PLUS U, M PLUS 1 Code, M PLUS Code Latin 50/60.

## Lisensi dan atribusi

Keluarga yang lisensinya sudah disertakan di direktori font tetap mempertahankan berkas lisensi aslinya. Lisensi tambahan untuk font yang sebelumnya belum memiliki file lisensi di repo:

- `public/fonts/Bagnard-OFL.txt` — Sébastien Sanfilippo; SIL Open Font License 1.1. Sumber: https://github.com/sebsan/Bagnard
- `public/fonts/Reglo-OFL.txt` — Sébastien Sanfilippo; SIL Open Font License 1.1. Sumber: https://github.com/sebsan/Reglo
- `public/fonts/Office-Code-Pro-OFL.txt` — Nathan Rutzky dan Adobe Systems; SIL Open Font License 1.1. Sumber: https://www.fontsquirrel.com/license/office-code-pro

Nama keluarga font dipertahankan sesuai nama aslinya. Tidak ada font yang dimodifikasi pada tahap ini.
