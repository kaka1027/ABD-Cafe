# ABD Cafe 数据库操作指南

这份指南将教你如何查看、修改和管理 ABD Cafe 的 MySQL 数据库。

---

## 📋 目录

1. [连接数据库](#1-连接数据库)
2. [查看数据](#2-查看数据)
3. [修改数据](#3-修改数据)
4. [添加数据](#4-添加数据)
5. [删除数据](#5-删除数据)
6. [常用查询示例](#6-常用查询示例)
7. [备份和恢复](#7-备份和恢复)
8. [故障排查](#8-故障排查)

---

## 1. 连接数据库

### 方法 A: 使用命令行

打开命令提示符（CMD）或 PowerShell，运行：

```bash
D:\Maggie\MySQL\mysql-9.4.0-winx64\bin\mysql.exe -uKAKA -pTaxikaka2772 abd_cafe_db
```

**参数说明：**
- `-u` : 用户名 (KAKA)
- `-p` : 密码 (Taxikaka2772)
- `abd_cafe_db` : 数据库名称

### 方法 B: 使用 MySQL Workbench（推荐）

1. 打开 MySQL Workbench
2. 创建新连接：
   - Connection Name: ABD Cafe
   - Hostname: localhost
   - Port: 3306
   - Username: KAKA
   - Password: Taxikaka2772
3. 点击 "Test Connection" 测试连接
4. 连接成功后，选择 `abd_cafe_db` 数据库

---

## 2. 查看数据

### 2.1 查看所有用户

```sql
-- 查看所有用户的基本信息
SELECT id, username, email, role, remaining_quota, is_active, created_at
FROM users;
```

### 2.2 查看特定用户

```sql
-- 根据用户名查找
SELECT * FROM users WHERE username = 'admin';

-- 根据邮箱查找
SELECT * FROM users WHERE email = 'admin@abdcafe.com';

-- 根据ID查找
SELECT * FROM users WHERE id = 1;
```

### 2.3 查看用户统计

```sql
-- 统计总用户数
SELECT COUNT(*) AS total_users FROM users;

-- 统计活跃用户
SELECT COUNT(*) AS active_users FROM users WHERE is_active = TRUE;

-- 按角色统计
SELECT role, COUNT(*) AS count
FROM users
GROUP BY role;
```

### 2.4 查看最近注册的用户

```sql
-- 最近5个注册的用户
SELECT username, email, created_at
FROM users
ORDER BY created_at DESC
LIMIT 5;
```

---

## 3. 修改数据

### 3.1 修改用户额度

```sql
-- 修改指定用户的额度
UPDATE users
SET remaining_quota = 200.00
WHERE username = 'user1';

-- 增加用户额度（在原有基础上增加）
UPDATE users
SET remaining_quota = remaining_quota + 50.00
WHERE username = 'admin';

-- 减少用户额度
UPDATE users
SET remaining_quota = remaining_quota - 10.00
WHERE id = 2;
```

### 3.2 修改用户角色

```sql
-- 将普通用户升级为管理员
UPDATE users
SET role = 'admin'
WHERE username = 'user1';

-- 将管理员降级为普通用户
UPDATE users
SET role = 'user'
WHERE username = 'admin';
```

### 3.3 修改用户信息

```sql
-- 修改邮箱
UPDATE users
SET email = 'newemail@example.com'
WHERE username = 'user1';

-- 修改用户名
UPDATE users
SET username = 'newusername'
WHERE id = 2;
```

### 3.4 禁用/启用用户

```sql
-- 禁用用户（用户将无法登录）
UPDATE users
SET is_active = FALSE
WHERE username = 'test';

-- 启用用户
UPDATE users
SET is_active = TRUE
WHERE username = 'test';
```

---

## 4. 添加数据

### 4.1 手动添加用户

**注意：** 密码需要先加密。使用以下方式添加用户：

#### 方式 A: 通过 API 注册（推荐）

使用 Postman 或 curl 调用注册接口：

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@abdcafe.com",
    "password": "password123"
  }'
```

#### 方式 B: 直接插入（仅用于测试，密码已加密）

```sql
-- 插入新用户（密码为 'password123' 的 bcrypt 哈希值）
INSERT INTO users (username, email, password, role, remaining_quota, avatar)
VALUES (
  'newuser',
  'newuser@abdcafe.com',
  '$2a$10$abcdefghijklmnopqrstuv1234567890ABCDEFGHIJKLMNOP',  -- 这是示例，实际需要生成
  'user',
  100.00,
  'https://ui-avatars.com/api/?name=newuser&background=6366f1&color=fff&size=128'
);
```

**密码加密说明：**
密码使用 bcrypt 加密，直接插入明文密码无法登录。建议通过 API 注册。

---

## 5. 删除数据

### 5.1 软删除（推荐）

软删除不会真正删除数据，只是将用户标记为非活跃状态：

```sql
-- 软删除用户
UPDATE users
SET is_active = FALSE
WHERE username = 'user_to_delete';
```

### 5.2 硬删除（慎用）

**⚠️ 警告：此操作不可恢复！**

```sql
-- 删除指定用户
DELETE FROM users WHERE username = 'user_to_delete';

-- 删除指定ID的用户
DELETE FROM users WHERE id = 5;
```

### 5.3 清空所有用户数据（慎用）

**⚠️ 警告：这将删除所有用户！**

```sql
-- 清空 users 表
TRUNCATE TABLE users;

-- 或者
DELETE FROM users;
```

---

## 6. 常用查询示例

### 6.1 查找额度不足的用户

```sql
-- 查找额度小于10的用户
SELECT username, email, remaining_quota
FROM users
WHERE remaining_quota < 10.00
AND is_active = TRUE;
```

### 6.2 查找长期未登录的用户

```sql
-- 查找30天未登录的用户
SELECT username, email, last_login_at
FROM users
WHERE last_login_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
OR last_login_at IS NULL;
```

### 6.3 批量修改额度

```sql
-- 给所有活跃用户增加100额度
UPDATE users
SET remaining_quota = remaining_quota + 100.00
WHERE is_active = TRUE;

-- 给管理员用户设置无限额度
UPDATE users
SET remaining_quota = 9999999.00
WHERE role = 'admin';
```

### 6.4 查找重复邮箱

```sql
-- 检查是否有重复的邮箱
SELECT email, COUNT(*) as count
FROM users
GROUP BY email
HAVING count > 1;
```

---

## 7. 备份和恢复

### 7.1 备份数据库

使用 mysqldump 工具备份：

```bash
# 备份整个数据库
D:\Maggie\MySQL\mysql-9.4.0-winx64\bin\mysqldump.exe -uKAKA -pTaxikaka2772 abd_cafe_db > backup_$(date +%Y%m%d).sql

# Windows PowerShell 版本
D:\Maggie\MySQL\mysql-9.4.0-winx64\bin\mysqldump.exe -uKAKA -pTaxikaka2772 abd_cafe_db > "backup_$(Get-Date -Format 'yyyyMMdd').sql"

# 只备份 users 表
D:\Maggie\MySQL\mysql-9.4.0-winx64\bin\mysqldump.exe -uKAKA -pTaxikaka2772 abd_cafe_db users > users_backup.sql
```

### 7.2 恢复数据库

```bash
# 恢复整个数据库
D:\Maggie\MySQL\mysql-9.4.0-winx64\bin\mysql.exe -uKAKA -pTaxikaka2772 abd_cafe_db < backup_20251010.sql
```

### 7.3 导出用户数据为 CSV

```sql
-- 在 MySQL 命令行中执行
SELECT id, username, email, role, remaining_quota, created_at
INTO OUTFILE 'C:/Users/bronh/Desktop/users_export.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
FROM users;
```

---

## 8. 故障排查

### 8.1 无法连接数据库

**检查步骤：**

1. **确认 MySQL 服务正在运行：**
   ```bash
   # 检查 MySQL 进程
   tasklist | findstr mysql
   ```

2. **测试连接：**
   ```bash
   D:\Maggie\MySQL\mysql-9.4.0-winx64\bin\mysql.exe -uKAKA -pTaxikaka2772 -e "SELECT 1"
   ```

3. **检查 .env 配置：**
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=KAKA
   DB_PASSWORD=Taxikaka2772
   DB_NAME=abd_cafe_db
   ```

### 8.2 查看数据库错误日志

```sql
-- 查看最近的错误
SHOW ERRORS;

-- 查看警告
SHOW WARNINGS;
```

### 8.3 重置数据库

如果数据库出现问题，可以重新初始化：

```bash
# 1. 删除数据库
D:\Maggie\MySQL\mysql-9.4.0-winx64\bin\mysql.exe -uKAKA -pTaxikaka2772 -e "DROP DATABASE abd_cafe_db;"

# 2. 重新创建数据库
D:\Maggie\MySQL\mysql-9.4.0-winx64\bin\mysql.exe -uKAKA -pTaxikaka2772 < D:\Maggie\Github\ABD-Cafe\Backend\database\init.sql

# 3. 重启后端服务器，会自动初始化默认用户
```

### 8.4 修改密码

如果需要修改数据库用户密码：

```sql
-- 连接到 MySQL（使用 root 或有权限的用户）
ALTER USER 'KAKA'@'localhost' IDENTIFIED BY '新密码';
FLUSH PRIVILEGES;
```

然后记得更新 `.env` 文件中的 `DB_PASSWORD`。

---

## 9. 安全建议

1. **不要在生产环境使用默认密码**
2. **定期备份数据库**
3. **不要共享 `.env` 文件**（已在 .gitignore 中）
4. **使用软删除而不是硬删除重要数据**
5. **定期检查用户活动日志**

---

## 10. 常用工具推荐

- **MySQL Workbench**: 官方图形化管理工具
- **DBeaver**: 免费的数据库管理工具，支持多种数据库
- **phpMyAdmin**: 基于 Web 的数据库管理工具
- **Navicat**: 商业数据库管理工具（功能强大）

---

## 📞 获取帮助

如果遇到问题，可以：
1. 查看 MySQL 官方文档: https://dev.mysql.com/doc/
2. 检查后端日志
3. 查看 `database/init.sql` 了解表结构

---

**最后更新时间：** 2025-10-10
**数据库版本：** MySQL 9.4.0
