# Deployment & Audit Record — 19 November 2026

**Repository:** `TKJ-Team-SMKN1/smkn1mandau-replika-rtd`  
**Branch:** `main`  
**Vercel project:** `smkn1mandau-replika-rtd`  
**Project ID:** `prj_NZb1pWD1q2URox2UtqBC3BBHpPDO`  
**Team ID:** `team_BLHyfFLCvab9U6fjRg4lvdLO`  
**Latest inspected production deployment:** `dpl_bYLYQohC2Jkuk6KSq1rsY88gDAJj`  
**Latest inspected commit:** `a3cb4444ef62298937151603bdfe29e106b7612d`  
**Identity notice:** This remains an independent replica/concept. It is not the official SMK Negeri 1 Mandau website and does not represent or claim endorsement by the school.

## Latest deployment update — 19 November 2026

- An unpause request was sent to the Vercel project. The API returned `result: null`.
- A new production deployment was explicitly created from `main` at commit `a3cb4444ef62298937151603bdfe29e106b7612d` (`docs: clarify Vercel unpause and latest deployment state`).
- Deployment ID: `dpl_bYLYQohC2Jkuk6KSq1rsY88gDAJj`.
- Deployment URL: https://smkn1mandau-replika-r273e3kn3-hypergarudas-projects.vercel.app
- Vercel reported `READY`, target `production`, Astro framework, Node.js 24.x. The deployment aliases include https://smkn1mandau-replika-rtd.vercel.app.
- Build log confirms `npm install` completed, reported 299 packages audited and `found 0 vulnerabilities` for that install-time audit output, Astro built 11 static pages, and `generate-sitemap.mjs` produced 10 indexable routes. The npm `cache-dir` environment-config warning remains non-fatal.
- The Vercel project details endpoint continued to report `live: false` after the unpause request and after the deployment reached READY. The project is therefore **not independently confirmed unpaused at the control-plane level**. Do not treat READY as proof that the project pause flag is cleared.
- SSO protection remains enabled for non-custom deployment domains. An authenticated deployment fetch attempt was redirected to `/sso-api` and failed with `deployment_authentication_required`; a public web fetch of the project alias was not available to this audit. No SSO bypass was attempted.
- The latest deployment was not independently crawled route-by-route in this pass. The earlier public crawl recorded below belongs to the previously inspected deployment and must not be attributed to commit `a3cb444`.

## Earlier deployment and public smoke audit — 19 November 2026

- Previous production deployment `dpl_A2aZZXDSSk8dnnvjjV1zVeUiBmAg` was inspected at commit `42dc203f12511b06e9096b770995f84cfdf9e8c2`; it reached `READY`.
- Previous deployment URL: https://smkn1mandau-replika-qbyis7pgc-hypergarudas-projects.vercel.app
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
- All crawled routes returned HTML with page titles and Indonesian language metadata. `/pengaturan` returned `noindex, nofollow`; the other 10 routes returned `index, follow`.
- Public `/robots.txt` returned HTTP 200 and declared `Allow: /` plus the project's `/sitemap.xml`.
- Public `/sitemap.xml` returned HTTP 200 and contained exactly 10 URLs. `/sitemap-index.xml` and `/sitemap-0.xml` returned 404; these are not the configured sitemap paths.
- The independent-replica notice and source links were present in the crawled page content.
- Runtime error summary for the previous inspection window (last 1 hour) reported no runtime errors. The grouped runtime-log query for its last 30 minutes returned no groups. This is a limited observation, not a guarantee of zero errors.

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

**Execution status for commit `a3cb444`:** The available GitHub commit-status lookup returned no status records. The connected workflow-run lookup only exposes pull-request-triggered runs and returned no run for this commit. Therefore the push-triggered GitHub Actions workflow and its individual audit jobs are **not confirmed passed**. The Vercel build is verified separately; it does not execute all audit scripts above.

## Source-level audit coverage reviewed

The package scripts and audit-source files were inspected. This records what the configured checks are designed to cover; execution is **not claimed** unless stated.

