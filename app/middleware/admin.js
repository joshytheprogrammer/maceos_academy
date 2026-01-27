// Admin middleware: User must be logged in AND have admin label
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser, isAdmin } = useAuth()
  const authInitialized = useState('auth_initialized', () => false)
  
  // On server, we skip - route rules handle SSR=false for admin routes
  if (import.meta.server) {
    return
  }
  
  // Wait for auth to be initialized
  if (!authInitialized.value) {
    await fetchUser()
    authInitialized.value = true
  }
  
  // Not logged in → go to login
  if (!user.value) {
    return navigateTo('/login')
  }
  
  // Logged in but not admin → go to dashboard (or show unauthorized)
  if (!isAdmin.value) {
    return navigateTo('/dashboard')
  }
})
