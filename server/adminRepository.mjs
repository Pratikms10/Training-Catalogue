const enquiryStatuses = new Set(['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost', 'spam']);
const priorities = new Set(['low', 'normal', 'high', 'urgent']);

function positiveInteger(value, fallback, maximum = 100) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, maximum);
}

export async function getAdminDashboard(pool) {
  const [enquiries, blogs, comments, contactActions, crm, upcoming, audit, email] = await Promise.all([
    pool.query(`
      SELECT
        count(*) FILTER (WHERE archived_at IS NULL)::integer AS total,
        count(*) FILTER (WHERE archived_at IS NULL AND is_read = false)::integer AS unread,
        count(*) FILTER (WHERE archived_at IS NULL AND status = 'new')::integer AS new,
        count(*) FILTER (WHERE archived_at IS NULL AND follow_up_at <= now())::integer AS follow_up_due,
        count(*) FILTER (WHERE received_at >= current_date)::integer AS today,
        count(*) FILTER (WHERE received_at >= now() - interval '7 days')::integer AS seven_days,
        count(*) FILTER (WHERE received_at >= now() - interval '30 days')::integer AS thirty_days,
        count(*) FILTER (WHERE status = 'contacted')::integer AS contacted,
        count(*) FILTER (WHERE status = 'qualified')::integer AS qualified,
        count(*) FILTER (WHERE status = 'proposal_sent')::integer AS proposal_sent,
        count(*) FILTER (WHERE status = 'won')::integer AS won,
        count(*) FILTER (WHERE status = 'lost')::integer AS lost
      FROM leads.enquiries
    `),
    pool.query(`
      SELECT
        count(*) FILTER (WHERE status = 'draft')::integer AS drafts,
        count(*) FILTER (WHERE status = 'scheduled')::integer AS scheduled,
        count(*) FILTER (WHERE status = 'published')::integer AS published,
        count(*) FILTER (WHERE status = 'archived')::integer AS archived
      FROM content.blog_posts
    `),
    pool.query(`SELECT count(*)::integer AS pending FROM content.blog_comments WHERE status = 'pending'`),
    pool.query(`
      SELECT channel, count(*)::integer AS count
      FROM leads.contact_actions WHERE occurred_at > now() - interval '30 days'
      GROUP BY channel ORDER BY channel
    `),
    pool.query(`
      SELECT status, count(*)::integer AS count
      FROM leads.crm_outbox GROUP BY status ORDER BY status
    `),
    pool.query(`
      SELECT post_id, slug, title, publish_at
      FROM content.blog_posts
      WHERE status = 'scheduled' AND publish_at > now()
      ORDER BY publish_at LIMIT 8
    `),
    pool.query(`
      SELECT id, actor_email, action, entity_type, entity_id, metadata, occurred_at
      FROM admin.audit_log ORDER BY occurred_at DESC LIMIT 12
    `),
    pool.query(`
      SELECT status, count(*)::integer AS count
      FROM admin.email_deliveries WHERE created_at > now() - interval '30 days'
      GROUP BY status
    `),
  ]);
  return {
    enquiries: enquiries.rows[0],
    blogs: blogs.rows[0],
    comments: comments.rows[0],
    contactActions: Object.fromEntries(contactActions.rows.map((row) => [row.channel, row.count])),
    crm: Object.fromEntries(crm.rows.map((row) => [row.status, row.count])),
    upcoming: upcoming.rows,
    recentActivity: audit.rows,
    email: Object.fromEntries(email.rows.map((row) => [row.status, row.count])),
  };
}

export async function listEnquiries(pool, options = {}) {
  const page = positiveInteger(options.page, 1, 10_000);
  const pageSize = positiveInteger(options.pageSize, 25, 100);
  const filters = [];
  const values = [];
  const add = (clause, value) => {
    values.push(value);
    filters.push(clause.replace('?', `$${values.length}`));
  };
  if (options.query) {
    values.push(`%${options.query}%`);
    const placeholder = `$${values.length}`;
    filters.push(`(
      e.reference ILIKE ${placeholder} OR e.name ILIKE ${placeholder} OR e.email ILIKE ${placeholder}
      OR e.phone ILIKE ${placeholder} OR e.company ILIKE ${placeholder}
      OR e.course_title ILIKE ${placeholder} OR e.course_id ILIKE ${placeholder}
    )`);
  }
  if (options.status && options.status !== 'all') {
    if (!enquiryStatuses.has(options.status)) throw new Error('Invalid enquiry status.');
    add('e.status = ?', options.status);
  }
  if (options.priority && options.priority !== 'all') {
    if (!priorities.has(options.priority)) throw new Error('Invalid enquiry priority.');
    add('e.priority = ?', options.priority);
  }
  if (options.kind && options.kind !== 'all') add('e.kind = ?', options.kind);
  if (options.source) add('e.source_page = ?', options.source);
  if (options.cta) add('e.cta_id = ?', options.cta);
  if (options.crm && options.crm !== 'all') add("COALESCE(o.status, 'not_queued') = ?", options.crm);
  if (options.from) add('e.received_at >= ?::timestamptz', options.from);
  if (options.to) add('e.received_at < (?::date + interval \'1 day\')', options.to);
  filters.push(options.archived === 'true' ? 'e.archived_at IS NOT NULL' : 'e.archived_at IS NULL');
  const sortColumns = {
    received: 'e.received_at',
    updated: 'e.updated_at',
    followUp: 'e.follow_up_at',
    status: 'e.status',
    priority: 'e.priority',
  };
  const sortColumn = sortColumns[options.sort] || sortColumns.received;
  const direction = options.direction === 'asc' ? 'ASC' : 'DESC';
  values.push(pageSize, (page - 1) * pageSize);
  const result = await pool.query(`
    SELECT e.*,
      o.status AS crm_status, o.attempts AS crm_attempts, o.last_error AS crm_last_error,
      count(*) OVER()::integer AS total
    FROM leads.enquiries e
    LEFT JOIN leads.crm_outbox o ON o.submission_id = e.submission_id AND o.destination = 'internal_crm'
    WHERE ${filters.join(' AND ')}
    ORDER BY ${sortColumn} ${direction} NULLS LAST
    LIMIT $${values.length - 1} OFFSET $${values.length}
  `, values);
  return { data: result.rows, pagination: { page, pageSize, total: result.rows[0]?.total || 0 } };
}

