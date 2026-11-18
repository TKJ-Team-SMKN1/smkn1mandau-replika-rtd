# Final Deployment & Audit — 19 November 2026

**Repository:** TKJ-Team-SMKN1/smkn1mandau-replika-rtd  
**Branch:** main  
**Report scope:** Production deployment, route smoke audit, Vercel observations, source review, configured CI/audit coverage, and remaining work.  
**Identity boundary:** This is an independent replica/concept. It is not the official SMK Negeri 1 Mandau website and does not claim school endorsement.

## 1. Production deployment

- Vercel project: `smkn1mandau-replika-rtd`
- Project ID: `prj_NZb1pWD1q2URox2UtqBC3BBHpPDO`
- Team ID: `team_BLHyfFLCvab9U6fjRg4lvdLO`
- Production deployment: `dpl_E9rnFH7QnWxyZy7NdXBSQcfk7Awb`
- Deployed commit: `fd141c0ae9ea7455722f299f7b1a52cf5cd43aec`
- Deployment URL: https://smkn1mandau-replika-h3pxmp985-hypergarudas-projects.vercel.app
- Primary project alias: https://smkn1mandau-replika-rtd.vercel.app
- Framework: Astro; Node.js 24.x
- Final deployment state: **READY**, target **production**.
- A promotion request confirmed that this deployment was already the current production deployment (Vercel returned HTTP 409 with the explicit message that the deployment was already current production).
- Vercel build output: **11 static pages**, **10 indexable sitemap URLs**.
- Install output: 299 packages audited; `found 0 vulnerabilities` in the install-time audit output. This is not a substitute for the dedicated repository security audit.
- Non-fatal build warning: npm reports an unknown `cache-dir` environment configuration.
- A redundant queued redeployment was canceled after the ready production deployment had already completed. It was not the active production deployment.

### Unpause control-plane discrepancy

- The `unpause_project` action was requested twice; both calls returned `result: null`.
- Subsequent Vercel `get_project` responses continued to report `live: false`.
- The production deployment itself is READY and Vercel confirmed it is already the current production deployment. The project-level `live` field nevertheless remains inconsistent with the requested unpause.
- Therefore, deployment and production assignment are verified, but the project-level unpaused flag is **not confirmed**. Verify this control-plane field in the Vercel dashboard. Do not treat a READY deployment as proof that the flag changed.
- SSO protection remains enabled for non-custom deployment domains. No SSO bypass or protection change was attempted.

## 2. Latest production route smoke audit

The primary project alias was fetched after deployment. All 11 application routes returned HTTP **200**:

| Route | HTTP | Title / metadata |
|---|---:|---|
| `/` | 200 | Title present; `lang=id`; `index, follow` |
| `/profil` | 200 | Title present; `lang=id`; `index, follow` |
| `/program` | 200 | Title present; `lang=id`; `index, follow` |
| `/sdm` | 200 | Title present; `lang=id`; `index, follow` |
| `/fasilitas` | 200 | Title present; `lang=id`; `index, follow` |
| `/kegiatan` | 200 | Title present; `lang=id`; `index, follow` |
| `/ekstrakurikuler` | 200 | Title present; `lang=id`; `index, follow` |
| `/pengumuman` | 200 | Title present; `lang=id`; `index, follow` |
| `/pengaturan` | 200 | Title present; `lang=id`; `noindex, nofollow` |
| `/unit-sekolah` | 200 | Title present; `lang=id`; `index, follow` |
| `/tentang` | 200 | Title present; `lang=id`; `index, follow` |

Additional checks:
- `/robots.txt`: HTTP 200.
- `/sitemap.xml`: HTTP 200; exactly 10 `<loc>` entries.
- Every application route returned an HTML response with a page title, Indonesian document language, and a canonical URL.
- The settings page correctly carries `noindex, nofollow`; the other 10 routes are indexable.
- The homepage includes the independent-replica notice and points visitors to the official school website for authoritative information.

## 3. Observed response security headers

The homepage response included:
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `Content-Security-Policy-Report-Only`

**Important:** CSP is still report-only, not enforced. Header inspection was performed on the homepage response; this is not a full security or penetration test.

## 4. Runtime observations

- Vercel runtime error summary for the last **1 hour** reported no runtime errors.
- Grouped production runtime logs for the last **30 minutes** returned no log groups.
- These are bounded observations only. They do not prove that no errors exist outside the queried time window or under untested interactions.

## 5. Source and automation review

The package scripts and `.github/workflows/build.yml` were inspected. The workflow is configured for pushes to `main`, pull requests to `main`, and manual dispatch. It contains:
- `npm ci`
- `npm run check`
- Browser script syntax checks
- `audit:performance`
- `audit:localization`
- `build`
- `audit:seo`
- `audit:html`
- `audit:archive`
- `audit:provenance`
- `audit:a11y`
- `audit:security`

