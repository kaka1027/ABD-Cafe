import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// 导入路由
import authRoutes from './routes/auth';

// 导入模型（触发初始化）
import UserModel from './models/UserModel';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件配置
app.use(helmet()); // 安全头设置
app.use(morgan('combined')); // 请求日志
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175'
  ], // 允许前端域名
  credentials: true // 允许携带 cookies
}));
app.use(express.json({ limit: '10mb' })); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // 解析 URL 编码的请求体

// 健康检查端点
app.get('/health', (req, res) => {
  const stats = UserModel.getStats();
  res.json({
    status: 'ok',
    message: 'ABD Cafe API Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    userStats: stats
  });
});

// API 路由
app.use('/api/auth', authRoutes);

// API 信息端点
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'ABD Cafe API',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        refresh: 'POST /api/auth/refresh',
        me: 'GET /api/auth/me',
        logout: 'POST /api/auth/logout'
      },
      health: 'GET /health'
    },
    documentation: 'https://github.com/your-repo/api-docs'
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `接口不存在: ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /health',
      'GET /api',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/auth/me'
    ]
  });
});

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('🚨 服务器错误:', err);

  // 根据错误类型返回不同的状态码
  let statusCode = 500;
  let message = '服务器内部错误';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = '数据验证失败';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token 无效';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token 已过期';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack
    })
  });
});

// 优雅关闭处理
process.on('SIGTERM', () => {
  console.log('📋 收到 SIGTERM 信号，正在优雅关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📋 收到 SIGINT 信号，正在优雅关闭服务器...');
  process.exit(0);
});

// 启动服务器
app.listen(PORT, () => {
  console.log('🚀 ABD Cafe API 服务器已启动');
  console.log(`📍 地址: http://localhost:${PORT}`);
  console.log(`🏥 健康检查: http://localhost:${PORT}/health`);
  console.log(`🔑 认证接口: http://localhost:${PORT}/api/auth`);
  console.log(`⚡ 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗝️  JWT 密钥: ${process.env.JWT_SECRET ? '已配置' : '❌ 未配置'}`);
  console.log('────────────────────────────────────────');
});

export default app;
