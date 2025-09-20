
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Drink {
  id: number
  name: string
  price: number
  description: string
  category: string
  image: string
  hasTemperature: boolean
}

interface CartItem extends Drink {
  quantity: number
  temperature?: string
}

interface User {
  username: string
  remainingQuota: number
}

// 用户信息
const currentUser = reactive<User>({
  username: 'user1',
  remainingQuota: 85.50
})

// 状态
const selectedCategory = ref(t('order.categories.all'))
const isSubmitting = ref(false)
const showSuccessModal = ref(false)
const lastOrderId = ref('')

// 温度选项
const temperatureOptions = computed(() => [
  t('order.temperature.hot'),
  t('order.temperature.warm'),
  t('order.temperature.cold')
])

// 饮品数据
const drinks = computed<Drink[]>(() => [
  {
    id: 1,
    name: t('order.drinks.americano.name'),
    price: 25.00,
    description: t('order.drinks.americano.desc'),
    category: t('order.categories.coffee'),
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300',
    hasTemperature: true
  },
  {
    id: 2,
    name: t('order.drinks.latte.name'),
    price: 32.00,
    description: t('order.drinks.latte.desc'),
    category: t('order.categories.coffee'),
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300',
    hasTemperature: true
  },
  {
    id: 3,
    name: t('order.drinks.cappuccino.name'),
    price: 30.00,
    description: t('order.drinks.cappuccino.desc'),
    category: t('order.categories.coffee'),
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300',
    hasTemperature: true
  },
  {
    id: 4,
    name: t('order.drinks.matchaLatte.name'),
    price: 35.00,
    description: t('order.drinks.matchaLatte.desc'),
    category: t('order.categories.tea'),
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=300',
    hasTemperature: true
  },
  {
    id: 5,
    name: t('order.drinks.honeyLemonTea.name'),
    price: 28.00,
    description: t('order.drinks.honeyLemonTea.desc'),
    category: t('order.categories.tea'),
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300',
    hasTemperature: false
  },
  {
    id: 6,
    name: t('order.drinks.mangoJuice.name'),
    price: 22.00,
    description: t('order.drinks.mangoJuice.desc'),
    category: t('order.categories.juice'),
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=300',
    hasTemperature: false
  }
])

// 分类
const categories = computed(() => {
  const cats = [t('order.categories.all'), ...new Set(drinks.value.map(d => d.category))]
  return cats
})

// 过滤后的饮品
const filteredDrinks = computed(() => {
  if (selectedCategory.value === t('order.categories.all')) {
    return drinks.value
  }
  return drinks.value.filter(d => d.category === selectedCategory.value)
})

// 购物车
const cartItems = ref<CartItem[]>([])

// 饮品数量和温度选择
const drinkQuantities = reactive<Record<number, number>>({})
const drinkTemperatures = reactive<Record<number, string>>({})

const getDrinkQuantity = (drinkId: number) => drinkQuantities[drinkId] || 0
const getDrinkTemperature = (drinkId: number) => drinkTemperatures[drinkId] || ''

const setDrinkTemperature = (drinkId: number, temperature: string) => {
  drinkTemperatures[drinkId] = temperature
}

const increaseQuantity = (drinkId: number) => {
  drinkQuantities[drinkId] = (drinkQuantities[drinkId] || 0) + 1
}

const decreaseQuantity = (drinkId: number) => {
  if (drinkQuantities[drinkId] > 0) {
    drinkQuantities[drinkId]--
  }
}

const addToCart = (drink: Drink) => {
  const quantity = getDrinkQuantity(drink.id)
  const temperature = drink.hasTemperature ? getDrinkTemperature(drink.id) : undefined
  
  if (quantity <= 0) return
  if (drink.hasTemperature && !temperature) return

  const existingItemIndex = cartItems.value.findIndex(
    item => item.id === drink.id && item.temperature === temperature
  )

  if (existingItemIndex >= 0) {
    cartItems.value[existingItemIndex].quantity += quantity
  } else {
    cartItems.value.push({
      ...drink,
      quantity,
      temperature
    })
  }

  // 重置选择
  drinkQuantities[drink.id] = 0
  if (drink.hasTemperature) {
    delete drinkTemperatures[drink.id]
  }
}

const updateCartItemQuantity = (item: CartItem, newQuantity: number) => {
  if (newQuantity <= 0) {
    const index = cartItems.value.indexOf(item)
    cartItems.value.splice(index, 1)
  } else {
    item.quantity = newQuantity
  }
}

// 总金额
const totalAmount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
})

