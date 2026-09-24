import 'dotenv/config';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { closePool, getPool } from '../server/database.mjs';
import { parseCertificationWorkbook } from '../server/certificationWorkbookParser.mjs';

const inputArgument = process.argv[2];
if (!inputArgument || process.argv.length > 3) {
  throw new Error('Usage: npm run db:import:certifications:xlsx -- <workbook.xlsx>');
}

const inputPath = path.resolve(inputArgument);
if (path.extname(inputPath).toLowerCase() !== '.xlsx') {
  throw new Error('Certification workbook must be an .xlsx file.');
}

const inputBytes = await fs.readFile(inputPath);
const checksum = createHash('sha256').update(inputBytes).digest('hex');
const parsed = await parseCertificationWorkbook(inputPath);
const courses = parsed.courses;

if (courses.length === 0) throw new Error('The workbook did not contain certification records.');
const sourceIds = new Set();
const providerIds = new Set();
for (const course of courses) {
  if (sourceIds.has(course.sourceGlobalId)) {
    throw new Error(`Duplicate source Global ID: ${course.sourceGlobalId}`);
  }
  sourceIds.add(course.sourceGlobalId);
  const providerIdentity = `${course.provider}\u0000${course.providerCertificationId}`;
  if (providerIds.has(providerIdentity)) {
    throw new Error(`Duplicate provider certification ID: ${course.provider} ${course.providerCertificationId}`);
  }
  providerIds.add(providerIdentity);
}

const vendorCounts = Object.fromEntries(Object.entries(Object.groupBy(courses, (course) => course.provider))
  .map(([provider, providerCourses]) => [provider, providerCourses.length]));
const pool = getPool();
let batchId;

function makeRows(course, courseId, importRowNumber) {
  return {
    importRow: {
      sheet_name: course.sourceSheet || 'Certification_Master',
      // Source sequences restart for each vendor in multi-provider workbooks.
      // Use the parser's stable course order for the batch audit row instead,
      // so the import_rows (sheet_name, row_number) key remains unique.
      row_number: importRowNumber,
      course_id: courseId,
      payload: course,
    },
    courseRow: {
      course_id: courseId,
      title: course.title,
      level_code: course.level,
      duration_minutes: course.durationMinutes,
      format: course.credentialType || 'Certification',
      delivery: course.examFormatDelivery,
      approach: course.credentialClassification,
      summary: course.summary,
      source_reference: `import-batch:${batchId}:${course.sourceGlobalId}`,
    },
    detailRow: {
      course_id: courseId,
      provider: course.provider,
      course_code: course.providerCertificationId,
      exam_code: course.primaryExamCode,
      course_url: course.courseUrl,
      source_sequence: course.sourceSequence
        ?? Number.parseInt(course.sourceGlobalId.replace(/\D/g, ''), 10),
      product_technologies: course.productTechnologies,
      roles: course.audiences,
      subjects: course.skills,
      language_codes: course.languages,
      certification_information: course.summary,
      additional_information: course.requiredExamPathway,
      record_kind: 'credential',
      source_global_id: course.sourceGlobalId,
      provider_certification_id: course.providerCertificationId,
      course_code_public: false,
      credential_type: course.credentialType,
      credential_classification: course.credentialClassification,
      credential_status: course.credentialStatus,
      credential_level: course.credentialLevel,
      category_track: course.categoryTrack,
      exam_format_delivery: course.examFormatDelivery,
      exam_duration_text: course.examDurationText,
      time_limit_text: course.timeLimitText,
      price_text: course.priceText,
      retake_fee_text: course.retakeFeeText,
      validity_renewal: course.validityRenewal,
      required_exam_pathway: course.requiredExamPathway,
      source_qc_status: course.sourceQcStatus,
      raw_payload: course.rawPayload,
    },
  };
}

