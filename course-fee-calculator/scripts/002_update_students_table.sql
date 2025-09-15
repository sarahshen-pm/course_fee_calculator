-- Update students table to include missing columns
-- Run this script in your Supabase SQL editor to fix the table structure

-- Add missing columns to students table if they don't exist
DO $$ 
BEGIN
    -- Add hours column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'students' AND column_name = 'hours') THEN
        ALTER TABLE students ADD COLUMN hours DECIMAL(5,2);
    END IF;
    
    -- Add date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'students' AND column_name = 'date') THEN
        ALTER TABLE students ADD COLUMN date DATE;
    END IF;
    
    -- Add title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'students' AND column_name = 'title') THEN
        ALTER TABLE students ADD COLUMN title TEXT;
    END IF;
END $$;

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'students' 
ORDER BY ordinal_position;
