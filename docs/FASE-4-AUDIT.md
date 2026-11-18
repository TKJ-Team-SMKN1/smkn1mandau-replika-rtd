# Fase 4 — Audit Arsip dan Ekstraksi Data

**Tanggal pemeriksaan:** 18 November 2026  
**Repositori:** TKJ-Team-SMKN1/smkn1mandau-replika-rtd  
**Status:** replika/konsep independen, bukan situs resmi sekolah.

## Ringkasan cakupan

- Manifest `daftar_halaman.csv` memuat **100 file HTML**; semuanya memiliki pasangan file dalam arsip pada branch yang diaudit.
- Register `src/data/archive-index.json` menyimpan URL asli, file lokal, tahun bila ada pada URL, tipe halaman, topik, dan status snapshot.
- Beranda resmi berhasil diambil melalui Firecrawl pada 18 November 2026; hasil ekstraksi teks sekitar 93 KB.
- Direktori SDM yang ada di aplikasi berisi **127 entri** (18 pimpinan/koordinator, 82 guru, 27 layanan). Nama-nama tersebut cocok dengan teks publik beranda saat pemeriksaan. Sumber tidak menyatakan tanggal pembaruan daftar, sehingga kecocokan teks bukan konfirmasi status kerja atau jabatan terkini.
- Beranda resmi menampilkan **10 nama program keahlian**. Artikel pemutakhiran LSP-P1 pada 7 November 2023 hanya menyebut **7 program** untuk konteks perangkat asesmen LSP; keduanya tidak boleh dicampur atau dianggap saling membantah.
- Katalog kegiatan berisi **20 ringkasan historis** yang terhubung ke sumber masing-masing.

## Temuan penting per kelompok

| Kelompok | Temuan | Keputusan data |
|---|---|---|
| Identitas dan sejarah | Halaman identitas, sejarah, dan visi-misi memiliki teks yang dapat dibaca. | Diekstrak ke `school-profile.json` dengan URL dan nama file sumber. |
| Program keahlian | Beranda resmi menampilkan sepuluh nama program. | Diekstrak ke `programs.json`; kata kunci pencarian tetap metadata UI, bukan klasifikasi resmi. |
| Guru dan pegawai | Bagian beranda memuat nama dan label jabatan; seluruh 127 entri aplikasi cocok dengan teks yang diekstrak. | Dipindahkan ke `staff.json`; status masa berlaku diberi batasan karena tanggal pembaruan tidak tersedia. Foto tidak disalin. |
| Fasilitas | Halaman fasilitas 2022 berbasis media visual. Halaman sejarah memberi angka historis, termasuk 26 ruang kelas/lokal, 3 ruang komputer, dan 6 bengkel praktik pada uraian perkembangan 2004–2012. | Hanya dicatat sebagai snapshot historis; inventaris saat ini tetap kosong/tidak terverifikasi. |
| Ekstrakurikuler | Halaman ekstrakurikuler dalam arsip tidak memberi daftar teks yang bisa diverifikasi. | Tidak mengarang nama kegiatan, pembina, atau jadwal; dataset `extracurriculars.json` menyimpan alasan kekosongan. |
| BKK | Fungsi BKK dijelaskan dalam artikel 2023; halaman struktur organisasi berupa gambar. | Fungsi dan aktivitas historis diekstrak; anggota struktur tidak ditebak dari gambar. |
| LSP-P1 | Visi tersedia dalam teks; struktur organisasi memakai gambar/tautan unduhan; artikel 7 November 2023 menyebut tujuh program untuk pemutakhiran perangkat asesmen. | Visi dan tujuh program konteks 2023 diekstrak; anggota organisasi tidak ditebak. |
| Pengumuman | Banyak pengumuman PPDB, kelulusan, dan MPLS berisi instruksi lama, tautan login, atau unduhan. | Ditandai sebagai arsip historis. Jangan menyalin formulir/login atau menampilkan jadwal lama sebagai aktif. |
| Lowongan kerja | Arsip lowongan 2023–2024 memiliki tanggal dan nama perusahaan, tetapi periode rekrutmen sudah lewat. | Dipakai sebagai arsip kegiatan BKK saja, bukan daftar lowongan aktif. |
| Hasil pencarian | Sebagian dari 100 file adalah hasil pencarian dan indeks, bukan artikel unik. | Disimpan untuk jejak cakupan; jangan dihitung sebagai postingan unik. |

