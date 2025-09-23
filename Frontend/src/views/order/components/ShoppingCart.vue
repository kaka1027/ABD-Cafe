<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">{{ t('order.cart') }}</h2>
      <p class="mt-1 text-sm text-gray-500">
        {{ t('order.items', { count: cartItems.length }) }}
      </p>
    </div>

    <div class="p-6" v-if="cartItems.length > 0">
      <div class="space-y-4 max-h-96 overflow-y-auto">
        <div
          v-for="item in cartItems"
          :key="`${item.id}-${item.temperature}`"
          class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
        >
          <div class="flex-1 min-w-0 pr-4">
            <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
            <p class="text-xs text-gray-500" v-if="item.temperature">{{ item.temperature }}</p>
            <p class="text-sm text-gray-600">¥{{ item.price.toFixed(2) }} × {{ item.quantity }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="$emit('updateQuantity', item, item.quantity - 1)"
              class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
            >
              <MinusIcon class="w-3 h-3" />
            </button>
            <span class="w-6 text-center text-sm">{{ item.quantity }}</span>
            <button
              @click="$emit('updateQuantity', item, item.quantity + 1)"
              class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
            >
              <PlusIcon class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-6 border-t border-gray-200">
        <div class="flex justify-between text-base font-medium text-gray-900 mb-4">
          <p>{{ t('order.total') }}</p>
          <p>¥{{ totalAmount.toFixed(2) }}</p>
        </div>

        <!-- 余额不足提示 -->
        <div v-if="showInsufficientBalance" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div class="flex">
            <XCircleIcon class="h-5 w-5 text-red-400" />
            <div class="ml-3">
              <p class="text-sm text-red-600">
                {{ t('order.insufficientBalance', { amount: insufficientAmount.toFixed(2) }) }}
              </p>
            </div>
          </div>
        </div>

        <button
          @click="$emit('submitOrder')"
          :disabled="isSubmitDisabled"
          class="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {{ isSubmitting ? t('order.submitting') : t('order.submit') }}
        </button>
      </div>
    </div>

    <div v-else class="p-6 text-center">
      <ShoppingBagIcon class="mx-auto h-12 w-12 text-gray-400" />
      <p class="mt-2 text-sm text-gray-500">{{ t('order.emptyCart') }}</p>
      <p class="text-xs text-gray-400 mt-1">{{ t('order.emptyCartTip') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { MinusIcon, PlusIcon, XCircleIcon, ShoppingBagIcon } from '@heroicons/vue/24/outline'

interface CartItem {
  id: number
  name: string
  price: number
  description: string
  category: string
  image: string
  hasTemperature: boolean
  quantity: number
  temperature?: string
}

interface Props {
  cartItems: CartItem[]
  totalAmount: number
  userQuota: number
  isSubmitting: boolean
  hasUser: boolean
}

const props = defineProps<Props>()

defineEmits<{
  updateQuantity: [item: CartItem, quantity: number]
  submitOrder: []
}>()

const { t } = useI18n()

const showInsufficientBalance = computed(() => {
  return props.hasUser && props.totalAmount > props.userQuota
})

const insufficientAmount = computed(() => {
  return props.totalAmount - props.userQuota
})

const isSubmitDisabled = computed(() => {
  return !props.hasUser || 
         props.cartItems.length === 0 || 
         props.totalAmount > props.userQuota || 
         props.isSubmitting
})
</script>

<style scoped>
/* 基本样式已通过 Tailwind CSS 类处理 */
</style>