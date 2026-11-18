# Deployment & Audit Record — 19 November 2026

**Repository:** `TKJ-Team-SMKN1/smkn1mandau-replika-rtd`  
**Branch:** `main`  
**Project:** `smkn1mandau-replika-rtd`  
**Project ID:** `prj_NZb1pWD1q2URox2UtqBC3BBHpPDO`  
**Team ID:** `team_BLHyfFLCvab9U6fjRg4lvdLO`  
**Status:** Production unpaused; deployment READY.  
**Identity notice:** This remains an independent replica/concept and is not the official SMK Negeri 1 Mandau website or an endorsed school service.

## Deployment performed

- The Vercel project was unpaused on 19 November 2026.
- A Production deployment was created from GitHub `main`, commit `d288d16ab45b60fc9a3e465d9d57b815d536371a`.
- Deployment ID: `dpl_HRi7VhB8HD2vo4LdpiC1Rdtzdvhk`.
- Deployment state: `READY`; target: `production`; framework: Astro; Node.js: 24.x.
- Primary project alias assigned: https://smkn1mandau-replika-rtd.vercel.app
- Deployment-specific URL: https://smkn1mandau-replika-pwrcnixw0-hypergarudas-projects.vercel.app
- Build log confirms 11 static HTML pages generated and the sitemap generator reported 10 indexable routes.
- Build log confirms `npm install` completed for 299 packages and reported 0 vulnerabilities in that install-time audit output.
- Vercel runtime error summary for the previous 24 hours reported no runtime errors.
- Build warning: npm reports the unknown environment config `cache-dir`; this did not stop the build.
- The project has SSO protection enabled for non-custom deployment domains. Do not disable or bypass it as part of routine verification.

## Verified as complete

1. Project unpause succeeded and was confirmed through the Vercel project state.
2. Production deployment from the specified `main` commit completed with `READY`.
3. Production alias `smkn1mandau-replika-rtd.vercel.app` is attached to the deployment.
4. Astro production build completed; 11 HTML pages were generated.
5. Sitemap generation completed and reported 10 indexable routes.
6. Vercel runtime error summary for the last 24 hours reported no runtime errors.
7. README deployment status was updated to point to this report.
8. Existing source-level accessibility and localization improvements remain documented in their respective records.

## Automated audit suite present in the repository

The GitHub Actions workflow `.github/workflows/build.yml` defines the following checks on pushes to `main` and pull requests:

- `npm ci`
- `npm run check` — Astro and TypeScript diagnostics
- `node --check` for `public/scripts/i18n.js`, `public/scripts/deteksi-fitur.js`, and the Batik Houdini worklet
- `npm run audit:performance`
- `npm run audit:localization`
- `npm run build`
- `npm run audit:seo`
- `npm run audit:html`
- `npm run audit:archive`
- `npm run audit:provenance`
- `npm run audit:a11y`
- `npm run audit:security`

**Execution status for this record:** the Vercel build is verified, but the complete GitHub Actions audit suite is **not marked passed**. The connected GitHub interface available during this operation did not expose a push-workflow dispatch or workflow-run/check-run detail endpoint. The combined commit-status response contained no legacy status records; that is not proof that every workflow job passed. Do not treat the existence of the workflow or the successful Vercel build as evidence that every audit script ran.

## Source-level review findings

