<template>
  <div class="min-h-screen bg-background-dark text-white flex items-center justify-center px-6">
    <div class="w-full max-w-md">

      <!-- Processing -->
      <div v-if="processing" class="text-center">
        <div class="h-16 w-16 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent mb-6"></div>
        <p class="text-text-secondary">Validating reset link...</p>
      </div>

      <!-- Invalid link -->
      <div v-else-if="invalidLink" class="bg-surface-dark border border-surface-border rounded-2xl p-8 text-center">
        <div class="h-20 w-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-5xl text-red-400">link_off</span>
        </div>
        <h2 class="text-2xl font-bold mb-2">Invalid Reset Link</h2>
        <p class="text-text-secondary mb-6">This password reset link is missing required parameters. It may have been truncated.</p>
        <NuxtLink
          to="/forgot-password"
          class="inline-flex items-center gap-2 py-3 px-6 bg-primary hover:bg-primary-dark text-background-dark font-bold rounded-xl transition-all"
        >
          Request a New Link
        </NuxtLink>
      </div>

      <!-- Success -->
      <div v-else-if="success" class="bg-surface-dark border border-surface-border rounded-2xl p-8 text-center">
        <div class="h-20 w-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-5xl text-primary">lock_reset</span>
        </div>
        <h2 class="text-2xl font-bold mb-2">Password Reset!</h2>
        <p class="text-text-secondary mb-8">
          Your password has been updated successfully. You can now sign in with your new password.
        </p>
        <NuxtLink
          to="/login"
          class="inline-flex items-center gap-2 py-3 px-6 bg-primary hover:bg-primary-dark text-background-dark font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(18,226,105,0.2)]"
        >
          <span class="material-symbols-outlined">login</span>
          Sign In
        </NuxtLink>
      </div>

      <!-- Reset Form -->
      <div v-else class="bg-surface-dark border border-surface-border rounded-2xl p-8">
        <h2 class="text-2xl font-bold mb-2">Set New Password</h2>
        <p class="text-text-secondary mb-8">Choose a strong password for your account.</p>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- New Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">New Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="8"
                autocomplete="new-password"
                class="w-full px-4 py-3 bg-background-dark border border-surface-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors pr-12"
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <span class="material-symbols-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirm" class="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <div class="relative">
              <input
                id="confirm"
                v-model="form.confirm"
                :type="showConfirm ? 'text' : 'password'"
                required
                autocomplete="new-password"
                class="w-full px-4 py-3 bg-background-dark border border-surface-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors pr-12"
                :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': passwordMismatch }"
                placeholder="Repeat your new password"
              />
              <button
                type="button"
                @click="showConfirm = !showConfirm"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <span class="material-symbols-outlined">{{ showConfirm ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <p v-if="passwordMismatch" class="mt-1 text-sm text-red-400">Passwords do not match.</p>
          </div>

          <!-- Error -->
          <div v-if="errorMessage" class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            :disabled="isLoading || passwordMismatch"
            class="w-full py-3 bg-primary hover:bg-primary-dark text-background-dark font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(18,226,105,0.2)]"
          >
            <span v-if="isLoading">Resetting...</span>
            <span v-else>Reset Password</span>
            <span v-if="!isLoading" class="material-symbols-outlined">lock_reset</span>
          </button>
        </form>
      </div>

      <!-- Back to Login -->
      <p v-if="!success" class="text-center mt-6">
        <NuxtLink
          to="/login"
          class="text-gray-500 hover:text-gray-400 transition-colors flex items-center justify-center gap-1"
        >
          <span class="material-symbols-outlined text-lg">arrow_back</span>
          Back to Login
        </NuxtLink>
      </p>

    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['guest'],
  layout: 'default',
})

const route = useRoute()
const { completeRecovery } = useAuth()

const processing = ref(true)
const invalidLink = ref(false)
const success = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)

const form = ref({ password: '', confirm: '' })

const passwordMismatch = computed(
  () => form.value.confirm.length > 0 && form.value.password !== form.value.confirm
)

// userId and secret are injected by Appwrite into the redirect URL
const userId = ref('')
const secret = ref('')

onMounted(() => {
  userId.value = route.query.userId
  secret.value = route.query.secret

  if (!userId.value || !secret.value) {
    invalidLink.value = true
  }

  processing.value = false
})

const handleSubmit = async () => {
  if (passwordMismatch.value) return

  isLoading.value = true
  errorMessage.value = ''

  const result = await completeRecovery(userId.value, secret.value, form.value.password)

  if (result.success) {
    success.value = true
  } else {
    errorMessage.value = result.error?.includes('expired')
      ? 'This reset link has expired. Please request a new one.'
      : result.error || 'Failed to reset password. The link may have expired.'
  }

  isLoading.value = false
}
</script>
