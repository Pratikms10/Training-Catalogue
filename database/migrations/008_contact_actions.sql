BEGIN;

CREATE TABLE leads.contact_actions (
  event_id uuid PRIMARY KEY,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  channel text NOT NULL CHECK (channel IN ('call', 'email', 'whatsapp')),
  destination text NOT NULL,
  source_page text NOT NULL,
  cta_label text NOT NULL DEFAULT ''
);

CREATE INDEX contact_actions_occurred_at_idx ON leads.contact_actions (occurred_at DESC);

INSERT INTO catalogue.schema_migrations (version)
VALUES ('008_contact_actions');

COMMIT;
