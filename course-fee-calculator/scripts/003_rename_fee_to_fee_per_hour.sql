-- Rename fee column to fee_per_hour in all tables
-- Run this script in your Supabase SQL editor to update existing tables

-- Rename fee to fee_per_hour in schedule_data table
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'schedule_data' AND column_name = 'fee') THEN
        ALTER TABLE schedule_data RENAME COLUMN fee TO fee_per_hour;
    END IF;
END $$;

-- Rename fee to fee_per_hour in processed_schedule_data table
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'processed_schedule_data' AND column_name = 'fee') THEN
        ALTER TABLE processed_schedule_data RENAME COLUMN fee TO fee_per_hour;
    END IF;
END $$;

-- Rename fee to fee_per_hour in students table
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'students' AND column_name = 'fee') THEN
        ALTER TABLE students RENAME COLUMN fee TO fee_per_hour;
    END IF;
END $$;

-- Update the generated column in processed_schedule_data to use the new column name
DO $$ 
BEGIN
    -- Drop the existing generated column
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'processed_schedule_data' AND column_name = 'fee_total') THEN
        ALTER TABLE processed_schedule_data DROP COLUMN fee_total;
    END IF;
    
    -- Recreate the generated column with the new column name
    ALTER TABLE processed_schedule_data 
    ADD COLUMN fee_total DECIMAL(10,2) GENERATED ALWAYS AS (fee_per_hour * hours) STORED;
END $$;

-- Verify the changes
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name IN ('schedule_data', 'processed_schedule_data', 'students') 
  AND column_name IN ('fee', 'fee_per_hour', 'fee_total')
ORDER BY table_name, column_name;
