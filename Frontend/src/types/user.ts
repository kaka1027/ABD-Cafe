export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  lastLogin: string
  quota?: number
  avatar?: string
}

export interface UserInfo {
  username: string
  role?: string
  remainingQuota?: number
}