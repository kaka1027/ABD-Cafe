<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">{{ t('userManage.title') }}</h1>
        <p class="mt-1 text-gray-600">{{ t('userManage.description') }}</p>
      </div>
      <button
        @click="openCreateUserModal"
        class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        {{ t('userManage.createUser') }}
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ t('userManage.stats.totalUsers') }}</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ users.length }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <UsersIcon class="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-3">
          <span class="text-green-600 font-medium">+12%</span> {{ t('userManage.stats.fromLastMonth') }}
        </p>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ t('userManage.stats.activeUsers') }}</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ activeUsersCount }}</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="w-5 h-5 text-green-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-3">
          <span class="text-green-600 font-medium">{{ activeUsersPercentage }}%</span> {{ t('userManage.stats.ofTotal') }}
        </p>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ t('userManage.stats.totalQuota') }}</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">¥{{ totalQuota.toFixed(0) }}</p>
          </div>
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <CurrencyYenIcon class="w-5 h-5 text-yellow-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-3">
          <span class="text-yellow-600 font-medium">¥{{ averageQuota.toFixed(0) }}</span> {{ t('userManage.stats.avgPerUser') }}
        </p>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ t('userManage.stats.admins') }}</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ adminUsersCount }}</p>
          </div>
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <ShieldCheckIcon class="w-5 h-5 text-purple-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-3">
          <span class="text-purple-600 font-medium">{{ adminUsersPercentage }}%</span> {{ t('userManage.stats.ofTotal') }}
        </p>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <UserFilters
        v-model:search-query="searchQuery"
        v-model:status-filter="statusFilter"
        v-model:role-filter="roleFilter"
      />
    </div>

    <!-- 用户表格 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <UserTable
        :users="filteredUsers"
        @edit="editUser"
        @reset-password="resetPassword"
        @toggle-status="toggleUserStatus"
      />
    </div>

    <!-- 用户模态框 -->
    <UserModal
      :show="showUserModal"
      :user="editingUser"
      :is-editing="!!editingUser"
      @close="closeUserModal"
      @submit="saveUser"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  PlusIcon, 
  UsersIcon, 
  CheckCircleIcon, 
  CurrencyYenIcon, 
  ShieldCheckIcon 
} from '@heroicons/vue/24/outline'

// 组件导入
import UserFilters from './components/UserFilters.vue'
import UserTable from './components/UserTable.vue'
import UserModal from './components/UserModal.vue'

const { t } = useI18n()

// 用户数据类型
interface User {
  id: number
  username: string
  email: string
  role: string
  status: string
  quota: number
  lastLogin: string
}

// 状态
const searchQuery = ref('')
const statusFilter = ref('')
const roleFilter = ref('')
const showUserModal = ref(false)
const editingUser = ref<User | null>(null)

// 模拟用户数据
const users = ref<User[]>([
  {
    id: 1,
    username: 'admin',
    email: 'admin@abdcafe.com',
    role: 'admin',
    status: 'active',
    quota: 500.00,
    lastLogin: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    username: 'alice',
    email: 'alice@company.com',
    role: 'user',
    status: 'active',
    quota: 85.50,
    lastLogin: '2024-01-14 16:45:00'
  },
  {
    id: 3,
    username: 'bob',
    email: 'bob@company.com',
    role: 'user',
    status: 'inactive',
    quota: 120.00,
    lastLogin: '2024-01-10 09:15:00'
  }
])

// 计算统计数据
const activeUsersCount = computed(() => users.value.filter(u => u.status === 'active').length)
const activeUsersPercentage = computed(() => Math.round((activeUsersCount.value / users.value.length) * 100))
const adminUsersCount = computed(() => users.value.filter(u => u.role === 'admin').length)
const adminUsersPercentage = computed(() => Math.round((adminUsersCount.value / users.value.length) * 100))
const totalQuota = computed(() => users.value.reduce((sum, user) => sum + user.quota, 0))
const averageQuota = computed(() => totalQuota.value / users.value.length)
const filteredUsers = computed(() => {
  let filtered = users.value

  // 按搜索关键词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.username.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    )
  }

  // 按状态过滤
  if (statusFilter.value) {
    filtered = filtered.filter(user => user.status === statusFilter.value)
  }

  // 按角色过滤
  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  return filtered
})

// 打开创建用户模态框
const openCreateUserModal = () => {
  editingUser.value = null
  showUserModal.value = true
}

// 编辑用户
const editUser = (user: User) => {
  editingUser.value = { ...user }
  showUserModal.value = true
}

// 关闭用户模态框
const closeUserModal = () => {
  showUserModal.value = false
  editingUser.value = null
}

// 保存用户
const saveUser = (userData: User) => {
  if (editingUser.value) {
    // 编辑模式
    const index = users.value.findIndex(u => u.id === editingUser.value!.id)
    if (index > -1) {
      users.value[index] = { ...users.value[index], ...userData }
    }
  } else {
    // 创建模式
    const newUser: User = {
      ...userData,
      id: Math.max(...users.value.map(u => u.id)) + 1,
      status: 'active',
      lastLogin: new Date().toISOString()
    }
    users.value.push(newUser)
  }
  closeUserModal()
}

// 重置密码
const resetPassword = (user: User) => {
  if (confirm(t('userManage.confirmReset', { username: user.username }))) {
    // 这里应该调用API重置密码
    alert(t('userManage.resetSuccess'))
  }
}

// 切换用户状态
const toggleUserStatus = (user: User) => {
  const confirmKey = user.status === 'active' ? 'confirmFreeze' : 'confirmUnfreeze'
  if (confirm(t(`userManage.${confirmKey}`, { username: user.username }))) {
    const userIndex = users.value.findIndex(u => u.id === user.id)
    if (userIndex > -1) {
      users.value[userIndex].status = user.status === 'active' ? 'inactive' : 'active'
    }
  }
}
</script>

<style scoped>
/* 基本样式已通过 Tailwind CSS 类处理 */
</style>