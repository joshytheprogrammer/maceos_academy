// Student middleware: User must have 'student' label
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser } = useAuth()
  const authInitialized = useState('auth_initialized', () => false)
  
  // On server, we can't check auth
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
  
  // Check if user has 'student' label
  const hasStudentLabel = user.value.labels?.includes('student')
  
  if (!hasStudentLabel) {
    // User is not an approved student
    return navigateTo('/dashboard')
  }
})
