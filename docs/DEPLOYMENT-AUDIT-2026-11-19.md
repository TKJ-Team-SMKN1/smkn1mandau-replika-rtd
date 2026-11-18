# Deployment & Audit Record — 19 November 2026

**Repository:** `TKJ-Team-SMKN1/smkn1mandau-replika-rtd`  
**Branch:** `main`  
**Vercel project:** `smkn1mandau-replika-rtd`  
**Project ID:** `prj_NZb1pWD1q2URox2UtqBC3BBHpPDO`  
**Team ID:** `team_BLHyfFLCvab9U6fjRg4lvdLO`  
**Latest verified Production deployment:** `dpl_TNrjjZ6PXFzQHrP6ngeH2zCmNkGQ`  
**Deployment commit:** `fd141c0ae9ea7455722f299f7b1a52cf5cd43aec`  
**GitHub Actions run:** [Build validation #177](https://github.com/TKJ-Team-SMKN1/smkn1mandau-replika-rtd/actions/runs/44358032080)  
**Identity notice:** This remains an independent replica/concept. It is not the official SMK Negeri 1 Mandau website and does not represent or claim endorsement by the school.

## Deployment — completed

- The Vercel `unpause_project` action was requested on 19 November 2026. The API returned `result: null`.
- The final explicit Production deployment was created from `main` at commit `fd141c0ae9ea7455722f299f7b1a52cf5cd43aec`.
- Deployment ID: `dpl_TNrjjZ6PXFzQHrP6ngeH2zCmNkGQ`.
- Deployment URL: https://smkn1mandau-replika-j967uk7jb-hypergarudas-projects.vercel.app
- Deployment state: **READY**; target: Production; framework: Astro; Node.js 24.x.
- Primary alias assigned: https://smkn1mandau-replika-rtd.vercel.app
- Build log confirms 11 static pages generated and 10 indexable routes written to the sitemap.
- Vercel reports SSO protection enabled for non-custom deployment domains. Protection was not disabled.
- **Control-plane discrepancy:** `get_project` continued to report `live: false` after the unpause request, even though the final Production deployment is READY, its primary alias is assigned, and the public site responds successfully. Public availability is confirmed; the Vercel pause/live flag is **not independently confirmed cleared**. Verify this setting in the Vercel Dashboard.
- A non-fatal npm warning remains: unknown environment config `cache-dir`. It did not stop the deployment.

## Public production smoke audit — latest deployment

The public crawl was run after deployment `dpl_TNrjjZ6PXFzQHrP6ngeH2zCmNkGQ` became READY.

- **11/11 application routes returned HTTP 200**:
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
- All 11 returned HTML with page titles and Indonesian language metadata.
- `/pengaturan` correctly returns `noindex, nofollow`; the other 10 routes return `index, follow`.
- The independent-replica notice and source links are present in page content.
- Public `/robots.txt` returned HTTP 200 and declares `Allow: /` and the `/sitemap.xml` location.
- Public `/sitemap.xml` returned HTTP 200 and contains exactly 10 URLs. The settings page is correctly excluded.
- Vercel runtime error summary for the selected last **1 hour** returned no runtime errors. This is a limited time-window observation, not a guarantee of zero errors across all time or interactions.

## GitHub Actions — full automated run

<badge color="success">Build validation #177 — SUCCESS</badge>

- Run ID: `44358032080`
- Commit: `fd141c0ae9ea7455722f299f7b1a52cf5cd43aec`
- Job: `build`
- Job status: `completed`; conclusion: `success`.
- All **15/15 workflow steps** completed successfully.

### Individual audit results

| Step | Result | Observed output |
|---|---|---|
| `npm ci` | PASS | 292 packages added; 299 audited; 0 npm audit vulnerabilities reported |
| Astro / TypeScript check | PASS | 37 files; 0 errors, 0 warnings, 0 hints |
| Browser script syntax | PASS | i18n, feature detection, Batik Houdini worklet |
| Performance preflight | PASS | 3 font preloads; 391 bytes against 262,144-byte budget; 174 font-face rules; i18n.js 128,499 bytes; 1 client:load island |
| Localization preflight | PASS | Source ID; EN 169, MS 192, ZH 179 entries; locale picker id/en/ms/zh |
| Astro build | PASS | 11 static pages; sitemap generated with 10 indexable routes |
| SEO preflight | PASS | 10 canonical sitemap URLs; 11 HTML files; unique titles/descriptions, Open Graph, Twitter Card, sitemap discovery |
| HTML audit | PASS | 11 HTML pages; 174 font references; static audit passed |
| Archive audit | PASS | 100 HTML files; manifest/index match; 0 duplicate-content groups; no `public/.env` in webroot |
| Provenance audit | PASS | 44 source references; 7 page/data bindings; 127 staff snapshots, 10 programs, 20 historical events |
| WCAG static preflight | PASS | 11 pages; 174 OTF faces; 19 font families; six fallback palettes; contrast thresholds and 44 CSS px target baseline passed |
| Dependency security audit | PASS | npm audit totals: 0; no unreviewed High/Critical findings |

### Warnings and qualifications

- GitHub warns that `actions/checkout@v4` and `actions/setup-node@v4` target Node.js 20 and are being forced to Node.js 24 by the runner. Update to action releases that officially target the supported runtime when available.
- Node emitted a `punycode` deprecation warning.
- The dependency audit code still explicitly records the known Picomatch advisory chain as open; the successful run means no unreviewed High/Critical findings blocked CI, not that the advisory was remediated.
- Localization structural checks passed, but linguistic completeness still requires human review.
- WCAG static preflight passed, but it is not a WCAG 2.2 AA certification.

## What is completed

1. Requested Vercel unpause action.
2. Deployed the latest inspected `main` commit `fd141c0` to Production; deployment reached READY.
3. Confirmed primary alias assignment and public HTTP response.
4. Verified all 11 production routes return HTTP 200.
5. Verified `robots.txt` and `sitemap.xml` return HTTP 200; sitemap contains 10 indexable URLs.
6. Confirmed Vercel build output: 11 static pages and 10 indexable routes.
7. Verified GitHub Actions #177 completed successfully with all 15 steps passing.
8. Verified Astro/TypeScript, syntax, performance, localization structure, build, SEO, HTML, archive, provenance, WCAG static preflight, and dependency security checks passed.
9. Queried Vercel runtime errors for the last hour; none were reported.
10. Recorded the remaining manual and source-data limitations below.

## What remains open — do not mark complete

### Vercel control-plane
- The project details endpoint still returned `live: false` after the unpause request. Confirm the pause/live state directly in the Vercel Dashboard. Do not infer it from deployment READY alone.

### Accessibility / WCAG 2.2 AA
- WCAG 2.2 AA is **not verified or certified**.
- Keyboard-only operation, visible focus, focus order, Escape behavior, and focus at 200% zoom require manual browser checks.
- Reflow at 320 CSS px, text resize to 200%, and text-spacing overrides remain unverified.
- Contrast for every text, icon, border, control, hover/focus/active/disabled/error state needs rendered verification across all themes and Dynamic Color OS modes.
- TalkBack on Android Chrome and NVDA on desktop remain untested.
- Reduced-motion and forced-colors behavior still needs actual browser/assistive-technology review.
- Future or conditional media, forms, and interactive states need review.

### Security
- Picomatch advisory `GHSA-fc5q-39xc-vjpf` / `CVE-2026-112366` remains documented as unresolved/known-open. Do not invent an override or claim it is fixed.
- CSP remains `Content-Security-Policy-Report-Only`, not an enforced CSP.
- HTTP security response headers were not independently inspected.
- No full external penetration test or browser security test was performed.

### Performance and SEO
- No live Lighthouse, Core Web Vitals, or mobile performance score was collected.
- Public pages, robots, and sitemap were verified, but external search-engine indexing is not established.
- No locale-specific URLs or `hreflang` alternates are generated.

### Content and localization
- Staff dataset remains a dated snapshot of 127 entries; a separate extraction previously returned 123. The four-entry discrepancy remains unresolved.
- Current facilities inventory is intentionally unverified.
- Extracurricular activity names, supervisors, and schedules remain unverified because the archived source is image-led.
- Historical event date conflicts remain flagged in the data and must not be silently normalized.
- Translation structural checks passed, but the full EN/MS/ZH catalogue still needs fluent-speaker review.
- Continue distinguishing source facts, editorial summaries, and replica-only navigation/features.

## Audit boundary

This record separates confirmed deployment, CI, static-audit, and public-response results from the manual checks and unresolved data/security issues. A READY deployment and green CI run do not establish WCAG certification, perfect translation, current school data, or a complete security assessment.
