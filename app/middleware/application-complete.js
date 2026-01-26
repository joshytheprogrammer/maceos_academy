// Middleware to ensure user has completed their application (step-4)
// before accessing protected routes like the dashboard

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, isAuthenticated, fetchUser } = useAuth()
  const { application, fetchApplication, isApplicationComplete } = useApplication()

  // Ensure user is loaded
  if (!user.value) {
    await fetchUser()
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  // Fetch application if not already loaded
  if (!application.value) {
    await fetchApplication(user.value.$id)
  }

  // Check if application is complete (payment verified and status submitted)
  if (!isApplicationComplete.value) {
    // Determine where to redirect based on application state
    if (!application.value) {
      // No application started - go to step 1
      return navigateTo('/apply')
    }
    
    if (application.value.paymentStatus === 'pending' || !application.value.paymentVerified) {
      // Payment not completed - go to step 3
      return navigateTo('/apply/step-3')
    }

    // Application exists but not fully submitted - go to step 4
    return navigateTo('/apply/step-4')
  }

  // Application is complete, allow access
})
