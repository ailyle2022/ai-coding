<template>
  <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <!-- 添加产品样式模态框 -->
    <EditProductStyleModal
      v-if="showAddModal"
      :productStyle="null"
      @close="showAddModal = false"
      @saved="handleProductStyleAdded"
    />

    <!-- 编辑产品样式模态框 -->
    <EditProductStyleModal
      v-if="showEditModal"
      :productStyle="editingProductStyle"
      @close="showEditModal = false"
      @saved="handleProductStyleUpdated"
    />

    <div class="flex justify-between items-center mb-6">
      <div class="text-gray-400 font-medium text-sm">共 {{ productStyles?.length || 0 }} 个产品样式</div>
      <div class="flex space-x-3">
        <div class="relative">
          <input
            type="text"
            placeholder="搜索 产品样式名称..."
            class="px-4 py-2 border border-gray-300 rounded-xl w-64 focus:ring-primary-accent focus:border-primary-accent transition duration-150 text-sm"
            v-model="searchQuery"
          >
          <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <button
          @click="addProductStyle"
          class="bg-primary-accent hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-150 shadow-md text-sm"
        >
          + 新增产品样式
        </button>
      </div>
    </div>

    <!-- 列表表格 -->
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl">产品样式名称</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">产品样式描述</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl">操作</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="productStyle in productStyles" :key="productStyle.id">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ productStyle.name }}</td>
          <td class="px-6 py-4 text-sm text-gray-500">{{ productStyle.description || '-' }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button
              @click="editProductStyle(productStyle)"
              class="text-primary-accent hover:text-blue-900 mr-4 text-sm"
            >
              编辑
            </button>
            <button
              @click="deleteProductStyle(productStyle)"
              class="text-red-500 hover:text-red-700 text-sm"
            >
              删除
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 空状态 -->
    <div v-if="!loading && (!productStyles || productStyles.length === 0)" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">暂无产品样式</h3>
      <p class="mt-1 text-sm text-gray-500">开始创建您的第一个产品样式。</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-accent"></div>
      <p class="mt-2 text-sm text-gray-500">加载中...</p>
    </div>

    <!-- 错误信息 -->
    <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4 mt-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            {{ errorMessage }}
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onActivated, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
import EditProductStyleModal from './EditProductStyleModal.vue'

export default {
  name: 'ProductStyleListView',
  components: {
    EditProductStyleModal
  },
  setup () {
    const route = useRoute()
    const router = useRouter()

    // 搜索关键词
    const searchQuery = ref('')

    // 添加产品样式相关状态
    const showAddModal = ref(false)

    // 编辑产品样式相关状态
    const showEditModal = ref(false)
    const editingProductStyle = ref(null)

    // GraphQL查询产品样式列表
    const PRODUCT_STYLES_QUERY = gql`
      query GetProductStyles {
        productStyles {
          id
          name
          description
          isActive
          createdAt
          updatedAt
        }
      }
    `

    // GraphQL删除产品样式mutation
    const DELETE_PRODUCT_STYLE_MUTATION = gql`
      mutation DeleteProductStyle($id: Int!) {
        deleteProductStyle(id: $id)
      }
    `

    // 使用Apollo查询产品样式列表
    const { result, loading, error, refetch } = useQuery(PRODUCT_STYLES_QUERY)

    // 使用Apollo删除产品样式
    const { mutate: deleteProductStyleMutation, onDone: onDeleteDone, onError: onDeleteError } = useMutation(DELETE_PRODUCT_STYLE_MUTATION)

    // 产品样式数据
    const productStyles = computed(() => {
      const allProductStyles = result.value?.productStyles || []

      if (!searchQuery.value) {
        return allProductStyles
      }

      const query = searchQuery.value.toLowerCase()
      return allProductStyles.filter(productStyle =>
        productStyle.name.toLowerCase().includes(query) ||
        (productStyle.description && productStyle.description.toLowerCase().includes(query))
      )
    })

    // 错误信息
    const errorMessage = computed(() => {
      if (error.value) {
        return '获取产品样式列表失败: ' + (error.value.message || '未知错误')
      }
      return null
    })

    // 添加产品样式
    const addProductStyle = () => {
      showAddModal.value = true
    }

    // 处理产品样式添加完成事件
    const handleProductStyleAdded = () => {
      showAddModal.value = false
      refetch()
    }

    // 编辑产品样式
    const editProductStyle = (productStyle) => {
      editingProductStyle.value = productStyle
      showEditModal.value = true
    }

    // 处理产品样式更新完成事件
    const handleProductStyleUpdated = (updatedProductStyle) => {
      showEditModal.value = false
      refetch()
    }

    // 删除产品样式
    const deleteProductStyle = async (productStyle) => {
      if (confirm(`确定要删除产品样式 ${productStyle.name} 吗？`)) {
        try {
          const result = await deleteProductStyleMutation({
            id: productStyle.id
          })

          if (result.data?.deleteProductStyle) {
            // 删除成功，刷新列表
            refetch()
          }
        } catch (err) {
          console.error('删除产品样式失败:', err)
          // 错误处理由Apollo的onError回调统一处理，避免重复提示
        }
      }
    }

    // 删除成功的回调
    onDeleteDone(() => {
      // 可以在这里添加额外的成功处理逻辑
    })

    // 删除失败的回调
    onDeleteError((error) => {
      console.error('删除产品样式失败:', error)

      // 解析错误信息
      let message = '删除产品样式失败'
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        message = error.graphQLErrors[0].message
      } else if (error.networkError) {
        message = '网络错误，请检查连接后重试'
      } else if (error.message) {
        message = error.message
      }

      // 显示友好的错误提示
      alert(message)
    })

    // 页面激活时刷新数据
    onActivated(() => {
      refetch()
    })

    // 监听路由变化，检测是否需要刷新
    watch(
      () => route.query.refresh,
      (newVal) => {
        if (newVal) {
          refetch()
          // 删除查询参数
          router.replace({ query: { ...route.query, refresh: undefined } })
        }
      },
      { immediate: true }
    )

    return {
      productStyles,
      loading,
      errorMessage,
      searchQuery,
      addProductStyle,
      editProductStyle,
      deleteProductStyle,
      refetch,
      // 添加产品样式相关
      showAddModal,
      handleProductStyleAdded,
      // 编辑产品样式相关
      showEditModal,
      editingProductStyle,
      handleProductStyleUpdated
    }
  }
}
</script>