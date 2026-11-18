# Phase 7 — Source-to-Page Content Integrity

**Started:** 18 November 2026  
**Repository:** `TKJ-Team-SMKN1/smkn1mandau-replika-rtd`  
**Status:** automated provenance preflight added; semantic source review remains in progress.

## Scope of this pass

This pass establishes a repeatable check between structured content, the archived source register, and the application files that consume the data.

- Every structured `sourceUrl` / `sourceFile` pair (including named pairs such as `missionSourceUrl` / `missionSourceFile`) must resolve to the same record in `src/data/archive-index.json`.
- The archive index must retain 100 unique HTML source records.
- The staff, program, and event dataset counts must agree with their declared totals.
- Current facilities and extracurricular activities must remain explicitly unverified while the archived material does not support a current factual claim.
- The expected Astro pages and React components must import their corresponding structured datasets.

## Changes made

- Added archive filename provenance to the staff and program homepage snapshots.
- Added the missing source filename for the initial facilities snapshot.
- Added the source filename for the mission statement.
- Refactored the profile page to render its timeline, vision, mission source, address, phone, email, and homepage links from structured source data rather than duplicated literals.
- Connected the extracurricular page to `extracurriculars.json`, including its explicit verification note and image-asset count.
- Added `npm run audit:provenance` and wired it into GitHub Actions.

## Current integrity boundaries

The automated audit verifies that declared provenance references point to the correct archived HTML records and that the expected application modules consume the data. It does **not** prove that every sentence in the UI is a faithful semantic transcription of the original HTML, nor does it verify that a historical fact remains true today.

An initial source-text check now compares all ten program names, the three historical milestones, the school identity location tokens, the vision, and all six mission statements against their archived HTML. The identity page labels Simpang Padang as a kelurahan, while the homepage footer labels it a desa; the profile therefore uses the neutral place name until that administrative-label difference is confirmed. This check verifies the archived text, not present-day administrative status.\n\nThe next manual review should compare the remaining text-rich primary records against the rendered page content, prioritizing:

1. School identity, history, vision, and mission.
2. The ten program names on the archived homepage.
3. Historical events and their dates, especially entries already marked with date conflicts.
4. BKK and LSP-P1 summaries, keeping historical documents separate from current status.
5. Facilities and extracurricular pages, which must not turn image filenames into current inventory or activity claims.

Staff records remain a dated 127-entry snapshot with an unresolved difference from the later 123-entry aggregate extraction. Do not promote that dataset to a current personnel directory.

## Verification

GitHub Actions runs the new audit after the archive audit. A passing run confirms the automated checks above only. Manual visual, accessibility, and live SEO checks remain separate; Vercel deployment is intentionally not part of this phase.