export async function getEnquiry(pool, submissionId) {
  const [enquiry, notes, activity] = await Promise.all([
    pool.query(`
      SELECT e.*, o.status AS crm_status, o.attempts AS crm_attempts,
        o.last_error AS crm_last_error, o.crm_record_id, o.updated_at AS crm_updated_at
      FROM leads.enquiries e
      LEFT JOIN leads.crm_outbox o ON o.submission_id = e.submission_id AND o.destination = 'internal_crm'
      WHERE e.submission_id = $1::uuid
    `, [submissionId]),
    pool.query('SELECT * FROM leads.enquiry_notes WHERE submission_id = $1::uuid ORDER BY created_at DESC', [submissionId]),
    pool.query('SELECT * FROM leads.enquiry_activity WHERE submission_id = $1::uuid ORDER BY created_at DESC', [submissionId]),
  ]);
  return enquiry.rows[0] ? { ...enquiry.rows[0], notes: notes.rows, activity: activity.rows } : null;
}

export async function updateEnquiry(pool, actor, submissionId, body) {
  const current = await pool.query('SELECT * FROM leads.enquiries WHERE submission_id = $1::uuid', [submissionId]);
  if (!current.rows[0]) return null;
  const status = body.status ?? current.rows[0].status;
  const priority = body.priority ?? current.rows[0].priority;
  if (!enquiryStatuses.has(status)) throw new Error('Invalid enquiry status.');
  if (!priorities.has(priority)) throw new Error('Invalid enquiry priority.');
  const tags = [...new Set((Array.isArray(body.tags) ? body.tags : current.rows[0].tags || [])
    .map((tag) => String(tag).trim()).filter(Boolean))].slice(0, 20);
  const followUpAt = body.followUpAt ? new Date(body.followUpAt) : null;
  if (body.followUpAt && Number.isNaN(followUpAt.getTime())) throw new Error('Invalid follow-up date.');
  const archivedAt = body.archived === true ? new Date() : body.archived === false ? null : current.rows[0].archived_at;
  const result = await pool.query(`
    UPDATE leads.enquiries SET
      status = $2, priority = $3, is_read = $4, tags = $5::text[],
      follow_up_at = $6, assigned_to = $7::uuid, archived_at = $8, updated_at = now()
    WHERE submission_id = $1::uuid RETURNING *
  `, [
    submissionId, status, priority,
    body.isRead ?? current.rows[0].is_read,
    tags, followUpAt, actor.authUserId, archivedAt,
  ]);
  const changes = {};
  for (const [key, nextValue] of Object.entries({ status, priority, tags, followUpAt: followUpAt?.toISOString() || null, archivedAt })) {
    const currentKey = key === 'followUpAt' ? 'follow_up_at' : key === 'archivedAt' ? 'archived_at' : key;
    if (JSON.stringify(current.rows[0][currentKey]) !== JSON.stringify(nextValue)) changes[key] = nextValue;
  }
  await pool.query(`
    INSERT INTO leads.enquiry_activity (submission_id, action, details, actor_user_id, actor_email)
    VALUES ($1::uuid, 'enquiry.updated', $2::jsonb, $3::uuid, $4)
  `, [submissionId, JSON.stringify(changes), actor.authUserId, actor.email]);
  return result.rows[0];
}

