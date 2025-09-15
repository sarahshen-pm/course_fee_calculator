-- Create tables for course fee calculator system

-- Table to store processed schedule data
CREATE TABLE IF NOT EXISTS schedule_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  startdate TIMESTAMP NOT NULL,
  enddate TIMESTAMP NOT NULL,
  duration TEXT NOT NULL,
  hours DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  fee_per_hour DECIMAL(8,2),
  graduated TEXT,
  parent TEXT NOT NULL,
  accompany_number INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table to store processed and cleaned schedule data (df_clean equivalent)
CREATE TABLE IF NOT EXISTS processed_schedule_data (
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

-- Table to store student profiles (standard information only)
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  fee_per_hour DECIMAL(8,2) NOT NULL,
  graduated TEXT,
  parent TEXT NOT NULL,
  accompany_number INTEGER DEFAULT 0,
  language TEXT DEFAULT 'English',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table to track data modifications
CREATE TABLE IF NOT EXISTS modification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  modified_at TIMESTAMP DEFAULT NOW(),
  modified_by TEXT
);

-- Enable Row Level Security
ALTER TABLE schedule_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE processed_schedule_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE modification_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a single-user system)
CREATE POLICY "Allow all operations on schedule_data" ON schedule_data FOR ALL USING (true);
CREATE POLICY "Allow all operations on processed_schedule_data" ON processed_schedule_data FOR ALL USING (true);
CREATE POLICY "Allow all operations on students" ON students FOR ALL USING (true);
CREATE POLICY "Allow all operations on modification_logs" ON modification_logs FOR ALL USING (true);

-- Insert complete student data based on the Python configuration
INSERT INTO students (name, fee_per_hour, graduated, parent, accompany_number) VALUES
('Aahana', 80.00, 'Ongoing', 'Nisha', 0),
('Giselle 林亭萱', 120.00, 'Ongoing', 'Giselle''s Dad & Mum', 0),
('Samara', 80.00, 'Ongoing', 'Samara''s Mum', 0),
('Shiv', 80.00, 'Ongoing', 'Smiti', 0),
('Sophia', 80.00, 'Ongoing', 'Filzait', 0),
('Yuno', 80.00, 'Ongoing', 'Yuno''s Mum', 0),
('周毅', 50.00, 'Ongoing', '周太太', 0),
('育瑜', 100.00, 'Ongoing', 'Yuyu''s Mum', 0),
('补习中心', 60.00, 'Ongoing', '补习中心', 0),
('鼎恩', 70.00, 'Ongoing', '鼎恩妈妈', 0),
('Aaliya', 100.00, 'Ongoing', 'Suruchi', 1),
('Zahia', 100.00, 'Ongoing', 'Suruchi', 1),
('Aaron', 80.00, 'Ongoing', 'Hui Mien', 2),
('Bono', 60.00, 'Ongoing', 'Bono媽媽', 2),
('sheera', 60.00, 'Ongoing', 'Hui Mien', 2),
('亚拉', 80.00, 'Ongoing', 'Inoshi', 3),
('凯文', 80.00, 'Ongoing', 'Inoshi', 3),
('景銓', 70.00, 'Ongoing', 'Joyce', 4),
('銘浩', 70.00, 'Ongoing', 'Joyce', 4),
('睿恩', 100.00, 'Ongoing', '睿恩爸爸', 5),
('睿洋', 100.00, 'Ongoing', '睿恩爸爸', 5),
('妍怡', 80.00, 'Ongoing', 'Val', 6),
('彦俊', 80.00, 'Ongoing', 'Val', 6),
('子樑', 80.00, 'Ongoing', '惠宁妈妈', 7),
('惠宁', 80.00, 'Ongoing', '惠宁妈妈', 7),
('jingjun', 80.00, 'Ongoing', 'Mabel', 8),
('jingyang', 80.00, 'Ongoing', 'Mabel', 8),
('Lauren', 80.00, 'Graduated', 'Noelle', 0),
('勇君', 80.00, 'Graduated', '勇君婆婆', 0),
('祉萱', 80.00, 'Graduated', 'Zhixuan''s Mum', 0),
('杰乐', 100.00, 'Graduated', '杰乐妈妈', 0),
('柏谦', 80.00, 'Graduated', '柏谦妈妈', 0)
ON CONFLICT (name) DO NOTHING;
