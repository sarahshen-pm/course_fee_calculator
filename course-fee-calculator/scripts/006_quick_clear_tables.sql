-- Quick clear all detail tables
-- WARNING: This will permanently delete all data from detail tables

-- Clear all detail tables in one go
TRUNCATE TABLE schedule_data CASCADE;
TRUNCATE TABLE processed_schedule_data CASCADE;
TRUNCATE TABLE modification_logs CASCADE;

-- Note: TRUNCATE is faster than DELETE for large datasets
-- CASCADE ensures any dependent records are also cleared

-- Verify tables are empty
SELECT 
    'schedule_data' as table_name, 
    COUNT(*) as remaining_records 
FROM schedule_data
UNION ALL
SELECT 
    'processed_schedule_data' as table_name, 
    COUNT(*) as remaining_records 
FROM processed_schedule_data
UNION ALL
SELECT 
    'modification_logs' as table_name, 
    COUNT(*) as remaining_records 
FROM modification_logs;
