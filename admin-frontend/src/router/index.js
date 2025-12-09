import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import LoginView from '../views/Login.vue'
import UserListView from '../views/UserList.vue'

// 不包含侧边栏的App组件
import { defineAsyncComponent } from 'vue'
const AppWithoutSidebar = defineAsyncComponent(() => import('../AppWithoutSidebar.vue'))
const AppWithSidebar = defineAsyncComponent(() => import('../App.vue'))

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true, layout: 'with-sidebar' }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { layout: 'without-sidebar' }
  },
  {
    path: '/users',
    name: 'users',
    component: UserListView,
    meta: { requiresAuth: true, layout: 'with-sidebar' }
  },
  {
    path: '/home',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.name === 'login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router