## Konflik dan keterbatasan yang ditemukan

1. **Tanggal workshop pembelajaran guru:** sumber menyebut rangkaian empat hari, tetapi penulisan hari/tanggal pada teks sumber tidak konsisten. Dataset menandainya `source-date-conflict` dan tidak memaksakan tanggal tunggal.
2. **Program 10 vs 7:** sepuluh program berasal dari bagian “Program Keahlian” pada beranda; tujuh program berasal dari artikel pemutakhiran LSP-P1 tahun 2023. Itu dua konteks berbeda.
3. **Fasilitas:** angka dari sejarah sekolah bukan inventaris sekarang. Halaman fasilitas terarsip tidak menyediakan teks yang cukup untuk memverifikasi daftar dan kondisi fasilitas saat ini.
4. **Ekstrakurikuler:** nama kegiatan tidak diekstrak karena bukti arsip berbasis gambar tanpa keterangan tekstual yang memadai.
5. **BKK/LSP:** diagram organisasi berupa gambar atau tautan unduhan. Nama anggota dan pembagian jabatan tidak disimpulkan dari gambar.
6. **Staff freshness:** teks beranda saat pemeriksaan cocok dengan 127 entri, tetapi tanggal pembaruan tidak dipublikasikan. Data ini tidak boleh dipakai untuk menyatakan seseorang masih aktif bekerja di jabatan tersebut.
7. **Pengumuman dan lowongan:** halaman 2022–2026 yang sudah lewat tetap menjadi bukti sejarah publikasi, bukan instruksi operasional.

## Perlindungan data dan batasan publikasi

- Tidak mengekstrak nama siswa, daftar calon murid, foto siswa, kelas, atau keikutsertaan siswa yang dapat mengidentifikasi individu.
- Tidak menyalin nomor pribadi atau alamat rumah. Kontak sekolah hanya ditampilkan jika dipublikasikan sebagai kanal sekolah.
- Direktori SDM hanya memuat nama dan label peran publik; tidak menyalin foto personel dan tidak mengklaim validitas jabatan saat ini.
- Tautan login, formulir, atau unduhan dari pengumuman lama tidak direplikasi sebagai fungsi aktif.
- Data yang tidak ditemukan dibedakan dari klaim bahwa sesuatu tidak ada.

## Easter egg dan hygiene webroot

File `public/.env` berisi placeholder bercanda untuk `OPENAI_API_KEY`, bukan kredensial valid. Untuk mencegah file mirip konfigurasi rahasia ikut tersaji dari webroot, artefak tersebut dipindahkan ke `docs/easter-eggs/OPENAI_API_KEY.fake` dan tetap diberi label sebagai joke/non-secret. Jangan pernah menaruh kredensial asli di repositori atau folder `public/`.

## Sumber dan metode

- Arsip lokal: `data/raw-archive/hasil_scrape_smkn1mandau/` dan `daftar_halaman.csv`.
- Situs sekolah: `http://www.smkn1mandau.sch.id/` dan halaman yang tercantum di `src/data/archive-index.json`.
- Model provenance: [W3C PROV-O](https://www.w3.org/TR/prov-o) dan [PROV-DM](https://www.w3.org/TR/prov-dm).
- Web archiving: [Library of Congress — Web Archiving FAQs](https://www.loc.gov/programs/web-archiving/about-this-program/faq/) dan [Maemura et al. (2018), DOI 10.1002/asi.24048](https://doi.org/10.1002/asi.24048).
- Dataset turunan arsip: [Ruest et al. (2022), DOI 10.1080/23257962.2022.2100336](https://doi.org/10.1080/23257962.2022.2100336).
- Document processing provenance: [Rauch et al. (2025), DOI 10.1109/JCDL67857.2025.00038](https://doi.org/10.1109/JCDL67857.2025.00038).
- Privacy-by-design benchmark: [NIST Privacy Framework](https://www.nist.gov/privacy-framework).

Klasifikasi tipe arsip: {"homepage":2,"search-results":14,"profile-or-unit-page":9,"article-or-static-page":59,"announcement":16}. Angka tersebut berasal dari aturan klasifikasi nama/URL dan perlu dibaca sebagai indeks audit, bukan ukuran kualitas konten.
