<template>
  <div class="min-h-screen flex">
    <!-- 左侧：背景图片区域 -->
    <div class="hidden lg:block relative w-0 flex-1">
      <div class="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600">
        <!-- 咖啡豆装饰 -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-20 left-20 w-8 h-8 bg-white rounded-full transform rotate-12"></div>
          <div class="absolute top-40 left-32 w-6 h-6 bg-white rounded-full transform -rotate-12"></div>
          <div class="absolute top-60 left-16 w-4 h-4 bg-white rounded-full"></div>
          <div class="absolute bottom-40 left-24 w-6 h-6 bg-white rounded-full transform rotate-45"></div>
          <div class="absolute bottom-32 right-32 w-8 h-8 bg-white rounded-full transform -rotate-12"></div>
          <div class="absolute top-32 right-20 w-4 h-4 bg-white rounded-full"></div>
        </div>

        <!-- 主要内容 -->
        <div class="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
          <div class="text-center">
            <div class="w-24 h-24 mx-auto mb-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span class="text-4xl">☕</span>
            </div>
            <h1 class="text-4xl font-bold mb-4">{{ t('welcome') }}</h1>
            <p class="text-xl opacity-90">咖啡厅点餐系统</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧：登录表单 -->
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <div class="flex items-center space-x-3 mb-8">
            <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-white text-2xl">☕</span>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">ABD Cafe</h2>
              <p class="text-sm text-gray-500">智能点餐系统</p>
            </div>
          </div>

          <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ t('login.subtitle') }}</h3>
          <p class="text-sm text-gray-600 mb-8">请登录您的账户</p>
        </div>

        <div>
          <form class="space-y-6" @submit.prevent="handleLogin">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('login.username') }}
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  v-model="loginForm.username"
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  :placeholder="t('login.username')"
                />
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('login.password') }}
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  v-model="loginForm.password"
                  class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  :placeholder="t('login.password')"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                    <EyeSlashIcon v-else class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  v-model="loginForm.rememberMe"
                  class="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                  {{ t('login.rememberMe') }}
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                :disabled="isLoading"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <ArrowRightOnRectangleIcon v-if="!isLoading" class="h-5 w-5 text-amber-200" />
                  <ArrowPathIcon v-else class="animate-spin h-5 w-5 text-amber-200" />
                </span>
                {{ isLoading ? t('login.loggingIn') : t('login.loginButton') }}
              </button>
            </div>

            <!-- 错误提示 -->
            <div v-if="errorMessage" class="mt-3">
              <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <ExclamationCircleIcon class="h-5 w-5 text-red-400" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-red-600">{{ errorMessage }}</p>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <!-- 语言切换器 -->
          <div class="mt-8 flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import {
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightOnRectangleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()

const isLoading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
})

onMounted(() => {
  // 初始化用户状态
  userStore.initializeAuth()

  // 如果已经登录，直接跳转到点单页面
  if (userStore.isLoggedIn) {
    router.push('/order')
  }
})

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    errorMessage.value = t('login.errorRequired')
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // 调用真实的登录 API
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: loginForm.username,
        password: loginForm.password,
      }),
    })

    const result = await response.json()

    if (response.ok && result.success) {
      // 登录成功，保存用户信息和token
      const { user, token } = result.data
      userStore.login(user, token)

      // 跳转到点单页面
      router.push('/order')
    } else {
      errorMessage.value = result.message || t('login.errorFailed')
    }
  } catch (error) {
    console.error('登录失败:', error)
    errorMessage.value = t('login.errorFailed')
  } finally {
    isLoading.value = false
  }
}
</script>
