BEGIN;

CREATE SCHEMA IF NOT EXISTS leads;

CREATE TABLE leads.enquiries (
  submission_id uuid PRIMARY KEY,
  reference text NOT NULL UNIQUE,
  received_at timestamptz NOT NULL DEFAULT now(),
  kind text NOT NULL CHECK (kind IN ('course', 'organisation', 'trainer')),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  service text NOT NULL DEFAULT '',
  course_id text NOT NULL DEFAULT '',
  course_title text NOT NULL DEFAULT '',
  course_category text NOT NULL DEFAULT '',
  learners text NOT NULL DEFAULT '',
  delivery text NOT NULL DEFAULT '',
  notes text NOT NULL,
  preferred_channel text NOT NULL DEFAULT '',
  trainer_expertise text NOT NULL DEFAULT '',
  trainer_experience text NOT NULL DEFAULT '',
  profile_url text NOT NULL DEFAULT '',
  source_page text NOT NULL,
  cta_id text NOT NULL DEFAULT ''
);

CREATE INDEX enquiries_received_at_idx ON leads.enquiries (received_at DESC);

CREATE TABLE leads.crm_outbox (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  submission_id uuid NOT NULL REFERENCES leads.enquiries (submission_id) ON DELETE RESTRICT,
  destination text NOT NULL DEFAULT 'internal_crm',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'delivered', 'blocked')),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  lease_token uuid,
  leased_until timestamptz,
  last_error text,
  crm_record_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  delivered_at timestamptz,
  UNIQUE (submission_id, destination)
);

CREATE INDEX crm_outbox_ready_idx
  ON leads.crm_outbox (next_attempt_at, id)
  WHERE status = 'pending';

CREATE INDEX crm_outbox_expired_lease_idx
  ON leads.crm_outbox (leased_until, id)
  WHERE status = 'processing';

INSERT INTO catalogue.schema_migrations (version)
VALUES ('007_enquiries_crm_outbox');

COMMIT;
