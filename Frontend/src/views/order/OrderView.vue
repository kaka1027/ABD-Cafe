<template>
  <div class="bg-gray-50 min-h-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 饮品菜单 -->
        <div class="lg:col-span-2">
          <DrinkMenu
            :drinks="filteredDrinks"
            :categories="categories"
            :selected-category="selectedCategory"
            @category-change="selectedCategory = $event"
            @add-to-cart="handleAddToCart"
          />
        </div>

        <!-- 购物车 -->
        <div class="lg:col-span-1">
          <ShoppingCart
            :cart-items="cartItems"
            :total-amount="totalAmount"
            :user-quota="userQuota"
            :is-submitting="isSubmitting"
            :has-user="!!userStore.user"
            @update-quantity="updateCartItemQuantity"
            @submit-order="submitOrder"
          />
        </div>
      </div>
    </div>

    <!-- 成功提示模态框 -->
    <OrderSuccess
      :show="showSuccessModal"
      :order-id="lastOrderId"
      @close="closeSuccessModal"
    />

    <!-- 饮品定制模态框 -->
    <DrinkCustomizer
      :show="showCustomizerModal"
      :drink="selectedDrinkForCustomization"
      @close="closeCustomizerModal"
      @add-to-cart="handleCustomizedAddToCart"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'

// 组件导入
import DrinkMenu from './components/DrinkMenu.vue'
import ShoppingCart from './components/ShoppingCart.vue'
import OrderSuccess from './components/OrderSuccess.vue'
import DrinkCustomizer from './components/DrinkCustomizer.vue'

const { t } = useI18n()
const userStore = useUserStore()

// 类型定义
interface Drink {
  id: number
  name: string
  price: number
  description: string
  category: string
  image: string
  hasTemperature: boolean
}

interface DrinkCustomization {
  size?: string
  temperature?: string
  milk?: string
  sugar?: string
  notes?: string
}

interface CartItem extends Drink {
  quantity: number
  customizations: DrinkCustomization
  finalPrice: number // 定制后的最终价格
}

// 用户余额
const userQuota = computed(() => {
  return userStore.user ? 85.50 : 0 // TODO: 从后端获取真实的余额数据
})

// 状态
const selectedCategory = ref('all')
const isSubmitting = ref(false)
const showSuccessModal = ref(false)
const lastOrderId = ref('')

// 定制模态框状态
const showCustomizerModal = ref(false)
const selectedDrinkForCustomization = ref<Drink | null>(null)

// 购物车
const cartItems = ref<CartItem[]>([])

// 饮品数据
const drinks = computed<Drink[]>(() => [
  {
    id: 1,
    name: t('order.drinks.americano.name'),
    price: 25.00,
    description: t('order.drinks.americano.desc'),
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300',
    hasTemperature: true
  },
  {
    id: 2,
    name: t('order.drinks.latte.name'),
    price: 32.00,
    description: t('order.drinks.latte.desc'),
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300',
    hasTemperature: true
  },
  {
    id: 3,
    name: t('order.drinks.cappuccino.name'),
    price: 30.00,
    description: t('order.drinks.cappuccino.desc'),
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300',
    hasTemperature: true
  },
  {
    id: 4,
    name: t('order.drinks.matchaLatte.name'),
    price: 35.00,
    description: t('order.drinks.matchaLatte.desc'),
    category: 'tea',
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=300',
    hasTemperature: true
  },
  {
    id: 5,
    name: t('order.drinks.honeyLemonTea.name'),
    price: 28.00,
    description: t('order.drinks.honeyLemonTea.desc'),
    category: 'tea',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300',
    hasTemperature: false
  },
  {
    id: 6,
    name: t('order.drinks.mangoJuice.name'),
    price: 22.00,
    description: t('order.drinks.mangoJuice.desc'),
    category: 'juice',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=300',
    hasTemperature: false
  }
])

// 分类
const categories = computed(() => {
  const cats = ['all', ...new Set(drinks.value.map(d => d.category))]
  return cats
})

// 过滤后的饮品
const filteredDrinks = computed(() => {
  if (selectedCategory.value === 'all') {
    return drinks.value
  }
  return drinks.value.filter(d => d.category === selectedCategory.value)
})

// 购物车总金额
const totalAmount = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.finalPrice * item.quantity), 0)
})

// 打开定制模态框
const handleAddToCart = (item: { drink: Drink; quantity: number }) => {
  selectedDrinkForCustomization.value = item.drink
  showCustomizerModal.value = true
}

// 从定制模态框添加到购物车
const handleCustomizedAddToCart = (order: { drink: Drink; quantity: number; customizations: DrinkCustomization; finalPrice: number }) => {
  const { drink, quantity, customizations, finalPrice } = order
  
  // 查找是否已存在相同定制选项的项目
  const existingIndex = cartItems.value.findIndex(cartItem => 
    cartItem.id === drink.id && 
    JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
  )
  
  if (existingIndex > -1) {
    // 如果存在，增加数量
    cartItems.value[existingIndex].quantity += quantity
  } else {
    // 如果不存在，添加新项目
    cartItems.value.push({
      ...drink,
      quantity,
      customizations,
      finalPrice: finalPrice / quantity // 单价
    })
  }
  
  // 关闭模态框
  showCustomizerModal.value = false
  selectedDrinkForCustomization.value = null
}

// 更新购物车商品数量
const updateCartItemQuantity = (item: CartItem, newQuantity: number) => {
  if (newQuantity <= 0) {
    // 移除商品
    const index = cartItems.value.findIndex(cartItem => 
      cartItem.id === item.id && 
      JSON.stringify(cartItem.customizations) === JSON.stringify(item.customizations)
    )
    if (index > -1) {
      cartItems.value.splice(index, 1)
    }
  } else {
    // 更新数量
    const cartItem = cartItems.value.find(cartItem => 
      cartItem.id === item.id && 
      JSON.stringify(cartItem.customizations) === JSON.stringify(item.customizations)
    )
    if (cartItem) {
      cartItem.quantity = newQuantity
    }
  }
}

// 提交订单
const submitOrder = async () => {
  if (!userStore.user || cartItems.value.length === 0 || totalAmount.value > userQuota.value) {
    return
  }

  isSubmitting.value = true

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 生成订单号
    lastOrderId.value = Date.now().toString()

    // 清空购物车
    cartItems.value = []

    // 显示成功提示
    showSuccessModal.value = true
  } catch {
    alert(t('error.orderSubmitFailed'))
  } finally {
    isSubmitting.value = false
  }
}

// 关闭成功模态框
const closeSuccessModal = () => {
  showSuccessModal.value = false
}

// 关闭定制模态框
const closeCustomizerModal = () => {
  showCustomizerModal.value = false
  selectedDrinkForCustomization.value = null
}
</script>

<style scoped>
/* 基本样式已通过 Tailwind CSS 类处理 */
</style>