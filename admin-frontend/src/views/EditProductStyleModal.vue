<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- 背景遮罩 -->
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <!-- 居中对话框 -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {{ isEditing ? $t('productStyles.editProductStyle') : $t('productStyles.addProductStyle') }}
              </h3>

              <div class="mt-4 space-y-4">
                <div>
                  <label for="productStyleName" class="block text-sm font-medium text-gray-700 mb-1">
                    {{$t('productStyles.name')}} *
                  </label>
                  <input
                    id="productStyleName"
                    type="text"
                    v-model="form.name"
                    :disabled="isEditing"
                    :class="{'border-red-500': errors.name, 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-accent focus:border-primary-accent': true}"
                    :placeholder="$t('productStyles.namePlaceholder')"
                  >
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>

                <div>
                  <label for="productStyleDescription" class="block text-sm font-medium text-gray-700 mb-1">
                    {{$t('productStyles.description')}}
                  </label>
                  <textarea
                    id="productStyleDescription"
                    v-model="form.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-accent focus:border-primary-accent"
                    :placeholder="$t('productStyles.descriptionPlaceholder')"
                  ></textarea>
                  <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
                </div>
                
                <div class="flex items-center">
                  <input
                    id="productStyleIsActive"
                    type="checkbox"
                    v-model="form.isActive"
                    class="h-4 w-4 text-primary-accent focus:ring-blue-500 border-gray-300 rounded"
                  >
                  <label for="productStyleIsActive" class="ml-2 block text-sm text-gray-700">
                    {{$t('common.status')}}
                  </label>
                </div>
                
                <!-- 错误信息展示区域 -->
                <div v-if="mutationError" class="rounded-md bg-red-50 p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800">
                        {{ mutationError }}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            :disabled="loading"
            @click="handleSubmit"
            class="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-primary-accent text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            {{ loading ? $t('common.saving') : $t('common.save') }}
          </button>
          <button
            type="button"
            :disabled="loading"
            @click="$emit('close')"
            class="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            {{ $t('common.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'

export default {
  name: 'EditProductStyleModal',
  props: {
    productStyle: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'saved'],
  setup (props, { emit }) {
    // 是否为编辑模式
    const isEditing = ref(!!props.productStyle)

    // 表单数据
    const form = reactive({
      name: '',
      description: '',
      isActive: true
    })

    // 错误信息
    const errors = reactive({
      name: '',
      description: ''
    })
    
    // 变更操作错误信息
    const mutationError = ref('')

    // 清除错误信息
    const clearErrors = () => {
      errors.name = ''
      errors.description = ''
      mutationError.value = ''
    }

    // 初始化表单数据
    onMounted(() => {
      if (props.productStyle) {
        form.name = props.productStyle.name
        form.description = props.productStyle.description || ''
        form.isActive = props.productStyle.isActive !== undefined ? props.productStyle.isActive : true
      }
    })

    // GraphQL创建产品样式mutation
    const CREATE_PRODUCT_STYLE_MUTATION = gql`
      mutation CreateProductStyle($input: CreateProductStyleInput!) {
        createProductStyle(input: $input) {
          id
          name
          description
          isActive
          createdAt
          updatedAt
        }
      }
    `

    // GraphQL更新产品样式mutation
    const UPDATE_PRODUCT_STYLE_MUTATION = gql`
      mutation UpdateProductStyle($id: Int!, $input: UpdateProductStyleInput!) {
        updateProductStyle(id: $id, input: $input) {
          id
          name
          description
          isActive
          createdAt
          updatedAt
        }
      }
    `

    // 使用Apollo创建产品样式
    const { mutate: createProductStyle, loading: createLoading, onDone: onCreateDone, onError: onCreateError } = useMutation(CREATE_PRODUCT_STYLE_MUTATION)

    // 使用Apollo更新产品样式
    const { mutate: updateProductStyle, loading: updateLoading, onDone: onUpdateDone, onError: onUpdateError } = useMutation(UPDATE_PRODUCT_STYLE_MUTATION)

    // 加载状态
    const loading = computed(() => createLoading.value || updateLoading.value)

    // 表单验证
    const validateForm = () => {
      clearErrors()

      let isValid = true

      if (!form.name.trim()) {
        errors.name = '产品样式名称不能为空'
        isValid = false
      }

      return isValid
    }

    // 提交表单
    const handleSubmit = async () => {
      if (!validateForm()) {
        return
      }

      try {
        if (isEditing.value) {
          // 编辑模式
          const result = await updateProductStyle({
            id: props.productStyle.id,
            input: {
              description: form.description,
              isActive: form.isActive
            }
          })

          if (result.data?.updateProductStyle) {
            emit('saved', result.data.updateProductStyle)
          }
        } else {
          // 创建模式
          const result = await createProductStyle({
            input: {
              name: form.name,
              description: form.description,
              isActive: form.isActive
            }
          })

          if (result.data?.createProductStyle) {
            emit('saved', result.data.createProductStyle)
          }
        }
      } catch (err) {
        console.error('保存产品样式失败:', err)
        // 错误处理由Apollo的onError回调统一处理，避免重复提示
      }
    }

    // 创建成功的回调
    onCreateDone((result) => {
      // 成功消息由全局处理
    })

    // 创建失败的回调
    onCreateError((error) => {
      console.error('创建产品样式失败:', error)
      
      // 解析错误信息
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        mutationError.value = error.graphQLErrors[0].message
      } else if (error.networkError) {
        // 检查是否是连接错误
        if (error.networkError.message && error.networkError.message.includes('UNAVAILABLE') && error.networkError.message.includes('ECONNREFUSED')) {
          mutationError.value = '无法连接到后端服务，请检查服务是否正在运行'
        } else {
          mutationError.value = '网络错误，请检查连接后重试'
        }
      } else if (error.message) {
        mutationError.value = error.message
      } else {
        mutationError.value = '创建产品样式失败'
      }
    })

    // 更新成功的回调
    onUpdateDone((result) => {
      // 成功消息由全局处理
    })

    // 更新失败的回调
    onUpdateError((error) => {
      console.error('更新产品样式失败:', error)

      // 解析错误信息
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        mutationError.value = error.graphQLErrors[0].message
      } else if (error.networkError) {
        // 检查是否是连接错误
        if (error.networkError.message && error.networkError.message.includes('UNAVAILABLE') && error.networkError.message.includes('ECONNREFUSED')) {
          mutationError.value = '无法连接到后端服务，请检查服务是否正在运行'
        } else {
          mutationError.value = '网络错误，请检查连接后重试'
        }
      } else if (error.message) {
        mutationError.value = error.message
      } else {
        mutationError.value = '更新产品样式失败'
      }
    })

    return {
      isEditing,
      form,
      errors,
      mutationError,
      loading,
      handleSubmit
    }
  }
}
</script>