BEGIN;

ALTER TABLE catalogue.categories
  DROP CONSTRAINT categories_code_check,
  DROP CONSTRAINT categories_prefix_check;

ALTER TABLE catalogue.categories
  ADD CONSTRAINT categories_code_check
    CHECK (code IN ('role-based', 'people-process', 'tools-technology', 'certifications', 'technical-training')),
  ADD CONSTRAINT categories_prefix_check
    CHECK (id_prefix IN ('RB', 'PP', 'TT', 'CF', 'TC'));

INSERT INTO catalogue.categories (code, display_name, id_prefix, display_order)
VALUES ('technical-training', 'Tools & Technology Programme', 'TC', 5)
ON CONFLICT (code) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  id_prefix = EXCLUDED.id_prefix,
  display_order = EXCLUDED.display_order,
  is_active = true;

ALTER TABLE catalogue.courses
  DROP CONSTRAINT courses_id_shape_check;

ALTER TABLE catalogue.courses
  ADD CONSTRAINT courses_id_shape_check CHECK (
    course_id ~ '^(RB|PP|TT|TC)[0-9]{4,}$'
    OR (course_id ~ '^[A-Z0-9]{2,12}-[A-Z0-9][A-Z0-9-]{1,30}$' AND course_id ~ '[0-9]')
  );

CREATE TABLE catalogue.technical_training_details (
  course_id varchar(24) PRIMARY KEY REFERENCES catalogue.courses(course_id) ON DELETE CASCADE,
  domain text NOT NULL,
  primary_technology text NOT NULL,
  vendor text,
  source_course_id varchar(24) NOT NULL,
  source_duration text,
  source_pdf text,
  CONSTRAINT technical_training_domain_check CHECK (btrim(domain) <> ''),
  CONSTRAINT technical_training_technology_check CHECK (btrim(primary_technology) <> ''),
  CONSTRAINT technical_training_source_id_check CHECK (btrim(source_course_id) <> ''),
  UNIQUE (source_course_id)
);

CREATE INDEX technical_training_domain_idx
  ON catalogue.technical_training_details (domain);
CREATE INDEX technical_training_technology_idx
  ON catalogue.technical_training_details (primary_technology);

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
    WHEN 'technical_training_details' THEN 'technical-training'
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

CREATE TRIGGER technical_training_details_validate_category
BEFORE INSERT OR UPDATE ON catalogue.technical_training_details
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
  tech.domain AS technical_domain,
  tech.primary_technology,
  tech.vendor AS technical_vendor,
  tech.source_course_id,
  tech.source_duration,
  tech.source_pdf,
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
LEFT JOIN catalogue.technical_training_details tech ON tech.course_id = c.course_id
LEFT JOIN catalogue.certification_details cert ON cert.course_id = c.course_id;

INSERT INTO catalogue.schema_migrations (version)
VALUES ('004_technical_training');

COMMIT;
