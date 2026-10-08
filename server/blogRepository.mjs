import sanitizeHtml from 'sanitize-html';
import { requestFingerprint } from './adminAuth.mjs';

const categories = new Set([
  'AI & Automation',
  'Cloud & Security',
  'Data & Analytics',
  'Leadership',
  'Technology',
  'Workforce Learning',
]);
const statuses = new Set(['draft', 'scheduled', 'published', 'archived']);
const commentStatuses = new Set(['pending', 'approved', 'rejected', 'spam', 'archived']);

const cleanHtml = (value) => sanitizeHtml(String(value || ''), {
  allowedTags: [
    'p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'blockquote',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'figure', 'figcaption', 'img',
    'br', 'hr', 'code', 'pre',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel', 'title'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    th: ['colspan', 'rowspan', 'scope'],
    td: ['colspan', 'rowspan'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: { img: ['http', 'https'] },
  transformTags: {
    a: (_tagName, attributes) => ({
      tagName: 'a',
      attribs: {
        ...attributes,
        ...(attributes.target === '_blank' ? { rel: 'noopener noreferrer' } : {}),
      },
    }),
    img: (_tagName, attributes) => ({
      tagName: 'img',
      attribs: { ...attributes, loading: 'lazy' },
    }),
  },
});

export const slugify = (value) => String(value || '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')
  .slice(0, 180);

function readText(value, maxLength, { required = false } = {}) {
  const result = String(value ?? '').trim();
  if (required && !result) throw new Error('A required blog field is missing.');
  if (result.length > maxLength) throw new Error('A blog field is too long.');
  return result;
}

function readOptionalUrl(value) {
  const result = readText(value, 1000);
  if (!result) return '';
  const parsed = new URL(result);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Invalid blog URL.');
  return parsed.toString();
}

function normaliseTags(value) {
  const source = Array.isArray(value) ? value : String(value || '').split(',');
  return [...new Set(source.map((item) => String(item).trim()).filter(Boolean))].slice(0, 20);
}

function readDate(value, required = false) {
  if (!value) {
    if (required) throw new Error('Choose a publication date and time.');
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) throw new Error('Invalid publication date.');
  return parsed.toISOString();
}

export function validateBlogInput(body, existing = {}) {
  const title = readText(body.title ?? existing.title, 300, { required: true });
  const slug = slugify(body.slug ?? existing.slug ?? title);
  if (!slug) throw new Error('A valid article slug is required.');
  const category = readText(body.category ?? existing.category, 80, { required: true });
  if (!categories.has(category)) throw new Error('Invalid blog category.');
  const status = readText(body.status ?? existing.status ?? 'draft', 20);
  if (!statuses.has(status)) throw new Error('Invalid blog status.');
  const publishAt = readDate(body.publishAt ?? existing.publish_at, status === 'scheduled');
  const contentHtml = cleanHtml(body.contentHtml ?? existing.content_html ?? '');
  const wordCount = sanitizeHtml(contentHtml, { allowedTags: [], allowedAttributes: {} })
    .split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title,
    excerpt: readText(body.excerpt ?? existing.excerpt, 800),
    contentHtml,
    referenceTable: readText(body.referenceTable ?? existing.reference_table, 20_000),
    category,
    tags: normaliseTags(body.tags ?? existing.tags),
    authorName: readText(body.authorName ?? existing.author_name ?? 'TechnoEdge Editorial Team', 160, { required: true }),
    featuredImageUrl: readOptionalUrl(body.featuredImageUrl ?? existing.featured_image_url),
    featuredImageAlt: readText(body.featuredImageAlt ?? existing.featured_image_alt, 300),
    imageCaption: readText(body.imageCaption ?? existing.image_caption, 500),
    seoTitle: readText(body.seoTitle ?? existing.seo_title, 180),
    metaDescription: readText(body.metaDescription ?? existing.meta_description, 320),
    canonicalUrl: readOptionalUrl(body.canonicalUrl ?? existing.canonical_url),
    status,
    publishAt,
    isFeatured: Boolean(body.isFeatured ?? existing.is_featured),
    indexable: Boolean(body.indexable ?? existing.indexable),
    readTimeMinutes: Math.max(1, Math.ceil(wordCount / 220)),
  };
}

function mapPublicArticle(row) {
  const publishedAt = row.published_at || row.publish_at || row.created_at;
  return {
    id: row.slug,
    postId: row.post_id,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    date: new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(publishedAt)),
    datePublished: new Date(publishedAt).toISOString(),
    dateModified: new Date(row.updated_at).toISOString(),
    readTime: `${row.read_time_minutes} min read`,
    image: row.featured_image_url,
    imageAlt: row.featured_image_alt || row.title,
    author: row.author_name,
    url: `/insights/${row.slug}`,
    indexable: row.indexable,
    isFeatured: row.is_featured,
  };
}

