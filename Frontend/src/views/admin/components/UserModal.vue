<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto" 
    aria-labelledby="modal-title" 
    role="dialog" 
    aria-modal="true"
  >
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="$emit('submit', formData)">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {{ t(isEditing ? 'userManage.modal.editTitle' : 'userManage.modal.createTitle') }}
                </h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="username" class="block text-sm font-medium text-gray-700">{{ t('userManage.modal.username') }}</label>
                    <input
                      type="text"
                      id="username"
                      v-model="formData.username"
                      :disabled="isEditing"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">{{ t('userManage.modal.email') }}</label>
                    <input
                      type="email"
                      id="email"
                      v-model="formData.email"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div v-if="!isEditing">
                    <label for="password" class="block text-sm font-medium text-gray-700">{{ t('userManage.modal.initialPassword') }}</label>
                    <input
                      type="password"
                      id="password"
                      v-model="formData.password"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="role" class="block text-sm font-medium text-gray-700">{{ t('userManage.modal.role') }}</label>
                    <select
                      id="role"
                      v-model="formData.role"
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
                      v-model.number="formData.quota"
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
              {{ t(isEditing ? 'userManage.modal.save' : 'userManage.modal.create') }}
            </button>
            <button
              type="button"
              @click="$emit('close')"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ t('userManage.modal.cancel') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

interface User {
  id?: number
  username: string
  email: string
  role: string
  quota: number
  password?: string
}

interface Props {
  show: boolean
  user?: User | null
  isEditing: boolean
}

const props = defineProps<Props>()

defineEmits<{
  close: []
  submit: [data: User]
}>()

const { t } = useI18n()

const formData = reactive<User>({
  username: '',
  email: '',
  role: 'user',
  quota: 100,
  password: ''
})

// 监听用户数据变化，更新表单
watch(() => props.user, (newUser) => {
  if (newUser) {
    Object.assign(formData, {
      ...newUser,
      password: '' // 编辑时清空密码字段
    })
  } else {
    // 重置表单
    Object.assign(formData, {
      username: '',
      email: '',
      role: 'user',
      quota: 100,
      password: ''
    })
  }
}, { immediate: true })
</script>

<style scoped>
/* 基本样式已通过 Tailwind CSS 类处理 */
</style>