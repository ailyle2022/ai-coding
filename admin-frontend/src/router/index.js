import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { layout: 'without-sidebar' }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { layout: 'with-sidebar' }
  },
  {
    path: '/users',
    name: 'UserList',
    component: () => import('../views/UserList.vue'),
    meta: { layout: 'with-sidebar' }
  },
  {
    path: '/roles',
    name: 'RoleList',
    component: () => import('../views/RoleList.vue'),
    meta: { layout: 'with-sidebar' }
  },
  {
    path: '/product-styles',
    name: 'ProductStyleList',
    component: () => import('../views/ProductStyleList.vue'),
    meta: { layout: 'with-sidebar' }
  },
  {
    path: '/mfa-setup',
    name: 'MFASetup',
    component: () => import('../views/MFASetup.vue'),
    meta: { layout: 'without-sidebar' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { layout: 'with-sidebar' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 获取认证状态
  const authStore = useAuthStore()
  const isAuthenticated = authStore.getAuthToken()

  // 如果访问需要认证的页面但未登录，则重定向到登录页
  if (to.name !== 'Login' && to.name !== 'MFASetup' && !isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router