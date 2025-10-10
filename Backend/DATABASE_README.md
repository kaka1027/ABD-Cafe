# ABD Cafe Backend - MySQL 数据库集成

## 🎉 已完成的工作

ABD Cafe 后端已成功从内存存储迁移到 MySQL 数据库！

---

## 📁 项目结构

```
Backend/
├── database/
│   ├── init.sql              # 数据库初始化脚本
│   └── DATABASE_GUIDE.md     # 数据库操作详细指南
├── src/
│   ├── config/
│   │   └── database.ts       # MySQL 连接配置
│   ├── models/
│   │   ├── UserModel.ts      # 旧版：内存存储（已弃用）
│   │   └── UserModelMySQL.ts # 新版：MySQL 存储（正在使用）
│   └── index.ts              # 服务器入口（已更新）
├── .env                      # 环境变量配置（包含数据库凭据）
└── package.json
```

---

## 🗄️ 数据库信息

- **数据库名称：** `abd_cafe_db`
- **数据库用户：** `KAKA`
- **字符集：** `utf8mb4`
- **排序规则：** `utf8mb4_unicode_ci`

### 数据表

#### `users` 表

| 字段              | 类型            | 说明                |
|-------------------|----------------|---------------------|
| id                | INT            | 主键，自增          |
| username          | VARCHAR(50)    | 用户名（唯一）      |
| email             | VARCHAR(100)   | 邮箱（唯一）        |
| password          | VARCHAR(255)   | 加密密码            |
| role              | ENUM           | 角色 (user/admin)   |
| avatar            | VARCHAR(500)   | 头像 URL            |
| remaining_quota   | DECIMAL(10,2)  | 剩余额度            |
| is_active         | BOOLEAN        | 账户状态            |
| created_at        | TIMESTAMP      | 创建时间            |
| updated_at        | TIMESTAMP      | 更新时间            |
| last_login_at     | TIMESTAMP      | 最后登录时间        |

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

确保 `.env` 文件包含以下配置：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=KAKA
DB_PASSWORD=Taxikaka2772
DB_NAME=abd_cafe_db
```

### 3. 初始化数据库（首次运行）

```bash
# 使用 MySQL 命令行运行初始化脚本
D:\Maggie\MySQL\mysql-9.4.0-winx64\bin\mysql.exe -uKAKA -pTaxikaka2772 < database/init.sql
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将自动：
- ✅ 测试数据库连接
- ✅ 初始化表结构（如果需要）
- ✅ 创建默认测试用户
- ✅ 启动 API 服务器

### 5. 验证运行状态

访问健康检查端点：
```bash
curl http://localhost:3001/health
```

---

## 👥 默认测试账户

服务器启动时会自动创建以下测试账户：

| 用户名  | 密码       | 角色   | 额度     |
|---------|-----------|--------|----------|
| admin   | admin123  | 管理员 | 1000.00  |
| user1   | user123   | 用户   | 85.50    |
| test    | 123456    | 用户   | 50.00    |

---

## 🔧 数据库管理

### 查看所有用户

```bash
D:\Maggie\MySQL\mysql-9.4.0-winx64\bin\mysql.exe -uKAKA -pTaxikaka2772 abd_cafe_db -e "SELECT * FROM users;"
```

### 修改用户额度

```sql
UPDATE users SET remaining_quota = 500.00 WHERE username = 'user1';
```

### 更多操作

详见 `database/DATABASE_GUIDE.md` 获取完整的数据库操作指南。

---

## 📊 API 端点

### 认证相关

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `POST /api/auth/logout` - 用户登出

### 系统相关

- `GET /health` - 健康检查
- `GET /api` - API 信息

---

## 🔒 安全说明

1. **密码加密：** 使用 bcrypt 加密存储
2. **环境变量：** `.env` 文件已在 `.gitignore` 中，不会提交到版本控制
3. **JWT 认证：** 使用 JWT 进行用户认证
4. **数据库用户：** 使用专用数据库用户（KAKA），而非 root

---

## 🛠️ 故障排查

### 数据库连接失败

1. 检查 MySQL 服务是否运行：
   ```bash
   tasklist | findstr mysql
   ```

2. 测试数据库连接：
   ```bash
   D:\Maggie\MySQL\mysql-9.4.0-winx64\bin\mysql.exe -uKAKA -pTaxikaka2772 abd_cafe_db
   ```

3. 检查 `.env` 配置是否正确

### 重置数据库

如果需要完全重置数据库：

```bash
# 重新运行初始化脚本
D:\Maggie\MySQL\mysql-9.4.0-winx64\bin\mysql.exe -uKAKA -pTaxikaka2772 < database/init.sql
```

---

## 📝 开发注意事项

### 从内存存储迁移到 MySQL 的变化

1. **导入模块：**
   ```typescript
   // 旧版（已弃用）
   import UserModel from './models/UserModel';

   // 新版（正在使用）
   import UserModel from './models/UserModelMySQL';
   ```

2. **异步操作：**
   所有数据库操作都是异步的，需要使用 `async/await`：
   ```typescript
   // 获取用户
   const user = await UserModel.findByUsername('admin');

   // 获取统计
   const stats = await UserModel.getStats();
   ```

3. **启动流程：**
   服务器启动时会依次：
   - 测试数据库连接
   - 初始化表结构
   - 初始化默认用户
   - 启动 Express 服务器

---

## 📚 相关文档

- [数据库操作指南](database/DATABASE_GUIDE.md) - 详细的数据库管理指南
- [数据库初始化脚本](database/init.sql) - SQL 建表脚本
- [MySQL 配置](src/config/database.ts) - 数据库连接配置

---

## 🔄 备份建议

建议定期备份数据库：

```bash
# 创建备份
D:\Maggie\MySQL\mysql-9.4.0-winx64\bin\mysqldump.exe -uKAKA -pTaxikaka2772 abd_cafe_db > backup.sql

# 恢复备份
D:\Maggie\MySQL\mysql-9.4.0-winx64\bin\mysql.exe -uKAKA -pTaxikaka2772 abd_cafe_db < backup.sql
```

---

**最后更新：** 2025-10-10
**版本：** 1.0.0
**数据库：** MySQL 9.4.0
