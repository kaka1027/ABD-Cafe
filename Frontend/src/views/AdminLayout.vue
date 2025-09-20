<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <h2>{{ t('admin.title') }}</h2>
      <nav>
        <router-link to="/admin/users" class="nav-item">{{ t('admin.userManagement') }}</router-link>
        <!-- 未来可以添加更多管理功能 -->
      </nav>
    </aside>
    <main class="content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.admin-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #2c3e50;
  color: white;
  padding: 1rem;
}

.nav-item {
  display: block;
  padding: 0.75rem 1rem;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin: 0.5rem 0;
}

.nav-item:hover,
.nav-item.router-link-active {
  background: rgba(255, 255, 255, 0.1);
}

.content {
  padding: 2rem;
}

h2 {
  margin: 0 0 1rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>]]