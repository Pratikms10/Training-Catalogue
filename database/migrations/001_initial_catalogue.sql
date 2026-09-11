BEGIN;

CREATE SCHEMA catalogue;

CREATE TYPE catalogue.course_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE catalogue.import_mode AS ENUM ('validate_only', 'upsert', 'replace_all');
CREATE TYPE catalogue.import_status AS ENUM ('uploaded', 'validating', 'validated', 'importing', 'completed', 'failed');
CREATE TYPE catalogue.import_row_status AS ENUM ('pending', 'valid', 'invalid', 'imported', 'skipped');
CREATE TYPE catalogue.learning_item_type AS ENUM ('concept', 'practical_activity');

CREATE TABLE catalogue.schema_migrations (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE catalogue.categories (
  code text PRIMARY KEY,
  display_name text NOT NULL UNIQUE,
  id_prefix varchar(2) NOT NULL UNIQUE,
  display_order smallint NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT categories_code_check
    CHECK (code IN ('role-based', 'people-process', 'tools-technology')),
  CONSTRAINT categories_prefix_check
    CHECK (id_prefix IN ('RB', 'PP', 'TT'))
);

INSERT INTO catalogue.categories (code, display_name, id_prefix, display_order)
VALUES
  ('role-based', 'Role-Based Programme', 'RB', 1),
  ('people-process', 'People and Process', 'PP', 2),
  ('tools-technology', 'Tools and Technology', 'TT', 3);

CREATE TABLE catalogue.proficiency_levels (
  code text PRIMARY KEY,
  display_order smallint NOT NULL UNIQUE
);

INSERT INTO catalogue.proficiency_levels (code, display_order)
VALUES
  ('Awareness', 1),
  ('Basic', 2),
  ('Intermediate', 3),
  ('Advanced', 4),
  ('Expert', 5);

CREATE TABLE catalogue.courses (
  course_id varchar(24) PRIMARY KEY,
  category_code text NOT NULL REFERENCES catalogue.categories(code),
  title varchar(300) NOT NULL,
  level_code text NOT NULL REFERENCES catalogue.proficiency_levels(code),
  duration_minutes integer NOT NULL,
  format text,
  delivery text,
  approach text,
  summary text,
  objective text,
  image_url text,
  status catalogue.course_status NOT NULL DEFAULT 'draft',
  source_reference text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  search_document tsvector GENERATED ALWAYS AS (
    to_tsvector(
      'simple'::regconfig,
      coalesce(course_id, '') || ' ' ||
      coalesce(title, '') || ' ' ||
      coalesce(summary, '') || ' ' ||
      coalesce(objective, '') || ' ' ||
      coalesce(delivery, '') || ' ' ||
      coalesce(approach, '')
    )
  ) STORED,
  CONSTRAINT courses_title_check CHECK (btrim(title) <> ''),
  CONSTRAINT courses_duration_check CHECK (duration_minutes > 0),
  CONSTRAINT courses_id_shape_check CHECK (course_id ~ '^(RB|PP|TT)[0-9]{4,}$'),
  CONSTRAINT courses_publication_check CHECK (
    (status = 'published' AND published_at IS NOT NULL)
    OR status <> 'published'
  )
);

CREATE TABLE catalogue.role_based_details (
  course_id varchar(24) PRIMARY KEY REFERENCES catalogue.courses(course_id) ON DELETE CASCADE,
  industry text,
  department text,
  function_name text,
  role_title text
);

CREATE TABLE catalogue.people_process_details (
  course_id varchar(24) PRIMARY KEY REFERENCES catalogue.courses(course_id) ON DELETE CASCADE,
  topic_category text,
  sub_type text,
  portfolio text,
  CONSTRAINT people_process_sub_type_check CHECK (sub_type IS NULL OR sub_type IN ('People', 'Process'))
);

CREATE TABLE catalogue.tools_technology_details (
  course_id varchar(24) PRIMARY KEY REFERENCES catalogue.courses(course_id) ON DELETE CASCADE,
  tool_name text NOT NULL,
  vendor text NOT NULL,
  tool_logo_url text,
  skill_area text,
  CONSTRAINT tools_technology_name_check CHECK (btrim(tool_name) <> ''),
  CONSTRAINT tools_technology_vendor_check CHECK (btrim(vendor) <> '')
);

CREATE TABLE catalogue.course_related_skills (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id varchar(24) NOT NULL REFERENCES catalogue.courses(course_id) ON DELETE CASCADE,
  skill text NOT NULL,
  display_order integer NOT NULL DEFAULT 1,
  CONSTRAINT course_related_skills_value_check CHECK (btrim(skill) <> ''),
  CONSTRAINT course_related_skills_order_check CHECK (display_order > 0),
  UNIQUE (course_id, skill),
  UNIQUE (course_id, display_order)
);

CREATE TABLE catalogue.course_tools (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id varchar(24) NOT NULL REFERENCES catalogue.courses(course_id) ON DELETE CASCADE,
  tool_name text NOT NULL,
  display_order integer NOT NULL DEFAULT 1,
  CONSTRAINT course_tools_value_check CHECK (btrim(tool_name) <> ''),
  CONSTRAINT course_tools_order_check CHECK (display_order > 0),
  UNIQUE (course_id, tool_name),
  UNIQUE (course_id, display_order)
);

CREATE TABLE catalogue.course_technology_categories (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id varchar(24) NOT NULL REFERENCES catalogue.courses(course_id) ON DELETE CASCADE,
  category_name text NOT NULL,
  display_order integer NOT NULL DEFAULT 1,
  CONSTRAINT course_technology_categories_value_check CHECK (btrim(category_name) <> ''),
  CONSTRAINT course_technology_categories_order_check CHECK (display_order > 0),
  UNIQUE (course_id, category_name),
  UNIQUE (course_id, display_order)
);

CREATE TABLE catalogue.course_audiences (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id varchar(24) NOT NULL REFERENCES catalogue.courses(course_id) ON DELETE CASCADE,
  audience text NOT NULL,
  display_order integer NOT NULL DEFAULT 1,
  CONSTRAINT course_audiences_value_check CHECK (btrim(audience) <> ''),
  CONSTRAINT course_audiences_order_check CHECK (display_order > 0),
  UNIQUE (course_id, audience),
  UNIQUE (course_id, display_order)
);

CREATE TABLE catalogue.course_prerequisites (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id varchar(24) NOT NULL REFERENCES catalogue.courses(course_id) ON DELETE CASCADE,
  prerequisite text NOT NULL,
  display_order integer NOT NULL DEFAULT 1,
  CONSTRAINT course_prerequisites_value_check CHECK (btrim(prerequisite) <> ''),
  CONSTRAINT course_prerequisites_order_check CHECK (display_order > 0),
  UNIQUE (course_id, prerequisite),
  UNIQUE (course_id, display_order)
);

CREATE TABLE catalogue.course_objectives (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id varchar(24) NOT NULL REFERENCES catalogue.courses(course_id) ON DELETE CASCADE,
  objective text NOT NULL,
  display_order integer NOT NULL DEFAULT 1,
  CONSTRAINT course_objectives_value_check CHECK (btrim(objective) <> ''),
  CONSTRAINT course_objectives_order_check CHECK (display_order > 0),
  UNIQUE (course_id, objective),
  UNIQUE (course_id, display_order)
);

CREATE TABLE catalogue.course_modules (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id varchar(24) NOT NULL REFERENCES catalogue.courses(course_id) ON DELETE CASCADE,
  module_code varchar(24) NOT NULL,
  title text NOT NULL,
  duration_minutes integer,
  applied_exercise_title text,
  applied_exercise_content text,
  display_order integer NOT NULL DEFAULT 1,
  CONSTRAINT course_modules_code_check CHECK (btrim(module_code) <> ''),
  CONSTRAINT course_modules_title_check CHECK (btrim(title) <> ''),
  CONSTRAINT course_modules_duration_check CHECK (duration_minutes IS NULL OR duration_minutes > 0),
  CONSTRAINT course_modules_order_check CHECK (display_order > 0),
  UNIQUE (course_id, module_code),
  UNIQUE (course_id, display_order)
);

CREATE TABLE catalogue.module_learning_outcomes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  module_id bigint NOT NULL REFERENCES catalogue.course_modules(id) ON DELETE CASCADE,
  outcome_type catalogue.learning_item_type NOT NULL,
  outcome text NOT NULL,
  display_order integer NOT NULL DEFAULT 1,
  CONSTRAINT module_learning_outcomes_value_check CHECK (btrim(outcome) <> ''),
  CONSTRAINT module_learning_outcomes_order_check CHECK (display_order > 0),
  UNIQUE (module_id, outcome_type, outcome),
  UNIQUE (module_id, outcome_type, display_order)
);

