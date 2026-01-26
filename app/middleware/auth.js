export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser } = useAuth()
  
  // Fetch user if not already loaded
  if (user.value === null) {
    await fetchUser()
  }
  
  // If user is not logged in, redirect to login
  if (!user.value) {
    return navigateTo('/login')
  }
})
