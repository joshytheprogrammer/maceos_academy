<template>
  <div class="min-h-screen bg-background-dark flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Loading State -->
      <div v-if="verifying" class="text-center">
        <div class="mb-6">
          <div class="h-16 w-16 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">Verifying Your Email</h1>
        <p class="text-gray-400">Please wait while we verify your email address...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="text-center">
        <div class="mb-6">
          <div class="h-20 w-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-5xl text-green-400">check_circle</span>
          </div>
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">Email Verified!</h1>
        <p class="text-gray-400 mb-6">Your email has been successfully verified. You can now access all features.</p>
        <NuxtLink
          to="/dashboard"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <span class="material-symbols-outlined">dashboard</span>
          Go to Dashboard
        </NuxtLink>
      </div>

      <!-- Error State -->
      <div v-else class="text-center">
        <div class="mb-6">
          <div class="h-20 w-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-5xl text-red-400">error</span>
          </div>
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">Verification Failed</h1>
        <p class="text-gray-400 mb-2">{{ errorMessage }}</p>
        <p class="text-gray-500 text-sm mb-6">The verification link may have expired or already been used.</p>
        <div class="space-y-3">
          <NuxtLink
            to="/dashboard/profile"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <span class="material-symbols-outlined">mail</span>
            Request New Link
          </NuxtLink>
          <br>
          <NuxtLink
            to="/dashboard"
            class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span class="material-symbols-outlined">arrow_back</span>
            Back to Dashboard
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const route = useRoute()
const { completeVerification } = useAuth()

const verifying = ref(true)
const success = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  const { userId, secret } = route.query
  
  if (!userId || !secret) {
    verifying.value = false
    errorMessage.value = 'Invalid verification link. Missing required parameters.'
    return
  }

  const result = await completeVerification(userId, secret)
  verifying.value = false
  
  if (result.success) {
    success.value = true
  } else {
    errorMessage.value = result.error || 'Failed to verify email address.'
  }
})
</script>
