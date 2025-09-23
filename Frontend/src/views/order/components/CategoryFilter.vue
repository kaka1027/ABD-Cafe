<template>
  <div class="p-6 border-b border-gray-200">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="category in categories"
        :key="category"
        @click="$emit('categoryChange', category)"
        :class="{
          'bg-indigo-600 text-white': selectedCategory === category,
          'bg-gray-100 text-gray-700 hover:bg-gray-200': selectedCategory !== category
        }"
        class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
      >
        {{ t(`order.categories.${category}`) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  categories: string[]
  selectedCategory: string
}

defineProps<Props>()

defineEmits<{
  categoryChange: [category: string]
}>()

const { t } = useI18n()
</script>

<style scoped>
/* 基本样式已通过 Tailwind CSS 类处理 */
</style>