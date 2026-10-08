BEGIN;

-- Process content supplied for the catalogue uses the PI prefix. There are no
-- existing people/process database records, so this preserves the supplied IDs
-- rather than silently renumbering them.
ALTER TABLE catalogue.categories
  DROP CONSTRAINT IF EXISTS categories_prefix_check;

ALTER TABLE catalogue.categories
  ADD CONSTRAINT categories_prefix_check
    CHECK (id_prefix IN ('RB', 'PP', 'PI', 'TT', 'CF', 'TC', 'CER'));

UPDATE catalogue.categories
SET id_prefix = 'PI',
    display_name = 'Process & People Programmes'
WHERE code = 'people-process';

ALTER TABLE catalogue.courses
  DROP CONSTRAINT IF EXISTS courses_id_shape_check;

ALTER TABLE catalogue.courses
  ADD CONSTRAINT courses_id_shape_check CHECK (
    course_id ~ '^(RB|PP|PI|TT|TC|CER)[0-9]{4,}$'
    OR (course_id ~ '^[A-Z0-9]{2,12}-[A-Z0-9][A-Z0-9-]{1,30}$' AND course_id ~ '[0-9]')
  );

COMMIT;