CREATE TABLE catalogue.course_scenarios (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id varchar(24) NOT NULL REFERENCES catalogue.courses(course_id) ON DELETE CASCADE,
  title text NOT NULL,
  workflow text,
  content text NOT NULL,
  display_order integer NOT NULL DEFAULT 1,
  CONSTRAINT course_scenarios_title_check CHECK (btrim(title) <> ''),
  CONSTRAINT course_scenarios_content_check CHECK (btrim(content) <> ''),
  CONSTRAINT course_scenarios_order_check CHECK (display_order > 0),
  UNIQUE (course_id, title),
  UNIQUE (course_id, display_order)
);

CREATE TABLE catalogue.import_batches (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  original_file_name text NOT NULL,
  source_checksum_sha256 char(64),
  uploaded_by text NOT NULL,
  mode catalogue.import_mode NOT NULL DEFAULT 'validate_only',
  status catalogue.import_status NOT NULL DEFAULT 'uploaded',
  total_rows integer NOT NULL DEFAULT 0,
  valid_rows integer NOT NULL DEFAULT 0,
  invalid_rows integer NOT NULL DEFAULT 0,
  imported_rows integer NOT NULL DEFAULT 0,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  error_message text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT import_batches_file_name_check CHECK (btrim(original_file_name) <> ''),
  CONSTRAINT import_batches_uploaded_by_check CHECK (btrim(uploaded_by) <> ''),
  CONSTRAINT import_batches_counts_check CHECK (
    total_rows >= 0 AND valid_rows >= 0 AND invalid_rows >= 0 AND imported_rows >= 0
    AND valid_rows + invalid_rows <= total_rows
    AND imported_rows <= valid_rows
  )
);

