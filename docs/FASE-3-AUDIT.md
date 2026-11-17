# Fase 3 — Implementasi, aksesibilitas, dan keamanan

Tanggal implementasi: 18 November 2026.

## Perubahan produk
- Navigasi Jelajah dan halaman Fasilitas, Ekstrakurikuler, Kegiatan, serta Unit Sekolah.
- Katalog 20 publikasi kegiatan historis 2023–2024.
- Fakta fasilitas historis dipisahkan dari inventaris terkini.
- Ringkasan BKK dan LSP-P1 bersumber dari publikasi sekolah.
- Spesimen visual 19 keluarga font lokal dan 174 face OTF.

## Integritas data
Halaman Fasilitas dan Ekstrakurikuler yang terarsip memuat media visual tetapi tidak menyediakan daftar teks yang dapat diverifikasi. Nama ruang, kondisi fasilitas terkini, nama klub, pembina, jadwal, dan rincian struktur organisasi berbasis gambar tidak direka. Catatan fasilitas pada halaman sejarah diberi label historis sampai periode 2012.

Sumber: https://www.smkn1mandau.sch.id/ · http://www.smkn1mandau.sch.id/2022/04/sejarah-sekolah.html · http://www.smkn1mandau.sch.id/2022/05/fasilitas.html · http://www.smkn1mandau.sch.id/2022/05/ekstrakurikuler.html · http://www.smkn1mandau.sch.id/search?q=kegiatan

## WCAG 2.2 AA
Implementasi mencakup skip link, landmark bernama, satu h1 per halaman, navigasi dropdown details/summary, indikator fokus dua lapis berbasis warna sistem, scroll margin untuk header sticky, target navigasi 44 CSS px, reduced-motion, forced-colors, label programatik, dan rel=noopener. Preflight CI memeriksa token kontras untuk enam palet fallback (teks 4,5:1; batas kontrol 3:1), struktur HTML, serta baseline target. **Preflight bukan sertifikasi WCAG 2.2 AA.** Keyboard, screen reader, kontras rendered-state, zoom 200%, reflow 320 CSS px, dan fokus yang tidak tertutup header masih memerlukan evaluasi manual.

## Keamanan dependensi
Lockfile memuat picomatch 2.3.2 dan 4.0.7. GHSA-fc5q-39xc-vjpf / CVE-2026-112366 menyebut versi sampai 4.0.7 terdampak ReDoS melalui repeated extglob satu cabang dan saat ini tidak mencantumkan versi patched. Tidak ada downgrade Astro, override ke fork tak terverifikasi, atau klaim bahwa advisory telah ditambal. Risiko build-time tetap terbuka; CI memblokir temuan Critical/High lain yang belum ditinjau.

Referensi: https://github.com/advisories/GHSA-fc5q-39xc-vjpf · https://osv.dev/vulnerability/GHSA-fc5q-39xc-vjpf · https://github.com/micromatch/picomatch/releases

Vercel tetap PITSTOP. Arsip raw scrape tidak diubah. Pengujian assistive technology dan kontras rendered-state belum dilakukan manual.


## Pembaruan aksesibilitas — 18 November 2026

- Preflight menghitung pasangan kontras token utama untuk enam palet fallback: teks normal/muted, aksen, teks tombol, batas kontrol, header, dan hero.
- Ambang pemeriksaan: 4,5:1 untuk teks normal dan 3:1 untuk batas kontrol yang diperlukan untuk mengenali komponen.
- Batas form control memakai token khusus per tema, bukan garis dekoratif tipis.
- Navigasi mobile aktif memakai warna teks header dan underline aksen sebagai penanda yang tidak bergantung pada warna saja.
- Fokus keyboard memakai dua lapis warna sistem `CanvasText` dan `Canvas` untuk permukaan terang maupun gelap.
- Target utama navigasi dan kontrol tetap 44 CSS px (di atas minimum 24 CSS px WCAG 2.2).

Batas pemeriksaan: dynamic OS colors, gambar, gradien aktual, state hover/focus, seluruh komponen pada semua halaman, reflow 320 CSS px/400% zoom, screen reader, dan uji keyboard nyata tetap perlu evaluasi manual. Pemeriksaan token tidak berarti semua pasangan warna rendered telah terverifikasi.
