<template>
  <footer v-if="show" class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <!-- 左侧：版权信息 -->
        <div class="text-center md:text-left">
          <p class="text-sm text-gray-500">
            © {{ currentYear }} ABD Cafe. {{ t('footer.allRightsReserved') }}
          </p>
        </div>

        <!-- 中间：链接 -->
        <div class="flex space-x-6" v-if="showLinks">
          <router-link 
            v-for="link in links" 
            :key="link.path"
            :to="link.path"
            class="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            {{ t(link.label) }}
          </router-link>
        </div>

        <!-- 右侧：额外信息 -->
        <div class="text-center md:text-right">
          <p class="text-xs text-gray-400">
            {{ t('footer.poweredBy') }} Vue.js & TypeScript
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface FooterLink {
  path: string
  label: string
}

interface Props {
  show?: boolean
  showLinks?: boolean
  links?: FooterLink[]
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  showLinks: true,
  links: () => [
    { path: '/order', label: 'nav.order' },
    { path: '/login', label: 'nav.login' }
  ]
})

const { t } = useI18n()

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
/* 基本样式已通过 Tailwind CSS 类处理 */
</style>