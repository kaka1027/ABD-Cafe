<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">{{ t('analytics.title') }}</h1>
        <p class="mt-1 text-gray-600">{{ t('analytics.description') }}</p>
      </div>
      
      <!-- 时间范围选择器 -->
      <div class="flex items-center space-x-2">
        <label class="text-sm font-medium text-gray-700">{{ t('analytics.timeRange.title') }}:</label>
        <select
          v-model="selectedTimeRange"
          @change="updateData"
          class="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="today">{{ t('analytics.timeRange.today') }}</option>
          <option value="week">{{ t('analytics.timeRange.week') }}</option>
          <option value="month">{{ t('analytics.timeRange.month') }}</option>
          <option value="quarter">{{ t('analytics.timeRange.quarter') }}</option>
          <option value="year">{{ t('analytics.timeRange.year') }}</option>
        </select>
      </div>
    </div>

    <!-- 数据概览卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ t('analytics.overview.revenue') }}</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">¥{{ totalRevenue.toLocaleString() }}</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CurrencyYenIcon class="w-5 h-5 text-green-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-3">
          <span class="text-green-600 font-medium">+12.5%</span> {{ t('analytics.overview.fromPrevious') }}
        </p>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ t('analytics.overview.orders') }}</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ totalOrders.toLocaleString() }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <ShoppingBagIcon class="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-3">
          <span class="text-green-600 font-medium">+8.1%</span> {{ t('analytics.overview.fromPrevious') }}
        </p>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ t('analytics.overview.customers') }}</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ totalCustomers.toLocaleString() }}</p>
          </div>
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <UsersIcon class="w-5 h-5 text-purple-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-3">
          <span class="text-green-600 font-medium">+15.3%</span> {{ t('analytics.overview.fromPrevious') }}
        </p>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ t('analytics.overview.avgOrderValue') }}</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">¥{{ averageOrderValue }}</p>
          </div>
          <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <ChartBarIcon class="w-5 h-5 text-amber-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-3">
          <span class="text-green-600 font-medium">+4.2%</span> {{ t('analytics.overview.fromPrevious') }}
        </p>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 销售趋势图 -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('analytics.charts.salesTrend') }}</h3>
        <div class="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div class="text-center text-gray-500">
            <ChartBarIcon class="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>销售趋势图表占位符</p>
            <p class="text-sm">（需要集成图表库如 Chart.js 或 ECharts）</p>
          </div>
        </div>
      </div>

      <!-- 分类营收图 -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('analytics.charts.revenueByCategory') }}</h3>
        <div class="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div class="text-center text-gray-500">
            <ChartPieIcon class="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>分类营收饼图占位符</p>
            <p class="text-sm">（需要集成图表库如 Chart.js 或 ECharts）</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 热销商品表格 -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">{{ t('analytics.tables.topProducts.title') }}</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('analytics.tables.topProducts.product') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('analytics.tables.topProducts.sales') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('analytics.tables.topProducts.revenue') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('analytics.tables.topProducts.growth') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in topProducts" :key="product.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <span class="text-lg">{{ product.emoji }}</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    <div class="text-sm text-gray-500">{{ product.category }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.sales }} 杯</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">¥{{ product.revenue.toLocaleString() }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="product.growth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ product.growth > 0 ? '+' : '' }}{{ product.growth }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 时间分布和其他统计 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 高峰时段 -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('analytics.charts.peakHours') }}</h3>
        <div class="space-y-3">
          <div v-for="hour in peakHours" :key="hour.time" class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
              <span class="text-sm text-gray-700">{{ hour.time }}</span>
            </div>
            <div class="flex items-center">
              <div class="w-24 h-2 bg-gray-200 rounded-full mr-3">
                <div 
                  class="h-2 bg-indigo-600 rounded-full"
                  :style="{ width: `${hour.percentage}%` }"
                ></div>
              </div>
              <span class="text-sm text-gray-900 w-12 text-right">{{ hour.orders }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 顾客统计 -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('analytics.tables.customerStats.title') }}</h3>
        <div class="space-y-4">
          <div v-for="customer in topCustomers" :key="customer.id" class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-gray-600 font-medium text-sm">
                  {{ customer.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">{{ customer.name }}</div>
                <div class="text-sm text-gray-500">{{ customer.orders }} 订单</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-gray-900">¥{{ customer.totalSpent }}</div>
              <div class="text-sm text-gray-500">{{ customer.lastOrder }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  CurrencyYenIcon,
  ShoppingBagIcon,
  UsersIcon,
  ChartBarIcon,
  ChartPieIcon
} from '@heroicons/vue/24/outline'

const { t } = useI18n()

interface TopProduct {
  id: string
  name: string
  category: string
  emoji: string
  sales: number
  revenue: number
  growth: number
}

interface PeakHour {
  time: string
  orders: number
  percentage: number
}

interface TopCustomer {
  id: string
  name: string
  orders: number
  totalSpent: number
  lastOrder: string
}

const selectedTimeRange = ref('month')
const totalRevenue = ref(45280)
const totalOrders = ref(1247)
const totalCustomers = ref(523)
const averageOrderValue = ref(36)

const topProducts = ref<TopProduct[]>([
  {
    id: '1',
    name: '美式咖啡',
    category: '咖啡',
    emoji: '☕',
    sales: 324,
    revenue: 8100,
    growth: 12.5
  },
  {
    id: '2',
    name: '拿铁咖啡',
    category: '咖啡',
    emoji: '☕',
    sales: 298,
    revenue: 10430,
    growth: 8.3
  },
  {
    id: '3',
    name: '抹茶拿铁',
    category: '茶饮',
    emoji: '🍵',
    sales: 187,
    revenue: 7106,
    growth: 15.7
  },
  {
    id: '4',
    name: '芒果汁',
    category: '果汁',
    emoji: '🥭',
    sales: 156,
    revenue: 4368,
    growth: -2.1
  },
  {
    id: '5',
    name: '卡布奇诺',
    category: '咖啡',
    emoji: '☕',
    sales: 142,
    revenue: 4260,
    growth: 5.9
  }
])

const peakHours = ref<PeakHour[]>([
  { time: '08:00-09:00', orders: 45, percentage: 90 },
  { time: '12:00-13:00', orders: 38, percentage: 76 },
  { time: '14:00-15:00', orders: 32, percentage: 64 },
  { time: '16:00-17:00', orders: 28, percentage: 56 },
  { time: '10:00-11:00', orders: 25, percentage: 50 },
  { time: '15:00-16:00', orders: 22, percentage: 44 },
  { time: '11:00-12:00', orders: 20, percentage: 40 }
])

const topCustomers = ref<TopCustomer[]>([
  {
    id: '1',
    name: '张三',
    orders: 24,
    totalSpent: 860,
    lastOrder: '2 天前'
  },
  {
    id: '2',
    name: '李四',
    orders: 18,
    totalSpent: 720,
    lastOrder: '1 天前'
  },
  {
    id: '3',
    name: '王五',
    orders: 15,
    totalSpent: 540,
    lastOrder: '今天'
  },
  {
    id: '4',
    name: '赵六',
    orders: 12,
    totalSpent: 480,
    lastOrder: '3 天前'
  },
  {
    id: '5',
    name: '陈七',
    orders: 10,
    totalSpent: 350,
    lastOrder: '1 周前'
  }
])

const updateData = () => {
  // 根据选择的时间范围更新数据
  console.log('更新数据，时间范围:', selectedTimeRange.value)
  
  // 这里可以调用 API 获取对应时间范围的数据
  // 模拟数据更新
  const timeRangeMultipliers = {
    today: 0.1,
    week: 0.3,
    month: 1,
    quarter: 2.5,
    year: 10
  }
  
  const multiplier = timeRangeMultipliers[selectedTimeRange.value as keyof typeof timeRangeMultipliers]
  totalRevenue.value = Math.round(45280 * multiplier)
  totalOrders.value = Math.round(1247 * multiplier)
  totalCustomers.value = Math.round(523 * multiplier)
}

onMounted(() => {
  updateData()
})
</script>