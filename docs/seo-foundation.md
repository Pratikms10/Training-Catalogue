# TechnoEdge SEO foundation

## Canonical URL policy

- Production origin: `https://www.technoedgels.com`
- Homepage: `/`
- The former application path `/website/` permanently redirects to `/`.
- Programme canonical URLs use the current uppercase catalogue ID, for example `/programmes/TT0001`.
- Catalogue filters and search parameters canonicalize to `/catalogue` and are not sitemap URLs.
- Admin, API, aliases, placeholders, error pages and redirecting URLs are not included in sitemaps.

## Generated crawler files

`npm run generate:seo` queries the published catalogue and writes:

- `public/robots.txt`
- `public/sitemap.xml`
- `public/sitemap-pages.xml`
- `public/sitemap-programmes.xml`
- `public/sitemap-insights.xml`
- `public/sitemap-careers.xml`

The programme sitemap uses published `RB`, `TT`, `TC` and `CER` records from PostgreSQL plus the twelve checked-in `PP` programmes. `DATABASE_URL` is required so a partial catalogue sitemap cannot be deployed accidentally.

The root `npm run build` command refreshes the sitemap before compilation and runs `npm run verify:seo` against the final `dist` output afterward.

## Initial indexability policy

The initial sitemap contains the homepage, catalogue, e-learning, insights index, careers index and every published programme detail page.

Insight detail pages currently reuse templated article bodies, and career detail pages do not yet contain full job descriptions. These routes receive `noindex, follow` and are excluded from the sitemap until they pass editorial review. When those pages are expanded, introduce an explicit published/indexable field rather than inferring quality from a URL or text length.

## Launch checklist

1. Deploy the production build with the canonical `www` domain configured as the primary domain.
2. Verify the non-`www` host redirects permanently to `www` and `/website/` redirects permanently to `/`.
3. Verify successful responses and content types for `/robots.txt`, `/sitemap.xml` and every child sitemap.
4. Submit `https://www.technoedgels.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
5. Inspect the homepage, catalogue, one URL from every programme category, insights and careers in Search Console.
6. Export valuable URLs from the existing WordPress sitemap, Search Console and backlink data; create one-to-one permanent redirects before the final domain cutover.
7. Monitor indexing, redirect errors, soft 404s and Core Web Vitals after launch.

## Next technical SEO phase

The catalogue is still a client-rendered React application. Route metadata is updated after React loads and was verified in a browser, but social crawlers and crawlers without JavaScript may still see the shared HTML shell. The next phase should prerender or server-render indexable programme pages and return real HTTP 404/410 responses for missing routes.
