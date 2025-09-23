<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">{{ t('settings.title') }}</h1>
        <p class="mt-1 text-gray-600">{{ t('settings.description') }}</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="exportSettings"
          class="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
          {{ t('settings.actions.export') }}
        </button>
        <button
          @click="saveSettings"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <CheckIcon class="w-5 h-5 mr-2" />
          {{ t('settings.actions.save') }}
        </button>
      </div>
    </div>

    <!-- 设置导航 -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6" aria-label="设置导航">
          <button
            v-for="section in sections"
            :key="section.key"
            @click="activeSection = section.key"
            class="py-4 text-sm font-medium border-b-2 transition-colors"
            :class="activeSection === section.key 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            <component :is="section.icon" class="w-5 h-5 inline mr-2" />
            {{ t(`settings.sections.${section.key}`) }}
          </button>
        </nav>
      </div>

      <!-- 设置内容 -->
      <div class="p-6">
        <!-- 基本设置 -->
        <div v-if="activeSection === 'general'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('settings.general.siteName') }}
              </label>
              <input
                v-model="settings.general.siteName"
                type="text"
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('settings.general.language') }}
              </label>
              <select
                v-model="settings.general.language"
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('settings.general.timezone') }}
              </label>
              <select
                v-model="settings.general.timezone"
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Asia/Shanghai">Asia/Shanghai (GMT+8)</option>
                <option value="America/New_York">America/New_York (GMT-5)</option>
                <option value="Europe/London">Europe/London (GMT+0)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('settings.general.currency') }}
              </label>
              <select
                v-model="settings.general.currency"
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="CNY">人民币 (CNY)</option>
                <option value="USD">美元 (USD)</option>
                <option value="EUR">欧元 (EUR)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('settings.general.siteDescription') }}
            </label>
            <textarea
              v-model="settings.general.siteDescription"
              rows="3"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
        </div>

        <!-- 通知设置 -->
        <div v-if="activeSection === 'notifications'" class="space-y-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">{{ t('settings.notifications.emailNotifications') }}</h4>
                <p class="text-sm text-gray-500">接收重要系统通知邮件</p>
              </div>
              <input
                v-model="settings.notifications.emailNotifications"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">{{ t('settings.notifications.newOrderAlert') }}</h4>
                <p class="text-sm text-gray-500">新订单时发送通知</p>
              </div>
              <input
                v-model="settings.notifications.newOrderAlert"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">{{ t('settings.notifications.lowStockAlert') }}</h4>
                <p class="text-sm text-gray-500">库存不足时发送提醒</p>
              </div>
              <input
                v-model="settings.notifications.lowStockAlert"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">{{ t('settings.notifications.dailyReport') }}</h4>
                <p class="text-sm text-gray-500">每日销售报告</p>
              </div>
              <input
                v-model="settings.notifications.dailyReport"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">{{ t('settings.notifications.weeklyReport') }}</h4>
                <p class="text-sm text-gray-500">每周业务分析报告</p>
              </div>
              <input
                v-model="settings.notifications.weeklyReport"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        <!-- 安全设置 -->
        <div v-if="activeSection === 'security'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('settings.security.minPasswordLength') }}
              </label>
              <input
                v-model.number="settings.security.minPasswordLength"
                type="number"
                min="6"
                max="20"
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('settings.security.sessionTimeout') }}
              </label>
              <select
                v-model="settings.security.sessionTimeout"
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="30">30 分钟</option>
                <option value="60">1 小时</option>
                <option value="120">2 小时</option>
                <option value="480">8 小时</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('settings.security.loginAttempts') }}
              </label>
              <input
                v-model.number="settings.security.loginAttempts"
                type="number"
                min="3"
                max="10"
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="text-lg font-medium text-gray-900">{{ t('settings.security.passwordPolicy') }}</h4>
            
            <div class="flex items-center justify-between">
              <div>
                <h5 class="text-sm font-medium text-gray-900">{{ t('settings.security.requireUppercase') }}</h5>
                <p class="text-sm text-gray-500">密码必须包含大写字母</p>
              </div>
              <input
                v-model="settings.security.requireUppercase"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h5 class="text-sm font-medium text-gray-900">{{ t('settings.security.requireNumbers') }}</h5>
                <p class="text-sm text-gray-500">密码必须包含数字</p>
              </div>
              <input
                v-model="settings.security.requireNumbers"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h5 class="text-sm font-medium text-gray-900">{{ t('settings.security.requireSymbols') }}</h5>
                <p class="text-sm text-gray-500">密码必须包含特殊字符</p>
              </div>
              <input
                v-model="settings.security.requireSymbols"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        <!-- 咖啡厅设置 -->
        <div v-if="activeSection === 'cafe'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('settings.cafe.cafeName') }}
              </label>
              <input
                v-model="settings.cafe.cafeName"
                type="text"
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('settings.cafe.phone') }}
              </label>
              <input
                v-model="settings.cafe.phone"
                type="tel"
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('settings.cafe.email') }}
              </label>
              <input
                v-model="settings.cafe.email"
                type="email"
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('settings.cafe.openingHours') }}
              </label>
              <input
                v-model="settings.cafe.openingHours"
                type="text"
                placeholder="09:00 - 21:00"
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('settings.cafe.address') }}
            </label>
            <textarea
              v-model="settings.cafe.address"
              rows="3"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('settings.cafe.description') }}
            </label>
            <textarea
              v-model="settings.cafe.description"
              rows="4"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
        </div>

        <!-- 高级设置 -->
        <div v-if="activeSection === 'advanced'" class="space-y-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">{{ t('settings.advanced.maintenanceMode') }}</h4>
                <p class="text-sm text-gray-500">启用维护模式将暂停所有用户操作</p>
              </div>
              <input
                v-model="settings.advanced.maintenanceMode"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">{{ t('settings.advanced.debugMode') }}</h4>
                <p class="text-sm text-gray-500">启用调试模式显示详细错误信息</p>
              </div>
              <input
                v-model="settings.advanced.debugMode"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
          </div>

          <!-- 危险操作区 -->
          <div class="border-t border-gray-200 pt-6">
            <h4 class="text-lg font-medium text-red-600 mb-4">危险操作</h4>
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex justify-between items-center">
                <div>
                  <h5 class="text-sm font-medium text-red-800">重置所有设置</h5>
                  <p class="text-sm text-red-600">将所有设置恢复为默认值，此操作不可逆</p>
                </div>
                <button
                  @click="resetSettings"
                  class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  {{ t('settings.actions.reset') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  WrenchScrewdriverIcon,
  DocumentArrowDownIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

const { t } = useI18n()

const activeSection = ref('general')

const sections = [
  { key: 'general', icon: CogIcon },
  { key: 'notifications', icon: BellIcon },
  { key: 'security', icon: ShieldCheckIcon },
  { key: 'cafe', icon: BuildingStorefrontIcon },
  { key: 'advanced', icon: WrenchScrewdriverIcon }
]

const settings = reactive({
  general: {
    siteName: 'ABD Cafe',
    siteDescription: '智能咖啡厅点餐系统',
    language: 'zh',
    timezone: 'Asia/Shanghai',
    currency: 'CNY'
  },
  notifications: {
    emailNotifications: true,
    newOrderAlert: true,
    lowStockAlert: true,
    dailyReport: false,
    weeklyReport: true
  },
  security: {
    minPasswordLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: false,
    sessionTimeout: 120,
    loginAttempts: 5
  },
  cafe: {
    cafeName: 'ABD Cafe',
    address: '上海市浦东新区张江高科技园区',
    phone: '+86 21 1234 5678',
    email: 'info@abdcafe.com',
    openingHours: '08:00 - 22:00',
    description: '一家现代化的智能咖啡厅，提供优质的咖啡和便捷的点餐体验。'
  },
  advanced: {
    maintenanceMode: false,
    debugMode: false
  }
})

const saveSettings = () => {
  // 保存设置到后端
  console.log('保存设置:', settings)
  alert('设置已保存')
}

const exportSettings = () => {
  // 导出设置
  const dataStr = JSON.stringify(settings, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'cafe-settings.json'
  link.click()
  URL.revokeObjectURL(url)
}

const resetSettings = () => {
  if (confirm('确定要重置所有设置吗？此操作不可撤销。')) {
    // 重置设置为默认值
    Object.assign(settings, {
      general: {
        siteName: 'ABD Cafe',
        siteDescription: '智能咖啡厅点餐系统',
        language: 'zh',
        timezone: 'Asia/Shanghai',
        currency: 'CNY'
      },
      notifications: {
        emailNotifications: true,
        newOrderAlert: true,
        lowStockAlert: true,
        dailyReport: false,
        weeklyReport: true
      },
      security: {
        minPasswordLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSymbols: false,
        sessionTimeout: 120,
        loginAttempts: 5
      },
      cafe: {
        cafeName: 'ABD Cafe',
        address: '',
        phone: '',
        email: '',
        openingHours: '08:00 - 22:00',
        description: ''
      },
      advanced: {
        maintenanceMode: false,
        debugMode: false
      }
    })
    alert('设置已重置为默认值')
  }
}
</script>