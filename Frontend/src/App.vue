<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
</script>

<template>
  <header class="app-header">
    <nav>
      <LanguageSwitcher />
    </nav>
  </header>
  <RouterView />
</template>

<style scoped>
.app-header {
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

nav {
  display: flex;
  justify-content: flex-end;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
