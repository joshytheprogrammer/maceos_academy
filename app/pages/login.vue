<template>
  <!-- Loading screen while checking auth -->
  <UiLoadingScreen v-if="!authReady" message="Verifying session..." />
  
  <div v-else class="min-h-screen bg-background-dark text-white flex items-center justify-center px-6">
    <div class="w-full max-w-md">
     
      <!-- Login Card -->
      <div class="bg-surface-dark border border-surface-border rounded-2xl p-8">
        <h2 class="text-2xl font-bold mb-2">Welcome Back</h2>
        <p class="text-text-secondary mb-8">Sign in to access your dashboard</p>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="w-full px-4 py-3 bg-background-dark border border-surface-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <!-- Password -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label for="password" class="block text-sm font-medium text-gray-300">
                Password
              </label>
              <a href="#" class="text-sm text-primary hover:text-primary-dark transition-colors">
                Forgot password?
              </a>
            </div>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="w-full px-4 py-3 bg-background-dark border border-surface-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <span class="material-symbols-outlined">
                  {{ showPassword ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center gap-2">
            <input
              id="remember"
              v-model="form.remember"
              type="checkbox"
              class="w-4 h-4 rounded border-surface-border bg-background-dark text-primary focus:ring-primary focus:ring-offset-0"
            />
            <label for="remember" class="text-sm text-text-secondary">
              Remember me for 30 days
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 bg-primary hover:bg-primary-dark text-background-dark font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(18,226,105,0.2)]"
          >
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign In</span>
            <span v-if="!isLoading" class="material-symbols-outlined">login</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-surface-border"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-surface-dark text-gray-500">or</span>
          </div>
        </div>

        <!-- Sign Up Link -->
        <p class="text-center text-text-secondary">
          Don't have an account? 
          <NuxtLink to="/apply" class="text-primary hover:text-primary-dark transition-colors font-medium">
            Apply Now
          </NuxtLink>
        </p>
      </div>

      <!-- Back to Home -->
      <p class="text-center mt-6">
        <NuxtLink to="/" class="text-gray-500 hover:text-gray-400 transition-colors flex items-center justify-center gap-1">
          <span class="material-symbols-outlined text-lg">arrow_back</span>
          Back to Home
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['guest']
})

const { login, error: authError } = useAuth()
const authInitialized = useState('auth_initialized', () => false)
const authReady = computed(() => authInitialized.value)

const isLoading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  const result = await login(form.value.email, form.value.password)

  if (result.success) {
    navigateTo('/dashboard')
  }
  else {
    errorMessage.value = result.error || 'Invalid email or password. Please try again.'
  }

  isLoading.value = false
}
</script>
