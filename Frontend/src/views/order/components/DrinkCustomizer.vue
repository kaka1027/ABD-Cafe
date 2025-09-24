<template>
  <div 
    v-if="show && drink" 
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="customize-title"
    role="dialog"
    aria-modal="true"
  >
    <!-- 背景遮罩 -->
    <div 
      class="fixed inset-0 bg-black opacity-50 transition-opacity" 
      @click="$emit('close')"
    ></div>
    
    <!-- 模态框内容 -->
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div 
        class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        @click.stop
      >
        <!-- 头部 -->
        <div class="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
          <div class="flex items-start">
            <div class="w-16 h-16 flex-shrink-0 mr-4">
              <img 
                :src="drink.image" 
                :alt="drink.name"
                class="w-full h-full object-cover rounded-lg"
              >
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900" id="customize-title">
                {{ t('order.customize.title') }}
              </h3>
              <h4 class="text-xl font-semibold text-gray-800 mt-1">{{ drink.name }}</h4>
              <p class="text-sm text-gray-500 mt-1">{{ drink.description }}</p>
              <p class="text-lg font-medium text-amber-600 mt-2">
                基础价格 ¥{{ drink.price.toFixed(2) }}
              </p>
            </div>
          </div>
        </div>

        <!-- 定制选项 -->
        <div class="bg-white px-6 py-4 max-h-96 overflow-y-auto">
          <div class="space-y-6">
            <!-- 大小选择 -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">{{ t('order.customize.size.title') }}</h4>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="size in sizeOptions"
                  :key="size.key"
                  @click="selectedSize = size.key"
                  class="p-3 text-center border rounded-lg transition-colors"
                  :class="selectedSize === size.key 
                    ? 'border-amber-500 bg-amber-50 text-amber-700' 
                    : 'border-gray-300 hover:border-gray-400'"
                >
                  <div class="font-medium">{{ t(`order.customize.size.${size.key}`) }}</div>
                  <div class="text-sm text-gray-500">
                    {{ size.extraPrice > 0 ? `+¥${size.extraPrice}` : '' }}
                  </div>
                </button>
              </div>
            </div>

            <!-- 温度选择（如果饮品支持） -->
            <div v-if="drink.hasTemperature">
              <h4 class="text-sm font-medium text-gray-900 mb-3">{{ t('order.temperature.title') }}</h4>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="temp in temperatureOptions"
                  :key="temp"
                  @click="selectedTemperature = temp"
                  class="p-3 text-center border rounded-lg transition-colors"
                  :class="selectedTemperature === temp 
                    ? 'border-amber-500 bg-amber-50 text-amber-700' 
                    : 'border-gray-300 hover:border-gray-400'"
                >
                  {{ t(`order.temperature.${temp}`) }}
                </button>
              </div>
            </div>

            <!-- 奶类选择（仅咖啡和茶类） -->
            <div v-if="drink.category === 'coffee' || drink.category === 'tea'">
              <h4 class="text-sm font-medium text-gray-900 mb-3">{{ t('order.customize.milk.title') }}</h4>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="milk in milkOptions"
                  :key="milk.key"
                  @click="selectedMilk = milk.key"
                  class="p-3 text-left border rounded-lg transition-colors"
                  :class="selectedMilk === milk.key 
                    ? 'border-amber-500 bg-amber-50 text-amber-700' 
                    : 'border-gray-300 hover:border-gray-400'"
                >
                  <div class="font-medium">{{ t(`order.customize.milk.${milk.key}`) }}</div>
                  <div class="text-sm text-gray-500">
                    {{ milk.extraPrice > 0 ? `+¥${milk.extraPrice}` : '免费' }}
                  </div>
                </button>
              </div>
            </div>

            <!-- 糖度选择（非果汁类） -->
            <div v-if="drink.category !== 'juice'">
              <h4 class="text-sm font-medium text-gray-900 mb-3">{{ t('order.customize.sugar.title') }}</h4>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="sugar in sugarOptions"
                  :key="sugar"
                  @click="selectedSugar = sugar"
                  class="p-2 text-center border rounded-lg transition-colors"
                  :class="selectedSugar === sugar 
                    ? 'border-amber-500 bg-amber-50 text-amber-700' 
                    : 'border-gray-300 hover:border-gray-400'"
                >
                  {{ t(`order.customize.sugar.${sugar}`) }}
                </button>
              </div>
            </div>

            <!-- 特殊要求 -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">{{ t('order.customize.notes.title') }}</h4>
              <textarea
                v-model="specialNotes"
                rows="3"
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm resize-none"
                :placeholder="t('order.customize.notes.placeholder')"
              ></textarea>
            </div>

            <!-- 数量选择 -->
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium text-gray-900">{{ t('order.customize.quantity') }}</h4>
              <div class="flex items-center space-x-3">
                <button
                  @click="quantity = Math.max(1, quantity - 1)"
                  class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  :disabled="quantity <= 1"
                >
                  <MinusIcon class="w-4 h-4" />
                </button>
                <span class="text-lg font-medium w-8 text-center">{{ quantity }}</span>
                <button
                  @click="quantity = Math.min(10, quantity + 1)"
                  class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  :disabled="quantity >= 10"
                >
                  <PlusIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部 -->
        <div class="bg-gray-50 px-6 py-4">
          <!-- 价格汇总 -->
          <div class="mb-4">
            <div class="flex justify-between text-sm text-gray-600">
              <span>基础价格 ({{ selectedSizeLabel }})</span>
              <span>¥{{ basePrice.toFixed(2) }}</span>
            </div>
            <div v-if="extraFee > 0" class="flex justify-between text-sm text-gray-600">
              <span>{{ t('order.customize.extraFee') }}</span>
              <span>+¥{{ extraFee.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-lg font-semibold text-gray-900 mt-2 pt-2 border-t">
              <span>{{ t('order.customize.totalPrice') }}</span>
              <span class="text-amber-600">¥{{ totalPrice.toFixed(2) }}</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex space-x-3">
            <button
              @click="$emit('close')"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {{ t('order.customize.cancel') }}
            </button>
            <button
              @click="handleAddToCart"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium"
            >
              {{ t('order.customize.addToCart') }}
            </button>
          </div>
        </div>
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

interface DrinkCustomization {
  size?: string
  temperature?: string
  milk?: string
  sugar?: string
  notes?: string
}

interface CustomizedOrder {
  drink: Drink
  quantity: number
  customizations: DrinkCustomization
  finalPrice: number
}

interface Props {
  show: boolean
  drink?: Drink | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  addToCart: [order: CustomizedOrder]
}>()

const { t } = useI18n()

// 选项数据
const sizeOptions = [
  { key: 'small', extraPrice: 0 },
  { key: 'medium', extraPrice: 3 },
  { key: 'large', extraPrice: 6 }
]

const temperatureOptions = ['hot', 'warm', 'cold']

const milkOptions = [
  { key: 'regular', extraPrice: 0 },
  { key: 'oat', extraPrice: 3 },
  { key: 'coconut', extraPrice: 2 },
  { key: 'soy', extraPrice: 2 },
  { key: 'almond', extraPrice: 3 },
  { key: 'none', extraPrice: 0 }
]

const sugarOptions = ['none', 'less', 'normal', 'extra']

// 当前选择
const selectedSize = ref('medium')
const selectedTemperature = ref('hot')
const selectedMilk = ref('regular')
const selectedSugar = ref('normal')
const specialNotes = ref('')
const quantity = ref(1)

// 计算属性
const selectedSizeOption = computed(() => 
  sizeOptions.find(s => s.key === selectedSize.value) || sizeOptions[1]
)

const selectedMilkOption = computed(() => 
  milkOptions.find(m => m.key === selectedMilk.value) || milkOptions[0]
)

const selectedSizeLabel = computed(() => 
  t(`order.customize.size.${selectedSize.value}`)
)

const basePrice = computed(() => {
  if (!props.drink) return 0
  return props.drink.price + selectedSizeOption.value.extraPrice
})

const extraFee = computed(() => {
  return selectedMilkOption.value.extraPrice
})

const totalPrice = computed(() => {
  return (basePrice.value + extraFee.value) * quantity.value
})

// 添加到购物车
const handleAddToCart = () => {
  if (!props.drink) return

  const customizations: DrinkCustomization = {}
  
  // 只添加相关的定制选项
  customizations.size = selectedSize.value
  
  if (props.drink.hasTemperature) {
    customizations.temperature = selectedTemperature.value
  }
  
  if (props.drink.category === 'coffee' || props.drink.category === 'tea') {
    customizations.milk = selectedMilk.value
  }
  
  if (props.drink.category !== 'juice') {
    customizations.sugar = selectedSugar.value
  }
  
  if (specialNotes.value.trim()) {
    customizations.notes = specialNotes.value
  }

  const order: CustomizedOrder = {
    drink: props.drink,
    quantity: quantity.value,
    customizations,
    finalPrice: totalPrice.value
  }

  emit('addToCart', order)
}
</script>