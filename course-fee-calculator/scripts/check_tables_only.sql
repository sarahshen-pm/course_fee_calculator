-- =====================================================
-- 仅检查Supabase表格结构脚本（不清空数据）
-- 用途：检查表格结构是否正确，如不匹配则修改
-- 日期：2024-01-XX
-- =====================================================

-- 1. 检查并添加缺失的字段

-- 1.1 检查 students 表是否有 language 字段
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'students' 
        AND column_name = 'language'
    ) THEN
        ALTER TABLE students ADD COLUMN language TEXT DEFAULT 'English';
        RAISE NOTICE 'Added language column to students table';
    ELSE
        RAISE NOTICE 'language column already exists in students table';
    END IF;
END $$;

-- 1.2 检查 students 表是否有其他必要字段
DO $$
BEGIN
    -- 检查 fee_per_hour 字段
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'students' 
        AND column_name = 'fee_per_hour'
    ) THEN
        ALTER TABLE students ADD COLUMN fee_per_hour DECIMAL(8,2);
        RAISE NOTICE 'Added fee_per_hour column to students table';
    END IF;
    
    -- 检查 graduated 字段
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'students' 
        AND column_name = 'graduated'
    ) THEN
        ALTER TABLE students ADD COLUMN graduated TEXT;
        RAISE NOTICE 'Added graduated column to students table';
    END IF;
    
    -- 检查 parent 字段
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'students' 
        AND column_name = 'parent'
    ) THEN
        ALTER TABLE students ADD COLUMN parent TEXT;
        RAISE NOTICE 'Added parent column to students table';
    END IF;
    
    -- 检查 accompany_number 字段
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'students' 
        AND column_name = 'accompany_number'
    ) THEN
        ALTER TABLE students ADD COLUMN accompany_number INTEGER DEFAULT 0;
        RAISE NOTICE 'Added accompany_number column to students table';
    END IF;
END $$;

-- 1.3 检查 processed_schedule_data 表是否有 fee_per_hour 字段
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'processed_schedule_data' 
        AND column_name = 'fee_per_hour'
    ) THEN
        ALTER TABLE processed_schedule_data ADD COLUMN fee_per_hour DECIMAL(8,2);
        RAISE NOTICE 'Added fee_per_hour column to processed_schedule_data table';
    ELSE
        RAISE NOTICE 'fee_per_hour column already exists in processed_schedule_data table';
    END IF;
END $$;

-- 2. 移除 students 表中不应该存在的字段
DO $$
BEGIN
    -- 移除 hours 字段（如果存在）
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'students' 
        AND column_name = 'hours'
    ) THEN
        ALTER TABLE students DROP COLUMN hours;
        RAISE NOTICE 'Removed hours column from students table';
    END IF;
    
    -- 移除 date 字段（如果存在）
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'students' 
        AND column_name = 'date'
    ) THEN
        ALTER TABLE students DROP COLUMN date;
        RAISE NOTICE 'Removed date column from students table';
    END IF;
    
    -- 移除 title 字段（如果存在）
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'students' 
        AND column_name = 'title'
    ) THEN
        ALTER TABLE students DROP COLUMN title;
        RAISE NOTICE 'Removed title column from students table';
    END IF;
END $$;

-- 3. 更新现有记录的 language 字段（如果为空）
UPDATE students SET language = 'English' WHERE language IS NULL OR language = '';

-- 4. 显示当前表结构
SELECT 'Current table structure:' as info;

SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('schedule_data', 'processed_schedule_data', 'students', 'modification_logs')
ORDER BY table_name, ordinal_position;

-- 5. 显示数据统计
SELECT 'Data statistics:' as info;

SELECT 
  'students' as table_name,
  COUNT(*) as record_count,
  COUNT(DISTINCT language) as language_count,
  COUNT(DISTINCT parent) as parent_count
FROM students
UNION ALL
SELECT 
  'schedule_data' as table_name,
  COUNT(*) as record_count,
  0 as language_count,
  0 as parent_count
FROM schedule_data
UNION ALL
SELECT 
  'processed_schedule_data' as table_name,
  COUNT(*) as record_count,
  0 as language_count,
  0 as parent_count
FROM processed_schedule_data;
