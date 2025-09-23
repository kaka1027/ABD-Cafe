import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: {
        guest: true // 游客可访问
      }
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('../views/order/OrderView.vue'),
      meta: {
        requiresAuth: true // 需要登录
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: {
        requiresAuth: true,
        requiresAdmin: true // 需要管理员权限
      },
      children: [
        {
          path: 'users',
          name: 'user-manage',
          component: () => import('../views/admin/UserManageView.vue')
        },
        {
          path: 'orders',
          name: 'order-manage',
          component: () => import('../views/admin/OrderManageView.vue')
        },
        {
          path: 'products',
          name: 'product-manage',
          component: () => import('../views/admin/ProductManageView.vue')
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: () => import('../views/admin/AnalyticsView.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/admin/SettingsView.vue')
        },
        // 默认重定向到用户管理
        {
          path: '',
          redirect: 'users'
        }
      ]
    },
    // 捕获所有未匹配的路由
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/common/NotFoundView.vue')
    }
  ],
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  
  // 需要登录的页面
  if (to.meta.requiresAuth) {
    if (!userStore.user) {
      next('/login')
      return
    }
    
    // 需要管理员权限的页面
    if (to.meta.requiresAdmin && userStore.user.role !== 'admin') {
      next('/order') // 非管理员跳转到点餐页
      return
    }
  }
  
  // 已登录用户访问登录页，跳转到点餐页
  if (to.path === '/login' && userStore.user) {
    next('/order')
    return
  }
  
  next()
})

export default router
