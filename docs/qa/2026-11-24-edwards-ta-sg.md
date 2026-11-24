# External QA Feedback — Tamil (Singapore) Retest

- **Date received:** 2026-11-24
- **Reporter:** Edwards (`edwards@team.userill.dev`)
- **Source:** Email subject “Tamil QA for Mandau”
- **Locale under test:** Tamil (Singapore), `ta-SG`
- **Target:** https://smkn1mandau.vercel.app/
- **Replay:** https://userill.dev/s/5fd16ecc9421df610919a991b81702934d207950cb166d5a
- **Testing method:** Recorded automated browser session. This is external QA evidence, not native-speaker translation certification or maintainer reproduction.

## Summary

The replay documents two actionable findings on the Tamil Singapore path:

1. The Accessibility panel's Close control becomes completely unavailable in the visible viewport after text is enlarged twice.
2. The Accessibility page displays Indonesian text while the selected locale and document language are `ta-SG`.

These findings are separate concerns: the first is a responsive/accessibility layout defect; the second is a localization coverage or locale-resolution defect.

## Finding 1 — Accessibility panel Close control is clipped

**Replay timestamp:** approximately 00:16.3

### Reproduction recorded

1. Open a fresh Chrome session; the initial locale is Indonesian (`id-ID`).
2. Switch the language to Tamil (Singapore) (`ta-SG`).
3. Open the Accessibility panel.
4. Increase text size twice.
5. Inspect the panel's Close control.

### Observed result

- The heading grows from **48 px** to **59.52 px**.
- The Close control moves partly above the viewport.
- The replay diagnostics report **0 of 54 px** of the Close control visible.
- Pressing **Escape** successfully dismisses the panel.

### Expected result

The Close control remains visible and operable at enlarged text sizes. Panel content should adapt to available space (for example, through a bounded, scrollable content region) without placing essential controls outside the reachable viewport.

### Triage

- **Area:** Accessibility / responsive layout
- **Severity suggestion:** High usability impact; keyboard Escape is a workaround, not a replacement for a visible, operable Close control.
- **Status:** Observed in external replay; not yet independently reproduced by maintainers.
- **Investigation:** Inspect panel positioning, header layout, text-scaling rules, viewport constraints, and overflow/scroll behavior. Verify keyboard and pointer/touch operation at enlarged text sizes.

## Finding 2 — Accessibility page mixes Indonesian into Tamil locale

**Replay timestamp:** approximately 00:14

### Reproduction recorded

1. Switch the site locale to `ta-SG`.
2. Open the Accessibility page.
3. Compare visible page text with the selected locale and document language.

### Observed result

- The page displays the Indonesian heading **“Akses untuk semua”**.
- The language picker reports `ta-SG`.
- The document language is also reported as `ta-SG`.
- The homepage had already displayed Tamil content after locale selection.

### Expected result

All user-facing strings on the Accessibility page should resolve to Tamil when `ta-SG` is selected, or explicitly indicate any content that is intentionally unavailable in that locale. A page should not silently fall back to Indonesian while the document declares Tamil.

### Triage

- **Area:** Internationalization / localization
- **Severity suggestion:** Medium; visible language inconsistency and misleading locale state.
- **Status:** Observed in external replay; translation correctness has not been validated by a Tamil native speaker.
- **Investigation:** Audit Accessibility page string sources, translation keys, locale fallback order, and any hard-coded Indonesian labels. Compare the page against the homepage and other routes under `ta-SG`.

## Additional checks recorded

| Check | Replay observation |
|---|---|
| Initial session | Fresh Chrome session, initial locale `id-ID` |
| Tamil selection | Picker and document language both show `ta-SG` |
| Heading font | Tamil Sangam MN |
| Reported fallback/font metadata | M PLUS 1 SemiBold |
| Mobile portrait | Viewport 390 × 844; page width reported as 390 px |
| Mobile landscape | Viewport 844 × 390; page width reported as 844 px |
| Mobile navigation | Menu opened with 12 links in both orientations |
| Console | 52 messages; replay summary reports no errors |
| Network | 175 requests; replay summary reports none failed |

These additional observations are limited to the steps and diagnostics shown in this replay. They do not establish that all pages, all locales, or all device/browser combinations pass.

## Recommended follow-up

- [ ] Track Finding 1 independently from Finding 2.
- [ ] Reproduce the Close-control clipping in a maintainer-controlled desktop Chrome session.
- [ ] Inspect and correct the Accessibility page's `ta-SG` translation coverage/fallback.
- [ ] Retest both findings at normal and enlarged text sizes.
- [ ] Verify keyboard access and visible control reachability.
- [ ] Request qualified Tamil-language review before declaring translation quality verified.
- [ ] Expand testing to the remaining locales using their respective replay evidence.

## Scope and attribution

This record preserves feedback received from an external tester. It does not certify WCAG conformance, establish native-speaker translation accuracy, or authorize automatic changes to production. The repository remains an independent, unofficial replica concept and does not represent SMK Negeri 1 Mandau.

The replay link was provided by the reporter and may expire on **2026-12-01**. Preserve this written summary as the durable record.
