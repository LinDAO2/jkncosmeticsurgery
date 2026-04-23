-- Run in Supabase SQL Editor
-- Adds a separate ordering column for the All tab in admin
ALTER TABLE cases ADD COLUMN IF NOT EXISTS all_display_order int;
