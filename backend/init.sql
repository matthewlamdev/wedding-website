-- Runs automatically the first time the Postgres container starts
-- (mounted into /docker-entrypoint-initdb.d/ — see docker-compose.yml).

CREATE TABLE IF NOT EXISTS guests (
  code            TEXT PRIMARY KEY,           -- access code, e.g. 'smith2027'
  display_name    TEXT NOT NULL,               -- e.g. 'The Smith Family'
  names           TEXT[] NOT NULL,             -- individual guest names
  seats_allotted  INTEGER NOT NULL DEFAULT 1,
  table_name      TEXT DEFAULT '',
  notes           TEXT DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rsvps (
  id              SERIAL PRIMARY KEY,
  guest_code      TEXT REFERENCES guests(code),
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  attending       TEXT NOT NULL CHECK (attending IN ('yes', 'no')),
  guests_count    INTEGER NOT NULL DEFAULT 1,
  dietary         TEXT DEFAULT '',
  note            TEXT DEFAULT '',
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO guests (code, display_name, names, seats_allotted, table_name, notes) VALUES
  ('smith2027',  'The Smith Family',      ARRAY['John Smith', 'Jane Smith'],                2, 'Table 4', ''),
  ('garcia2027', 'Maria & Carlos Garcia', ARRAY['Maria Garcia', 'Carlos Garcia'],           2, '',        'Table assignment coming soon!'),
  ('chen2027',   'The Chen Family',       ARRAY['Amy Chen', 'David Chen', 'Lily Chen'],     3, 'Table 7', 'High chair reserved for Lily.')
ON CONFLICT (code) DO NOTHING;
