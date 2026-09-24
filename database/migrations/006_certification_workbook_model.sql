BEGIN;

DROP VIEW catalogue.course_catalogue_view;

ALTER TABLE catalogue.courses
  ALTER COLUMN level_code DROP NOT NULL,
  ALTER COLUMN duration_minutes DROP NOT NULL;

ALTER TABLE catalogue.courses
  DROP CONSTRAINT courses_duration_check,
  ADD CONSTRAINT courses_duration_check CHECK (
    duration_minutes IS NULL OR duration_minutes > 0
  ),
  ADD CONSTRAINT courses_level_required_check CHECK (
    category_code = 'certifications' OR level_code IS NOT NULL
  );

ALTER TABLE catalogue.certification_details
  ADD COLUMN record_kind text NOT NULL DEFAULT 'training-course',
  ADD COLUMN source_global_id text,
  ADD COLUMN provider_certification_id text,
  ADD COLUMN course_code_public boolean NOT NULL DEFAULT true,
  ADD COLUMN credential_type text,
  ADD COLUMN credential_classification text,
  ADD COLUMN credential_status text,
  ADD COLUMN credential_level text,
  ADD COLUMN category_track text,
  ADD COLUMN exam_format_delivery text,
  ADD COLUMN exam_duration_text text,
  ADD COLUMN time_limit_text text,
  ADD COLUMN price_text text,
  ADD COLUMN retake_fee_text text,
  ADD COLUMN validity_renewal text,
  ADD COLUMN required_exam_pathway text,
  ADD COLUMN source_qc_status text,
  ADD COLUMN raw_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD CONSTRAINT certification_record_kind_check CHECK (
    record_kind IN ('training-course', 'credential')
  ),
  ADD CONSTRAINT certification_source_global_id_check CHECK (
    source_global_id IS NULL OR btrim(source_global_id) <> ''
  ),
  ADD CONSTRAINT certification_provider_certification_id_check CHECK (
    provider_certification_id IS NULL OR btrim(provider_certification_id) <> ''
  );

CREATE UNIQUE INDEX certification_source_global_id_unique_idx
  ON catalogue.certification_details (source_global_id)
  WHERE source_global_id IS NOT NULL;

CREATE UNIQUE INDEX certification_provider_id_unique_idx
  ON catalogue.certification_details (provider, provider_certification_id)
  WHERE provider_certification_id IS NOT NULL;

CREATE TABLE catalogue.certification_exams (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id varchar(24) NOT NULL REFERENCES catalogue.courses(course_id) ON DELETE CASCADE,
  exam_code text,
  exam_name text,
  exam_status text,
  requirement_type text,
  duration_minutes integer,
  duration_text text,
  delivery_format text,
  delivery_provider text,
  proctored text,
  languages text[] NOT NULL DEFAULT ARRAY[]::text[],
  price text,
  currency text,
  passing_score text,
  exam_url text,
  notes text,
  display_order integer NOT NULL,
  CONSTRAINT certification_exams_duration_check CHECK (
    duration_minutes IS NULL OR duration_minutes > 0
  ),
  CONSTRAINT certification_exams_order_check CHECK (display_order > 0),
  UNIQUE (course_id, display_order)
);

CREATE TABLE catalogue.certification_objectives (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id varchar(24) NOT NULL REFERENCES catalogue.courses(course_id) ON DELETE CASCADE,
  group_title text,
  objective text NOT NULL,
  weight text,
  objective_level text,
  objective_code text,
  display_order integer NOT NULL,
  CONSTRAINT certification_objectives_value_check CHECK (btrim(objective) <> ''),
  CONSTRAINT certification_objectives_order_check CHECK (display_order > 0),
  UNIQUE (course_id, display_order)
);

CREATE TABLE catalogue.certification_requirements (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id varchar(24) NOT NULL REFERENCES catalogue.courses(course_id) ON DELETE CASCADE,
  requirement_type text,
  requirement_group text,
  requirement text NOT NULL,
  requirement_url text,
  qualifier text,
  notes text,
  display_order integer NOT NULL,
  CONSTRAINT certification_requirements_value_check CHECK (btrim(requirement) <> ''),
  CONSTRAINT certification_requirements_order_check CHECK (display_order > 0),
  UNIQUE (course_id, display_order)
);

CREATE TABLE catalogue.certification_training_resources (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id varchar(24) NOT NULL REFERENCES catalogue.courses(course_id) ON DELETE CASCADE,
  resource_type text,
  title text NOT NULL,
  resource_url text,
  duration_text text,
  item_count text,
  relationship text,
  notes text,
  display_order integer NOT NULL,
  CONSTRAINT certification_training_resources_title_check CHECK (btrim(title) <> ''),
  CONSTRAINT certification_training_resources_order_check CHECK (display_order > 0),
  UNIQUE (course_id, display_order)
);

CREATE TABLE catalogue.certification_lifecycle_items (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id varchar(24) NOT NULL REFERENCES catalogue.courses(course_id) ON DELETE CASCADE,
  record_type text,
  status text,
  validity_renewal text,
  retirement_transition text,
  details text,
  scenario text,
  option_text text,
  action_text text,
  outcome text,
  display_order integer NOT NULL,
  CONSTRAINT certification_lifecycle_order_check CHECK (display_order > 0),
  UNIQUE (course_id, display_order)
);

CREATE INDEX certification_exams_course_idx
  ON catalogue.certification_exams (course_id);
CREATE INDEX certification_objectives_course_idx
  ON catalogue.certification_objectives (course_id);
CREATE INDEX certification_requirements_course_idx
  ON catalogue.certification_requirements (course_id);
CREATE INDEX certification_training_resources_course_idx
  ON catalogue.certification_training_resources (course_id);
CREATE INDEX certification_lifecycle_items_course_idx
  ON catalogue.certification_lifecycle_items (course_id);

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
  ) AS technology_categories,
  cert.record_kind AS certification_record_kind,
  cert.source_global_id AS certification_source_global_id,
  cert.provider_certification_id,
  cert.course_code_public,
  cert.credential_type,
  cert.credential_classification,
  cert.credential_status,
  cert.credential_level,
  cert.category_track AS certification_category_track,
  cert.exam_format_delivery,
  cert.exam_duration_text,
  cert.time_limit_text,
  cert.price_text,
  cert.retake_fee_text,
  cert.validity_renewal,
  cert.required_exam_pathway,
  cert.source_qc_status
FROM catalogue.courses c
JOIN catalogue.categories cat ON cat.code = c.category_code
LEFT JOIN catalogue.role_based_details rb ON rb.course_id = c.course_id
LEFT JOIN catalogue.people_process_details pp ON pp.course_id = c.course_id
LEFT JOIN catalogue.tools_technology_details tt ON tt.course_id = c.course_id
LEFT JOIN catalogue.technical_training_details tech ON tech.course_id = c.course_id
LEFT JOIN catalogue.certification_details cert ON cert.course_id = c.course_id;

INSERT INTO catalogue.schema_migrations (version)
VALUES ('006_certification_workbook_model');

COMMIT;
