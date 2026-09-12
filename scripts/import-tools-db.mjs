import 'dotenv/config';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { closePool, getPool } from '../server/database.mjs';

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inputArgument = process.argv[2];
const canonicalPath = inputArgument
  ? path.resolve(inputArgument)
  : path.join(rootDirectory, 'data', 'normalized', 'tools-technology.json');
const canonicalText = await fs.readFile(canonicalPath, 'utf8');
const courses = path.extname(canonicalPath).toLowerCase() === '.jsonl'
  ? canonicalText.split(/\r?\n/).filter((line) => line.trim()).map((line) => JSON.parse(line))
  : JSON.parse(canonicalText).courses;
const supportedCategories = new Set(['tools-technology', 'role-based']);
const category = courses?.[0]?.category;

if (!Array.isArray(courses) || courses.length === 0) {
  throw new Error('Canonical course data is missing or contains no courses.');
}
if (!supportedCategories.has(category) || courses.some((course) => course.category !== category)) {
  throw new Error('Every course in a batch must use the same supported category.');
}

const actor = process.env.IMPORT_ACTOR?.trim() || 'local-admin';
const sourceChecksum = createHash('sha256').update(JSON.stringify(courses)).digest('hex');
const configuredChunkSize = Number.parseInt(process.env.DATABASE_IMPORT_CHUNK_SIZE || '100', 10);
const chunkSize = Number.isInteger(configuredChunkSize) && configuredChunkSize > 0 ? configuredChunkSize : 100;
const pool = getPool();
let batchId;
let importStartIndex = 0;