CREATE TABLE catalogue.import_rows (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  batch_id bigint NOT NULL REFERENCES catalogue.import_batches(id) ON DELETE CASCADE,
  sheet_name text NOT NULL,
  row_number integer NOT NULL,
  course_id varchar(24),
  status catalogue.import_row_status NOT NULL DEFAULT 'pending',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  validation_errors jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT import_rows_sheet_check CHECK (btrim(sheet_name) <> ''),
  CONSTRAINT import_rows_row_number_check CHECK (row_number > 0),
  CONSTRAINT import_rows_errors_array_check CHECK (jsonb_typeof(validation_errors) = 'array'),
  UNIQUE (batch_id, sheet_name, row_number)
);

CREATE FUNCTION catalogue.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER courses_set_updated_at
BEFORE UPDATE ON catalogue.courses
FOR EACH ROW EXECUTE FUNCTION catalogue.set_updated_at();

CREATE FUNCTION catalogue.validate_course_id_prefix()
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

CREATE TRIGGER courses_validate_id_prefix
BEFORE INSERT OR UPDATE OF course_id, category_code ON catalogue.courses
FOR EACH ROW EXECUTE FUNCTION catalogue.validate_course_id_prefix();

CREATE FUNCTION catalogue.validate_extension_category()
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

CREATE TRIGGER role_based_details_validate_category
BEFORE INSERT OR UPDATE ON catalogue.role_based_details
FOR EACH ROW EXECUTE FUNCTION catalogue.validate_extension_category();

CREATE TRIGGER people_process_details_validate_category
BEFORE INSERT OR UPDATE ON catalogue.people_process_details
FOR EACH ROW EXECUTE FUNCTION catalogue.validate_extension_category();

CREATE TRIGGER tools_technology_details_validate_category
BEFORE INSERT OR UPDATE ON catalogue.tools_technology_details
FOR EACH ROW EXECUTE FUNCTION catalogue.validate_extension_category();

CREATE INDEX courses_catalogue_list_idx
  ON catalogue.courses (category_code, status, title, course_id);
CREATE INDEX courses_level_idx
  ON catalogue.courses (level_code);
CREATE INDEX courses_duration_idx
  ON catalogue.courses (duration_minutes);
CREATE INDEX courses_search_idx
  ON catalogue.courses USING gin (search_document);
CREATE INDEX role_based_industry_idx
  ON catalogue.role_based_details (industry);
CREATE INDEX role_based_department_idx
  ON catalogue.role_based_details (department);
CREATE INDEX people_process_sub_type_idx
  ON catalogue.people_process_details (sub_type);
CREATE INDEX people_process_portfolio_idx
  ON catalogue.people_process_details (portfolio);
CREATE INDEX tools_technology_tool_idx
  ON catalogue.tools_technology_details (tool_name);
CREATE INDEX tools_technology_vendor_idx
  ON catalogue.tools_technology_details (vendor);
CREATE INDEX import_rows_batch_status_idx
  ON catalogue.import_rows (batch_id, status);

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
LEFT JOIN catalogue.tools_technology_details tt ON tt.course_id = c.course_id;

INSERT INTO catalogue.schema_migrations (version)
VALUES ('001_initial_catalogue');

COMMIT;
