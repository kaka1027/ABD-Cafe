<template>
  <div class="language-switcher">
    <select v-model="currentLocale" @change="changeLocale" class="locale-select">
      <option v-for="locale in availableLocales" :key="locale" :value="locale">
        {{ t(`language.${locale}`) }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
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

<style scoped>
.language-switcher {
  display: inline-block;
}

.locale-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.locale-select:hover {
  border-color: #42b983;
}
</style>]]