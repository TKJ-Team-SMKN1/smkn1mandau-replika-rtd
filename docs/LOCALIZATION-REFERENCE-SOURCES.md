# Localization reference sources

These sources are lexical and usage references for human review. DeepL output is a draft translation, not an official translation or a substitute for editorial review.

## Korean — ko-KR
- National Institute of Korean Language, Standard Korean Language Dictionary: https://stdict.korean.go.kr/
- National Institute of Korean Language, Basic Korean Dictionary: https://krdict.korean.go.kr/

Use the Standard Korean Language Dictionary for standard forms and the Basic Korean Dictionary for learner-facing definitions and usage examples.

## Japanese — ja-JP
- Shogakukan, Daijisen: https://www.monokakido.jp/en/dictionaries/daijisen2/index.html
- National Institute for Japanese Language and Linguistics (NINJAL), language resources: https://www.ninjal.ac.jp/english/resources/search/

Use Daijisen for lexical meanings and NINJAL corpora/resources to check contemporary usage. Daijisen is a commercial dictionary; access and reuse are subject to its terms.

## Malay — ms-MY and ms-SG
- Dewan Bahasa dan Pustaka, Pusat Rujukan Persuratan Melayu (PRPM): https://prpm.dbp.gov.my/
- Majlis Bahasa Melayu Singapura: https://www.languagecouncils.sg/mbms/en
- MBMS, Bijak Bahasa: https://www.languagecouncils.sg/mbms/en/sumber/bijak-bahasa

Use DBP/PRPM as the primary Malay lexical and spelling reference. Use MBMS resources to review Singapore usage and morphology; do not assume every Malaysian term is preferred in Singapore. No distinct Singapore-only equivalent has yet been verified for the current generic website UI labels, so the ms-SG override file remains intentionally empty.

## Chinese — zh-CN and zh-SG
- Singaporean Mandarin Database, Speak Mandarin Campaign: https://www.languagecouncils.sg/mandarin/en/learning-resources/singaporean-mandarin-database/

Use Simplified Chinese as the script baseline for both locales. Review Singapore-specific vocabulary against the Singaporean Mandarin Database rather than assuming Mainland usage is always locally preferred. Its Education category includes local institutional terms such as 工艺教育学院 (Institute of Technical Education) and 理工学院 (polytechnic). These are Singapore institution names, not generic translations for an Indonesian vocational school or its Program Keahlian; do not substitute them into this site. No Singapore-specific variant has been verified for the generic UI strings in this project, so the zh-SG override file remains intentionally empty.

## Tamil — ta-SG
- Tamil Language Council, Singapore: https://www.languagecouncils.sg/tamil/ta
- TLC, Educational Terms vocabulary: https://www.languagecouncils.sg/tamil/en/language-resources/vocabulary/educational-terms
- TLC, Technical vocabulary (T): https://www.languagecouncils.sg/tamil/ta/language-resources/vocabulary/alphabetical-list/t
- TLC / National Translation Committee, English–Tamil Glossary Book: https://www.languagecouncils.sg/tamil/ta/-/media/tlc/files/english-to-tamil-glossary-book.pdf

Use Singapore Tamil Language Council resources and its English–Tamil educational terminology references when reviewing school, public-service, and education terms. Treat DeepL's technical-term output as provisional and check the glossary and educational vocabulary before adding overrides.

## Editorial rules
1. Preserve school names, personal names, official programme names, acronyms, URLs, and technical identifiers unless an approved localized form exists.
2. Check meaning and context before changing a DeepL draft.
3. Keep regional variants explicit: en-US, en-GB, en-AU, en-CA, en-SG, ms-MY, ms-SG, zh-CN, zh-SG.
4. A locale file passing structural checks does not mean its wording has been professionally or officially certified.
5. Regional override files may remain empty until a locally supported term is approved; do not invent regional vocabulary to make the files look different.
