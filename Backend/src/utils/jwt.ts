import jwt, { JwtPayload as JwtLibPayload, SignOptions } from 'jsonwebtoken';
import { JwtPayload } from '../types/user';

/**
 * JWT Token 工具类
 *
 * 硬代码说明：
 * - JWT: JSON Web Token，无状态的身份验证方案
 * - 结构: Header.Payload.Signature
 * - 优势: 无需服务器存储 session，适合分布式系统
 * - 安全: 使用 HMAC SHA256 签名算法
 */
export class JwtUtils {

  /**
   * 获取 JWT 密钥
   * 硬代码说明：从环境变量获取，生产环境必须使用强密钥
   */
  private static getSecretKey(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET 环境变量未设置');
    }
    return secret;
  }

  /**
   * 生成访问令牌
   * @param payload 用户信息载荷
   * @param expiresIn 过期时间，默认7天
   * @returns JWT token 字符串
   */
  static generateAccessToken(
    payload: Omit<JwtPayload, 'iat' | 'exp'>,
    expiresIn: string = process.env.JWT_EXPIRES_IN || '7d'
  ): string {
    try {
      // 硬代码说明：使用类型断言解决类型问题
      const token = jwt.sign(
        payload,
        this.getSecretKey(),
        { expiresIn } as any
      );

      return token;
    } catch (error) {
      throw new Error('Token 生成失败');
    }
  }

  /**
   * 验证并解析 Token
   * @param token JWT token 字符串
   * @returns 解析后的用户信息
   */
  static verifyToken(token: string): JwtPayload {
    try {
      // 硬代码说明：简化验证，只验证签名和过期时间
      const decoded = jwt.verify(token, this.getSecretKey()) as JwtPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token 已过期');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Token 无效');
      } else {
        throw new Error('Token 验证失败');
      }
    }
  }

  /**
   * 解析 Token 但不验证（用于获取过期 token 信息）
   * @param token JWT token 字符串
   * @returns 解析后的载荷（可能已过期）
   */
  static decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.decode(token) as JwtPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * 检查 Token 是否即将过期
   * @param token JWT token 字符串
   * @param thresholdMinutes 阈值分钟数，默认30分钟
   * @returns 是否即将过期
   */
  static isTokenExpiringSoon(token: string, thresholdMinutes: number = 30): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return true;
      }

      const now = Math.floor(Date.now() / 1000);
      const threshold = thresholdMinutes * 60;

      return (decoded.exp - now) < threshold;
    } catch (error) {
      return true;
    }
  }

  /**
   * 生成刷新令牌（长期有效）
   * @param payload 用户信息载荷
   * @returns 刷新令牌
   */
  static generateRefreshToken(
    payload: Omit<JwtPayload, 'iat' | 'exp'>
  ): string {
    try {
      // 硬代码说明：刷新令牌有效期更长，用于获取新的访问令牌
      const token = jwt.sign(
        { ...payload, type: 'refresh' },
        this.getSecretKey(),
        { expiresIn: '30d' } as any
      );

      return token;
    } catch (error) {
      throw new Error('刷新令牌生成失败');
    }
  }

  /**
   * 验证刷新令牌
   * @param refreshToken 刷新令牌
   * @returns 解析后的用户信息
   */
  static verifyRefreshToken(refreshToken: string): JwtPayload {
    try {
      const decoded = jwt.verify(refreshToken, this.getSecretKey()) as JwtPayload & { type: string };

      // 验证令牌类型
      if (decoded.type !== 'refresh') {
        throw new Error('无效的刷新令牌');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('刷新令牌已过期');
      } else {
        throw new Error('刷新令牌无效');
      }
    }
  }

  /**
   * 从请求头中提取 Token
   * @param authHeader Authorization 头部值
   * @returns 提取的 token 或 null
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    // 硬代码说明：标准格式为 "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  /**
   * 获取 Token 的剩余有效时间（秒）
   * @param token JWT token 字符串
   * @returns 剩余秒数，-1 表示已过期或无效
   */
  static getTokenRemainingTime(token: string): number {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return -1;
      }

      const now = Math.floor(Date.now() / 1000);
      const remaining = decoded.exp - now;

      return Math.max(0, remaining);
    } catch (error) {
      return -1;
    }
  }
}