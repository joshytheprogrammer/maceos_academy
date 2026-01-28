import { ID, Query, Permission, Role } from 'appwrite'
import { databases } from '~/utils/appwrite'

const DB_ID = 'academia_db'
const COLLECTION_ID = 'support_tickets'

export const useSupport = () => {
  // State
  const tickets = ref([])
  const currentTicket = ref(null)
  const loading = ref(false)
  const error = ref('')

  // Ticket categories
  const categories = [
    { value: 'technical', label: 'Technical Issue', icon: '🔧' },
    { value: 'content', label: 'Course Content', icon: '📚' },
    { value: 'payment', label: 'Payment & Billing', icon: '💳' },
    { value: 'account', label: 'Account Issue', icon: '👤' },
    { value: 'other', label: 'Other', icon: '❓' }
  ]

  // Status options
  const statuses = [
    { value: 'open', label: 'Open', color: 'yellow' },
    { value: 'in-progress', label: 'In Progress', color: 'blue' },
    { value: 'resolved', label: 'Resolved', color: 'green' }
  ]

  // ==========================================
  // Student Functions
  // ==========================================

  /**
   * Create a new support ticket (Student)
   */
  const createTicket = async (ticketData, userId) => {
    loading.value = true
    error.value = ''
    try {
      // Only set user permissions - collection-level permissions handle admin access
      const ticket = await databases.createDocument(
        DB_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          userId,
          category: ticketData.category,
          subject: ticketData.subject,
          message: ticketData.message,
          status: 'open'
        },
        [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId))
        ]
      )
      return ticket
    }
    catch (e) {
      error.value = e.message
      console.error('Failed to create ticket:', e)
      throw e
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Fetch user's own tickets (Student)
   */
  const fetchMyTickets = async (userId) => {
    loading.value = true
    error.value = ''
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(50)
        ]
      )
      tickets.value = response.documents
      return tickets.value
    }
    catch (e) {
      error.value = e.message
      console.error('Failed to fetch tickets:', e)
      return []
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Get a single ticket by ID
   */
  const getTicket = async (ticketId) => {
    loading.value = true
    error.value = ''
    try {
      const ticket = await databases.getDocument(
        DB_ID,
        COLLECTION_ID,
        ticketId
      )
      currentTicket.value = ticket
      return ticket
    }
    catch (e) {
      error.value = e.message
      console.error('Failed to get ticket:', e)
      return null
    }
    finally {
      loading.value = false
    }
  }

  // ==========================================
  // Admin Functions
  // ==========================================

  /**
   * Fetch all tickets (Admin)
   */
  const fetchAllTickets = async (filters = {}) => {
    loading.value = true
    error.value = ''
    try {
      const queries = [
        Query.orderDesc('$createdAt'),
        Query.limit(100)
      ]

      // Apply filters
      if (filters.status) {
        queries.push(Query.equal('status', filters.status))
      }
      if (filters.category) {
        queries.push(Query.equal('category', filters.category))
      }

      const response = await databases.listDocuments(
        DB_ID,
        COLLECTION_ID,
        queries
      )
      tickets.value = response.documents
      return tickets.value
    }
    catch (e) {
      error.value = e.message
      console.error('Failed to fetch all tickets:', e)
      return []
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Respond to a ticket (Admin)
   */
  const respondToTicket = async (ticketId, adminId, response, newStatus = 'in-progress') => {
    loading.value = true
    error.value = ''
    try {
      const updateData = {
        adminResponse: response,
        adminId,
        status: newStatus
      }

      // If resolving, add resolvedAt timestamp
      if (newStatus === 'resolved') {
        updateData.resolvedAt = new Date().toISOString()
      }

      const ticket = await databases.updateDocument(
        DB_ID,
        COLLECTION_ID,
        ticketId,
        updateData
      )
      return ticket
    }
    catch (e) {
      error.value = e.message
      console.error('Failed to respond to ticket:', e)
      throw e
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Update ticket status (Admin)
   */
  const updateTicketStatus = async (ticketId, status) => {
    loading.value = true
    error.value = ''
    try {
      const updateData = { status }
      
      if (status === 'resolved') {
        updateData.resolvedAt = new Date().toISOString()
      }

      const ticket = await databases.updateDocument(
        DB_ID,
        COLLECTION_ID,
        ticketId,
        updateData
      )
      return ticket
    }
    catch (e) {
      error.value = e.message
      console.error('Failed to update ticket status:', e)
      throw e
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Delete a ticket (Admin)
   */
  const deleteTicket = async (ticketId) => {
    loading.value = true
    error.value = ''
    try {
      await databases.deleteDocument(
        DB_ID,
        COLLECTION_ID,
        ticketId
      )
      // Remove from local state
      tickets.value = tickets.value.filter(t => t.$id !== ticketId)
      return true
    }
    catch (e) {
      error.value = e.message
      console.error('Failed to delete ticket:', e)
      throw e
    }
    finally {
      loading.value = false
    }
  }

  // ==========================================
  // Helper Functions
  // ==========================================

  /**
   * Get category label and icon
   */
  const getCategoryInfo = (categoryValue) => {
    return categories.find(c => c.value === categoryValue) || { label: categoryValue, icon: '❓' }
  }

  /**
   * Get status info
   */
  const getStatusInfo = (statusValue) => {
    return statuses.find(s => s.value === statusValue) || { label: statusValue, color: 'gray' }
  }

  /**
   * Get ticket statistics (Admin)
   */
  const getTicketStats = (ticketList) => {
    const all = ticketList || tickets.value
    return {
      total: all.length,
      open: all.filter(t => t.status === 'open').length,
      inProgress: all.filter(t => t.status === 'in-progress').length,
      resolved: all.filter(t => t.status === 'resolved').length
    }
  }

  return {
    // State
    tickets,
    currentTicket,
    loading,
    error,
    
    // Constants
    categories,
    statuses,
    
    // Student functions
    createTicket,
    fetchMyTickets,
    getTicket,
    
    // Admin functions
    fetchAllTickets,
    respondToTicket,
    updateTicketStatus,
    deleteTicket,
    
    // Helpers
    getCategoryInfo,
    getStatusInfo,
    getTicketStats
  }
}
