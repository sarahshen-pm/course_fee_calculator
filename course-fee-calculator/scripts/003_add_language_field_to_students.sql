-- Migration: Add language field to students table
-- Date: 2024-01-XX
-- Description: Add language field to students table to track student language preference

-- Add language field to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'English';

-- Add comment to clarify the purpose of the language field
COMMENT ON COLUMN students.language IS 'Student language preference (English, Chinese, etc.)';

-- Update existing records to have default language value
UPDATE students SET language = 'English' WHERE language IS NULL;
