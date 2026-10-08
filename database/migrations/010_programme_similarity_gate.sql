BEGIN;

ALTER TABLE catalogue.courses
  ADD COLUMN IF NOT EXISTS seo_quality_report jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS courses_summary_trgm_idx
  ON catalogue.courses USING gin (summary gin_trgm_ops)
  WHERE status = 'published' AND summary IS NOT NULL;

SET LOCAL pg_trgm.similarity_threshold = 0.90;

WITH duplicate_pairs AS (
  SELECT lhs.course_id AS lhs_id, rhs.course_id AS rhs_id
  FROM catalogue.courses lhs
  JOIN LATERAL (
    SELECT candidate.course_id
    FROM catalogue.courses candidate
    WHERE candidate.status = 'published'
      AND candidate.course_id > lhs.course_id
      AND char_length(btrim(COALESCE(candidate.summary, ''))) >= 100
      AND candidate.summary % lhs.summary
      AND similarity(candidate.summary, lhs.summary) >= 0.90
  ) rhs ON true
  WHERE lhs.status = 'published'
    AND lhs.seo_indexable = true
    AND char_length(btrim(COALESCE(lhs.summary, ''))) >= 100
), affected AS (
  SELECT lhs_id AS course_id FROM duplicate_pairs
  UNION
  SELECT rhs_id AS course_id FROM duplicate_pairs
)
UPDATE catalogue.courses course
SET seo_indexable = false,
    seo_quality_report = jsonb_build_object(
      'gateVersion', 2,
      'status', 'remediation-required',
      'reason', 'summary-similarity-at-or-above-90-percent'
    )
FROM affected
WHERE course.course_id = affected.course_id;

UPDATE catalogue.courses
SET seo_quality_report = jsonb_build_object('gateVersion', 2, 'status', 'approved')
WHERE status = 'published'
  AND seo_indexable = true
  AND seo_quality_report = '{}'::jsonb;

UPDATE catalogue.courses
SET seo_quality_report = jsonb_build_object('gateVersion', 2, 'status', 'remediation-required')
WHERE status = 'published'
  AND seo_indexable = false
  AND seo_quality_report = '{}'::jsonb;

INSERT INTO catalogue.schema_migrations (version)
VALUES ('010_programme_similarity_gate');

COMMIT;
