import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_ORIGIN = 'https://www.technoedgels.com';
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDirectory = path.join(projectRoot, 'public');
const buildDirectory = path.join(projectRoot, 'dist');
const childSitemaps = [
  'sitemap-pages.xml',
  'sitemap-programmes.xml',
  'sitemap-insights.xml',
  'sitemap-careers.xml',
];

const read = (directory, filename) => readFile(path.join(directory, filename), 'utf8');
const locations = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

const [robots, sitemapIndex] = await Promise.all([
  read(buildDirectory, 'robots.txt'),
  read(buildDirectory, 'sitemap.xml'),
]);

assert.match(robots, /^User-agent: \*$/m);
assert.match(robots, /^Allow: \/$/m);
assert.match(robots, /^Disallow: \/admin\/$/m);
assert.match(robots, /^Disallow: \/api\/admin\/$/m);
assert.match(robots, /^Disallow: \/api\/$/m);
assert.match(robots, /^User-agent: OAI-SearchBot$/m);
assert.match(robots, /^User-agent: GPTBot$/m);
assert.match(robots, new RegExp(`^Sitemap: ${SITE_ORIGIN.replaceAll('.', '\\.')}\/sitemap\\.xml$`, 'm'));

const expectedSitemapUrls = childSitemaps.map((filename) => `${SITE_ORIGIN}/${filename}`);
assert.deepEqual(locations(sitemapIndex), expectedSitemapUrls);

const allPageUrls = [];
for (const filename of childSitemaps) {
  const [sourceXml, builtXml] = await Promise.all([
    read(sourceDirectory, filename),
    read(buildDirectory, filename),
  ]);
  assert.equal(builtXml, sourceXml, `${filename} differs between public/ and dist/.`);
  assert.match(builtXml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);

  const urls = locations(builtXml);
  assert.ok(urls.length > 0, `${filename} must contain at least one URL.`);
  assert.ok(urls.length <= 50_000, `${filename} exceeds the sitemap URL limit.`);
  allPageUrls.push(...urls);
}

assert.equal(new Set(allPageUrls).size, allPageUrls.length, 'Sitemap URLs must be unique across child files.');
for (const value of allPageUrls) {
  const url = new URL(value);
  assert.equal(url.origin, SITE_ORIGIN, `Unexpected sitemap origin: ${value}`);
  assert.equal(url.search, '', `Sitemap URL contains a query string: ${value}`);
  assert.equal(url.hash, '', `Sitemap URL contains a fragment: ${value}`);
  assert.doesNotMatch(url.pathname, /^\/(?:admin|api|website)(?:\/|$)/, `Private or duplicate route leaked into sitemap: ${value}`);
  assert.doesNotMatch(url.pathname, /insight-placeholder|\/(?:ai|latest|popular)-\d+$/, `Draft insight leaked into sitemap: ${value}`);
}

for (const expected of ['/', '/catalogue', '/e-learning/', '/insights', '/careers']) {
  assert.ok(allPageUrls.includes(`${SITE_ORIGIN}${expected}`), `Missing required canonical URL: ${expected}`);
}

const programmeXml = await read(buildDirectory, 'sitemap-programmes.xml');
const programmeUrls = locations(programmeXml);
assert.ok(programmeUrls.length >= 1, 'Programme sitemap must not be empty.');
for (const value of programmeUrls) {
  assert.match(new URL(value).pathname, /^\/programmes\/(?:RB|PP|TT|TC|CER)\d{4,}$/);
}

const [corporateHtml, learningHtml, sharedHtml] = await Promise.all([
  read(buildDirectory, 'website/index.html'),
  read(buildDirectory, 'e-learning/index.html'),
  read(buildDirectory, 'index.html'),
]);
assert.match(corporateHtml, /<link rel="canonical" href="https:\/\/www\.technoedgels\.com\/"\s*\/?>/);
assert.match(learningHtml, /<link rel="canonical" href="https:\/\/www\.technoedgels\.com\/e-learning\/"\s*\/?>/);
assert.doesNotMatch(sharedHtml, /<link rel="canonical"/, 'The shared SPA shell must not hard-code one route as canonical.');
for (const [name, html] of [['corporate', corporateHtml], ['e-learning', learningHtml]]) {
  assert.doesNotMatch(html, /<div id="root">\s*<link\b/i, `${name} resource hints must be hoisted outside the hydration root.`);
}