export async function publishDueBlogs(pool, actor = 'scheduler') {
  const result = await pool.query(`
    UPDATE content.blog_posts
    SET status = 'published', published_at = COALESCE(published_at, publish_at), updated_at = now()
    WHERE status = 'scheduled' AND publish_at <= now()
    RETURNING post_id, slug, title, publish_at
  `);
  for (const row of result.rows) {
    await pool.query(`
      INSERT INTO admin.audit_log (actor_email, action, entity_type, entity_id, metadata)
      VALUES ($1, 'blog.published_scheduled', 'blog_post', $2, $3::jsonb)
    `, [actor, row.post_id, JSON.stringify({ slug: row.slug, title: row.title, publishAt: row.publish_at })]);
  }
  return result.rows;
}

export async function listPublicBlogs(pool, { limit = 200 } = {}) {
  await publishDueBlogs(pool);
  const result = await pool.query(`
    SELECT * FROM content.blog_posts
    WHERE status = 'published' AND archived_at IS NULL
    ORDER BY is_featured DESC, published_at DESC NULLS LAST, created_at DESC
    LIMIT $1
  `, [Math.min(Math.max(Number(limit) || 200, 1), 500)]);
  return result.rows.map(mapPublicArticle);
}

export async function getPublicBlog(pool, slug) {
  await publishDueBlogs(pool);
  const result = await pool.query(`
    SELECT * FROM content.blog_posts
    WHERE slug = $1 AND status = 'published' AND archived_at IS NULL
  `, [slugify(slug)]);
  if (result.rows[0]) return { article: mapPublicArticle(result.rows[0]), contentHtml: result.rows[0].content_html, referenceTable: result.rows[0].reference_table };
  const redirect = await pool.query(`
    SELECT p.slug FROM content.blog_slug_redirects r
    JOIN content.blog_posts p ON p.post_id = r.post_id
    WHERE r.old_slug = $1 AND p.status = 'published' AND p.archived_at IS NULL
  `, [slugify(slug)]);
  return redirect.rows[0] ? { redirect: redirect.rows[0].slug } : null;
}

export async function listApprovedComments(pool, slug) {
  const result = await pool.query(`
    SELECT c.comment_id, c.visitor_name, c.message, c.created_at
    FROM content.blog_comments c
    JOIN content.blog_posts p ON p.post_id = c.post_id
    WHERE p.slug = $1 AND p.status = 'published' AND c.status = 'approved'
    ORDER BY c.created_at DESC
  `, [slugify(slug)]);
  return result.rows.map((row) => ({
    id: row.comment_id,
    name: row.visitor_name,
    message: row.message,
    createdAt: row.created_at,
  }));
}

export async function submitPublicComment(pool, request, slug, body) {
  const name = readText(body.name, 80, { required: true });
  const email = readText(body.email, 254, { required: true }).toLowerCase();
  const message = readText(body.message, 3000, { required: true });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
  if (name.length < 2 || message.length < 10) throw new Error('Enter your name and a comment of at least 10 characters.');
  if (String(body.website || '').trim()) return { accepted: true };
  const ipHash = requestFingerprint(request);
  const recent = await pool.query(`
    SELECT count(*)::integer AS count FROM content.blog_comments
    WHERE ip_hash = $1 AND created_at > now() - interval '10 minutes'
  `, [ipHash]);
  if ((recent.rows[0]?.count || 0) >= 3) {
    const error = new Error('Too many comments were submitted. Please wait and try again.');
    error.status = 429;
    throw error;
  }
  const post = await pool.query(`
    SELECT post_id FROM content.blog_posts
    WHERE slug = $1 AND status = 'published' AND archived_at IS NULL
  `, [slugify(slug)]);
  if (!post.rows[0]) {
    const error = new Error('Article not found.');
    error.status = 404;
    throw error;
  }
  await pool.query(`
    INSERT INTO content.blog_comments (
      post_id, visitor_name, visitor_email, message, ip_hash, user_agent
    ) VALUES ($1::uuid, $2, $3, $4, $5, $6)
  `, [post.rows[0].post_id, name, email, message, ipHash, String(request.headers['user-agent'] || '').slice(0, 500)]);
  return { accepted: true };
}