try {
  const resumeArgument = process.argv.find((argument) => argument.startsWith('--resume-batch='));
  const requestedResumeBatchId = (resumeArgument?.split('=')[1] || process.env.IMPORT_RESUME_BATCH_ID)?.trim();
  if (requestedResumeBatchId) {
    if (!/^\d+$/.test(requestedResumeBatchId)) throw new Error('IMPORT_RESUME_BATCH_ID must be a numeric batch ID.');

    const resumeResult = await pool.query(
      `SELECT id, status, total_rows, imported_rows
       FROM catalogue.import_batches
       WHERE id = $1`,
      [requestedResumeBatchId],
    );
    const resumeBatch = resumeResult.rows[0];
    if (!resumeBatch) throw new Error(`Import batch ${requestedResumeBatchId} does not exist.`);
    if (resumeBatch.status === 'completed') throw new Error(`Import batch ${requestedResumeBatchId} is already complete.`);
    if (Number(resumeBatch.total_rows) !== courses.length) {
      throw new Error(`Import batch ${requestedResumeBatchId} expects ${resumeBatch.total_rows} courses, not ${courses.length}.`);
    }

    importStartIndex = Number(resumeBatch.imported_rows || 0);
    const importedRowsResult = await pool.query(
      `SELECT course_id
       FROM catalogue.import_rows
       WHERE batch_id = $1 AND status = 'imported'
       ORDER BY row_number`,
      [requestedResumeBatchId],
    );
    const importedIds = importedRowsResult.rows.map((row) => row.course_id);
    const expectedIds = courses.slice(0, importStartIndex).map((course) => course.courseId);
    if (importedIds.length !== expectedIds.length || importedIds.some((courseId, index) => courseId !== expectedIds[index])) {
      throw new Error(`Import batch ${requestedResumeBatchId} does not match the supplied course sequence.`);
    }

    batchId = resumeBatch.id;
    await pool.query(
      `UPDATE catalogue.import_batches
       SET status = 'importing', error_message = NULL, completed_at = NULL
       WHERE id = $1`,
      [batchId],
    );
    console.log(`Resuming batch ${batchId} after ${importStartIndex} imported courses.`);
  } else {
    const batchResult = await pool.query(
      `INSERT INTO catalogue.import_batches
         (original_file_name, source_checksum_sha256, uploaded_by, mode, status, total_rows)
       VALUES ($1, $2, $3, 'upsert', 'validating', $4)
       RETURNING id`,
      [path.basename(canonicalPath), sourceChecksum, actor, courses.length],
    );
    batchId = batchResult.rows[0].id;
  }

  const courseChunks = [];
  for (let index = importStartIndex; index < courses.length; index += chunkSize) {
    courseChunks.push(courses.slice(index, index + chunkSize));
  }

  const client = await pool.connect();
  try {
    for (let chunkIndex = 0; chunkIndex < courseChunks.length; chunkIndex += 1) {
      const courseChunk = courseChunks[chunkIndex];
      const coursePayload = JSON.stringify(courseChunk);
      const rowOffset = importStartIndex + (chunkIndex * chunkSize);

      await client.query('BEGIN');

      await client.query(
        `WITH incoming AS (
           SELECT course, ($3::integer + display_order)::integer AS row_number
           FROM jsonb_array_elements($2::jsonb) WITH ORDINALITY AS item(course, display_order)
         ), inserted_rows AS (
           INSERT INTO catalogue.import_rows
             (batch_id, sheet_name, row_number, course_id, status, payload)
           SELECT $1, 'Canonical Course JSON', row_number, course->>'courseId', 'valid', course
           FROM incoming
           RETURNING 1
         )
         UPDATE catalogue.import_batches
         SET status = 'importing',
             valid_rows = COALESCE(valid_rows, 0) + (SELECT count(*) FROM inserted_rows)
         WHERE id = $1`,
        [batchId, coursePayload, rowOffset],
      );

      await client.query(
      `WITH incoming AS (
         SELECT course
         FROM jsonb_array_elements($1::jsonb) AS item(course)
       )
       INSERT INTO catalogue.courses
         (course_id, category_code, title, level_code, duration_minutes, format, delivery,
          summary, objective, image_url, status, source_reference, published_at)
       SELECT
         course->>'courseId',
         course->>'category',
         course->>'title',
         course->>'level',
         (course->>'durationMinutes')::integer,
         NULLIF(course->>'format', ''),
         NULLIF(course->>'delivery', ''),
         NULLIF(course->>'summary', ''),
         (SELECT string_agg(objective, E'\n' ORDER BY display_order)
          FROM jsonb_array_elements_text(COALESCE(course->'objectives', '[]'::jsonb))
               WITH ORDINALITY AS objective_item(objective, display_order)),
         NULLIF(COALESCE(course->>'imageUrl', course->>'toolLogoUrl'), ''),
          'draft',
         $2,
         now()
       FROM incoming
       ON CONFLICT (course_id) DO UPDATE SET
         category_code = EXCLUDED.category_code,
         title = EXCLUDED.title,
         level_code = EXCLUDED.level_code,
         duration_minutes = EXCLUDED.duration_minutes,
         format = EXCLUDED.format,
         delivery = EXCLUDED.delivery,
         summary = EXCLUDED.summary,
         objective = EXCLUDED.objective,
         image_url = EXCLUDED.image_url,
          status = catalogue.courses.status,
         source_reference = EXCLUDED.source_reference,
         published_at = COALESCE(catalogue.courses.published_at, now())`,
      [coursePayload, `import-batch:${batchId}`],
    );

      await client.query(
      `WITH incoming AS (
         SELECT course
         FROM jsonb_array_elements($1::jsonb) AS item(course)
       )
       INSERT INTO catalogue.tools_technology_details
         (course_id, tool_name, vendor, tool_logo_url, skill_area)
       SELECT
         course->>'courseId',
         course->>'toolName',
         course->>'vendor',
         NULLIF(course->>'toolLogoUrl', ''),
         NULLIF(course->>'skillArea', '')
       FROM incoming
       WHERE course->>'category' = 'tools-technology'
       ON CONFLICT (course_id) DO UPDATE SET
         tool_name = EXCLUDED.tool_name,
         vendor = EXCLUDED.vendor,
         tool_logo_url = EXCLUDED.tool_logo_url,
         skill_area = EXCLUDED.skill_area`,
      [coursePayload],
    );

      await client.query(
      `WITH incoming AS (
         SELECT course
         FROM jsonb_array_elements($1::jsonb) AS item(course)
       )
       INSERT INTO catalogue.role_based_details
         (course_id, industry, department, function_name, role_title)
       SELECT
         course->>'courseId',
         NULLIF(course->>'industry', ''),
         NULLIF(course->>'department', ''),
         NULLIF(course->>'functionName', ''),
         NULLIF(course->>'roleTitle', '')
       FROM incoming
       WHERE course->>'category' = 'role-based'
       ON CONFLICT (course_id) DO UPDATE SET
         industry = EXCLUDED.industry,
         department = EXCLUDED.department,
         function_name = EXCLUDED.function_name,
         role_title = EXCLUDED.role_title`,
      [coursePayload],
    );

      await client.query(
      `WITH incoming_ids AS (
         SELECT course->>'courseId' AS course_id
         FROM jsonb_array_elements($1::jsonb) AS item(course)
       ), deleted_objectives AS (
         DELETE FROM catalogue.course_objectives target USING incoming_ids source
         WHERE target.course_id = source.course_id RETURNING 1
       ), deleted_tools AS (
         DELETE FROM catalogue.course_tools target USING incoming_ids source
         WHERE target.course_id = source.course_id RETURNING 1
       ), deleted_related_skills AS (
         DELETE FROM catalogue.course_related_skills target USING incoming_ids source
         WHERE target.course_id = source.course_id RETURNING 1
       ), deleted_categories AS (
         DELETE FROM catalogue.course_technology_categories target USING incoming_ids source
         WHERE target.course_id = source.course_id RETURNING 1
       ), deleted_audiences AS (
         DELETE FROM catalogue.course_audiences target USING incoming_ids source
         WHERE target.course_id = source.course_id RETURNING 1
       ), deleted_prerequisites AS (
         DELETE FROM catalogue.course_prerequisites target USING incoming_ids source
         WHERE target.course_id = source.course_id RETURNING 1
       ), deleted_modules AS (
         DELETE FROM catalogue.course_modules target USING incoming_ids source
         WHERE target.course_id = source.course_id RETURNING 1
       ), deleted_scenarios AS (
         DELETE FROM catalogue.course_scenarios target USING incoming_ids source
         WHERE target.course_id = source.course_id RETURNING 1
       )
       SELECT
         (SELECT count(*) FROM deleted_objectives) +
         (SELECT count(*) FROM deleted_tools) +
         (SELECT count(*) FROM deleted_related_skills) +
         (SELECT count(*) FROM deleted_categories) +
         (SELECT count(*) FROM deleted_audiences) +
         (SELECT count(*) FROM deleted_prerequisites) +
         (SELECT count(*) FROM deleted_modules) +
         (SELECT count(*) FROM deleted_scenarios) AS deleted_rows`,
      [coursePayload],
    );

      await client.query(
      `WITH incoming AS (
         SELECT course
         FROM jsonb_array_elements($1::jsonb) AS item(course)
       ), inserted_objectives AS (
         INSERT INTO catalogue.course_objectives (course_id, objective, display_order)
         SELECT course->>'courseId', value, display_order
         FROM incoming
         CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(course->'objectives', '[]'::jsonb))
           WITH ORDINALITY AS item(value, display_order)
         RETURNING 1
       ), inserted_tools AS (
         INSERT INTO catalogue.course_tools (course_id, tool_name, display_order)
         SELECT course->>'courseId', value, display_order
         FROM incoming
         CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(course->'toolsCovered', '[]'::jsonb))
           WITH ORDINALITY AS item(value, display_order)
         RETURNING 1
       ), inserted_related_skills AS (
         INSERT INTO catalogue.course_related_skills (course_id, skill, display_order)
         SELECT course->>'courseId', value, display_order
         FROM incoming
         CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(course->'relatedSkills', '[]'::jsonb))
           WITH ORDINALITY AS item(value, display_order)
         RETURNING 1
       ), inserted_categories AS (
         INSERT INTO catalogue.course_technology_categories (course_id, category_name, display_order)
         SELECT course->>'courseId', value, display_order
         FROM incoming
         CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(course->'technologyCategories', '[]'::jsonb))
           WITH ORDINALITY AS item(value, display_order)
         RETURNING 1
       ), inserted_audiences AS (
         INSERT INTO catalogue.course_audiences (course_id, audience, display_order)
         SELECT course->>'courseId', value, display_order
         FROM incoming
         CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(course->'audiences', '[]'::jsonb))
           WITH ORDINALITY AS item(value, display_order)
         RETURNING 1
       ), inserted_prerequisites AS (
         INSERT INTO catalogue.course_prerequisites (course_id, prerequisite, display_order)
         SELECT course->>'courseId', value, display_order
         FROM incoming
         CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(course->'prerequisites', '[]'::jsonb))
           WITH ORDINALITY AS item(value, display_order)
         RETURNING 1
       )
       SELECT
         (SELECT count(*) FROM inserted_objectives) +
         (SELECT count(*) FROM inserted_tools) +
         (SELECT count(*) FROM inserted_related_skills) +
         (SELECT count(*) FROM inserted_categories) +
         (SELECT count(*) FROM inserted_audiences) +
         (SELECT count(*) FROM inserted_prerequisites) AS inserted_rows`,
      [coursePayload],
    );

      await client.query(
      `WITH incoming AS (
         SELECT course
         FROM jsonb_array_elements($1::jsonb) AS item(course)
       )
       INSERT INTO catalogue.course_modules (course_id, module_code, title, display_order)
       SELECT
         course->>'courseId',
         module_payload->>'moduleCode',
         module_payload->>'title',
         display_order
       FROM incoming
       CROSS JOIN LATERAL jsonb_array_elements(COALESCE(course->'modules', '[]'::jsonb))
         WITH ORDINALITY AS module_item(module_payload, display_order)`,
      [coursePayload],
    );

      await client.query(
      `WITH incoming AS (
         SELECT course
         FROM jsonb_array_elements($1::jsonb) AS item(course)
       ), module_source AS (
         SELECT
           course->>'courseId' AS course_id,
           module_payload->>'moduleCode' AS module_code,
           module_payload
         FROM incoming
         CROSS JOIN LATERAL jsonb_array_elements(COALESCE(course->'modules', '[]'::jsonb))
           AS module_item(module_payload)
       ), outcome_source AS (
         SELECT course_id, module_code, 'concept'::catalogue.learning_item_type AS outcome_type,
                value AS outcome, display_order
         FROM module_source
         CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(module_payload->'concepts', '[]'::jsonb))
           WITH ORDINALITY AS item(value, display_order)
         UNION ALL
         SELECT course_id, module_code, 'practical_activity'::catalogue.learning_item_type AS outcome_type,
                value AS outcome, display_order
         FROM module_source
         CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(module_payload->'practicalActivities', '[]'::jsonb))
           WITH ORDINALITY AS item(value, display_order)
       )
       INSERT INTO catalogue.module_learning_outcomes
         (module_id, outcome_type, outcome, display_order)
       SELECT module.id, source.outcome_type, source.outcome, source.display_order
       FROM outcome_source source
       JOIN catalogue.course_modules module
         ON module.course_id = source.course_id AND module.module_code = source.module_code`,
      [coursePayload],
    );

      await client.query(
      `WITH incoming AS (
         SELECT course
         FROM jsonb_array_elements($2::jsonb) AS item(course)
       ), inserted_scenarios AS (
         INSERT INTO catalogue.course_scenarios
           (course_id, title, workflow, content, display_order)
         SELECT
           course->>'courseId',
           scenario_payload->>'title',
           NULLIF(scenario_payload->>'workflow', ''),
           scenario_payload->>'description',
           display_order
         FROM incoming
         CROSS JOIN LATERAL jsonb_array_elements(COALESCE(course->'scenarios', '[]'::jsonb))
           WITH ORDINALITY AS scenario_item(scenario_payload, display_order)
         RETURNING 1
        ), updated_rows AS (
          UPDATE catalogue.import_rows target
          SET status = 'imported'
          FROM incoming
          WHERE target.batch_id = $1
            AND target.course_id = incoming.course->>'courseId'
          RETURNING 1
        )
        UPDATE catalogue.import_batches
        SET status = 'importing',
            imported_rows = COALESCE(imported_rows, 0) + (SELECT count(*) FROM updated_rows),
            completed_at = NULL,
            metadata = jsonb_build_object(
              'category', $3::text,
              'scenarioRows', COALESCE((metadata->>'scenarioRows')::integer, 0) + (SELECT count(*) FROM inserted_scenarios)
           )
       WHERE id = $1`,
       [batchId, coursePayload, category],
     );

      await client.query('COMMIT');
      console.log(`Imported hidden chunk ${chunkIndex + 1}/${courseChunks.length} (${courseChunk.length} courses).`);
    }

    await client.query('BEGIN');
    await client.query(
      `UPDATE catalogue.courses
       SET status = 'published', published_at = COALESCE(published_at, now())
       WHERE course_id = ANY($1::text[])`,
      [courses.map((course) => course.courseId)],
    );
    await client.query(
      `UPDATE catalogue.import_batches
       SET status = 'completed',
           valid_rows = $2,
           imported_rows = $2,
           completed_at = now()
       WHERE id = $1`,
      [batchId, courses.length],
    );
    await client.query('COMMIT');
    console.log(`Imported ${courses.length} ${category} courses in batch ${batchId}.`);
  } catch (error) {
    await client.query('ROLLBACK');
    await pool.query(
      `UPDATE catalogue.import_batches
       SET status = 'failed', error_message = $2, completed_at = now()
       WHERE id = $1`,
      [batchId, error.message],
    );
    throw error;
  } finally {
    client.release();
  }
} finally {
  await closePool();
}
