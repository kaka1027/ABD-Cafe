<template>
  <div class="space-y-4">
    <!-- 搜索标题 -->
    <h3 class="text-lg font-medium text-gray-900 flex items-center">
      <FunnelIcon class="w-5 h-5 mr-2 text-gray-500" />
      {{ t('userManage.filters.title') }}
    </h3>
    
    <!-- 筛选器组合 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- 搜索框 -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          :placeholder="t('userManage.searchPlaceholder')"
          class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500"
        />
      </div>

      <!-- 状态筛选 -->
      <div class="relative">
        <select
          :value="statusFilter"
          @change="$emit('update:statusFilter', $event.target.value)"
          class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
        >
          <option value="" class="bg-white">{{ t('userManage.status.all') }}</option>
          <option value="active" class="bg-white">{{ t('userManage.status.active') }}</option>
          <option value="inactive" class="bg-white">{{ t('userManage.status.inactive') }}</option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDownIcon class="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <!-- 角色筛选 -->
      <div class="relative">
        <select
          :value="roleFilter"
          @change="$emit('update:roleFilter', $event.target.value)"
          class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
        >
          <option value="" class="bg-white">{{ t('userManage.role.all') }}</option>
          <option value="admin" class="bg-white">{{ t('userManage.role.admin') }}</option>
          <option value="user" class="bg-white">{{ t('userManage.role.user') }}</option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDownIcon class="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
    
    <!-- 快速筛选按钮 -->
    <div class="flex flex-wrap gap-2">
      <button 
        @click="$emit('update:statusFilter', 'active')"
        :class="{
          'bg-indigo-100 text-indigo-700 border-indigo-200': statusFilter === 'active',
          'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200': statusFilter !== 'active'
        }"
        class="inline-flex items-center px-3 py-1.5 rounded-md border text-sm font-medium transition-colors"
      >
        <CheckCircleIcon class="w-4 h-4 mr-1" />
        {{ t('userManage.filters.activeOnly') }}
      </button>
      
      <button 
        @click="$emit('update:roleFilter', 'admin')"
        :class="{
          'bg-indigo-100 text-indigo-700 border-indigo-200': roleFilter === 'admin',
          'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200': roleFilter !== 'admin'
        }"
        class="inline-flex items-center px-3 py-1.5 rounded-md border text-sm font-medium transition-colors"
      >
        <ShieldCheckIcon class="w-4 h-4 mr-1" />
        {{ t('userManage.filters.adminsOnly') }}
      </button>
      
      <button 
        @click="clearFilters"
        class="inline-flex items-center px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        <XMarkIcon class="w-4 h-4 mr-1" />
        {{ t('userManage.filters.clear') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { 
  FunnelIcon, 
  MagnifyingGlassIcon, 
  ChevronDownIcon, 
  CheckCircleIcon, 
  ShieldCheckIcon, 
  XMarkIcon 
} from '@heroicons/vue/24/outline'

interface Props {
  searchQuery: string
  statusFilter: string
  roleFilter: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:statusFilter': [value: string]
  'update:roleFilter': [value: string]
}>()

const { t } = useI18n()

// 清空所有筛选
const clearFilters = () => {
  emit('update:searchQuery', '')
  emit('update:statusFilter', '')
  emit('update:roleFilter', '')
}
</script>

<style scoped>
/* 基本样式已通过 Tailwind CSS 类处理 */
</style>