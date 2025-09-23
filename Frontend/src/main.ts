import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { i18n, setLocale } from './i18n'
import { useUserStore } from './stores/user'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

// 设置初始语言到 HTML 属性
setLocale(i18n.global.locale.value as any)

// 初始化用户状态
const userStore = useUserStore()
userStore.initializeAuth()

app.mount('#app')
