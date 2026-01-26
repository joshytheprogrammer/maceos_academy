export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser } = useAuth()
  
  // Fetch user if not already loaded
  if (user.value === null) {
    await fetchUser()
  }
  
  // If user is logged in, redirect to dashboard
  if (user.value) {
    return navigateTo('/dashboard')
  }
})
