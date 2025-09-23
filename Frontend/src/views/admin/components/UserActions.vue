<template>
  <div class="flex items-center space-x-2">
    <!-- 编辑按钮 -->
    <button
      @click="$emit('edit', user)"
      class="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
      :title="t('actions.edit')"
    >
      <PencilIcon class="h-4 w-4" />
    </button>
    
    <!-- 重置密码按钮 -->
    <button
      @click="$emit('resetPassword', user)"
      class="text-yellow-600 hover:text-yellow-900 p-1 rounded-md hover:bg-yellow-50"
      :title="t('actions.resetPassword')"
    >
      <KeyIcon class="h-4 w-4" />
    </button>
    
    <!-- 冻结/解冻按钮 -->
    <button
      @click="$emit('toggleStatus', user)"
      :class="{
        'text-red-600 hover:text-red-900 hover:bg-red-50': user.status === 'active',
        'text-green-600 hover:text-green-900 hover:bg-green-50': user.status === 'inactive'
      }"
      class="p-1 rounded-md"
      :title="user.status === 'active' ? t('actions.freeze') : t('actions.unfreeze')"
    >
      <XMarkIcon v-if="user.status === 'active'" class="h-4 w-4" />
      <CheckCircleIcon v-else class="h-4 w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PencilIcon, KeyIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

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
  user: User
}

defineProps<Props>()

defineEmits<{
  edit: [user: User]
  resetPassword: [user: User]
  toggleStatus: [user: User]
}>()

const { t } = useI18n()
</script>

<style scoped>
/* 基本样式已通过 Tailwind CSS 类处理 */
</style>