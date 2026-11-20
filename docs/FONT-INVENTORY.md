# Local font inventory

## Verified repository inventory
The main branch contains 19 OTF families represented in `src/styles/font-library.css`, with 174 declared OTF faces. The stylesheet uses `font-display: swap`; font files are requested by role rather than loading every family at startup. The 174 OTF paths are Git LFS pointers in the source checkout, backed by LFS objects. `predev` and `prebuild` run `scripts/materialize-lfs-fonts.mjs`, which downloads each referenced object from GitHub LFS using a pinned commit reference, verifies its expected byte length and SHA-256, validates the OpenType signature, then replaces the pointer in the build workspace. `scripts/audit-built-fonts.mjs` verifies the generated `dist` contains actual font binaries, not pointer text.

Additional CJK assets:
- Noto Sans SC subset assets (Simplified Chinese).
- Noto Sans TC subset assets (Traditional Chinese).
- Source Han Serif HK OTF faces (Hong Kong Traditional Chinese).
- M PLUS families provide multilingual and code fallbacks.

## Family mapping
| Family | Assigned usage |
|---|---|
| Anton | Hero/display headings |
| Archivo | Main headings and brand |
| Azeret Mono | Technical labels |
| Bagnard | Editorial accent |
| Crimson Pro | Quotes and serif fallback |
| Familjen Grotesk | Navigation/UI |
| Literata | Long-form reading |
| Lora | Editorial support |
| M PLUS 1 | Multilingual sans fallback |
| M PLUS 1 Code | Code fallback |
| M PLUS 2 | Body fallback |
| M PLUS Code Latin 50 | Technical code |
| M PLUS Code Latin 60 | Technical code |
| M PLUS U | Multilingual fallback |
| Nunito | Utility/help text |
| Outfit | Primary body |
| Reglo | Identity accents |
| Office Code Pro D | Technical code display |
| Office Code Pro | Code and identifiers |

## MIME, CORS and asset delivery
Font assets are served from the same origin as the website, so cross-origin font permission is not required. A live check of the CJK WOFF2 asset returned HTTP 200 with `font/woff2`; the OTF path also returned `font/otf` but its Git checkout body was only an LFS pointer. The build materializer resolves that pointer to the actual LFS binary before output. `audit-built-fonts.mjs` checks the OTF/WOFF2 signatures and rejects pointer text in `dist`.

## CJK subset integration and verification
Noto Sans SC is mapped through 101 local WOFF2 subset faces; Noto Sans TC through 108 local WOFF2 subset faces. The CSS retains upstream unicode-range declarations and uses local repository URLs only. Source Han Serif HK is mapped through seven local OTF weights (200–900). A repository-tree comparison verified that all 216 WOFF2 subset URLs and all seven OTF URLs exist, with zero missing paths and zero remote font URLs.

CJK stylesheets are loaded on demand when the corresponding language is selected. Simplified Chinese uses Noto Sans SC; Traditional Chinese can use Noto Sans TC and Source Han Serif HK. Do not substitute the HK serif face indiscriminately for Simplified Chinese.

## Font failure triage
For a reported failure, record the exact requested URL and locale, browser/device and OS, HTTP status and response content type, CORS/security-checkpoint state, console decoding errors, and whether fallback glyphs render. A screenshot alone cannot distinguish a missing asset, blocked request, invalid MIME, decoding failure, or missing glyph.
