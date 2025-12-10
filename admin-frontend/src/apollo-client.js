import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'

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

// 创建Apollo客户端实例
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

export default apolloClient
