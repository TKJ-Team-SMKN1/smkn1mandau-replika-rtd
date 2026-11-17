# SMK Negeri 1 Mandau — Replika / Konsep Independen

Proyek antarmuka berbasis **Astro + React + TypeScript + Tailwind CSS + CSS Houdini**. Ini adalah replika/konsep independen untuk pengembangan dan peninjauan UX/UI, **bukan situs resmi SMK Negeri 1 Mandau dan tidak mewakili pihak sekolah**.

Konten profil, daftar program, dan ringkasan arsip pengumuman merujuk pada publikasi situs resmi. Setiap pengunjung tetap diarahkan ke sumber asli untuk ketentuan dan informasi terbaru. Lihat [register sumber dan kebijakan konten](docs/SUMBER-DATA.md).

## Menjalankan secara lokal

```bash
npm ci
npm run dev
```

Buka `http://localhost:4321`.

## Build dan pratinjau lokal

```bash
npm run build
npm run preview
```

Hasil build statis berada di folder `dist/`. Build perlu dijalankan sebelum menyatakan perubahan siap rilis.

## Status deployment

Deployment Vercel proyek ini sedang **dipause atas keputusan pemilik proyek**. Pengembangan GitHub pada branch `main` dapat berlanjut, tetapi jangan melakukan deploy atau mengaktifkan kembali proyek tanpa instruksi eksplisit.

## Struktur folder

```
src/
  components/     Komponen React (.jsx) dan Astro (.astro)
  layouts/        Layout bersama, termasuk pemberitahuan replika
  pages/          Route halaman
  styles/         CSS global, semantic tokens, lima tema, setup Houdini
data/
  raw-archive/   Arsip HTML hasil scrape; bukan aset web yang disajikan langsung
public/
  houdini/        Paint worklet motif Batik Rangkai
  scripts/        Deteksi fitur dan dukungan bahasa
  fonts/          Font lokal bila digunakan
docs/
  SUMBER-DATA.md  Sumber konten, tanggal, dan aturan verifikasi
```

## Ruang lingkup konten

- **Profil:** riwayat, visi, misi, daftar program, dan kontak yang dipublikasikan sekolah.
- **Program:** sepuluh nama program yang tercantum pada beranda resmi. Pencarian hanya alat navigasi; bukan klasifikasi resmi.
- **Pengumuman:** ringkasan arsip postingan resmi yang bertanggal 2026 dan tahun pelajaran 2025/2026. Jangan menganggap tautan atau jadwal arsip masih aktif.
- **Statistik:** hanya angka historis yang punya rujukan eksplisit. Tidak ada angka siswa, guru, atau mitra yang ditebak.
- **Bahasa antarmuka:** Indonesia, English, Bahasa Melayu, dan 中文. Cakupan terjemahan terus diperluas; konten resmi berbahasa Indonesia tetap menjadi rujukan utama.

## Prinsip sumber dan akurasi

1. Prioritaskan publikasi di `smkn1mandau.sch.id`.
2. Gunakan Wikipedia hanya sebagai pembanding, bukan sumber utama.
3. Bedakan fakta yang tertulis pada sumber, ringkasan editorial, dan fitur navigasi buatan replika.
4. Jangan membuat pengumuman, statistik, status akreditasi, jadwal aktif, atau detail kurikulum tanpa sumber yang jelas.
5. Untuk pengumuman, tampilkan tanggal/status arsip dan tautan menuju postingan aslinya.
6. Jangan mengumpulkan atau menampilkan data pribadi siswa.

## Implementasi teknis

- **Astro:** routing berbasis file dan output statis.
- **React:** interaksi yang memang memerlukan state, seperti notifikasi dan pencarian program.
- **Tailwind CSS:** utility styling melalui Vite plugin; warna dan tipografi memakai semantic tokens serta font lokal.
- **CSS Houdini:** `public/houdini/batik-paint-worklet.js` mempertahankan motif Batik Rangkai. Browser tanpa dukungan Houdini memakai fallback CSS pada `.batas-ukir`.
- **TypeScript:** tersedia sebagai dev dependency dan digunakan bertahap untuk theme controller serta pemeriksaan tipe.
- **Theme engine:** Light, Dark, Super Black, AMOLED Black, dan Dynamic Color; preferensi disimpan lokal di perangkat.
- **Font lokal:** 19 keluarga / 174 face OTF disimpan di `public/fonts/` dan dipanggil melalui URL root `/fonts/`. File lisensi tetap disertakan.
- **Deteksi fitur:** `public/scripts/deteksi-fitur.js` memeriksa dukungan browser; fitur ini tidak membatasi akses ke konten.
- **Aksesibilitas:** fokus keyboard, reduced motion, heading semantik, label input, dan status hasil pencarian.

## Arsip sumber HTML

Salinan halaman hasil scrape disimpan di `data/raw-archive/hasil_scrape_smkn1mandau/` bersama `daftar_halaman.csv`. Arsip dipertahankan sebagai bahan referensi dan tidak disajikan dari webroot agar dokumen HTML tidak berjalan pada origin situs replika.

## Lisensi font

Font Outfit, Archivo, dan Azeret Mono dimuat dari aset lokal di `public/fonts/`. File lisensi disertakan bersama keluarga font terkait. Pertahankan file lisensi saat font dipindahkan atau didistribusikan.
