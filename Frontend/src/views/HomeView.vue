<template>
  <div class="home">
    <h1>{{ t('welcome') }}</h1>
    <div class="nav-cards">
      <router-link to="/order" class="nav-card">
        <h2>{{ t('nav.order') }}</h2>
        <p>{{ t('home.orderNow') }}</p>
      </router-link>
      <router-link to="/login" class="nav-card">
        <h2>{{ t('home.loginTitle') }}</h2>
        <p>{{ t('home.loginDesc') }}</p>
      </router-link>
      <router-link to="/admin/users" class="nav-card">
        <h2>{{ t('home.adminTitle') }}</h2>
        <p>{{ t('home.adminDesc') }}</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.home {
  padding: 2rem;
  text-align: center;
}

.nav-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.nav-card {
  display: block;
  padding: 2rem;
  border-radius: 8px;
  background: #f5f5f5;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

h2 {
  margin: 0 0 1rem;
  color: #42b983;
}

p {
  margin: 0;
  color: #666;
}
</style>]]