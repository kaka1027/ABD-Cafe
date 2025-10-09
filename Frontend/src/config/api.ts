// API 配置文件
// 根据环境自动选择 API 地址

// 开发环境：使用本地后端
// 生产环境：使用阿里云后端
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// API 端点
export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    refresh: `${API_BASE_URL}/auth/refresh`,
    me: `${API_BASE_URL}/auth/me`,
    logout: `${API_BASE_URL}/auth/logout`
  },
  // 未来可以添加更多 API 端点
  // orders: { ... },
  // products: { ... }
}

// 导出辅助函数
export function getApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`
}
