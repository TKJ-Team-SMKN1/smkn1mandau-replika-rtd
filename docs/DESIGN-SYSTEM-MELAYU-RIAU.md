# Design system — Melayu-Riau Technical

## Arah visual
Identitas visual menggabungkan bahasa visual institusi pendidikan teknik dengan aksen Melayu-Riau yang terkendali. Palet utama menggunakan navy teknikal, biru, hijau, gading, tembaga dan emas. Motif pucuk rebung/songket ditempatkan sebagai aksen tepi, garis pembatas, atau ornamen latar berkontras rendah; bukan sebagai tekstur di belakang paragraf.

Referensi budaya:
- [Pucuk Rebung Riau — iWareBatik](https://www.iwarebatik.org/pucuk-rebung-riau-royal)
- [Songket — UNESCO Intangible Cultural Heritage](https://ich.unesco.org/en/RL/songket-01505)
- [Kajian motif songket Melayu Indragiri Hulu (2024)](https://jurnal.isi-ska.ac.id/index.php/brikolase/article/download/5805/4106/18518)

## Typography roles
Seluruh 19 keluarga font OTF lokal tetap tersedia melalui `font-library.css`; 174 face OTF dideklarasikan dengan `font-display: swap`. Keluarga tidak dipaksa tampil serentak.

| Family | Role |
|---|---|
| Anton | Display headline, hero title only |
| Archivo | Heading, brand name, strong UI |
| Azeret Mono | Technical labels, section eyebrow, metadata |
| Bagnard | Editorial accent and short callouts |
| Crimson Pro | Quotes and long-form serif fallback |
| Familjen Grotesk | Navigation and compact UI |
| Literata | Long-form editorial reading |
| Lora | Editorial secondary text |
| M PLUS 1 | Multilingual sans fallback |
| M PLUS 1 Code | Code fallback |
| M PLUS 2 | Body fallback for broad glyph coverage |
| M PLUS Code Latin 50 | Compact technical code |
| M PLUS Code Latin 60 | Technical code and identifiers |
| M PLUS U | Multilingual fallback |
| Nunito | Friendly utility and helper text |
| Outfit | Primary body text |
| Reglo | Short labels and identity accents |
| Office Code Pro D | Technical/editorial code display |
| Office Code Pro | Code, preformatted content, identifiers |

CJK assets are retained separately: Noto Sans SC subset assets for Simplified Chinese, Noto Sans TC subset assets for Traditional Chinese, and Source Han Serif HK OTF faces. Do not load the entire subset collection on every route. Do not register one arbitrary subset as if it covers the whole writing system; preserve upstream unicode-range mapping. Until the subset-to-unicode map is verified, retain installed system CJK fallbacks to prevent missing-glyph regressions.

## Accessibility acceptance baseline
WCAG 2.2 Level A and AA are the acceptance target, not an automatic certification claim.
- Text contrast: 4.5:1 normal, 3:1 large text (SC 1.4.3).
- Non-text contrast: 3:1 for required UI boundaries and states (SC 1.4.11).
- Keyboard operation, visible focus, focus not obscured, logical order and skip link (SC 2.1.1, 2.4.7, 2.4.11, 2.4.12).
- Minimum target size 24 × 24 CSS px or a documented exception (SC 2.5.8); this system prefers 44 px.
- Reflow at 320 CSS px, text resize to 200%, and text-spacing overrides without loss of content/function (SC 1.4.10, 1.4.4, 1.4.12).
- Respect `prefers-reduced-motion`; do not rely on animation to convey information.
- Use semantic HTML first. Add ARIA only where native semantics do not express role/name/state.
- Informative images need suitable alternative text; decorative motifs stay hidden from assistive technology.
- Language switch updates document language to `id-ID`, `en`, `ms-MY`, or `zh-CN`.

## Search
Global search indexes known public information sections and program names as navigation shortcuts. It does not imply a real-time school database or an up-to-date operational record.

## Content integrity
The project remains a replica/concept, not an official school channel. Historical snapshots, current inventories, staff lists, and operational announcements must retain source dates and caveats. Never turn a historical count into a current fact. Missing source information stays unverified.

## Verification
Static audits are preflight checks, not WCAG certification. Release review still requires keyboard-only walkthroughs, screen-reader spot checks, contrast measurement for every theme/state, 200% zoom and 320 CSS px reflow, reduced-motion and forced-colors checks, browser/device checks, and font Network inspection for status/MIME/CORS/glyph coverage.
