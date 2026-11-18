# Phase 6 — SEO Expansion & Security Remediation

## Implemented

- Centralized the currently configured project origin in `site-config.mjs`: `https://smkn1mandau-replika-rtd.vercel.app`. This is the existing Vercel project alias already used by the repository, not a claim that a custom domain has been selected.
- Added a canonical URL to every page through the shared layout and added `og:url`.
- Added a generated XML sitemap after the Astro static build. It is derived from built HTML rather than a manually maintained route list.
- Added `robots.txt` with `Allow: /` and the sitemap location. The local appearance/preferences page (`/pengaturan`) remains crawlable so crawlers can read its `noindex, nofollow` meta directive; it is excluded from the sitemap.
- Added a `rel="sitemap"` link in the shared page head. CI validates unique non-empty page titles, non-empty descriptions, canonical uniqueness and route matching, Open Graph fields, Twitter Card, sitemap/canonical consistency, the robots sitemap reference, and the settings page's noindex state.
- Added a **Content-Security-Policy-Report-Only** response header as a non-blocking baseline. It is intended to expose policy violations in browser developer tools after a future deployment; it does not enforce a CSP and does not replace a full resource-origin audit.

## Dependency advisory — remains open

The lockfile resolves `picomatch@4.0.7`. GitHub Advisory `GHSA-fc5q-39xc-vjpf` / `CVE-2026-112366` identifies versions through 4.0.7 as affected and currently lists no first patched version. The upstream proposed remediation, [picomatch PR #238](https://github.com/micromatch/picomatch/pull/238), was still open and unmerged at the time of this review (2026-11-18). It is not safe to claim the dependency is fixed or to invent an override version.

The current project produces static HTML. The affected package is a transitive build dependency, not an application request-time glob endpoint in the generated static site. This reduces the direct runtime exposure but does **not** remove the build/CI dependency risk. The existing dependency audit continues to report this advisory as unresolved and fails on unrelated high/critical findings.

**Follow-up:** update the dependency chain when the upstream project publishes a patched release, then remove the known-open exception from the dependency audit and require a clean audit.

## Social preview and structured data decision

- Open Graph and Twitter title/description metadata use each page's existing title and description.
- No `og:image` is declared because the repository has no purpose-made, verified social preview image. No image is borrowed from the official school site for the independent replica.
- No `Organization` or `EducationalOrganization` structured data is added. The project is an independent replica/concept and must not imply that it represents or is authorized by the school.

## CSP status

CSP is intentionally report-only. The shared layout contains inline bootstrap/theme scripts and the site may use inline styles or external resource origins. Enforcing `default-src 'self'` before inventorying those dependencies could break real features. The report-only baseline is a diagnostic step; do not switch it to `Content-Security-Policy` until generated pages and browser interactions have been reviewed and the policy is narrowed to the actual resources.

## Verification limits

- GitHub Actions checks the generated sitemap, canonical consistency, title/description uniqueness and presence, Open Graph/Twitter metadata, sitemap discovery link, and the settings page's noindex state during the build.
- Vercel remains paused. Therefore the response headers, public sitemap, robots response, indexing and live browser CSP reports are not claimed as externally verified.
- SEOcrawl AI and Geekflare were unavailable in this phase because their connected accounts reported exhausted credits.
- This independent replica remains distinct from the school's official website. The existing replica notice is retained.
