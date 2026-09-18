import 'dotenv/config';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { closePool, getPool } from '../server/database.mjs';
import {
  parseMicrosoftCertificationMarkdown,
  validateCertificationBatch,
} from '../server/certificationMarkdownParser.mjs';

const rawArguments = process.argv.slice(2);
const skipExisting = rawArguments.includes('--skip-existing');
const skipInvalid = rawArguments.includes('--skip-invalid');
const unsupportedOptions = rawArguments.filter((argument) => (
  argument.startsWith('--') && !['--skip-existing', '--skip-invalid'].includes(argument)
));
if (unsupportedOptions.length > 0) {
  throw new Error(`Unsupported option(s): ${unsupportedOptions.join(', ')}`);
}

const inputArguments = rawArguments.filter((argument) => !argument.startsWith('--'));
if (inputArguments.length === 0) {
  throw new Error('Supply one or more Microsoft certification Markdown files or folders.');
}

async function expandInput(inputArgument) {
  const inputPath = path.resolve(inputArgument);
  const inputStat = await fs.stat(inputPath);
  if (inputStat.isFile()) {
    if (path.extname(inputPath).toLowerCase() !== '.md') {
      throw new Error(`Certification input must be a Markdown file: ${inputPath}`);
    }
    return [inputPath];
  }
  if (!inputStat.isDirectory()) {
    throw new Error(`Certification input must be a Markdown file or folder: ${inputPath}`);
  }

  const entries = await fs.readdir(inputPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === '.md')
    .map((entry) => path.join(inputPath, entry.name));
}

const expandedPaths = (await Promise.all(inputArguments.map(expandInput))).flat();
const inputPaths = [...new Set(expandedPaths)].sort((left, right) => (
  left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' })
));
if (inputPaths.length === 0) {
  throw new Error('No Microsoft certification Markdown files were found.');
}

const sourceFiles = await Promise.all(inputPaths.map(async (filePath) => ({
  filePath,
  fileName: path.basename(filePath),
  markdown: await fs.readFile(filePath, 'utf8'),
})));
const parsedCourses = [];
const invalidSources = [];
for (const source of sourceFiles) {
  try {
    parsedCourses.push(parseMicrosoftCertificationMarkdown(source.markdown, source.fileName));
  } catch (error) {
    invalidSources.push({ fileName: source.fileName, error: error.message });
  }
}
if (invalidSources.length > 0) {
  console.log(`Found ${invalidSources.length} invalid source file(s):`);
  for (const invalidSource of invalidSources) {
    console.log(`- ${invalidSource.fileName}: ${invalidSource.error}`);
  }
  if (!skipInvalid) {
    throw new Error('Validation failed. Correct the files above or rerun with --skip-invalid.');
  }
}
if (parsedCourses.length === 0) {
  throw new Error('No valid Microsoft certification courses were found.');
}
const validatedCourses = validateCertificationBatch(parsedCourses);
const pool = getPool();
let courses = validatedCourses;
let skippedExistingCodes = [];

if (skipExisting) {
  const existingResult = await pool.query(
    `SELECT course_id
     FROM catalogue.courses
     WHERE course_id = ANY($1::text[])`,
    [validatedCourses.map((course) => course.courseId)],
  );
  const existingCodes = new Set(existingResult.rows.map((row) => row.course_id));
  skippedExistingCodes = validatedCourses
    .filter((course) => existingCodes.has(course.courseId))
    .map((course) => course.courseId);
  courses = validatedCourses.filter((course) => !existingCodes.has(course.courseId));
}

if (skippedExistingCodes.length > 0) {
  console.log(`Skipped ${skippedExistingCodes.length} existing course(s): ${skippedExistingCodes.join(', ')}`);
}
if (courses.length === 0) {
  console.log('No new Microsoft certification courses to import.');
  await closePool();
  process.exit(0);
}

const selectedSourceNames = new Set(courses.map((course) => course.sourceFile));
const selectedSourceFiles = sourceFiles.filter((source) => selectedSourceNames.has(source.fileName));
const checksum = createHash('sha256')
  .update(selectedSourceFiles.map((source) => `${source.fileName}\n${source.markdown}`).join('\n---\n'))
  .digest('hex');
let batchId;

