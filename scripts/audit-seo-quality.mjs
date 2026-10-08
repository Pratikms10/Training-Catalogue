import 'dotenv/config';

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { closePool, getPool } from '../server/database.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportDirectory = path.join(projectRoot, 'artifacts', 'seo');
const reportPath = path.join(reportDirectory, 'programme-quality-report.json');

const pool = getPool();
const client = await pool.connect();

try {
  await client.query('SELECT set_limit(0.90)');
  const summaryResult = await client.query(`
    SELECT
      category_code,
      count(*)::integer AS published,
      count(*) FILTER (WHERE seo_indexable)::integer AS indexable,
      count(*) FILTER (WHERE NOT seo_indexable)::integer AS remediation
    FROM catalogue.courses
    WHERE status = 'published'
    GROUP BY category_code
    ORDER BY category_code
  `);

  const qualityRowsResult = await client.query(`
    WITH published_courses AS (
      SELECT
        source.*,
        count(*) OVER (
          PARTITION BY lower(regexp_replace(source.title, '[^a-zA-Z0-9]+', '', 'g'))
        ) AS normalized_title_count
      FROM catalogue.courses source
      WHERE source.status = 'published'
    )
    SELECT
      c.course_id,
      c.category_code,
      c.title,
      c.seo_indexable,
      c.seo_reviewed_at,
      c.seo_reviewed_by,
      c.seo_quality_report,
      ARRAY_REMOVE(ARRAY[
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
            SELECT 1
            FROM catalogue.course_modules module
            JOIN catalogue.module_learning_outcomes outcome ON outcome.module_id = module.id
            WHERE module.course_id = c.course_id
              AND outcome.outcome_type IN ('practical_activity', 'lab')
          ) THEN 'practical_application' END,
        CASE WHEN c.category_code = 'certifications' AND NOT EXISTS (
          SELECT 1 FROM catalogue.certification_details cert
          WHERE cert.course_id = c.course_id AND nullif(btrim(cert.provider), '') IS NOT NULL
        ) THEN 'provider' END,
        CASE WHEN c.category_code = 'certifications' AND NOT EXISTS (
          SELECT 1 FROM catalogue.certification_details cert
          WHERE cert.course_id = c.course_id
            AND (
              nullif(btrim(COALESCE(cert.course_url, '')), '') IS NOT NULL
              OR nullif(btrim(COALESCE(cert.credential_status, '')), '') IS NOT NULL
            )
        ) THEN 'official_source_or_status' END,
        CASE WHEN c.category_code = 'certifications'
          AND NOT EXISTS (SELECT 1 FROM catalogue.certification_exams item WHERE item.course_id = c.course_id)
          AND NOT EXISTS (SELECT 1 FROM catalogue.certification_objectives item WHERE item.course_id = c.course_id)
          AND NOT EXISTS (SELECT 1 FROM catalogue.certification_requirements item WHERE item.course_id = c.course_id)
          AND NOT EXISTS (SELECT 1 FROM catalogue.certification_training_resources item WHERE item.course_id = c.course_id)
          AND NOT EXISTS (SELECT 1 FROM catalogue.certification_lifecycle_items item WHERE item.course_id = c.course_id)
          THEN 'credential_details' END
        ,CASE WHEN c.normalized_title_count > 1 THEN 'duplicate_title' END
        ,CASE WHEN char_length(btrim(COALESCE(c.summary, ''))) >= 100 AND EXISTS (
          SELECT 1 FROM catalogue.courses duplicate
          WHERE duplicate.course_id <> c.course_id
            AND duplicate.status = 'published'
            AND char_length(btrim(COALESCE(duplicate.summary, ''))) >= 100
            AND duplicate.summary % c.summary
            AND similarity(duplicate.summary, c.summary) >= 0.90
        ) THEN 'summary-similarity-at-or-above-90-percent' END
      ], NULL) AS content_failures,
      ARRAY_REMOVE(ARRAY[
        CASE WHEN c.seo_reviewed_at IS NULL THEN 'reviewed_at' END,
        CASE WHEN nullif(btrim(COALESCE(c.seo_reviewed_by, '')), '') IS NULL THEN 'reviewed_by' END
      ], NULL) AS review_failures
    FROM published_courses c
    ORDER BY c.category_code, c.course_id
  `);

  const duplicateResult = await client.query(`
    WITH normalized_titles AS (
      SELECT course_id, lower(regexp_replace(title, '[^a-zA-Z0-9]+', '', 'g')) AS normalized_title
      FROM catalogue.courses
      WHERE status = 'published' AND seo_indexable
    ), duplicate_titles AS (
      SELECT lhs.course_id AS left_id, rhs.course_id AS right_id, 'title'::text AS duplicate_field
      FROM normalized_titles lhs
      JOIN normalized_titles rhs
        ON lhs.course_id < rhs.course_id AND lhs.normalized_title = rhs.normalized_title
    ), duplicate_summaries AS (
      SELECT lhs.course_id AS left_id, rhs.course_id AS right_id, 'summary_similarity'::text AS duplicate_field
      FROM catalogue.courses lhs
      JOIN LATERAL (
        SELECT candidate.course_id
        FROM catalogue.courses candidate
        WHERE candidate.status = 'published'
          AND candidate.seo_indexable = true
          AND candidate.course_id > lhs.course_id
          AND char_length(btrim(COALESCE(candidate.summary, ''))) >= 100
          AND candidate.summary % lhs.summary
          AND similarity(candidate.summary, lhs.summary) >= 0.90
      ) rhs ON true
      WHERE lhs.status = 'published'
        AND lhs.seo_indexable = true
        AND char_length(btrim(COALESCE(lhs.summary, ''))) >= 100
    )
    SELECT * FROM duplicate_titles
    UNION ALL
    SELECT * FROM duplicate_summaries
    ORDER BY left_id, right_id
  `);

  const invalid = qualityRowsResult.rows
    .filter((row) => row.seo_indexable && (row.content_failures.length || row.review_failures.length))
    .map((row) => ({
      course_id: row.course_id,
      category_code: row.category_code,
      failures: [...row.content_failures, ...row.review_failures],
    }));
  const remediationProgrammes = qualityRowsResult.rows
    .filter((row) => !row.seo_indexable)
    .map((row) => {
      const storedReason = row.seo_quality_report?.reason;
      const blockers = [...row.content_failures];
      if (storedReason && !blockers.includes(storedReason)) blockers.push(storedReason);
      return {
        course_id: row.course_id,
        category_code: row.category_code,
        title: row.title,
        blockers,
        ready_for_editorial_review: blockers.length === 0,
        seo_quality_report: row.seo_quality_report,
      };
    });
  const blockerSummary = Object.entries(remediationProgrammes.reduce((counts, programme) => {
    for (const blocker of programme.blockers.length ? programme.blockers : ['editorial-review']) {
      counts[blocker] = (counts[blocker] || 0) + 1;
    }
    return counts;
  }, {}))
    .map(([blocker, count]) => ({ blocker, count }))
    .sort((left, right) => right.count - left.count || left.blocker.localeCompare(right.blocker));
  const readyForEditorialReview = remediationProgrammes
    .filter((programme) => programme.ready_for_editorial_review)
    .map((programme) => ({
      course_id: programme.course_id,
      category_code: programme.category_code,
      title: programme.title,
    }));
  const report = {
    generatedAt: new Date().toISOString(),
    gateVersion: 2,
    summary: summaryResult.rows,
    releaseReadiness: {
      readyForEditorialReview: readyForEditorialReview.length,
      contentRemediationRequired: remediationProgrammes.length - readyForEditorialReview.length,
    },
    blockerSummary,
    readyForEditorialReview,
    invalidIndexableProgrammes: invalid,
    duplicateIndexablePairs: duplicateResult.rows,
    remediationProgrammes,
  };

  await mkdir(reportDirectory, { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  const approved = summaryResult.rows.reduce((total, row) => total + row.indexable, 0);
  const remediation = summaryResult.rows.reduce((total, row) => total + row.remediation, 0);
  console.log(`Programme SEO quality gate: ${approved} approved; ${remediation} held for remediation.`);
  console.log(`Quality report: ${reportPath}`);

  if (invalid.length || duplicateResult.rowCount) {
    throw new Error(`SEO quality validation failed: ${invalid.length} invalid approved records and ${duplicateResult.rowCount} duplicate approved pairs.`);
  }
} finally {
  client.release();
  await closePool();
}
