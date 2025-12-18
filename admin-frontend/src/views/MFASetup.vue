<template>
  <div class="mfa-setup-container flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">{{ $t('mfa.setupTitle') }}</h2>
        <p class="text-gray-600 mt-2">{{ $t('mfa.setupDescription') }}</p>
      </div>

      <!-- Step 1: Setup MFA and show QR code -->
      <div v-if="step === 1" class="space-y-6">
        <div v-if="!mfaSetup" class="text-center">
          <p class="text-gray-700 mb-6">{{ $t('mfa.setupMFAInstruction') }}</p>
          <button
            @click="setupMFA"
            :disabled="settingUpMFA"
            class="w-full py-2 bg-primary-accent hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-150 shadow-md"
          >
            {{ settingUpMFA ? $t('mfa.settingUp') : $t('mfa.setupMFA') }}
          </button>
        </div>
        
        <div v-else class="bg-gray-100 p-4 rounded-lg text-center">
          <p class="text-gray-700 mb-4">{{ $t('mfa.scanQRCode') }}</p>
          <div class="flex justify-center">
            <canvas ref="qrCanvas" class="border p-2 bg-white" width="200" height="200"></canvas>
          </div>
          <p class="text-gray-700 mt-4">{{ $t('mfa.orEnterKey') }}</p>
          <p class="font-mono text-sm bg-gray-200 p-2 rounded mt-2 break-all">{{ secretKey }}</p>
        </div>

        <div v-if="mfaSetup" class="flex space-x-4">
          <button
            @click="prevStep"
            class="flex-1 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition duration-150"
          >
            {{ $t('mfa.back') }}
          </button>
          <button
            @click="nextStep"
            class="flex-1 py-2 bg-primary-accent hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-150 shadow-md"
          >
            {{ $t('mfa.next') }}
          </button>
        </div>

        <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {{ errorMessage }}
        </div>
      </div>

      <!-- Step 2: Verify MFA code -->
      <div v-else-if="step === 2" class="space-y-6">
        <div>
          <label for="mfaCode" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('mfa.enterCode') }}</label>
          <input
            id="mfaCode"
            v-model="mfaCode"
            type="text"
            :placeholder="$t('mfa.codePlaceholder')"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-accent focus:border-primary-accent transition duration-150"
            maxlength="6"
          />
        </div>

        <div class="flex space-x-4">
          <button
            @click="prevStep"
            class="flex-1 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition duration-150"
          >
            {{ $t('mfa.back') }}
          </button>
          <button
            @click="confirmMFA"
            :disabled="confirming"
            class="flex-1 py-2 bg-primary-accent hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-150 shadow-md disabled:opacity-50"
          >
            {{ confirming ? $t('mfa.confirming') : $t('mfa.confirm') }}
          </button>
        </div>

        <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {{ errorMessage }}
        </div>
      </div>

      <!-- Step 3: Success -->
      <div v-else-if="step === 3" class="space-y-6 text-center">
        <div class="text-green-500 text-5xl mb-4">✓</div>
        <h3 class="text-2xl font-bold text-gray-900">{{ $t('mfa.successTitle') }}</h3>
        <p class="text-gray-600">{{ $t('mfa.successMessage') }}</p>
        <button
          @click="finishSetup"
          class="w-full py-2 bg-primary-accent hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-150 shadow-md"
        >
          {{ $t('mfa.finish') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { gql } from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import QRCode from 'qrcode'

export default {
  name: 'MFASetupView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const step = ref(1)
    const mfaCode = ref('')
    const secretKey = ref('')
    const qrCanvas = ref(null)
    const errorMessage = ref('')
    const confirming = ref(false)
    const settingUpMFA = ref(false)
    const mfaSetup = ref(false)
    const mfaChallengeId = ref('')
    
    // Define setup MFA mutation
    const SETUP_MFA = gql`
      mutation SetupMFA($userId: Int!) {
        setupMFA(userId: $userId) {
          secret
          uri
          mfaChallengeId
        }
      }
    `
    
    // Define confirm MFA mutation
    const CONFIRM_MFA = gql`
      mutation ConfirmMFA($input: MFAVerifyInput!) {
        confirmMFA(input: $input) {
          isSuccess
          message
        }
      }
    `
    
    const { mutate: setupMFARequest } = useMutation(SETUP_MFA)
    const { mutate: confirmMFARequest } = useMutation(CONFIRM_MFA)
    
    const setupMFA = async () => {
      settingUpMFA.value = true
      errorMessage.value = ''
      
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const userId = user.id
        
        // 调用后端设置MFA接口
        const result = await setupMFARequest({
          userId: userId
        })
        
        if (result.data.setupMFA) {
          // 成功设置后，从后端响应中获取secret和挑战ID
          mfaSetup.value = true
          secretKey.value = result.data.setupMFA.secret
          mfaChallengeId.value = result.data.setupMFA.mfaChallengeId
        } else {
          errorMessage.value = '设置MFA失败'
        }
      } catch (error) {
        errorMessage.value = error.message || '网络错误，请稍后重试'
      } finally {
        settingUpMFA.value = false
      }
    }
    
    const generateQRCode = () => {
      if (qrCanvas.value && secretKey.value) {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const qrText = `otpauth://totp/AdminGateway:${user.username}?secret=${secretKey.value}&issuer=AdminGateway`
        
        // Clear canvas first
        const ctx = qrCanvas.value.getContext('2d')
        ctx.clearRect(0, 0, qrCanvas.value.width, qrCanvas.value.height)
        
        QRCode.toCanvas(qrCanvas.value, qrText, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        }, (error) => {
          if (error) console.error('QR Code generation error:', error)
        })
      }
    }
    
    // Watch for changes in mfaSetup and secretKey to generate QR code
    watch([mfaSetup, secretKey], () => {
      if (mfaSetup.value && secretKey.value) {
        // Use nextTick to ensure DOM is updated
        setTimeout(() => {
          generateQRCode()
        }, 0)
      }
    })
    
    const nextStep = () => {
      step.value++
    }
    
    const prevStep = () => {
      if (step.value === 2 && mfaSetup.value) {
        step.value = 1
      } else if (step.value > 1) {
        step.value--
      }
      errorMessage.value = ''
    }
    
    const confirmMFA = async () => {
      if (!mfaCode.value || mfaCode.value.length !== 6) {
        errorMessage.value = '请输入6位验证码'
        return
      }
      
      confirming.value = true
      errorMessage.value = ''
      
      try {
        // 调用后端确认MFA接口
        const result = await confirmMFARequest({
          input: {
            mfaChallengeId: mfaChallengeId.value,
            mfaCode: mfaCode.value
          }
        })
        
        if (result.data.confirmMFA.isSuccess) {
          // MFA设置成功
          confirming.value = false
          step.value = 3
        } else {
          errorMessage.value = result.data.confirmMFA.message || '验证失败'
          confirming.value = false
        }
      } catch (error) {
        errorMessage.value = error.message || '网络错误，请稍后重试'
        confirming.value = false
      }
    }
    
    const finishSetup = () => {
      // Redirect to profile page after successful MFA setup
      router.push('/profile')
    }
    
    return {
      step,
      mfaCode,
      secretKey,
      qrCanvas,
      errorMessage,
      confirming,
      settingUpMFA,
      mfaSetup,
      setupMFA,
      nextStep,
      prevStep,
      confirmMFA,
      finishSetup
    }
  }
}
</script>

<style scoped>
/* Styles are implemented with Tailwind CSS classes */
</style>