export async function listAdminBlogs(pool, { status = 'all', query = '', page = 1, pageSize = 20 } = {}) {
  await publishDueBlogs(pool);
  const filters = [];
  const values = [];
  if (status !== 'all') {
    if (!statuses.has(status)) throw new Error('Invalid blog status.');
    values.push(status);
    filters.push(`p.status = $${values.length}`);
  }
  if (query) {
    values.push(`%${query}%`);
    filters.push(`(p.title ILIKE $${values.length} OR p.slug ILIKE $${values.length} OR p.author_name ILIKE $${values.length})`);
  }
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const offset = (page - 1) * pageSize;
  values.push(pageSize, offset);
  const result = await pool.query(`
    SELECT p.*,
      count(c.comment_id) FILTER (WHERE c.status = 'pending')::integer AS pending_comments,
      count(*) OVER()::integer AS total
    FROM content.blog_posts p
    LEFT JOIN content.blog_comments c ON c.post_id = p.post_id
    ${where}
    GROUP BY p.post_id
    ORDER BY p.updated_at DESC
    LIMIT $${values.length - 1} OFFSET $${values.length}
  `, values);
  return {
    data: result.rows,
    pagination: { page, pageSize, total: result.rows[0]?.total || 0 },
  };
}

export async function getAdminBlog(pool, postId) {
  const result = await pool.query('SELECT * FROM content.blog_posts WHERE post_id = $1::uuid', [postId]);
  if (!result.rows[0]) return null;
  const revisions = await pool.query(`
    SELECT revision, actor_user_id, created_at FROM content.blog_revisions
    WHERE post_id = $1::uuid ORDER BY revision DESC LIMIT 20
  `, [postId]);
  return { ...result.rows[0], revisions: revisions.rows };
}

async function saveRevision(client, postId, actorUserId) {
  await client.query(`
    INSERT INTO content.blog_revisions (post_id, revision, snapshot, actor_user_id)
    SELECT post_id, revision, to_jsonb(content.blog_posts), $2::uuid
    FROM content.blog_posts WHERE post_id = $1::uuid
    ON CONFLICT (post_id, revision) DO NOTHING
  `, [postId, actorUserId]);
}

export async function createAdminBlog(pool, actor, body) {
  const value = validateBlogInput(body);
  const result = await pool.query(`
    INSERT INTO content.blog_posts (
      slug, title, excerpt, content_html, reference_table, category, tags, author_name,
      featured_image_url, featured_image_alt, image_caption, seo_title, meta_description,
      canonical_url, status, publish_at, published_at, is_featured, indexable,
      read_time_minutes, created_by, updated_by
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7::text[], $8,
      $9, $10, $11, $12, $13, $14, $15, $16,
      CASE WHEN $15 = 'published' THEN now() ELSE NULL END,
      $17, $18, $19, $20::uuid, $20::uuid
    ) RETURNING *
  `, [
    value.slug, value.title, value.excerpt, value.contentHtml, value.referenceTable,
    value.category, value.tags, value.authorName, value.featuredImageUrl,
    value.featuredImageAlt, value.imageCaption, value.seoTitle,
    value.metaDescription, value.canonicalUrl, value.status, value.publishAt,
    value.isFeatured, value.indexable, value.readTimeMinutes, actor.authUserId,
  ]);
  await pool.query(`
    INSERT INTO content.blog_revisions (post_id, revision, snapshot, actor_user_id)
    VALUES ($1::uuid, 1, $2::jsonb, $3::uuid)
  `, [result.rows[0].post_id, JSON.stringify(result.rows[0]), actor.authUserId]);
  return result.rows[0];
}

export async function updateAdminBlog(pool, actor, postId, body) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const currentResult = await client.query('SELECT * FROM content.blog_posts WHERE post_id = $1::uuid FOR UPDATE', [postId]);
    const current = currentResult.rows[0];
    if (!current) return null;
    const value = validateBlogInput(body, current);
    if (value.slug !== current.slug) {
      await client.query(`
        INSERT INTO content.blog_slug_redirects (old_slug, post_id)
        VALUES ($1, $2::uuid) ON CONFLICT (old_slug) DO UPDATE SET post_id = EXCLUDED.post_id
      `, [current.slug, postId]);
    }
    const result = await client.query(`
      UPDATE content.blog_posts SET
        slug = $2, title = $3, excerpt = $4, content_html = $5, reference_table = $6,
        category = $7, tags = $8::text[], author_name = $9, featured_image_url = $10,
        featured_image_alt = $11, image_caption = $12, seo_title = $13,
        meta_description = $14, canonical_url = $15, status = $16, publish_at = $17,
        published_at = CASE
          WHEN $16 = 'published' THEN COALESCE(published_at, now())
          WHEN $16 IN ('draft', 'scheduled') THEN NULL
          ELSE published_at
        END,
        is_featured = $18, indexable = $19, read_time_minutes = $20,
        revision = revision + 1, updated_by = $21::uuid, updated_at = now(),
        archived_at = CASE WHEN $16 = 'archived' THEN COALESCE(archived_at, now()) ELSE NULL END
      WHERE post_id = $1::uuid RETURNING *
    `, [
      postId, value.slug, value.title, value.excerpt, value.contentHtml,
      value.referenceTable, value.category, value.tags, value.authorName,
      value.featuredImageUrl, value.featuredImageAlt, value.imageCaption,
      value.seoTitle, value.metaDescription, value.canonicalUrl, value.status,
      value.publishAt, value.isFeatured, value.indexable, value.readTimeMinutes,
      actor.authUserId,
    ]);
    await saveRevision(client, postId, actor.authUserId);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

