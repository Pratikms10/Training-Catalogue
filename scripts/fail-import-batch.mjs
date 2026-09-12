import 'dotenv/config';
import { closePool, getPool } from '../server/database.mjs';

const batchId = process.argv[2];
const failureReason = process.argv.slice(3).join(' ').trim()
  || 'Importer process was stopped before the batch completed.';
if (!/^\d+$/.test(batchId || '')) {
  throw new Error('Usage: node scripts/fail-import-batch.mjs <batch-id>');
}

const pool = getPool();
try {
  const result = await pool.query(
    `UPDATE catalogue.import_batches
     SET status = 'failed',
         error_message = $2,
         completed_at = now()
     WHERE id = $1
       AND status IN ('uploaded', 'validating', 'validated', 'importing')
       AND completed_at IS NULL
     RETURNING id, status, error_message`,
    [batchId, failureReason],
  );
  if (result.rowCount !== 1) {
    throw new Error(`Batch ${batchId} is not an active unfinished batch.`);
  }
  console.log(JSON.stringify(result.rows[0], null, 2));
} finally {
  await closePool();
}
