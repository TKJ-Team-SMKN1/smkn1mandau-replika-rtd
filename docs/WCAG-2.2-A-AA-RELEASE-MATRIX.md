# WCAG 2.2 Level A + AA — complete release matrix

**Purpose:** release-gate inventory for every WCAG 2.2 Level A and Level AA success criterion. This is an applicability checklist, not a declaration of conformance.

- **Applicable:** the criterion applies to the current website and must pass on every relevant route/state.
- **Conditional:** evaluate the stated trigger against every asset/feature. If the trigger exists, it becomes a release blocker; if absent, record the evidence supporting non-applicability.
- **Current verification status:** the development branch has automated source/build preflight only. This matrix does not mark any criterion as independently verified. Manual keyboard, screen-reader, zoom/reflow, text-spacing, contrast-state, and browser checks remain required before claiming conformance.
- The complete matrix has **55** Level A/AA criteria. Level AAA criteria are intentionally excluded from the mandatory baseline.

| WCAG 2.2 SC | Official success criterion | Level | Applicability | Release check |
|---|---|---:|---|---|
| 1.1.1 | Non-text Content | A | Applicable | Semua gambar, ikon informatif, dan media visual; audit alt text per halaman. |
| 1.2.1 | Audio-only and Video-only (Prerecorded) | A | Conditional | Berlaku jika aset audio/video prarekaman tanpa alternatif teks tersedia. |
| 1.2.2 | Captions (Prerecorded) | A | Conditional | Berlaku untuk media tersinkronisasi dengan audio prarekaman. |
| 1.2.3 | Audio Description or Media Alternative (Prerecorded) | A | Conditional | Berlaku untuk video prarekaman dengan informasi visual bermakna. |
| 1.2.4 | Captions (Live) | AA | Conditional | Berlaku jika sekolah menambahkan siaran langsung dengan audio. |
| 1.2.5 | Audio Description (Prerecorded) | AA | Conditional | Berlaku untuk video prarekaman yang menyampaikan informasi visual. |
| 1.3.1 | Info and Relationships | A | Applicable | Semantik heading, daftar, tabel, label, landmark, dan relasi kontrol. |
| 1.3.2 | Meaningful Sequence | A | Applicable | Urutan baca DOM harus sesuai urutan makna pada semua breakpoint. |
| 1.3.3 | Sensory Characteristics | A | Applicable | Instruksi tidak boleh bergantung hanya pada warna, bentuk, posisi, atau suara. |
| 1.3.4 | Orientation | AA | Applicable | Portrait dan landscape harus tetap mendukung konten/fungsi kecuali esensial. |
| 1.3.5 | Identify Input Purpose | AA | Conditional | Gunakan autocomplete purpose tokens jika form meminta data pribadi pengguna. |
| 1.4.1 | Use of Color | A | Applicable | Warna bukan satu-satunya pembeda status, tautan, atau instruksi. |
| 1.4.2 | Audio Control | A | Conditional | Berlaku jika audio diputar otomatis lebih dari tiga detik. |
| 1.4.3 | Contrast (Minimum) | AA | Applicable | Teks normal 4.5:1; teks besar 3:1 pada seluruh tema/state. |
| 1.4.4 | Resize Text | AA | Applicable | Teks dapat diperbesar hingga 200% tanpa kehilangan konten/fungsi. |
| 1.4.5 | Images of Text | AA | Conditional | Hindari gambar teks kecuali logo atau presentasi esensial. |
| 1.4.10 | Reflow | AA | Applicable | Tidak ada kehilangan fungsi pada 320 CSS px; konten dua dimensi hanya jika esensial. |
| 1.4.11 | Non-text Contrast | AA | Applicable | Kontrol, state, ikon informatif dan grafik bermakna 3:1 terhadap warna bersebelahan. |
| 1.4.12 | Text Spacing | AA | Applicable | Tidak kehilangan konten/fungsi saat empat override spasi teks WCAG diterapkan. |
| 1.4.13 | Content on Hover or Focus | AA | Conditional | Menu/dropdown dan konten tambahan harus dismissible, hoverable, persistent. |
| 2.1.1 | Keyboard | A | Applicable | Semua fungsi tersedia melalui keyboard tanpa timing khusus. |
| 2.1.2 | No Keyboard Trap | A | Applicable | Fokus dapat masuk dan keluar dari semua komponen menggunakan keyboard. |
| 2.1.4 | Character Key Shortcuts | A | Conditional | Berlaku jika website menyediakan shortcut satu karakter. |
| 2.2.1 | Timing Adjustable | A | Conditional | Berlaku jika konten menerapkan batas waktu. |
| 2.2.2 | Pause, Stop, Hide | A | Conditional | Berlaku untuk gerak otomatis, kedipan, scroll, atau pembaruan otomatis. |
| 2.3.1 | Three Flashes or Below Threshold | A | Conditional | Semua media/animasi baru harus diperiksa terhadap ambang kilatan. |
| 2.4.1 | Bypass Blocks | A | Applicable | Skip link dan mekanisme melewati blok berulang. |
| 2.4.2 | Page Titled | A | Applicable | Judul unik dan deskriptif untuk setiap halaman. |
| 2.4.3 | Focus Order | A | Applicable | Urutan fokus mempertahankan makna dan operabilitas. |
| 2.4.4 | Link Purpose (In Context) | A | Applicable | Tujuan tautan dapat ditentukan dari teks/konteks programatik. |
| 2.4.5 | Multiple Ways | AA | Applicable | Lebih dari satu cara menemukan halaman, termasuk navigasi dan pencarian. |
| 2.4.6 | Headings and Labels | AA | Applicable | Heading dan label mendeskripsikan topik/tujuan. |
| 2.4.7 | Focus Visible | AA | Applicable | Indikator fokus terlihat untuk semua kontrol keyboard. |
| 2.4.11 | Focus Not Obscured (Minimum) | AA | Applicable | Komponen fokus tidak seluruhnya tertutup konten buatan penulis. |
| 2.5.1 | Pointer Gestures | A | Conditional | Berlaku jika fungsi memakai gestur multipoint atau berbasis jalur. |
| 2.5.2 | Pointer Cancellation | A | Applicable | Aksi pointer tidak hanya berjalan pada down-event tanpa mekanisme pembatalan yang sesuai. |
| 2.5.3 | Label in Name | A | Applicable | Nama aksesibel memuat label visual untuk kontrol yang memiliki label teks. |
| 2.5.4 | Motion Actuation | A | Conditional | Berlaku jika fungsi dipicu gerakan perangkat/pengguna. |
| 2.5.7 | Dragging Movements | AA | Conditional | Fitur drag harus memiliki alternatif single-pointer tanpa dragging kecuali pengecualian berlaku. |
| 2.5.8 | Target Size (Minimum) | AA | Applicable | Target pointer minimal 24×24 CSS px atau memenuhi salah satu pengecualian; desain menargetkan 44 px. |
| 3.1.1 | Language of Page | A | Applicable | Bahasa halaman diprogramkan sesuai ID-ID, en, ms-MY, atau zh-CN. |
| 3.1.2 | Language of Parts | AA | Applicable | Bagian berbahasa berbeda diberi atribut lang jika dapat ditentukan. |
| 3.2.1 | On Focus | A | Applicable | Mendapat fokus tidak memicu perubahan konteks otomatis. |
| 3.2.2 | On Input | A | Applicable | Mengubah kontrol tidak otomatis memindahkan konteks tanpa pemberitahuan. |
| 3.2.3 | Consistent Navigation | AA | Applicable | Navigasi berulang memiliki urutan relatif yang konsisten. |
| 3.2.4 | Consistent Identification | AA | Applicable | Komponen dengan fungsi sama dikenali secara konsisten. |
| 3.2.6 | Consistent Help | A | Conditional | Jika mekanisme bantuan berulang disediakan, urutan relatifnya konsisten. |
| 3.3.1 | Error Identification | A | Conditional | Berlaku untuk form yang menghasilkan error input. |
| 3.3.2 | Labels or Instructions | A | Applicable | Kontrol input memiliki label/instruksi yang dapat diakses. |
| 3.3.3 | Error Suggestion | AA | Conditional | Berlaku saat error input dapat diperbaiki dan saran diketahui. |
| 3.3.4 | Error Prevention (Legal, Financial, Data) | AA | Conditional | Berlaku untuk pengiriman/hapus data legal, finansial, atau data penting. |
| 3.3.7 | Redundant Entry | A | Conditional | Alur multi-langkah harus memakai ulang atau menyediakan pilihan data yang telah dimasukkan. |
| 3.3.8 | Accessible Authentication (Minimum) | AA | Conditional | Berlaku jika autentikasi ditambahkan; cognitive function test harus punya alternatif yang diizinkan. |
| 4.1.2 | Name, Role, Value | A | Applicable | Nama, peran, nilai, dan state komponen tersedia bagi teknologi bantu. |
| 4.1.3 | Status Messages | AA | Applicable | Status dinamis dapat dikenali tanpa memindahkan fokus. |

## Mandatory evidence for each release
1. Record each applicable criterion as pass/fail/not applicable with a route, UI state, test method, and evidence.
2. For conditional criteria, record whether the trigger exists and inspect every matching media item or interaction.
3. Run keyboard-only navigation and verify focus order, visible focus, escape paths, and no traps.
4. Check text resizing to 200%, reflow at 320 CSS px, and the WCAG text-spacing override values.
5. Measure text and non-text contrast for all themes, hover/focus/active/disabled states, and Dynamic Color fallback combinations.
6. Test Android Chrome with TalkBack and a desktop browser with NVDA; include iOS Safari/VoiceOver and Firefox/Safari cross-browser review where available.
7. Re-run the matrix whenever routes, assets, navigation, forms, media, or interactive controls change.

## Source references
- [W3C WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/)
- [W3C WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [W3C Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)
