BEGIN;

CREATE SCHEMA IF NOT EXISTS admin;
CREATE SCHEMA IF NOT EXISTS content;

CREATE TABLE admin.profiles (
  auth_user_id uuid PRIMARY KEY,
  email text NOT NULL UNIQUE,
  display_name text NOT NULL DEFAULT 'TechnoEdge Owner',
  default_author text NOT NULL DEFAULT 'TechnoEdge Editorial Team',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE admin.sessions (
  session_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash text NOT NULL UNIQUE CHECK (length(token_hash) = 64),
  csrf_hash text NOT NULL CHECK (length(csrf_hash) = 64),
  auth_user_id uuid NOT NULL REFERENCES admin.profiles(auth_user_id) ON DELETE CASCADE,
  email text NOT NULL,
  ip_hash text NOT NULL DEFAULT '',
  user_agent text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz
);

CREATE INDEX admin_sessions_active_idx
  ON admin.sessions (token_hash, expires_at)
  WHERE revoked_at IS NULL;

CREATE TABLE admin.login_attempts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email_hash text NOT NULL,
  ip_hash text NOT NULL,
  succeeded boolean NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX admin_login_attempts_recent_idx
  ON admin.login_attempts (email_hash, ip_hash, occurred_at DESC);

CREATE TABLE admin.audit_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_user_id uuid,
  actor_email text NOT NULL DEFAULT '',
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL DEFAULT '',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_hash text NOT NULL DEFAULT '',
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX admin_audit_log_occurred_idx ON admin.audit_log (occurred_at DESC);
CREATE INDEX admin_audit_log_entity_idx ON admin.audit_log (entity_type, entity_id, occurred_at DESC);

CREATE TABLE admin.notification_preferences (
  auth_user_id uuid PRIMARY KEY REFERENCES admin.profiles(auth_user_id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  enquiry_email_enabled boolean NOT NULL DEFAULT true,
  comment_email_enabled boolean NOT NULL DEFAULT false,
  publishing_email_enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE admin.email_deliveries (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  message_type text NOT NULL,
  recipient text NOT NULL,
  entity_id text NOT NULL DEFAULT '',
  status text NOT NULL CHECK (status IN ('sent', 'failed', 'disabled')),
  provider_id text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX admin_email_deliveries_created_idx ON admin.email_deliveries (created_at DESC);

CREATE TABLE content.blog_posts (
  post_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content_html text NOT NULL DEFAULT '',
  reference_table text NOT NULL DEFAULT '',
  category text NOT NULL CHECK (category IN (
    'AI & Automation', 'Cloud & Security', 'Data & Analytics',
    'Leadership', 'Technology', 'Workforce Learning'
  )),
  tags text[] NOT NULL DEFAULT '{}',
  author_name text NOT NULL DEFAULT 'TechnoEdge Editorial Team',
  featured_image_url text NOT NULL DEFAULT '',
  featured_image_alt text NOT NULL DEFAULT '',
  image_caption text NOT NULL DEFAULT '',
  seo_title text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  canonical_url text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  publish_at timestamptz,
  published_at timestamptz,
  is_featured boolean NOT NULL DEFAULT false,
  indexable boolean NOT NULL DEFAULT false,
  read_time_minutes integer NOT NULL DEFAULT 1 CHECK (read_time_minutes > 0),
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_by uuid REFERENCES admin.profiles(auth_user_id),
  updated_by uuid REFERENCES admin.profiles(auth_user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz,
  CHECK (status <> 'scheduled' OR publish_at IS NOT NULL)
);

CREATE INDEX blog_posts_publication_idx ON content.blog_posts (status, publish_at, published_at DESC);
CREATE INDEX blog_posts_updated_idx ON content.blog_posts (updated_at DESC);

CREATE TABLE content.blog_revisions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES content.blog_posts(post_id) ON DELETE CASCADE,
  revision integer NOT NULL,
  snapshot jsonb NOT NULL,
  actor_user_id uuid REFERENCES admin.profiles(auth_user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, revision)
);

CREATE TABLE content.blog_slug_redirects (
  old_slug text PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES content.blog_posts(post_id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE content.blog_comments (
  comment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES content.blog_posts(post_id) ON DELETE CASCADE,
  visitor_name text NOT NULL,
  visitor_email text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam', 'archived')),
  ip_hash text NOT NULL DEFAULT '',
  user_agent text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  moderated_at timestamptz,
  moderated_by uuid REFERENCES admin.profiles(auth_user_id)
);

CREATE INDEX blog_comments_moderation_idx ON content.blog_comments (status, created_at DESC);
CREATE INDEX blog_comments_post_idx ON content.blog_comments (post_id, status, created_at DESC);

CREATE TABLE content.media (
  media_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL UNIQUE,
  public_url text NOT NULL,
  original_name text NOT NULL,
  mime_type text NOT NULL,
  byte_size integer NOT NULL CHECK (byte_size > 0),
  alt_text text NOT NULL DEFAULT '',
  uploaded_by uuid REFERENCES admin.profiles(auth_user_id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leads.enquiries
  ADD COLUMN status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost', 'spam')),
  ADD COLUMN priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  ADD COLUMN is_read boolean NOT NULL DEFAULT false,
  ADD COLUMN tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN follow_up_at timestamptz,
  ADD COLUMN assigned_to uuid REFERENCES admin.profiles(auth_user_id),
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN archived_at timestamptz;

CREATE INDEX enquiries_admin_queue_idx
  ON leads.enquiries (archived_at, status, priority, received_at DESC);

CREATE TABLE leads.enquiry_notes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  submission_id uuid NOT NULL REFERENCES leads.enquiries(submission_id) ON DELETE CASCADE,
  note text NOT NULL,
  author_user_id uuid REFERENCES admin.profiles(auth_user_id),
  author_email text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX enquiry_notes_submission_idx ON leads.enquiry_notes (submission_id, created_at DESC);

CREATE TABLE leads.enquiry_activity (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  submission_id uuid NOT NULL REFERENCES leads.enquiries(submission_id) ON DELETE CASCADE,
  action text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  actor_user_id uuid REFERENCES admin.profiles(auth_user_id),
  actor_email text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX enquiry_activity_submission_idx ON leads.enquiry_activity (submission_id, created_at DESC);

CREATE TABLE admin.import_previews (
  preview_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES admin.profiles(auth_user_id),
  file_name text NOT NULL,
  normalized_courses jsonb NOT NULL,
  validation_result jsonb NOT NULL,
  status text NOT NULL DEFAULT 'previewed' CHECK (status IN ('previewed', 'importing', 'completed', 'failed', 'expired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '2 hours'),
  completed_at timestamptz
);

CREATE INDEX admin_import_previews_expiry_idx ON admin.import_previews (expires_at, status);

INSERT INTO catalogue.schema_migrations (version)
VALUES ('012_adminzz_cms');

COMMIT;
