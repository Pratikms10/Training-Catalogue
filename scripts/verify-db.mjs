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
    WHERE c.course_id = 'AB-6002'
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

  console.log(JSON.stringify({
    catalogue: result.rows[0],
    tt0003: detailResult.rows[0] || null,
    rb0001: roleResult.rows[0] || null,
    ab6002: certificationResult.rows[0] || null,
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
      && (certificationResult.rows[0]?.provider !== 'Microsoft' || certificationResult.rows[0]?.modules !== 7)) {
    throw new Error('AB-6002 did not match the expected Microsoft certification structure.');
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
