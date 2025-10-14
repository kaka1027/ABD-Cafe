import { Request, Response } from 'express';
import RechargeOrderModel from '../models/RechargeOrderModel';
import { CreateRechargeOrderDto, ConfirmRechargeOrderDto } from '../types/recharge';

/**
 * 充值订单控制器
 */
class RechargeController {
  /**
   * 创建充值订单
   * POST /api/recharge/create
   */
  async createOrder(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '请先登录'
        });
      }

      const orderData: CreateRechargeOrderDto = req.body;

      // 验证金额
      if (!orderData.amount || orderData.amount <= 0) {
        return res.status(400).json({
          success: false,
          message: '充值金额必须大于0'
        });
      }

      // 创建订单
      const order = await RechargeOrderModel.createOrder(userId, orderData);

      res.json({
        success: true,
        message: '充值订单创建成功',
        data: order
      });
    } catch (error: any) {
      console.error('创建充值订单失败:', error);
      res.status(500).json({
        success: false,
        message: '创建订单失败: ' + error.message
      });
    }
  }

  /**
   * 获取当前用户的充值订单列表
   * GET /api/recharge/my-orders
   */
  async getMyOrders(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '请先登录'
        });
      }

      const orders = await RechargeOrderModel.findByUserId(userId);

      res.json({
        success: true,
        data: orders
      });
    } catch (error: any) {
      console.error('获取订单列表失败:', error);
      res.status(500).json({
        success: false,
        message: '获取订单列表失败: ' + error.message
      });
    }
  }

  /**
   * 根据订单号查询订单
   * GET /api/recharge/order/:orderNo
   */
  async getOrderByNo(req: Request, res: Response) {
    try {
      const { orderNo } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '请先登录'
        });
      }

      const order = await RechargeOrderModel.findByOrderNo(orderNo);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: '订单不存在'
        });
      }

      // 非管理员只能查看自己的订单
      const userRole = (req as any).user?.role;
      if (userRole !== 'admin' && order.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: '无权查看此订单'
        });
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error: any) {
      console.error('查询订单失败:', error);
      res.status(500).json({
        success: false,
        message: '查询订单失败: ' + error.message
      });
    }
  }

  /**
   * 获取所有充值订单（管理员）
   * GET /api/recharge/all-orders
   */
  async getAllOrders(req: Request, res: Response) {
    try {
      const userRole = (req as any).user?.role;

      if (userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: '无权访问'
        });
      }

      const query = {
        isConfirmed: req.query.isConfirmed === 'true' ? true :
                     req.query.isConfirmed === 'false' ? false : undefined,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 20
      };

      const result = await RechargeOrderModel.findAll(query);

      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('获取订单列表失败:', error);
      res.status(500).json({
        success: false,
        message: '获取订单列表失败: ' + error.message
      });
    }
  }

  /**
   * 确认充值订单（管理员）
   * POST /api/recharge/confirm
   */
  async confirmOrder(req: Request, res: Response) {
    try {
      const userRole = (req as any).user?.role;

      if (userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: '无权操作'
        });
      }

      const confirmData: ConfirmRechargeOrderDto = req.body;

      if (!confirmData.orderNo) {
        return res.status(400).json({
          success: false,
          message: '订单号不能为空'
        });
      }

      await RechargeOrderModel.confirmOrder(confirmData);

      res.json({
        success: true,
        message: '订单确认成功，用户余额已增加'
      });
    } catch (error: any) {
      console.error('确认订单失败:', error);
      res.status(500).json({
        success: false,
        message: '确认订单失败: ' + error.message
      });
    }
  }

  /**
   * 获取充值统计信息（管理员）
   * GET /api/recharge/stats
   */
  async getStats(req: Request, res: Response) {
    try {
      const userRole = (req as any).user?.role;

      if (userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: '无权访问'
        });
      }

      const stats = await RechargeOrderModel.getStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      console.error('获取统计信息失败:', error);
      res.status(500).json({
        success: false,
        message: '获取统计信息失败: ' + error.message
      });
    }
  }
}

export default new RechargeController();
