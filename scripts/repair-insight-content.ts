import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { importedInsights } from '../src/data/importedInsights';
import { normalizeInsightContent } from './lib/insight-quality.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDirectory = path.join(projectRoot, 'public', 'insights-content');
let changed = 0;

for (const article of importedInsights) {
  const contentPath = path.join(contentDirectory, `${article.id}.json`);
  const payload = JSON.parse(await readFile(contentPath, 'utf8'));
  const content = normalizeInsightContent(payload.content);
  if (content === payload.content) continue;
  await writeFile(contentPath, `${JSON.stringify({ ...payload, content })}\n`, 'utf8');
  changed += 1;
}

console.log(JSON.stringify({ articles: importedInsights.length, repairedContentFiles: changed }, null, 2));
