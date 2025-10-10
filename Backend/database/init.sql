-- ============================================
-- ABD Cafe 数据库初始化脚本
-- ============================================
-- 用途：创建数据库和用户表结构
-- 使用方法：在 MySQL 中运行此脚本
-- ============================================

-- 1. 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS abd_cafe_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2. 使用该数据库
USE abd_cafe_db;

-- 3. 创建用户表
CREATE TABLE IF NOT EXISTS users (
  -- 主键ID，自增
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- 用户基本信息
  username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名（唯一）',
  email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱（唯一）',
  password VARCHAR(255) NOT NULL COMMENT '加密后的密码',

  -- 用户角色和权限
  role ENUM('user', 'admin') DEFAULT 'user' COMMENT '用户角色',

  -- 用户资料
  avatar VARCHAR(500) COMMENT '头像URL',

  -- 业务字段
  remaining_quota DECIMAL(10, 2) DEFAULT 100.00 COMMENT '剩余额度',

  -- 状态字段
  is_active BOOLEAN DEFAULT TRUE COMMENT '账户是否激活',

  -- 时间戳
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  last_login_at TIMESTAMP NULL COMMENT '最后登录时间',

  -- 索引优化（提高查询性能）
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_created_at (created_at)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='用户信息表';

-- 4. 显示创建结果
SELECT '✅ 数据库和表创建成功！' as Status;
SHOW TABLES;
DESCRIBE users;
