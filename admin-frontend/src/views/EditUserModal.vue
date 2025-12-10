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
                {{ isEditing ? '编辑用户' : '新增用户' }}
              </h3>
              
              <div class="mt-4 space-y-4">
                <div>
                  <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
                    用户名 *
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
                    密码 *
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
                
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                    邮箱
                  </label>
                  <input
                    id="email"
                    type="email"
                    v-model="form.email"
                    :class="{'border-red-500': errors.email, 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-accent focus:border-primary-accent': true}"
                    placeholder="请输入邮箱"
                  >
                  <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                      名
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      v-model="form.firstName"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-accent focus:border-primary-accent"
                      placeholder="名"
                    >
                  </div>
                  
                  <div>
                    <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                      姓
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      v-model="form.lastName"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-accent focus:border-primary-accent"
                      placeholder="姓"
                    >
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    状态
                  </label>
                  <div class="flex items-center">
                    <label class="inline-flex items-center">
                      <input
                        type="radio"
                        v-model="form.isActive"
                        :value="true"
                        class="text-primary-accent focus:ring-primary-accent"
                      >
                      <span class="ml-2">启用</span>
                    </label>
                    <label class="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        v-model="form.isActive"
                        :value="false"
                        class="text-primary-accent focus:ring-primary-accent"
                      >
                      <span class="ml-2">禁用</span>
                    </label>
                  </div>
                </div>

                <!-- 角色选择 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    关联角色
                  </label>
                  <div class="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                    <div v-if="rolesLoading" class="text-center text-gray-500 py-2">
                      加载角色中...
                    </div>
                    <div v-else-if="rolesError" class="text-center text-red-500 py-2">
                      {{ rolesError }}
                    </div>
                    <div v-else>
                      <label 
                        v-for="role in roles" 
                        :key="role.id" 
                        class="flex items-center py-1"
                      >
                        <input
                          type="checkbox"
                          :value="role.id"
                          v-model="form.roleIds"
                          class="h-4 w-4 text-primary-accent focus:ring-primary-accent border-gray-300 rounded"
                        >
                        <span class="ml-2 text-sm text-gray-700">{{ role.name }}</span>
                      </label>
                    </div>
                  </div>
                  <p v-if="errors.roleIds" class="mt-1 text-sm text-red-600">{{ errors.roleIds }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            :disabled="loading"
            @click="handleSubmit"
            class="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-primary-accent text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            {{ loading ? '保存中...' : '保存' }}
          </button>
          <button
            type="button"
            :disabled="loading"
            @click="$emit('close')"
            class="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'

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
    // 是否为编辑模式
    const isEditing = ref(!!props.user)
    
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
    
    // 错误信息
    const errors = reactive({
      username: '',
      password: '',
      email: '',
      roleIds: ''
    })
    
    // 加载状态
    const loading = ref(false)
    
    // 角色相关状态
    const roles = ref([])
    const rolesLoading = ref(false)
    const rolesError = ref(null)
    
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
          createdAt
          roles {
            id
            name
          }
        }
      }
    `
    
    // GraphQL更新用户mutation
    const UPDATE_USER_MUTATION = gql`
      mutation UpdateUser($id: Int!, $input: UpdateUserInput!) {
        updateUser(id: $id, input: $input) {
          id
          username
          email
          firstName
          lastName
          isActive
          createdAt
          roles {
            id
            name
          }
        }
      }
    `
    
    const { mutate: createUser, loading: createLoading, onDone: onCreateDone, onError: onCreateError } = useMutation(CREATE_USER_MUTATION)
    const { mutate: updateUser, loading: updateLoading, onDone: onUpdateDone, onError: onUpdateError } = useMutation(UPDATE_USER_MUTATION)
    
    // 监听加载状态
    watch([createLoading, updateLoading], ([isCreating, isUpdating]) => {
      loading.value = isCreating || isUpdating
    })
    
    // 获取角色列表
    const loadRoles = async () => {
      rolesLoading.value = true
      rolesError.value = null
      
      try {
        const response = await fetch('http://localhost:3000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query GetRoles {
                roles {
                  id
                  name
                }
              }
            `,
          }),
        })
        
        const result = await response.json()
        if (result.data && result.data.roles) {
          roles.value = result.data.roles
        } else if (result.errors) {
          rolesError.value = '加载角色失败'
          console.error('加载角色失败:', result.errors)
        }
      } catch (err) {
        rolesError.value = '网络错误，请稍后重试'
        console.error('加载角色失败:', err)
      } finally {
        rolesLoading.value = false
      }
    }
    
    // 初始化表单数据
    onMounted(() => {
      loadRoles()
      
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
    
    // 验证表单
    const validateForm = () => {
      // 清除之前的错误
      errors.username = ''
      errors.password = ''
      errors.email = ''
      errors.roleIds = ''
      
      let isValid = true
      
      // 验证用户名
      if (!form.username || form.username.trim() === '') {
        errors.username = '用户名不能为空'
        isValid = false
      } else if (form.username.trim().length > 50) {
        errors.username = '用户名长度不能超过50个字符'
        isValid = false
      }
      
      // 验证密码（仅在创建时需要）
      if (!isEditing.value) {
        if (!form.password || form.password.trim() === '') {
          errors.password = '密码不能为空'
          isValid = false
        } else if (form.password.length < 6) {
          errors.password = '密码长度不能少于6个字符'
          isValid = false
        }
      }
      
      // 验证邮箱格式
      if (form.email && form.email.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(form.email.trim())) {
          errors.email = '邮箱格式不正确'
          isValid = false
        } else if (form.email.trim().length > 100) {
          errors.email = '邮箱长度不能超过100个字符'
          isValid = false
        }
      }
      
      return isValid
    }
    
    // 提交表单
    const handleSubmit = async () => {
      if (!validateForm()) {
        return
      }
      
      try {
        if (isEditing.value) {
          // 更新用户
          const result = await updateUser({
            id: props.user.id,
            input: {
              username: form.username.trim(),
              email: form.email.trim() || undefined,
              firstName: form.firstName.trim() || undefined,
              lastName: form.lastName.trim() || undefined,
              isActive: form.isActive,
              roleIds: form.roleIds
            }
          })
          
          if (result.data?.updateUser) {
            emit('saved', result.data.updateUser)
          }
        } else {
          // 创建用户
          const result = await createUser({
            input: {
              username: form.username.trim(),
              password: form.password,
              email: form.email.trim() || undefined,
              firstName: form.firstName.trim() || undefined,
              lastName: form.lastName.trim() || undefined,
              isActive: form.isActive,
              roleIds: form.roleIds
            }
          })
          
          if (result.data?.createUser) {
            emit('saved', result.data.createUser)
          }
        }
      } catch (err) {
        console.error(`${isEditing.value ? '更新' : '创建'}用户失败:`, err)
        // 错误处理由Apollo的onError回调统一处理，避免重复提示
      }
    }
    
    // 创建成功的回调
    onCreateDone((result) => {
      if (result.data?.createUser) {
        emit('saved', result.data.createUser)
      }
    })
    
    // 创建失败的回调
    onCreateError((error) => {
      console.error('创建用户失败:', error)
      alert('创建用户失败: ' + (error.message || '未知错误'))
    })
    
    // 更新成功的回调
    onUpdateDone((result) => {
      if (result.data?.updateUser) {
        emit('saved', result.data.updateUser)
      }
    })
    
    // 更新失败的回调
    onUpdateError((error) => {
      console.error('更新用户失败:', error)
      alert('更新用户失败: ' + (error.message || '未知错误'))
    })
    
    return {
      isEditing,
      form,
      errors,
      loading,
      roles,
      rolesLoading,
      rolesError,
      handleSubmit
    }
  }
}
</script>