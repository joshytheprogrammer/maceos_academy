<template>
  <NuxtLayout>
    <!-- Show loading screen until auth is initialized (both SSR and client) -->
    <UiLoadingScreen v-if="!authInitialized" message="Verifying session..." />
    
    <!-- Only render page content after auth check completes -->
    <NuxtPage v-else />
  </NuxtLayout>
</template>

<script setup>
const { fetchUser } = useAuth()
const authInitialized = useState('auth_initialized', () => false)

// Initialize auth state on app mount (client-side only)
onMounted(async () => {
  if (!authInitialized.value) {
    await fetchUser()
    authInitialized.value = true
  }
})
</script>
