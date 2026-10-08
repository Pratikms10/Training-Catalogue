import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { importedInsights } from '../src/data/importedInsights';
import { deriveInsightExcerpt } from './lib/insight-quality.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDirectory = path.join(projectRoot, 'public', 'insights-content');
const outputPath = path.join(projectRoot, 'src', 'data', 'importedInsights.ts');

const repaired = [];
let changed = 0;
for (const article of importedInsights) {
  const payload = JSON.parse(await readFile(path.join(contentDirectory, `${article.id}.json`), 'utf8'));
  const excerpt = deriveInsightExcerpt(payload.content, article.excerpt);
  if (excerpt !== article.excerpt) changed += 1;
  repaired.push({ ...article, excerpt });
}

await writeFile(
  outputPath,
  `// Generated from the approved Insights workbook. Run import-insights-workbook.mjs to refresh.\nexport const importedInsights = ${JSON.stringify(repaired, null, 2)} as const;\n`,
  'utf8',
);

console.log(JSON.stringify({ articles: repaired.length, repairedExcerpts: changed }, null, 2));