- `audit-static-html.mjs` checks generated HTML language/title/viewport/main landmark, duplicate IDs, image alt attributes, accessible button names, `target=_blank` rel safety, heading warnings, local references, font paths, and translation dictionary structure.
- `audit-wcag-preflight.mjs` checks static markup, labels, navigation names, skip link, focus/reduced-motion tokens, a set of six theme fallback palettes, and preferred 44 CSS px target baselines. It explicitly cannot establish rendered behavior or WCAG conformance.
- `audit-performance.mjs` checks font preload count/size, font-display, static output mode, i18n script size, and shared client-load island count.
- `audit-localization.mjs` checks locale picker structure, required dynamic count phrases, dictionary presence, and document language synchronization. It does not assess every translated string.
- `audit-seo.mjs` checks generated sitemap, canonical URLs, unique titles, descriptions, Open Graph/Twitter metadata, robots, and sitemap discovery.
- `audit-source-archive.mjs` checks the 100-file archive manifest, source host, archive presence, index consistency, and absence of `public/.env`.
- `audit-content-provenance.mjs` checks source references, dataset metadata/counts, selected source text evidence, image references, and page/data bindings.
- `audit-dependencies.mjs` permits the documented known advisory chain while failing on unreviewed High/Critical findings. The known advisory is not considered fixed.

## Known open items — do not mark complete

### Accessibility / WCAG 2.2 AA
- WCAG 2.2 AA is **not verified or certified**.
- Keyboard-only checks, visible focus, focus order, and Escape behavior need browser verification.
- Reflow at 320 CSS px, text resize to 200%, and text-spacing overrides remain unverified.
- Contrast must be checked for all text, icons, borders, controls, hover/focus/active/disabled/error states across all themes and Dynamic Color OS modes.
- TalkBack on Android Chrome and NVDA on desktop remain untested.
- Reduced-motion and forced-colors behavior still needs actual browser/assistive-technology review.
- Future or conditional media, forms, and interactive states need review.

### Security / dependencies
- The transitive Picomatch advisory `GHSA-fc5q-39xc-vjpf` / `CVE-2026-112366` remains documented as unresolved in `docs/FASE-6-SEO-SECURITY.md`. No patched upstream version was verified; do not invent an override.
- The configured CSP is `Content-Security-Policy-Report-Only`, not an enforced CSP. Inventory inline scripts/styles and external origins before enforcement.
- Security response headers were reviewed in `vercel.json`, but this operation did not verify the actual HTTP response headers from the public site.
- No full external penetration test or browser security test was performed.

### SEO / live behavior
- Sitemap generation was confirmed in the build log, but public crawling/indexing and canonical responses were not externally verified in this operation.
- A direct public-page fetch attempt returned a cache-miss error; no HTTP status or header claim is made from that attempt.
- No live Lighthouse, Core Web Vitals, or mobile performance score was collected.
- Multilingual text switching does not create separate locale URLs or `hreflang` alternates.

### Content / source data
- Staff dataset remains a dated snapshot of 127 entries; a separate extraction previously returned 123. The four-entry discrepancy remains unresolved.
- Current facilities inventory is intentionally unverified.
- Extracurricular activity names, supervisors, and schedules remain unverified because the archived source is image-led.
- Historical event date conflicts remain flagged in the data; they should not be silently normalized.
- Translation checks cover specific dynamic count fragments, not the full EN/MS/ZH catalogue. Fluent-speaker review remains open.
- The site must continue to distinguish source facts, editorial summaries, and replica-only navigation/features.

## Recommended next work

1. Obtain and inspect the GitHub Actions run for the latest `main` commit; record each job's actual conclusion before marking the automated suite complete.
2. Resolve any failing audit jobs once, with focused fixes rather than repeated test loops.
3. Perform the outstanding keyboard, zoom, text-spacing, contrast, screen-reader, reduced-motion, and forced-colors verification.
4. Revisit the Picomatch advisory when an upstream patched release is verifiably available.
5. Reconcile the 127-versus-123 staff count from the primary source and document the extraction method.
6. Verify public HTTP response headers, canonical URLs, sitemap, and robots responses without disabling SSO or weakening deployment protection.
7. Arrange human language review for the full translated interface.

## Audit boundary

This record separates confirmed deployment/build facts, source-level inspection, automated checks that are configured but not confirmed executed, and manual checks still outstanding. A green Vercel deployment is not a substitute for GitHub CI, WCAG conformance testing, content validation, or a security assessment.
