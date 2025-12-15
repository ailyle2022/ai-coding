import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { useAuthStore } from './store/auth'
import router from './router'

// 创建HTTP链接指向GraphQL端点
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql' // 根据实际情况调整端口
})

// 添加认证中间件
const authLink = setContext((_, { headers }) => {
  // 获取存储在localStorage中的token
  const token = localStorage.getItem('authToken')

  // 返回请求头
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

// 错误处理中间件
const errorLink = onError(({ networkError, operation, forward }) => {
  if (networkError && networkError.statusCode === 401) {
    // 清除本地认证信息
    const authStore = useAuthStore()
    authStore.clearAuth()
    
    // 重定向到登录页
    router.push('/login')
  }
})

// 创建Apollo客户端实例
const apolloClient = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache()
})

export default apolloClient