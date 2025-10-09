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
            <div class="w-24 h-24 mx-auto mb-8 bg-white opacity-80 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span class="text-4xl">☕</span>
            </div>
            <h1 class="text-4xl font-bold mb-4">{{ t('welcome') }}</h1>
            <p class="text-xl opacity-90">{{ t('cafe.orderingSystem') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧：登录/注册表单 -->
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <div class="flex items-center space-x-3 mb-8">
            <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-white text-2xl">☕</span>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">ABD Cafe</h2>
              <p class="text-sm text-gray-500">{{ t('cafe.smartSystem') }}</p>
            </div>
          </div>

          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            {{ isRegisterMode ? t('register.title') : t('login.subtitle') }}
          </h3>
          <p class="text-sm text-gray-600 mb-8">
            {{ isRegisterMode ? t('register.subtitle') : t('login.subtitle') }}
          </p>
        </div>

        <div>
          <!-- 登录表单 -->
          <form v-if="!isRegisterMode" class="space-y-6" @submit.prevent="handleLogin">
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
          </form>

          <!-- 注册表单 -->
          <form v-else class="space-y-6" @submit.prevent="handleRegister">
            <!-- 用户名 -->
            <div>
              <label for="reg-username" class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('register.username') }}
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="reg-username"
                  name="reg-username"
                  type="text"
                  required
                  v-model="registerForm.username"
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  :placeholder="t('register.usernamePlaceholder')"
                />
              </div>
            </div>

            <!-- 邮箱 -->
            <div>
              <label for="reg-email" class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('register.email') }}
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="reg-email"
                  name="reg-email"
                  type="email"
                  required
                  v-model="registerForm.email"
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  :placeholder="t('register.emailPlaceholder')"
                />
              </div>
            </div>

            <!-- 密码设置选项 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('register.passwordOption') }}
              </label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="passwordOption"
                    value="custom"
                    class="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ t('register.passwordCustom') }}</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="passwordOption"
                    value="email"
                    class="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ t('register.passwordUseEmail') }}</span>
                </label>
              </div>
            </div>

            <!-- 自定义密码输入框 -->
            <div v-if="passwordOption === 'custom'">
              <label for="reg-password" class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('register.password') }}
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="reg-password"
                  name="reg-password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  v-model="registerForm.password"
                  class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  :placeholder="t('register.passwordPlaceholder')"
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

            <!-- 确认密码 -->
            <div v-if="passwordOption === 'custom'">
              <label for="reg-password-confirm" class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('register.passwordConfirm') }}
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="reg-password-confirm"
                  name="reg-password-confirm"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  v-model="registerForm.passwordConfirm"
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  :placeholder="t('register.passwordConfirmPlaceholder')"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                :disabled="isLoading"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <UserIcon v-if="!isLoading" class="h-5 w-5 text-amber-200" />
                  <ArrowPathIcon v-else class="animate-spin h-5 w-5 text-amber-200" />
                </span>
                {{ isLoading ? t('register.registering') : t('register.registerButton') }}
              </button>
            </div>
          </form>

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

          <!-- 成功提示 -->
          <div v-if="successMessage" class="mt-3">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-green-600">{{ successMessage }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 切换登录/注册 -->
          <div class="mt-6 text-center">
            <button
              type="button"
              @click="toggleMode"
              class="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              {{ isRegisterMode ? t('register.switchToLogin') : t('register.switchToRegister') }}
            </button>
          </div>

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
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { API_ENDPOINTS } from '@/config/api'
import {
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightOnRectangleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  EnvelopeIcon
} from '@heroicons/vue/24/outline'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)
const isRegisterMode = ref(false)
const passwordOption = ref('custom') // 'custom' 或 'email'

const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

// 监听密码选项变化
watch(passwordOption, (newValue) => {
  if (newValue === 'email') {
    // 使用邮箱作为密码时，清空密码字段
    registerForm.password = ''
    registerForm.passwordConfirm = ''
  }
})

// 切换登录/注册模式
const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value
  errorMessage.value = ''
  successMessage.value = ''
  showPassword.value = false

  // 清空表单
  if (isRegisterMode.value) {
    loginForm.username = ''
    loginForm.password = ''
    loginForm.rememberMe = false
  } else {
    registerForm.username = ''
    registerForm.email = ''
    registerForm.password = ''
    registerForm.passwordConfirm = ''
    passwordOption.value = 'custom'
  }
}

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
    const response = await fetch(API_ENDPOINTS.auth.login, {
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
    console.error(t('login.loginFailed') + ':', error)
    errorMessage.value = t('login.errorFailed')
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  // 前端验证
  if (!registerForm.username || !registerForm.email) {
    errorMessage.value = t('register.errorFillRequired')
    return
  }

  // 确定最终使用的密码
  let finalPassword = ''
  if (passwordOption.value === 'email') {
    finalPassword = registerForm.email
  } else {
    if (!registerForm.password) {
      errorMessage.value = t('register.errorPasswordRequired')
      return
    }
    if (registerForm.password !== registerForm.passwordConfirm) {
      errorMessage.value = t('register.errorPasswordMismatch')
      return
    }
    finalPassword = registerForm.password
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // 调用注册 API
    const response = await fetch(API_ENDPOINTS.auth.register, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: registerForm.username,
        email: registerForm.email,
        password: finalPassword,
      }),
    })

    const result = await response.json()

    if (response.ok && result.success) {
      // 注册成功
      successMessage.value = t('register.successMessage')

      // 等待 1.5 秒后自动登录
      setTimeout(async () => {
        // 自动登录
        const loginResponse = await fetch(API_ENDPOINTS.auth.login, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: registerForm.username,
            password: finalPassword,
          }),
        })

        const loginResult = await loginResponse.json()

        if (loginResponse.ok && loginResult.success) {
          const { user, token } = loginResult.data
          userStore.login(user, token)
          router.push('/order')
        } else {
          // 登录失败，切换到登录模式
          successMessage.value = t('register.successMessageManual')
          setTimeout(() => {
            toggleMode()
          }, 1500)
        }
      }, 1500)
    } else {
      errorMessage.value = result.message || t('register.errorFailed')
    }
  } catch (error) {
    console.error('注册失败:', error)
    errorMessage.value = t('register.errorNetwork')
  } finally {
    isLoading.value = false
  }
}
</script>
