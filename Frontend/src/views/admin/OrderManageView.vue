<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">{{ t('orderManage.title') }}</h1>
        <p class="mt-1 text-gray-600">{{ t('orderManage.description') }}</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="refreshOrders"
          class="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowPathIcon class="w-5 h-5 mr-2" />
          刷新
        </button>
        <button
          @click="exportOrders"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
          导出数据
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ t('orderManage.stats.totalOrders') }}</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ orders.length }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <ShoppingBagIcon class="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-3">
          <span class="text-green-600 font-medium">+8%</span> {{ t('orderManage.stats.fromYesterday') }}
        </p>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ t('orderManage.stats.pendingOrders') }}</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ pendingOrdersCount }}</p>
          </div>
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <ClockIcon class="w-5 h-5 text-yellow-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-3">
          <span class="text-yellow-600 font-medium">{{ pendingOrdersPercentage }}%</span> {{ t('orderManage.stats.ofTotal') }}
        </p>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ t('orderManage.stats.completedOrders') }}</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ completedOrdersCount }}</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="w-5 h-5 text-green-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-3">
          <span class="text-green-600 font-medium">{{ completedOrdersPercentage }}%</span> {{ t('orderManage.stats.ofTotal') }}
        </p>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ t('orderManage.stats.todayRevenue') }}</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">¥{{ todayRevenue }}</p>
          </div>
          <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <CurrencyYenIcon class="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-3">
          <span class="text-green-600 font-medium">+15%</span> {{ t('orderManage.stats.fromYesterday') }}
        </p>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('orderManage.filters.title') }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 搜索 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">搜索</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              :placeholder="t('orderManage.filters.searchPlaceholder')"
            />
          </div>
        </div>

        <!-- 状态筛选 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">状态</label>
          <select
            v-model="statusFilter"
            class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">{{ t('orderManage.filters.status.all') }}</option>
            <option value="pending">{{ t('orderManage.filters.status.pending') }}</option>
            <option value="processing">{{ t('orderManage.filters.status.processing') }}</option>
            <option value="completed">{{ t('orderManage.filters.status.completed') }}</option>
            <option value="cancelled">{{ t('orderManage.filters.status.cancelled') }}</option>
          </select>
        </div>

        <!-- 清空筛选 -->
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {{ t('orderManage.filters.clear') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 订单表格 -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('orderManage.table.orderInfo') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('orderManage.table.customer') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('orderManage.table.items') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('orderManage.table.amount') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('orderManage.table.status') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('orderManage.table.time') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('orderManage.table.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">#{{ order.id }}</div>
                  <div class="text-sm text-gray-500">{{ order.orderNumber }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-gray-600 font-medium text-sm">
                      {{ order.customer.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div class="text-sm font-medium text-gray-900">{{ order.customer }}</div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">
                  <div v-for="item in order.items.slice(0, 2)" :key="item.id" class="mb-1">
                    {{ item.name }} × {{ item.quantity }}
                  </div>
                  <div v-if="order.items.length > 2" class="text-gray-500">
                    +{{ order.items.length - 2 }} 更多...
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">¥{{ order.total }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(order.status)"
                >
                  {{ t(`orderManage.status.${order.status}`) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    v-if="order.status === 'pending'"
                    @click="processOrder(order.id)"
                    class="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    {{ t('orderManage.actions.process') }}
                  </button>
                  <button
                    v-if="order.status === 'processing'"
                    @click="completeOrder(order.id)"
                    class="text-green-600 hover:text-green-900 text-sm"
                  >
                    {{ t('orderManage.actions.complete') }}
                  </button>
                  <button
                    v-if="order.status !== 'completed' && order.status !== 'cancelled'"
                    @click="cancelOrder(order.id)"
                    class="text-red-600 hover:text-red-900 text-sm"
                  >
                    {{ t('orderManage.actions.cancel') }}
                  </button>
                  <button
                    @click="viewOrder(order.id)"
                    class="text-gray-600 hover:text-gray-900 text-sm"
                  >
                    {{ t('orderManage.actions.view') }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 分页 -->
    <div class="flex items-center justify-between bg-white px-6 py-3 border border-gray-200 rounded-lg">
      <div class="text-sm text-gray-700">
        显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, orders.length) }} 条，共 {{ orders.length }} 条
      </div>
      <div class="flex space-x-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一页
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyYenIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'

const { t } = useI18n()

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  customer: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  createdAt: string
}

const orders = ref<Order[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 模拟数据
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-20241001-001',
    customer: '张三',
    items: [
      { id: '1', name: '美式咖啡', quantity: 1, price: 25 },
      { id: '2', name: '拿铁咖啡', quantity: 2, price: 35 }
    ],
    total: 95,
    status: 'pending',
    createdAt: '2024-10-01T09:30:00Z'
  },
  {
    id: '2',
    orderNumber: 'ORD-20241001-002',
    customer: '李四',
    items: [
      { id: '3', name: '卡布奇诺', quantity: 1, price: 30 }
    ],
    total: 30,
    status: 'processing',
    createdAt: '2024-10-01T10:15:00Z'
  },
  {
    id: '3',
    orderNumber: 'ORD-20241001-003',
    customer: '王五',
    items: [
      { id: '4', name: '抹茶拿铁', quantity: 1, price: 38 },
      { id: '5', name: '柠檬蜂蜜茶', quantity: 1, price: 28 }
    ],
    total: 66,
    status: 'completed',
    createdAt: '2024-10-01T11:00:00Z'
  }
]

// 计算属性
const filteredOrders = computed(() => {
  let filtered = orders.value

  if (searchQuery.value) {
    filtered = filtered.filter(order =>
      order.orderNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  return filtered
})

const pendingOrdersCount = computed(() =>
  orders.value.filter(order => order.status === 'pending').length
)

const completedOrdersCount = computed(() =>
  orders.value.filter(order => order.status === 'completed').length
)

const pendingOrdersPercentage = computed(() =>
  orders.value.length > 0 ? Math.round((pendingOrdersCount.value / orders.value.length) * 100) : 0
)

const completedOrdersPercentage = computed(() =>
  orders.value.length > 0 ? Math.round((completedOrdersCount.value / orders.value.length) * 100) : 0
)

const todayRevenue = computed(() =>
  orders.value
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0)
)

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / pageSize.value))

// 方法
const getStatusClass = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const processOrder = (orderId: string) => {
  const order = orders.value.find(o => o.id === orderId)
  if (order) {
    order.status = 'processing'
  }
}

const completeOrder = (orderId: string) => {
  const order = orders.value.find(o => o.id === orderId)
  if (order) {
    order.status = 'completed'
  }
}

const cancelOrder = (orderId: string) => {
  const order = orders.value.find(o => o.id === orderId)
  if (order) {
    order.status = 'cancelled'
  }
}

const viewOrder = (orderId: string) => {
  // 这里可以打开订单详情模态框或跳转到详情页
  console.log('查看订单:', orderId)
}

const refreshOrders = () => {
  // 刷新订单数据
  console.log('刷新订单数据')
}

const exportOrders = () => {
  // 导出订单数据
  console.log('导出订单数据')
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

onMounted(() => {
  orders.value = mockOrders
})
</script>