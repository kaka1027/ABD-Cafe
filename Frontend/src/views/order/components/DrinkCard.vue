<template>
  <div class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
    <div class="aspect-w-16 aspect-h-9 bg-gray-100">
      <img
        :src="drink.image"
        :alt="drink.name"
        class="w-full h-48 object-cover"
      />
    </div>
    <div class="p-4">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-medium text-gray-900">{{ drink.name }}</h3>
        <span class="text-lg font-bold text-indigo-600">¥{{ drink.price.toFixed(2) }}</span>
      </div>
      <p class="text-sm text-gray-600 mb-4">{{ drink.description }}</p>
      
      <!-- 定制按钮 -->
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-500">
          {{ t('order.customize.clickToCustomize') }}
        </div>
        <button
          @click="openCustomizer"
          class="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
        >
          {{ t('order.customize.customize') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Drink {
  id: number
  name: string
  price: number
  description: string
  category: string
  image: string
  hasTemperature: boolean
}

interface Props {
  drink: Drink
}

const props = defineProps<Props>()

const emit = defineEmits<{
  addToCart: [item: {
    drink: Drink
    quantity: number
  }]
}>()

const { t } = useI18n()

const openCustomizer = () => {
  emit('addToCart', {
    drink: props.drink,
    quantity: 1
  })
}
</script>

<style scoped>
/* 基本样式已通过 Tailwind CSS 类处理 */
</style>