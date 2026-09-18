BEGIN;

ALTER TABLE catalogue.categories
  DROP CONSTRAINT categories_code_check,
  DROP CONSTRAINT categories_prefix_check;

ALTER TABLE catalogue.categories
  ALTER COLUMN id_prefix TYPE varchar(4);

ALTER TABLE catalogue.categories
  ADD CONSTRAINT categories_code_check
    CHECK (code IN ('role-based', 'people-process', 'tools-technology', 'certifications')),
  ADD CONSTRAINT categories_prefix_check
    CHECK (id_prefix IN ('RB', 'PP', 'TT', 'CF'));

INSERT INTO catalogue.categories (code, display_name, id_prefix, display_order)
VALUES ('certifications', 'Certification Programme', 'CF', 4)
ON CONFLICT (code) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  id_prefix = EXCLUDED.id_prefix,
  display_order = EXCLUDED.display_order,
  is_active = true;

INSERT INTO catalogue.proficiency_levels (code, display_order)
VALUES ('Beginner', 0)
ON CONFLICT (code) DO NOTHING;

ALTER TABLE catalogue.courses
  DROP CONSTRAINT courses_id_shape_check;

ALTER TABLE catalogue.courses
  ADD CONSTRAINT courses_id_shape_check CHECK (
    course_id ~ '^(RB|PP|TT)[0-9]{4,}$'
    OR (course_id ~ '^[A-Z0-9]{2,12}-[A-Z0-9][A-Z0-9-]{1,30}$' AND course_id ~ '[0-9]')
  );

CREATE TABLE catalogue.certification_details (
  course_id varchar(24) PRIMARY KEY REFERENCES catalogue.courses(course_id) ON DELETE CASCADE,
  provider text NOT NULL,
  course_code text NOT NULL,
  course_url text,
  source_sequence integer,
  product_technologies text[] NOT NULL DEFAULT ARRAY[]::text[],
  roles text[] NOT NULL DEFAULT ARRAY[]::text[],
  subjects text[] NOT NULL DEFAULT ARRAY[]::text[],
  language_codes text[] NOT NULL DEFAULT ARRAY[]::text[],
  certification_information text,
  instructor_led_information text,
  self_paced_information text,
  additional_information text,
  CONSTRAINT certification_provider_check CHECK (btrim(provider) <> ''),
  CONSTRAINT certification_code_check CHECK (btrim(course_code) <> ''),
  UNIQUE (provider, course_code)
);

ALTER TABLE catalogue.course_modules
  ADD COLUMN description text,
  ADD COLUMN learning_path_title text,
  ADD COLUMN learning_path_description text;

ALTER TYPE catalogue.learning_item_type ADD VALUE IF NOT EXISTS 'learning_objective';
ALTER TYPE catalogue.learning_item_type ADD VALUE IF NOT EXISTS 'topic';
ALTER TYPE catalogue.learning_item_type ADD VALUE IF NOT EXISTS 'lab';

CREATE INDEX certification_provider_idx
  ON catalogue.certification_details (provider);
CREATE INDEX certification_course_code_idx
  ON catalogue.certification_details (course_code);

CREATE OR REPLACE FUNCTION catalogue.validate_course_id_prefix()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  expected_prefix text;
BEGIN
  IF NEW.category_code = 'certifications' THEN
    IF NEW.course_id !~ '^[A-Z0-9]{2,12}-[A-Z0-9][A-Z0-9-]{1,30}$' OR NEW.course_id !~ '[0-9]' THEN
      RAISE EXCEPTION 'Certification Course ID % is not a valid provider course code', NEW.course_id;
    END IF;
    RETURN NEW;
  END IF;

  SELECT id_prefix
  INTO expected_prefix
  FROM catalogue.categories
  WHERE code = NEW.category_code;

  IF expected_prefix IS NULL OR NEW.course_id !~ ('^' || expected_prefix || '[0-9]{4,}$') THEN
    RAISE EXCEPTION 'Course ID % does not match category % prefix %',
      NEW.course_id, NEW.category_code, expected_prefix;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION catalogue.validate_extension_category()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  actual_category text;
  expected_category text;
BEGIN
  expected_category := CASE TG_TABLE_NAME
    WHEN 'role_based_details' THEN 'role-based'
    WHEN 'people_process_details' THEN 'people-process'
    WHEN 'tools_technology_details' THEN 'tools-technology'
    WHEN 'certification_details' THEN 'certifications'
  END;

  SELECT category_code
  INTO actual_category
  FROM catalogue.courses
  WHERE course_id = NEW.course_id;

  IF actual_category IS DISTINCT FROM expected_category THEN
    RAISE EXCEPTION 'Course % belongs to %, not %',
      NEW.course_id, actual_category, expected_category;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER certification_details_validate_category
BEFORE INSERT OR UPDATE ON catalogue.certification_details
FOR EACH ROW EXECUTE FUNCTION catalogue.validate_extension_category();

DROP VIEW catalogue.course_catalogue_view;

CREATE VIEW catalogue.course_catalogue_view AS
SELECT
  c.course_id,
  c.category_code,
  cat.display_name AS category_name,
  c.title,
  c.level_code,
  c.duration_minutes,
  c.format,
  c.delivery,
  c.approach,
  c.summary,
  c.objective,
  c.image_url,
  c.status,
  c.published_at,
  rb.industry,
  rb.department,
  rb.function_name,
  rb.role_title,
  pp.topic_category,
  pp.sub_type,
  pp.portfolio,
  tt.tool_name,
  tt.vendor,
  tt.tool_logo_url,
  tt.skill_area,
  cert.provider AS certification_provider,
  cert.course_code AS certification_code,
  cert.course_url AS certification_url,
  cert.source_sequence,
  cert.product_technologies,
  cert.roles AS certification_roles,
  cert.subjects AS certification_subjects,
  cert.language_codes,
  cert.certification_information,
  cert.instructor_led_information,
  cert.self_paced_information,
  cert.additional_information,
  COALESCE(
    (SELECT array_agg(crs.skill ORDER BY crs.display_order)
     FROM catalogue.course_related_skills crs
     WHERE crs.course_id = c.course_id),
    ARRAY[]::text[]
  ) AS related_skills,
  COALESCE(
    (SELECT array_agg(ct.tool_name ORDER BY ct.display_order)
     FROM catalogue.course_tools ct
     WHERE ct.course_id = c.course_id),
    ARRAY[]::text[]
  ) AS tools_covered,
  COALESCE(
    (SELECT array_agg(ctc.category_name ORDER BY ctc.display_order)
     FROM catalogue.course_technology_categories ctc
     WHERE ctc.course_id = c.course_id),
    ARRAY[]::text[]
  ) AS technology_categories
FROM catalogue.courses c
JOIN catalogue.categories cat ON cat.code = c.category_code
LEFT JOIN catalogue.role_based_details rb ON rb.course_id = c.course_id
LEFT JOIN catalogue.people_process_details pp ON pp.course_id = c.course_id
LEFT JOIN catalogue.tools_technology_details tt ON tt.course_id = c.course_id
LEFT JOIN catalogue.certification_details cert ON cert.course_id = c.course_id;

INSERT INTO catalogue.schema_migrations (version)
VALUES ('003_certifications');

COMMIT;
