// 认证状态管理模块
const AUTH_TOKEN_KEY = 'authToken'

export const useAuthStore = () => {
  // 获取认证令牌
  const getAuthToken = () => {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  }

  // 设置认证令牌
  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }
  }

  // 清除认证信息
  const clearAuth = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }

  // 检查是否已认证
  const isAuthenticated = () => {
    return !!getAuthToken()
  }

  return {
    getAuthToken,
    setAuthToken,
    clearAuth,
    isAuthenticated
  }
}