import 'dotenv/config';
import { closePool, getPool } from '../server/database.mjs';

const pool = getPool();
try {
  const schema = await pool.query(`
    SELECT to_regclass('leads.enquiries') AS enquiries,
           to_regclass('leads.crm_outbox') AS crm_outbox
  `);
  if (!schema.rows[0].enquiries || !schema.rows[0].crm_outbox) {
    throw new Error('Lead storage is not ready. Apply database migration 007 first.');
  }
  const totals = await pool.query(`
    SELECT (SELECT count(*)::integer FROM leads.enquiries) AS enquiries,
           (SELECT count(*)::integer FROM leads.crm_outbox WHERE status = 'pending') AS pending,
           (SELECT count(*)::integer FROM leads.crm_outbox WHERE status = 'processing') AS processing,
           (SELECT count(*)::integer FROM leads.crm_outbox WHERE status = 'delivered') AS delivered,
           (SELECT count(*)::integer FROM leads.crm_outbox WHERE status = 'blocked') AS blocked
  `);
  console.log(totals.rows[0]);
} finally {
  await closePool();
}
