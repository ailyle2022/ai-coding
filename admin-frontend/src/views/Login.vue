<template>
  <div class="login-container">
    <div class="login-form">
      <h2>管理员登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名:</label>
          <input 
            id="username" 
            v-model="loginForm.username" 
            type="text" 
            placeholder="请输入用户名" 
            required
          />
        </div>
        <div class="form-group">
          <label for="password">密码:</label>
          <input 
            id="password" 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码" 
            required
          />
        </div>
        <button type="submit" class="login-button" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { gql } from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    
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
          localStorage.setItem('authToken', result.data.login.token)
          localStorage.setItem('user', JSON.stringify(result.data.login.user))
          router.push('/home')
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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.login-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #409eff;
  outline: none;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.login-button:hover:not(:disabled) {
  background-color: #337ecc;
}

.login-button:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.error-message {
  margin-top: 20px;
  padding: 10px;
  background-color: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fde2e2;
  border-radius: 4px;
  text-align: center;
}
</style>