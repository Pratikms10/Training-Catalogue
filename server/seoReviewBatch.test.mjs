import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildPendingReleaseManifest,
  buildReviewRecord,
  suggestedSeoDescription,
  suggestedSeoTitle,
  truncateAtWord,
} from '../scripts/lib/seo-review-batch.mjs';

const programme = {
  id: 'RB0419',
  title: 'Meta AI & Manus for Information Technology: AI-Assisted Technical Research — Awareness Programme (4 Hours)',
  category: 'role-based',
  level: 'Awareness',
  duration: '4 Hours',
  details: {
    delivery: 'Instructor-Led',
    summary: 'Understand how Meta AI and Manus support technical research, troubleshooting and controlled IT workflows.',
    audience: ['IT managers'],
    objectives: ['Research', 'Troubleshoot', 'Validate'],
    prerequisitesList: ['Basic IT knowledge'],
    modules: [{ title: 'Foundations' }],
    scenarios: [{ title: 'Troubleshooting workflow' }],
  },
};

test('review suggestions stay inside metadata limits', () => {
  const title = suggestedSeoTitle(programme);
  const description = suggestedSeoDescription(programme);
  assert.ok(title.length >= 20 && title.length <= 70);
  assert.ok(description.length >= 50 && description.length <= 160);
  assert.ok(!title.endsWith('… | TechnoEdge') || title.length <= 70);
});

test('review records contain editorial evidence fields', () => {
  const record = buildReviewRecord(programme, { sourceReference: 'import-batch:14' });
  assert.equal(record.courseId, 'RB0419');
  assert.equal(record.sourceReference, 'import-batch:14');
  assert.equal(record.modules.length, 1);
  assert.equal(record.officialSourceUrl, null);
});

test('pending manifests cannot be mistaken for approval', () => {
  const record = buildReviewRecord(programme);
  const manifest = buildPendingReleaseManifest('2026-10-wave-01', [record]);
  assert.equal(manifest.programmes[0].approved, false);
  assert.equal(manifest.reviewedAt, null);
  assert.match(manifest.reviewedBy, /^PENDING/);
});

test('word truncation preserves the requested upper bound', () => {
  assert.ok(truncateAtWord('one two three four five six seven', 18).length <= 19);
});
