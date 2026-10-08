import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { closePool, getPool } from '../server/database.mjs';
import { insightsArticles } from '../src/data/insightsData';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const commit = process.argv.includes('--commit');

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

function markdownToHtml(source: string) {
  const output: string[] = [];
  const paragraph: string[] = [];
  const list: string[] = [];
  const flushParagraph = () => {
    if (paragraph.length) output.push(`<p>${escapeHtml(paragraph.join(' '))}</p>`);
    paragraph.length = 0;
  };
  const flushList = () => {
    if (list.length) output.push(`<ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`);
    list.length = 0;
  };
  for (const sourceLine of source.replace(/\r\n/g, '\n').split('\n')) {
    const line = sourceLine.trim();
    const heading = /^(#{2,4})\s+(.+)$/.exec(line);
    const listItem = /^(?:[-*]|\d+\.)\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      const level = Math.min(heading[1].length, 4);
      output.push(`<h${level}>${escapeHtml(heading[2].trim())}</h${level}>`);
    } else if (listItem) {
      flushParagraph();
      list.push(listItem[1].trim());
    } else if (!line) {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return output.join('\n');
}

const records = await Promise.all(insightsArticles.map(async (article, index) => {
  const contentPath = path.join(projectRoot, 'public', 'insights-content', `${article.id}.json`);
  const content = JSON.parse(await readFile(contentPath, 'utf8')) as { content: string; tables?: string };
  const publishedAt = article.datePublished || new Date(article.date).toISOString();
  return {
    ...article,
    contentHtml: markdownToHtml(content.content),
    referenceTable: content.tables || '',
    publishedAt,
    readTimeMinutes: Math.max(1, Number.parseInt(article.readTime, 10) || 1),
    isFeatured: index === 0,
  };
}));

console.log(`Prepared ${records.length} existing Insights articles for migration.`);
if (!commit) {
  console.log('Dry run only. Add --commit after applying migration 012.');
  process.exit(0);
}

const pool = getPool();
const client = await pool.connect();
try {
  await client.query('BEGIN');
  let inserted = 0;
  for (const article of records) {
    const result = await client.query(`
      INSERT INTO content.blog_posts (
        slug, title, excerpt, content_html, reference_table, category, author_name,
        featured_image_url, featured_image_alt, seo_title, meta_description,
        status, published_at, is_featured, indexable, read_time_minutes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $2, $3,
        'published', $10, $11, $12, $13
      ) ON CONFLICT (slug) DO NOTHING
    `, [
      article.id, article.title, article.excerpt, article.contentHtml,
      article.referenceTable, article.category, article.author, article.image,
      article.title, article.publishedAt, article.isFeatured, article.indexable,
      article.readTimeMinutes,
    ]);
    inserted += result.rowCount || 0;
  }
  await client.query('COMMIT');
  console.log(`Inserted ${inserted}; preserved ${records.length - inserted} existing database articles.`);
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
  await closePool();
}
