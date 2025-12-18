<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- 背景遮罩 -->
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <!-- 居中对话框 -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {{ isEditing ? $t('users.editUser') : $t('users.addUser') }}
              </h3>

              <div class="mt-4 space-y-4">
                <div>
                  <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t('users.username')}} *
                  </label>
                  <input
                    id="username"
                    type="text"
                    v-model="form.username"
                    :disabled="isEditing"
                    :class="{'border-red-500': errors.username, 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-accent focus:border-primary-accent': true}"
                    placeholder="请输入用户名"
                  >
                  <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
                </div>

                <div v-if="!isEditing">
                  <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t('login.password')}} *
                  </label>
                  <input
                    id="password"
                    type="password"
                    v-model="form.password"
                    :class="{'border-red-500': errors.password, 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-accent focus:border-primary-accent': true}"
                    placeholder="请输入密码"
                  >
                  <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
                </div>

                <!-- 添加密码更新输入框 -->
                <div v-else>
                  <label for="update-password" class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t('login.password')}} ({{ $t('users.optionalUpdate') }})
                  </label>
                  <input
                    id="update-password"
                    type="password"
                    v-model="form.password"
                    :class="{'border-red-500': errors.password, 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-accent focus:border-primary-accent': true}"
                    placeholder="留空则不更改密码"
                  >
                  <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t('users.email')}}
                  </label>
                  <input
                    id="email"
                    type="email"
                    v-model="form.email"
                    :class="{'border-red-500': errors.email, 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-accent focus:border-primary-accent': true}"
                    placeholder="请输入邮箱地址"
                  >
                  <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                      {{ $t('users.firstName')}}
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      v-model="form.firstName"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-accent focus:border-primary-accent"
                      placeholder="请输入名字"
                    >
                  </div>

                  <div>
                    <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                      {{ $t('users.lastName')}}
                    </label>
                    <input
                      id="lastName"
                      type="text"
	                    v-model="form.lastName"
	                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-accent focus:border-primary-accent"
	                    placeholder="请输入姓氏"
	                  >
	                </div>
	              </div>
	
	              <div>
	                <label class="block text-sm font-medium text-gray-700 mb-1">
	                  {{ $t('users.role')}}
	                </label>
	                
	                <!-- 角色加载状态 -->
	                <div v-if="rolesLoading" class="py-2 text-center text-gray-500">
	                  <div class="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-accent"></div>
	                  <span class="ml-2">加载角色中...</span>
	                </div>
	                
	                <!-- 角色加载错误 -->
	                <div v-else-if="rolesError" class="py-2 text-red-500 text-sm">
	                  {{ rolesError }}
	                </div>
	                
	                <!-- 角色选择 -->
	                <div v-else class="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
	                  <div v-for="role in roles" :key="role.id" class="flex items-center">
	                    <input
	                      :id="'role-' + role.id"
	                      type="checkbox"
	                      :value="role.id"
	                      v-model="form.roleIds"
	                      class="h-4 w-4 text-primary-accent focus:ring-primary-accent border-gray-300 rounded"
	                    >
	                    <label :for="'role-' + role.id" class="ml-2 block text-sm text-gray-700">
	                      {{ role.name }}
	                    </label>
	                  </div>
	                  
	                  <div v-if="roles && roles.length === 0" class="text-gray-500 text-sm py-2 text-center">
	                    暂无角色可分配
	                  </div>
	                </div>
	              </div>
	
	              <div class="flex items-center">
	                <input
	                  id="isActive"
	                  type="checkbox"
	                  v-model="form.isActive"
	                  class="h-4 w-4 text-primary-accent focus:ring-primary-accent border-gray-300 rounded"
	                >
	                <label for="isActive" class="ml-2 block text-sm text-gray-700">
	                  {{ $t('common.enable') }}
	                </label>
	              </div>
	            </div>
	          </div>
	        </div>
	      </div>
	      
	      <!-- 错误信息 -->
	      <div v-if="errors.general || createError || updateError" class="px-6 py-2 bg-red-50 border-t border-red-100">
	        <div class="flex items-center">
	          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
	            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
	          </svg>
	          <div class="ml-3">
	            <h3 class="text-sm font-medium text-red-800">
	              {{ errors.general || createError || updateError }}
	            </h3>
	          </div>
	        </div>
	      </div>
	
	      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
	        <button
	          type="button"
	          :disabled="createLoading || updateLoading"
	          @click="saveUser"
	          class="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-primary-accent text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
	        >
	          <span v-if="createLoading || updateLoading" class="flex items-center">
	            <div class="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
	            {{ $t('common.saving') }}
	          </span>
	          <span v-else>{{ $t('common.save') }}</span>
	        </button>
	        <button
	          type="button"
	          :disabled="createLoading || updateLoading"
	          @click="closeModal"
	          class="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
	        >
	          {{ $t('common.cancel') }}
	        </button>
	      </div>
	    </div>
	  </div>
	</div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
