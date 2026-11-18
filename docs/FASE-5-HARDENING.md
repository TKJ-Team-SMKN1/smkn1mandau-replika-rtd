# Phase 5 — Performance, SEO, Security, and Localization Hardening

**Date:** 18 November 2026  
**Repository:** TKJ-Team-SMKN1/smkn1mandau-replika-rtd  
**Audited baseline:** 99193a6a37c95b18436df8c840ceb2181ddf6b7b  
**Status:** Independent replica/concept; not an official school website. Vercel remains paused.

## Executive summary

Phase 5 applies low-risk, repository-level hardening and adds static CI preflights. It does not activate the paused deployment, publish a sitemap, claim live performance scores, or certify WCAG conformance.

## Findings and decisions

### Performance

- Astro uses static output. Most page content is HTML/CSS; the shared layout has one React client island for the dismissible replica notice.
- The local font library contains 19 families and 174 OTF faces (about 53.6 MB of repository assets). These files are not all downloaded by every visitor; browser font requests are driven by rendered font usage.
- The shared layout preloads three above-the-fold font files: Outfit Regular (28,608 bytes), Archivo Bold (65,280 bytes), and Anton Regular (133,548 bytes). Total preload budget is 227,436 bytes, below the new 256 KiB ceiling. The conditional Anton preload is limited to pages that use the display face.
- Font faces use font-display: swap. The project retains the original OTF files and their licenses; no unverified font conversion was attempted.
- The i18n browser script is approximately 117 KB and is loaded on each page. It is below the current 128 KiB warning threshold, but locale chunking is a future optimization if the dictionaries grow.
- A live Lighthouse/Core Web Vitals score is unavailable: the current Vercel alias returned HTTP 503 while the project is intentionally paused. No score is inferred from that response.

### SEO and discoverability

- Page-specific title and description props already exist in the shared layout.
- The Astro site setting previously pointed to smkn1mandau-replika.vercel.app, while the current project alias is smkn1mandau-replika-rtd.vercel.app. The setting is corrected to the current alias.
- Open Graph and Twitter summary metadata now use each page's existing title and description. No social image is declared because a verified, purpose-made preview asset has not been selected.
- Canonical URLs and sitemap generation are deliberately deferred until the deployment URL is confirmed active and the publication decision is made. The current 503 alias must not be treated as a healthy indexing target.
- The current runtime language switcher changes text and the document lang attribute in the browser. It does not create separate locale routes or hreflang alternates, so multilingual search indexing is not claimed.

### Security

- Vercel response headers are configured for X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and a restrictive Permissions-Policy.
- These response headers take effect only on a future Vercel deployment. They have not been externally verified while the project is paused.
- A strict CSP is not enabled in this phase. Astro's CSP support has constraints around external resources and inline style/script behavior; the project must first inventory and test every generated page and browser interaction. Do not add unsafe-inline as a shortcut.
- The existing dependency audit continues to report the previously documented transitive Picomatch advisory GHSA-fc5q-39xc-vjpf / CVE-2026-112366 as unresolved. No patched upstream version was verified in this audit; it is not described as fixed.

### Localization

- Supported picker values: ID (source language), EN, MS, and ZH.
- Current translation dictionary entries: EN 169, MS 192, ZH 179 (including supplemental entries).
- CI now verifies that the picker, dictionaries, stored preference key, and document language synchronization remain present.
- This is a structural catalog check, not a linguistic quality score. Native-language review, consistency of technical terms, date/number formatting, and missing-string review remain open.

## Changes in this phase

1. Corrected the Astro site URL to the current project alias.
2. Added page-specific Open Graph and Twitter summary metadata without inventing a canonical URL or preview image.
3. Added conservative Vercel response security headers.
4. Added static performance and localization audit scripts and wired them into the existing main-branch CI workflow.
5. Added this phase report with deployment and verification limitations.

## Verification and outstanding work

- The previous baseline CI run for 99193a6 was successful. Phase 5 changes require one new CI run after commit.
- Static performance and localization preflights are designed to run without deploying the site.
- Manual visual/device QA is still required at 320, 375, 768, 1024, and 1440 CSS px; 200–400% zoom; keyboard-only navigation; reduced motion; all five themes; and TalkBack/mobile screen-reader use.
- Recheck response headers and run Lighthouse only after an explicitly authorized deployment is resumed.
- Before enabling canonical tags, sitemap, robots directives, or hreflang, confirm the final public domain and decide whether the site is intended to be indexed.
- Review translations with fluent speakers before describing all four locales as complete.
- Revisit the unresolved dependency advisory when the upstream package publishes a verifiable patched release.

## Primary references

- Astro Fonts: https://docs.astro.build/en/guides/fonts/
- Astro Islands: https://docs.astro.build/en/concepts/islands/
- Astro configuration and CSP limitations: https://docs.astro.build/en/reference/configuration-reference/
- Astro sitemap requirements: https://docs.astro.build/en/guides/integrations-guide/sitemap/
- Vercel static configuration and response headers: https://vercel.com/docs/project-configuration/vercel-json
- Google canonical URL guidance: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
