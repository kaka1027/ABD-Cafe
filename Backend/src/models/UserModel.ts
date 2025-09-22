import bcrypt from 'bcryptjs';
import { User, CreateUserDto, UserRole, UserResponse } from '../types/user';

/**
 * 用户数据模型类
 *
 * 目前使用内存存储，生产环境应该替换为数据库
 * 硬代码说明：
 * - bcrypt: 密码加密库，使用 salt 加密，防止彩虹表攻击
 * - 内存存储: 简单起见，真实项目应该用 PostgreSQL/MySQL
 */
class UserModel {
  // 内存中的用户数据存储
  private users: User[] = [];
  private nextId: number = 1;

  constructor() {
    // 初始化一些测试用户
    this.initializeDefaultUsers();
  }

  /**
   * 初始化默认用户
   * 硬代码说明：为了测试方便，预设一些用户
   */
  private async initializeDefaultUsers(): Promise<void> {
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
  }

  /**
   * 创建新用户
   * @param userData 用户创建数据
   * @returns 创建的用户信息（不含密码）
   */
  async createUser(userData: CreateUserDto): Promise<UserResponse> {
    // 检查用户名是否已存在
    const existingUser = this.users.find(u => u.username === userData.username);
    if (existingUser) {
      throw new Error('用户名已存在');
    }

    // 检查邮箱是否已存在
    const existingEmail = this.users.find(u => u.email === userData.email);
    if (existingEmail) {
      throw new Error('邮箱已存在');
    }

    // 密码加密
    // 硬代码说明：saltRounds=10 是推荐的安全级别，平衡安全性和性能
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // 创建用户对象
    const newUser: User = {
      id: this.nextId++,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || UserRole.USER,
      remainingQuota: userData.remainingQuota || 100.00,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    // 生成头像URL（使用 UI Avatars 服务）
    newUser.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.username)}&background=6366f1&color=fff&size=128`;

    // 保存到内存
    this.users.push(newUser);

    // 返回用户信息（不含密码）
    return this.toUserResponse(newUser);
  }

  /**
   * 根据用户名查找用户
   * @param username 用户名
   * @returns 用户信息或 null
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.users.find(u => u.username === username && u.isActive) || null;
  }

  /**
   * 根据用户ID查找用户
   * @param id 用户ID
   * @returns 用户信息或 null
   */
  async findById(id: number): Promise<User | null> {
    return this.users.find(u => u.id === id && u.isActive) || null;
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
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.lastLoginAt = new Date();
      user.updatedAt = new Date();
    }
  }

  /**
   * 更新用户额度
   * @param userId 用户ID
   * @param amount 新的额度
   */
  async updateQuota(userId: number, amount: number): Promise<void> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.remainingQuota = amount;
      user.updatedAt = new Date();
    }
  }

  /**
   * 获取所有用户（管理员功能）
   * @returns 所有用户列表（不含密码）
   */
  async getAllUsers(): Promise<UserResponse[]> {
    return this.users
      .filter(u => u.isActive)
      .map(u => this.toUserResponse(u));
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

  /**
   * 获取用户统计信息
   * @returns 用户统计
   */
  getStats() {
    return {
      totalUsers: this.users.length,
      activeUsers: this.users.filter(u => u.isActive).length,
      adminUsers: this.users.filter(u => u.role === UserRole.ADMIN).length,
      regularUsers: this.users.filter(u => u.role === UserRole.USER).length
    };
  }
}

// 单例模式，确保整个应用使用同一个用户数据实例
export default new UserModel();