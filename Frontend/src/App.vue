<template>
  <div class="min-h-screen flex flex-col">
    <!-- 统一Header管理 -->
    <AppHeader
      v-if="headerConfig.show"
      :show-logo="headerConfig.showLogo"
      :show-user-info="headerConfig.showUserInfo"
      :show-admin-button="headerConfig.showAdminButton"
      :show-logout-button="headerConfig.showLogoutButton"
      :title="headerConfig.title"
      :subtitle="headerConfig.subtitle"
      :user-info="headerConfig.userInfo"
      @logout="handleLogout"
    />

    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Footer只在非登录页显示 -->
    <AppFooter :show="headerConfig.show" />
  </div>
</template>

<style scoped>
/* 样式已通过 Tailwind CSS 处理 */
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 根据路由和用户状态计算Header配置
const headerConfig = computed(() => {
  const path = route.path
  const user = userStore.user

  // 登录页面不显示Header
  if (path === '/login') {
    return { show: false }
  }

  // 点餐页面 - 完整Header
  if (path === '/order') {
    return {
      show: true,
      showLogo: true,
      showUserInfo: true,
      showAdminButton: true,
      showLogoutButton: true,
      title: t('order.title'),
      subtitle: t('order.menuDesc'),
      userInfo: user ? {
        username: user.username,
        role: user.role,
        remainingQuota: 85.50 // TODO: 从后端获取真实余额
      } : null
    }
  }

  // 管理页面 - 不显示AppHeader（AdminLayout有自己的header）
  if (path.startsWith('/admin')) {
    return { show: false }
  }

  // 其他页面 - 基础Header（只有语言切换）
  return {
    show: true,
    showLogo: false,
    showUserInfo: false,
    showAdminButton: false,
    showLogoutButton: false,
    title: undefined,
    userInfo: null
  }
})

// 处理退出登录
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>
