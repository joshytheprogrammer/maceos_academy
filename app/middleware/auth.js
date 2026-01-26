// Auth middleware: User must be logged in
export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()
  
  // Auth state is initialized by app.vue before any navigation
  // Not logged in → go to login
  if (!user.value) {
    return navigateTo('/login')
  }
})
