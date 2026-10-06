import 'dotenv/config';

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { closePool, getPool } from '../server/database.mjs';
import { peopleProcessProgrammes } from '../src/data/peopleProcessProgrammes';

const SITE_ORIGIN = 'https://www.technoedgels.com';
const SITEMAP_NAMESPACE = 'http://www.sitemaps.org/schemas/sitemap/0.9';
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(projectRoot, 'public');

interface SitemapEntry {
  path: string;
  lastmod?: string;
}

interface PublishedProgrammeRow {
  course_id: string;
  updated_at: Date | string;
}

const xmlEscape = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const canonicalUrl = (pathname: string) => new URL(pathname, `${SITE_ORIGIN}/`).href;

const isoDate = (value: Date | string | undefined) => {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
};

const renderUrlSet = (entries: SitemapEntry[]) => {
  const urls = entries.map(({ path: pathname, lastmod }) => {
    const location = `    <loc>${xmlEscape(canonicalUrl(pathname))}</loc>`;
    const modified = lastmod ? `\n    <lastmod>${xmlEscape(lastmod)}</lastmod>` : '';
    return `  <url>\n${location}${modified}\n  </url>`;
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<urlset xmlns="${SITEMAP_NAMESPACE}">`,
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
};

const renderSitemapIndex = (filenames: string[]) => [
  '<?xml version="1.0" encoding="UTF-8"?>',
  `<sitemapindex xmlns="${SITEMAP_NAMESPACE}">`,
  ...filenames.map((filename) => [
    '  <sitemap>',
    `    <loc>${xmlEscape(canonicalUrl(`/${filename}`))}</loc>`,
    '  </sitemap>',
  ].join('\n')),
  '</sitemapindex>',
  '',
].join('\n');

async function getPublishedProgrammes(): Promise<SitemapEntry[]> {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error('DATABASE_URL is required to generate a complete sitemap from published catalogue records.');
  }

  const pool = getPool();

  try {
    const result = await pool.query<PublishedProgrammeRow>(`
      SELECT course_id, updated_at
      FROM catalogue.courses
      WHERE status = 'published'
        AND category_code IN ('role-based', 'tools-technology', 'technical-training', 'certifications')
      ORDER BY course_id
    `);

    const entries = new Map<string, SitemapEntry>();

    for (const row of result.rows) {
      const id = row.course_id.trim().toUpperCase();
      if (!/^(?:RB|TT|TC|CER)\d{4,}$/.test(id)) {
        throw new Error(`Published course has a non-canonical ID and cannot enter the sitemap: ${row.course_id}`);
      }
      entries.set(id, { path: `/programmes/${id}`, lastmod: isoDate(row.updated_at) });
    }

    for (const programme of peopleProcessProgrammes) {
      const id = programme.id.trim().toUpperCase();
      if (!/^PP\d{4,}$/.test(id)) {
        throw new Error(`People & Process programme has a non-canonical ID: ${programme.id}`);
      }
      entries.set(id, { path: `/programmes/${id}` });
    }

    if (entries.size === 0) {
      throw new Error('The programme sitemap would be empty; sitemap generation has been stopped.');
    }

    return [...entries.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([, entry]) => entry);
  } finally {
    await closePool();
  }
}

async function main() {
  const programmeEntries = await getPublishedProgrammes();
  const childSitemaps = [
    ['sitemap-pages.xml', [
      { path: '/' },
      { path: '/catalogue' },
      { path: '/e-learning/' },
    ]],
    ['sitemap-programmes.xml', programmeEntries],
    ['sitemap-insights.xml', [{ path: '/insights' }]],
    ['sitemap-careers.xml', [{ path: '/careers' }]],
  ] satisfies Array<[string, SitemapEntry[]]>;

  await mkdir(outputDirectory, { recursive: true });

  await Promise.all([
    ...childSitemaps.map(([filename, entries]) => (
      writeFile(path.join(outputDirectory, filename), renderUrlSet(entries), 'utf8')
    )),
    writeFile(
      path.join(outputDirectory, 'sitemap.xml'),
      renderSitemapIndex(childSitemaps.map(([filename]) => filename)),
      'utf8',
    ),
    writeFile(
      path.join(outputDirectory, 'robots.txt'),
      [
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin/',
        'Disallow: /api/admin/',
        '',
        `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
        '',
      ].join('\n'),
      'utf8',
    ),
  ]);

  console.log(`SEO files generated for ${programmeEntries.length} published programme URLs.`);
}

await main();
