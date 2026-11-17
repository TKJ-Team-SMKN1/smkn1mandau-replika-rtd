# Phase 2 — Quality and accessibility review

## Scope and limits

This phase adds repeatable static checks for the generated Astro site. These checks are a preflight, **not a WCAG 2.2 AA conformance claim**. A complete accessibility review still requires keyboard-only testing, browser zoom/reflow checks, contrast measurements for rendered states, and screen-reader testing.

## Automated checks

Run after a production build:

```sh
npm run build
npm run audit:static
```

The static audit checks:
- document language, title and a single main landmark;
- duplicate IDs and image alternative-text attributes;
- accessible names for buttons and likely missing form labels;
- heading hierarchy warnings;
- local links/assets that do not resolve in the generated output;
- all local font URLs referenced by `src/styles/font-library.css`;
- translation dictionary key coverage across English, Malay and Chinese.

Warnings require human review. Text extraction cannot reliably determine contrast, accessible name computation, visual focus visibility, or whether a translation is contextually correct.

## Font delivery decision

The original OTF files and their license notices remain authoritative source assets. No OTF files are deleted or overwritten. WOFF2 conversion is deferred until generated files can be validated for glyph coverage, font metadata, license obligations, browser rendering and measurable transfer-size improvement. The current build still verifies that every referenced OTF face exists.

Do not preload every face. Keep preloads limited to fonts used immediately above the fold; additional font preloads can compete with critical page resources.

## CSS architecture decision

The existing global stylesheet includes legacy utility overrides and theme compatibility rules. The five theme modes depend on those mappings. Consolidation is therefore staged: identify selectors and theme dependencies first, then remove duplicates only with visual regression evidence. No blind minification or wholesale rewrite is performed in this phase.

## Manual WCAG 2.2 AA checklist

| Area | Review target | Status |
|---|---|---|
| Keyboard | All navigation, controls and dialogs usable without a pointer | Manual test required |
| Focus | Visible focus indicator; focus not obscured by sticky navigation | Manual test required |
| Contrast | 4.5:1 normal text; 3:1 large text and essential UI graphics | Rendered-state measurement required |
| Reflow | 320 CSS px viewport and 200% text zoom without loss of content/function | Manual test required |
| Targets | At least 24×24 CSS px unless WCAG exceptions apply; aim for 44×44 | CSS inspection + device test |
| Forms | Persistent labels, instructions and programmatic error association | Manual review |
| Motion | Reduced-motion preference respected | Source check; runtime confirmation required |
| Images | Meaningful alt text; decorative images use empty alt | Static preflight |
| Semantics | Landmarks, heading order, language and accessible names | Static preflight + screen reader |

## Content integrity

- Keep the project clearly labelled as an independent replica/concept.
- Treat archived announcements as historical records, never as current operational instructions.
- Do not invent staff status, enrollment details, school statistics, or program facts.
- Keep source links and the source register available to visitors.
