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
   * Generate a secure random password
   */
  const generatePassword = (length = 12) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let password = ''
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      password += charset[array[i] % charset.length]
    }
    return password
  }

  /**
   * Register a new user with auto-generated password
   * User will need to change password after approval
   */
  const register = async (email, name) => {
    loading.value = true
    error.value = null
    try {
      // Generate random password - user will change it after approval
      const generatedPassword = generatePassword(16)
      
      // Create account with object syntax
      await account.create({
        userId: ID.unique(),
        email,
        password: generatedPassword,
        name
      })
      // Auto login after registration
      await login(email, generatedPassword)
      return { success: true, generatedPassword }
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
      await account.createEmailPasswordSession({ email, password })
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
      await account.deleteSession({ sessionId: 'current' })
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

  /**
   * Update user password
   */
  const updatePassword = async (currentPassword, newPassword) => {
    loading.value = true
    error.value = null
    try {
      await account.updatePassword({ password: newPassword, oldPassword: currentPassword })
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
   * Update user name
   */
  const updateName = async (name) => {
    loading.value = true
    error.value = null
    try {
      await account.updateName({ name })
      await fetchUser() // Refresh user data
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
   * Update user email (requires password verification)
   */
  const updateEmail = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      await account.updateEmail({ email, password })
      await fetchUser() // Refresh user data
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
   * Get user preferences
   */
  const getPrefs = async () => {
    try {
      return await account.getPrefs()
    }
    catch (e) {
      return {}
    }
  }

  /**
   * Update user preferences
   */
  const updatePrefs = async (prefs) => {
    try {
      await account.updatePrefs({ prefs })
      return { success: true }
    }
    catch (e) {
      return { success: false, error: e.message }
    }
  }

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
    updatePassword,
    updateName,
    updateEmail,
    getPrefs,
    updatePrefs,
  }
}
