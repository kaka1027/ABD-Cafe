<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
    <div class="max-w-md w-full text-center">
      <!-- 404 图标 -->
      <div class="w-24 h-24 mx-auto mb-8 bg-amber-100 rounded-full flex items-center justify-center">
        <span class="text-3xl">☕</span>
      </div>
      
      <!-- 标题和描述 -->
      <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 class="text-xl font-semibold text-gray-700 mb-2">{{ t('notFound.title') }}</h2>
      <p class="text-gray-500 mb-8">{{ t('notFound.message') }}</p>
      
      <!-- 按钮组 -->
      <div class="space-y-3">
        <button
          @click="goBack"
          class="w-full flex items-center justify-center px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
        >
          <ArrowLeftIcon class="w-5 h-5 mr-2" />
          {{ t('notFound.goBack') }}
        </button>
        
        <router-link
          to="/"
          class="w-full flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <HomeIcon class="w-5 h-5 mr-2" />
          {{ t('notFound.backHome') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { 
  ArrowLeftIcon,
  HomeIcon
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>]]