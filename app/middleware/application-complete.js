// Application-complete middleware: User must have finished application (paid)
export default defineNuxtRouteMiddleware(async (to, from) => {
  // On server, we can't check auth - let app.vue handle showing loading screen
  if (import.meta.server) {
    return
  }

  const { user, fetchUser } = useAuth()
  const { application, fetchApplication } = useApplication()
  const authInitialized = useState('auth_initialized', () => false)
  
  // Wait for auth to be initialized
  if (!authInitialized.value) {
    await fetchUser()
    authInitialized.value = true
  }
  
  if (!user.value) {
    return navigateTo('/login')
  }
  
  // Check application
  if (!application.value) {
    await fetchApplication(user.value.$id)
  }
  
  // No application at all? Start fresh
  if (!application.value) {
    return navigateTo('/apply')
  }
  
  // Not paid yet? Go to payment
  if (!application.value.paymentVerified) {
    return navigateTo('/apply/step-3')
  }
  
  // All good - user has completed application
})
