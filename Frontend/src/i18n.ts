import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'

export const LOCALES = {
  en: 'en',
  zh: 'zh'
} as const

export type LocaleType = keyof typeof LOCALES

// 获取浏览器语言设置
const getBrowserLocale = (): LocaleType => {
  const browserLang = navigator.language.toLowerCase()
  return browserLang.startsWith('zh') ? 'zh' : 'en'
}

// 从 localStorage 获取已保存的语言设置，如果没有则使用浏览器语言
const getSavedLocale = (): LocaleType => {
  const savedLocale = localStorage.getItem('locale') as LocaleType
  return savedLocale || getBrowserLocale()
}

export const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getSavedLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
})

// 切换语言的函数
export const setLocale = (locale: LocaleType) => {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.querySelector('html')?.setAttribute('lang', locale)
}