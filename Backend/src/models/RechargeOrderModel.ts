import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import {
  RechargeOrder,
  CreateRechargeOrderDto,
  RechargeOrderResponse,
  ConfirmRechargeOrderDto,
  RechargeOrderQuery
} from '../types/recharge';

/**
 * 充值订单数据模型类 - MySQL 版本
 *
 * 处理充值订单的创建、查询、确认等操作
 */
class RechargeOrderModel {
  /**
   * 生成唯一订单号
   * 格式: RO + 时间戳 + 随机数
   */
  private generateOrderNo(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `RO${timestamp}${random}`;
  }

  /**
   * 创建充值订单
   * @param userId 用户ID
   * @param orderData 订单数据
   * @returns 创建的订单信息
   */
  async createOrder(
    userId: number,
    orderData: CreateRechargeOrderDto
  ): Promise<RechargeOrderResponse> {
    try {
      const orderNo = this.generateOrderNo();
      const paymentMethod = orderData.paymentMethod || 'wechat';

      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO recharge_orders
         (order_no, user_id, amount, order_content, payment_method)
         VALUES (?, ?, ?, ?, ?)`,
        [
          orderNo,
          userId,
          orderData.amount,
          orderData.orderContent || `充值 ¥${orderData.amount}`,
          paymentMethod
        ]
      );

      // 查询新创建的订单
      const [orders] = await pool.query<RowDataPacket[]>(
        `SELECT ro.*, u.username, u.email
         FROM recharge_orders ro
         LEFT JOIN users u ON ro.user_id = u.id
         WHERE ro.id = ?`,
        [result.insertId]
      );

      return this.rowToOrderResponse(orders[0]);
    } catch (error) {
      console.error('创建充值订单失败:', error);
      throw error;
    }
  }

  /**
   * 根据订单号查询订单
   * @param orderNo 订单号
   * @returns 订单信息或 null
   */
  async findByOrderNo(orderNo: string): Promise<RechargeOrderResponse | null> {
    try {
      const [orders] = await pool.query<RowDataPacket[]>(
        `SELECT ro.*, u.username, u.email
         FROM recharge_orders ro
         LEFT JOIN users u ON ro.user_id = u.id
         WHERE ro.order_no = ?`,
        [orderNo]
      );

      if (orders.length === 0) {
        return null;
      }

      return this.rowToOrderResponse(orders[0]);
    } catch (error) {
      console.error('查询订单失败:', error);
      return null;
    }
  }

  /**
   * 根据用户ID查询订单列表
   * @param userId 用户ID
   * @returns 订单列表
   */
  async findByUserId(userId: number): Promise<RechargeOrderResponse[]> {
    try {
      const [orders] = await pool.query<RowDataPacket[]>(
        `SELECT ro.*, u.username, u.email
         FROM recharge_orders ro
         LEFT JOIN users u ON ro.user_id = u.id
         WHERE ro.user_id = ?
         ORDER BY ro.created_at DESC`,
        [userId]
      );

      return orders.map(row => this.rowToOrderResponse(row));
    } catch (error) {
      console.error('查询用户订单失败:', error);
      return [];
    }
  }

  /**
   * 查询所有订单（支持筛选）
   * @param query 查询参数
   * @returns 订单列表
   */
  async findAll(query?: RechargeOrderQuery): Promise<{
    orders: RechargeOrderResponse[],
    total: number,
    page: number,
    pageSize: number
  }> {
    try {
      let sql = `SELECT ro.*, u.username, u.email
                 FROM recharge_orders ro
                 LEFT JOIN users u ON ro.user_id = u.id
                 WHERE 1=1`;
      const params: any[] = [];

      // 添加筛选条件
      if (query?.userId) {
        sql += ' AND ro.user_id = ?';
        params.push(query.userId);
      }

      if (query?.isConfirmed !== undefined) {
        sql += ' AND ro.is_confirmed = ?';
        params.push(query.isConfirmed);
      }

      if (query?.startDate) {
        sql += ' AND ro.created_at >= ?';
        params.push(query.startDate);
      }

      if (query?.endDate) {
        sql += ' AND ro.created_at <= ?';
        params.push(query.endDate);
      }

      // 获取总数
      const countSql = sql.replace(
        'SELECT ro.*, u.username, u.email',
        'SELECT COUNT(*) as total'
      );
      const [countResult] = await pool.query<RowDataPacket[]>(countSql, params);
      const total = countResult[0].total;

      // 分页
      const page = query?.page || 1;
      const pageSize = query?.pageSize || 20;
      const offset = (page - 1) * pageSize;

      sql += ' ORDER BY ro.created_at DESC LIMIT ? OFFSET ?';
      params.push(pageSize, offset);

      const [orders] = await pool.query<RowDataPacket[]>(sql, params);

      return {
        orders: orders.map(row => this.rowToOrderResponse(row)),
        total,
        page,
        pageSize
      };
    } catch (error) {
      console.error('查询订单列表失败:', error);
      return { orders: [], total: 0, page: 1, pageSize: 20 };
    }
  }

  /**
   * 确认充值订单（管理员操作）
   * @param confirmData 确认数据
   * @returns 是否成功
   */
  async confirmOrder(confirmData: ConfirmRechargeOrderDto): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. 查询订单
      const [orders] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM recharge_orders WHERE order_no = ? FOR UPDATE',
        [confirmData.orderNo]
      );

      if (orders.length === 0) {
        throw new Error('订单不存在');
      }

      const order = orders[0];

      if (order.is_confirmed) {
        throw new Error('订单已经确认过了');
      }

      // 2. 更新订单状态
      await connection.query(
        `UPDATE recharge_orders
         SET is_confirmed = TRUE,
             confirmed_at = NOW(),
             admin_note = ?,
             updated_at = NOW()
         WHERE order_no = ?`,
        [confirmData.adminNote || '', confirmData.orderNo]
      );

      // 3. 增加用户余额
      await connection.query(
        `UPDATE users
         SET remaining_quota = remaining_quota + ?,
             updated_at = NOW()
         WHERE id = ?`,
        [order.amount, order.user_id]
      );

      await connection.commit();
      console.log(`✅ 订单 ${confirmData.orderNo} 确认成功，用户余额增加 ¥${order.amount}`);
      return true;
    } catch (error) {
      await connection.rollback();
      console.error('确认订单失败:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 获取订单统计信息
   */
  async getStats() {
    try {
      const [total] = await pool.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM recharge_orders'
      );
      const [confirmed] = await pool.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM recharge_orders WHERE is_confirmed = TRUE'
      );
      const [pending] = await pool.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM recharge_orders WHERE is_confirmed = FALSE'
      );
      const [totalAmount] = await pool.query<RowDataPacket[]>(
        'SELECT SUM(amount) as sum FROM recharge_orders WHERE is_confirmed = TRUE'
      );

      return {
        totalOrders: total[0].count,
        confirmedOrders: confirmed[0].count,
        pendingOrders: pending[0].count,
        totalAmount: totalAmount[0].sum || 0
      };
    } catch (error) {
      console.error('获取订单统计失败:', error);
      return {
        totalOrders: 0,
        confirmedOrders: 0,
        pendingOrders: 0,
        totalAmount: 0
      };
    }
  }

  /**
   * 将数据库行转换为 RechargeOrderResponse 对象
   */
  private rowToOrderResponse(row: any): RechargeOrderResponse {
    return {
      id: row.id,
      orderNo: row.order_no,
      userId: row.user_id,
      amount: parseFloat(row.amount),
      orderContent: row.order_content,
      paymentMethod: row.payment_method,
      remark: row.remark,
      adminNote: row.admin_note,
      isConfirmed: Boolean(row.is_confirmed),
      confirmedAt: row.confirmed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      username: row.username,
      email: row.email
    };
  }
}

// 单例模式
export default new RechargeOrderModel();
