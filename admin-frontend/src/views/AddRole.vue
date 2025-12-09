<template>
  <div class="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">添加角色</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="mb-6">
        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">角色名称 *</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary-accent focus:border-primary-accent transition duration-150 text-base"
          placeholder="请输入角色名称"
          :disabled="loading"
        />
        <div v-if="errors.name" class="mt-1 text-sm text-red-600">
          {{ errors.name }}
        </div>
      </div>
      
      <div class="mb-6">
        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">角色描述</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="4"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary-accent focus:border-primary-accent transition duration-150 text-base"
          placeholder="请输入角色描述"
          :disabled="loading"
        ></textarea>
        <div v-if="errors.description" class="mt-1 text-sm text-red-600">
          {{ errors.description }}
        </div>
      </div>
      
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="$router.back()"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition duration-150 text-base"
          :disabled="loading"
        >
          取消
        </button>
        <button
          type="submit"
          class="px-6 py-2 bg-primary-accent hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-150 shadow-md text-base"
          :disabled="loading"
        >
          {{ loading ? '提交中...' : '添加角色' }}
        </button>
      </div>
    </form>
    
    <div v-if="error" class="mt-6 p-4 bg-red-50 text-red-700 rounded-lg text-base">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { gql } from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable'
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AddRoleView',
  setup() {
    const router = useRouter()
    
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
    
    const error = ref('')
    const loading = ref(false)
    
    // GraphQL创建角色mutation
    const CREATE_ROLE_MUTATION = gql`
      mutation CreateRole($input: CreateRoleInput!) {
        createRole(input: $input) {
          id
          name
          description
          createdAt
        }
      }
    `
    
    const { mutate: createRole } = useMutation(CREATE_ROLE_MUTATION)
    
    // 验证表单
    const validateForm = () => {
      // 清除之前的错误
      errors.name = ''
      errors.description = ''
      error.value = ''
      
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
      
      loading.value = true
      error.value = ''
      
      try {
        const result = await createRole({
          input: {
            name: form.name.trim(),
            description: form.description.trim() || undefined
          }
        })
        
        if (result.data?.createRole) {
          // 添加成功，返回角色列表页面
          router.push('/roles?refresh=true')
        }
      } catch (err) {
        console.error('添加角色失败:', err)
        error.value = err.message || '添加角色失败，请稍后重试'
      } finally {
        loading.value = false
      }
    }
    
    return {
      form,
      errors,
      error,
      loading,
      handleSubmit
    }
  }
}
</script>

<style scoped>
/* 所有样式已通过Tailwind CSS类实现 */
</style>