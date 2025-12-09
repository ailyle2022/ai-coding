import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      // 检查是否有认证token
      const token = localStorage.getItem('authToken');
      if (token) {
        next(); // 允许访问
      } else {
        next('/login'); // 重定向到登录页
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;