BEGIN;

-- Certifications use a TechnoEdge-owned public identifier. Provider codes remain
-- authoritative metadata in certification_details.course_code.
ALTER TABLE catalogue.categories
  DROP CONSTRAINT categories_prefix_check;

UPDATE catalogue.categories
SET id_prefix = 'CER', display_name = 'Certification Programme'
WHERE code = 'certifications';

ALTER TABLE catalogue.categories
  ADD CONSTRAINT categories_prefix_check
    CHECK (id_prefix IN ('RB', 'PP', 'TT', 'TC', 'CER'));

ALTER TABLE catalogue.courses
  DROP CONSTRAINT courses_id_shape_check;

ALTER TABLE catalogue.courses
  ADD CONSTRAINT courses_id_shape_check CHECK (
    course_id ~ '^(RB|PP|TT|TC|CER)[0-9]{4,}$'
    OR (course_id ~ '^[A-Z0-9]{2,12}-[A-Z0-9][A-Z0-9-]{1,30}$' AND course_id ~ '[0-9]')
  );

CREATE OR REPLACE FUNCTION catalogue.validate_course_id_prefix()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  expected_prefix text;
BEGIN
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

-- Optional provider examination code. The existing course_code column remains
-- the official provider training/course code (for example AB-100T00).
ALTER TABLE catalogue.certification_details
  ADD COLUMN exam_code text,
  ADD CONSTRAINT certification_exam_code_check
    CHECK (exam_code IS NULL OR btrim(exam_code) <> '');

CREATE TEMP TABLE certification_id_plan ON COMMIT DROP AS
WITH current_max AS (
  SELECT COALESCE(max(substring(course_id FROM 4)::integer), 0) AS value
  FROM catalogue.courses
  WHERE category_code = 'certifications'
    AND course_id ~ '^CER[0-9]{4,}$'
), legacy_certifications AS (
  SELECT
    c.course_id AS old_course_id,
    cert.provider,
    cert.course_code AS provider_course_code,
    cert.source_sequence,
    row_number() OVER (
      ORDER BY cert.provider, cert.source_sequence NULLS LAST, cert.course_code, c.course_id
    ) AS sequence_offset
  FROM catalogue.courses c
  JOIN catalogue.certification_details cert ON cert.course_id = c.course_id
  WHERE c.category_code = 'certifications'
    AND c.course_id !~ '^CER[0-9]{4,}$'
)
SELECT
  legacy.old_course_id,
  'CER' || lpad((current_max.value + legacy.sequence_offset)::text, 4, '0') AS new_course_id,
  legacy.provider,
  legacy.provider_course_code,
  legacy.source_sequence
FROM legacy_certifications legacy
CROSS JOIN current_max;

-- Clone the parent rows first so every child can move without disabling foreign keys.
INSERT INTO catalogue.courses (
  course_id, category_code, title, level_code, duration_minutes, format, delivery,
  approach, summary, objective, image_url, status, source_reference, published_at,
  created_at, updated_at
)
SELECT
  plan.new_course_id, c.category_code, c.title, c.level_code, c.duration_minutes,
  c.format, c.delivery, c.approach, c.summary, c.objective, c.image_url, c.status,
  c.source_reference, c.published_at, c.created_at, c.updated_at
FROM certification_id_plan plan
JOIN catalogue.courses c ON c.course_id = plan.old_course_id;

-- Permanent, auditable crosswalk for legacy URLs and rollback/reference work.
CREATE TABLE catalogue.certification_id_mappings (
  old_course_id varchar(64) PRIMARY KEY,
  new_course_id varchar(24) NOT NULL UNIQUE
    REFERENCES catalogue.courses(course_id) ON DELETE RESTRICT,
  provider text NOT NULL,
  provider_course_code text NOT NULL,
  source_sequence integer,
  migrated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT certification_id_mappings_old_check CHECK (btrim(old_course_id) <> ''),
  CONSTRAINT certification_id_mappings_new_check CHECK (new_course_id ~ '^CER[0-9]{4,}$'),
  UNIQUE (provider, provider_course_code)
);

INSERT INTO catalogue.certification_id_mappings (
  old_course_id, new_course_id, provider, provider_course_code, source_sequence
)
SELECT old_course_id, new_course_id, provider, provider_course_code, source_sequence
FROM certification_id_plan;

UPDATE catalogue.certification_details target
SET course_id = plan.new_course_id
FROM certification_id_plan plan
WHERE target.course_id = plan.old_course_id;

UPDATE catalogue.course_related_skills target
SET course_id = plan.new_course_id
FROM certification_id_plan plan
WHERE target.course_id = plan.old_course_id;

UPDATE catalogue.course_tools target
SET course_id = plan.new_course_id
FROM certification_id_plan plan
WHERE target.course_id = plan.old_course_id;

UPDATE catalogue.course_technology_categories target
SET course_id = plan.new_course_id
FROM certification_id_plan plan
WHERE target.course_id = plan.old_course_id;

UPDATE catalogue.course_audiences target
SET course_id = plan.new_course_id
FROM certification_id_plan plan
WHERE target.course_id = plan.old_course_id;

UPDATE catalogue.course_prerequisites target
SET course_id = plan.new_course_id
FROM certification_id_plan plan
WHERE target.course_id = plan.old_course_id;

UPDATE catalogue.course_objectives target
SET course_id = plan.new_course_id
FROM certification_id_plan plan
WHERE target.course_id = plan.old_course_id;

UPDATE catalogue.course_modules target
SET course_id = plan.new_course_id
FROM certification_id_plan plan
WHERE target.course_id = plan.old_course_id;

UPDATE catalogue.course_scenarios target
SET course_id = plan.new_course_id
FROM certification_id_plan plan
WHERE target.course_id = plan.old_course_id;

UPDATE catalogue.import_rows target
SET
  course_id = plan.new_course_id,
  payload = jsonb_set(
    jsonb_set(target.payload, '{legacyCourseId}', to_jsonb(plan.old_course_id), true),
    '{courseId}', to_jsonb(plan.new_course_id), true
  )
FROM certification_id_plan plan
WHERE target.course_id = plan.old_course_id;

DELETE FROM catalogue.courses old_course
USING certification_id_plan plan
WHERE old_course.course_id = plan.old_course_id;

-- The transition is complete; provider-shaped IDs are no longer valid parents.
ALTER TABLE catalogue.courses
  DROP CONSTRAINT courses_id_shape_check;

ALTER TABLE catalogue.courses
  ADD CONSTRAINT courses_id_shape_check CHECK (
    course_id ~ '^(RB|PP|TT|TC|CER)[0-9]{4,}$'
  );

CREATE INDEX certification_id_mappings_provider_code_idx
  ON catalogue.certification_id_mappings (provider, provider_course_code);

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
  cert.exam_code AS certification_exam_code,
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
VALUES ('005_certification_catalogue_ids');

COMMIT;
