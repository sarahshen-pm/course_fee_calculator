-- Migration: Remove dynamic fields from students table
-- Date: 2024-01-XX
-- Description: Remove hours, date, title fields from students table as they should only contain standard student information

-- Remove dynamic fields from students table
ALTER TABLE students DROP COLUMN IF EXISTS hours;
ALTER TABLE students DROP COLUMN IF EXISTS date;
ALTER TABLE students DROP COLUMN IF EXISTS title;

-- Add comment to clarify the purpose of students table
COMMENT ON TABLE students IS 'Student profiles with standard information only (name, fee_per_hour, graduated, parent, accompany_number)';
