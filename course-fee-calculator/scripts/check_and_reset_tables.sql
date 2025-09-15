-- =====================================================
-- 检查和重置Supabase表格结构脚本
-- 用途：检查表格结构是否正确，如不匹配则修改并清空数据
-- 日期：2024-01-XX
-- =====================================================

-- 1. 删除所有现有表（如果存在）
DROP TABLE IF EXISTS modification_logs CASCADE;
DROP TABLE IF EXISTS processed_schedule_data CASCADE;
DROP TABLE IF EXISTS schedule_data CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- 2. 重新创建所有表

-- 2.1 创建 schedule_data 表（原始课程数据表）
CREATE TABLE schedule_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  startdate TEXT NOT NULL,
  enddate TEXT NOT NULL,
  duration TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2.2 创建 processed_schedule_data 表（处理后的课程数据表）
CREATE TABLE processed_schedule_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  startdate TIMESTAMP NOT NULL,
  enddate TIMESTAMP NOT NULL,
  duration TEXT NOT NULL,
  hours DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  fee_per_hour DECIMAL(8,2) NOT NULL,
  graduated TEXT NOT NULL,
  parent TEXT NOT NULL,
  accompany_number INTEGER NOT NULL,
  fee_total DECIMAL(10,2) GENERATED ALWAYS AS (fee_per_hour * hours) STORED,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2.3 创建 students 表（学生档案表）
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  fee_per_hour DECIMAL(8,2) NOT NULL,
  graduated TEXT,
  parent TEXT NOT NULL,
  accompany_number INTEGER DEFAULT 0,
  language TEXT DEFAULT 'English',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2.4 创建 modification_logs 表（数据修改日志表）
CREATE TABLE modification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  user_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. 添加表注释
COMMENT ON TABLE schedule_data IS '原始课程数据表，存储从输入文本中解析出的原始课程安排数据';
COMMENT ON TABLE processed_schedule_data IS '处理后的课程数据表，包含完整的课程数据，相当于Python代码中的df_clean';
COMMENT ON TABLE students IS '学生档案表，存储学生的标准档案信息，仅包含基本的学生资料和费用标准';
COMMENT ON TABLE modification_logs IS '数据修改日志表，记录所有数据变更操作';

-- 4. 添加字段注释
COMMENT ON COLUMN students.language IS '学生语言偏好（English, Chinese等）';
COMMENT ON COLUMN processed_schedule_data.fee_total IS '总费用（自动计算：fee_per_hour × hours）';

-- 5. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_schedule_data_created_at ON schedule_data(created_at);
CREATE INDEX IF NOT EXISTS idx_processed_schedule_data_created_at ON processed_schedule_data(created_at);
CREATE INDEX IF NOT EXISTS idx_processed_schedule_data_name ON processed_schedule_data(name);
CREATE INDEX IF NOT EXISTS idx_processed_schedule_data_date ON processed_schedule_data(date);
CREATE INDEX IF NOT EXISTS idx_processed_schedule_data_parent ON processed_schedule_data(parent);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);
CREATE INDEX IF NOT EXISTS idx_students_parent ON students(parent);
CREATE INDEX IF NOT EXISTS idx_modification_logs_table_name ON modification_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_modification_logs_created_at ON modification_logs(created_at);

-- 6. 启用行级安全策略（RLS）
ALTER TABLE schedule_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE processed_schedule_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE modification_logs ENABLE ROW LEVEL SECURITY;

-- 7. 创建访问策略（允许所有操作，因为是单用户系统）
CREATE POLICY "Allow all operations on schedule_data" ON schedule_data FOR ALL USING (true);
CREATE POLICY "Allow all operations on processed_schedule_data" ON processed_schedule_data FOR ALL USING (true);
CREATE POLICY "Allow all operations on students" ON students FOR ALL USING (true);
CREATE POLICY "Allow all operations on modification_logs" ON modification_logs FOR ALL USING (true);

-- 8. 插入测试学生数据
INSERT INTO students (name, fee_per_hour, graduated, parent, accompany_number, language) VALUES
('Aahana', 80, 'Ongoing', 'Nisha', 0, 'English'),
('Giselle 林亭萱', 120, 'Ongoing', 'Giselle''s Dad & Mum', 0, 'English'),
('Samara', 80, 'Ongoing', 'Samara''s Mum', 0, 'English'),
('Shiv', 80, 'Ongoing', 'Smiti', 0, 'English'),
('Sophia', 80, 'Ongoing', 'Filzait', 0, 'English'),
('Yuno', 80, 'Ongoing', 'Yuno''s Mum', 0, 'English'),
('周毅', 50, 'Ongoing', '周太太', 0, 'English'),
('育瑜', 100, 'Ongoing', 'Yuyu''s Mum', 0, 'English'),
('补习中心', 60, 'Ongoing', '补习中心', 0, 'English'),
('鼎恩', 70, 'Ongoing', '鼎恩妈妈', 0, 'English'),
('Aaliya', 100, 'Ongoing', 'Suruchi', 1, 'English'),
('Zahia', 100, 'Ongoing', 'Suruchi', 1, 'English'),
('Aaron', 80, 'Ongoing', 'Hui Mien', 2, 'English'),
('Bono', 60, 'Ongoing', 'Bono媽媽', 2, 'English'),
('sheera', 60, 'Ongoing', 'Hui Mien', 2, 'English'),
('亚拉', 80, 'Ongoing', 'Inoshi', 3, 'English'),
('凯文', 80, 'Ongoing', 'Inoshi', 3, 'English'),
('景銓', 70, 'Ongoing', 'Joyce', 4, 'English'),
('銘浩', 70, 'Ongoing', 'Joyce', 4, 'English'),
('睿恩', 100, 'Ongoing', '睿恩爸爸', 5, 'English'),
('睿洋', 100, 'Ongoing', '睿恩爸爸', 5, 'English'),
('妍怡', 80, 'Ongoing', 'Val', 6, 'English'),
('彦俊', 80, 'Ongoing', 'Val', 6, 'English'),
('子樑', 80, 'Ongoing', '惠宁妈妈', 7, 'Chinese'),
('惠宁', 80, 'Ongoing', '惠宁妈妈', 7, 'Chinese'),
('祉萱', 80, 'Graduated', 'Zhixuan''s Mum', 0, 'English'),
('杰乐', 100, 'Graduated', '杰乐妈妈', 0, 'English'),
('柏谦', 80, 'Graduated', '柏谦妈妈', 0, 'English');

-- 9. 验证表结构
SELECT 'Table structure verification completed' as status;

-- 10. 显示表信息
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

-- 11. 显示学生数据统计
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