const routeFile = (pathname) => {
  if (pathname === '/') return path.join(buildDirectory, 'website', 'index.html');
  if (pathname === '/website/' || pathname === '/website') return path.join(buildDirectory, 'website', 'index.html');
  if (pathname === '/e-learning/') return path.join(buildDirectory, 'e-learning', 'index.html');
  return path.join(buildDirectory, `${pathname.replace(/^\//, '').replace(/\/$/, '')}.html`);
};
const firstMatch = (html, pattern) => pattern.exec(html)?.[1]?.trim() || '';
const normalizeHtmlText = (value) => value
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z0-9#]+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const seenTitles = new Map();
const seenDescriptions = new Map();
const internalLinks = new Map();
for (const value of allPageUrls) {
  const url = new URL(value);
  const html = await readFile(routeFile(url.pathname), 'utf8');
  const title = firstMatch(html, /<title>([\s\S]*?)<\/title>/i);
  const description = firstMatch(html, /<meta\s+name="description"\s+content="([^"]+)"\s*\/?\s*>/i);
  const robotsDirective = firstMatch(html, /<meta\s+name="robots"\s+content="([^"]+)"\s*\/?\s*>/i);
  const canonical = firstMatch(html, /<link\s+rel="canonical"\s+href="([^"]+)"\s*\/?\s*>/i);
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const mainContent = firstMatch(html, /<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const headingLevels = [...mainContent.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));

  assert.doesNotMatch(html, /<div id="root">\s*<link\b/i, `Resource hints must be hoisted outside the hydration root for ${url.pathname}`);

  assert.ok(title, `Missing title in initial HTML for ${url.pathname}`);
  assert.ok(description, `Missing description in initial HTML for ${url.pathname}`);
  assert.match(robotsDirective, /^index, follow/, `Sitemap URL is not indexable: ${url.pathname}`);
  assert.equal(canonical, value, `Canonical mismatch for ${url.pathname}`);
  assert.equal(h1Count, 1, `Expected exactly one H1 in initial HTML for ${url.pathname}`);
  assert.equal(headingLevels[0], 1, `Primary content must begin with an H1 for ${url.pathname}`);
  for (let index = 1; index < headingLevels.length; index += 1) {
    assert.ok(
      headingLevels[index] <= headingLevels[index - 1] + 1,
      `Heading hierarchy skips from H${headingLevels[index - 1]} to H${headingLevels[index]} for ${url.pathname}`,
    );
  }
  assert.ok(normalizeHtmlText(html).length >= 300, `Initial HTML is too thin for ${url.pathname}`);
  assert.ok(!seenTitles.has(title), `Duplicate title between ${seenTitles.get(title)} and ${url.pathname}`);
  assert.ok(!seenDescriptions.has(description), `Duplicate description between ${seenDescriptions.get(description)} and ${url.pathname}`);
  seenTitles.set(title, url.pathname);
  seenDescriptions.set(description, url.pathname);

  for (const match of html.matchAll(/<a\b[^>]*\bhref=(['"])(.*?)\1/gi)) {
    const href = match[2].replaceAll('&amp;', '&');
    if (!href || href.startsWith('#') || /^(?:mailto|tel|javascript):/i.test(href)) continue;
    const linkedUrl = new URL(href, SITE_ORIGIN);
    if (linkedUrl.origin !== SITE_ORIGIN || linkedUrl.pathname.startsWith('/api/')) continue;
    if (!internalLinks.has(linkedUrl.pathname)) internalLinks.set(linkedUrl.pathname, url.pathname);
  }
}

for (const [pathname, sourcePath] of internalLinks) {
  const target = /\.[a-z0-9]{2,8}$/i.test(pathname)
    ? path.join(buildDirectory, pathname.replace(/^\//, ''))
    : routeFile(pathname);
  await assert.doesNotReject(
    access(target),
    `Broken internal link from ${sourcePath}: ${pathname}`,
  );
}

const [sourceFeed, builtFeed] = await Promise.all([
  read(sourceDirectory, 'insights.xml'),
  read(buildDirectory, 'insights.xml'),
]);
assert.equal(builtFeed, sourceFeed, 'insights.xml differs between public/ and dist/.');
assert.match(builtFeed, /<rss version="2\.0">/);

const qualityReport = JSON.parse(await readFile(path.join(projectRoot, 'artifacts', 'seo', 'programme-quality-report.json'), 'utf8'));
const heldProgrammeId = qualityReport.remediationProgrammes?.[0]?.course_id;
assert.ok(heldProgrammeId, 'Quality report must contain at least one held programme for noindex verification.');
const heldProgrammePath = `/programmes/${heldProgrammeId}`;
const heldProgrammeHtml = await readFile(routeFile(heldProgrammePath), 'utf8');
assert.match(
  firstMatch(heldProgrammeHtml, /<meta\s+name="robots"\s+content="([^"]+)"\s*\/?\s*>/i),
  /^noindex, follow/,
  `Held programme must be noindex: ${heldProgrammePath}`,
);
assert.ok(!programmeUrls.includes(`${SITE_ORIGIN}${heldProgrammePath}`), `Held programme leaked into sitemap: ${heldProgrammePath}`);
assert.equal((heldProgrammeHtml.match(/<h1\b/gi) || []).length, 1, `Held programme lacks complete static HTML: ${heldProgrammePath}`);

const notFoundHtml = await read(buildDirectory, '404.html');
assert.match(notFoundHtml, /<meta\s+name="robots"\s+content="noindex, follow"/i);
assert.match(notFoundHtml, /<h1\b[^>]*>Page not found<\/h1>/i);

const vercel = JSON.parse(await readFile(path.join(projectRoot, 'vercel.json'), 'utf8'));
assert.ok(vercel.redirects.some((rule) => rule.source === '/e-learning' && rule.destination === '/e-learning/' && rule.permanent === true));
assert.ok(vercel.rewrites.some((rule) => rule.source === '/' && rule.destination === '/website'));
assert.equal(vercel.cleanUrls, true, 'Clean URLs must be enabled for prerendered HTML routes.');
for (const forbidden of ['/programmes/:path*', '/insights/:path*', '/careers/:path*', '/website/:path*', '/e-learning/:path*']) {
  assert.ok(!vercel.rewrites.some((rule) => rule.source === forbidden), `Catch-all rewrite would create soft 200 responses: ${forbidden}`);
}

console.log(`SEO verification passed for ${allPageUrls.length} canonical URLs.`);
