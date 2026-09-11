import 'dotenv/config';
import { closePool, getPool } from '../server/database.mjs';

const pool = getPool();

try {
  const result = await pool.query(`
    SELECT id, status, total_rows, valid_rows, invalid_rows, imported_rows,
           error_message, started_at, completed_at
    FROM catalogue.import_batches
    ORDER BY id DESC
    LIMIT 5
  `);
  const activity = await pool.query(`
    SELECT pid, state, wait_event_type, wait_event, query_start,
           left(regexp_replace(query, '\\s+', ' ', 'g'), 160) AS query
    FROM pg_stat_activity
    WHERE datname = current_database()
      AND pid <> pg_backend_pid()
    ORDER BY query_start DESC NULLS LAST
  `);
  console.log(JSON.stringify({ batches: result.rows, activity: activity.rows }, null, 2));
} finally {
  await closePool();
}
