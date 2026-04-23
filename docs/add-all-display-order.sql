-- Run in Supabase SQL Editor
-- Adds a separate ordering column for the All tab in admin
ALTER TABLE cases ADD COLUMN IF NOT EXISTS all_display_order int;

-- Initialize existing cases so All tab order is independent from the start
UPDATE cases SET all_display_order = display_order WHERE all_display_order IS NULL;
