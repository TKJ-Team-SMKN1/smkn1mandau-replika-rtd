# Local font inventory

## Verified repository inventory
The main branch contains 19 OTF families represented in `src/styles/font-library.css`, with 174 declared OTF faces. The stylesheet uses `font-display: swap`; font files are requested by role rather than loading every family at startup.

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

## CJK loading caution
Noto Sans SC and Noto Sans TC are distributed as many subset files. Do not load all subsets on every route, and do not register one subset as though it covers the whole writing system. Preserve the correct unicode-range map when integrating these assets. Until that map is verified, keep installed system CJK fonts as fallback. Source Han Serif HK should be reserved for HK Traditional Chinese and not substituted indiscriminately for Simplified Chinese.

## Font failure triage
For a reported failure, record the exact requested URL and locale, browser/device and OS, HTTP status and response content type, CORS/security-checkpoint state, console decoding errors, and whether fallback glyphs render. A screenshot alone cannot distinguish a missing asset, blocked request, invalid MIME, decoding failure, or missing glyph.
