BEGIN;

ALTER TABLE catalogue.courses
  ADD COLUMN seo_indexable boolean NOT NULL DEFAULT false,
  ADD COLUMN seo_title text,
  ADD COLUMN seo_description text,
  ADD COLUMN seo_reviewed_at timestamptz,
  ADD COLUMN seo_reviewed_by text,
  ADD COLUMN seo_quality_report jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE catalogue.courses
  ADD CONSTRAINT courses_seo_title_length_check
    CHECK (seo_title IS NULL OR char_length(btrim(seo_title)) BETWEEN 20 AND 70),
  ADD CONSTRAINT courses_seo_description_length_check
    CHECK (seo_description IS NULL OR char_length(btrim(seo_description)) BETWEEN 50 AND 170),
  ADD CONSTRAINT courses_seo_review_check
    CHECK (
      seo_indexable = false
      OR (seo_reviewed_at IS NOT NULL AND nullif(btrim(seo_reviewed_by), '') IS NOT NULL)
    );

CREATE INDEX courses_seo_indexable_idx
  ON catalogue.courses (seo_indexable, category_code, course_id)
  WHERE status = 'published';

-- Release wave one: data-complete records only. Records with duplicate titles or
-- summaries remain noindex until an editor resolves the duplication.
UPDATE catalogue.courses c
SET seo_indexable = true,
    seo_reviewed_at = now(),
    seo_reviewed_by = 'automated-quality-gate-v1',
    seo_quality_report = jsonb_build_object('gateVersion', 1, 'status', 'approved')
WHERE c.status = 'published'
  AND char_length(btrim(c.title)) >= 8
  AND char_length(btrim(COALESCE(c.summary, ''))) >= 100
  AND NOT EXISTS (
    SELECT 1
    FROM catalogue.courses duplicate
    WHERE duplicate.course_id <> c.course_id
      AND duplicate.status = 'published'
      AND lower(regexp_replace(duplicate.title, '[^a-zA-Z0-9]+', '', 'g'))
          = lower(regexp_replace(c.title, '[^a-zA-Z0-9]+', '', 'g'))
  )
  AND NOT EXISTS (
    SELECT 1
    FROM catalogue.courses duplicate
    WHERE duplicate.course_id <> c.course_id
      AND duplicate.status = 'published'
      AND char_length(btrim(COALESCE(duplicate.summary, ''))) >= 100
      AND lower(regexp_replace(duplicate.summary, '\\s+', ' ', 'g'))
          = lower(regexp_replace(c.summary, '\\s+', ' ', 'g'))
  )
  AND (
    (
      c.category_code IN ('role-based', 'tools-technology', 'technical-training')
      AND c.duration_minutes > 0
      AND nullif(btrim(COALESCE(c.delivery, c.format, '')), '') IS NOT NULL
      AND (SELECT count(*) FROM catalogue.course_objectives objective WHERE objective.course_id = c.course_id) >= 3
      AND EXISTS (SELECT 1 FROM catalogue.course_audiences audience WHERE audience.course_id = c.course_id)
      AND EXISTS (SELECT 1 FROM catalogue.course_modules module WHERE module.course_id = c.course_id)
      AND (
        EXISTS (SELECT 1 FROM catalogue.course_scenarios scenario WHERE scenario.course_id = c.course_id)
        OR EXISTS (
          SELECT 1
          FROM catalogue.course_modules module
          JOIN catalogue.module_learning_outcomes outcome ON outcome.module_id = module.id
          WHERE module.course_id = c.course_id
            AND outcome.outcome_type IN ('practical_activity', 'lab')
        )
      )
    )
    OR (
      c.category_code = 'certifications'
      AND EXISTS (
        SELECT 1
        FROM catalogue.certification_details cert
        WHERE cert.course_id = c.course_id
          AND nullif(btrim(cert.provider), '') IS NOT NULL
          AND (
            nullif(btrim(COALESCE(cert.course_url, '')), '') IS NOT NULL
            OR nullif(btrim(COALESCE(cert.credential_status, '')), '') IS NOT NULL
          )
      )
      AND (
        EXISTS (SELECT 1 FROM catalogue.certification_exams exam WHERE exam.course_id = c.course_id)
        OR EXISTS (SELECT 1 FROM catalogue.certification_objectives objective WHERE objective.course_id = c.course_id)
        OR EXISTS (SELECT 1 FROM catalogue.certification_requirements requirement WHERE requirement.course_id = c.course_id)
        OR EXISTS (SELECT 1 FROM catalogue.certification_training_resources resource WHERE resource.course_id = c.course_id)
        OR EXISTS (SELECT 1 FROM catalogue.certification_lifecycle_items lifecycle WHERE lifecycle.course_id = c.course_id)
      )
    )
  );

UPDATE catalogue.courses
SET seo_quality_report = jsonb_build_object('gateVersion', 1, 'status', 'remediation-required')
WHERE status = 'published' AND seo_indexable = false;

INSERT INTO catalogue.schema_migrations (version)
VALUES ('009_programme_seo_controls');

COMMIT;
