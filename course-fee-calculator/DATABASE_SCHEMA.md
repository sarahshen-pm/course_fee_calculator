# 数据库表结构说明

## 📊 表结构总览

课程费用计算系统包含4个主要表，每个表都有特定的用途和维护内容。

---

## 1. 📅 `schedule_data` - 原始课程数据表

### 用途
存储从输入文本中解析出的原始课程安排数据，未经处理的原始信息。

### 字段说明

| 字段名 | 数据类型 | 约束 | 说明 |
|--------|----------|------|------|
| `id` | UUID | PRIMARY KEY | 主键，自动生成 |
| `title` | TEXT | NOT NULL | 课程标题/描述 |
| `startdate` | TIMESTAMP | NOT NULL | 课程开始时间 |
| `enddate` | TIMESTAMP | NOT NULL | 课程结束时间 |
| `duration` | TEXT | NOT NULL | 课程时长（如 "3:00:00"） |
| `hours` | DECIMAL(5,2) | NOT NULL | 课程小时数（如 3.00） |
| `date` | DATE | NOT NULL | 课程日期 |
| `name` | TEXT | NOT NULL | 学生姓名 |
| `fee_per_hour` | DECIMAL(8,2) | NULL | 每小时课程费用（可能为空） |
| `graduated` | TEXT | NULL | 学生状态（可能为空） |
| `parent` | TEXT | NOT NULL | 家长姓名 |
| `accompany_number` | INTEGER | DEFAULT 0 | 陪同编号 |
| `created_at` | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | 更新时间 |

### 维护内容
- 原始课程安排数据
- 从文本解析的初始信息
- 可能包含不完整或需要验证的数据

---

## 2. 🎯 `processed_schedule_data` - 处理后的课程数据表

### 用途
存储经过智能匹配和处理后的完整课程数据，相当于Python代码中的 `df_clean`。

### 字段说明

| 字段名 | 数据类型 | 约束 | 说明 |
|--------|----------|------|------|
| `id` | UUID | PRIMARY KEY | 主键，自动生成 |
| `title` | TEXT | NOT NULL | 课程标题/描述 |
| `startdate` | TIMESTAMP | NOT NULL | 课程开始时间 |
| `enddate` | TIMESTAMP | NOT NULL | 课程结束时间 |
| `duration` | TEXT | NOT NULL | 课程时长 |
| `hours` | DECIMAL(5,2) | NOT NULL | 课程小时数 |
| `date` | DATE | NOT NULL | 课程日期 |
| `name` | TEXT | NOT NULL | 学生姓名 |
| `fee_per_hour` | DECIMAL(8,2) | NOT NULL | 每小时课程费用（必填） |
| `graduated` | TEXT | NOT NULL | 学生状态（必填） |
| `parent` | TEXT | NOT NULL | 家长姓名 |
| `accompany_number` | INTEGER | NOT NULL | 陪同编号 |
| `fee_total` | DECIMAL(10,2) | GENERATED | 总费用（自动计算：fee_per_hour × hours） |
| `created_at` | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | 更新时间 |

### 维护内容
- 完整的课程数据
- 智能匹配的学生信息
- 自动计算的费用总额
- 按时间排序的数据记录

### 特殊功能
- `fee_total` 是计算字段，自动根据 `fee × hours` 生成
- 数据按 `created_at` 降序排列显示

---

## 3. 👥 `students` - 学生档案表

### 用途
存储学生的标准档案信息，仅包含基本的学生资料和费用标准。**不包含动态的课程数据**（如hours、date、title等）。

### 字段说明

| 字段名 | 数据类型 | 约束 | 说明 |
|--------|----------|------|------|
| `id` | UUID | PRIMARY KEY | 主键，自动生成 |
| `name` | TEXT | NOT NULL UNIQUE | 学生姓名（唯一） |
| `fee_per_hour` | DECIMAL(8,2) | NOT NULL | 每小时标准费用 |
| `graduated` | TEXT | NULL | 学生状态（Ongoing/Graduated） |
| `parent` | TEXT | NOT NULL | 家长姓名 |
| `accompany_number` | INTEGER | DEFAULT 0 | 陪同编号 |
| `language` | TEXT | DEFAULT 'English' | 学生语言偏好（English/Chinese等） |
| `created_at` | TIMESTAMP | DEFAULT NOW() | 创建时间 |