export async function addEnquiryNote(pool, actor, submissionId, note) {
  const value = String(note || '').trim();
  if (value.length < 2 || value.length > 4000) throw new Error('Enter a note between 2 and 4000 characters.');
  const result = await pool.query(`
    INSERT INTO leads.enquiry_notes (submission_id, note, author_user_id, author_email)
    VALUES ($1::uuid, $2, $3::uuid, $4) RETURNING *
  `, [submissionId, value, actor.authUserId, actor.email]);
  await pool.query(`
    INSERT INTO leads.enquiry_activity (submission_id, action, details, actor_user_id, actor_email)
    VALUES ($1::uuid, 'enquiry.note_added', '{}'::jsonb, $2::uuid, $3)
  `, [submissionId, actor.authUserId, actor.email]);
  return result.rows[0];
}

export async function listAuditLog(pool, { query = '', action = '', page = 1, pageSize = 50 } = {}) {
  const filters = [];
  const values = [];
  if (query) {
    values.push(`%${query}%`);
    filters.push(`(actor_email ILIKE $${values.length} OR entity_type ILIKE $${values.length} OR entity_id ILIKE $${values.length} OR metadata::text ILIKE $${values.length})`);
  }
  if (action) {
    values.push(action);
    filters.push(`action = $${values.length}`);
  }
  values.push(pageSize, (page - 1) * pageSize);
  const result = await pool.query(`
    SELECT *, count(*) OVER()::integer AS total FROM admin.audit_log
    ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
    ORDER BY occurred_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}
  `, values);
  return { data: result.rows, pagination: { page, pageSize, total: result.rows[0]?.total || 0 } };
}

export async function getAdminSettings(pool, authUserId) {
  const profileLookup = await pool.query('SELECT email FROM admin.profiles WHERE auth_user_id = $1::uuid', [authUserId]);
  const emailHash = crypto.createHash('sha256').update(String(profileLookup.rows[0]?.email || '').toLowerCase()).digest('hex');
  const [profile, preferences, sessions, loginHistory, latestEmail, database] = await Promise.all([
    pool.query('SELECT * FROM admin.profiles WHERE auth_user_id = $1::uuid', [authUserId]),
    pool.query('SELECT * FROM admin.notification_preferences WHERE auth_user_id = $1::uuid', [authUserId]),
    pool.query(`
      SELECT session_id, created_at, last_seen_at, expires_at, user_agent,
        revoked_at IS NULL AND expires_at > now() AND last_seen_at > now() - interval '30 minutes' AS active
      FROM admin.sessions WHERE auth_user_id = $1::uuid ORDER BY created_at DESC LIMIT 20
    `, [authUserId]),
    pool.query(`
      SELECT succeeded, occurred_at FROM admin.login_attempts
      WHERE email_hash = $1
      ORDER BY occurred_at DESC LIMIT 20
    `, [emailHash]).catch(() => ({ rows: [] })),
    pool.query('SELECT * FROM admin.email_deliveries ORDER BY created_at DESC LIMIT 1'),
    pool.query('SELECT now() AS checked_at, current_database() AS database'),
  ]);
  return {
    profile: profile.rows[0],
    notifications: preferences.rows[0],
    sessions: sessions.rows,
    loginHistory: loginHistory.rows,
    integrations: {
      crm: { configured: false, state: 'Connection pending' },
      email: { configured: Boolean(process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL_FROM), lastDelivery: latestEmail.rows[0] || null },
      storage: { configured: Boolean(process.env.SUPABASE_STORAGE_BUCKET && process.env.SUPABASE_SERVICE_ROLE_KEY) },
      indexNow: { configured: Boolean(process.env.INDEXNOW_KEY) },
    },
    system: {
      database: { ok: true, ...database.rows[0] },
      scheduler: { ok: true, mode: 'timestamp-driven' },
      catalogueImport: { ok: true },
    },
  };
}

export async function updateAdminProfile(pool, actor, body) {
  const displayName = String(body.displayName ?? actor.displayName).trim().slice(0, 160);
  const defaultAuthor = String(body.defaultAuthor ?? actor.defaultAuthor).trim().slice(0, 160);
  const recipientEmail = String(body.recipientEmail ?? actor.email).trim().toLowerCase().slice(0, 254);
  if (!displayName || !defaultAuthor || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    throw new Error('Enter valid profile and notification details.');
  }
  const profile = await pool.query(`
    UPDATE admin.profiles SET display_name = $2, default_author = $3, updated_at = now()
    WHERE auth_user_id = $1::uuid RETURNING *
  `, [actor.authUserId, displayName, defaultAuthor]);
  const preferences = await pool.query(`
    UPDATE admin.notification_preferences SET
      recipient_email = $2,
      enquiry_email_enabled = $3,
      comment_email_enabled = $4,
      publishing_email_enabled = $5,
      updated_at = now()
    WHERE auth_user_id = $1::uuid RETURNING *
  `, [
    actor.authUserId, recipientEmail,
    body.enquiryEmailEnabled !== false,
    body.commentEmailEnabled === true,
    body.publishingEmailEnabled !== false,
  ]);
  return { profile: profile.rows[0], notifications: preferences.rows[0] };
}

export { enquiryStatuses, priorities };
import crypto from 'node:crypto';

