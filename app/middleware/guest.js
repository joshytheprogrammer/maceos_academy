// Guest middleware: User must NOT be logged in
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser } = useAuth()
  const { application, fetchApplication } = useApplication()
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
  
  // If logged in, figure out where to send them
  if (user.value) {
    // Check their application status
    if (!application.value) {
      await fetchApplication(user.value.$id)
    }
    
    // Has completed application? → Dashboard
    if (application.value?.paymentVerified === true) {
      return navigateTo('/dashboard')
    }
    
    // Has application but not paid? → Payment step
    if (application.value && !application.value.paymentVerified) {
      return navigateTo('/apply/step-3')
    }
    
    // Logged in but no application? → Step 2 (they already have account)
    return navigateTo('/apply/step-2')
  }
})
