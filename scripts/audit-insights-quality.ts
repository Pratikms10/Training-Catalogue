import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { importedInsights } from '../src/data/importedInsights';
import { analyzeInsightContent } from './lib/insight-quality.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDirectory = path.join(projectRoot, 'public', 'insights-content');
const reportDirectory = path.join(projectRoot, 'artifacts', 'seo');
const batchId = 'insights-2026-10-wave-01';

const records = [];
for (const article of importedInsights) {
  const payload = JSON.parse(await readFile(path.join(contentDirectory, `${article.id}.json`), 'utf8'));
  records.push(analyzeInsightContent(article, payload));
}

const strategicPattern = /(ai readiness|role-based|enterprise ai|corporate training|gcc|copilot|dpdp|governance|workforce|upskilling)/i;
const reviewPriority = [...records]
  .sort((left, right) => {
    const leftScore = (strategicPattern.test(left.title) ? 20 : 0) + Math.min(left.wordCount, 3000) / 300 - left.blockers.length * 2;
    const rightScore = (strategicPattern.test(right.title) ? 20 : 0) + Math.min(right.wordCount, 3000) / 300 - right.blockers.length * 2;
    return rightScore - leftScore || left.title.localeCompare(right.title);
  })
  .slice(0, 10);

const blockerSummary = Object.entries(records.reduce<Record<string, number>>((counts, record) => {
  for (const blocker of record.blockers) counts[blocker] = (counts[blocker] || 0) + 1;
  return counts;
}, {}))
  .map(([blocker, count]) => ({ blocker, count }))
  .sort((left, right) => right.count - left.count || left.blocker.localeCompare(right.blocker));

const report = {
  generatedAt: new Date().toISOString(),
  totalArticles: records.length,
  indexableArticles: 0,
  blockerSummary,
  reviewPriority,
  articles: records,
};

const batchDirectory = path.join(reportDirectory, 'review-batches', batchId);
await mkdir(batchDirectory, { recursive: true });
const markdown = [
  `# Insight editorial review batch: ${batchId}`,
  '',
  'Status: **Pending author, source and editorial approval**. These articles remain noindex.',
  '',
  '## Batch checklist',
  '',
  '- Assign a verified author and subject-matter reviewer.',
  '- Add direct links to primary sources for material or time-sensitive claims.',
  '- Remove legacy CTA text and placeholder internal-link instructions.',
  '- Confirm the answer-first introduction, H2 structure and excerpt.',
  '- Add relevant service, solution and programme links.',
  '- Record publication and material-review dates before indexing.',
  '',
  ...reviewPriority.flatMap((record, index) => [
    `## ${index + 1}. ${record.title}`,
    '',
    `- Slug: ${record.id}`,
    `- Category: ${record.category}`,
    `- Coverage: ${record.wordCount} words; ${record.h2Count} H2s; ${record.h3Count} H3s`,
    `- Source links detected: ${record.sourceUrls.length}`,
    `- Remaining blockers: ${record.blockers.join(', ') || 'None'}`,
    '- [ ] Author and reviewer verified',
    '- [ ] Factual claims and sources checked',
    '- [ ] Internal links and CTA repaired',
    '- [ ] Approved for indexing',
    '',
  ]),
].join('\n').trimEnd();

await Promise.all([
  mkdir(reportDirectory, { recursive: true }),
  writeFile(path.join(reportDirectory, 'insight-quality-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8'),
  writeFile(path.join(batchDirectory, 'review-records.json'), `${JSON.stringify(reviewPriority, null, 2)}\n`, 'utf8'),
  writeFile(path.join(batchDirectory, 'review-packet.md'), `${markdown}\n`, 'utf8'),
]);

console.log(JSON.stringify({
  totalArticles: records.length,
  reviewBatch: reviewPriority.length,
  blockerSummary,
  batchDirectory,
}, null, 2));
