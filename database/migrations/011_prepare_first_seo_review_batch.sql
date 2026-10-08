BEGIN;

-- Distinguish credential exams from similarly named training courses.
UPDATE catalogue.courses
SET title = CASE course_id
  WHEN 'CER0118' THEN 'GitHub Advanced Security Certification Exam'
  WHEN 'CER0120' THEN 'GitHub Copilot Certification Exam'
  WHEN 'CER0121' THEN 'GitHub Foundations Certification Exam'
END,
updated_at = now()
WHERE course_id IN ('CER0118', 'CER0120', 'CER0121')
  AND status = 'published'
  AND seo_indexable = false;

-- These role-based records are separate learning levels, not duplicate pages.
-- Preserve the approved catalogue wording and expose the existing level and
-- duration in the H1 so each programme has a distinct user intent.
UPDATE catalogue.courses
SET title = concat(
      title,
      ' — ',
      level_code,
      ' Programme (',
      CASE
        WHEN duration_minutes % 60 = 0 THEN (duration_minutes / 60)::text || ' Hours'
        ELSE duration_minutes::text || ' Minutes'
      END,
      ')'
    ),
    updated_at = now()
WHERE course_id IN (
  'RB0419', 'RB0420',
  'RB0516', 'RB0517',
  'RB0551', 'RB0552',
  'RB0577', 'RB0578',
  'RB0784', 'RB0825',
  'RB0829', 'RB0831',
  'RB0838', 'RB0849',
  'RB1014', 'RB1015',
  'RB1018', 'RB1019',
  'RB1033', 'RB1034',
  'RB1048', 'RB1049'
)
  AND status = 'published'
  AND seo_indexable = false
  AND title NOT LIKE '% Programme (% Hours)';

INSERT INTO catalogue.schema_migrations (version)
VALUES ('011_prepare_first_seo_review_batch');

COMMIT;
