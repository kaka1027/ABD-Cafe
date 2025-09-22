import bcrypt from 'bcryptjs';

/**
 * 密码加密工具类
 *
 * 硬代码说明：
 * - bcrypt: 业界标准的密码加密算法
 * - salt rounds: 加密强度，10是推荐值
 * - 不可逆加密: 即使数据库泄露，原始密码也无法恢复
 */
export class EncryptionUtils {

  /**
   * 加密密码
   * @param password 原始密码
   * @param saltRounds 加密轮数，默认10
   * @returns 加密后的密码hash
   */
  static async hashPassword(password: string, saltRounds: number = 10): Promise<string> {
    try {
      // 硬代码说明：saltRounds=10 大约需要 65ms 的计算时间
      // 数值越高越安全，但计算时间也越长
      const hash = await bcrypt.hash(password, saltRounds);
      return hash;
    } catch (error) {
      throw new Error('密码加密失败');
    }
  }

  /**
   * 验证密码
   * @param password 原始密码
   * @param hash 存储的密码hash
   * @returns 密码是否匹配
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new Error('密码验证失败');
    }
  }

  /**
   * 生成随机盐值
   * @param rounds 轮数
   * @returns 盐值
   */
  static async generateSalt(rounds: number = 10): Promise<string> {
    try {
      return await bcrypt.genSalt(rounds);
    } catch (error) {
      throw new Error('盐值生成失败');
    }
  }

  /**
   * 验证密码强度
   * @param password 密码
   * @returns 密码强度检查结果
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    score: number; // 0-100
  } {
    const errors: string[] = [];
    let score = 0;

    // 长度检查
    if (password.length < 6) {
      errors.push('密码长度至少6位');
    } else if (password.length >= 8) {
      score += 25;
    } else {
      score += 15;
    }

    // 包含数字
    if (/\d/.test(password)) {
      score += 25;
    } else {
      errors.push('密码应包含至少一个数字');
    }

    // 包含小写字母
    if (/[a-z]/.test(password)) {
      score += 25;
    }

    // 包含大写字母
    if (/[A-Z]/.test(password)) {
      score += 15;
    }

    // 包含特殊字符
    if (/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      score += 10;
    }

    return {
      isValid: errors.length === 0 && score >= 50,
      errors,
      score: Math.min(score, 100)
    };
  }

  /**
   * 生成随机密码
   * @param length 密码长度
   * @param includeSpecialChars 是否包含特殊字符
   * @returns 随机密码
   */
  static generateRandomPassword(length: number = 12, includeSpecialChars: boolean = true): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = lowercase + uppercase + numbers;
    if (includeSpecialChars) {
      charset += specialChars;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
  }
}