import 'dotenv/config';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { closePool, getPool } from '../server/database.mjs';
import { validateSeoReleaseManifest } from './lib/seo-release-manifest.mjs';

const argumentsList = process.argv.slice(2);
const apply = argumentsList.includes('--apply');
const manifestArgument = argumentsList.find((value) => value !== '--apply');
if (!manifestArgument) {
  throw new Error('Usage: npm run seo:release -- <manifest.json> [--apply]');
}

const manifestPath = path.resolve(manifestArgument);
const manifest = validateSeoReleaseManifest(JSON.parse(await readFile(manifestPath, 'utf8')));
if (apply && process.env.SEO_RELEASE_CONFIRM !== manifest.batchId) {
  throw new Error(`Set SEO_RELEASE_CONFIRM=${manifest.batchId} before using --apply.`);
}

const pool = getPool();
const client = await pool.connect();
const results = [];

try {
  await client.query('BEGIN');
  await client.query('SELECT set_limit(0.90)');

  for (const programme of manifest.programmes) {
    const qualityResult = await client.query(`
      SELECT
        c.course_id,
        c.category_code,
        c.seo_indexable,
        ARRAY_REMOVE(ARRAY[
          CASE WHEN c.status <> 'published' THEN 'not-published' END,
          CASE WHEN char_length(btrim(c.title)) < 8 THEN 'title' END,
          CASE WHEN char_length(btrim(COALESCE(c.summary, ''))) < 100 THEN 'summary' END,
          CASE WHEN c.category_code IN ('role-based', 'tools-technology', 'technical-training') AND COALESCE(c.duration_minutes, 0) <= 0 THEN 'duration' END,
          CASE WHEN c.category_code IN ('role-based', 'tools-technology', 'technical-training') AND nullif(btrim(COALESCE(c.delivery, c.format, '')), '') IS NULL THEN 'delivery' END,
          CASE WHEN c.category_code IN ('role-based', 'tools-technology', 'technical-training') AND (SELECT count(*) FROM catalogue.course_objectives item WHERE item.course_id = c.course_id) < 3 THEN 'outcomes' END,
          CASE WHEN c.category_code IN ('role-based', 'tools-technology', 'technical-training') AND NOT EXISTS (SELECT 1 FROM catalogue.course_audiences item WHERE item.course_id = c.course_id) THEN 'audience' END,
          CASE WHEN c.category_code IN ('role-based', 'tools-technology', 'technical-training') AND NOT EXISTS (SELECT 1 FROM catalogue.course_modules item WHERE item.course_id = c.course_id) THEN 'modules' END,
          CASE WHEN c.category_code IN ('role-based', 'tools-technology', 'technical-training')
            AND NOT EXISTS (SELECT 1 FROM catalogue.course_scenarios item WHERE item.course_id = c.course_id)
            AND NOT EXISTS (
              SELECT 1 FROM catalogue.course_modules module
              JOIN catalogue.module_learning_outcomes outcome ON outcome.module_id = module.id
              WHERE module.course_id = c.course_id AND outcome.outcome_type IN ('practical_activity', 'lab')
            ) THEN 'practical_application' END,
          CASE WHEN c.category_code = 'certifications' AND NOT EXISTS (
            SELECT 1 FROM catalogue.certification_details cert
            WHERE cert.course_id = c.course_id AND nullif(btrim(cert.provider), '') IS NOT NULL
          ) THEN 'provider' END,
          CASE WHEN c.category_code = 'certifications' AND NOT EXISTS (
            SELECT 1 FROM catalogue.certification_details cert
            WHERE cert.course_id = c.course_id
              AND (nullif(btrim(COALESCE(cert.course_url, '')), '') IS NOT NULL OR nullif(btrim(COALESCE(cert.credential_status, '')), '') IS NOT NULL)
          ) THEN 'official_source_or_status' END,
          CASE WHEN c.category_code = 'certifications'
            AND NOT EXISTS (SELECT 1 FROM catalogue.certification_exams item WHERE item.course_id = c.course_id)
            AND NOT EXISTS (SELECT 1 FROM catalogue.certification_objectives item WHERE item.course_id = c.course_id)
            AND NOT EXISTS (SELECT 1 FROM catalogue.certification_requirements item WHERE item.course_id = c.course_id)
            AND NOT EXISTS (SELECT 1 FROM catalogue.certification_training_resources item WHERE item.course_id = c.course_id)
            AND NOT EXISTS (SELECT 1 FROM catalogue.certification_lifecycle_items item WHERE item.course_id = c.course_id)
            THEN 'credential_details' END,
          CASE WHEN EXISTS (
            SELECT 1 FROM catalogue.courses duplicate
            WHERE duplicate.course_id <> c.course_id AND duplicate.status = 'published'
              AND lower(regexp_replace(duplicate.title, '[^a-zA-Z0-9]+', '', 'g')) = lower(regexp_replace(c.title, '[^a-zA-Z0-9]+', '', 'g'))
          ) THEN 'duplicate_title' END,
          CASE WHEN char_length(btrim(COALESCE(c.summary, ''))) >= 100 AND EXISTS (
            SELECT 1 FROM catalogue.courses duplicate
            WHERE duplicate.course_id <> c.course_id AND duplicate.status = 'published'
              AND char_length(btrim(COALESCE(duplicate.summary, ''))) >= 100
              AND duplicate.summary % c.summary AND similarity(duplicate.summary, c.summary) >= 0.90
          ) THEN 'summary-similarity-at-or-above-90-percent' END
        ], NULL) AS blockers
      FROM catalogue.courses c
      WHERE c.course_id = $1
    `, [programme.courseId]);

    const row = qualityResult.rows[0];
    if (!row) throw new Error(`${programme.courseId} does not exist.`);
    if (row.seo_indexable) throw new Error(`${programme.courseId} is already indexable.`);
    if (row.blockers.length) throw new Error(`${programme.courseId} failed the release gate: ${row.blockers.join(', ')}.`);

    await client.query(`
      UPDATE catalogue.courses
      SET seo_indexable = true,
          seo_title = COALESCE($2, seo_title),
          seo_description = COALESCE($3, seo_description),
          seo_reviewed_at = $4::timestamptz,
          seo_reviewed_by = $5,
          seo_quality_report = jsonb_build_object(
            'gateVersion', 3,
            'status', 'approved',
            'batchId', $6,
            'sourceReviewed', true
          )
      WHERE course_id = $1
    `, [programme.courseId, programme.seoTitle, programme.seoDescription, manifest.reviewedAt, manifest.reviewedBy, manifest.batchId]);
    results.push({ courseId: programme.courseId, category: row.category_code, status: 'approved' });
  }

  if (apply) await client.query('COMMIT');
  else await client.query('ROLLBACK');

  console.log(JSON.stringify({
    mode: apply ? 'applied' : 'dry-run',
    batchId: manifest.batchId,
    reviewedBy: manifest.reviewedBy,
    programmes: results,
  }, null, 2));
  if (!apply) console.log('Dry run complete. No database changes were committed.');
} catch (error) {
  await client.query('ROLLBACK').catch(() => {});
  throw error;
} finally {
  client.release();
  await closePool();
}
