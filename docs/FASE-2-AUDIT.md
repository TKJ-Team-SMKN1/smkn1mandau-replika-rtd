# Phase 2 — Quality and accessibility review

## Scope and limits

Phase 2 adds a repeatable static preflight for generated Astro output and records decisions about font delivery and CSS cleanup. These checks are **not a WCAG 2.2 AA conformance claim**. A complete review still requires keyboard-only testing, browser zoom/reflow checks, contrast measurements for rendered states, and screen-reader testing.

## Automated checks

Run after a production build:

```sh
npm run build
npm run audit:html
```

The audit checks:
- document language, title, viewport metadata, and exactly one main landmark;
- duplicate IDs and image alternative-text attributes;
- accessible names for buttons;
- safe `rel="noopener"` on links opening new tabs;
- heading hierarchy warnings;
- local references that do not resolve in generated output;
- every font URL referenced by `src/styles/font-library.css`;
- active localization keys used by the current source for English, Malay, and Simplified Chinese.

Warnings require human review. Static HTML inspection cannot reliably determine contrast, computed accessible names, focus visibility, layout reflow, or whether translations are contextually correct. The latest successful CI audit checked 7 generated pages and 174 font references; dictionaries contain 169 English, 153 Malay, and 151 Chinese keys, with no missing active source keys.

## Font delivery decision

The original OTF files and license notices remain authoritative source assets. No OTF files are deleted or overwritten. WOFF2 conversion is deferred until generated files can be validated for glyph coverage, metadata, license obligations, browser rendering, and measurable transfer-size improvement. The current audit verifies that every referenced OTF face exists.

Do not preload every face. Keep preloads limited to fonts used immediately above the fold; extra preloads can compete with critical page resources.

## CSS architecture decision

The current global stylesheet contains legacy utility overrides and theme compatibility mappings. Five theme modes depend on these mappings. Consolidation is staged: identify selector and theme dependencies first, then remove duplicate rules only with visual regression evidence. No blind minification or wholesale rewrite is performed in this phase.

## Manual WCAG 2.2 AA checklist

| Area | Review target | Status |
|---|---|---|
| Keyboard | All navigation and controls usable without a pointer | Manual test required |
| Focus | Visible focus indicator; focus not obscured by sticky navigation | Manual test required |
| Contrast | 4.5:1 normal text; 3:1 large text and essential UI graphics | Rendered-state measurement required |
| Reflow | 320 CSS px viewport and 200% text zoom without loss of content/function | Manual test required |
| Targets | At least 24×24 CSS px unless an exception applies; aim for 44×44 | Compact controls updated to 44 px; physical-device review still required |
| Forms | Persistent labels, instructions, and programmatic error association | Manual review |
| Motion | Reduced-motion preference respected | Source check; runtime confirmation required |
| Images | Meaningful alt text; decorative images use empty alt | Static preflight |
| Semantics | Landmarks, heading order, language, and accessible names | Static preflight + screen reader |

## Content integrity

- Keep the project clearly labelled as an independent replica/concept.
- Treat archived announcements as historical records, never current operational instructions.
- Do not invent staff status, enrollment details, school statistics, or program facts.
- Keep source links and the source register available to visitors.

## Dependency advisory note

The dependency audit reports the GitHub-reviewed advisory [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) for `picomatch` versions through 4.0.7. At the time of this review, the advisory lists **no patched version**. The suggested `npm audit fix --force` path would downgrade Astro to 5.3.0, which is a breaking and unacceptable framework rollback for this project.

The site is built as static HTML; its deployed output does not ship the Node build dependency tree or expose a server-side glob-pattern input. The advisory is therefore recorded as a build-tool dependency risk, not marked as fixed or dismissed. Do not use `npm audit fix --force`. Reassess when the upstream advisory or package publishes a compatible remediation.

## UI adjustments in this phase

- Language selector minimum height: 44 px.
- SDM category filter controls: 44 px minimum height.
- Program-search clear button and replica-notice close button: 44 × 44 px targets.
- Program directory card headings follow a sequential heading level.
- Reduced-motion handling and visible focus styles remain in the global design system.

These are source-level changes. A screenshot-based visual regression, real keyboard pass, 200% zoom/reflow check, and screen-reader review remain outstanding because the Vercel deployment is paused.
