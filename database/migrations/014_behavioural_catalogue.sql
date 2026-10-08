BEGIN;

-- Behavioural programmes are maintained as their own public catalogue track.
-- They share the people/process detail model, but retain BS IDs and cannot be
-- mixed with Process programme records.
ALTER TABLE catalogue.categories
  DROP CONSTRAINT IF EXISTS categories_code_check;

ALTER TABLE catalogue.categories
  ADD CONSTRAINT categories_code_check
    CHECK (code IN (
      'role-based',
      'people-process',
      'people-behavioural',
      'tools-technology',
      'certifications',
      'technical-training'
    ));

ALTER TABLE catalogue.categories
  DROP CONSTRAINT IF EXISTS categories_prefix_check;

ALTER TABLE catalogue.categories
  ADD CONSTRAINT categories_prefix_check
    CHECK (id_prefix IN ('RB', 'PP', 'PI', 'BS', 'TT', 'CF', 'TC', 'CER'));

INSERT INTO catalogue.categories (code, display_name, id_prefix, display_order)
VALUES ('people-behavioural', 'People & Behavioural', 'BS', 6)
ON CONFLICT (code) DO UPDATE
SET display_name = EXCLUDED.display_name,
    id_prefix = EXCLUDED.id_prefix,
    display_order = EXCLUDED.display_order;

ALTER TABLE catalogue.courses
  DROP CONSTRAINT IF EXISTS courses_id_shape_check;

ALTER TABLE catalogue.courses
  ADD CONSTRAINT courses_id_shape_check CHECK (
    course_id ~ '^(RB|PP|PI|BS|TT|TC|CER)[0-9]{4,}$'
    OR (course_id ~ '^[A-Z0-9]{2,12}-[A-Z0-9][A-Z0-9-]{1,30}$' AND course_id ~ '[0-9]')
  );

CREATE OR REPLACE FUNCTION catalogue.validate_extension_category()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  actual_category text;
  expected_category text;
BEGIN
  SELECT category_code
  INTO actual_category
  FROM catalogue.courses
  WHERE course_id = NEW.course_id;

  IF TG_TABLE_NAME = 'people_process_details' THEN
    IF actual_category NOT IN ('people-process', 'people-behavioural') THEN
      RAISE EXCEPTION 'Course % belongs to %, not a people/process catalogue track',
        NEW.course_id, actual_category;
    END IF;
    RETURN NEW;
  END IF;

  expected_category := CASE TG_TABLE_NAME
    WHEN 'role_based_details' THEN 'role-based'
    WHEN 'tools_technology_details' THEN 'tools-technology'
  END;

  IF actual_category IS DISTINCT FROM expected_category THEN
    RAISE EXCEPTION 'Course % belongs to %, not %',
      NEW.course_id, actual_category, expected_category;
  END IF;

  RETURN NEW;
END;
$$;

COMMIT;
