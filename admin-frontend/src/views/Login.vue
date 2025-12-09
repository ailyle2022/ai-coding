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
        <button type="submit" class="login-button">登录</button>
      </form>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        // 这里应该调用真实的API，暂时使用模拟数据
        const response = await this.mockLogin(this.loginForm);
        
        if (response.isSuccess) {
          // 登录成功，保存token并跳转到首页
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.$router.push('/home');
        } else {
          // 登录失败，显示错误信息
          this.errorMessage = response.message || '登录失败';
        }
      } catch (error) {
        this.errorMessage = '网络错误，请稍后重试';
      }
    },
    
    // 模拟登录API调用
    mockLogin(credentials) {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (credentials.username === 'admin' && credentials.password === 'admin') {
            resolve({
              isSuccess: true,
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIn0.5fF9f2vYHQVyzmy6K0sJiMS7qNgqMV7w',
              user: {
                id: 1,
                username: 'admin'
              }
            });
          } else {
            resolve({
              isSuccess: false,
              message: '用户名或密码错误'
            });
          }
        }, 1000);
      });
    }
  }
};
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

.login-button:hover {
  background-color: #337ecc;
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