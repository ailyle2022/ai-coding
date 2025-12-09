<template>
  <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div class="flex justify-between items-center mb-6">
      <div class="text-gray-400 font-medium text-sm">共 {{ users.length }} 位用户</div>
      <div class="flex space-x-3">
        <div class="relative">
          <input 
            type="text" 
            placeholder="搜索 用户名/邮箱..." 
            class="px-4 py-2 border border-gray-300 rounded-xl w-64 focus:ring-primary-accent focus:border-primary-accent transition duration-150 text-sm"
            v-model="searchQuery"
          >
          <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <button 
          @click="addUser" 
          class="bg-primary-accent hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-150 shadow-md text-sm"
        >
          + 新增用户
        </button>
      </div>
    </div>

    <!-- 列表表格 -->
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl">用户名</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl">操作</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="user in filteredUsers" :key="user.id">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.username }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email || '-' }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <span class="px-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
              {{ getUserRole(user) }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <span 
              class="px-3 inline-flex text-xs leading-5 font-semibold rounded-full" 
              :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ user.isActive ? '启用' : '禁用' }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-xs font-medium">
            <button 
              @click="editUser(user)" 
              class="text-primary-accent hover:text-blue-900 mr-4 text-sm"
            >
              编辑
            </button>
            <button 
              @click="deleteUser(user)" 
              class="text-red-500 hover:text-red-700 text-sm"
            >
              删除
            </button>
          </td>
        </tr>
        <tr v-if="filteredUsers.length === 0 && !loading">
          <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
            暂无用户数据
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- 分页占位符 -->
    <div class="mt-6 flex justify-end items-center text-xs text-gray-600">
      <button class="p-2 mr-2 rounded-lg hover:bg-gray-100 text-xs">&lt; 上一页</button>
      <span class="mx-2 text-xs">第 1 页 / 共 2 页</span>
      <button class="p-2 ml-2 rounded-lg hover:bg-gray-100 text-xs">下一页 &gt;</button>
    </div>
    
    <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { gql } from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { computed, ref } from 'vue'

export default {
  name: 'UserListView',
  setup() {
    // 搜索查询
    const searchQuery = ref('')
    
    // GraphQL查询语句
    const USERS_QUERY = gql`
      query GetUsers {
        users {
          id
          username
          email
          firstName
          lastName
          isActive
          createdAt
          updatedAt
        }
      }
    `
    
    // 使用Apollo查询用户列表
    const { result, loading, error, refetch } = useQuery(USERS_QUERY)
    
    // 用户数据
    const users = computed(() => result.value?.users || [])
    
    // 错误信息
    const errorMessage = computed(() => {
      if (error.value) {
        return '获取用户列表失败: ' + (error.value.message || '未知错误')
      }
      return null
    })
    
    // 过滤用户数据
    const filteredUsers = computed(() => {
      if (!searchQuery.value) {
        return users.value
      }
      
      const query = searchQuery.value.toLowerCase()
      return users.value.filter(user => 
        user.username.toLowerCase().includes(query) || 
        (user.email && user.email.toLowerCase().includes(query))
      )
    })
    
    // 获取用户角色（模拟数据）
    const getUserRole = (user) => {
      // 这里应该从实际的用户数据中获取角色信息
      // 暂时使用模拟数据
      const roles = ['超级管理员', '内容编辑', '只读用户', '测试员']
      return roles[Math.floor(Math.random() * roles.length)]
    }
    
    // 获取用户全名
    const getUserFullName = (user) => {
      if (user.firstName || user.lastName) {
        return `${user.firstName || ''} ${user.lastName || ''}`.trim()
      }
      return '-'
    }
    
    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN')
    }
    
    // 刷新用户列表
    const loadUsers = () => {
      refetch()
    }
    
    // 添加用户（模拟）
    const addUser = () => {
      alert('TODO: 打开新增用户侧边栏')
    }
    
    // 编辑用户（模拟）
    const editUser = (user) => {
      alert(`TODO: 编辑用户 ${user.username}`)
    }
    
    // 删除用户（模拟）
    const deleteUser = (user) => {
      if (confirm(`确定要删除用户 ${user.username} 吗？`)) {
        alert(`TODO: 删除用户 ${user.username}`)
      }
    }
    
    return {
      users: filteredUsers,
      filteredUsers,
      loading,
      error: errorMessage,
      searchQuery,
      getUserRole,
      getUserFullName,
      formatDate,
      loadUsers,
      addUser,
      editUser,
      deleteUser
    }
  }
}
</script>

<style scoped>
/* 所有样式已通过Tailwind CSS类实现 */
</style>