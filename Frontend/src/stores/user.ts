import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface User {
  id: number
  username: string
  email?: string
  role: 'admin' | 'user'
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoggedIn = computed(() => !!user.value && !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // 登录
  const login = (userData: User, authToken: string) => {
    user.value = userData
    token.value = authToken

    // 存储到 localStorage
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', authToken)
  }

  // 登出
  const logout = () => {
    user.value = null
    token.value = null

    // 清除 localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  // 初始化用户状态（从 localStorage 恢复）
  const initializeAuth = () => {
    try {
      const savedUser = localStorage.getItem('user')
      const savedToken = localStorage.getItem('token')

      if (savedUser && savedToken) {
        user.value = JSON.parse(savedUser)
        token.value = savedToken
      }
    } catch (error) {
      console.error('Failed to initialize auth state:', error)
      logout()
    }
  }

  // 更新用户信息
  const updateUser = (userData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isLoggedIn,
    isAdmin,
    login,
    logout,
    initializeAuth,
    updateUser
  }
})