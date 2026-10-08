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

## Indexability policy

The sitemap contains the homepage, catalogue, e-learning, approved landing pages, insights index, careers index and programme detail pages that are both published and explicitly SEO-approved.

Insight detail pages currently reuse templated article bodies, and career detail pages do not yet contain full job descriptions. These routes receive `noindex, follow` and are excluded from the sitemap until they pass editorial review. When those pages are expanded, introduce an explicit published/indexable field rather than inferring quality from a URL or text length.

## Operational guides

- Use `docs/seo-release-workflow.md` to remediate, approve and release held programme pages.
- Use `docs/seo-launch-handoff.md` for production configuration, cutover, submissions, monitoring and rollback.

## Rendering and status behavior

Indexable routes are prerendered with their H1, page body, metadata, canonical, structured data and internal links in the initial response. Unknown routes use the generated `404` document and production routing rules rather than returning the shared application shell with a successful status.
