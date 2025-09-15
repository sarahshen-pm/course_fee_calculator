# SQL 脚本使用说明

## 📋 脚本列表

### 1. `check_and_reset_tables.sql` - 完整重置脚本
**用途**：完全重建所有表结构并清空数据
**使用场景**：
- 初次设置数据库
- 需要完全重新开始测试
- 表结构有重大变更

**执行步骤**：
1. 登录 Supabase Dashboard
2. 进入 SQL Editor
3. 复制并粘贴 `check_and_reset_tables.sql` 内容
4. 点击 "Run" 执行

**⚠️ 警告**：此脚本会删除所有现有数据！

### 2. `check_tables_only.sql` - 结构检查脚本
**用途**：检查并修复表结构，保留现有数据
**使用场景**：
- 检查表结构是否正确
- 添加缺失字段
- 移除错误字段
- 保留现有数据

**执行步骤**：
1. 登录 Supabase Dashboard
2. 进入 SQL Editor
3. 复制并粘贴 `check_tables_only.sql` 内容
4. 点击 "Run" 执行

### 3. `001_create_tables.sql` - 初始创建脚本
**用途**：创建初始表结构
**使用场景**：新项目初始化

### 4. `002_remove_dynamic_fields_from_students.sql` - 迁移脚本
**用途**：移除 students 表中的动态字段
**使用场景**：数据库结构优化

### 5. `003_add_language_field_to_students.sql` - 迁移脚本
**用途**：为 students 表添加 language 字段
**使用场景**：添加新功能

## 🎯 推荐使用流程

### 首次设置
```sql
-- 使用完整重置脚本
-- 执行 check_and_reset_tables.sql
```

### 日常检查
```sql
-- 使用结构检查脚本
-- 执行 check_tables_only.sql
```

### 数据备份
在执行任何脚本前，建议先备份重要数据：
```sql
-- 备份学生数据
SELECT * FROM students;

-- 备份课程数据
SELECT * FROM processed_schedule_data;
```

## 📊 表结构说明

### students 表
- `id` - 主键
- `name` - 学生姓名（唯一）
- `fee_per_hour` - 每小时标准费用
- `graduated` - 学生状态
- `parent` - 家长姓名
- `accompany_number` - 陪同编号
- `language` - 学生语言偏好
- `created_at` - 创建时间

### schedule_data 表
- `id` - 主键
- `title` - 课程标题
- `startdate` - 开始时间
- `enddate` - 结束时间
- `duration` - 持续时间
- `created_at` - 创建时间
- `updated_at` - 更新时间

### processed_schedule_data 表
- `id` - 主键
- `title` - 课程标题
- `startdate` - 开始时间
- `enddate` - 结束时间
- `duration` - 持续时间
- `hours` - 小时数
- `date` - 日期
- `name` - 学生姓名
- `fee_per_hour` - 每小时费用
- `graduated` - 学生状态
- `parent` - 家长姓名
- `accompany_number` - 陪同编号
- `fee_total` - 总费用（自动计算）
- `created_at` - 创建时间
- `updated_at` - 更新时间

## 🔧 故障排除

### 常见问题

1. **权限错误**
   - 确保使用正确的 Supabase 项目
   - 检查 API 密钥是否正确

2. **表已存在错误**
   - 使用 `check_and_reset_tables.sql` 完全重建
   - 或使用 `check_tables_only.sql` 检查结构

3. **字段类型错误**
   - 检查数据类型是否匹配
   - 使用 ALTER TABLE 修改字段类型

### 验证脚本执行结果

执行脚本后，检查以下内容：
1. 表结构是否正确
2. 索引是否创建
3. 数据是否完整
4. 权限是否正确设置

## 📞 支持

如果遇到问题，请检查：
1. Supabase 项目状态
2. 网络连接
3. SQL 语法错误
4. 权限设置
