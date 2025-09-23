<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <!-- 左侧：Logo和标题 -->
        <div class="flex items-center space-x-4" v-if="showLogo">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">☕</span>
          </div>
          <div v-if="title">
            <h1 class="text-xl font-semibold text-gray-900">{{ title }}</h1>
            <p class="text-sm text-gray-500" v-if="subtitle">{{ subtitle }}</p>
          </div>
        </div>

        <!-- 右侧：用户信息和操作 -->
        <div class="flex items-center space-x-4">
          <!-- 余额信息（仅桌面端显示） -->
          <div class="hidden lg:block" v-if="showUserInfo && userInfo && userInfo.remainingQuota !== undefined">
            <div class="text-right">
              <p class="text-xs text-gray-500">{{ t('order.remainingQuota') }}</p>
              <p class="text-sm font-medium" :class="getQuotaColorClass(userInfo.remainingQuota)">
                ¥{{ userInfo.remainingQuota.toFixed(2) }}
              </p>
            </div>
          </div>

          <!-- 通知图标 -->
          <button 
            v-if="showUserInfo && userInfo"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <BellIcon class="w-5 h-5" />
          </button>

          <!-- 语言切换器 -->
          <LanguageSwitcher />

          <!-- 用户菜单 -->
          <div class="relative" v-if="showUserInfo && userInfo" ref="userMenuRef">
            <!-- 用户头像按钮 -->
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              :class="{ 'bg-gray-100': isUserMenuOpen }"
            >
              <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span class="text-gray-600 font-medium text-sm">
                  {{ userInfo.username.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="hidden sm:block text-left">
                <p class="text-sm font-medium text-gray-900">{{ userInfo.username }}</p>
                <p class="text-xs text-gray-500" v-if="userInfo.role">
                  {{ t(`userManage.role.${userInfo.role}`) }}
                </p>
              </div>
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
                class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <!-- 用户信息头部 -->
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-900">{{ userInfo.username }}</p>
                  <p class="text-xs text-gray-500" v-if="userInfo.role">
                    {{ t(`userManage.role.${userInfo.role}`) }}
                  </p>
                  <!-- 移动端余额显示 -->
                  <p class="text-xs text-gray-500 mt-1 lg:hidden" v-if="userInfo.remainingQuota !== undefined">
                    {{ t('order.remainingQuota') }}: 
                    <span :class="getQuotaColorClass(userInfo.remainingQuota)">
                      ¥{{ userInfo.remainingQuota.toFixed(2) }}
                    </span>
                  </p>
                </div>

                <!-- 菜单选项 -->
                <div class="py-1">
                  <!-- 管理员按钮 -->
                  <router-link
                    v-if="showAdminButton && userInfo.role === 'admin'"
                    to="/admin/users"
                    @click="closeUserMenu"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <CogIcon class="w-4 h-4 mr-3 text-gray-400" />
                    {{ t('admin.userManagement') }}
                  </router-link>

                  <!-- 分隔线 -->
                  <div class="border-t border-gray-100 my-1" v-if="showAdminButton && userInfo.role === 'admin'"></div>

                  <!-- 退出登录 -->
                  <button
                    v-if="showLogoutButton"
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

          <!-- 非用户状态下的退出按钮（备用） -->
          <button
            v-else-if="showLogoutButton && !userInfo"
            @click="handleLogout"
            class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowRightOnRectangleIcon class="w-4 h-4 sm:mr-2" />
            <span class="hidden sm:inline">{{ t('order.logout') }}</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  ArrowRightOnRectangleIcon, 
  BellIcon, 
  CogIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'
import LanguageSwitcher from './LanguageSwitcher.vue'

interface UserInfo {
  username: string
  role?: string
  remainingQuota?: number
}

interface Props {
  // 显示控制
  showLogo?: boolean
  showUserInfo?: boolean
  showAdminButton?: boolean
  showLogoutButton?: boolean

  // 数据
  title?: string
  subtitle?: string
  userInfo?: UserInfo | null
}

const props = withDefaults(defineProps<Props>(), {
  showLogo: true,
  showUserInfo: true,
  showAdminButton: true,
  showLogoutButton: true,
  title: undefined,
  subtitle: undefined,
  userInfo: null
})

const emit = defineEmits<{
  logout: []
}>()

const { t } = useI18n()

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

// 点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    closeUserMenu()
  }
}

// 销毁时清理事件监听器
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const getQuotaColorClass = (quota: number) => {
  if (quota > 50) return 'text-green-600'
  if (quota > 20) return 'text-yellow-600'
  return 'text-red-600'
}

const handleLogout = () => {
  closeUserMenu()
  emit('logout')
}
</script>

<style scoped>
/* 基本样式已通过 Tailwind CSS 类处理 */
</style>
