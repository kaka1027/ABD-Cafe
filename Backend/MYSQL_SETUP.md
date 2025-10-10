# MySQL 数据库接入指南

## 📋 概述

本项目已经从**内存存储**升级为 **MySQL 数据库存储**，数据持久化到数据库中。

**重要：** 所有 API 接口保持不变，前端无需修改！

---

## 🔧 服务器端配置步骤

### **步骤 1：在服务器上初始化 MySQL 数据库**

SSH 登录到阿里云服务器后，执行以下命令：

```bash
# 登录 MySQL（使用 root 用户）
mysql -u root -p

# 运行初始化脚本（在 MySQL 命令行中）
source /path/to/Backend/scripts/init-database.sql

# 或者直接执行 SQL
CREATE DATABASE IF NOT EXISTS abd_cafe_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'abd_cafe'@'localhost' IDENTIFIED BY '你的强密码';
GRANT ALL PRIVILEGES ON abd_cafe_db.* TO 'abd_cafe'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### **步骤 2：更新服务器上的 `.env` 文件**

编辑服务器上的 `.env` 文件：

```bash
cd /path/to/Backend
nano .env
```

**更新数据库配置部分：**

```env
# 数据库配置（MySQL）
DB_HOST=localhost
DB_PORT=3306
DB_USER=abd_cafe
DB_PASSWORD=你在步骤1设置的密码
DB_NAME=abd_cafe_db
```

保存并退出（Ctrl+O, Ctrl+X）

---

### **步骤 3：重新构建并启动 Docker 容器**

```bash
cd /path/to/Backend

# 重新构建镜像
docker-compose build

# 重启容器
docker-compose up -d

# 查看日志，确认数据库连接成功
docker-compose logs -f backend
```

**你应该看到类似的输出：**

```
✅ MySQL 数据库连接成功
✅ 数据库表结构初始化成功
✅ 默认用户初始化完成
📋 可用测试账户:
   - admin/admin123 (管理员)
   - user1/user123 (普通用户)
   - test/123456 (普通用户)
```

---

## 🎯 变更内容

### **新增文件**

1. `src/config/database.ts` - MySQL 连接池配置
2. `src/models/UserModelMySQL.ts` - MySQL 版本的用户模型
3. `scripts/init-database.sql` - 数据库初始化脚本
4. `MYSQL_SETUP.md` - 本文档

### **修改文件**

1. `src/index.ts` - 启动时初始化数据库
2. `package.json` - 添加 mysql2 依赖
3. `.env` / `.env.example` - 启用数据库配置

### **API 接口**

✅ **完全不变！** 所有接口路径和参数保持一致：

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /health`

---

## 🧪 测试数据库

### **方法 1：通过 API 测试**

```bash
# 健康检查（会显示用户统计）
curl https://cafe.kaka2772.cc/health

# 登录测试
curl -X POST https://cafe.kaka2772.cc/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### **方法 2：直接连接 MySQL 查看**

```bash
# SSH 到服务器
mysql -u abd_cafe -p abd_cafe_db

# 查看用户表
SELECT id, username, email, role, remaining_quota, created_at FROM users;
```

---

## 📊 数据库表结构

### **users 表**

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INT | 主键，自增 |
| `username` | VARCHAR(50) | 用户名，唯一 |
| `email` | VARCHAR(100) | 邮箱，唯一 |
| `password` | VARCHAR(255) | 密码（bcrypt 加密） |
| `role` | ENUM | 角色：user/admin |
| `avatar` | VARCHAR(500) | 头像 URL |
| `remaining_quota` | DECIMAL(10,2) | 剩余额度 |
| `is_active` | BOOLEAN | 是否激活 |
| `created_at` | TIMESTAMP | 创建时间 |
| `updated_at` | TIMESTAMP | 更新时间 |
| `last_login_at` | TIMESTAMP | 最后登录时间 |

---

## ⚠️ 重要说明

### **1. 数据迁移**

如果服务器已经在运行旧版本（内存存储），切换到 MySQL 后：

- 所有旧用户数据会丢失（内存数据不会迁移）
- 数据库会自动创建 3 个默认测试账户
- 建议先在测试环境验证

### **2. 密码安全**

- 数据库密码请使用强密码
- 不要将真实密码提交到 Git
- `.env` 文件已在 `.gitignore` 中

### **3. 数据库备份**

建议定期备份：

```bash
# 备份数据库
mysqldump -u abd_cafe -p abd_cafe_db > backup_$(date +%Y%m%d).sql

# 恢复数据库
mysql -u abd_cafe -p abd_cafe_db < backup_20251010.sql
```

---

## 🔄 回退到内存存储（如果需要）

如果遇到问题需要临时回退：

```typescript
// 修改 src/index.ts
// import UserModel from './models/UserModelMySQL';  // 注释掉
import UserModel from './models/UserModel';  // 改回原版
```

然后重新构建并重启容器。

---

## 🆘 常见问题

### Q1: 数据库连接失败

**检查：**
1. MySQL 服务是否运行：`systemctl status mysql`
2. 数据库用户和密码是否正确
3. 数据库名是否存在
4. `.env` 文件配置是否正确

### Q2: 表不存在

**解决：**
应用会自动创建表。如果没有，手动运行：
```bash
mysql -u abd_cafe -p abd_cafe_db < scripts/init-database.sql
```

### Q3: 默认用户未创建

**解决：**
重启应用，会自动检测并创建默认用户。

---

## ✅ 完成检查清单

部署 MySQL 版本前请确认：

- [ ] MySQL 服务已安装并运行
- [ ] 数据库 `abd_cafe_db` 已创建
- [ ] 数据库用户 `abd_cafe` 已创建并授权
- [ ] `.env` 文件中的数据库配置已更新
- [ ] 代码已推送到服务器
- [ ] Docker 容器已重新构建
- [ ] 查看日志确认数据库连接成功
- [ ] 测试登录功能正常
- [ ] 前端可以正常调用 API

---

祝你部署顺利！🚀
