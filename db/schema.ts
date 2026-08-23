export const submissionSchemaStatements = [
  `CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    reference TEXT NOT NULL UNIQUE,
    kind TEXT NOT NULL CHECK (kind IN ('quote', 'service')),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'closed')),
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    access_token_hash TEXT NOT NULL UNIQUE,
    consent_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    finalized_at INTEGER,
    expires_at INTEGER NOT NULL,
    attachment_count INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS submission_files (
    id TEXT PRIMARY KEY,
    submission_id TEXT NOT NULL,
    slot TEXT NOT NULL,
    object_key TEXT NOT NULL UNIQUE,
    filename TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('image/jpeg', 'image/png')),
    size_bytes INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    UNIQUE (submission_id, slot)
  )`,
  `CREATE TABLE IF NOT EXISTS submission_rate_limits (
    fingerprint TEXT PRIMARY KEY,
    window_started_at INTEGER NOT NULL,
    request_count INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_submissions_status_created
    ON submissions(status, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_submissions_expires
    ON submissions(expires_at)`,
  `CREATE INDEX IF NOT EXISTS idx_submissions_finalized
    ON submissions(finalized_at, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_submission_files_submission
    ON submission_files(submission_id)`,
] as const;
