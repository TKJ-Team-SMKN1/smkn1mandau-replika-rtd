# Fase 4.2 — Audit Visual dan OCR

**Tanggal:** 18 November 2026  
**Repositori:** `TKJ-Team-SMKN1/smkn1mandau-replika-rtd`  
**Status:** replika/konsep independen; bukan situs resmi.

## Ringkasan hasil

| Sumber | Bukti | Keputusan |
|---|---|---|
| Fasilitas 2022 | Sembilan nama berkas foto: LOBY, KANTIN, LABOR KOMPUTER, MAJELIS GURU, PERPUSTAKAAN, RUANG KELAS, UKS, CCTV, MESJID | Label diturunkan dari nama file; tidak membuktikan inventaris atau kondisi sekarang |
| Ekstrakurikuler 2022 | 14 gambar bernomor 1.jpg–14.jpg | Tidak ada nama kegiatan, pembina, atau jadwal yang ditebak |
| BKK 2023 | Pratinjau gambar kecil (166 px) | Tidak cukup terbaca untuk OCR; nama dan jabatan tidak diekstrak |
| LSP-P1 2021 | PDF SK tertanggal 5 Oktober 2021 | Delapan label jabatan dapat dibaca; tidak dianggap sebagai struktur terkini |

## Struktur LSP-P1 yang terbaca dari PDF 2021

1. Dewan Pengarah
2. Komite Skema Sertifikasi
3. Ketua LSP
4. Kepala Bagian Keuangan
5. Kepala Bagian Administrasi Sertifikasi
6. Kepala Bagian Humas
7. Kepala Bagian Mutu
8. Asesor Kompetensi

Sumber: [PDF SK Struktur Organisasi LSP-P1](https://drive.google.com/file/d/1P6Wy6x2uhk3AKxmwyeUxmkQmab_vVh2W/view). Dataset menyimpan label jabatan dan tanggal dokumen. Nama pemegang jabatan tidak disimpulkan dari struktur historis tersebut.

## Rekonsiliasi direktori SDM

- Snapshot terstruktur tanggal 17 November 2026: 127 entri unik (18 pimpinan/koordinator, 82 guru, 27 layanan).
- Ekstraksi agregat Firecrawl terhadap beranda langsung pada 18 November 2026: 123 entri.
- Selisih empat entri belum direkonsiliasi. Query extraction dapat melewatkan konten; angka 123 bukan hasil audit manual.
- Karena itu, direktori diberi label snapshot bertanggal dan tidak dipresentasikan sebagai daftar personel aktif.

## Catatan aksesibilitas dan UX

- Teks jabatan LSP ditampilkan sebagai teks HTML, bukan hanya gambar.
- Daftar label foto fasilitas dijelaskan sebagai turunan nama file, dengan peringatan bahwa isi gambar belum ditinjau.
- Kontrol pencarian SDM memiliki label; jumlah hasil memakai `aria-live`; filter memakai `aria-pressed`.
- Preflight statis tidak setara dengan sertifikasi WCAG. Pengujian manual dengan keyboard, pembaca layar, zoom 200%, dan pemeriksaan kontras pada state yang dirender masih diperlukan.

## Sumber metodologi

- [W3C WCAG-EM 2.0](https://www.w3.org/TR/wcag-em/) — metodologi evaluasi berbasis cakupan, eksplorasi, sampel, evaluasi, dan pelaporan.
- [Section 508 — Alternative Text](https://www.section508.gov/create/alternative-text/) — alternatif teks yang menyampaikan makna informasi pada gambar.
- [Library of Congress — OCR limitations](https://www.loc.gov/collections/chronicling-america/about-this-collection/technical-information) — OCR tidak 100% akurat dan perlu verifikasi manusia untuk teks yang sulit.
- [Assessing the Accessibility and Usability of Web Archives for Blind Users](https://doi.org/10.1007/978-3-031-72437-4_12) — hambatan alt text dan label ARIA pada arsip web.

## Keterbatasan alat

- Geekflare Lighthouse terhadap situs sumber menghasilkan `NO_FCP`; tidak ada skor performa valid.
- Screenshot Geekflare gagal.
- Tavily menolak permintaan karena batas penggunaan.
- Firecrawl dan Exa berhasil membaca sumber yang dipilih; hasil query agregat SDM tetap perlu rekonsiliasi manual.
