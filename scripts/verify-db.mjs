import 'dotenv/config';
import { closePool, getPool } from '../server/database.mjs';

const pool = getPool();

try {
  const result = await pool.query(`
    SELECT
      count(*) FILTER (WHERE status = 'published')::integer AS published_courses,
      count(*) FILTER (WHERE category_code = 'tools-technology' AND status = 'published')::integer AS published_tools_courses,
      count(*) FILTER (WHERE category_code = 'role-based' AND status = 'published')::integer AS published_role_courses
      ,count(*) FILTER (WHERE category_code = 'certifications' AND status = 'published')::integer AS published_certification_courses
      ,count(*) FILTER (WHERE category_code = 'technical-training' AND status = 'published')::integer AS published_technical_training_courses
    FROM catalogue.courses
  `);
  const detailResult = await pool.query(`
    SELECT
      c.course_id,
      count(DISTINCT m.id)::integer AS modules,
      count(DISTINCT s.id)::integer AS scenarios
    FROM catalogue.courses c
    LEFT JOIN catalogue.course_modules m ON m.course_id = c.course_id
    LEFT JOIN catalogue.course_scenarios s ON s.course_id = c.course_id
    WHERE c.course_id = 'TT0003'
    GROUP BY c.course_id
  `);
  const roleResult = await pool.query(`
    SELECT
      c.course_id,
      rb.department,
      count(DISTINCT m.id)::integer AS modules,
      count(DISTINCT s.id)::integer AS scenarios
    FROM catalogue.courses c
    JOIN catalogue.role_based_details rb ON rb.course_id = c.course_id
    LEFT JOIN catalogue.course_modules m ON m.course_id = c.course_id
    LEFT JOIN catalogue.course_scenarios s ON s.course_id = c.course_id
    WHERE c.course_id = 'RB0001'
    GROUP BY c.course_id, rb.department
  `);
  const certificationResult = await pool.query(`
    SELECT
      c.course_id,
      cert.provider,
      cert.course_code,
      count(DISTINCT m.id)::integer AS modules
    FROM catalogue.courses c
    JOIN catalogue.certification_details cert ON cert.course_id = c.course_id
    LEFT JOIN catalogue.course_modules m ON m.course_id = c.course_id
    WHERE cert.provider = 'Microsoft' AND cert.course_code = 'AB-6002'
    GROUP BY c.course_id, cert.provider, cert.course_code
  `);
  const technicalResult = await pool.query(`
    SELECT
      count(DISTINCT tech.course_id)::integer AS courses,
      count(DISTINCT tech.source_course_id)::integer AS source_course_ids,
      count(DISTINCT m.id)::integer AS modules,
      count(DISTINCT o.id)::integer AS outcomes
    FROM catalogue.technical_training_details tech
    JOIN catalogue.courses c ON c.course_id = tech.course_id AND c.status = 'published'
    LEFT JOIN catalogue.course_modules m ON m.course_id = tech.course_id
    LEFT JOIN catalogue.module_learning_outcomes o ON o.module_id = m.id
  `);
  const duplicateTechnicalSources = await pool.query(`
    SELECT source_course_id
    FROM catalogue.technical_training_details
    GROUP BY source_course_id
    HAVING count(*) > 1
  `);
  const certificationIdentityResult = await pool.query(`
    SELECT
      count(*)::integer AS courses,
      count(*) FILTER (WHERE c.course_id ~ '^CER[0-9]{4,}$')::integer AS valid_catalogue_ids,
      count(DISTINCT (cert.provider, cert.course_code))::integer AS unique_provider_codes,
      count(mapping.old_course_id)::integer AS migrated_aliases
    FROM catalogue.courses c
    JOIN catalogue.certification_details cert ON cert.course_id = c.course_id
    LEFT JOIN catalogue.certification_id_mappings mapping ON mapping.new_course_id = c.course_id
    WHERE c.category_code = 'certifications'
  `);
  const certificationWorkbookResult = await pool.query(`
    SELECT
      count(*) FILTER (WHERE cert.record_kind = 'credential')::integer AS credentials,
      count(DISTINCT cert.source_global_id) FILTER (WHERE cert.record_kind = 'credential')::integer AS source_global_ids,
      count(DISTINCT (cert.provider, cert.provider_certification_id)) FILTER (WHERE cert.record_kind = 'credential')::integer AS provider_certification_ids,
      count(DISTINCT cert.provider) FILTER (WHERE cert.record_kind = 'credential')::integer AS providers,
      count(*) FILTER (WHERE cert.record_kind = 'credential' AND cert.provider = 'Oracle')::integer AS oracle_credentials,
      count(*) FILTER (WHERE cert.record_kind = 'credential' AND cert.provider = 'Oracle' AND cert.credential_type = 'Assessment')::integer AS oracle_assessments,
      count(*) FILTER (WHERE cert.record_kind = 'credential' AND cert.provider = 'Oracle' AND cert.credential_type = 'Exam')::integer AS oracle_exams,
      (SELECT count(*)::integer
       FROM catalogue.courses certification_course
       WHERE certification_course.category_code = 'certifications'
         AND nullif(btrim(certification_course.summary), '') IS NULL) AS missing_summaries,
      (SELECT count(*)::integer FROM catalogue.certification_exams) AS exams,
      (SELECT count(*)::integer FROM catalogue.certification_objectives) AS objectives,
      (SELECT count(*)::integer FROM catalogue.certification_requirements) AS requirements,
      (SELECT count(*)::integer FROM catalogue.certification_training_resources) AS training_resources,
      (SELECT count(*)::integer FROM catalogue.certification_lifecycle_items) AS lifecycle_items
    FROM catalogue.certification_details cert
  `);

  console.log(JSON.stringify({
    catalogue: result.rows[0],
    tt0003: detailResult.rows[0] || null,
    rb0001: roleResult.rows[0] || null,
    certificationSample: certificationResult.rows[0] || null,
    certificationIdentity: certificationIdentityResult.rows[0],
    certificationWorkbook: certificationWorkbookResult.rows[0],
    technicalTraining: {
      ...technicalResult.rows[0],
      duplicateSourceCourseIds: duplicateTechnicalSources.rowCount,
    },
  }, null, 2));
  if (result.rows[0].published_tools_courses < 10) {
    throw new Error('Expected at least 10 published Tools courses after the pilot import.');
  }
  if (detailResult.rows[0]?.modules !== 12 || detailResult.rows[0]?.scenarios !== 2) {
    throw new Error('TT0003 did not match the expected 12 modules and 2 scenarios.');
  }
  if (roleResult.rows[0]?.department !== 'Human Resources' || roleResult.rows[0]?.modules !== 6 || roleResult.rows[0]?.scenarios !== 2) {
    throw new Error('RB0001 did not match the expected Human Resources pilot structure.');
  }
  if (result.rows[0].published_certification_courses > 0
      && (certificationResult.rows[0]?.provider !== 'Microsoft'
        || !/^CER\d{4,}$/.test(certificationResult.rows[0]?.course_id || '')
        || certificationResult.rows[0]?.modules !== 7)) {
    throw new Error('The AB-6002 provider reference did not resolve to the expected CER certification structure.');
  }
  if (certificationIdentityResult.rows[0].courses !== certificationIdentityResult.rows[0].valid_catalogue_ids
      || certificationIdentityResult.rows[0].courses !== certificationIdentityResult.rows[0].unique_provider_codes) {
    throw new Error('Certification catalogue IDs or provider code uniqueness did not validate.');
  }
  if (certificationWorkbookResult.rows[0].credentials < 499
      || certificationWorkbookResult.rows[0].source_global_ids !== certificationWorkbookResult.rows[0].credentials
      || certificationWorkbookResult.rows[0].provider_certification_ids !== certificationWorkbookResult.rows[0].credentials
      || certificationWorkbookResult.rows[0].providers < 9
      || certificationWorkbookResult.rows[0].oracle_credentials !== 197
      || certificationWorkbookResult.rows[0].oracle_assessments !== 36
      || certificationWorkbookResult.rows[0].oracle_exams !== 1
      || certificationWorkbookResult.rows[0].missing_summaries !== 0) {
    throw new Error('Certification workbook identities or Oracle import counts did not validate.');
  }
  if (technicalResult.rows[0]?.courses !== 141
      || technicalResult.rows[0]?.source_course_ids !== 141
      || technicalResult.rows[0]?.modules !== 1330
      || duplicateTechnicalSources.rowCount !== 0) {
    throw new Error('Technical Training import counts or source ID uniqueness did not match the workbook.');
  }
} finally {
  await closePool();
}
