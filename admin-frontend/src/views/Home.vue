<template>
  <div class="home-container">
    <header class="header">
      <h1>管理后台</h1>
      <div class="user-info">
        <span>欢迎, {{ user.username }}!</span>
        <button @click="handleLogout" class="logout-button">退出登录</button>
      </div>
    </header>
    <main class="main-content">
      <div class="welcome-section">
        <h2>欢迎来到管理后台</h2>
        <p>您已成功登录系统。</p>
      </div>
      <div class="stats-section">
        <div class="stat-card">
          <h3>用户总数</h3>
          <p>1,234</p>
        </div>
        <div class="stat-card">
          <h3>订单数量</h3>
          <p>567</p>
        </div>
        <div class="stat-card">
          <h3>今日访问</h3>
          <p>89</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      user: {}
    };
  },
  mounted() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    } else {
      // 如果没有用户信息，重定向到登录页
      this.$router.push('/login');
    }
  },
  methods: {
    handleLogout() {
      // 清除本地存储的认证信息
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // 跳转到登录页
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
  color: #333;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logout-button {
  padding: 8px 16px;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #e64a19;
}

.main-content {
  padding: 40px;
}

.welcome-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.welcome-section h2 {
  margin-top: 0;
  color: #333;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  margin-top: 0;
  color: #666;
}

.stat-card p {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin: 10px 0 0;
}
</style>