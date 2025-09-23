<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
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
          <th scope="col" class="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {{ t('userManage.table.lastLogin') }}
          </th>
          <th scope="col" class="relative px-6 py-3">
            <span class="sr-only">{{ t('userManage.table.actions') }}</span>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <span class="text-gray-600 font-medium text-sm">
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
              'bg-indigo-100 text-indigo-800': user.role === 'admin',
              'bg-gray-100 text-gray-800': user.role === 'user'
            }" class="inline-flex px-2 py-1 text-xs font-medium rounded-full">
              {{ t(`userManage.role.${user.role}`) }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span :class="{
              'bg-green-100 text-green-800': user.status === 'active',
              'bg-red-100 text-red-800': user.status === 'inactive'
            }" class="inline-flex px-2 py-1 text-xs font-medium rounded-full">
              {{ t(`userManage.status.${user.status}`) }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            ¥{{ user.quota.toFixed(2) }}
          </td>
          <td class="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ formatDate(user.lastLogin) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <UserActions
              :user="user"
              @edit="$emit('edit', $event)"
              @reset-password="$emit('resetPassword', $event)"
              @toggle-status="$emit('toggleStatus', $event)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UserActions from './UserActions.vue'

interface User {
  id: number
  username: string
  email: string
  role: string
  status: string
  quota: number
  lastLogin: string
}

interface Props {
  users: User[]
}

defineProps<Props>()

defineEmits<{
  edit: [user: User]
  resetPassword: [user: User]
  toggleStatus: [user: User]
}>()

const { t } = useI18n()

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
/* 基本样式已通过 Tailwind CSS 类处理 */
</style>