- `audit:html`: generated HTML language/title/viewport/main landmark, duplicate IDs, image alt, accessible button names, `target=_blank` rel safety, heading warnings, local references, font paths, and translation dictionary structure.
- `audit:a11y`: static markup, labels, named navigation, skip link, focus/reduced-motion tokens, theme fallback palettes, contrast-token preflight, and preferred 44 CSS px target baselines. It cannot establish rendered behavior or WCAG conformance.
- `audit:performance`: font preload count/size, `font-display`, static output mode, i18n script size, and shared client-load island count.
- `audit:localization`: locale picker structure, required dynamic count phrases, dictionary presence, and document-language synchronization. It does not assess every translated string.
- `audit:seo`: generated sitemap, canonical URLs, unique titles, descriptions, Open Graph/Twitter metadata, robots, and sitemap discovery.
- `audit:archive`: 100-file archive manifest, source host, archive presence, index consistency, and absence of `public/.env`.
- `audit:provenance`: source references, dataset metadata/counts, selected source-text evidence, image references, and page/data bindings.
- `audit:security`: npm audit findings, with a documented exception path for the known Picomatch advisory chain.

## Latest runtime observations

- Vercel runtime error summary for the last 1 hour reported no runtime errors.
- Grouped production runtime logs for the last 30 minutes returned no groups.
- These observations do not prove that the application has no errors outside the selected time range, on unvisited routes, or under untested interactions.

## Completed

1. Sent the Vercel unpause request.
2. Created a new production deployment from the exact latest `main` commit `a3cb444`.
3. Verified that deployment `dpl_bYLYQohC2Jkuk6KSq1rsY88gDAJj` reached `READY`.
4. Verified the Vercel build generated 11 static pages and a 10-URL sitemap.
5. Reviewed the repository's GitHub Actions workflow and the source of all configured audit scripts.
6. Queried Vercel runtime errors and recent grouped production logs.
7. Recorded the outstanding verification boundaries below.

## Open items — do not mark complete

### Vercel control-plane and access
- `get_project` still returned `live: false` after the unpause request. Verify the pause/live state directly in the Vercel dashboard.
- SSO protection prevented the authenticated deployment fetch. Do not disable or bypass SSO as part of this audit.
- Re-run the public 11-route crawl against commit `a3cb444` when a permitted public path is available.

### GitHub Actions and audit execution
- Retrieve the push-triggered workflow run for commit `a3cb444` and record each job's actual conclusion.
- Run/fix configured audit scripts only where CI reports failures; their execution is not established by the Vercel production build.
- Empty legacy commit-status results are not evidence that all workflow jobs passed.

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
- The latest `npm install` output saying `found 0 vulnerabilities` is install-time output; it is not the dedicated `npm run audit:security` result.
- CSP remains `Content-Security-Policy-Report-Only`, not an enforced CSP.
- HTTP response security headers were not independently inspected for the latest commit.
- No full external penetration test or browser security test was performed.

### Performance and SEO
- No live Lighthouse, Core Web Vitals, or mobile performance score was collected.
- The previous public route crawl and previous `robots.txt`/`sitemap.xml` checks were verified on an earlier deployment; they have not been repeated for commit `a3cb444`.
- External search-engine indexing is not established.
- No locale-specific URLs or `hreflang` alternates are generated.

### Content and localization
- Staff dataset remains a dated snapshot of 127 entries; a separate extraction previously returned 123. The four-entry discrepancy remains unresolved.
- Current facilities inventory is intentionally unverified.
- Extracurricular activity names, supervisors, and schedules remain unverified because the archived source is image-led.
- Historical event date conflicts remain flagged in the data and must not be silently normalized.
- Translation checks cover specific dynamic count fragments, not the full EN/MS/ZH catalogue. Fluent-speaker review remains open.
- The site must continue to distinguish source facts, editorial summaries, and replica-only navigation/features.

## Audit boundary

This record separates confirmed deployment/build/runtime observations, earlier public-response facts, source-level inspection, configured but unconfirmed automation, and manual checks still outstanding. A READY Vercel deployment is not a substitute for GitHub CI, WCAG conformance testing, current content validation, or a security assessment.
