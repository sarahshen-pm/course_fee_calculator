-- Clear detail tables data
-- This script will delete all data from the detail tables while preserving the student profiles

-- Clear raw schedule data table
DELETE FROM schedule_data;

-- Clear processed schedule data table  
DELETE FROM processed_schedule_data;

-- Clear modification logs table
DELETE FROM modification_logs;

-- Note: We keep the students table intact as it contains the master student data
-- If you also want to clear the students table, uncomment the line below:
-- DELETE FROM students;

-- Reset auto-increment sequences if any (though we're using UUIDs)
-- This is just for reference in case you switch to auto-increment IDs later

-- Verify the tables are empty
SELECT 'schedule_data' as table_name, COUNT(*) as record_count FROM schedule_data
UNION ALL
SELECT 'processed_schedule_data' as table_name, COUNT(*) as record_count FROM processed_schedule_data
UNION ALL
SELECT 'modification_logs' as table_name, COUNT(*) as record_count FROM modification_logs
UNION ALL
SELECT 'students' as table_name, COUNT(*) as record_count FROM students;
