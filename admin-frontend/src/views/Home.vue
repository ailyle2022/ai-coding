<template>
  <div class="home">
    <div class="header">
      <h1>管理员后台</h1>
      <nav class="navigation">
        <router-link to="/">首页</router-link>
        <router-link to="/users">用户管理</router-link>
        <a href="#" @click="logout">退出登录</a>
      </nav>
    </div>
    
    <div class="content">
      <HelloWorld msg="欢迎使用管理员后台系统"/>
    </div>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  methods: {
    logout() {
      // 清除本地存储的认证信息
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      
      // 跳转到登录页面
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.header h1 {
  margin: 0;
  color: #333;
}

.navigation a {
  margin-left: 20px;
  text-decoration: none;
  color: #409eff;
  font-weight: 500;
}

.navigation a:hover {
  color: #337ecc;
}

.content {
  max-width: 800px;
  margin: 0 auto;
}
</style>