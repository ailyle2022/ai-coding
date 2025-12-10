<template>
  <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <!-- 添加/编辑用户模态框 -->
    <EditUserModal 
      v-if="showEditModal"
      :user="editingUser"
      @close="showEditModal = false"
      @saved="handleUserSaved"
    />
    
    <div class="flex justify-between items-center mb-6">
      <div class="text-gray-400 font-medium text-sm">共 {{ users?.length || 0 }} 位用户</div>
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
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl">操作</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="user in users" :key="user.id">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.username }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email || '-' }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getUserFullName(user) }}</td>
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
      </tbody>
    </table>

    <!-- 空状态 -->
    <div v-if="!loading && (!users || users.length === 0)" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">暂无用户</h3>
      <p class="mt-1 text-sm text-gray-500">开始创建您的第一个用户。</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-accent"></div>
      <p class="mt-2 text-sm text-gray-500">加载中...</p>
    </div>

    <!-- 错误信息 -->
    <div v-if="error" class="rounded-lg bg-red-50 p-4 mt-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            {{ error }}
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gql } from 'graphql-tag'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { computed, ref } from 'vue'
import EditUserModal from './EditUserModal.vue'

export default {
  name: 'UserListView',
  components: {
    EditUserModal
  },
  setup() {
    // 搜索查询
    const searchQuery = ref('')
    
    // 添加/编辑用户相关状态
    const showEditModal = ref(false)
    const editingUser = ref(null)
    
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
    
    // GraphQL删除用户mutation
    const DELETE_USER_MUTATION = gql`
      mutation DeleteUser($id: Int!) {
        deleteUser(id: $id)
      }
    `
    
    // 使用Apollo查询用户列表
    const { result, loading, error, refetch } = useQuery(USERS_QUERY)
    
    // 使用Apollo删除用户
    const { mutate: deleteUserMutation, loading: deleteLoading, onDone: onDeleteDone, onError: onDeleteError } = useMutation(DELETE_USER_MUTATION)
    
    // 用户数据
    const users = computed(() => {
      if (!result.value?.users) return []
      
      // 如果有搜索查询，则过滤用户
      if (!searchQuery.value) {
        return result.value.users
      }
      
      const query = searchQuery.value.toLowerCase()
      return result.value.users.filter(user => 
        user.username.toLowerCase().includes(query) || 
        (user.email && user.email.toLowerCase().includes(query))
      )
    })
    
    // 错误信息
    const errorMessage = computed(() => {
      if (error.value) {
        return '获取用户列表失败: ' + (error.value.message || '未知错误')
      }
      return null
    })
    
    // 获取用户全名
    const getUserFullName = (user) => {
      if (user.firstName || user.lastName) {
        return `${user.firstName || ''} ${user.lastName || ''}`.trim()
      }
      return '-'
    }
    
    // 添加用户
    const addUser = () => {
      editingUser.value = null
      showEditModal.value = true
    }
    
    // 编辑用户
    const editUser = (user) => {
      editingUser.value = user
      showEditModal.value = true
    }
    
    // 处理用户保存完成事件
    const handleUserSaved = (savedUser) => {
      showEditModal.value = false
      refetch()
    }
    
    // 删除用户
    const deleteUser = async (user) => {
      if (confirm(`确定要删除用户 ${user.username} 吗？`)) {
        try {
          const result = await deleteUserMutation({
            id: user.id
          })
          
          if (result.data?.deleteUser) {
            // 删除成功，刷新列表
            refetch()
          }
        } catch (err) {
          console.error('删除用户失败:', err)
          // 错误处理由Apollo的onError回调统一处理，避免重复提示
        }
      }
    }
    
    // 删除成功的回调
    onDeleteDone(() => {
      // 可以在这里添加额外的成功处理逻辑
    })
    
    // 删除失败的回调
    onDeleteError((error) => {
      console.error('删除用户失败:', error)
      alert('删除用户失败: ' + (error.message || '未知错误'))
    })
    
    return {
      users,
      loading,
      error: errorMessage,
      searchQuery,
      getUserFullName,
      addUser,
      editUser,
      deleteUser,
      refetch,
      // 添加/编辑用户相关
      showEditModal,
      editingUser,
      handleUserSaved
    }
  }
}
</script>

<style scoped>
/* 所有样式已通过Tailwind CSS类实现 */
</style>