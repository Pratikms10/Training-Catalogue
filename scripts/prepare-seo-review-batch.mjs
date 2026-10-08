import 'dotenv/config';

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { closePool, getPool } from '../server/database.mjs';
import { getCourseById } from '../server/catalogueRepository.mjs';
import { buildPendingReleaseManifest, buildReviewRecord } from './lib/seo-review-batch.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportPath = path.join(projectRoot, 'artifacts', 'seo', 'programme-quality-report.json');

function argumentValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const currentMonth = new Date().toISOString().slice(0, 7);
const batchId = argumentValue('--batch-id', `${currentMonth}-wave-01`).toLowerCase();
const limit = Number.parseInt(argumentValue('--limit', '25'), 10);
if (!/^[a-z0-9][a-z0-9._-]{2,63}$/.test(batchId)) throw new Error('Invalid --batch-id value.');
if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new Error('--limit must be between 1 and 100.');

const report = JSON.parse(await readFile(reportPath, 'utf8'));
const candidates = report.readyForEditorialReview.slice(0, limit);
if (candidates.length < limit) {
  throw new Error(`Requested ${limit} programmes, but only ${candidates.length} currently pass the automated content gate.`);
}

const pool = getPool();
try {
  const metadataResult = await pool.query(
    `SELECT course_id, source_reference, seo_indexable, status
     FROM catalogue.courses
     WHERE course_id = ANY($1::text[])`,
    [candidates.map((candidate) => candidate.course_id)],
  );
  const metadataById = new Map(metadataResult.rows.map((row) => [row.course_id, row]));
  const records = [];

  for (const candidate of candidates) {
    const metadata = metadataById.get(candidate.course_id);
    if (!metadata || metadata.status !== 'published') throw new Error(`${candidate.course_id} is not published.`);
    if (metadata.seo_indexable) throw new Error(`${candidate.course_id} is already indexable.`);
    const programme = await getCourseById(pool, candidate.course_id);
    if (!programme) throw new Error(`${candidate.course_id} could not be loaded.`);
    records.push(buildReviewRecord(programme, { sourceReference: metadata.source_reference }));
  }

  const outputDirectory = path.join(projectRoot, 'artifacts', 'seo', 'review-batches', batchId);
  await mkdir(outputDirectory, { recursive: true });
  const manifest = buildPendingReleaseManifest(batchId, records);
  const summary = {
    batchId,
    generatedAt: new Date().toISOString(),
    status: 'pending-editorial-approval',
    programmeCount: records.length,
    categories: Object.fromEntries(Object.entries(records.reduce((counts, record) => {
      counts[record.category] = (counts[record.category] || 0) + 1;
      return counts;
    }, {})).sort()),
    releaseInstructions: [
      'Review every programme against its source evidence and visible page content.',
      'Replace the pending reviewer fields and evidence URLs in the manifest template.',
      'Set approved to true only for programmes that pass editorial review.',
      `Run npm run seo:release -- "${path.join(outputDirectory, 'release-manifest.template.json')}" for the mandatory dry run.`,
    ],
  };

  const markdown = [
    `# SEO editorial review batch: ${batchId}`,
    '',
    `Generated: ${summary.generatedAt}`,
    '',
    `Status: **Pending editorial approval**. None of these programmes has been made indexable.`,
    '',
    '## Reviewer checklist',
    '',
    '- Confirm the title accurately distinguishes this programme or credential.',
    '- Validate the summary, outcomes, audience, prerequisites, duration and delivery mode.',
    '- Check consequential or time-sensitive claims against an approved HTTPS source.',
    '- Review the suggested SEO title and description for accuracy and clarity.',
    '- Record the accountable reviewer, review timestamp and evidence URL before approval.',
    '',
    ...records.flatMap((record, index) => [
      `## ${index + 1}. ${record.courseId} — ${record.title}`,
      '',
      `- Page: ${record.pageUrl}`,
      `- Category: ${record.category}`,
      `- Level and duration: ${record.level || 'Not specified'}; ${record.duration || 'Not specified'}`,
      `- Delivery: ${record.delivery || 'Not specified'}`,
      `- Provider/exam: ${[record.provider, record.examCode].filter(Boolean).join(' / ') || 'Not applicable'}`,
      `- Source reference: ${record.sourceReference || 'Not recorded'}`,
      `- Official source: ${record.officialSourceUrl || 'Reviewer must supply an approved HTTPS evidence URL'}`,
      `- Suggested SEO title: ${record.suggestedSeoTitle}`,
      `- Suggested description: ${record.suggestedSeoDescription}`,
      `- Content coverage: ${record.outcomes.length} outcomes, ${record.audience.length} audiences, ${record.modules.length} modules, ${record.scenarios.length} scenarios`,
      '',
      `Summary: ${record.summary}`,
      '',
      '- [ ] Facts and terminology verified',
      '- [ ] Search snippet approved',
      '- [ ] Evidence URL recorded',
      '- [ ] Approved for indexing',
      '',
    ]),
  ].join('\n').trimEnd();

  await Promise.all([
    writeFile(path.join(outputDirectory, 'batch-summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8'),
    writeFile(path.join(outputDirectory, 'review-records.json'), `${JSON.stringify(records, null, 2)}\n`, 'utf8'),
    writeFile(path.join(outputDirectory, 'release-manifest.template.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8'),
    writeFile(path.join(outputDirectory, 'review-packet.md'), `${markdown}\n`, 'utf8'),
  ]);

  console.log(JSON.stringify({ ...summary, outputDirectory }, null, 2));
} finally {
  await closePool();
}
