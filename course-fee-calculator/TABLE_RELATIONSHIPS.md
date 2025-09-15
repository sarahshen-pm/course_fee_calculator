# 数据库表关系图

## 🔗 表关系说明

```
┌─────────────────┐    ┌──────────────────────┐    ┌─────────────────┐
│  schedule_data  │───▶│processed_schedule_data│◀───│    students     │
│   (原始数据)     │    │    (处理后数据)        │    │   (学生档案)     │
└─────────────────┘    └──────────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    modification_logs                            │
│                      (修改日志)                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📋 详细关系说明

### 1. 数据流向关系

#### `schedule_data` → `processed_schedule_data`
- **关系类型**：数据转换
- **说明**：原始数据经过智能处理后存储到处理表
- **关键字段**：`name`, `date`, `title`

#### `students` → `processed_schedule_data`
- **关系类型**：数据匹配
- **说明**：学生档案用于匹配和补充课程数据
- **关键字段**：`name` (学生姓名)

#### 所有表 → `modification_logs`
- **关系类型**：审计追踪
- **说明**：记录所有表的修改历史
- **关键字段**：`table_name`, `record_id`

### 2. 字段关联关系

#### 学生姓名关联
```sql
-- students.name = processed_schedule_data.name
-- 用于匹配学生档案和课程数据
```

#### 时间关联
```sql
-- processed_schedule_data.created_at
-- 用于按时间排序显示数据
```

#### 费用计算关联
```sql
-- processed_schedule_data.fee_total = fee × hours
-- 自动计算字段
```

## 🎯 业务逻辑关系

### 数据输入流程
1. **原始输入** → `schedule_data`
2. **智能处理** → 匹配 `students` 表
3. **数据完善** → `processed_schedule_data`
4. **变更记录** → `modification_logs`

### 数据查询流程
1. **用户查询** → `processed_schedule_data`
2. **学生信息** → 关联 `students` 表
3. **历史记录** → 查询 `modification_logs`

### 数据维护流程
1. **学生档案更新** → `students` 表
2. **课程数据处理** → `processed_schedule_data`
3. **变更追踪** → `modification_logs`

## 🔍 关键查询关系

### 按家长分组查询
```sql
SELECT 
    p.parent,
    s.fee,
    COUNT(*) as lesson_count,
    SUM(p.fee_total) as total_amount
FROM processed_schedule_data p
JOIN students s ON p.name = s.name
GROUP BY p.parent, s.fee
ORDER BY total_amount DESC;
```

### 学生课程历史
```sql
SELECT 
    p.name,
    p.date,
    p.hours,
    p.fee_total,
    s.parent,
    s.graduated
FROM processed_schedule_data p
JOIN students s ON p.name = s.name
WHERE p.name = 'Aahana'
ORDER BY p.date DESC;
```

### 费用统计查询
```sql
SELECT 
    DATE_TRUNC('month', p.date) as month,
    COUNT(*) as total_lessons,
    SUM(p.fee_total) as total_revenue
FROM processed_schedule_data p
GROUP BY DATE_TRUNC('month', p.date)
ORDER BY month DESC;
```

## 📊 数据完整性约束

### 必需关系
1. **学生存在性**：`processed_schedule_data.name` 必须在 `students.name` 中存在
2. **费用一致性**：`processed_schedule_data.fee` 应该与 `students.fee` 一致
3. **家长一致性**：`processed_schedule_data.parent` 应该与 `students.parent` 一致

### 可选关系
1. **时间逻辑**：`startdate` ≤ `enddate`
2. **费用计算**：`fee_total` = `fee` × `hours`
3. **状态一致性**：`graduated` 状态应该合理

## 🛠️ 维护关系

### 数据同步
- 当 `students` 表更新时，相关的 `processed_schedule_data` 记录可能需要更新
- 当删除学生档案时，需要考虑是否保留历史课程记录

### 数据清理
- 定期清理过期的 `schedule_data` 记录
- 归档旧的 `modification_logs` 记录
- 维护 `processed_schedule_data` 的数据质量

### 性能优化
- 在关联字段上创建索引
- 考虑表分区策略
- 优化查询性能
