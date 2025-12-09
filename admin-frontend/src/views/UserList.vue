<template>
  <div class="user-list-container">
    <h2>用户列表</h2>
    <div class="toolbar">
      <button class="refresh-btn" @click="loadUsers" :disabled="loading">
        {{ loading ? '刷新中...' : '刷新' }}
      </button>
    </div>
    
    <div class="table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>姓名</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>更新时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email || '-' }}</td>
            <td>{{ getUserFullName(user) }}</td>
            <td>
              <span :class="['status', { 'active': user.isActive, 'inactive': !user.isActive }]">
                {{ user.isActive ? '激活' : '未激活' }}
              </span>
            </td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>{{ formatDate(user.updatedAt) }}</td>
          </tr>
          <tr v-if="users.length === 0 && !loading">
            <td colspan="7" class="empty-row">暂无用户数据</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { gql } from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'UserList',
  setup() {
    // GraphQL查询语句
    const USERS_QUERY = gql`
      query GetUsers {
        users {
          id
          username
          email
          firstName
          lastName
          isActive
          createdAt
          updatedAt
        }
      }
    `
    
    // 使用Apollo查询用户列表
    const { result, loading, error, refetch } = useQuery(USERS_QUERY)
    
    // 用户数据
    const users = computed(() => result.value?.users || [])
    
    // 错误信息
    const errorMessage = computed(() => {
      if (error.value) {
        return '获取用户列表失败: ' + (error.value.message || '未知错误')
      }
      return null
    })
    
    // 获取用户全名
    const getUserFullName = (user) => {
      if (user.firstName || user.lastName) {
        return `${user.firstName || ''} ${user.lastName || ''}`.trim()
      }
      return '-'
    }
    
    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN')
    }
    
    // 刷新用户列表
    const loadUsers = () => {
      refetch()
    }
    
    // 页面加载时自动获取数据
    onMounted(() => {
      loadUsers()
    })
    
    return {
      users,
      loading,
      error: errorMessage,
      getUserFullName,
      formatDate,
      loadUsers
    }
  }
}
</script>

<style scoped>
.user-list-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.user-list-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.toolbar {
  margin-bottom: 20px;
  text-align: right;
}

.refresh-btn {
  padding: 8px 16px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #337ecc;
}

.refresh-btn:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.table-container {
  overflow-x: auto;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  padding: 12px 10px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
}

.user-table th {
  background-color: #f5f7fa;
  font-weight: bold;
  color: #909399;
}

.user-table tbody tr:hover {
  background-color: #f5f7fa;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status.active {
  background-color: #e1f3d8;
  color: #67c23a;
}

.status.inactive {
  background-color: #fde2e2;
  color: #f56c6c;
}

.empty-row {
  text-align: center;
  color: #909399;
  font-style: italic;
  padding: 40px 0;
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