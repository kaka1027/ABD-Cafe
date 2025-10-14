import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import { JwtUtils } from '../utils/jwt';
import { EncryptionUtils } from '../utils/encryption';
import { LoginDto, CreateUserDto, UserRole } from '../types/user';

/**
 * 认证控制器
 *
 * 硬代码说明：
 * - 控制器模式：处理 HTTP 请求和响应的业务逻辑
 * - 统一响应格式：保证 API 接口的一致性
 * - 错误处理：捕获异常并返回友好的错误信息
 */
export class AuthController {

  /**
   * 用户登录
   * POST /api/auth/login
   * @param req Express 请求对象
   * @param res Express 响应对象
   */
  static login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password }: LoginDto = req.body;

      // 输入验证
      if (!username || !password) {
        res.status(400).json({
          success: false,
          message: '用户名和密码不能为空',
        });
        return;
      }

      // 查找用户
      const user = await UserModel.findByUsername(username);
      if (!user) {
        // 硬代码说明：不明确指出是用户名还是密码错误，防止用户名枚举攻击
        res.status(401).json({
          success: false,
          message: '用户名或密码错误',
        });
        return;
      }

      // 验证密码
      const isPasswordValid = await UserModel.validatePassword(user, password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: '用户名或密码错误',
        });
        return;
      }

      // 检查账户状态
      if (!user.isActive) {
        res.status(401).json({
          success: false,
          message: '账户已被禁用，请联系管理员',
        });
        return;
      }

      // 生成 JWT token
      const tokenPayload = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      const accessToken = JwtUtils.generateAccessToken(tokenPayload);
      const refreshToken = JwtUtils.generateRefreshToken(tokenPayload);

      // 更新最后登录时间
      await UserModel.updateLastLogin(user.id);

      // 获取用户信息（不含密码）
      const userResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        remainingQuota: user.remainingQuota,
        createdAt: user.createdAt,
        lastLoginAt: new Date(), // 使用当前时间作为最后登录时间
      };

      // 记录登录日志
      console.log(`✅ 用户登录成功: ${user.username} (${user.id}) [${user.role}]`);

      // 返回成功响应
      res.status(200).json({
        success: true,
        message: '登录成功',
        data: {
          user: userResponse,
          token: accessToken,
          refreshToken: refreshToken,
          expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        },
      });

    } catch (error) {
      console.error('登录处理错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
      });
    }
  };

  /**
   * 用户注册
   * POST /api/auth/register
   * @param req Express 请求对象
   * @param res Express 响应对象
   */
  static register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, email, password, role }: CreateUserDto = req.body;

      // 输入验证
      if (!username || !email || !password) {
        res.status(400).json({
          success: false,
          message: '用户名、邮箱和密码不能为空',
        });
        return;
      }

      // 验证密码强度
      const passwordValidation = EncryptionUtils.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        res.status(400).json({
          success: false,
          message: '密码强度不够',
          errors: passwordValidation.errors,
        });
        return;
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: '邮箱格式不正确',
        });
        return;
      }

      // 验证用户名格式（只允许字母、数字、下划线）
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(username)) {
        res.status(400).json({
          success: false,
          message: '用户名只能包含字母、数字、下划线，长度3-20位',
        });
        return;
      }

      // 创建用户数据
      const userData: CreateUserDto = {
        username,
        email,
        password,
        role: role || UserRole.USER, // 默认为普通用户
        remainingQuota: 100.00, // 默认额度
      };

      // 创建用户
      const newUser = await UserModel.createUser(userData);

      console.log(`✅ 新用户注册: ${newUser.username} (${newUser.id})`);

      // 返回成功响应（不包含敏感信息）
      res.status(201).json({
        success: true,
        message: '注册成功',
        data: {
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
          },
        },
      });

    } catch (error) {
      console.error('注册处理错误:', error);

      // 处理特定的业务错误
      if (error instanceof Error) {
        if (error.message === '用户名已存在' || error.message === '邮箱已存在') {
          res.status(409).json({
            success: false,
            message: error.message,
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: '服务器内部错误',
      });
    }
  };

  /**
   * 刷新访问令牌
   * POST /api/auth/refresh
   * @param req Express 请求对象
   * @param res Express 响应对象
   */
  static refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: '缺少刷新令牌',
        });
        return;
      }

      // 验证刷新令牌
      const decoded = JwtUtils.verifyRefreshToken(refreshToken);

      // 检查用户是否仍然存在且激活
      const user = await UserModel.findById(decoded.id);
      if (!user?.isActive) {
        res.status(401).json({
          success: false,
          message: '用户不存在或已被禁用',
        });
        return;
      }

      // 生成新的访问令牌
      const tokenPayload = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      const newAccessToken = JwtUtils.generateAccessToken(tokenPayload);

      res.status(200).json({
        success: true,
        message: '令牌刷新成功',
        data: {
          token: newAccessToken,
          expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        },
      });

    } catch (error) {
      console.error('令牌刷新错误:', error);
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : '令牌刷新失败',
      });
    }
  };

  /**
   * 获取当前用户信息
   * GET /api/auth/me
   * @param req Express 请求对象
   * @param res Express 响应对象
   */
  static getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      // 硬代码说明：这个端点需要身份验证中间件
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: '未认证用户',
        });
        return;
      }

      // 从数据库获取最新的用户信息
      const user = await UserModel.findById(req.user.id);
      if (!user?.isActive) {
        res.status(404).json({
          success: false,
          message: '用户不存在',
        });
        return;
      }

      const userResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        remainingQuota: user.remainingQuota,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      };

      res.status(200).json({
        success: true,
        message: '获取用户信息成功',
        data: {
          user: userResponse,
        },
      });

    } catch (error) {
      console.error('获取用户信息错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
      });
    }
  };

  /**
   * 用户登出
   * POST /api/auth/logout
   * @param req Express 请求对象
   * @param res Express 响应对象
   */
  static logout = async (req: Request, res: Response): Promise<void> => {
    try {
      // 硬代码说明：
      // JWT 是无状态的，真正的登出需要将 token 加入黑名单
      // 这里简化实现，实际项目可以使用 Redis 存储黑名单

      if (req.user) {
        console.log(`📤 用户登出: ${req.user.username} (${req.user.id})`);
      }

      res.status(200).json({
        success: true,
        message: '登出成功',
      });

    } catch (error) {
      console.error('登出处理错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
      });
    }
  };
}