import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
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
assert.doesNotMatch(robots, /^Disallow: \/api\/$/m, 'The public course API must remain crawlable for client rendering.');
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

const vercel = JSON.parse(await readFile(path.join(projectRoot, 'vercel.json'), 'utf8'));
assert.ok(vercel.redirects.some((rule) => rule.source === '/website/' && rule.destination === '/' && rule.permanent === true));
assert.ok(vercel.redirects.some((rule) => rule.source === '/website/index.html' && rule.destination === '/' && rule.permanent === true));
assert.ok(vercel.redirects.some((rule) => rule.source === '/e-learning' && rule.destination === '/e-learning/' && rule.permanent === true));
assert.ok(vercel.rewrites.some((rule) => rule.source === '/' && rule.destination === '/website/index.html'));

console.log(`SEO verification passed for ${allPageUrls.length} canonical URLs.`);
