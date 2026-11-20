# SMK Negeri 1 Mandau — Replika / Konsep Independen

Proyek antarmuka berbasis **Astro + React + TypeScript + Tailwind CSS + CSS Houdini**. Ini adalah replika/konsep independen untuk pengembangan dan peninjauan UX/UI, **bukan situs resmi SMK Negeri 1 Mandau dan tidak mewakili pihak sekolah**.

## Lisensi proyek

Kode asli yang dikembangkan khusus untuk proyek ini dilisensikan berdasarkan **GNU Affero General Public License v3.0 (AGPL-3.0-only)**. Teks lisensi lengkap tersedia di [LICENSE](./LICENSE).

Lisensi proyek ini **tidak mengganti atau mengambil alih lisensi/hak pihak ketiga**. Library dan framework pada dependency, berkas font beserta pemberitahuan lisensi upstream-nya, arsip HTML dan konten yang berasal dari situs sekolah, serta aset pihak ketiga lainnya tetap mengikuti lisensi atau hak masing-masing. Jangan menghapus atau mengubah pemberitahuan lisensi yang menyertai komponen tersebut.

Karena AGPL-3.0 memiliki ketentuan interaksi jaringan pada bagian 13, tautan **Source code & license** tersedia di footer website dan mengarah ke repositori publik ini.

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
npm run audit:html
npm run preview
```

Hasil build statis berada di folder `dist/`. `npm run audit:html` memeriksa metadata dokumen, landmark utama, alt gambar, nama tombol, tautan tab baru, referensi lokal, dan keberadaan font. Audit ini adalah preflight statis, bukan sertifikasi WCAG; pengujian keyboard, kontras, zoom, dan screen reader tetap diperlukan.

## Status deployment

Deployment Production terbaru yang diperiksa berstatus **READY** dan alias publik https://smkn1mandau-replika-rtd.vercel.app merespons HTTP 200 pada audit 19 November 2026. Semua 11 rute aplikasi lolos pemeriksaan HTTP publik; `robots.txt` dan `sitemap.xml` juga merespons HTTP 200.

**Catatan status Vercel:** setelah permintaan unpause, detail proyek masih mengembalikan `live: false`, meskipun deployment Production READY dan alias publik dapat diakses. Status pause/live di control plane masih perlu dikonfirmasi melalui Vercel Dashboard. Lihat [catatan deployment dan audit](docs/DEPLOYMENT-AUDIT-2026-11-19.md) untuk bukti, batas audit, dan pekerjaan terbuka.

Status deployment tidak mengubah sifat proyek: ini tetap replika/konsep independen, bukan situs resmi sekolah.

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
- **Aksesibilitas:** fokus keyboard dua lapis, reduced motion, heading semantik, label input, batas kontrol kontras, dan status hasil pencarian.

## Arsip sumber HTML

Salinan halaman hasil scrape disimpan di `data/raw-archive/hasil_scrape_smkn1mandau/` bersama `daftar_halaman.csv`. Arsip dipertahankan sebagai bahan referensi dan tidak disajikan dari webroot agar dokumen HTML tidak berjalan pada origin situs replika.

## Lisensi font

Font Outfit, Archivo, dan Azeret Mono dimuat dari aset lokal di `public/fonts/`. File lisensi disertakan bersama keluarga font terkait. Pertahankan file lisensi saat font dipindahkan atau didistribusikan.

### Fase 3

Navigasi Jelajah menambahkan halaman Fasilitas, Ekstrakurikuler, Kegiatan, dan Unit Sekolah. Informasi historis diberi label periode; halaman sumber yang hanya berupa gambar tidak diisi dengan tebakan. Halaman Pengaturan menampilkan spesimen 19 keluarga font/174 face OTF. CI menjalankan preflight HTML, WCAG statis, dan audit dependensi; pemeriksaan otomatis bukan sertifikasi WCAG 2.2 AA.
