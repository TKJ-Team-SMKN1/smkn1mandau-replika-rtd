# Deployment & Audit Record — 19 November 2026

**Repository:** `TKJ-Team-SMKN1/smkn1mandau-replika-rtd`  
**Branch:** `main`  
**Vercel project:** `smkn1mandau-replika-rtd`  
**Project ID:** `prj_NZb1pWD1q2URox2UtqBC3BBHpPDO`  
**Team ID:** `team_BLHyfFLCvab9U6fjRg4lvdLO`  
**Latest inspected production deployment:** `dpl_A2aZZXDSSk8dnnvjjV1zVeUiBmAg`  
**Latest inspected commit:** `42dc203f12511b06e9096b770995f84cfdf9e8c2`  
**Identity notice:** This remains an independent replica/concept. It is not the official SMK Negeri 1 Mandau website and does not represent or claim endorsement by the school.

## Deployment performed

- The Vercel `unpause_project` action was requested on 19 November 2026. The API returned no response body (`result: null`).
- Production deployment `dpl_6uaMiZYhRGPTqj9yCsfhAw2hFWXW` was explicitly created from `main` at commit `d288d16ab45b60fc9a3e465d9d57b815d536371a`; it reached `READY`.
- A further production deployment `dpl_HRi7VhB8HD2vo4LdpiC1Rdtzdvhk` for the same commit also reached `READY` and assigned the primary alias.
- The latest inspected deployment is `dpl_A2aZZXDSSk8dnnvjjV1zVeUiBmAg`, created from `main` at commit `42dc203f12511b06e9096b770995f84cfdf9e8c2`; it reached `READY`, target `production`, framework Astro, Node.js 24.x.
- Latest deployment URL: https://smkn1mandau-replika-qbyis7pgc-hypergarudas-projects.vercel.app
- Primary project alias: https://smkn1mandau-replika-rtd.vercel.app
- Vercel reports SSO protection enabled for non-custom deployment domains. This protection was not disabled.
- **Control-plane discrepancy:** after the unpause action, `get_project` continued to report `live: false`. This did not match the READY production deployments, assigned primary alias, and public HTTP 200 responses. The public deployment is reachable, but the Vercel project `live` flag was not independently confirmed as unpaused. Verify this field in the Vercel dashboard; do not claim the flag is confirmed from this record alone.

## Verified deployment and public smoke audit

- Latest inspected Vercel build completed successfully. Build output lists **11 static pages** and reports **10 indexable routes** in the generated sitemap.
- Build log: `npm install` audited 299 packages and printed `found 0 vulnerabilities`. This is the install-time output only; it does not replace the repository's dedicated `audit:security` script or resolve the separately documented Picomatch advisory.
- Build warning: npm reported unknown environment config `cache-dir`; it did not fail the build.
- A public crawl completed for **11/11 application routes**, each returning HTTP **200**:
  - `/`
  - `/profil`
  - `/program`
  - `/sdm`
  - `/fasilitas`
  - `/kegiatan`
  - `/ekstrakurikuler`
  - `/pengumuman`
  - `/pengaturan`
  - `/unit-sekolah`
  - `/tentang`
- All crawled routes returned HTML with page titles and Indonesian language metadata. The `/pengaturan` page correctly returned `noindex, nofollow`; the other 10 routes returned `index, follow`.
- Public `/robots.txt` returned HTTP 200 and declares `Allow: /` plus `https://smkn1mandau-replika-rtd.vercel.app/sitemap.xml`.
- Public `/sitemap.xml` returned HTTP 200 and contains exactly 10 URLs. `/sitemap-index.xml` and `/sitemap-0.xml` returned 404; these are not the configured sitemap path and should not be used.
- The independent-replica notice and source links were present in the crawled page content.
- Vercel runtime error summary for the queried last **1 hour** reported no runtime errors. The grouped runtime-log query for the last 30 minutes returned no log groups. This is a limited time-window observation, not a guarantee of zero errors.
- A longer runtime-log request was rejected because the current plan's runtime-log retention window does not support the requested range.

## GitHub automation status

The repository contains `.github/workflows/build.yml`, configured for pushes to `main`, pull requests to `main`, and manual dispatch. It defines:
- `npm ci`
- `npm run check`
- `node --check` for the browser i18n script, feature-detection script, and Batik Houdini worklet
- `npm run audit:performance`
- `npm run audit:localization`
- `npm run build`
- `npm run audit:seo`
- `npm run audit:html`
- `npm run audit:archive`
- `npm run audit:provenance`
- `npm run audit:a11y`
- `npm run audit:security`

**Execution status:** GitHub's combined legacy commit-status response contained no status records. The available workflow-run lookup only returned pull-request-triggered runs and returned none for this commit. Therefore, the complete push-triggered GitHub Actions workflow and every audit job are **not confirmed passed**. The Vercel production build and public HTTP crawl are verified separately; do not conflate them with GitHub Actions results.

