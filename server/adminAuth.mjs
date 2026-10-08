import crypto from 'node:crypto';

const sessionCookieName = 'te_admin_session';
const csrfCookieName = 'te_admin_csrf';
const sessionDurationMs = 8 * 60 * 60 * 1000;
const idleDurationMs = 30 * 60 * 1000;

function digest(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function cookies(request) {
  return Object.fromEntries(String(request.headers.cookie || '')
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const separator = part.indexOf('=');
      if (separator < 0) return [part, ''];
      return [decodeURIComponent(part.slice(0, separator)), decodeURIComponent(part.slice(separator + 1))];
    }));
}

export function requestFingerprint(request) {
  const forwarded = String(request.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const address = forwarded || request.socket.remoteAddress || '';
  const salt = process.env.ADMIN_IP_HASH_SALT || 'local-development-only';
  return digest(`${salt}:${address}`);
}

export function configuredOwnerEmail() {
  return String(process.env.ADMIN_OWNER_EMAIL || '').trim().toLowerCase();
}

function supabaseConfiguration() {
  const url = String(process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const key = String(process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
  if (!url || !key) throw new Error('Supabase Auth is not configured.');
  return { url, key };
}

async function supabaseRequest(path, { method = 'GET', token, body } = {}) {
  const { url, key } = supabaseConfiguration();
  const response = await fetch(`${url}${path}`, {
    method,
    headers: {
      apikey: key,
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.msg || payload.error_description || payload.message || 'Authentication failed.');
    error.status = response.status;
    throw error;
  }
  return payload;
}

export async function verifyOwnerPassword(email, password) {
  const result = await supabaseRequest('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: { email, password },
  });
  return result.user;
}

export async function requestPasswordRecovery(email, redirectTo) {
  return supabaseRequest('/auth/v1/recover', {
    method: 'POST',
    body: { email, redirect_to: redirectTo },
  });
}

export async function updatePasswordWithRecoveryToken(accessToken, password) {
  return supabaseRequest('/auth/v1/user', {
    method: 'PUT',
    token: accessToken,
    body: { password },
  });
}

export async function changeOwnerPassword(email, currentPassword, nextPassword) {
  const result = await supabaseRequest('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: { email, password: currentPassword },
  });
  await updatePasswordWithRecoveryToken(result.access_token, nextPassword);
  return result.user;
}

export function validateStrongPassword(password) {
  if (typeof password !== 'string' || password.length < 14 || password.length > 128) {
    return 'Use a password between 14 and 128 characters.';
  }
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return 'Use uppercase, lowercase, number, and symbol characters.';
  }
  return '';
}

export async function writeAudit(pool, request, {
  action,
  entityType,
  entityId = '',
  metadata = {},
  actor = request?.admin,
} = {}) {
  await pool.query(`
    INSERT INTO admin.audit_log (
      actor_user_id, actor_email, action, entity_type, entity_id, metadata, ip_hash
    ) VALUES ($1::uuid, $2, $3, $4, $5, $6::jsonb, $7)
  `, [
    actor?.authUserId || null,
    actor?.email || '',
    action,
    entityType,
    entityId,
    JSON.stringify(metadata || {}),
    request ? requestFingerprint(request) : '',
  ]);
}

function sessionCookieOptions() {
  const secure = Boolean(process.env.VERCEL || process.env.VERCEL_ENV || process.env.NODE_ENV === 'production');
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: sessionDurationMs,
  };
}

function csrfCookieOptions() {
  return { ...sessionCookieOptions(), httpOnly: false };
}

export async function createAdminSession(pool, request, response, user) {
  const token = crypto.randomBytes(32).toString('base64url');
  const csrfToken = crypto.randomBytes(24).toString('base64url');
  const email = String(user.email || '').trim().toLowerCase();
  const authUserId = user.id;
  const expiresAt = new Date(Date.now() + sessionDurationMs);

  await pool.query(`
    INSERT INTO admin.profiles (auth_user_id, email)
    VALUES ($1::uuid, $2)
    ON CONFLICT (auth_user_id) DO UPDATE SET email = EXCLUDED.email, active = true, updated_at = now()
  `, [authUserId, email]);
  await pool.query(`
    INSERT INTO admin.notification_preferences (auth_user_id, recipient_email)
    VALUES ($1::uuid, $2)
    ON CONFLICT (auth_user_id) DO NOTHING
  `, [authUserId, email]);
  await pool.query(`
    INSERT INTO admin.sessions (
      token_hash, csrf_hash, auth_user_id, email, ip_hash, user_agent, expires_at
    ) VALUES ($1, $2, $3::uuid, $4, $5, $6, $7)
  `, [
    digest(token), digest(csrfToken), authUserId, email, requestFingerprint(request),
    String(request.headers['user-agent'] || '').slice(0, 500), expiresAt,
  ]);

  response.cookie(sessionCookieName, token, sessionCookieOptions());
  response.cookie(csrfCookieName, csrfToken, csrfCookieOptions());
  return { csrfToken, expiresAt: expiresAt.toISOString() };
}

