<template>
  <div class="relative">
    <select
      v-model="currentLocale"
      @change="changeLocale"
      class="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors cursor-pointer"
    >
      <option v-for="locale in availableLocales" :key="locale" :value="locale">
        {{ t(`language.${locale}`) }}
      </option>
    </select>
    <!-- 下拉箭头图标 -->
    <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
      <ChevronDownIcon class="w-4 h-4 text-gray-400" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { LOCALES, type LocaleType, setLocale } from '@/i18n'

const { t, locale } = useI18n()
const currentLocale = ref(locale.value)
const availableLocales = Object.values(LOCALES)

const changeLocale = () => {
  setLocale(currentLocale.value as LocaleType)
}

onMounted(() => {
  currentLocale.value = locale.value
})
</script>
