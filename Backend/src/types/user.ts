// 用户角色枚举
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

// 用户数据接口
export interface User {
  id: number;
  username: string;
  email: string;
  password: string; // 加密后的密码
  role: UserRole;
  avatar?: string;
  remainingQuota: number; // 剩余额度
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean; // 账户是否激活
}

// 创建用户时的数据接口
export interface CreateUserDto {
  username: string;
  email: string;
  password: string; // 原始密码
  role?: UserRole;
  remainingQuota?: number;
}

// 登录请求数据接口
export interface LoginDto {
  username: string;
  password: string;
}

// 登录响应数据接口（不包含密码）
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  remainingQuota: number;
  createdAt: Date;
  lastLoginAt?: Date;
}

// JWT Payload 接口
export interface JwtPayload {
  id: number;
  username: string;
  role: UserRole;
  iat?: number; // 签发时间
  exp?: number; // 过期时间
}