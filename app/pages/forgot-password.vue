<template>
  <div class="min-h-screen bg-background-dark text-white flex items-center justify-center px-6">
    <div class="w-full max-w-md">

      <!-- Card -->
      <div class="bg-surface-dark border border-surface-border rounded-2xl p-8">

        <!-- Sent State -->
        <div v-if="emailSent" class="text-center">
          <div class="h-20 w-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <span class="material-symbols-outlined text-5xl text-primary">mark_email_read</span>
          </div>
          <h2 class="text-2xl font-bold mb-2">Check Your Email</h2>
          <p class="text-text-secondary mb-6">
            We've sent a password reset link to <span class="text-white font-medium">{{ submittedEmail }}</span>.
            Check your inbox and follow the link to reset your password.
          </p>
          <p class="text-sm text-gray-500 mb-8">
            Didn't receive it? Check your spam folder or try again in a few minutes.
          </p>
          <button
            @click="emailSent = false"
            class="w-full py-3 border border-surface-border rounded-xl text-text-secondary hover:text-white hover:border-gray-400 transition-colors"
          >
            Try a different email
          </button>
        </div>

        <!-- Request Form -->
        <div v-else>
          <h2 class="text-2xl font-bold mb-2">Forgot Password?</h2>
          <p class="text-text-secondary mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                class="w-full px-4 py-3 bg-background-dark border border-surface-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <!-- Error -->
            <div v-if="errorMessage" class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-3 bg-primary hover:bg-primary-dark text-background-dark font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(18,226,105,0.2)]"
            >
              <span v-if="isLoading">Sending...</span>
              <span v-else>Send Reset Link</span>
              <span v-if="!isLoading" class="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Back to Login -->
      <p class="text-center mt-6">
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

const { forgotPassword } = useAuth()

const email = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const emailSent = ref(false)
const submittedEmail = ref('')

const handleSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''

  const result = await forgotPassword(email.value)

  if (result.success) {
    submittedEmail.value = email.value
    emailSent.value = true
  } else {
    // Intentionally vague to avoid user enumeration
    errorMessage.value = 'Something went wrong. Please check the email address and try again.'
  }

  isLoading.value = false
}
</script>
