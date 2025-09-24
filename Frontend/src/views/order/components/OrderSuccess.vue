<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto" 
    aria-labelledby="modal-title" 
    role="dialog" 
    aria-modal="true"
  >
    <!-- 背景遮罩 -->
    <div 
      class="fixed inset-0 bg-gray-500 opacity-75 transition-opacity" 
      @click="$emit('close')"
    ></div>
    
    <!-- 模态框内容 -->
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div 
        class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
        @click.stop
      >
        <div>
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckIcon class="h-6 w-6 text-green-600" />
          </div>
          <div class="mt-3 text-center sm:mt-5">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {{ t('order.orderSuccess') }}
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                {{ t('order.orderNumber', { number: orderId }) }}
              </p>
            </div>
          </div>
        </div>
        <div class="mt-5 sm:mt-6">
          <button
            @click="$emit('close')"
            type="button"
            class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          >
            {{ t('order.continueOrder') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { CheckIcon } from '@heroicons/vue/24/outline'

interface Props {
  show: boolean
  orderId: string
}

defineProps<Props>()

defineEmits<{
  close: []
}>()

const { t } = useI18n()
</script>

<style scoped>
/* 基本样式已通过 Tailwind CSS 类处理 */
</style>