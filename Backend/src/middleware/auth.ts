import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../utils/jwt';
import UserModel from '../models/UserModel';
import { UserRole, JwtPayload } from '../types/user';

/**
 * 扩展 Express Request 接口，添加用户信息
 * 硬代码说明：TypeScript 接口扩展，让 req.user 有类型支持
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * 身份验证中间件
 *
 * 硬代码说明：
 * - 中间件模式：Express.js 的核心概念
 * - 链式调用：next() 传递控制权给下一个中间件
 * - 错误处理：统一的错误响应格式
 */
export class AuthMiddleware {

  /**
   * 验证用户身份的中间件
   * @param req Express 请求对象
   * @param res Express 响应对象
   * @param next 下一个中间件函数
   */
  static authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 从请求头获取 token
      const authHeader = req.headers.authorization;
      const token = JwtUtils.extractTokenFromHeader(authHeader);

      if (!token) {
        res.status(401).json({
          success: false,
          message: '缺少访问令牌'
        });
        return;
      }

      // 验证 token
      const decoded = JwtUtils.verifyToken(token);

      // 检查用户是否还存在且激活
      const user = await UserModel.findById(decoded.id);
      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          message: '用户不存在或已被禁用'
        });
        return;
      }

      // 将用户信息添加到请求对象
      req.user = decoded;

      // 添加一些有用的响应头
      res.setHeader('X-User-ID', decoded.id);
      res.setHeader('X-User-Role', decoded.role);

      next();
    } catch (error) {
      console.error('身份验证失败:', error);
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : '身份验证失败'
      });
    }
  };

  /**
   * 可选的身份验证中间件（登录用户可访问更多功能，但未登录也可以访问）
   * @param req Express 请求对象
   * @param res Express 响应对象
   * @param next 下一个中间件函数
   */
  static optionalAuthenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = JwtUtils.extractTokenFromHeader(authHeader);

      if (token) {
        try {
          const decoded = JwtUtils.verifyToken(token);
          const user = await UserModel.findById(decoded.id);

          if (user && user.isActive) {
            req.user = decoded;
            res.setHeader('X-User-ID', decoded.id);
            res.setHeader('X-User-Role', decoded.role);
          }
        } catch (error) {
          // 忽略 token 验证错误，继续处理请求
          console.log('可选身份验证失败，继续处理请求:', error instanceof Error ? error.message : '未知错误');
        }
      }

      next();
    } catch (error) {
      // 可选验证失败不应阻止请求
      next();
    }
  };

  /**
   * 管理员权限验证中间件
   * 硬代码说明：必须先通过 authenticate 中间件
   * @param req Express 请求对象
   * @param res Express 响应对象
   * @param next 下一个中间件函数
   */
  static requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: '需要身份验证'
      });
      return;
    }

    if (req.user.role !== UserRole.ADMIN) {
      res.status(403).json({
        success: false,
        message: '需要管理员权限'
      });
      return;
    }

    next();
  };

  /**
   * 检查用户权限的通用中间件
   * @param allowedRoles 允许的角色列表
   * @returns 中间件函数
   */
  static requireRoles = (allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: '需要身份验证'
        });
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          message: '权限不足'
        });
        return;
      }

      next();
    };
  };

  /**
   * 速率限制中间件（简单实现）
   * 硬代码说明：生产环境应使用 Redis 存储
   */
  private static requestCounts: Map<string, { count: number; resetTime: number }> = new Map();

  /**
   * 简单的速率限制
   * @param maxRequests 最大请求数
   * @param windowMs 时间窗口（毫秒）
   * @returns 中间件函数
   */
  static rateLimit = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const clientId = req.ip || 'unknown';
      const now = Date.now();

      let clientData = AuthMiddleware.requestCounts.get(clientId);

      // 初始化或重置计数器
      if (!clientData || now > clientData.resetTime) {
        clientData = {
          count: 0,
          resetTime: now + windowMs
        };
      }

      clientData.count++;
      AuthMiddleware.requestCounts.set(clientId, clientData);

      // 检查是否超过限制
      if (clientData.count > maxRequests) {
        res.status(429).json({
          success: false,
          message: '请求过于频繁，请稍后再试',
          retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
        });
        return;
      }

      // 添加速率限制信息到响应头
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - clientData.count));
      res.setHeader('X-RateLimit-Reset', new Date(clientData.resetTime).toISOString());

      next();
    };
  };

  /**
   * 清理过期的速率限制记录
   * 硬代码说明：应该定期调用以避免内存泄漏
   */
  static cleanupRateLimitData = (): void => {
    const now = Date.now();
    for (const [clientId, data] of AuthMiddleware.requestCounts.entries()) {
      if (now > data.resetTime) {
        AuthMiddleware.requestCounts.delete(clientId);
      }
    }
  };
}

// 定期清理速率限制数据（每小时一次）
setInterval(AuthMiddleware.cleanupRateLimitData, 60 * 60 * 1000);