# Production SEO launch handoff

## Required production inputs

- Confirm `https://www.technoedgels.com` as the primary Vercel domain.
- Supply the production `DATABASE_URL` and TLS settings through protected Vercel environment variables.
- Generate an 8–128 character `INDEXNOW_KEY` and configure it in production and in the secure release environment.
- Supply the Google Tag Manager container ID as `VITE_GTM_ID` after the consent configuration and tags have been approved.
- Give the launch owner access to Google Search Console, Bing Webmaster Tools, GA4/GTM, and the DNS provider.
- Export the former WordPress URLs, Search Console landing pages, backlink targets, and campaign landing pages for redirect mapping.

Never commit production credentials, verification tokens, database URLs, or analytics secrets.

## Pre-deployment gate

Run against the exact production commit:

```powershell
npm ci
npm run lint
npm test
npm run build
npm run lighthouse:ci
npm audit --omit=dev --audit-level=high
```

The build must stop if an indexable page is non-canonical, missing initial HTML, absent, redirecting, `noindex`, structurally invalid, or missing from the appropriate sitemap.

Review the generated programme-quality report. Held pages remain accessible to users but must remain `noindex` and outside the sitemap.

## Redirect and status review

- Map each valuable legacy URL directly to its closest canonical replacement with one permanent redirect.
- Preserve query parameters only where they have a real destination use.
- Use `410` for intentionally retired content with no equivalent.
- Return a genuine `404` for unknown routes.
- Do not redirect unrelated URLs to the homepage.
- Test both `www` and non-`www`, HTTP to HTTPS, trailing slashes, case normalization, old WordPress paths, programme aliases, and missing dynamic routes.

Keep redirect evidence and ownership in the release ticket. Retain useful redirects for at least one year and preferably indefinitely.

## Cutover sequence

1. Deploy the verified Vercel build and make `www.technoedgels.com` primary.
2. Confirm the non-`www` host redirects permanently to the canonical host.
3. Verify `/robots.txt`, `/sitemap.xml`, every child sitemap, representative programmes, landing pages, insights, careers, and the `404` response.
4. Confirm the IndexNow key endpoint returns the configured public key.
5. Submit `https://www.technoedgels.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
6. Inspect the homepage, catalogue, each landing-page type, and one approved programme from every category.
7. Run `npm run indexnow:submit` for the initial canonical set after the deployed key endpoint is live.
8. Confirm analytics remains absent before consent and starts only after consent on every site surface.

## Monitoring and rollback

Monitor weekly for eight weeks: indexed versus submitted URLs, crawl errors, canonical selection, redirects, soft 404s, Core Web Vitals, organic enquiries, assisted conversions, programme engagement, and AI/search referrals.

Rollback the Vercel deployment when a release introduces widespread `5xx` errors, broken canonical markup, missing server-rendered content, invalid sitemaps, or form failures. Do not roll back merely because indexing is gradual. After rollback, resubmit only URLs whose deployed state changed.

## External actions that cannot be automated from the repository

- Domain/DNS ownership and production deployment approval.
- Search Console and Bing Webmaster Tools verification.
- GA4/GTM account setup and consent-mode configuration.
- Google Business Profile and Bing Places claims for genuine customer-serving locations.
- Editorial approval of programme facts, author biographies, job descriptions, and client case studies.
