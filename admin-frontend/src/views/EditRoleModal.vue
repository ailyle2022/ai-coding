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
                编辑角色
              </h3>
              
              <div class="mt-4 space-y-4">
                <div>
                  <label for="roleName" class="block text-sm font-medium text-gray-700 mb-1">
                    角色名称 *
                  </label>
                  <input
                    id="roleName"
                    type="text"
                    v-model="form.name"
                    :class="{'border-red-500': errors.name, 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-accent focus:border-primary-accent': true}"
                    placeholder="请输入角色名称"
                  >
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>
                
                <div>
                  <label for="roleDescription" class="block text-sm font-medium text-gray-700 mb-1">
                    角色描述
                  </label>
                  <textarea
                    id="roleDescription"
                    v-model="form.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-accent focus:border-primary-accent"
                    placeholder="请输入角色描述"
                  ></textarea>
                  <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
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
            {{ loading ? '保存中...' : '保存' }}
          </button>
          <button
            type="button"
            :disabled="loading"
            @click="$emit('close')"
            class="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'

export default {
  name: 'EditRoleModal',
  props: {
    role: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    // 表单数据
    const form = reactive({
      name: '',
      description: ''
    })
    
    // 错误信息
    const errors = reactive({
      name: '',
      description: ''
    })
    
    // 加载状态
    const loading = ref(false)
    
    // GraphQL更新角色mutation
    const UPDATE_ROLE_MUTATION = gql`
      mutation UpdateRole($id: Int!, $input: UpdateRoleInput!) {
        updateRole(id: $id, input: $input) {
          id
          name
          description
          createdAt
        }
      }
    `
    
    const { mutate: updateRole, loading: updateLoading, onDone, onError } = useMutation(UPDATE_ROLE_MUTATION)
    
    // 监听加载状态
    watch(updateLoading, (isLoading) => {
      loading.value = isLoading
    })
    
    // 初始化表单数据
    onMounted(() => {
      form.name = props.role.name
      form.description = props.role.description || ''
    })
    
    // 验证表单
    const validateForm = () => {
      // 清除之前的错误
      errors.name = ''
      errors.description = ''
      
      let isValid = true
      
      // 验证角色名称
      if (!form.name || form.name.trim() === '') {
        errors.name = '角色名称不能为空'
        isValid = false
      } else if (form.name.trim().length > 50) {
        errors.name = '角色名称长度不能超过50个字符'
        isValid = false
      }
      
      // 验证角色描述
      if (form.description && form.description.trim().length > 500) {
        errors.description = '角色描述长度不能超过500个字符'
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
        const result = await updateRole({
          id: props.role.id,
          input: {
            name: form.name.trim(),
            description: form.description.trim() || undefined
          }
        })
        
        if (result.data?.updateRole) {
          // 更新成功
          emit('saved', result.data.updateRole)
        }
      } catch (err) {
        console.error('更新角色失败:', err)
        // 错误处理由Apollo的onError回调统一处理，避免重复提示
      }
    }
    
    // 更新成功的回调
    onDone((result) => {
      if (result.data?.updateRole) {
        emit('saved', result.data.updateRole)
      }
    })
    
    // 更新失败的回调
    onError((error) => {
      console.error('更新角色失败:', error)
      alert('更新角色失败: ' + (error.message || '未知错误'))
    })
    
    return {
      form,
      errors,
      loading,
      handleSubmit
    }
  }
}
</script>