async function insertOrderedValues(client, tableName, columnName, courseId, values) {
  if (values.length === 0) return;
  const payload = values.map((value, index) => ({
    value,
    display_order: index + 1,
  }));
  await client.query(
    `INSERT INTO catalogue.${tableName} (course_id, ${columnName}, display_order)
     SELECT $1, item.value, item.display_order
     FROM jsonb_to_recordset($2::jsonb)
       AS item(value text, display_order integer)
     ORDER BY item.display_order`,
    [courseId, JSON.stringify(payload)],
  );
}

try {
  const batchResult = await pool.query(
    `INSERT INTO catalogue.import_batches
       (original_file_name, source_checksum_sha256, uploaded_by, mode, status, total_rows)
     VALUES ($1, $2, $3, 'upsert', 'validating', $4)
     RETURNING id`,
    [
      `microsoft-certifications-${courses.length}-files`,
      checksum,
      process.env.IMPORT_ACTOR?.trim() || 'local-admin',
      courses.length,
    ],
  );
  batchId = batchResult.rows[0].id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (let index = 0; index < courses.length; index += 1) {
      const course = courses[index];
      const payload = JSON.stringify(course);

      await client.query(
        `INSERT INTO catalogue.import_rows
           (batch_id, sheet_name, row_number, course_id, status, payload)
         VALUES ($1, 'Microsoft Markdown', $2, $3, 'valid', $4::jsonb)`,
        [batchId, index + 1, course.courseId, payload],
      );

      await client.query(
        `INSERT INTO catalogue.courses
           (course_id, category_code, title, level_code, duration_minutes, format, delivery,
            summary, objective, status, source_reference, published_at)
         VALUES ($1, 'certifications', $2, $3, $4, $5, $6, $7, $8, 'draft', $9, now())
         ON CONFLICT (course_id) DO UPDATE SET
           category_code = EXCLUDED.category_code,
           title = EXCLUDED.title,
           level_code = EXCLUDED.level_code,
           duration_minutes = EXCLUDED.duration_minutes,
           format = EXCLUDED.format,
           delivery = EXCLUDED.delivery,
           summary = EXCLUDED.summary,
           objective = EXCLUDED.objective,
           status = 'draft',
           source_reference = EXCLUDED.source_reference`,
        [
          course.courseId,
          course.title,
          course.level,
          course.durationMinutes,
          course.format,
          course.delivery,
          course.summary,
          course.objectives.join('\n') || null,
          `import-batch:${batchId}:${course.sourceFile}`,
        ],
      );

      await client.query(
        `INSERT INTO catalogue.certification_details
           (course_id, provider, course_code, course_url, source_sequence,
            product_technologies, roles, subjects, language_codes,
            certification_information, instructor_led_information,
            self_paced_information, additional_information)
         VALUES ($1, $2, $3, $4, $5, $6::text[], $7::text[], $8::text[], $9::text[], $10, $11, $12, $13)
         ON CONFLICT (course_id) DO UPDATE SET
           provider = EXCLUDED.provider,
           course_code = EXCLUDED.course_code,
           course_url = EXCLUDED.course_url,
           source_sequence = EXCLUDED.source_sequence,
           product_technologies = EXCLUDED.product_technologies,
           roles = EXCLUDED.roles,
           subjects = EXCLUDED.subjects,
           language_codes = EXCLUDED.language_codes,
           certification_information = EXCLUDED.certification_information,
           instructor_led_information = EXCLUDED.instructor_led_information,
           self_paced_information = EXCLUDED.self_paced_information,
           additional_information = EXCLUDED.additional_information`,
        [
          course.courseId,
          course.provider,
          course.courseCode,
          course.courseUrl,
          course.sourceSequence,
          course.productTechnologies,
          course.roles,
          course.subjects,
          course.languageCodes,
          course.certificationInformation,
          course.instructorLedInformation,
          course.selfPacedInformation,
          course.additionalInformation,
        ],
      );

      await client.query(
        `WITH deleted_objectives AS (
           DELETE FROM catalogue.course_objectives WHERE course_id = $1 RETURNING 1
         ), deleted_tools AS (
           DELETE FROM catalogue.course_tools WHERE course_id = $1 RETURNING 1
         ), deleted_audiences AS (
           DELETE FROM catalogue.course_audiences WHERE course_id = $1 RETURNING 1
         ), deleted_prerequisites AS (
           DELETE FROM catalogue.course_prerequisites WHERE course_id = $1 RETURNING 1
         ), deleted_modules AS (
           DELETE FROM catalogue.course_modules WHERE course_id = $1 RETURNING 1
         )
         SELECT 1`,
        [course.courseId],
      );

      await insertOrderedValues(
        client, 'course_objectives', 'objective', course.courseId, course.objectives,
      );
      await insertOrderedValues(
        client, 'course_tools', 'tool_name', course.courseId, course.productTechnologies,
      );
      await insertOrderedValues(
        client, 'course_audiences', 'audience', course.courseId, course.audiences,
      );
      await insertOrderedValues(
        client, 'course_prerequisites', 'prerequisite', course.courseId, course.prerequisites,
      );

      const modulePayload = course.modules.map((module, moduleIndex) => ({
        module_code: module.moduleCode,
        title: module.title,
        description: module.description,
        learning_path_title: module.learningPathTitle,
        learning_path_description: module.learningPathDescription,
        display_order: moduleIndex + 1,
      }));
      let insertedModules = [];
      if (modulePayload.length > 0) {
        const moduleResult = await client.query(
          `INSERT INTO catalogue.course_modules
             (course_id, module_code, title, description, learning_path_title,
              learning_path_description, display_order)
           SELECT $1, item.module_code, item.title, item.description,
                  item.learning_path_title, item.learning_path_description, item.display_order
           FROM jsonb_to_recordset($2::jsonb)
             AS item(
               module_code text,
               title text,
               description text,
               learning_path_title text,
               learning_path_description text,
               display_order integer
             )
           ORDER BY item.display_order
           RETURNING id, display_order`,
          [course.courseId, JSON.stringify(modulePayload)],
        );
        insertedModules = moduleResult.rows;
      }

      const moduleIdByOrder = new Map(
        insertedModules.map((module) => [module.display_order, module.id]),
      );
      const outcomePayload = course.modules.flatMap((module, moduleIndex) => {
        const moduleId = moduleIdByOrder.get(moduleIndex + 1);
        return [
          ...module.learningObjectives.map((outcome, outcomeIndex) => ({
            module_id: moduleId,
            outcome_type: 'learning_objective',
            outcome,
            display_order: outcomeIndex + 1,
          })),
          ...module.topics.map((outcome, outcomeIndex) => ({
            module_id: moduleId,
            outcome_type: 'topic',
            outcome,
            display_order: outcomeIndex + 1,
          })),
          ...module.labs.map((outcome, outcomeIndex) => ({
            module_id: moduleId,
            outcome_type: 'lab',
            outcome,
            display_order: outcomeIndex + 1,
          })),
        ];
      });
      if (outcomePayload.length > 0) {
        await client.query(
          `INSERT INTO catalogue.module_learning_outcomes
             (module_id, outcome_type, outcome, display_order)
           SELECT item.module_id,
                  item.outcome_type::catalogue.learning_item_type,
                  item.outcome,
                  item.display_order
           FROM jsonb_to_recordset($1::jsonb)
             AS item(
               module_id bigint,
               outcome_type text,
               outcome text,
               display_order integer
             )`,
          [JSON.stringify(outcomePayload)],
        );
      }

      await client.query(
        `UPDATE catalogue.import_rows
         SET status = 'imported'
         WHERE batch_id = $1 AND row_number = $2`,
        [batchId, index + 1],
      );
    }

    await client.query(
      `UPDATE catalogue.courses
       SET status = 'published', published_at = now()
       WHERE course_id = ANY($1::text[])`,
      [courses.map((course) => course.courseId)],
    );
    await client.query(
      `UPDATE catalogue.import_batches
       SET status = 'completed', valid_rows = $2, imported_rows = $2,
           completed_at = now(), metadata = $3::jsonb
       WHERE id = $1`,
      [
        batchId,
        courses.length,
        JSON.stringify({
          category: 'certifications',
          provider: 'Microsoft',
          skipped_existing_codes: skippedExistingCodes,
          skipped_invalid_files: invalidSources,
        }),
      ],
    );
    await client.query('COMMIT');
    console.log(`Imported ${courses.length} Microsoft certification courses in batch ${batchId}.`);
    for (const course of courses) {
      console.log(`${course.courseCode}: ${course.title} (${course.modules.length} modules)`);
    }
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