### 维护内容
- 32个学生的标准档案信息
- 固定的费用标准
- 家长联系信息
- 家长联系信息
- 陪同编号分组

### 学生数据示例
```
Aahana - Nisha - $80/hour - Ongoing
Giselle 林亭萱 - Giselle's Dad & Mum - $120/hour - Ongoing
Samara - Samara's Mum - $80/hour - Ongoing
...
```

---

## 4. 📝 `modification_logs` - 修改日志表

### 用途
记录所有数据修改的历史，用于审计和追踪变更。

### 字段说明

| 字段名 | 数据类型 | 约束 | 说明 |
|--------|----------|------|------|
| `id` | UUID | PRIMARY KEY | 主键，自动生成 |
| `table_name` | TEXT | NOT NULL | 被修改的表名 |
| `record_id` | UUID | NOT NULL | 被修改的记录ID |
| `field_name` | TEXT | NOT NULL | 被修改的字段名 |
| `old_value` | TEXT | NULL | 修改前的值 |
| `new_value` | TEXT | NULL | 修改后的值 |
| `modified_at` | TIMESTAMP | DEFAULT NOW() | 修改时间 |
| `modified_by` | TEXT | NULL | 修改者 |

### 维护内容
- 所有数据变更记录
- 字段级别的修改历史
- 修改时间和操作者信息

---

## 🔐 安全设置

### Row Level Security (RLS)
所有表都启用了行级安全：
```sql
ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;
```

### 访问策略
由于是单用户系统，所有表都允许完全访问：
```sql
CREATE POLICY "Allow all operations on [table_name]" ON [table_name] FOR ALL USING (true);
```

---

## 📈 数据流程

### 1. 数据输入流程
```
原始文本 → 提取原始数据 → schedule_data表 → 智能匹配处理 → processed_schedule_data表
```

### 2. 详细处理步骤
```
Step 1: 输入文本 → extractRawScheduleData() → schedule_data表（原始课程安排数据）
Step 2: schedule_data表 → processScheduleDataFromRaw() → processed_schedule_data表（完整课程数据）
```

### 3. 学生匹配流程
```
processed_schedule_data + students表（标准信息） → 费用计算 → 完整记录
```

### 4. 数据展示流程
```
processed_schedule_data → 按时间排序 → 表格显示
```

### 重要说明
- **schedule_data表**：存储从输入文本中解析出的原始课程安排数据，未经处理的原始信息
- **students表**：仅维护学生标准信息，不包含动态课程数据
- **processed_schedule_data表**：包含完整的课程数据，相当于Python代码中的 `df_clean`
- **数据提取**：不会修改students表内容，只读取标准信息进行匹配
- **重复数据处理**：导入重复数据时会进行校验，新数据插入，重复数据覆盖更新

---

## 🛠️ 维护建议

### 定期维护
1. **数据清理**：定期清理过期的 `schedule_data` 记录
2. **日志管理**：定期归档 `modification_logs` 中的旧记录
3. **学生档案**：及时更新 `students` 表中的状态变更

### 性能优化
1. **索引建议**：在 `date`, `name`, `parent` 字段上创建索引
2. **分区建议**：考虑按日期对 `processed_schedule_data` 进行分区
3. **归档策略**：定期将历史数据移动到归档表

### 数据完整性
1. **外键约束**：确保 `processed_schedule_data.name` 在 `students.name` 中存在
2. **数据验证**：确保费用和小时数为正数
3. **日期验证**：确保日期格式正确且逻辑合理

---

## 🔍 查询示例

### 查看所有学生档案
```sql
SELECT name, fee_per_hour, graduated, parent, accompany_number, language 
FROM students 
ORDER BY name;
```

### 查看最新的课程数据
```sql
SELECT * FROM processed_schedule_data 
ORDER BY created_at DESC 
LIMIT 20;
```

### 按家长分组统计
```sql
SELECT parent, COUNT(*) as student_count, SUM(fee_total) as total_fee
FROM processed_schedule_data 
GROUP BY parent 
ORDER BY total_fee DESC;
```

### 查看修改历史
```sql
SELECT table_name, field_name, old_value, new_value, modified_at
FROM modification_logs 
ORDER BY modified_at DESC 
LIMIT 10;
```