import { useAuthStore } from '@/store/auth'

export default {
  name: 'EditUserModal',
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    // 使用认证存储获取token
    const authStore = useAuthStore()
    
    // 表单数据
    const form = reactive({
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      isActive: true,
      roleIds: []
    })

    // 表单错误
    const errors = reactive({
      username: '',
      password: '',
      email: '',
      general: ''
    })

    // 是否处于编辑模式
    const isEditing = computed(() => !!props.user)

    // GraphQL查询角色列表
    const ROLES_QUERY = gql`
      query GetRoles {
        roles {
          id
          name
        }
      }
    `

    // GraphQL创建用户mutation
    const CREATE_USER_MUTATION = gql`
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id
          username
          email
          firstName
          lastName
          isActive
          roles {
            id
            name
          }
        }
      }
    `

    // GraphQL更新用户mutation
    const UPDATE_USER_MUTATION = gql`
      mutation UpdateUser($id: Int!, $input: UpdateUserInput) {
        updateUser(id: $id, input: $input) {
          id
          username
          email
          firstName
          lastName
          isActive
          roles {
            id
            name
          }
        }
      }
    `

    // 使用Apollo查询角色列表
    const { result: rolesResult, loading: rolesLoading, error: rolesError } = useQuery(ROLES_QUERY)

    // 使用Apollo创建用户
    const { 
      mutate: createUserMutation, 
      loading: createLoading, 
      error: createError,
      onDone: onCreateDone
    } = useMutation(CREATE_USER_MUTATION)

    // 使用Apollo更新用户
    const { 
      mutate: updateUserMutation, 
      loading: updateLoading, 
      error: updateError,
      onDone: onUpdateDone
    } = useMutation(UPDATE_USER_MUTATION)

    // 角色数据
    const roles = computed(() => rolesResult.value?.roles || [])

    // 初始化表单数据
    onMounted(() => {
      if (props.user) {
        form.username = props.user.username
        form.email = props.user.email || ''
        form.firstName = props.user.firstName || ''
        form.lastName = props.user.lastName || ''
        form.isActive = props.user.isActive

        // 设置用户已有的角色
        if (props.user.roles) {
          form.roleIds = props.user.roles.map(role => role.id)
        }
      }
    })

    // 清除错误
    const clearErrors = () => {
      errors.username = ''
      errors.password = ''
      errors.email = ''
      errors.general = ''
    }

    // 表单验证
    const validateForm = () => {
      clearErrors()
      
      let isValid = true
      
      if (!form.username.trim()) {
        errors.username = '用户名不能为空'
        isValid = false
      }
      
      if (!isEditing.value && !form.password.trim()) {
        errors.password = '密码不能为空'
        isValid = false
      }
      
      return isValid
    }

    // 保存用户
    const saveUser = async () => {
      if (!validateForm()) return

      try {
        const userData = {
          username: form.username,
          email: form.email || null,
          firstName: form.firstName || null,
          lastName: form.lastName || null,
          isActive: form.isActive,
          roleIds: form.roleIds // 添加角色ID数组
        }

        // 只有在密码不为空时才添加到userData中
        if (form.password.trim()) {
          userData.password = form.password
        }

        if (!isEditing.value) {
          // 创建新用户
          // 创建用户时密码是必填项，已在验证阶段检查
          userData.password = form.password
          
          const result = await createUserMutation({
            input: userData
          }, {
            context: {
              headers: {
                Authorization: `Bearer ${authStore.getAuthToken()}`
              }
            }
          })

          if (result.data?.createUser) {
            emit('saved', result.data.createUser)
            emit('close')
          }
        } else {
          // 更新现有用户
          const result = await updateUserMutation({
            id: props.user.id,
            input: userData
          }, {
            context: {
              headers: {
                Authorization: `Bearer ${authStore.getAuthToken()}`
              }
            }
          })

          if (result.data?.updateUser) {
            // 更新角色关联
            const updatedUser = { ...result.data.updateUser }
            updatedUser.roles = roles.value.filter(role => 
              form.roleIds.includes(role.id)
            )
            
            emit('saved', updatedUser)
            emit('close')
          }
        }
      } catch (err) {
        console.error('保存用户失败:', err)
        errors.general = '保存用户失败，请稍后重试'
      }
    }

    // 关闭模态框
    const closeModal = () => {
      emit('close')
    }

    return {
      form,
      errors,
      isEditing,
      roles,
      rolesLoading,
      rolesError: computed(() => rolesError.value?.message || null),
      createLoading,
      updateLoading,
      createError: computed(() => createError.value?.message || null),
      updateError: computed(() => updateError.value?.message || null),
      saveUser,
      closeModal
    }
  }
}
</script>

<style scoped>
/* 所有样式已通过Tailwind CSS类实现 */
</style>