import 'dotenv/config';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteOrigin = 'https://www.technoedgels.com';
const key = process.env.INDEXNOW_KEY?.trim();
if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key)) {
  throw new Error('INDEXNOW_KEY must be configured with an 8–128 character IndexNow key.');
}

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitemapFiles = ['sitemap-pages.xml', 'sitemap-programmes.xml', 'sitemap-insights.xml', 'sitemap-careers.xml'];
const urls = new Set();
for (const filename of sitemapFiles) {
  const xml = await readFile(path.join(projectRoot, 'public', filename), 'utf8');
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(match[1]);
}

const requestedUrls = process.argv.slice(2).length
  ? process.argv.slice(2).map((value) => new URL(value, `${siteOrigin}/`).href)
  : [...urls];

for (let index = 0; index < requestedUrls.length; index += 10_000) {
  const urlList = requestedUrls.slice(index, index + 10_000);
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(siteOrigin).hostname,
      key,
      keyLocation: `${siteOrigin}/api/indexnow-key`,
      urlList,
    }),
  });
  if (!response.ok) throw new Error(`IndexNow submission failed with HTTP ${response.status}: ${await response.text()}`);
}

console.log(`Submitted ${requestedUrls.length} changed URLs to IndexNow.`);
