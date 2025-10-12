import dotenv from 'dotenv';
import { testConnection, initializeDatabase } from './src/config/database';
import UserModel from './src/models/UserModelMySQL';

// 加载环境变量
dotenv.config();

async function testDatabaseConnection() {
  console.log('═══════════════════════════════════════');
  console.log('🧪 开始测试数据库连接');
  console.log('═══════════════════════════════════════');
  console.log('');

  console.log('📋 数据库配置信息:');
  console.log(`   主机: ${process.env.DB_HOST}`);
  console.log(`   端口: ${process.env.DB_PORT}`);
  console.log(`   用户: ${process.env.DB_USER}`);
  console.log(`   密码: ${process.env.DB_PASSWORD ? '***' : '未设置'}`);
  console.log(`   数据库: ${process.env.DB_NAME}`);
  console.log('');

  try {
    // 1. 测试连接
    console.log('🔌 步骤 1: 测试数据库连接...');
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error('❌ 数据库连接失败');
      process.exit(1);
    }
    console.log('');

    // 2. 初始化表结构
    console.log('📋 步骤 2: 初始化数据库表结构...');
    await initializeDatabase();
    console.log('');

    // 3. 初始化默认用户
    console.log('👤 步骤 3: 初始化默认用户...');
    await UserModel.initializeDefaultUsers();
    console.log('');

    // 4. 获取用户统计
    console.log('📊 步骤 4: 获取用户统计信息...');
    const stats = await UserModel.getStats();
    console.log('   统计结果:', stats);
    console.log('');

    console.log('═══════════════════════════════════════');
    console.log('✅ 所有数据库测试通过！');
    console.log('═══════════════════════════════════════');

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('═══════════════════════════════════════');
    console.error('❌ 数据库测试失败:');
    console.error(error);
    console.error('═══════════════════════════════════════');
    process.exit(1);
  }
}

testDatabaseConnection();
