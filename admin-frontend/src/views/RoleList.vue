<template>
  <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div class="flex justify-between items-center mb-6">
      <div class="text-gray-400 font-medium text-sm">共 {{ roles.length }} 个角色</div>
      <div class="flex space-x-3">
        <div class="relative">
          <input 
            type="text" 
            placeholder="搜索 角色名称..." 
            class="px-4 py-2 border border-gray-300 rounded-xl w-64 focus:ring-primary-accent focus:border-primary-accent transition duration-150 text-sm"
            v-model="searchQuery"
          >
          <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <button 
          @click="addRole" 
          class="bg-primary-accent hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-150 shadow-md text-sm"
        >
          + 新增角色
        </button>
      </div>
    </div>

    <!-- 列表表格 -->
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl">角色名称</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色描述</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl">操作</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="role in filteredRoles" :key="role.id">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ role.name }}</td>
          <td class="px-6 py-4 text-sm text-gray-500">{{ role.description || '-' }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-xs font-medium">
            <button 
              @click="editRole(role)" 
              class="text-primary-accent hover:text-blue-900 mr-4 text-sm"
            >
              编辑权限
            </button>
            <button 
              @click="deleteRole(role)" 
              class="text-red-500 hover:text-red-700 text-sm"
            >
              删除
            </button>
          </td>
        </tr>
        <tr v-if="filteredRoles.length === 0 && !loading">
          <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">
            暂无角色数据
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="mt-6 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-accent"></div>
    </div>
    
    <!-- 错误信息 -->
    <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
      {{ error }}
    </div>
    
    <!-- 分页占位符 -->
    <div class="mt-6 flex justify-end items-center text-xs text-gray-600">
      <button class="p-2 mr-2 rounded-lg hover:bg-gray-100 text-xs">&lt; 上一页</button>
      <span class="mx-2 text-xs">第 1 页 / 共 1 页</span>
      <button class="p-2 ml-2 rounded-lg hover:bg-gray-100 text-xs">下一页 &gt;</button>
    </div>
  </div>
</template>

<script>
import { gql } from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { computed, ref, onActivated, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'RoleListView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    // 搜索查询
    const searchQuery = ref('')
    
    // GraphQL查询语句
    const ROLES_QUERY = gql`
      query GetRoles {
        roles {
          id
          name
          description
          createdAt
        }
      }
    `
    
    // 使用Apollo查询角色列表
    const { result, loading, error, refetch } = useQuery(ROLES_QUERY)
    
    // 角色数据
    const roles = computed(() => result.value?.roles || [])
    
    // 错误信息
    const errorMessage = computed(() => {
      if (error.value) {
        return '获取角色列表失败: ' + (error.value.message || '未知错误')
      }
      return null
    })
    
    // 过滤角色数据
    const filteredRoles = computed(() => {
      if (!searchQuery.value) {
        return roles.value
      }
      
      const query = searchQuery.value.toLowerCase()
      return roles.value.filter(role => 
        role.name.toLowerCase().includes(query) || 
        (role.description && role.description.toLowerCase().includes(query))
      )
    })
    
    // 添加角色
    const addRole = () => {
      router.push('/roles/add')
    }
    
    // 编辑角色（模拟）
    const editRole = (role) => {
      alert(`TODO: 编辑角色 ${role.name} 的权限`)
    }
    
    // 删除角色（模拟）
    const deleteRole = (role) => {
      if (confirm(`确定要删除角色 ${role.name} 吗？`)) {
        alert(`TODO: 删除角色 ${role.name}`)
      }
    }
    
    // 当组件被激活时（从其他页面返回时）刷新数据
    onActivated(() => {
      refetch()
    })
    
    // 监听路由变化，如果URL中有refresh=true参数，则刷新数据
    watch(() => route.query.refresh, (newVal) => {
      if (newVal === 'true') {
        refetch()
        // 移除URL中的refresh参数
        router.replace({ query: { ...route.query, refresh: undefined } })
      }
    }, { immediate: true })
    
    return {
      roles: filteredRoles,
      filteredRoles,
      loading,
      error: errorMessage,
      searchQuery,
      addRole,
      editRole,
      deleteRole,
      refetch
    }
  }
}
</script>

<style scoped>
/* 所有样式已通过Tailwind CSS类实现 */
</style>