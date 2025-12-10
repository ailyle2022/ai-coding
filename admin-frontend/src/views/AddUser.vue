<template>
  <div class="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">添加用户</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="mb-6">
        <label for="username" class="block text-sm font-medium text-gray-700 mb-2">用户名 *</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary-accent focus:border-primary-accent transition duration-150 text-base"
          placeholder="请输入用户名"
          :disabled="loading"
        />
        <div v-if="errors.username" class="mt-1 text-sm text-red-600">
          {{ errors.username }}
        </div>
      </div>
      
      <div class="mb-6">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">密码 *</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary-accent focus:border-primary-accent transition duration-150 text-base"
          placeholder="请输入密码"
          :disabled="loading"
        />
        <div v-if="errors.password" class="mt-1 text-sm text-red-600">
          {{ errors.password }}
        </div>
      </div>
      
      <div class="mb-6">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary-accent focus:border-primary-accent transition duration-150 text-base"
          placeholder="请输入邮箱"
          :disabled="loading"
        />
        <div v-if="errors.email" class="mt-1 text-sm text-red-600">
          {{ errors.email }}
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">名</label>
          <input
            id="firstName"
            v-model="form.firstName"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary-accent focus:border-primary-accent transition duration-150 text-base"
            placeholder="名"
            :disabled="loading"
          />
        </div>
        
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">姓</label>
          <input
            id="lastName"
            v-model="form.lastName"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary-accent focus:border-primary-accent transition duration-150 text-base"
            placeholder="姓"
            :disabled="loading"
          />
        </div>
      </div>
      
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="$router.back()"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition duration-150 text-base"
          :disabled="loading"
        >
          取消
        </button>
        <button
          type="submit"
          class="px-6 py-2 bg-primary-accent hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-150 shadow-md text-base"
          :disabled="loading"
        >
          {{ loading ? '提交中...' : '添加用户' }}
        </button>
      </div>
    </form>
    
    <!-- 错误信息 -->
    <div v-if="error" class="mt-6 rounded-lg bg-red-50 p-4">
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
import { ref, reactive } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
import { useRouter } from 'vue-router'

export default {
  name: 'AddUserView',
  setup() {
    const router = useRouter()
    
    // 表单数据
    const form = reactive({
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: ''
    })
    
    // 错误信息
    const errors = reactive({
      username: '',
      password: '',
      email: ''
    })
    
    // 加载状态
    const loading = ref(false)
    const error = ref(null)
    
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
        }
      }
    `
    
    const { mutate: createUser, loading: createLoading, onDone, onError } = useMutation(CREATE_USER_MUTATION)
    
    // 监听加载状态
    createLoading.value = loading
    
    // 创建成功的回调
    onDone((result) => {
      if (result.data?.createUser) {
        // 创建成功，跳转回用户列表
        router.push('/users')
      }
    })
    
    // 创建失败的回调
    onError((error) => {
      console.error('创建用户失败:', error)
      // 显示错误信息
      error.value = '创建用户失败: ' + (error.message || '未知错误')
    })
    
    // 验证表单
    const validateForm = () => {
      // 清除之前的错误
      errors.username = ''
      errors.password = ''
      errors.email = ''
      error.value = null
      
      let isValid = true
      
      // 验证用户名
      if (!form.username || form.username.trim() === '') {
        errors.username = '用户名不能为空'
        isValid = false
      } else if (form.username.trim().length > 50) {
        errors.username = '用户名长度不能超过50个字符'
        isValid = false
      }
      
      // 验证密码
      if (!form.password || form.password.trim() === '') {
        errors.password = '密码不能为空'
        isValid = false
      } else if (form.password.length < 6) {
        errors.password = '密码长度不能少于6个字符'
        isValid = false
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
        await createUser({
          input: {
            username: form.username.trim(),
            password: form.password,
            email: form.email.trim() || undefined,
            firstName: form.firstName.trim() || undefined,
            lastName: form.lastName.trim() || undefined,
            isActive: true
          }
        })
      } catch (err) {
        console.error('创建用户失败:', err)
        // 错误处理由Apollo的onError回调统一处理，避免重复提示
      }
    }
    
    return {
      form,
      errors,
      loading,
      error,
      handleSubmit
    }
  }
}
</script>