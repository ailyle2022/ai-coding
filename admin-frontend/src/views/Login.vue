<template>
  <div class="login-container flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">{{ $t('login.login') }}</h2>
      </div>

      <!-- 第一步：用户名和密码登录 -->
      <form v-if="!showMFA" @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('login.username') }}</label>
          <input
            id="username"
            v-model="loginForm.username"
            type="text"
            :placeholder="$t('login.usernameRequired')"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-accent focus:border-primary-accent transition duration-150"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('login.password') }}</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            :placeholder="$t('login.passwordRequired')"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-accent focus:border-primary-accent transition duration-150"
          />
        </div>

        <button
          type="submit"
          class="w-full py-2 bg-primary-accent hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-150 shadow-md"
          :disabled="loading"
        >
          {{ loading ? $t('login.login') + '...' : $t('login.login') }}
        </button>
      </form>

      <!-- 第二步：MFA验证 -->
      <form v-else @submit.prevent="handleMFAVerify" class="space-y-6">
        <div>
          <label for="mfaCode" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('login.mfaCode') }}</label>
          <input
            id="mfaCode"
            v-model="mfaForm.mfaCode"
            type="text"
            :placeholder="$t('login.mfaCodePlaceholder')"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-accent focus:border-primary-accent transition duration-150"
            maxlength="6"
          />
          <p class="mt-2 text-sm text-gray-500">{{ $t('login.mfaCodeDescription') }}</p>
        </div>

        <div class="flex space-x-4">
          <button
            type="button"
            @click="cancelMFA"
            class="flex-1 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition duration-150"
          >
            {{ $t('login.cancel') }}
          </button>
          <button
            type="submit"
            class="flex-1 py-2 bg-primary-accent hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-150 shadow-md"
            :disabled="loading"
          >
            {{ loading ? $t('login.verifying') : $t('login.verify') }}
          </button>
        </div>
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

    const mfaForm = reactive({
      mfaCode: ''
    })

    const errorMessage = ref('')
    const loading = ref(false)
    const showMFA = ref(false)
    const mfaChallengeId = ref('')

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
          mfaChallengeId
        }
      }
    `

    // 定义MFA验证mutation
    const VERIFY_MFA_MUTATION = gql`
      mutation VerifyMFA($input: MFAVerifyInput!) {
        verifyMFA(input: $input) {
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
    const { mutate: verifyMFA } = useMutation(VERIFY_MFA_MUTATION)

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
          // 检查是否需要MFA验证
          if (result.data.login.message === 'MFA_REQUIRED' && result.data.login.mfaChallengeId) {
            // 显示MFA验证界面
            showMFA.value = true
            mfaChallengeId.value = result.data.login.mfaChallengeId
            mfaForm.mfaCode = ''
          } else {
            // 其他登录失败情况
            errorMessage.value = result.data.login.message || '登录失败'
          }
        }
      } catch (error) {
        loading.value = false
        errorMessage.value = error.message || '网络错误，请稍后重试'
      }
    }

    const handleMFAVerify = async () => {
      if (!mfaForm.mfaCode || mfaForm.mfaCode.length !== 6) {
        errorMessage.value = '请输入6位验证码'
        return
      }

      loading.value = true
      errorMessage.value = ''

      try {
        const result = await verifyMFA({
          input: {
            mfaChallengeId: mfaChallengeId.value,
            mfaCode: mfaForm.mfaCode
          }
        })

        loading.value = false

        if (result.data.verifyMFA.isSuccess) {
          // MFA验证成功，保存token并跳转到首页
          authStore.setAuthToken(result.data.verifyMFA.token)
          localStorage.setItem('user', JSON.stringify(result.data.verifyMFA.user))
          router.push('/')
        } else {
          // MFA验证失败
          errorMessage.value = result.data.verifyMFA.message || '验证失败'
        }
      } catch (error) {
        loading.value = false
        errorMessage.value = error.message || '网络错误，请稍后重试'
      }
    }

    const cancelMFA = () => {
      showMFA.value = false
      mfaForm.mfaCode = ''
      mfaChallengeId.value = ''
      errorMessage.value = ''
    }

    return {
      loginForm,
      mfaForm,
      errorMessage,
      loading: loginLoading,
      showMFA,
      handleLogin,
      handleMFAVerify,
      cancelMFA
    }
  }
}
</script>

<style scoped>
/* 所有样式已通过Tailwind CSS类实现 */
</style>