export async function revokeAdminSession(pool, request, response) {
  const token = cookies(request)[sessionCookieName];
  if (token) {
    await pool.query('UPDATE admin.sessions SET revoked_at = now() WHERE token_hash = $1', [digest(token)]);
  }
  response.clearCookie(sessionCookieName, { ...sessionCookieOptions(), maxAge: undefined });
  response.clearCookie(csrfCookieName, { ...csrfCookieOptions(), maxAge: undefined });
}

export function createRequireAdmin(pool) {
  return async function requireAdmin(request, response, next) {
    try {
      const token = cookies(request)[sessionCookieName];
      const csrfToken = cookies(request)[csrfCookieName];
      if (!token) return response.status(401).json({ error: 'Sign in to continue.' });
      const result = await pool.query(`
        SELECT s.session_id, s.csrf_hash, s.auth_user_id, s.email, s.created_at, s.last_seen_at,
               s.expires_at, p.display_name, p.default_author
        FROM admin.sessions s
        JOIN admin.profiles p ON p.auth_user_id = s.auth_user_id
        WHERE s.token_hash = $1
          AND s.revoked_at IS NULL
          AND s.expires_at > now()
          AND s.last_seen_at > now() - interval '30 minutes'
          AND p.active = true
      `, [digest(token)]);
      const session = result.rows[0];
      if (!session) {
        response.clearCookie(sessionCookieName, { ...sessionCookieOptions(), maxAge: undefined });
        response.clearCookie(csrfCookieName, { ...csrfCookieOptions(), maxAge: undefined });
        return response.status(401).json({ error: 'Your session has expired. Sign in again.' });
      }
      const ownerEmail = configuredOwnerEmail();
      if (!ownerEmail || session.email.toLowerCase() !== ownerEmail) {
        return response.status(403).json({ error: 'This account is not authorised.' });
      }
      request.admin = {
        sessionId: session.session_id,
        authUserId: session.auth_user_id,
        email: session.email,
        displayName: session.display_name,
        defaultAuthor: session.default_author,
        createdAt: session.created_at,
        expiresAt: session.expires_at,
        csrfHash: session.csrf_hash,
        csrfToken: csrfToken && safeEqual(digest(csrfToken), session.csrf_hash) ? csrfToken : '',
      };
      await pool.query('UPDATE admin.sessions SET last_seen_at = now() WHERE session_id = $1::uuid', [session.session_id]);
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function requireCsrf(request, response, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return next();
  const provided = String(request.headers['x-csrf-token'] || '');
  if (!provided || !request.admin?.csrfHash || !safeEqual(digest(provided), request.admin.csrfHash)) {
    return response.status(403).json({ error: 'The security token is invalid. Refresh and try again.' });
  }
  const origin = request.headers.origin;
  if (origin) {
    const configuredOrigin = String(process.env.ADMIN_ORIGIN || '').replace(/\/$/, '');
    const requestOrigin = `${request.protocol}://${request.get('host')}`;
    if (origin !== configuredOrigin && origin !== requestOrigin) {
      return response.status(403).json({ error: 'The request origin is not allowed.' });
    }
  }
  return next();
}

export async function recentFailedAttempts(pool, email, request) {
  const result = await pool.query(`
    SELECT count(*)::integer AS failures
    FROM admin.login_attempts
    WHERE email_hash = $1 AND ip_hash = $2 AND succeeded = false
      AND occurred_at > now() - interval '30 minutes'
      AND occurred_at > COALESCE((
        SELECT max(occurred_at) FROM admin.login_attempts
        WHERE email_hash = $1 AND ip_hash = $2 AND succeeded = true
      ), '-infinity'::timestamptz)
  `, [digest(email.toLowerCase()), requestFingerprint(request)]);
  return result.rows[0]?.failures || 0;
}

export async function recordLoginAttempt(pool, email, request, succeeded) {
  await pool.query(`
    INSERT INTO admin.login_attempts (email_hash, ip_hash, succeeded)
    VALUES ($1, $2, $3)
  `, [digest(email.toLowerCase()), requestFingerprint(request), succeeded]);
}

export async function revokeAllOwnerSessions(pool, authUserId) {
  await pool.query(
    'UPDATE admin.sessions SET revoked_at = now() WHERE auth_user_id = $1::uuid AND revoked_at IS NULL',
    [authUserId],
  );
}

export { idleDurationMs };
