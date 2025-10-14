import { Router } from 'express';
import RechargeController from '../controllers/RechargeController';
import { AuthMiddleware } from '../middleware/auth';

const router = Router();

// 所有充值接口都需要登录
router.use(AuthMiddleware.authenticate);

/**
 * @route   POST /api/recharge/create
 * @desc    创建充值订单
 * @access  Private（需要登录）
 */
router.post('/create', RechargeController.createOrder);

/**
 * @route   GET /api/recharge/my-orders
 * @desc    获取当前用户的充值订单列表
 * @access  Private（需要登录）
 */
router.get('/my-orders', RechargeController.getMyOrders);

/**
 * @route   GET /api/recharge/order/:orderNo
 * @desc    根据订单号查询订单
 * @access  Private（需要登录）
 */
router.get('/order/:orderNo', RechargeController.getOrderByNo);

/**
 * @route   GET /api/recharge/all-orders
 * @desc    获取所有充值订单（管理员）
 * @access  Private（需要管理员权限）
 */
router.get('/all-orders', RechargeController.getAllOrders);

/**
 * @route   POST /api/recharge/confirm
 * @desc    确认充值订单（管理员）
 * @access  Private（需要管理员权限）
 */
router.post('/confirm', RechargeController.confirmOrder);

/**
 * @route   GET /api/recharge/stats
 * @desc    获取充值统计信息（管理员）
 * @access  Private（需要管理员权限）
 */
router.get('/stats', RechargeController.getStats);

export default router;
