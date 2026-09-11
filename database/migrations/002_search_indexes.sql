BEGIN;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX courses_title_trgm_idx
  ON catalogue.courses USING gin (title gin_trgm_ops);

CREATE INDEX tools_technology_tool_trgm_idx
  ON catalogue.tools_technology_details USING gin (tool_name gin_trgm_ops);

CREATE INDEX tools_technology_vendor_trgm_idx
  ON catalogue.tools_technology_details USING gin (vendor gin_trgm_ops);

INSERT INTO catalogue.schema_migrations (version)
VALUES ('002_search_indexes');

COMMIT;