export async function duplicateAdminBlog(pool, actor, postId) {
  const result = await pool.query(`
    INSERT INTO content.blog_posts (
      slug, title, excerpt, content_html, reference_table, category, tags, author_name,
      featured_image_url, featured_image_alt, image_caption, seo_title, meta_description,
      canonical_url, status, is_featured, indexable, read_time_minutes, created_by, updated_by
    )
    SELECT substring(slug || '-copy-' || substr(gen_random_uuid()::text, 1, 6) for 180),
      title || ' (Copy)', excerpt, content_html, reference_table, category, tags, author_name,
      featured_image_url, featured_image_alt, image_caption, seo_title, meta_description,
      '', 'draft', false, false, read_time_minutes, $2::uuid, $2::uuid
    FROM content.blog_posts WHERE post_id = $1::uuid
    RETURNING *
  `, [postId, actor.authUserId]);
  return result.rows[0] || null;
}

export async function restoreBlogRevision(pool, actor, postId, revision) {
  const result = await pool.query(`
    SELECT snapshot FROM content.blog_revisions
    WHERE post_id = $1::uuid AND revision = $2
  `, [postId, revision]);
  if (!result.rows[0]) return null;
  const snapshot = result.rows[0].snapshot;
  return updateAdminBlog(pool, actor, postId, {
    title: snapshot.title,
    slug: snapshot.slug,
    excerpt: snapshot.excerpt,
    contentHtml: snapshot.content_html,
    referenceTable: snapshot.reference_table,
    category: snapshot.category,
    tags: snapshot.tags,
    authorName: snapshot.author_name,
    featuredImageUrl: snapshot.featured_image_url,
    featuredImageAlt: snapshot.featured_image_alt,
    imageCaption: snapshot.image_caption,
    seoTitle: snapshot.seo_title,
    metaDescription: snapshot.meta_description,
    canonicalUrl: snapshot.canonical_url,
    status: 'draft',
    isFeatured: snapshot.is_featured,
    indexable: false,
  });
}

export async function listAdminComments(pool, { status = 'pending', query = '', page = 1, pageSize = 30 } = {}) {
  if (status !== 'all' && !commentStatuses.has(status)) throw new Error('Invalid comment status.');
  const values = [];
  const filters = [];
  if (status !== 'all') {
    values.push(status);
    filters.push(`c.status = $${values.length}`);
  }
  if (query) {
    values.push(`%${query}%`);
    filters.push(`(c.visitor_name ILIKE $${values.length} OR c.visitor_email ILIKE $${values.length} OR c.message ILIKE $${values.length} OR p.title ILIKE $${values.length})`);
  }
  values.push(pageSize, (page - 1) * pageSize);
  const result = await pool.query(`
    SELECT c.*, p.title AS article_title, p.slug AS article_slug,
      count(*) OVER()::integer AS total
    FROM content.blog_comments c
    JOIN content.blog_posts p ON p.post_id = c.post_id
    ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
    ORDER BY c.created_at DESC
    LIMIT $${values.length - 1} OFFSET $${values.length}
  `, values);
  return { data: result.rows, pagination: { page, pageSize, total: result.rows[0]?.total || 0 } };
}

export async function moderateComments(pool, actor, commentIds, status) {
  if (!commentStatuses.has(status) || status === 'pending') throw new Error('Invalid moderation status.');
  const ids = [...new Set((Array.isArray(commentIds) ? commentIds : [commentIds]).map(String))];
  if (!ids.length || ids.length > 100) throw new Error('Choose between 1 and 100 comments.');
  const result = await pool.query(`
    UPDATE content.blog_comments
    SET status = $2, moderated_at = now(), moderated_by = $3::uuid
    WHERE comment_id = ANY($1::uuid[])
    RETURNING comment_id
  `, [ids, status, actor.authUserId]);
  return result.rows.map((row) => row.comment_id);
}

export { cleanHtml };
