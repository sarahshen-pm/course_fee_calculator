# 部署到 Vercel 指南

## 🚀 快速部署

### 1. 准备环境变量

在 Vercel 项目设置中添加以下环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. 部署步骤

1. **连接 GitHub 仓库**
   - 在 Vercel 控制台中点击 "New Project"
   - 选择你的 GitHub 仓库

2. **配置项目**
   - Framework Preset: Next.js
   - Root Directory: `./` (默认)
   - Build Command: `npm run build` (默认)
   - Output Directory: `.next` (默认)

3. **添加环境变量**
   - 在项目设置中添加上述环境变量
   - 确保变量名称完全匹配

4. **部署**
   - 点击 "Deploy" 开始部署
   - 等待构建完成

## 📋 部署前检查清单

- ✅ 删除了所有 `console.log` 调试代码
- ✅ 删除了开发时的临时文件
- ✅ 修复了所有 TypeScript 错误
- ✅ 构建测试通过
- ✅ 创建了 `.gitignore` 文件
- ✅ 优化了 `next.config.mjs` 配置

## 🗄️ 数据库设置

部署前确保在 Supabase 中：

1. **创建必要的表**
   - 运行 `scripts/001_create_tables.sql`
   - 运行 `scripts/002_remove_dynamic_fields_from_students.sql`
   - 运行 `scripts/003_add_language_field_to_students.sql`

2. **设置 Row Level Security (RLS)**
   - 确保所有表都启用了 RLS
   - 配置适当的访问策略

## 🔧 故障排除

### 构建失败
- 检查环境变量是否正确设置
- 确保所有依赖都已安装
- 查看构建日志中的具体错误

### 运行时错误
- 检查 Supabase 连接
- 验证数据库表结构
- 查看浏览器控制台错误

### 环境变量问题
- 确保变量名称以 `NEXT_PUBLIC_` 开头
- 检查变量值是否正确
- 重新部署以应用新的环境变量

## 📱 功能验证

部署后验证以下功能：

- ✅ 数据输入和处理
- ✅ 表格显示和筛选
- ✅ SMS 生成器
- ✅ 数据库连接
- ✅ 响应式设计

## 🔄 更新部署

每次代码更新后：
1. 推送到 GitHub 主分支
2. Vercel 会自动触发重新部署
3. 检查部署状态和日志
