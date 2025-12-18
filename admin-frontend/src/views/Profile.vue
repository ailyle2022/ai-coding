<template>
  <div class="profile-container">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ $t('profile.title') }}</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- 修改密码卡片 -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('profile.changePassword') }}</h2>
          <form @submit.prevent="handleChangePassword" class="space-y-4">
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('profile.currentPassword') }}
              </label>
              <input
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                type="password"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-accent focus:border-primary-accent transition duration-150"
                :placeholder="$t('profile.currentPasswordPlaceholder')"
              />
            </div>
            
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('profile.newPassword') }}
              </label>
              <input
                id="newPassword"
                v-model="passwordForm.newPassword"
                type="password"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-accent focus:border-primary-accent transition duration-150"
                :placeholder="$t('profile.newPasswordPlaceholder')"
              />
            </div>
            
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('profile.confirmPassword') }}
              </label>
              <input
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                type="password"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-accent focus:border-primary-accent transition duration-150"
                :placeholder="$t('profile.confirmPasswordPlaceholder')"
              />
            </div>
            
            <button
              type="submit"
              :disabled="changingPassword"
              class="w-full py-2 bg-primary-accent hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-150 shadow-md disabled:opacity-50"
            >
              {{ changingPassword ? $t('profile.changingPassword') : $t('profile.changePasswordButton') }}
            </button>
          </form>
          
          <div v-if="passwordMessage" :class="[
            'mt-4 p-4 rounded-lg',
            passwordError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          ]">
            {{ passwordMessage }}
          </div>
        </div>
        
        <!-- MFA设置卡片 -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('profile.mfaSettings') }}</h2>
          
          <div v-if="loadingUser" class="mb-4 p-4 bg-blue-50 text-blue-700 rounded-lg">
            <p>{{ $t('profile.loadingUserInfo') }}</p>
          </div>
          
          <div v-else-if="currentUser && currentUser.mfaEnabled" class="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
            <p>{{ $t('profile.mfaEnabled') }}</p>
          </div>
          
          <div v-else class="mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-lg">
            <p>{{ $t('profile.mfaDisabled') }}</p>
          </div>
          
          <button
            @click="goToMFASetup"
            class="w-full py-2 bg-primary-accent hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-150 shadow-md"
          >
            {{ (currentUser && currentUser.mfaEnabled) ? $t('profile.reconfigureMFA') : $t('profile.configureMFA') }}
          </button>
        </div>
        
        <!-- 退出登录卡片 -->
        <div class="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('profile.logoutSection') }}</h2>
          <p class="text-gray-600 mb-4">{{ $t('profile.logoutDescription') }}</p>
          <button
            @click="handleLogout"
            class="py-2 px-6 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-150 shadow-md"
          >
            {{ $t('profile.logoutButton') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, watch, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useQuery, useApolloClient, useMutation } from '@vue/apollo-composable'
import { useI18n } from 'vue-i18n'
import { gql } from 'graphql-tag'

export default {
  name: 'ProfileView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const { t } = useI18n()
    const { client } = useApolloClient()
    
    const passwordForm = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    const changingPassword = ref(false)
    const passwordMessage = ref('')
    const passwordError = ref(false)
    
    // 用户信息相关
    const currentUser = ref(null)
    const loadingUser = ref(true)
    const userError = ref(null)
    
    // GraphQL查询用户信息
    const GET_CURRENT_USER = gql`
      query GetCurrentUser {
        getCurrentUser {
          id
          username
          email
          firstName
          lastName
          isActive
          mfaEnabled
          createdAt
          updatedAt
        }
      }
    `
    
    // GraphQL修改密码mutation
    const CHANGE_PASSWORD = gql`
      mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
        changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
          isSuccess
          message
        }
      }
    `
    
    // 使用useQuery获取当前用户信息
    const { result: currentUserResult, loading: currentUserLoading, error: currentUserError, refetch: refetchCurrentUser } = useQuery(GET_CURRENT_USER)
    
    // 监听查询结果变化
    watch(currentUserResult, (data) => {
      if (data && data.getCurrentUser) {
        currentUser.value = data.getCurrentUser
      }
    })
    
    // 监听加载状态
    watch(currentUserLoading, (loading) => {
      loadingUser.value = loading
    })
    
    // 监听错误
    watch(currentUserError, (error) => {
      if (error) {
        userError.value = error.message || t('profile.loadUserInfoFailed')
        console.error(t('profile.loadUserInfoFailed'), error)
      }
    })
    
    // 当组件被激活时（例如通过路由切换回来），重新获取用户信息
    onActivated(() => {
      // 使用nextTick确保DOM更新后再执行刷新
      setTimeout(() => {
        loadCurrentUser()
      }, 0)
    })
    
    const { mutate: changePasswordMutate } = useMutation(CHANGE_PASSWORD)
    
    // 获取当前用户信息
    const loadCurrentUser = async () => {
      try {
        userError.value = null
        const result = await refetchCurrentUser()
        // 确保结果被正确处理
        if (result.data && result.data.getCurrentUser) {
          currentUser.value = result.data.getCurrentUser
          loadingUser.value = false
        }
      } catch (err) {
        userError.value = err.message || t('profile.loadUserInfoFailed')
        loadingUser.value = false
        console.error(t('profile.loadUserInfoFailed'), err)
      }
    }
    
    const handleChangePassword = async () => {
      // 简单的表单验证
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        passwordMessage.value = t('profile.passwordMismatch')
        passwordError.value = true
        return
      }
      
      if (passwordForm.newPassword.length < 6) {
        passwordMessage.value = t('profile.passwordTooShort')
        passwordError.value = true
        return
      }
      
      changingPassword.value = true
      passwordMessage.value = ''
      passwordError.value = false
      
      try {
        // 调用修改密码mutation
        const result = await changePasswordMutate({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
        
        // 根据新的响应格式处理结果
        if (result.data.changePassword.isSuccess) {
          changingPassword.value = false
          passwordMessage.value = t('profile.passwordChangedSuccess')
          passwordError.value = false
          
          // 清空表单
          passwordForm.currentPassword = ''
          passwordForm.newPassword = ''
          passwordForm.confirmPassword = ''
        } else {
          // 处理失败情况
          changingPassword.value = false
          passwordMessage.value = result.data.changePassword.message
          passwordError.value = true
        }
      } catch (err) {
        changingPassword.value = false
        passwordMessage.value = err.message || t('profile.passwordChangeFailed')
        passwordError.value = true
        console.error(t('profile.passwordChangeFailed'), err)
      }
    }
    
    const goToMFASetup = () => {
      router.push('/mfa-setup')
    }
    
    const handleLogout = () => {
      // 清除认证信息
      authStore.clearAuth()
      localStorage.removeItem('user')
      
      // 跳转到登录页
      router.push('/login')
    }
    
    return {
      passwordForm,
      changingPassword,
      passwordMessage,
      passwordError,
      currentUser,
      loadingUser,
      userError,
      handleChangePassword,
      goToMFASetup,
      handleLogout,
      loadCurrentUser,
      t
    }
  }
}
</script>

<style scoped>
.profile-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>