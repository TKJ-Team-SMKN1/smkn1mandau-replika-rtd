# Phase 6 — SEO Expansion & Security Remediation

## Implemented

- Centralized the currently configured project origin in `site-config.mjs`: `https://smkn1mandau-replika-rtd.vercel.app`. This is the existing Vercel project alias already used by the repository, not a claim that a custom domain has been selected.
- Added a canonical URL to every page through the shared layout and added `og:url`.
- Added a generated XML sitemap after the Astro static build. It is derived from built HTML rather than a manually maintained route list.
- Added `robots.txt` with `Allow: /` and the sitemap location. The local appearance/preferences page (`/pengaturan`) remains crawlable so crawlers can read its `noindex, nofollow` meta directive; it is excluded from the sitemap.
- Added a `rel="sitemap"` link in the shared page head. CI validates unique non-empty page titles, non-empty descriptions, canonical uniqueness and route matching, Open Graph fields, Twitter Card, sitemap/canonical consistency, the robots sitemap reference, and the settings page's noindex state.
- Added a **Content-Security-Policy-Report-Only** response header as a non-blocking baseline. It is intended to expose policy violations in browser developer tools; it does not enforce a CSP and does not replace a full resource-origin audit.

## Dependency advisory — withdrawn

The lockfile currently resolves `picomatch@4.0.7` and a nested `picomatch@2.3.2`. GitHub Advisory `GHSA-fc5q-39xc-vjpf` / `CVE-2026-112366`, which had described a ReDoS issue in Picomatch, was **withdrawn by GitHub on 18 November 2026**. In the upstream discussion, the Picomatch maintainer disputed the vulnerability claim; a subsequent upstream comment confirms that GitHub and VulnCheck withdrew their advisories.

References:
- [GitHub Advisory — withdrawn status](https://github.com/advisories/GHSA-fc5q-39xc-vjpf)
- [Picomatch upstream discussion #235](https://github.com/micromatch/picomatch/pull/235)
- [GitHub Advisory Database withdrawal follow-up](https://github.com/github/advisory-database/pull/11405)

**Disposition:** do not downgrade Picomatch, add a speculative npm override, or claim a patched release exists. This finding is no longer treated as an active GitHub-reviewed advisory. Some third-party scanners or cached vulnerability feeds may continue to show stale copies, so verify the source advisory's current status when triaging a future alert. The normal dependency audit now fails on any Critical/High advisory reported by `npm audit`, without a special-case allowlist for this withdrawn GHSA.

The presence of a package in the lockfile alone does not establish exploitable application exposure. The project is built as static HTML; this repository has no user-facing runtime glob endpoint identified in this review. That is a scope observation, not a substitute for reviewing future dependency or application changes.

## Social preview and structured data decision

- Open Graph and Twitter title/description metadata use each page's existing title and description.
- No `og:image` is declared because the repository has no purpose-made, verified social preview image. No image is borrowed from the official school site for the independent replica.
- No `Organization` or `EducationalOrganization` structured data is added. The project is an independent replica/concept and must not imply that it represents or is authorized by the school.

## CSP status

CSP is intentionally report-only. The shared layout contains inline bootstrap/theme scripts and the site may use inline styles or external resource origins. Enforcing `default-src 'self'` before inventorying those dependencies could break real features. The report-only baseline is a diagnostic step; do not switch it to `Content-Security-Policy` until generated pages and browser interactions have been reviewed and the policy is narrowed to the actual resources.

## Production verification update — 19 November 2026

- The production deployment was observed in Vercel with state `READY`.
- A public crawl of all 11 application routes returned HTTP 200. Page metadata included titles and Indonesian language metadata.
- `/pengaturan` correctly returned `noindex, nofollow`; the other 10 routes returned `index, follow`.
- Public `/robots.txt` returned HTTP 200 and points to `/sitemap.xml`.
- Public `/sitemap.xml` returned HTTP 200 and contained 10 URLs. The settings page is correctly excluded.
- These checks establish public page, robots, and sitemap responses at the time of the crawl. They do not establish search-engine indexing or validate every canonical/response-header value.
- The Vercel project details response continued to report `live: false` after an unpause request, despite READY production deployments and the public alias responding successfully. The pause/live control-plane state still needs confirmation in the Vercel dashboard.
- Security response headers were not inspected in this pass. The CSP remains report-only.

## Verification limits and remaining work

- The complete push-triggered GitHub Actions audit workflow was not confirmed passed. See `docs/DEPLOYMENT-AUDIT-2026-11-19.md` for the observed CI status and the full outstanding audit list.
- No live Lighthouse, Core Web Vitals, or mobile performance score was collected.
- No full external penetration test or browser security test was performed.
- SEOcrawl AI and Geekflare were unavailable in the earlier phase because their connected accounts reported exhausted credits.
- Multilingual text switching does not create separate locale URLs or `hreflang` alternates.
- This independent replica remains distinct from the school's official website. The existing replica notice is retained.
