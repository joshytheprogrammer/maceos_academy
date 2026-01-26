// Auth middleware: User must be logged in
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser } = useAuth()
  const authInitialized = useState('auth_initialized', () => false)
  
  // On server, we can't check auth - let app.vue handle showing loading screen
  if (import.meta.server) {
    return
  }
  
  // Wait for auth to be initialized (should already be done by app.vue)
  if (!authInitialized.value) {
    await fetchUser()
    authInitialized.value = true
  }
  
  // Not logged in → go to login
  if (!user.value) {
    return navigateTo('/login')
  }
})
