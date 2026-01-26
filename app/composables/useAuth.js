import { account } from '~/utils/appwrite'
import { ID } from 'appwrite'

export const useAuth = () => {
  const user = useState('auth_user', () => null)
  const loading = useState('auth_loading', () => true)
  const error = useState('auth_error', () => null)

  /**
   * Get current session and user
   */
  const fetchUser = async () => {
    loading.value = true
    error.value = null
    try {
      const session = await account.get()
      user.value = session
      return session
    }
    catch (e) {
      user.value = null
      return null
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Register a new user
   */
  const register = async (email, password, name) => {
    loading.value = true
    error.value = null
    try {
      // Create account
      await account.create(ID.unique(), email, password, name)
      // Auto login after registration
      await login(email, password)
      return { success: true }
    }
    catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Login with email and password
   */
  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      await account.createEmailPasswordSession(email, password)
      await fetchUser()
      return { success: true }
    }
    catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Logout current user
   */
  const logout = async () => {
    loading.value = true
    try {
      await account.deleteSession('current')
      user.value = null
      navigateTo('/')
    }
    catch (e) {
      error.value = e.message
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = computed(() => !!user.value)

  /**
   * Check if user has a specific label/role
   */
  const hasRole = (role) => {
    return user.value?.labels?.includes(role) || false
  }

  /**
   * Check if user is admin
   */
  const isAdmin = computed(() => hasRole('admin'))

  /**
   * Check if user is student
   */
  const isStudent = computed(() => hasRole('student'))

  return {
    user,
    loading,
    error,
    fetchUser,
    register,
    login,
    logout,
    isAuthenticated,
    hasRole,
    isAdmin,
    isStudent,
  }
}
