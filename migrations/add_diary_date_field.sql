-- Add diary_date column to notes table
-- This field will store the date (YYYY-MM-DD format) for diary view
-- NULL means the note is unassigned in diary view

ALTER TABLE notes
ADD COLUMN diary_date DATE;

-- Add an index on diary_date for better query performance
CREATE INDEX idx_notes_diary_date ON notes(diary_date);

-- Add comment
COMMENT ON COLUMN notes.diary_date IS 'Date assigned in diary view (NULL = unassigned)';
