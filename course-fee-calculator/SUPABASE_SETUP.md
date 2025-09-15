# Supabase 设置指南

## 🚀 快速开始

### 方法一：直接访问Supabase官网（推荐）

1. **访问Supabase官网**
   - 打开 [https://supabase.com](https://supabase.com)
   - 点击 "Start your project" 或 "Sign up"
   - 使用GitHub、Google或邮箱注册

2. **创建新项目**
   - 登录后点击 "New Project"
   - 选择组织（如果没有，会提示创建）
   - 填写项目信息：
     - **Name**: `course-fee-calculator`
     - **Database Password**: 设置一个强密码（记住这个密码）
     - **Region**: 选择离你最近的地区
   - 点击 "Create new project"

3. **获取API密钥**
   - 项目创建完成后，点击左侧菜单的 "Settings"
   - 选择 "API" 选项卡
   - 复制以下信息：
     - **Project URL** (例如: `https://your-project-id.supabase.co`)
     - **anon public** key (以 `eyJ` 开头的长字符串)

4. **配置环境变量**
   - 在项目根目录创建 `.env.local` 文件
   - 添加以下内容：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

5. **设置数据库**
   - 在Supabase仪表板中，点击 "SQL Editor"
   - 点击 "New query"
   - 复制 `scripts/001_create_tables.sql` 文件的内容
   - 粘贴到SQL编辑器中并执行

### 方法二：通过Vercel Marketplace

如果你通过Vercel访问遇到问题：

1. **在Vercel中集成Supabase**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 选择你的项目
   - 点击 "Integrations" 标签
   - 搜索并添加 "Supabase" 集成
   - 按照提示完成设置

2. **获取环境变量**
   - 在Vercel项目设置中找到 "Environment Variables"
   - 添加以下变量：
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 方法三：临时开发模式

如果暂时无法设置Supabase，应用会以离线模式运行：

1. **应用功能**
   - ✅ 数据输入和解析
   - ✅ 学生信息匹配
   - ✅ 费用计算
   - ❌ 数据保存到数据库
   - ❌ 历史数据查看

2. **后续设置**
   - 完成Supabase设置后，重启开发服务器
   - 所有功能将自动启用

## 🔧 故障排除

### 问题：Projects are managed by Vercel Marketplace

**解决方案：**
- 直接访问 [https://supabase.com](https://supabase.com) 而不是通过Vercel
- 或者按照方法二在Vercel中正确集成Supabase

### 问题：无法创建项目

**解决方案：**
- 确保使用有效的邮箱注册
- 检查网络连接
- 尝试使用不同的浏览器
- 清除浏览器缓存和Cookie

### 问题：API密钥无效

**解决方案：**
- 确认复制了完整的密钥（包括开头的 `eyJ`）
- 检查 `.env.local` 文件格式是否正确
- 确认没有多余的空格或引号
- 重启开发服务器

## 📱 验证设置

设置完成后，你应该能够：

1. ✅ 在浏览器控制台看到 "Supabase configured successfully"
2. ✅ 在 "Data Input" 标签页看到右侧的 "Processed Data" 面板
3. ✅ 成功保存数据到数据库
4. ✅ 在右侧面板看到保存的数据

## 🆘 需要帮助？

如果遇到问题：

1. 检查 [Supabase 官方文档](https://supabase.com/docs)
2. 查看项目 README.md 文件
3. 确认所有步骤都已完成
4. 重启开发服务器

---

**提示：** 建议使用方法一（直接访问Supabase官网），这是最直接和可靠的方式。
