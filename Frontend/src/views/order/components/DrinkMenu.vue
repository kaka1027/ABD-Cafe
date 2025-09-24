<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">{{ t('order.menuTitle') }}</h2>
      <p class="mt-1 text-sm text-gray-500">{{ t('order.menuDesc') }}</p>
    </div>

    <!-- 分类筛选 -->
    <CategoryFilter 
      :categories="categories"
      :selected-category="selectedCategory"
      @category-change="$emit('categoryChange', $event)"
    />

    <!-- 饮品列表 -->
    <div class="p-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <DrinkCard
          v-for="drink in drinks"
          :key="drink.id"
          :drink="drink"
          @add-to-cart="$emit('addToCart', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CategoryFilter from './CategoryFilter.vue'
import DrinkCard from './DrinkCard.vue'

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
  drinks: Drink[]
  categories: string[]
  selectedCategory: string
}

defineProps<Props>()

defineEmits<{
  categoryChange: [category: string]
  addToCart: [item: {
    drink: Drink
    quantity: number
  }]
}>()

const { t } = useI18n()
</script>

<style scoped>
/* 基本样式已通过 Tailwind CSS 类处理 */
</style>