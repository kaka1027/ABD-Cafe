<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">☕</span>
            </div>
            <div>
              <h1 class="text-xl font-semibold text-gray-900">{{ t('admin.title') }}</h1>
              <p class="text-sm text-gray-500">{{ t('admin.subtitle') }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <!-- 通知图标 -->
            <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <BellIcon class="w-5 h-5" />
            </button>
            
            <!-- 语言切换器 -->
            <LanguageSwitcher />
            
            <!-- 用户菜单 -->
            <div class="relative" ref="userMenuRef">
              <button
                @click="toggleUserMenu"
                class="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                :class="{ 'bg-gray-100': isUserMenuOpen }"
              >
                <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span class="text-gray-600 font-medium text-sm">
                    {{ userStore.user?.username?.charAt(0).toUpperCase() || 'A' }}
                  </span>
                </div>
                <span class="hidden sm:block text-sm font-medium text-gray-700">
                  {{ userStore.user?.username || 'Admin' }}
                </span>
                <ChevronDownIcon 
                  class="w-4 h-4 text-gray-400 transition-transform duration-200"
                  :class="{ 'rotate-180': isUserMenuOpen }"
                />
              </button>

              <!-- 下拉菜单 -->
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-show="isUserMenuOpen"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <!-- 用户信息头部 -->
                  <div class="px-4 py-3 border-b border-gray-100">
                    <p class="text-sm font-medium text-gray-900">{{ userStore.user?.username || 'Admin' }}</p>
                    <p class="text-xs text-gray-500">{{ t(`userManage.role.${userStore.user?.role || 'admin'}`) }}</p>
                  </div>

                  <!-- 菜单选项 -->
                  <div class="py-1">
                    <!-- 返回点餐页面 -->
                    <router-link
                      to="/order"
                      @click="closeUserMenu"
                      class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <ArrowLeftIcon class="w-4 h-4 mr-3 text-gray-400" />
                      {{ t('order.backToOrder') }}
                    </router-link>

                    <!-- 分隔线 -->
                    <div class="border-t border-gray-100 my-1"></div>

                    <!-- 退出登录 -->
                    <button
                      @click="handleLogout"
                      class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon class="w-4 h-4 mr-3 text-gray-400" />
                      {{ t('order.logout') }}
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- 移动端菜单按钮 -->
      <div class="lg:hidden fixed top-4 left-4 z-50">
        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="p-2 bg-white rounded-lg shadow-md text-gray-600 hover:text-gray-900"
        >
          <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6" />
          <XMarkIcon v-else class="w-6 h-6" />
        </button>
      </div>

      <!-- 侧边栏 -->
      <aside class="w-64 bg-white shadow-sm border-r border-gray-200 min-h-[calc(100vh-73px)] transition-all duration-300" 
             :class="{
               'hidden lg:block': !mobileMenuOpen,
               'fixed inset-y-0 left-0 z-40 lg:relative lg:inset-auto': mobileMenuOpen
             }">
        <!-- 移动端遮罩 -->
        <div v-if="mobileMenuOpen" 
             @click="mobileMenuOpen = false"
             class="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"></div>
        
        <nav class="p-6 relative z-40 bg-white h-full">
          <div class="space-y-2">
            <router-link 
              to="/admin/users" 
              @click="mobileMenuOpen = false"
              class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              :class="{
                'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600': $route.path === '/admin/users'
              }"
            >
              <UsersIcon class="w-5 h-5 mr-3" />
              <span class="font-medium">{{ t('admin.userManagement') }}</span>
            </router-link>
            
            <router-link 
              to="/admin/orders" 
              @click="mobileMenuOpen = false"
              class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              :class="{
                'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600': $route.path === '/admin/orders'
              }"
            >
              <ShoppingBagIcon class="w-5 h-5 mr-3" />
              <span class="font-medium">{{ t('admin.orderManagement') }}</span>
            </router-link>
            
            <router-link 
              to="/admin/products" 
              @click="mobileMenuOpen = false"
              class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              :class="{
                'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600': $route.path === '/admin/products'
              }"
            >
              <CubeIcon class="w-5 h-5 mr-3" />
              <span class="font-medium">{{ t('admin.productManagement') }}</span>
            </router-link>
            
            <router-link 
              to="/admin/analytics" 
              @click="mobileMenuOpen = false"
              class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              :class="{
                'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600': $route.path === '/admin/analytics'
              }"
            >
              <ChartBarIcon class="w-5 h-5 mr-3" />
              <span class="font-medium">{{ t('admin.analytics') }}</span>
            </router-link>
          </div>
          
          <!-- 分隔线 -->
          <div class="my-6 border-t border-gray-200"></div>
          
          <!-- 设置菜单 -->
          <div class="space-y-2">
            <router-link 
              to="/admin/settings" 
              @click="mobileMenuOpen = false"
              class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              :class="{
                'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600': $route.path === '/admin/settings'
              }"
            >
              <CogIcon class="w-5 h-5 mr-3" />
              <span class="font-medium">{{ t('admin.settings') }}</span>
            </router-link>
          </div>
        </nav>
      </aside>

      <!-- 主内容区域 -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { 
  UsersIcon, 
  ShoppingBagIcon, 
  CubeIcon, 
  ChartBarIcon, 
  CogIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const mobileMenuOpen = ref(false)

// 用户菜单状态
const isUserMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

// 切换用户菜单
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

// 关闭用户菜单
const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

// 处理退出登录
const handleLogout = () => {
  closeUserMenu()
  userStore.logout()
  router.push('/login')
}

// 点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    closeUserMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f3f4f6;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>]]