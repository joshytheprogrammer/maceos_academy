<template>
  <NuxtLayout>
    <NuxtPage />
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
