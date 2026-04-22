-- Add featured flag to cases (for homepage preview section)
ALTER TABLE cases ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;
