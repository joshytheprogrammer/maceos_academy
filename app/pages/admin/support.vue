<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-white">Support Tickets</h1>
        <p class="mt-1 text-xs sm:text-sm text-gray-400">Manage and respond to student support requests</p>
      </div>
      
      <!-- Filters -->
      <div class="flex items-center gap-2 flex-wrap">
        <select
          v-model="filterStatus"
          class="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-green-500"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          v-model="filterCategory"
          class="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-green-500"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">
            {{ cat.icon }} {{ cat.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-gray-800 bg-gray-900 p-3 sm:p-4">
        <p class="text-xs sm:text-sm text-gray-400">Total Tickets</p>
        <p class="mt-1 text-xl sm:text-2xl font-bold text-white">{{ stats.total }}</p>
      </div>
      <div class="rounded-xl border border-yellow-500/30 bg-gray-900 p-3 sm:p-4">
        <p class="text-xs sm:text-sm text-gray-400">Open</p>
        <p class="mt-1 text-xl sm:text-2xl font-bold text-yellow-400">{{ stats.open }}</p>
      </div>
      <div class="rounded-xl border border-blue-500/30 bg-gray-900 p-3 sm:p-4">
        <p class="text-xs sm:text-sm text-gray-400">In Progress</p>
        <p class="mt-1 text-xl sm:text-2xl font-bold text-blue-400">{{ stats.inProgress }}</p>
      </div>
      <div class="rounded-xl border border-green-500/30 bg-gray-900 p-3 sm:p-4">
        <p class="text-xs sm:text-sm text-gray-400">Resolved</p>
        <p class="mt-1 text-xl sm:text-2xl font-bold text-green-400">{{ stats.resolved }}</p>
      </div>
    </div>

    <!-- Tickets Table -->
    <div class="mt-6 rounded-xl border border-gray-800 bg-gray-900 overflow-x-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-green-500"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredTickets.length === 0" class="py-12 text-center">
        <span class="material-symbols-outlined text-4xl sm:text-5xl text-gray-600">support_agent</span>
        <h3 class="mt-4 text-base sm:text-lg font-medium text-white">No Tickets Found</h3>
        <p class="mt-1 text-xs sm:text-sm text-gray-400">
          {{ filterStatus || filterCategory ? 'Try adjusting your filters' : 'No support tickets have been submitted yet' }}
        </p>
      </div>

      <table v-else class="w-full min-w-max">
        <thead class="border-b border-gray-800 bg-gray-900/50">
          <tr>
            <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Ticket</th>
            <th class="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">User</th>
            <th class="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Category</th>
            <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
            <th class="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Created</th>
            <th class="px-3 sm:px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <tr
            v-for="ticket in filteredTickets"
            :key="ticket.$id"
            class="transition-colors hover:bg-gray-800/50"
          >
            <td class="px-3 sm:px-6 py-4">
              <div class="max-w-[150px] sm:max-w-xs">
                <p class="font-medium text-white text-xs sm:text-sm truncate">{{ ticket.subject }}</p>
                <p class="text-xs text-gray-500 line-clamp-1">{{ ticket.message }}</p>
              </div>
            </td>
            <td class="hidden sm:table-cell px-3 sm:px-6 py-4">
              <div class="min-w-0">
                <p class="text-xs sm:text-sm font-medium text-white truncate">{{ ticketUsers[ticket.userId]?.name || 'Unknown' }}</p>
                <p class="text-xs text-gray-500 truncate">{{ ticketUsers[ticket.userId]?.email || ticket.userId }}</p>
              </div>
            </td>
            <td class="hidden md:table-cell px-3 sm:px-6 py-4">
              <span class="inline-flex items-center gap-1 rounded-full bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-300">
                <span>{{ getCategoryInfo(ticket.category).icon }}</span>
                {{ getCategoryInfo(ticket.category).label }}
              </span>
            </td>
            <td class="px-3 sm:px-6 py-4">
              <span
                :class="[
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  ticket.status === 'open' ? 'bg-yellow-500/20 text-yellow-400' :
                  ticket.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-green-500/20 text-green-400'
                ]"
              >
                {{ getStatusInfo(ticket.status).label }}
              </span>
            </td>
            <td class="hidden lg:table-cell px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-400">
              {{ formatDate(ticket.$createdAt) }}
            </td>
            <td class="px-3 sm:px-6 py-4">
              <div class="flex items-center justify-end gap-1">
                <button
                  @click="openResponseModal(ticket)"
                  class="rounded-lg p-1.5 sm:p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-green-400"
                  title="View / Respond"
                >
                  <span class="material-symbols-outlined text-[18px] sm:text-[20px]">reply</span>
                </button>
                <button
                  @click="confirmDelete(ticket)"
                  class="rounded-lg p-1.5 sm:p-2 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  title="Delete"
                >
                  <span class="material-symbols-outlined text-[18px] sm:text-[20px]">delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Response Modal -->
    <Teleport to="body">
      <div
        v-if="showResponseModal && selectedTicket"
        class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-2 sm:p-4"
      >
        <div class="fixed inset-0 bg-black/70" @click="showResponseModal = false"></div>
        <div class="relative w-full max-w-2xl rounded-xl border border-gray-800 bg-gray-900 shadow-2xl">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-gray-800 px-6 py-4">
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ getCategoryInfo(selectedTicket.category).icon }}</span>
              <div>
                <h2 class="text-xl font-semibold text-white">{{ selectedTicket.subject }}</h2>
                <div class="mt-1 flex items-center gap-3 text-sm">
                  <span
                    :class="[
                      'rounded px-2 py-0.5 text-xs font-medium',
                      selectedTicket.status === 'open' ? 'bg-yellow-500/20 text-yellow-400' :
                      selectedTicket.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    ]"
                  >
                    {{ getStatusInfo(selectedTicket.status).label }}
                  </span>
                  <span class="text-gray-500">{{ formatDate(selectedTicket.$createdAt) }}</span>
                </div>
              </div>
            </div>
            <button @click="showResponseModal = false" class="text-gray-400 hover:text-white">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Content -->
          <div class="max-h-[60vh] overflow-y-auto px-6 py-6">
            <!-- User Info -->
            <div class="mb-4 flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-800/50 p-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                <span class="material-symbols-outlined">person</span>
              </div>
              <div>
                <p class="font-medium text-white">{{ ticketUsers[selectedTicket.userId]?.name || 'Unknown User' }}</p>
                <p class="text-sm text-gray-400">{{ ticketUsers[selectedTicket.userId]?.email || selectedTicket.userId }}</p>
              </div>
            </div>

            <!-- Original Message -->
            <div class="mb-6">
              <h3 class="mb-2 text-sm font-medium uppercase tracking-wider text-gray-400">User's Message</h3>
              <div class="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                <p class="whitespace-pre-wrap text-gray-300">{{ selectedTicket.message }}</p>
              </div>
            </div>

            <!-- Previous Response -->
            <div v-if="selectedTicket.adminResponse" class="mb-6">
              <h3 class="mb-2 text-sm font-medium uppercase tracking-wider text-green-400">Previous Response</h3>
              <div class="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                <p class="whitespace-pre-wrap text-gray-300">{{ selectedTicket.adminResponse }}</p>
              </div>
            </div>

            <!-- Response Form -->
            <div>
              <h3 class="mb-2 text-sm font-medium uppercase tracking-wider text-gray-400">
                {{ selectedTicket.adminResponse ? 'Update Response' : 'Your Response' }}
              </h3>
              <textarea
                v-model="responseForm.message"
                rows="5"
                placeholder="Type your response..."
                class="w-full resize-none rounded-lg border border-gray-800 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors focus:border-green-500"
              ></textarea>
              
              <!-- Status Selection -->
              <div class="mt-4">
                <label class="mb-2 block text-sm font-medium text-gray-400">Update Status</label>
                <div class="flex gap-2">
                  <button
                    v-for="status in statuses"
                    :key="status.value"
                    type="button"
                    @click="responseForm.status = status.value"
                    :class="[
                      'rounded-lg border px-4 py-2 text-sm transition-colors',
                      responseForm.status === status.value
                        ? status.value === 'open' ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400' :
                          status.value === 'in-progress' ? 'border-blue-500 bg-blue-500/20 text-blue-400' :
                          'border-green-500 bg-green-500/20 text-green-400'
                        : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                    ]"
                  >
                    {{ status.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 border-t border-gray-800 px-6 py-4">
            <button
              @click="showResponseModal = false"
              class="rounded-lg border border-gray-700 px-4 py-2 text-gray-300 transition-colors hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              @click="submitResponse"
              :disabled="submitting || !responseForm.message"
              class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-medium text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span v-if="submitting" class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              {{ submitting ? 'Sending...' : 'Send Response' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal && ticketToDelete"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="fixed inset-0 bg-black/70" @click="showDeleteModal = false"></div>
        <div class="relative w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
          <div class="text-center">
            <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
              <span class="material-symbols-outlined text-2xl text-red-400">warning</span>
            </div>
            <h3 class="text-lg font-semibold text-white">Delete Ticket</h3>
            <p class="mt-2 text-gray-400">
              Are you sure you want to delete this ticket? This action cannot be undone.
            </p>
            <p class="mt-2 text-sm text-white font-medium">"{{ ticketToDelete.subject }}"</p>
          </div>
          <div class="mt-6 flex justify-center gap-3">
            <button
              @click="showDeleteModal = false"
              class="rounded-lg border border-gray-700 px-4 py-2 text-gray-300 transition-colors hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              @click="executeDelete"
              :disabled="deleting"
              class="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
            >
              <span v-if="deleting" class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const { user } = useAuth()
const {
  tickets,
  loading,
  categories,
  statuses,
  fetchAllTickets,
  respondToTicket,
  deleteTicket,
  getCategoryInfo,
  getStatusInfo,
  getTicketStats
} = useSupport()

// Filters
const filterStatus = ref('')
const filterCategory = ref('')

// UI State
const showResponseModal = ref(false)
const showDeleteModal = ref(false)
const selectedTicket = ref(null)
const ticketToDelete = ref(null)
const submitting = ref(false)
const deleting = ref(false)

// User data for tickets
const ticketUsers = ref({})

// Response form
const responseForm = ref({
  message: '',
  status: 'in-progress'
})

// Computed
const stats = computed(() => getTicketStats())

const filteredTickets = computed(() => {
  return tickets.value.filter(ticket => {
    if (filterStatus.value && ticket.status !== filterStatus.value) return false
    if (filterCategory.value && ticket.category !== filterCategory.value) return false
    return true
  })
})

// Load tickets on mount
onMounted(async () => {
  await loadTickets()
})

// Watch filters
watch([filterStatus, filterCategory], () => {
  // Filters are computed, no need to reload
})

// Load all tickets and user data
const loadTickets = async () => {
  await fetchAllTickets()
  
  // Fetch user data for all tickets
  const userIds = [...new Set(tickets.value.map(t => t.userId))]
  if (userIds.length > 0) {
    try {
      const response = await $fetch('/api/users/batch', {
        params: { ids: userIds.join(',') }
      })
      ticketUsers.value = response
    }
    catch (err) {
      console.error('Failed to fetch user data:', err)
    }
  }
}

// Format date
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Open response modal
const openResponseModal = (ticket) => {
  selectedTicket.value = ticket
  responseForm.value = {
    message: ticket.adminResponse || '',
    status: ticket.status === 'open' ? 'in-progress' : ticket.status
  }
  showResponseModal.value = true
}

// Submit response
const submitResponse = async () => {
  if (!user.value || submitting.value || !responseForm.value.message) return

  submitting.value = true
  try {
    await respondToTicket(
      selectedTicket.value.$id,
      user.value.$id,
      responseForm.value.message,
      responseForm.value.status
    )
    
    showResponseModal.value = false
    await loadTickets()
  }
  catch (err) {
    console.error('Failed to respond:', err)
    alert('Failed to send response. Please try again.')
  }
  finally {
    submitting.value = false
  }
}

// Confirm delete
const confirmDelete = (ticket) => {
  ticketToDelete.value = ticket
  showDeleteModal.value = true
}

// Execute delete
const executeDelete = async () => {
  if (!ticketToDelete.value || deleting.value) return

  deleting.value = true
  try {
    await deleteTicket(ticketToDelete.value.$id)
    showDeleteModal.value = false
    ticketToDelete.value = null
  }
  catch (err) {
    console.error('Failed to delete:', err)
    alert('Failed to delete ticket. Please try again.')
  }
  finally {
    deleting.value = false
  }
}
</script>
