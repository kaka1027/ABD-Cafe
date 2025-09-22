import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middleware/auth';

/**
 * 认证路由
 *
 * 硬代码说明：
 * - Router: Express 路由模块，用于组织 API 端点
 * - 路径设计: RESTful 风格，语义化的 URL
 * - 中间件: 按需应用身份验证和权限检查
 */
const router = Router();

/**
 * 公开路由（无需身份验证）
 */

// 用户登录
// POST /api/auth/login
router.post('/login', [
  AuthMiddleware.rateLimit(10, 15 * 60 * 1000), // 15分钟内最多10次登录尝试
], AuthController.login);

// 用户注册
// POST /api/auth/register
router.post('/register', [
  AuthMiddleware.rateLimit(5, 60 * 60 * 1000), // 1小时内最多5次注册尝试
], AuthController.register);

// 刷新访问令牌
// POST /api/auth/refresh
router.post('/refresh', [
  AuthMiddleware.rateLimit(30, 15 * 60 * 1000), // 15分钟内最多30次刷新
], AuthController.refreshToken);

/**
 * 受保护的路由（需要身份验证）
 */

// 获取当前用户信息
// GET /api/auth/me
router.get('/me', [
  AuthMiddleware.authenticate, // 需要有效的 JWT token
], AuthController.getCurrentUser);

// 用户登出
// POST /api/auth/logout
router.post('/logout', [
  AuthMiddleware.optionalAuthenticate, // 可选的身份验证（登录用户记录登出日志）
], AuthController.logout);

/**
 * 测试路由（开发环境使用）
 */
if (process.env.NODE_ENV === 'development') {
  // 获取所有用户（仅开发环境）
  router.get('/debug/users', async (req, res) => {
    try {
      const UserModel = (await import('../models/UserModel')).default;
      const users = await UserModel.getAllUsers();
      const stats = UserModel.getStats();

      res.json({
        success: true,
        message: '开发调试信息',
        data: {
          users,
          stats,
          env: process.env.NODE_ENV
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '获取调试信息失败'
      });
    }
  });

  // 生成测试令牌（仅开发环境）
  router.post('/debug/token', async (req, res) => {
    try {
      const { userId } = req.body;
      const UserModel = (await import('../models/UserModel')).default;
      const JwtUtils = (await import('../utils/jwt')).JwtUtils;

      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: '用户不存在'
        });
        return;
      }

      const tokenPayload = {
        id: user.id,
        username: user.username,
        role: user.role
      };

      const token = JwtUtils.generateAccessToken(tokenPayload);

      res.json({
        success: true,
        message: '测试令牌生成成功',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '生成测试令牌失败'
      });
    }
  });
}

export default router;