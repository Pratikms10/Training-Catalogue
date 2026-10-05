import { randomUUID } from 'node:crypto';

/** Claim a bounded batch for a future CRM connector. Nothing is sent here. */
export async function claimCrmBatch(pool, { limit = 25, leaseSeconds = 120 } = {}) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new Error('Invalid CRM batch limit.');
  if (!Number.isInteger(leaseSeconds) || leaseSeconds < 30 || leaseSeconds > 3600) throw new Error('Invalid CRM lease duration.');
  const leaseToken = randomUUID();
  const result = await pool.query(`
    WITH ready AS (
      SELECT id
      FROM leads.crm_outbox
      WHERE (status = 'pending' AND next_attempt_at <= now())
         OR (status = 'processing' AND leased_until < now())
      ORDER BY id
      FOR UPDATE SKIP LOCKED
      LIMIT $1
    ), claimed AS (
      UPDATE leads.crm_outbox AS outbox
      SET status = 'processing', lease_token = $2::uuid,
          leased_until = now() + ($3::integer * interval '1 second'),
          attempts = attempts + 1, updated_at = now()
      FROM ready
      WHERE outbox.id = ready.id
      RETURNING outbox.id, outbox.submission_id, outbox.attempts, outbox.lease_token
    )
    SELECT claimed.id, claimed.attempts, claimed.lease_token,
           to_jsonb(enquiry) AS enquiry
    FROM claimed
    JOIN leads.enquiries AS enquiry ON enquiry.submission_id = claimed.submission_id
    ORDER BY claimed.id
  `, [limit, leaseToken, leaseSeconds]);
  return result.rows;
}

export async function markCrmDelivered(pool, { id, leaseToken, crmRecordId = '' }) {
  const result = await pool.query(`
    UPDATE leads.crm_outbox
    SET status = 'delivered', crm_record_id = $3, delivered_at = now(),
        lease_token = NULL, leased_until = NULL, last_error = NULL, updated_at = now()
    WHERE id = $1 AND lease_token = $2::uuid AND status = 'processing'
    RETURNING id
  `, [id, leaseToken, crmRecordId]);
  return result.rowCount === 1;
}

export async function markCrmFailed(pool, { id, leaseToken, reason, retryAfterSeconds = 300, permanent = false }) {
  if (!Number.isInteger(retryAfterSeconds) || retryAfterSeconds < 0 || retryAfterSeconds > 86_400) {
    throw new Error('Invalid CRM retry delay.');
  }
  const result = await pool.query(`
    UPDATE leads.crm_outbox
    SET status = CASE WHEN $4::boolean THEN 'blocked' ELSE 'pending' END,
        next_attempt_at = now() + ($5::integer * interval '1 second'),
        last_error = left($3, 500), lease_token = NULL, leased_until = NULL,
        updated_at = now()
    WHERE id = $1 AND lease_token = $2::uuid AND status = 'processing'
    RETURNING id
  `, [id, leaseToken, String(reason || 'CRM delivery failed.'), permanent, retryAfterSeconds]);
  return result.rowCount === 1;
}
