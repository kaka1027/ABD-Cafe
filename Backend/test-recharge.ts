import dotenv from 'dotenv';
import { testConnection } from './src/config/database';
import RechargeOrderModel from './src/models/RechargeOrderModel';
import UserModel from './src/models/UserModelMySQL';

// 加载环境变量
dotenv.config();

async function testRechargeFunction() {
  console.log('═══════════════════════════════════════');
  console.log('🧪 开始测试充值功能');
  console.log('═══════════════════════════════════════');
  console.log('');

  try {
    // 1. 测试数据库连接
    console.log('🔌 步骤 1: 测试数据库连接...');
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('数据库连接失败');
    }
    console.log('');

    // 2. 查找测试用户
    console.log('👤 步骤 2: 查找测试用户...');
    const testUser = await UserModel.findByUsername('user1');
    if (!testUser) {
      throw new Error('测试用户 user1 不存在');
    }
    console.log(`   找到用户: ${testUser.username} (ID: ${testUser.id})`);
    console.log(`   当前余额: ¥${testUser.remainingQuota}`);
    const originalQuota = testUser.remainingQuota;
    console.log('');

    // 3. 创建充值订单
    console.log('💰 步骤 3: 创建充值订单...');
    const orderData = {
      amount: 50.00,
      orderContent: '测试充值50元',
      paymentMethod: 'wechat'
    };
    const newOrder = await RechargeOrderModel.createOrder(testUser.id, orderData);
    console.log(`   ✅ 订单创建成功！`);
    console.log(`   订单号: ${newOrder.orderNo}`);
    console.log(`   充值金额: ¥${newOrder.amount}`);
    console.log(`   订单内容: ${newOrder.orderContent}`);
    console.log(`   确认状态: ${newOrder.isConfirmed ? '已确认' : '待确认'}`);
    console.log('');

    // 4. 查询订单
    console.log('🔍 步骤 4: 查询订单...');
    const foundOrder = await RechargeOrderModel.findByOrderNo(newOrder.orderNo);
    if (!foundOrder) {
      throw new Error('查询订单失败');
    }
    console.log(`   ✅ 订单查询成功！`);
    console.log(`   订单号: ${foundOrder.orderNo}`);
    console.log(`   用户: ${foundOrder.username}`);
    console.log('');

    // 5. 查询用户的所有订单
    console.log('📋 步骤 5: 查询用户所有订单...');
    const userOrders = await RechargeOrderModel.findByUserId(testUser.id);
    console.log(`   ✅ 找到 ${userOrders.length} 个订单`);
    console.log('');

    // 6. 确认订单
    console.log('✔️  步骤 6: 确认充值订单（模拟管理员确认）...');
    await RechargeOrderModel.confirmOrder({
      orderNo: newOrder.orderNo,
      adminNote: '测试确认，已收到微信支付'
    });
    console.log(`   ✅ 订单确认成功！`);
    console.log('');

    // 7. 验证用户余额
    console.log('💵 步骤 7: 验证用户余额是否增加...');
    const updatedUser = await UserModel.findById(testUser.id);
    if (!updatedUser) {
      throw new Error('查询用户失败');
    }
    console.log(`   原余额: ¥${originalQuota}`);
    console.log(`   充值金额: ¥${orderData.amount}`);
    console.log(`   新余额: ¥${updatedUser.remainingQuota}`);

    const expectedQuota = originalQuota + orderData.amount;
    if (Math.abs(updatedUser.remainingQuota - expectedQuota) < 0.01) {
      console.log(`   ✅ 余额增加正确！`);
    } else {
      throw new Error(`余额不正确，期望 ${expectedQuota}，实际 ${updatedUser.remainingQuota}`);
    }
    console.log('');

    // 8. 查询已确认的订单
    console.log('📊 步骤 8: 查询已确认的订单...');
    const confirmedOrder = await RechargeOrderModel.findByOrderNo(newOrder.orderNo);
    if (!confirmedOrder) {
      throw new Error('查询确认订单失败');
    }
    console.log(`   确认状态: ${confirmedOrder.isConfirmed ? '✅ 已确认' : '❌ 未确认'}`);
    console.log(`   确认时间: ${confirmedOrder.confirmedAt}`);
    console.log(`   管理员备注: ${confirmedOrder.adminNote}`);
    console.log('');

    // 9. 获取订单统计
    console.log('📈 步骤 9: 获取订单统计信息...');
    const stats = await RechargeOrderModel.getStats();
    console.log(`   总订单数: ${stats.totalOrders}`);
    console.log(`   已确认订单: ${stats.confirmedOrders}`);
    console.log(`   待确认订单: ${stats.pendingOrders}`);
    console.log(`   总充值金额: ¥${stats.totalAmount}`);
    console.log('');

    console.log('═══════════════════════════════════════');
    console.log('✅ 所有充值功能测试通过！');
    console.log('═══════════════════════════════════════');

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('═══════════════════════════════════════');
    console.error('❌ 充值功能测试失败:');
    console.error(error);
    console.error('═══════════════════════════════════════');
    process.exit(1);
  }
}

testRechargeFunction();
