import { Router, Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import UserModel from '../models/UserModelMySQL';

/**
 * 用户管理路由
 * 需要管理员权限
 */
const router = Router();

/**
 * 获取所有用户列表
 * GET /api/users
 */
router.get('/', [
  AuthMiddleware.authenticate,
  AuthMiddleware.requireAdmin,
], async (req: Request, res: Response) => {
  try {
    const users = await UserModel.getAllUsers();

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户列表失败',
    });
  }
});

/**
 * 获取单个用户信息
 * GET /api/users/:id
 */
router.get('/:id', [
  AuthMiddleware.authenticate,
  AuthMiddleware.requireAdmin,
], async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }

    // 移除密码字段
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败',
    });
  }
});

/**
 * 更新用户额度
 * PATCH /api/users/:id/quota
 */
router.patch('/:id/quota', [
  AuthMiddleware.authenticate,
  AuthMiddleware.requireAdmin,
], async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { quota } = req.body;

    if (typeof quota !== 'number' || quota < 0) {
      return res.status(400).json({
        success: false,
        message: '额度必须是大于等于0的数字',
      });
    }

    await UserModel.updateQuota(userId, quota);

    res.json({
      success: true,
      message: '额度更新成功',
      data: { quota },
    });
  } catch (error) {
    console.error('更新用户额度失败:', error);
    res.status(500).json({
      success: false,
      message: '更新用户额度失败',
    });
  }
});

/**
 * 更新用户信息
 * PATCH /api/users/:id
 */
router.patch('/:id', [
  AuthMiddleware.authenticate,
  AuthMiddleware.requireAdmin,
], async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const updates = req.body;

    // 不允许直接修改密码（应该有单独的重置密码接口）
    if (updates.password) {
      delete updates.password;
    }

    // 检查用户是否存在
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }

    // 这里简化处理，实际应该有更完善的更新逻辑
    // 由于 UserModelMySQL 没有通用的 update 方法，这里只处理额度更新
    if (updates.remainingQuota !== undefined) {
      await UserModel.updateQuota(userId, updates.remainingQuota);
    }

    res.json({
      success: true,
      message: '用户信息更新成功',
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '更新用户信息失败',
    });
  }
});

/**
 * 获取用户统计信息
 * GET /api/users/stats
 */
router.get('/stats/summary', [
  AuthMiddleware.authenticate,
  AuthMiddleware.requireAdmin,
], async (req: Request, res: Response) => {
  try {
    const stats = await UserModel.getStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('获取统计信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取统计信息失败',
    });
  }
});

export default router;