## Source-level audit coverage reviewed

The package scripts and audit-source files were inspected. The following are the intended checks; their execution is **not claimed** unless stated above.

- `audit:html`: generated HTML language/title/viewport/main landmark, duplicate IDs, image alt, accessible button names, `target=_blank` rel safety, heading warnings, local references, font paths, and translation dictionary structure.
- `audit:a11y`: static markup, labels, named navigation, skip link, focus/reduced-motion tokens, six theme fallback palettes, and preferred 44 CSS px target baselines. It cannot establish rendered behavior or WCAG conformance.
- `audit:performance`: font preload count/size, `font-display`, static output mode, i18n script size, and shared client-load island count.
- `audit:localization`: locale picker structure, required dynamic count phrases, dictionary presence, and document-language synchronization. It does not assess every translated string.
- `audit:seo`: generated sitemap, canonical URLs, unique titles, descriptions, Open Graph/Twitter metadata, robots, and sitemap discovery.
- `audit:archive`: 100-file archive manifest, source host, archive presence, index consistency, and absence of `public/.env`.
- `audit:provenance`: source references, dataset metadata/counts, selected source-text evidence, image references, and page/data bindings.
- `audit:security`: npm audit findings, with a documented exception for the known Picomatch advisory chain.

## Completed

1. Requested Vercel unpause action.
2. Created and inspected production deployments; latest inspected deployment is `READY` on commit `42dc203`.
3. Confirmed primary project alias is attached to a READY production deployment and returns public HTTP 200.
4. Confirmed all 11 application routes return HTTP 200 in the public crawl.
5. Confirmed `robots.txt` and the configured `sitemap.xml` return HTTP 200; sitemap contains 10 indexable URLs.
6. Confirmed build output contains 11 static pages and the sitemap generator reports 10 indexable routes.
7. Queried Vercel runtime errors for the last hour; none were reported.
8. Inspected the source of the repository's automated audit scripts and GitHub Actions workflow.
9. Recorded outstanding work in this document and the related accessibility/security records.

## Open items — do not mark complete

### Vercel control-plane status
- `get_project` still returned `live: false` after the unpause action, while production deployments were READY and the primary alias was publicly reachable. Confirm the exact pause/live state in the Vercel dashboard.

### GitHub Actions and audit execution
- Retrieve the push-triggered workflow run for the latest `main` commit and record each job's actual conclusion.
- Run/fix the configured audit scripts only where CI reports failures; they have not been independently executed in this pass.
- The empty legacy status response is not evidence that all workflow jobs passed.

### Accessibility / WCAG 2.2 AA
- WCAG 2.2 AA is **not verified or certified**.
- Keyboard-only operation, visible focus, focus order, Escape behavior, and focus at 200% zoom require manual browser checks.
- Reflow at 320 CSS px, text resize to 200%, and text-spacing overrides remain unverified.
- Contrast must be checked for all text, icons, borders, controls, hover/focus/active/disabled/error states across all themes and Dynamic Color OS modes.
- TalkBack on Android Chrome and NVDA on desktop remain untested.
- Reduced-motion and forced-colors behavior still needs actual browser/assistive-technology review.
- Future or conditional media, forms, and interactive states need review.

### Security
- The transitive Picomatch advisory `GHSA-fc5q-39xc-vjpf` / `CVE-2026-112366` remains documented as unresolved in `docs/FASE-6-SEO-SECURITY.md`. Do not invent an override or claim it is fixed.
- CSP remains `Content-Security-Policy-Report-Only`, not an enforced CSP.
- HTTP response security headers were not inspected in this pass.
- No full external penetration test or browser security test was performed.

### Performance and SEO
- No live Lighthouse, Core Web Vitals, or mobile performance score was collected.
- The public route crawl, `robots.txt`, and `sitemap.xml` were verified, but external search-engine indexing is not established.
- No locale-specific URLs or `hreflang` alternates are generated.

### Content and localization
- Staff dataset remains a dated snapshot of 127 entries; a separate extraction previously returned 123. The four-entry discrepancy remains unresolved.
- Current facilities inventory is intentionally unverified.
- Extracurricular activity names, supervisors, and schedules remain unverified because the archived source is image-led.
- Historical event date conflicts remain flagged in the data and must not be silently normalized.
- Translation checks cover specific dynamic count fragments, not the full EN/MS/ZH catalogue. Fluent-speaker review remains open.
- The site must continue to distinguish source facts, editorial summaries, and replica-only navigation/features.

## Audit boundary

This record separates confirmed deployment/build/public-response facts, source-level inspection, configured but unconfirmed automation, and manual checks still outstanding. A READY Vercel deployment is not a substitute for GitHub CI, WCAG conformance testing, content validation, or a security assessment.
