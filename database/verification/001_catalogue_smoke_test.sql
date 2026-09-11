BEGIN;

INSERT INTO catalogue.courses (
  course_id,
  category_code,
  title,
  level_code,
  duration_minutes,
  delivery,
  summary,
  status,
  published_at
)
VALUES (
  'RB999999',
  'role-based',
  'Database Foundation Smoke Test',
  'Basic',
  240,
  'Instructor-Led',
  'Temporary record used to verify the catalogue schema.',
  'published',
  now()
);

INSERT INTO catalogue.role_based_details (
  course_id,
  industry,
  department,
  function_name,
  role_title
)
VALUES (
  'RB999999',
  'Technology & Communications',
  'Information Technology',
  'Platform Engineering',
  'Platform Engineer'
);

INSERT INTO catalogue.course_related_skills (course_id, skill, display_order)
VALUES
  ('RB999999', 'PostgreSQL', 1),
  ('RB999999', 'Data Validation', 2);

INSERT INTO catalogue.course_modules (
  course_id,
  module_code,
  title,
  display_order
)
VALUES ('RB999999', '01', 'Foundation verification', 1);

INSERT INTO catalogue.module_learning_outcomes (module_id, outcome_type, outcome, display_order)
SELECT id, 'concept', 'Confirm that related course content can be inserted and retrieved.', 1
FROM catalogue.course_modules
WHERE course_id = 'RB999999' AND module_code = '01';

DO $$
DECLARE
  returned_title text;
  returned_skill_count integer;
BEGIN
  SELECT title, cardinality(related_skills)
  INTO returned_title, returned_skill_count
  FROM catalogue.course_catalogue_view
  WHERE course_id = 'RB999999';

  IF returned_title IS DISTINCT FROM 'Database Foundation Smoke Test' THEN
    RAISE EXCEPTION 'Smoke test failed: course could not be retrieved';
  END IF;

  IF returned_skill_count <> 2 THEN
    RAISE EXCEPTION 'Smoke test failed: expected 2 skills, received %', returned_skill_count;
  END IF;
END;
$$;

SELECT
  course_id,
  category_code,
  title,
  level_code,
  duration_minutes,
  industry,
  department,
  related_skills
FROM catalogue.course_catalogue_view
WHERE course_id = 'RB999999';

ROLLBACK;
