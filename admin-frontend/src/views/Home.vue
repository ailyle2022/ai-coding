<template>
  <div class="home">
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      <h2 class="text-3xl font-extrabold text-gray-900 mb-6">{{ $t('sidebar.dashboard') }}</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <div class="text-blue-800 text-3xl font-bold mb-2">12</div>
          <div class="text-blue-600 font-medium">{{ $t('users.totalUsers') }}</div>
        </div>

        <div class="bg-green-50 p-6 rounded-xl border border-green-100">
          <div class="text-green-800 text-3xl font-bold mb-2">8</div>
          <div class="text-green-600 font-medium">{{ $t('users.onlineUsers') }}</div>
        </div>

        <div class="bg-purple-50 p-6 rounded-xl border border-purple-100">
          <div class="text-purple-800 text-3xl font-bold mb-2">4</div>
          <div class="text-purple-600 font-medium">{{ $t('roles.rolesCount') }}</div>
        </div>
      </div>

      <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
        <h3 class="text-xl font-bold text-gray-800 mb-4">{{ $t('dashboard.recentActivity') }}</h3>
        <ul class="space-y-3">
          <li class="flex items-center">
            <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <span class="text-gray-600">{{ $t('dashboard.adminLogin') }}</span>
            <span class="text-gray-400 text-sm ml-auto">{{ $t('dashboard.timeAgo', { time: '2分钟' }) }}</span>
          </li>
          <li class="flex items-center">
            <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span class="text-gray-600">新增用户 EditorA</span>
            <span class="text-gray-400 text-sm ml-auto">1小时前</span>
          </li>
          <li class="flex items-center">
            <div class="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
            <span class="text-gray-600">用户 ViewerB 被禁用</span>
            <span class="text-gray-400 text-sm ml-auto">3小时前</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'HomeView',
  setup () {
    const router = useRouter()

    const logout = () => {
      // 清除本地存储的认证信息
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')

      // 跳转到登录页面
      router.push('/login')
    }

    return {
      logout
    }
  }
}
</script>

<style scoped>
/* 所有样式已通过Tailwind CSS类实现 */
</style>
