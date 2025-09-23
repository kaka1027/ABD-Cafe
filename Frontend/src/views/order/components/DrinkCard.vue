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
      
      <!-- 温度选择 -->
      <div v-if="drink.hasTemperature" class="mb-4">
        <p class="text-sm font-medium text-gray-700 mb-2">{{ t('order.temperature.title') }}</p>
        <div class="flex space-x-2">
          <button
            v-for="temp in temperatures"
            :key="temp"
            @click="selectedTemperature = temp"
            :class="{
              'bg-indigo-600 text-white': selectedTemperature === temp,
              'bg-gray-100 text-gray-700 hover:bg-gray-200': selectedTemperature !== temp
            }"
            class="px-3 py-1 rounded-full text-xs font-medium transition-colors"
          >
            {{ temp }}
          </button>
        </div>
      </div>
      
      <!-- 数量选择和添加按钮 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <button
            @click="decreaseQuantity"
            :disabled="quantity <= 0"
            class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MinusIcon class="w-4 h-4" />
          </button>
          <span class="w-8 text-center text-sm font-medium">{{ quantity }}</span>
          <button
            @click="increaseQuantity"
            class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
          >
            <PlusIcon class="w-4 h-4" />
          </button>
        </div>
        <button
          @click="addToCart"
          :disabled="quantity === 0 || (drink.hasTemperature && !selectedTemperature)"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ t('order.product.addToCart') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'

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
  temperatures: string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  addToCart: [item: {
    drink: Drink
    quantity: number
    temperature?: string
  }]
}>()

const { t } = useI18n()

const quantity = ref(0)
const selectedTemperature = ref('')

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 0) {
    quantity.value--
  }
}

const addToCart = () => {
  if (quantity.value > 0) {
    emit('addToCart', {
      drink: props.drink,
      quantity: quantity.value,
      temperature: props.drink.hasTemperature ? selectedTemperature.value : undefined
    })
    // 重置选择
    quantity.value = 0
    selectedTemperature.value = ''
  }
}
</script>

<style scoped>
/* 基本样式已通过 Tailwind CSS 类处理 */
</style>