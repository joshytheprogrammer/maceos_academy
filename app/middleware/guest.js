// Guest middleware: User must NOT be logged in
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user } = useAuth()
  const { application, fetchApplication } = useApplication()
  
  // Auth state is initialized by app.vue before any navigation
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
