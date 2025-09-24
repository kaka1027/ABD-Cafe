<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">{{ t('productManage.title') }}</h1>
        <p class="mt-1 text-gray-600">{{ t('productManage.description') }}</p>
      </div>
      <button
        @click="openCreateModal"
        class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        {{ t('productManage.createProduct') }}
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ t('productManage.stats.totalProducts') }}</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ products.length }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <CubeIcon class="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-3">
          <span class="text-green-600 font-medium">+3</span> {{ t('productManage.stats.fromLastMonth') }}
        </p>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ t('productManage.stats.activeProducts') }}</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ activeProductsCount }}</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="w-5 h-5 text-green-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-3">
          <span class="text-green-600 font-medium">{{ activeProductsPercentage }}%</span> {{ t('productManage.stats.ofTotal') }}
        </p>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ t('productManage.stats.lowStock') }}</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ lowStockCount }}</p>
          </div>
          <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <ExclamationTriangleIcon class="w-5 h-5 text-red-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-3">
          <span class="text-red-600 font-medium">{{ lowStockCount }}</span> {{ t('productManage.stats.items') }}
        </p>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ t('productManage.stats.avgPrice') }}</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">¥{{ averagePrice }}</p>
          </div>
          <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <CurrencyYenIcon class="w-5 h-5 text-amber-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-3">
          <span class="text-green-600 font-medium">+5%</span> {{ t('productManage.stats.fromLastMonth') }}
        </p>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('productManage.filters.title') }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              :placeholder="t('productManage.filters.searchPlaceholder')"
            />
          </div>
        </div>

        <!-- 分类筛选 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">分类</label>
          <select
            v-model="categoryFilter"
            class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">{{ t('productManage.filters.category.all') }}</option>
            <option value="coffee">{{ t('productManage.filters.category.coffee') }}</option>
            <option value="tea">{{ t('productManage.filters.category.tea') }}</option>
            <option value="juice">{{ t('productManage.filters.category.juice') }}</option>
            <option value="snack">{{ t('productManage.filters.category.snack') }}</option>
          </select>
        </div>

        <!-- 状态筛选 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">状态</label>
          <select
            v-model="statusFilter"
            class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">{{ t('productManage.filters.status.all') }}</option>
            <option value="active">{{ t('productManage.filters.status.active') }}</option>
            <option value="inactive">{{ t('productManage.filters.status.inactive') }}</option>
          </select>
        </div>

        <!-- 清空筛选 -->
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {{ t('productManage.filters.clear') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 商品表格 -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('productManage.table.productInfo') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('productManage.table.category') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('productManage.table.price') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('productManage.table.stock') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('productManage.table.status') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('productManage.table.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                    <span class="text-2xl">{{ product.emoji }}</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    <div class="text-sm text-gray-500">{{ product.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ t(`productManage.filters.category.${product.category}`) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">¥{{ product.price }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  <span :class="product.stock < 10 ? 'text-red-600 font-medium' : ''">
                    {{ product.stock }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ t(`productManage.status.${product.status}`) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="editProduct(product)"
                    class="text-indigo-600 hover:text-indigo-900 text-sm"
                  >
                    {{ t('productManage.actions.edit') }}
                  </button>
                  <button
                    @click="toggleProductStatus(product.id)"
                    class="text-amber-600 hover:text-amber-900 text-sm"
                  >
                    {{ t('productManage.actions.toggle') }}
                  </button>
                  <button
                    @click="deleteProduct(product.id)"
                    class="text-red-600 hover:text-red-900 text-sm"
                  >
                    {{ t('productManage.actions.delete') }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 商品模态框 -->
    <div v-if="showModal" class="fixed inset-0 bg-black opacity-50 flex items-center justify-center z-50 p-4" @click="closeModal">
      <div class="bg-white rounded-lg w-full max-w-md" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editingProduct ? t('productManage.modal.editTitle') : t('productManage.modal.createTitle') }}
          </h3>
        </div>
        
        <form @submit.prevent="saveProduct" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('productManage.modal.name') }}
            </label>
            <input
              v-model="productForm.name"
              type="text"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('productManage.modal.description') }}
            </label>
            <textarea
              v-model="productForm.description"
              rows="3"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('productManage.modal.category') }}
            </label>
            <select
              v-model="productForm.category"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="coffee">{{ t('productManage.filters.category.coffee') }}</option>
              <option value="tea">{{ t('productManage.filters.category.tea') }}</option>
              <option value="juice">{{ t('productManage.filters.category.juice') }}</option>
              <option value="snack">{{ t('productManage.filters.category.snack') }}</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('productManage.modal.price') }}
              </label>
              <input
                v-model.number="productForm.price"
                type="number"
                min="0"
                step="0.01"
                required
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('productManage.modal.stock') }}
              </label>
              <input
                v-model.number="productForm.stock"
                type="number"
                min="0"
                required
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {{ t('productManage.modal.cancel') }}
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {{ editingProduct ? t('productManage.modal.save') : t('productManage.modal.create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PlusIcon,
  CubeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyYenIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const { t } = useI18n()

interface Product {
  id: string
  name: string
  description: string
  category: 'coffee' | 'tea' | 'juice' | 'snack'
  price: number
  stock: number
  status: 'active' | 'inactive'
  emoji: string
}

const products = ref<Product[]>([])
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const showModal = ref(false)
const editingProduct = ref<Product | null>(null)

const productForm = reactive({
  name: '',
  description: '',
  category: 'coffee' as Product['category'],
  price: 0,
  stock: 0
})

// 模拟数据
const mockProducts: Product[] = [
  {
    id: '1',
    name: '美式咖啡',
    description: '经典美式咖啡，香醇浓郁',
    category: 'coffee',
    price: 25,
    stock: 50,
    status: 'active',
    emoji: '☕'
  },
  {
    id: '2',
    name: '拿铁咖啡',
    description: '香滑拿铁，奶香与咖啡的完美融合',
    category: 'coffee',
    price: 35,
    stock: 8,
    status: 'active',
    emoji: '☕'
  },
  {
    id: '3',
    name: '抹茶拿铁',
    description: '清香抹茶与丝滑牛奶的完美结合',
    category: 'tea',
    price: 38,
    stock: 30,
    status: 'active',
    emoji: '🍵'
  },
  {
    id: '4',
    name: '芒果汁',
    description: '新鲜芒果现榨，浓郁果香',
    category: 'juice',
    price: 28,
    stock: 5,
    status: 'active',
    emoji: '🥭'
  },
  {
    id: '5',
    name: '卡布奇诺',
    description: '意式经典，浓郁咖啡配绵密奶泡',
    category: 'coffee',
    price: 30,
    stock: 20,
    status: 'inactive',
    emoji: '☕'
  }
]

// 计算属性
const filteredProducts = computed(() => {
  let filtered = products.value

  if (searchQuery.value) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(product => product.category === categoryFilter.value)
  }

  if (statusFilter.value) {
    filtered = filtered.filter(product => product.status === statusFilter.value)
  }

  return filtered
})

const activeProductsCount = computed(() =>
  products.value.filter(product => product.status === 'active').length
)

const activeProductsPercentage = computed(() =>
  products.value.length > 0 ? Math.round((activeProductsCount.value / products.value.length) * 100) : 0
)

const lowStockCount = computed(() =>
  products.value.filter(product => product.stock < 10).length
)

const averagePrice = computed(() => {
  if (products.value.length === 0) return 0
  const total = products.value.reduce((sum, product) => sum + product.price, 0)
  return Math.round(total / products.value.length)
})

// 方法
const openCreateModal = () => {
  editingProduct.value = null
  resetForm()
  showModal.value = true
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  productForm.name = product.name
  productForm.description = product.description
  productForm.category = product.category
  productForm.price = product.price
  productForm.stock = product.stock
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingProduct.value = null
  resetForm()
}

const resetForm = () => {
  productForm.name = ''
  productForm.description = ''
  productForm.category = 'coffee'
  productForm.price = 0
  productForm.stock = 0
}

const saveProduct = () => {
  if (editingProduct.value) {
    // 编辑现有商品
    const index = products.value.findIndex(p => p.id === editingProduct.value!.id)
    if (index !== -1) {
      products.value[index] = {
        ...products.value[index],
        name: productForm.name,
        description: productForm.description,
        category: productForm.category,
        price: productForm.price,
        stock: productForm.stock
      }
    }
  } else {
    // 创建新商品
    const newProduct: Product = {
      id: Date.now().toString(),
      name: productForm.name,
      description: productForm.description,
      category: productForm.category,
      price: productForm.price,
      stock: productForm.stock,
      status: 'active',
      emoji: getCategoryEmoji(productForm.category)
    }
    products.value.push(newProduct)
  }
  closeModal()
}

const getCategoryEmoji = (category: string) => {
  const emojis = {
    coffee: '☕',
    tea: '🍵',
    juice: '🧃',
    snack: '🍪'
  }
  return emojis[category as keyof typeof emojis] || '☕'
}

const toggleProductStatus = (productId: string) => {
  const product = products.value.find(p => p.id === productId)
  if (product) {
    product.status = product.status === 'active' ? 'inactive' : 'active'
  }
}

const deleteProduct = (productId: string) => {
  if (confirm('确定要删除这个商品吗？')) {
    const index = products.value.findIndex(p => p.id === productId)
    if (index !== -1) {
      products.value.splice(index, 1)
    }
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = ''
  statusFilter.value = ''
}

onMounted(() => {
  products.value = mockProducts
})
</script>