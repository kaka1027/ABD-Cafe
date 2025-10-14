// 充值订单接口
export interface RechargeOrder {
  id: number;
  orderNo: string; // 订单号
  userId: number; // 用户ID
  amount: number; // 充值金额
  orderContent?: string; // 订单内容描述
  paymentMethod: string; // 支付方式
  remark?: string; // 用户备注
  adminNote?: string; // 管理员备注
  isConfirmed: boolean; // 是否已确认
  confirmedAt?: Date; // 确认时间
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
}

// 创建充值订单时的数据接口
export interface CreateRechargeOrderDto {
  amount: number; // 充值金额
  orderContent?: string; // 订单内容描述
  paymentMethod?: string; // 支付方式，默认 'wechat'
}

// 充值订单响应接口（包含用户信息）
export interface RechargeOrderResponse extends RechargeOrder {
  username?: string; // 用户名
  email?: string; // 用户邮箱
}

// 确认充值订单的数据接口（管理员操作）
export interface ConfirmRechargeOrderDto {
  orderNo: string; // 订单号
  adminNote?: string; // 管理员备��
}

// 充值订单查询参数
export interface RechargeOrderQuery {
  userId?: number; // 按用户ID查询
  isConfirmed?: boolean; // 按确认状态查询
  startDate?: string; // 开始日期
  endDate?: string; // 结束日期
  page?: number; // 页码
  pageSize?: number; // 每页数量
}
