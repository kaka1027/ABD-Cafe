-- ABD-Cafe 数据库初始化脚本
-- 在服务器上运行此脚本以创建数据库和用户

-- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS abd_cafe_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2. 创建数据库用户（可选，如果使用 root 用户可以跳过）
-- 替换 'your_password' 为强密码
CREATE USER IF NOT EXISTS 'abd_cafe'@'localhost' IDENTIFIED BY 'your_password';

-- 3. 授予权限
GRANT ALL PRIVILEGES ON abd_cafe_db.* TO 'abd_cafe'@'localhost';
FLUSH PRIVILEGES;

-- 4. 使用数据库
USE abd_cafe_db;

-- 5. 创建用户表（实际上会由应用自动创建，这里仅供参考）
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  avatar VARCHAR(500),
  remaining_quota DECIMAL(10, 2) DEFAULT 100.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP NULL,
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 完成
SELECT '✅ 数据库初始化完成' AS status;
