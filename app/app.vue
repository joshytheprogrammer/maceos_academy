<template>
  <!-- Loading screen while auth initializes -->
  <UiLoadingScreen v-if="!authInitialized" message="Verifying session..." />
  
  <!-- Main app content -->
  <NuxtLayout v-else>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { loading, fetchUser } = useAuth()
const authInitialized = useState('auth_initialized', () => false)

// Initialize auth state on app mount (client-side only)
onMounted(async () => {
  if (!authInitialized.value) {
    await fetchUser()
    authInitialized.value = true
  }
})

// Handle SSR - mark as initialized if we're on server or already loaded
if (import.meta.server) {
  authInitialized.value = true
}
</script>
