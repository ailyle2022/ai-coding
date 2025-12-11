<template>
  <nav class="w-64 bg-white shadow-xl flex-shrink-0 flex flex-col border-r border-gray-100">
    <!-- Logo/应用名称 -->
    <div class="h-20 flex items-center justify-center border-b border-gray-100">
      <h1 class="text-2xl font-bold text-primary-accent">极简 Admin</h1>
    </div>

    <!-- 导航链接 -->
    <div class="p-4 flex-grow custom-scrollbar overflow-y-auto">
      <p class="text-xs font-semibold uppercase text-gray-400 mb-3 ml-3">系统管理</p>
      <ul>
        <!-- 首页 -->
        <li>
          <a
            href="#"
            class="nav-link flex items-center p-3 rounded-xl transition duration-150 ease-in-out text-sm"
            :class="{'bg-secondary-bg text-primary-accent font-semibold': isActive('/'), 'text-gray-500 hover:bg-gray-100': !isActive('/')}"
            @click.prevent="navigateTo('/')"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span class="font-medium">首页</span>
          </a>
        </li>
        <!-- 用户管理 -->
        <li>
          <a
            href="#"
            class="nav-link flex items-center p-3 rounded-xl transition duration-150 ease-in-out mt-1 text-sm"
            :class="{'bg-secondary-bg text-primary-accent font-semibold': isActive('/users'), 'text-gray-500 hover:bg-gray-100': !isActive('/users')}"
            @click.prevent="navigateTo('/users')"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M5 12h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2zM9 10a1 1 0 110-2 1 1 0 010 2z"></path>
            </svg>
            <span class="font-medium">用户管理</span>
          </a>
        </li>
        <!-- 角色管理 -->
        <li>
          <a
            href="#"
            class="nav-link flex items-center p-3 rounded-xl transition duration-150 ease-in-out mt-1 text-sm"
            :class="{'bg-secondary-bg text-primary-accent font-semibold': isActive('/roles'), 'text-gray-500 hover:bg-gray-100': !isActive('/roles')}"
            @click.prevent="navigateTo('/roles')"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            <span class="font-medium">角色管理</span>
          </a>
        </li>
        <!-- 产品样式管理 -->
        <li>
          <a
            href="#"
            class="nav-link flex items-center p-3 rounded-xl transition duration-150 ease-in-out mt-1 text-sm"
            :class="{'bg-secondary-bg text-primary-accent font-semibold': isActive('/product-styles'), 'text-gray-500 hover:bg-gray-100': !isActive('/product-styles')}"
            @click.prevent="navigateTo('/product-styles')"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
            </svg>
            <span class="font-medium">产品样式管理</span>
          </a>
        </li>
        <!-- 日志查看 -->
        <li>
          <a href="#" class="flex items-center p-3 rounded-xl text-gray-500 hover:bg-gray-100 transition duration-150 ease-in-out mt-1 text-sm">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
            <span class="font-medium">日志查看</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- 底部用户/版本信息 -->
    <div class="p-4 border-t border-gray-100">
      <div class="flex items-center text-sm text-gray-500">
        <div class="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
        <div>
          <p class="font-semibold text-gray-700">超级管理员</p>
          <p class="text-xs">Version 1.0</p>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Sidebar',
  methods: {
    navigateTo (path) {
      if (this.$route.path !== path) {
        this.$router.push(path)
      }
    },
    isActive (path) {
      return this.$route.path === path
    }
  }
}
</script>

<style scoped>
/* 自定义滚动条样式已在index.html中定义 */
</style>