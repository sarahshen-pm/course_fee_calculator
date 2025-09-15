-- Clear detail tables data with backup option
-- This script provides options to backup data before clearing

-- Option 1: Create backup tables before clearing (uncomment to use)
/*
-- Create backup tables
CREATE TABLE IF NOT EXISTS schedule_data_backup AS SELECT * FROM schedule_data;
CREATE TABLE IF NOT EXISTS processed_schedule_data_backup AS SELECT * FROM processed_schedule_data;
CREATE TABLE IF NOT EXISTS modification_logs_backup AS SELECT * FROM modification_logs;

-- Add timestamp to backup table names
ALTER TABLE schedule_data_backup RENAME TO schedule_data_backup_$(date +%Y%m%d_%H%M%S);
ALTER TABLE processed_schedule_data_backup RENAME TO processed_schedule_data_backup_$(date +%Y%m%d_%H%M%S);
ALTER TABLE modification_logs_backup RENAME TO modification_logs_backup_$(date +%Y%m%d_%H%M%S);
*/

-- Option 2: Export data to CSV before clearing (uncomment to use)
/*
-- Export to CSV files (you'll need to run these commands separately)
\copy schedule_data TO 'schedule_data_backup.csv' WITH CSV HEADER;
\copy processed_schedule_data TO 'processed_schedule_data_backup.csv' WITH CSV HEADER;
\copy modification_logs TO 'modification_logs_backup.csv' WITH CSV HEADER;
*/

-- Clear the detail tables
DELETE FROM schedule_data;
DELETE FROM processed_schedule_data;
DELETE FROM modification_logs;

-- Optional: Clear students table as well (uncomment if needed)
-- DELETE FROM students;

-- Show current record counts
SELECT 
    'schedule_data' as table_name, 
    COUNT(*) as record_count,
    'Raw schedule data' as description
FROM schedule_data
UNION ALL
SELECT 
    'processed_schedule_data' as table_name, 
    COUNT(*) as record_count,
    'Processed schedule data' as description
FROM processed_schedule_data
UNION ALL
SELECT 
    'modification_logs' as table_name, 
    COUNT(*) as record_count,
    'Modification logs' as description
FROM modification_logs
UNION ALL
SELECT 
    'students' as table_name, 
    COUNT(*) as record_count,
    'Student profiles (master data)' as description
FROM students
ORDER BY table_name;