try {
  const batchResult = await pool.query(
    `INSERT INTO catalogue.import_batches
       (original_file_name, source_checksum_sha256, uploaded_by, mode, status, total_rows, metadata)
     VALUES ($1, $2, $3, 'upsert', 'validating', $4, $5::jsonb)
     RETURNING id`,
    [
      path.basename(inputPath),
      checksum,
      process.env.IMPORT_ACTOR?.trim() || 'local-admin',
      courses.length,
      JSON.stringify({
        workbookRows: courses.length + parsed.duplicatesRemoved,
        uniqueCertifications: courses.length,
        duplicatesRemoved: parsed.duplicatesRemoved,
        vendors: vendorCounts,
        unmappedSupportingRows: parsed.unmappedSupportingRows,
      }),
    ],
  );
  batchId = batchResult.rows[0].id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("SELECT pg_advisory_xact_lock(hashtext('catalogue.certification.course-id'))");

    const existingResult = await client.query(
      `SELECT course_id, source_global_id, provider, provider_certification_id
       FROM catalogue.certification_details
       WHERE source_global_id = ANY($1::text[])
          OR provider_certification_id = ANY($2::text[])`,
      [
        courses.map((course) => course.sourceGlobalId),
        courses.map((course) => course.providerCertificationId),
      ],
    );
    const bySourceId = new Map(existingResult.rows
      .filter((row) => row.source_global_id)
      .map((row) => [row.source_global_id, row.course_id]));
    const byProviderId = new Map(existingResult.rows
      .filter((row) => row.provider_certification_id)
      .map((row) => [`${row.provider}\u0000${row.provider_certification_id}`, row.course_id]));
    const maxSequenceResult = await client.query(
      `SELECT COALESCE(max(substring(course_id FROM 4)::integer), 0)::integer AS max_sequence
       FROM catalogue.courses
       WHERE category_code = 'certifications'
         AND course_id ~ '^CER[0-9]{4,}$'`,
    );
    let nextSequence = maxSequenceResult.rows[0].max_sequence;

    const assignedCourses = courses.map((course) => {
      const existingCourseId = bySourceId.get(course.sourceGlobalId)
        || byProviderId.get(`${course.provider}\u0000${course.providerCertificationId}`);
      if (existingCourseId) return { course, courseId: existingCourseId };
      nextSequence += 1;
      return { course, courseId: `CER${String(nextSequence).padStart(4, '0')}` };
    });
    const rows = assignedCourses.map(({ course, courseId }, index) => makeRows(course, courseId, index + 2));
    const courseIds = rows.map((row) => row.courseRow.course_id);

    await client.query(
      `INSERT INTO catalogue.import_rows
         (batch_id, sheet_name, row_number, course_id, status, payload)
       SELECT $1, item.sheet_name, item.row_number, item.course_id, 'imported', item.payload
       FROM jsonb_to_recordset($2::jsonb)
         AS item(sheet_name text, row_number integer, course_id text, payload jsonb)`,
      [batchId, JSON.stringify(rows.map((row) => row.importRow))],
    );

    await client.query(
      `INSERT INTO catalogue.courses
         (course_id, category_code, title, level_code, duration_minutes, format, delivery,
          approach, summary, status, source_reference, published_at)
       SELECT item.course_id, 'certifications', item.title, item.level_code,
              item.duration_minutes, item.format, item.delivery, item.approach, item.summary,
              'published', item.source_reference, now()
       FROM jsonb_to_recordset($1::jsonb)
         AS item(
           course_id text, title text, level_code text, duration_minutes integer,
           format text, delivery text, approach text, summary text, source_reference text
         )
       ON CONFLICT (course_id) DO UPDATE SET
         category_code = EXCLUDED.category_code,
         title = EXCLUDED.title,
         level_code = EXCLUDED.level_code,
         duration_minutes = EXCLUDED.duration_minutes,
         format = EXCLUDED.format,
         delivery = EXCLUDED.delivery,
         approach = EXCLUDED.approach,
         summary = EXCLUDED.summary,
         status = 'published',
         source_reference = EXCLUDED.source_reference,
         published_at = COALESCE(catalogue.courses.published_at, now()),
         updated_at = now()`,
      [JSON.stringify(rows.map((row) => row.courseRow))],
    );

    await client.query(
      `INSERT INTO catalogue.certification_details
         (course_id, provider, course_code, exam_code, course_url, source_sequence,
          product_technologies, roles, subjects, language_codes, certification_information,
          additional_information, record_kind, source_global_id, provider_certification_id,
          course_code_public, credential_type, credential_classification, credential_status,
          credential_level, category_track, exam_format_delivery, exam_duration_text,
          time_limit_text, price_text, retake_fee_text, validity_renewal,
          required_exam_pathway, source_qc_status, raw_payload)
       SELECT item.*
       FROM jsonb_to_recordset($1::jsonb)
         AS item(
           course_id text, provider text, course_code text, exam_code text, course_url text,
           source_sequence integer, product_technologies text[], roles text[], subjects text[],
           language_codes text[], certification_information text, additional_information text,
           record_kind text, source_global_id text, provider_certification_id text,
           course_code_public boolean, credential_type text, credential_classification text,
           credential_status text, credential_level text, category_track text,
           exam_format_delivery text, exam_duration_text text, time_limit_text text,
           price_text text, retake_fee_text text, validity_renewal text,
           required_exam_pathway text, source_qc_status text, raw_payload jsonb
         )
       ON CONFLICT (course_id) DO UPDATE SET
         provider = EXCLUDED.provider,
         course_code = EXCLUDED.course_code,
         exam_code = EXCLUDED.exam_code,
         course_url = EXCLUDED.course_url,
         source_sequence = EXCLUDED.source_sequence,
         product_technologies = EXCLUDED.product_technologies,
         roles = EXCLUDED.roles,
         subjects = EXCLUDED.subjects,
         language_codes = EXCLUDED.language_codes,
         certification_information = EXCLUDED.certification_information,
         additional_information = EXCLUDED.additional_information,
         record_kind = EXCLUDED.record_kind,
         source_global_id = EXCLUDED.source_global_id,
         provider_certification_id = EXCLUDED.provider_certification_id,
         course_code_public = EXCLUDED.course_code_public,
         credential_type = EXCLUDED.credential_type,
         credential_classification = EXCLUDED.credential_classification,
         credential_status = EXCLUDED.credential_status,
         credential_level = EXCLUDED.credential_level,
         category_track = EXCLUDED.category_track,
         exam_format_delivery = EXCLUDED.exam_format_delivery,
         exam_duration_text = EXCLUDED.exam_duration_text,
         time_limit_text = EXCLUDED.time_limit_text,
         price_text = EXCLUDED.price_text,
         retake_fee_text = EXCLUDED.retake_fee_text,
         validity_renewal = EXCLUDED.validity_renewal,
         required_exam_pathway = EXCLUDED.required_exam_pathway,
         source_qc_status = EXCLUDED.source_qc_status,
         raw_payload = EXCLUDED.raw_payload`,
      [JSON.stringify(rows.map((row) => row.detailRow))],
    );

    for (const tableName of [
      'course_objectives',
      'course_audiences',
      'course_prerequisites',
      'course_related_skills',
      'course_tools',
      'certification_exams',
      'certification_objectives',
      'certification_requirements',
      'certification_training_resources',
      'certification_lifecycle_items',
    ]) {
      await client.query(`DELETE FROM catalogue.${tableName} WHERE course_id = ANY($1::text[])`, [courseIds]);
    }

    const uniqueStrings = (values) => [...new Map(values
      .filter(Boolean)
      .map((value) => [value.toLocaleLowerCase(), value])).values()];
    const orderedValues = (selector, valueName) => assignedCourses.flatMap(({ course, courseId }) => (
      uniqueStrings(selector(course)).map((value, index) => ({
        course_id: courseId,
        [valueName]: value,
        display_order: index + 1,
      }))
    ));
    const genericInserts = [
      ['course_objectives', 'objective', orderedValues(
        (course) => course.objectives.map((objective) => objective.objective), 'objective',
      )],
      ['course_audiences', 'audience', orderedValues((course) => course.audiences, 'audience')],
      ['course_prerequisites', 'prerequisite', orderedValues(
        (course) => course.requirements.map((requirement) => requirement.requirement), 'prerequisite',
      )],
      ['course_related_skills', 'skill', orderedValues((course) => course.skills, 'skill')],
      ['course_tools', 'tool_name', orderedValues(
        (course) => course.productTechnologies, 'tool_name',
      )],
    ];
    for (const [tableName, valueColumn, values] of genericInserts) {
      if (values.length === 0) continue;
      await client.query(
        `INSERT INTO catalogue.${tableName} (course_id, ${valueColumn}, display_order)
         SELECT item.course_id, item.value, item.display_order
         FROM jsonb_to_recordset($1::jsonb)
           AS item(course_id text, value text, display_order integer)`,
        [JSON.stringify(values.map((value) => ({
          course_id: value.course_id,
          value: value[valueColumn],
          display_order: value.display_order,
        })))],
      );
    }

    const examRows = assignedCourses.flatMap(({ course, courseId }) => course.exams.map((exam, index) => ({
      course_id: courseId,
      exam_code: exam.examCode,
      exam_name: exam.examName,
      exam_status: exam.examStatus,
      requirement_type: exam.requirementType,
      duration_minutes: exam.durationMinutes,
      duration_text: exam.durationText,
      delivery_format: exam.deliveryFormat,
      delivery_provider: exam.deliveryProvider,
      proctored: exam.proctored,
      languages: exam.languages,
      price: exam.price,
      currency: exam.currency,
      passing_score: exam.passingScore,
      exam_url: exam.examUrl,
      notes: exam.notes,
      display_order: index + 1,
    })));
    if (examRows.length) {
      await client.query(
        `INSERT INTO catalogue.certification_exams
           (course_id, exam_code, exam_name, exam_status, requirement_type, duration_minutes,
            duration_text, delivery_format, delivery_provider, proctored, languages, price,
            currency, passing_score, exam_url, notes, display_order)
         SELECT item.* FROM jsonb_to_recordset($1::jsonb)
           AS item(
             course_id text, exam_code text, exam_name text, exam_status text,
             requirement_type text, duration_minutes integer, duration_text text,
             delivery_format text, delivery_provider text, proctored text, languages text[],
             price text, currency text, passing_score text, exam_url text, notes text,
             display_order integer
           )`,
        [JSON.stringify(examRows)],
      );
    }

    const objectiveRows = assignedCourses.flatMap(({ course, courseId }) => course.objectives.map((objective, index) => ({
      course_id: courseId,
      group_title: objective.groupTitle,
      objective: objective.objective,
      weight: objective.weight,
      objective_level: objective.objectiveLevel,
      objective_code: objective.objectiveCode,
      display_order: index + 1,
    })));
    if (objectiveRows.length) {
      await client.query(
        `INSERT INTO catalogue.certification_objectives
           (course_id, group_title, objective, weight, objective_level, objective_code, display_order)
         SELECT item.* FROM jsonb_to_recordset($1::jsonb)
           AS item(
             course_id text, group_title text, objective text, weight text,
             objective_level text, objective_code text, display_order integer
           )`,
        [JSON.stringify(objectiveRows)],
      );
    }

    const requirementRows = assignedCourses.flatMap(({ course, courseId }) => course.requirements.map((requirement, index) => ({
      course_id: courseId,
      requirement_type: requirement.requirementType,
      requirement_group: requirement.requirementGroup,
      requirement: requirement.requirement,
      requirement_url: requirement.requirementUrl,
      qualifier: requirement.qualifier,
      notes: requirement.notes,
      display_order: index + 1,
    })));
    if (requirementRows.length) {
      await client.query(
        `INSERT INTO catalogue.certification_requirements
           (course_id, requirement_type, requirement_group, requirement, requirement_url,
            qualifier, notes, display_order)
         SELECT item.* FROM jsonb_to_recordset($1::jsonb)
           AS item(
             course_id text, requirement_type text, requirement_group text, requirement text,
             requirement_url text, qualifier text, notes text, display_order integer
           )`,
        [JSON.stringify(requirementRows)],
      );
    }

    const resourceRows = assignedCourses.flatMap(({ course, courseId }) => course.resources.map((resource, index) => ({
      course_id: courseId,
      resource_type: resource.resourceType,
      title: resource.title,
      resource_url: resource.resourceUrl,
      duration_text: resource.durationText,
      item_count: resource.itemCount,
      relationship: resource.relationship,
      notes: resource.notes,
      display_order: index + 1,
    })));
    if (resourceRows.length) {
      await client.query(
        `INSERT INTO catalogue.certification_training_resources
           (course_id, resource_type, title, resource_url, duration_text, item_count,
            relationship, notes, display_order)
         SELECT item.* FROM jsonb_to_recordset($1::jsonb)
           AS item(
             course_id text, resource_type text, title text, resource_url text,
             duration_text text, item_count text, relationship text, notes text,
             display_order integer
           )`,
        [JSON.stringify(resourceRows)],
      );
    }

    const lifecycleRows = assignedCourses.flatMap(({ course, courseId }) => course.lifecycle.map((item, index) => ({
      course_id: courseId,
      record_type: item.recordType,
      status: item.status,
      validity_renewal: item.validityRenewal,
      retirement_transition: item.retirementTransition,
      details: item.details,
      scenario: item.scenario,
      option_text: item.option,
      action_text: item.action,
      outcome: item.outcome,
      display_order: index + 1,
    })));
    if (lifecycleRows.length) {
      await client.query(
        `INSERT INTO catalogue.certification_lifecycle_items
           (course_id, record_type, status, validity_renewal, retirement_transition,
            details, scenario, option_text, action_text, outcome, display_order)
         SELECT item.* FROM jsonb_to_recordset($1::jsonb)
           AS item(
             course_id text, record_type text, status text, validity_renewal text,
             retirement_transition text, details text, scenario text, option_text text,
             action_text text, outcome text, display_order integer
           )`,
        [JSON.stringify(lifecycleRows)],
      );
    }

    await client.query(
      `UPDATE catalogue.import_batches
       SET status = 'completed', valid_rows = $2, imported_rows = $2,
           completed_at = now(), error_message = NULL
       WHERE id = $1`,
      [batchId, courses.length],
    );
    await client.query('COMMIT');

    console.log(JSON.stringify({
      batchId,
      imported: courses.length,
      duplicatesRemoved: parsed.duplicatesRemoved,
      vendors: vendorCounts,
      firstCourseId: assignedCourses[0].courseId,
      lastCourseId: assignedCourses.at(-1).courseId,
      unmappedSupportingRows: parsed.unmappedSupportingRows,
    }, null, 2));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
} catch (error) {
  if (batchId) {
    await pool.query(
      `UPDATE catalogue.import_batches
       SET status = 'failed', completed_at = now(), error_message = $2
       WHERE id = $1`,
      [batchId, error.message],
    ).catch(() => {});
  }
  throw error;
} finally {
  await closePool();
}