const submitOrder = async () => {
  if (cartItems.value.length === 0 || totalAmount.value > currentUser.remainingQuota) {
    return
  }

  isSubmitting.value = true

  try {
    // TODO: 调用实际的订单提交 API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新用户余额
    currentUser.remainingQuota -= totalAmount.value
    
    // 生成订单号
    lastOrderId.value = Date.now().toString()
    
    // 清空购物车
    cartItems.value = []
    
    // 显示成功提示
    showSuccessModal.value = true
  } catch (error) {
    alert('订单提交失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">☕</span>
              </div>
              <h1 class="text-xl font-bold text-gray-900">{{ t('order.title') }}</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <p class="text-sm text-gray-500">{{ t('order.currentUser') }}</p>
              <p class="font-medium text-gray-900">{{ currentUser.username }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">{{ t('order.remainingQuota') }}</p>
              <p class="font-medium" :class="{
                'text-green-600': currentUser.remainingQuota > 50,
                'text-yellow-600': currentUser.remainingQuota <= 50 && currentUser.remainingQuota > 20,
                'text-red-600': currentUser.remainingQuota <= 20
              }">
                ¥{{ currentUser.remainingQuota.toFixed(2) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 饮品菜单 -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">{{ t('order.menuTitle') }}</h2>
              <p class="mt-1 text-sm text-gray-500">{{ t('order.menuDesc') }}</p>
            </div>
            
            <!-- 分类筛选 -->
            <div class="p-6 border-b border-gray-200">
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="category in categories"
                  :key="category"
                  @click="selectedCategory = category"
                  :class="{
                    'bg-indigo-600 text-white': selectedCategory === category,
                    'bg-gray-100 text-gray-700 hover:bg-gray-200': selectedCategory !== category
                  }"
                  class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  {{ category }}
                </button>
              </div>
            </div>

            <!-- 饮品列表 -->
            <div class="p-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                  v-for="drink in filteredDrinks"
                  :key="drink.id"
                  class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
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
                    <p class="text-sm text-gray-500 mb-4">{{ drink.description }}</p>
                    
                    <!-- 温度选择 -->
                    <div class="mb-4" v-if="drink.hasTemperature">
                      <p class="text-sm font-medium text-gray-700 mb-2">{{ t('order.temperature.title') }}</p>
                      <div class="flex space-x-2">
                        <button
                          v-for="temp in temperatureOptions"
                          :key="temp"
                          @click="setDrinkTemperature(drink.id, temp)"
                          :class="{
                            'bg-indigo-600 text-white': getDrinkTemperature(drink.id) === temp,
                            'bg-gray-100 text-gray-700 hover:bg-gray-200': getDrinkTemperature(drink.id) !== temp
                          }"
                          class="px-3 py-1 rounded text-sm transition-colors"
                        >
                          {{ temp }}
                        </button>
                      </div>
                    </div>

                    <!-- 数量选择和添加按钮 -->
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <button
                          @click="decreaseQuantity(drink.id)"
                          :disabled="getDrinkQuantity(drink.id) <= 0"
                          class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                          </svg>
                        </button>
                        <span class="w-8 text-center font-medium">{{ getDrinkQuantity(drink.id) }}</span>
                        <button
                          @click="increaseQuantity(drink.id)"
                          class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                      <button
                        @click="addToCart(drink)"
                        :disabled="getDrinkQuantity(drink.id) <= 0 || (drink.hasTemperature && !getDrinkTemperature(drink.id))"
                        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        {{ t('order.product.addToCart') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 购物车 -->
        <div class="lg:col-span-1">
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
                      @click="updateCartItemQuantity(item, item.quantity - 1)"
                      class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span class="w-6 text-center text-sm">{{ item.quantity }}</span>
                    <button
                      @click="updateCartItemQuantity(item, item.quantity + 1)"
                      class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
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
                <div v-if="totalAmount > currentUser.remainingQuota" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div class="flex">
                    <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                    <div class="ml-3">
                      <p class="text-sm text-red-600">
                        {{ t('order.insufficientBalance', { amount: (totalAmount - currentUser.remainingQuota).toFixed(2) }) }}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  @click="submitOrder"
                  :disabled="cartItems.length === 0 || totalAmount > currentUser.remainingQuota || isSubmitting"
                  class="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {{ isSubmitting ? t('order.submitting') : t('order.submit') }}
                </button>
              </div>
            </div>

            <div v-else class="p-6 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p class="mt-2 text-sm text-gray-500">{{ t('order.emptyCart') }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ t('order.emptyCartTip') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 成功提示模态框 -->
    <div v-if="showSuccessModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div>
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-5">
              <h3 class="text-lg leading-6 font-medium text-gray-900">{{ t('order.orderSuccess') }}</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ t('order.orderNumber', { number: lastOrderId }) }}
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-6">
            <button
              type="button"
              @click="closeSuccessModal"
              class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              {{ t('order.continueOrder') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Drink {
  id: number
  name: string
  price: number
  description: string
  category: string
  image: string
  hasTemperature: boolean
}

interface CartItem extends Drink {
  quantity: number
  temperature?: string
}

interface User {
  username: string
  remainingQuota: number
}

// 用户信息
const currentUser = reactive<User>({
  username: 'user1',
  remainingQuota: 85.50
})

// 状态
const selectedCategory = ref('全部')
const isSubmitting = ref(false)
const showSuccessModal = ref(false)
const lastOrderId = ref('')

// 饮品数据
const drinks = computed<Drink[]>(() => [
  {
    id: 1,
    name: t('order.drinks.americano.name'),
    price: 25.00,
    description: t('order.drinks.americano.desc'),
    category: t('order.categories.coffee'),
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300',
    hasTemperature: true
  },
  {
    id: 2,
    name: t('order.drinks.latte.name'),
    price: 32.00,
    description: t('order.drinks.latte.desc'),
    category: t('order.categories.coffee'),
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300',
    hasTemperature: true
  },
  {
    id: 3,
    name: t('order.drinks.cappuccino.name'),
    price: 30.00,
    description: t('order.drinks.cappuccino.desc'),
    category: t('order.categories.coffee'),
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300',
    hasTemperature: true
  },
  {
    id: 4,
    name: t('order.drinks.matchaLatte.name'),
    price: 35.00,
    description: t('order.drinks.matchaLatte.desc'),
    category: t('order.categories.tea'),
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=300',
    hasTemperature: true
  },
  {
    id: 5,
    name: t('order.drinks.honeyLemonTea.name'),
    price: 28.00,
    description: t('order.drinks.honeyLemonTea.desc'),
    category: t('order.categories.tea'),
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300',
    hasTemperature: false
  },
  {
    id: 6,
    name: t('order.drinks.mangoJuice.name'),
    price: 22.00,
    description: t('order.drinks.mangoJuice.desc'),
    category: t('order.categories.juice'),
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=300',
    hasTemperature: false
  }
])

// 分类
const categories = computed(() => {
  const cats = ['全部', ...new Set(drinks.value.map(d => d.category))]
  return cats
})

// 过滤后的饮品
const filteredDrinks = computed(() => {
  if (selectedCategory.value === '全部') {
    return drinks.value
  }
  return drinks.value.filter(d => d.category === selectedCategory.value)
})

// 购物车
const cartItems = ref<CartItem[]>([])

// 饮品数量和温度选择
const drinkQuantities = reactive<Record<number, number>>({})
const drinkTemperatures = reactive<Record<number, string>>({})

const getDrinkQuantity = (drinkId: number) => drinkQuantities[drinkId] || 0
const getDrinkTemperature = (drinkId: number) => drinkTemperatures[drinkId] || ''

const setDrinkTemperature = (drinkId: number, temperature: string) => {
  drinkTemperatures[drinkId] = temperature
}

const increaseQuantity = (drinkId: number) => {
  drinkQuantities[drinkId] = (drinkQuantities[drinkId] || 0) + 1
}

const decreaseQuantity = (drinkId: number) => {
  if (drinkQuantities[drinkId] > 0) {
    drinkQuantities[drinkId]--
  }
}

const addToCart = (drink: Drink) => {
  const quantity = getDrinkQuantity(drink.id)
  const temperature = drink.hasTemperature ? getDrinkTemperature(drink.id) : undefined
  
  if (quantity <= 0) return
  if (drink.hasTemperature && !temperature) return

  const existingItemIndex = cartItems.value.findIndex(
    item => item.id === drink.id && item.temperature === temperature
  )

  if (existingItemIndex >= 0) {
    cartItems.value[existingItemIndex].quantity += quantity
  } else {
    cartItems.value.push({
      ...drink,
      quantity,
      temperature
    })
  }

  // 重置选择
  drinkQuantities[drink.id] = 0
  if (drink.hasTemperature) {
    delete drinkTemperatures[drink.id]
  }
}

const updateCartItemQuantity = (item: CartItem, newQuantity: number) => {
  if (newQuantity <= 0) {
    const index = cartItems.value.indexOf(item)
    cartItems.value.splice(index, 1)
  } else {
    item.quantity = newQuantity
  }
}

// 总金额
const totalAmount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
})

const submitOrder = async () => {
  if (cartItems.value.length === 0 || totalAmount.value > currentUser.remainingQuota) {
    return
  }

  isSubmitting.value = true

  try {
    // TODO: 调用实际的订单提交 API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新用户余额
    currentUser.remainingQuota -= totalAmount.value
    
    // 生成订单号
    lastOrderId.value = Date.now().toString()
    
    // 清空购物车
    cartItems.value = []
    
    // 显示成功提示
    showSuccessModal.value = true
  } catch (error) {
    alert('订单提交失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
}
</script>