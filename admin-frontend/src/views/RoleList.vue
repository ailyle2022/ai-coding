<template>
  <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <!-- 添加角色模态框 -->
    <EditRoleModal
      v-if="showAddModal"
      :role="null"
      @close="showAddModal = false"
      @saved="handleRoleAdded"
    />

    <!-- 编辑角色模态框 -->
    <EditRoleModal
      v-if="showEditModal"
      :role="editingRole"
      @close="showEditModal = false"
      @saved="handleRoleUpdated"
    />

    <div class="flex justify-between items-center mb-6">
      <div class="text-gray-400 font-medium text-sm">{{ $t('roles.roleList') }} ({{ roles?.length || 0 }})</div>
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
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl">{{ $t('roles.roleName')}}</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">{{ $t('roles.roleDescirption')}}</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl">{{
            $t('common.actions') }}</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="role in roles" :key="role.id">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ role.name }}</td>
          <td class="px-6 py-4 text-sm text-gray-500">{{ role.description || '-' }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button
              @click="editRole(role)"
              class="text-primary-accent hover:text-blue-900 mr-4 text-sm"
            >
              {{ $t('common.edit') }}
            </button>
            <button
              @click="deleteRole(role)"
              class="text-red-500 hover:text-red-700 text-sm"
            >
              {{ $t('common.delete') }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 空状态 -->
    <div v-if="!loading && (!roles || roles.length === 0)" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">暂无角色</h3>
      <p class="mt-1 text-sm text-gray-500">开始创建您的第一个角色。</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-accent"></div>
      <p class="mt-2 text-sm text-gray-500">加载中...</p>
    </div>

    <!-- 错误信息 -->
    <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4 mt-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            {{ errorMessage }}
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onActivated, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
import EditRoleModal from './EditRoleModal.vue'

export default {
  name: 'RoleListView',
  components: {
    EditRoleModal
  },
  setup () {
    const route = useRoute()
    const router = useRouter()

    // 搜索关键词
    const searchQuery = ref('')

    // 添加角色相关状态
    const showAddModal = ref(false)

    // 编辑角色相关状态
    const showEditModal = ref(false)
    const editingRole = ref(null)

    // GraphQL查询角色列表
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

    // GraphQL删除角色mutation
    const DELETE_ROLE_MUTATION = gql`
      mutation DeleteRole($id: Int!) {
        deleteRole(id: $id)
      }
    `

    // 使用Apollo查询角色列表
    const { result, loading, error, refetch } = useQuery(ROLES_QUERY)

    // 使用Apollo删除角色
    const { mutate: deleteRoleMutation, onDone: onDeleteDone, onError: onDeleteError } = useMutation(DELETE_ROLE_MUTATION)

    // 角色数据
    const roles = computed(() => {
      const allRoles = result.value?.roles || []

      if (!searchQuery.value) {
        return allRoles
      }

      const query = searchQuery.value.toLowerCase()
      return allRoles.filter(role =>
        role.name.toLowerCase().includes(query) ||
        (role.description && role.description.toLowerCase().includes(query))
      )
    })

    // 错误信息
    const errorMessage = computed(() => {
      if (error.value) {
        return '获取角色列表失败: ' + (error.value.message || '未知错误')
      }
      return null
    })

    // 添加角色
    const addRole = () => {
      showAddModal.value = true
    }

    // 处理角色添加完成事件
    const handleRoleAdded = () => {
      showAddModal.value = false
      refetch()
    }

    // 编辑角色
    const editRole = (role) => {
      editingRole.value = role
      showEditModal.value = true
    }

    // 处理角色更新完成事件
    const handleRoleUpdated = (updatedRole) => {
      showEditModal.value = false
      refetch()
    }

    // 删除角色
    const deleteRole = async (role) => {
      if (confirm(`确定要删除角色 ${role.name} 吗？`)) {
        try {
          const result = await deleteRoleMutation({
            id: role.id
          })

          if (result.data?.deleteRole) {
            // 删除成功，刷新列表
            refetch()
          }
        } catch (err) {
          console.error('删除角色失败:', err)
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
      console.error('删除角色失败:', error)

      // 解析错误信息
      let message = '删除角色失败'
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        message = error.graphQLErrors[0].message
      } else if (error.networkError) {
        message = '网络错误，请检查连接后重试'
      } else if (error.message) {
        message = error.message
      }

      // 显示友好的错误提示
      alert(message)
    })

    // 页面激活时刷新数据
    onActivated(() => {
      refetch()
    })

    // 监听路由变化，检测是否需要刷新
    watch(
      () => route.query.refresh,
      (newVal) => {
        if (newVal) {
          refetch()
          // 删除查询参数
          router.replace({ query: { ...route.query, refresh: undefined } })
        }
      },
      { immediate: true }
    )

    return {
      roles,
      loading,
      errorMessage,
      searchQuery,
      addRole,
      editRole,
      deleteRole,
      refetch,
      // 添加角色相关
      showAddModal,
      handleRoleAdded,
      // 编辑角色相关
      showEditModal,
      editingRole,
      handleRoleUpdated
    }
  }
}
</script>
