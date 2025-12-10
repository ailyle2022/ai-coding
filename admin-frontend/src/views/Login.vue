<template>
  <div class="login-container flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">管理员登录</h2>
        <p class="text-gray-500 mt-2">请输入您的账号和密码</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
          <input
            id="username"
            v-model="loginForm.username"
            type="text"
            placeholder="请输入用户名"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-accent focus:border-primary-accent transition duration-150"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-accent focus:border-primary-accent transition duration-150"
          />
        </div>

        <button
          type="submit"
          class="w-full py-2 bg-primary-accent hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-150 shadow-md"
          :disabled="loading"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div v-if="errorMessage" class="mt-6 p-4 bg-red-50 text-red-700 rounded-lg">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { gql } from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

export default {
  name: 'LoginView',
  setup () {
    const router = useRouter()
    const authStore = useAuthStore()

    const loginForm = reactive({
      username: '',
      password: ''
    })

    const errorMessage = ref('')
    const loading = ref(false)

    // 定义登录mutation
    const LOGIN_MUTATION = gql`
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          token
          user {
            id
            username
          }
          isSuccess
          message
        }
      }
    `

    const { mutate: login, loading: loginLoading, onError } = useMutation(LOGIN_MUTATION)

    // 监听登录错误
    onError((error) => {
      errorMessage.value = error.message || '网络错误，请稍后重试'
      loading.value = false
    })

    const handleLogin = async () => {
      if (!loginForm.username || !loginForm.password) {
        errorMessage.value = '请填写用户名和密码'
        return
      }

      loading.value = true
      errorMessage.value = ''

      try {
        const result = await login({
          input: {
            username: loginForm.username,
            password: loginForm.password
          }
        })

        loading.value = false

        if (result.data.login.isSuccess) {
          // 登录成功，保存token并跳转到首页
          authStore.setAuthToken(result.data.login.token)
          localStorage.setItem('user', JSON.stringify(result.data.login.user))
          router.push('/')
        } else {
          // 登录失败，显示错误信息
          errorMessage.value = result.data.login.message || '登录失败'
        }
      } catch (error) {
        loading.value = false
        errorMessage.value = error.message || '网络错误，请稍后重试'
      }
    }

    return {
      loginForm,
      errorMessage,
      loading: loginLoading,
      handleLogin
    }
  }
}
</script>

<style scoped>
/* 所有样式已通过Tailwind CSS类实现 */
</style>
