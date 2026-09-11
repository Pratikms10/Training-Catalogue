import 'dotenv/config';
import { closePool, getPool } from '../server/database.mjs';

const pool = getPool();

try {
  const result = await pool.query(`
    SELECT
      count(*) FILTER (WHERE status = 'published')::integer AS published_courses,
      count(*) FILTER (WHERE category_code = 'tools-technology' AND status = 'published')::integer AS published_tools_courses,
      count(*) FILTER (WHERE category_code = 'role-based' AND status = 'published')::integer AS published_role_courses
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

  console.log(JSON.stringify({
    catalogue: result.rows[0],
    tt0003: detailResult.rows[0] || null,
    rb0001: roleResult.rows[0] || null,
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
} finally {
  await closePool();
}
