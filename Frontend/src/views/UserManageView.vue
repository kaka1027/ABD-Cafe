<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-bold text-gray-900">{{ t('userManage.title') }}</h1>
          <p class="mt-2 text-sm text-gray-700">
            {{ t('userManage.description') }}
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            @click="openCreateUserModal"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {{ t('userManage.createUser') }}
          </button>
        </div>
      </div>

      <!-- 搜索和筛选 -->
      <div class="mt-6 flex items-center space-x-4">
        <div class="flex-1 max-w-md">
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="t('userManage.searchPlaceholder')"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <select
          v-model="statusFilter"
          class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">{{ t('userManage.status.all') }}</option>
          <option value="active">{{ t('userManage.status.active') }}</option>
          <option value="inactive">{{ t('userManage.status.inactive') }}</option>
        </select>
        <select
          v-model="roleFilter"
          class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">{{ t('userManage.role.all') }}</option>
          <option value="admin">{{ t('userManage.role.admin') }}</option>
          <option value="user">{{ t('userManage.role.user') }}</option>
        </select>
      </div>

      <!-- 用户列表 -->
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ t('userManage.table.userInfo') }}
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ t('userManage.table.role') }}
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ t('userManage.table.status') }}
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ t('userManage.table.quota') }}
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ t('userManage.table.lastLogin') }}
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">{{ t('userManage.table.actions') }}</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in filteredUsers" :key="user.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span class="text-indigo-600 font-medium text-sm">
                              {{ user.username.charAt(0).toUpperCase() }}
                            </span>
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                          <div class="text-sm text-gray-500">{{ user.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="{
                        'bg-purple-100 text-purple-800': user.role === 'admin',
                        'bg-green-100 text-green-800': user.role === 'user'
                      }" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                        {{ t(`userManage.role.${user.role}`) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="{
                        'bg-green-100 text-green-800': user.status === 'active',
                        'bg-red-100 text-red-800': user.status === 'inactive'
                      }" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                        {{ t(`userManage.status.${user.status}`) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ¥{{ user.quota.toFixed(2) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(user.lastLogin) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center space-x-2">
                        <button
                          @click="editUser(user)"
                          class="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
                          title="编辑用户"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          @click="resetPassword(user)"
                          class="text-yellow-600 hover:text-yellow-900 p-1 rounded-md hover:bg-yellow-50"
                          title="重置密码"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </button>
                        <button
                          @click="toggleUserStatus(user)"
                          :class="{
                            'text-red-600 hover:text-red-900 hover:bg-red-50': user.status === 'active',
                            'text-green-600 hover:text-green-900 hover:bg-green-50': user.status === 'inactive'
                          }"
                          class="p-1 rounded-md"
                          :title="user.status === 'active' ? '冻结用户' : '启用用户'"
                        >
                          <svg v-if="user.status === 'active'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                          <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 新建/编辑用户模态框 -->
      <div v-if="showUserModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeUserModal"></div>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form @submit.prevent="saveUser">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {{ t(editingUser ? 'userManage.modal.editTitle' : 'userManage.modal.createTitle') }}
                    </h3>
                    <div class="mt-4 space-y-4">
                      <div>
                        <label for="username" class="block text-sm font-medium text-gray-700">{{ t('userManage.modal.username') }}</label>
                        <input
                          type="text"
                          id="username"
                          v-model="userForm.username"
                          :disabled="!!editingUser"
                          required
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">{{ t('userManage.modal.email') }}</label>
                        <input
                          type="email"
                          id="email"
                          v-model="userForm.email"
                          required
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div v-if="!editingUser">
                        <label for="password" class="block text-sm font-medium text-gray-700">{{ t('userManage.modal.initialPassword') }}</label>
                        <input
                          type="password"
                          id="password"
                          v-model="userForm.password"
                          required
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label for="role" class="block text-sm font-medium text-gray-700">{{ t('userManage.modal.role') }}</label>
                        <select
                          id="role"
                          v-model="userForm.role"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="user">{{ t('userManage.role.user') }}</option>
                          <option value="admin">{{ t('userManage.role.admin') }}</option>
                        </select>
                      </div>
                      <div>
                        <label for="quota" class="block text-sm font-medium text-gray-700">{{ t('userManage.modal.quota') }}</label>
                        <input
                          type="number"
                          id="quota"
                          v-model.number="userForm.quota"
                          min="0"
                          step="0.01"
                          required
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {{ t(editingUser ? 'userManage.modal.save' : 'userManage.modal.create') }}
                </button>
                <button
                  type="button"
                  @click="closeUserModal"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {{ t('userManage.modal.cancel') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  quota: number
  lastLogin: Date
}

const searchQuery = ref('')
const statusFilter = ref('')
const roleFilter = ref('')
const showUserModal = ref(false)
const editingUser = ref<User | null>(null)

const userForm = reactive({
  username: '',
  email: '',
  password: '',
  role: 'user' as 'admin' | 'user',
  quota: 100
})

// 模拟用户数据
const users = ref<User[]>([
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    quota: 500,
    lastLogin: new Date('2024-09-18T10:30:00')
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    role: 'user',
    status: 'active',
    quota: 100,
    lastLogin: new Date('2024-09-18T09:15:00')
  },
  {
    id: 3,
    username: 'user2',
    email: 'user2@example.com',
    role: 'user',
    status: 'inactive',
    quota: 100,
    lastLogin: new Date('2024-09-17T16:45:00')
  }
])

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = !searchQuery.value || 
      user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !statusFilter.value || user.status === statusFilter.value
    const matchesRole = !roleFilter.value || user.role === roleFilter.value
    
    return matchesSearch && matchesStatus && matchesRole
  })
})

const openCreateUserModal = () => {
  editingUser.value = null
  Object.assign(userForm, {
    username: '',
    email: '',
    password: '',
    role: 'user',
    quota: 100
  })
  showUserModal.value = true
}

const editUser = (user: User) => {
  editingUser.value = user
  Object.assign(userForm, {
    username: user.username,
    email: user.email,
    password: '',
    role: user.role,
    quota: user.quota
  })
  showUserModal.value = true
}

const closeUserModal = () => {
  showUserModal.value = false
  editingUser.value = null
}

const saveUser = () => {
  if (editingUser.value) {
    // 编辑用户
    const index = users.value.findIndex(u => u.id === editingUser.value!.id)
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        email: userForm.email,
        role: userForm.role,
        quota: userForm.quota
      }
    }
  } else {
    // 新建用户
    const newUser: User = {
      id: Math.max(...users.value.map(u => u.id)) + 1,
      username: userForm.username,
      email: userForm.email,
      role: userForm.role,
      status: 'active',
      quota: userForm.quota,
      lastLogin: new Date()
    }
    users.value.push(newUser)
  }
  
  closeUserModal()
}

const resetPassword = (user: User) => {
  if (confirm(t('userManage.confirmReset', { username: user.username }))) {
    // TODO: 调用重置密码 API
    alert(t('userManage.resetSuccess'))
  }
}

const toggleUserStatus = (user: User) => {
  const confirmKey = user.status === 'active' ? 'confirmFreeze' : 'confirmUnfreeze'
  if (confirm(t(`userManage.${confirmKey}`, { username: user.username }))) {
    user.status = user.status === 'active' ? 'inactive' : 'active'
  }
}

const formatDate = (date: Date) => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>