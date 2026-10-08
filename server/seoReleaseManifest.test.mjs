import assert from 'node:assert/strict';
import test from 'node:test';
import { validateSeoReleaseManifest } from '../scripts/lib/seo-release-manifest.mjs';

const validManifest = () => ({
  batchId: '2026-10-wave-01',
  reviewedBy: 'TechnoEdge Editorial Team',
  reviewedAt: '2026-10-08T10:00:00+05:30',
  programmes: [{
    courseId: 'TT0002',
    approved: true,
    sourceUrl: 'https://example.com/approved-source',
    seoTitle: 'Approved enterprise technology training programme',
    seoDescription: 'A reviewed programme description that clearly explains the enterprise learning outcome and delivery context.',
  }],
});

test('normalizes an approved SEO release manifest', () => {
  const result = validateSeoReleaseManifest(validManifest());
  assert.equal(result.batchId, '2026-10-wave-01');
  assert.equal(result.programmes[0].courseId, 'TT0002');
  assert.equal(result.reviewedAt, '2026-10-08T04:30:00.000Z');
});

test('rejects an unapproved programme', () => {
  const manifest = validManifest();
  manifest.programmes[0].approved = false;
  assert.throws(() => validateSeoReleaseManifest(manifest), /approved set to true/);
});

test('rejects duplicate programme IDs', () => {
  const manifest = validManifest();
  manifest.programmes.push({ ...manifest.programmes[0] });
  assert.throws(() => validateSeoReleaseManifest(manifest), /appears more than once/);
});

test('rejects non-HTTPS evidence links', () => {
  const manifest = validManifest();
  manifest.programmes[0].sourceUrl = 'http://example.com/source';
  assert.throws(() => validateSeoReleaseManifest(manifest), /must use HTTPS/);
});
