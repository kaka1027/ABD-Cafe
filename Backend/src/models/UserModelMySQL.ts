import bcrypt from 'bcryptjs';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import { User, CreateUserDto, UserRole, UserResponse } from '../types/user';

/**
 * 用户数据模型类 - MySQL 版本
 *
 * 这个版本使用 MySQL 数据库存储用户数据，替代了之前的内存存储
 * API 接口保持不变，只是底层实现改为数据库操作
 */
class UserModelMySQL {
  /**
   * 初始化默认用户
   * 如果数据库为空，插入一些测试用户
   */
  async initializeDefaultUsers(): Promise<void> {
    try {
      // 检查是否已有用户
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM users'
      );

      if (rows[0].count > 0) {
        console.log('✅ 数据库已有用户数据，跳过初始化');
        return;
      }

      // 创建默认用户
      const defaultUsers: CreateUserDto[] = [
        {
          username: 'admin',
          email: 'admin@abdcafe.com',
          password: 'admin123',
          role: UserRole.ADMIN,
          remainingQuota: 1000.00
        },
        {
          username: 'user1',
          email: 'user1@abdcafe.com',
          password: 'user123',
          role: UserRole.USER,
          remainingQuota: 85.50
        },
        {
          username: 'test',
          email: 'test@abdcafe.com',
          password: '123456',
          role: UserRole.USER,
          remainingQuota: 50.00
        }
      ];

      for (const userData of defaultUsers) {
        await this.createUser(userData);
      }

      console.log('✅ 默认用户初始化完成');
      console.log('📋 可用测试账户:');
      console.log('   - admin/admin123 (管理员)');
      console.log('   - user1/user123 (普通用户)');
      console.log('   - test/123456 (普通用户)');
    } catch (error) {
      console.error('❌ 默认用户初始化失败:', error);
    }
  }

  /**
   * 创建新用户
   * @param userData 用户创建数据
   * @returns 创建的用户信息（不含密码）
   */
  async createUser(userData: CreateUserDto): Promise<UserResponse> {
    try {
      // 检查用户名是否已存在
      const [existingUsers] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM users WHERE username = ?',
        [userData.username]
      );

      if (existingUsers.length > 0) {
        throw new Error('用户名已存在');
      }

      // 检查邮箱是否已存在
      const [existingEmails] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM users WHERE email = ?',
        [userData.email]
      );

      if (existingEmails.length > 0) {
        throw new Error('邮箱已存在');
      }

      // 密码加密
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // 生成头像URL
      const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.username)}&background=6366f1&color=fff&size=128`;

      // 插入用户
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO users (username, email, password, role, avatar, remaining_quota, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.username,
          userData.email,
          hashedPassword,
          userData.role || UserRole.USER,
          avatar,
          userData.remainingQuota || 100.00,
          true
        ]
      );

      // 查询新创建的用户
      const [newUsers] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE id = ?',
        [result.insertId]
      );

      return this.toUserResponse(newUsers[0] as User);
    } catch (error) {
      console.error('创建用户失败:', error);
      throw error;
    }
  }

  /**
   * 根据用户名查找用户
   * @param username 用户名
   * @returns 用户信息或 null
   */
  async findByUsername(username: string): Promise<User | null> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE username = ? AND is_active = TRUE',
        [username]
      );

      if (rows.length === 0) {
        return null;
      }

      return this.rowToUser(rows[0]);
    } catch (error) {
      console.error('查询用户失败:', error);
      return null;
    }
  }

  /**
   * 根据用户ID查找用户
   * @param id 用户ID
   * @returns 用户信息或 null
   */
  async findById(id: number): Promise<User | null> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE id = ? AND is_active = TRUE',
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return this.rowToUser(rows[0]);
    } catch (error) {
      console.error('查询用户失败:', error);
      return null;
    }
  }

  /**
   * 验证用户密码
   * @param user 用户对象
   * @param password 原始密码
   * @returns 密码是否正确
   */
  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  /**
   * 更新用户最后登录时间
   * @param userId 用户ID
   */
  async updateLastLogin(userId: number): Promise<void> {
    try {
      await pool.query(
        'UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = ?',
        [userId]
      );
    } catch (error) {
      console.error('更新登录时间失败:', error);
    }
  }

  /**
   * 更新用户额度
   * @param userId 用户ID
   * @param amount 新的额度
   */
  async updateQuota(userId: number, amount: number): Promise<void> {
    try {
      await pool.query(
        'UPDATE users SET remaining_quota = ?, updated_at = NOW() WHERE id = ?',
        [amount, userId]
      );
    } catch (error) {
      console.error('更新用户额度失败:', error);
      throw error;
    }
  }

  /**
   * 获取所有用户（管理员功能）
   * @returns 所有用户列表（不含密码）
   */
  async getAllUsers(): Promise<UserResponse[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE is_active = TRUE ORDER BY created_at DESC'
      );

      return rows.map(row => this.toUserResponse(this.rowToUser(row)));
    } catch (error) {
      console.error('查询所有用户失败:', error);
      return [];
    }
  }

  /**
   * 获取用户统计信息
   * @returns 用户统计
   */
  async getStats() {
    try {
      const [total] = await pool.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM users'
      );
      const [active] = await pool.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM users WHERE is_active = TRUE'
      );
      const [admins] = await pool.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM users WHERE role = "admin"'
      );
      const [regular] = await pool.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM users WHERE role = "user"'
      );

      return {
        totalUsers: total[0].count,
        activeUsers: active[0].count,
        adminUsers: admins[0].count,
        regularUsers: regular[0].count
      };
    } catch (error) {
      console.error('获取用户统计失败:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        adminUsers: 0,
        regularUsers: 0
      };
    }
  }

  /**
   * 将数据库行转换为 User 对象
   */
  private rowToUser(row: any): User {
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      password: row.password,
      role: row.role as UserRole,
      avatar: row.avatar,
      remainingQuota: parseFloat(row.remaining_quota),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastLoginAt: row.last_login_at,
      isActive: Boolean(row.is_active)
    };
  }

  /**
   * 将 User 对象转换为 UserResponse（移除密码字段）
   * @param user 用户对象
   * @returns 用户响应对象
   */
  private toUserResponse(user: User): UserResponse {
    const { password, ...userResponse } = user;
    return userResponse;
  }
}

// 单例模式，确保整个应用使用同一个用户数据实例
export default new UserModelMySQL();
