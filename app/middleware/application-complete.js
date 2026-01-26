// Application-complete middleware: User must have finished application (paid)
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser } = useAuth()
  const { application, fetchApplication } = useApplication()
  
  // Must be logged in first
  if (user.value === null) {
    await fetchUser()
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
