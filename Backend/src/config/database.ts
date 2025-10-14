import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * MySQL 数据库连接池配置
 * 使用连接池可以提高性能，避免频繁创建和销毁连接
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'abd_cafe_db',
  waitForConnections: true,
  connectionLimit: 10, // 最大连接数
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * 测试数据库连接
 */
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL 数据库连接成功');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL 数据库连接失败:', error);
    return false;
  }
}

/**
 * 初始化数据库表结构
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const connection = await pool.getConnection();

    // 创建 users 表
    await connection.query(`
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
    `);

    // 创建 recharge_orders 充值订单表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS recharge_orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_no VARCHAR(50) UNIQUE NOT NULL COMMENT '订单号',
        user_id INT NOT NULL COMMENT '用户ID',
        amount DECIMAL(10, 2) NOT NULL COMMENT '充值金额',
        order_content TEXT COMMENT '订单内容描述',
        payment_method VARCHAR(50) DEFAULT 'wechat' COMMENT '支付方式',
        remark TEXT COMMENT '用户备注（付款时填写的备注）',
        admin_note TEXT COMMENT '管理员备注',
        is_confirmed BOOLEAN DEFAULT FALSE COMMENT '是否已确认',
        confirmed_at TIMESTAMP NULL COMMENT '确认时间',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        INDEX idx_order_no (order_no),
        INDEX idx_user_id (user_id),
        INDEX idx_is_confirmed (is_confirmed),
        INDEX idx_created_at (created_at),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('✅ 数据库表结构初始化成功');
    connection.release();
  } catch (error) {
    console.error('❌ 数据库表初始化失败:', error);
    throw error;
  }
}

export default pool;