The source of the configured audit scripts was reviewed. Their intended scope is:
- **HTML:** language/title/viewport/main landmark, duplicate IDs, image alt, accessible button names, external-link rel safety, heading warnings, local references, font paths, and translation dictionary structure.
- **Accessibility preflight:** static markup, labels, navigation landmarks, skip link, focus/reduced-motion tokens, theme fallback palettes, contrast-token calculations, and preferred 44 CSS px target baselines.
- **Performance:** font preload count and size, `font-display`, static output mode, i18n script size, and client-load island count.
- **Localization:** language picker, selected dynamic count phrases, dictionary presence, and document-language synchronization.
- **SEO:** sitemap, canonical URLs, unique titles, descriptions, Open Graph/Twitter metadata, robots, and sitemap discovery.
- **Archive:** 100-file source archive manifest, source host, archive presence, index consistency, and absence of `public/.env`.
- **Content provenance:** dataset metadata/counts, source references, selected archived text evidence, image references, and page/data bindings.
- **Dependency security:** npm audit findings, with a documented exception path for the known Picomatch advisory chain.

### CI execution status

- GitHub combined commit-status lookups returned no status records.
- The available workflow-run lookup only returned pull-request-triggered runs and did not provide a push-triggered run for the inspected commit.
- Therefore the individual GitHub Actions audit jobs are **not confirmed passed**. Source inspection and a successful Vercel production build do not prove those jobs ran or passed.

## 6. Completed

1. Sent Vercel unpause requests twice.
2. Deployed the latest repository commit at the time of release to production.
3. Verified the production deployment reached READY and was already the current production deployment.
4. Verified the production alias returned HTTP 200.
5. Verified 11/11 application routes returned HTTP 200.
6. Verified `robots.txt` and `sitemap.xml` returned HTTP 200; sitemap contains 10 URLs.
7. Verified page titles, `lang=id`, canonical URLs, and the intended noindex setting for `/pengaturan`.
8. Inspected homepage response security headers.
9. Queried Vercel runtime errors and recent production logs.
10. Reviewed the configured GitHub workflow and the source of the audit scripts.
11. Recorded unresolved work and evidence limits in this document.

## 7. Outstanding work

### Vercel
- Confirm the project-level unpaused/live flag in the Vercel dashboard; API continues to report `live: false` despite the READY current production deployment.
- Keep SSO protection enabled unless an authorized project owner explicitly changes it.

### GitHub Actions
- Retrieve the actual push-triggered workflow run and record every job's conclusion.
- Execute/fix audit scripts based on real CI output; the Vercel build does not run the complete audit suite.

### Accessibility
- WCAG 2.2 AA is **not verified or certified**.
- Manual keyboard-only checks, focus visibility/order, Escape behavior, and focus at 200% zoom remain open.
- Reflow at 320 CSS px, text resize to 200%, and text-spacing overrides remain open.
- Check all text, icons, borders, controls, hover/focus/active/disabled/error states across all themes and Dynamic Color OS modes.
- TalkBack with Android Chrome and NVDA with a desktop browser remain untested.
- Reduced-motion and forced-colors behavior still needs browser/assistive-technology verification.
- Review media, forms, and all interactive states.

### Security
- The transitive Picomatch advisory `GHSA-fc5q-39xc-vjpf` / `CVE-2026-112366` remains documented as unresolved in `docs/FASE-6-SEO-SECURITY.md`.
- The Vercel install log's `found 0 vulnerabilities` line is not the dedicated `npm run audit:security` result.
- CSP remains report-only.
- No external penetration test or comprehensive browser security test was performed.

### Performance and SEO
- No Lighthouse score, live Core Web Vitals, or measured mobile performance result was collected.
- HTTP response checks covered the homepage and route status/metadata, not every response header on every asset.
- External search-engine indexing is not established.
- Locale-specific URLs and `hreflang` alternates are not generated.

### Content and localization
- Staff dataset is a dated snapshot of 127 entries; a separate extraction previously returned 123. The four-entry discrepancy remains unresolved.
- Current facilities inventory is intentionally unverified.
- Extracurricular activity names, supervisors, and schedules remain unverified because the archived source is image-led.
- Historical event date conflicts remain explicitly flagged and must not be silently normalized.
- Translation checks cover selected dynamic count fragments, not the full EN/MS/ZH catalogue. Fluent-speaker review remains open.
- Continue distinguishing source facts, editorial summaries, and replica-only features.

## 8. Audit boundary

This report separates confirmed deployment/build/route-response/runtime observations, source-level review, configured but unconfirmed automation, and manual work still outstanding. A READY production deployment is not a substitute for GitHub CI, WCAG conformance testing, current content verification, or a security assessment.
