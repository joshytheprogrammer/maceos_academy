<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Support</h1>
        <p class="mt-1 text-gray-400">Need help? Submit a support ticket and we'll get back to you</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <span class="material-symbols-outlined text-xl">add</span>
        New Ticket
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div class="rounded-xl border border-surface-border bg-surface-dark p-4">
        <div class="text-2xl font-bold text-white">{{ stats.total }}</div>
        <div class="text-sm text-gray-400">Total Tickets</div>
      </div>
      <div class="rounded-xl border border-yellow-500/30 bg-surface-dark p-4">
        <div class="text-2xl font-bold text-yellow-400">{{ stats.open }}</div>
        <div class="text-sm text-gray-400">Open</div>
      </div>
      <div class="rounded-xl border border-blue-500/30 bg-surface-dark p-4">
        <div class="text-2xl font-bold text-blue-400">{{ stats.inProgress }}</div>
        <div class="text-sm text-gray-400">In Progress</div>
      </div>
      <div class="rounded-xl border border-primary/30 bg-surface-dark p-4">
        <div class="text-2xl font-bold text-primary">{{ stats.resolved }}</div>
        <div class="text-sm text-gray-400">Resolved</div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
    </div>

    <!-- No Tickets -->
    <div v-else-if="tickets.length === 0" class="rounded-xl border border-surface-border bg-surface-dark p-12 text-center">
      <span class="material-symbols-outlined text-5xl text-gray-600">support_agent</span>
      <h3 class="mt-4 text-lg font-semibold text-white">No Support Tickets</h3>
      <p class="mt-1 text-gray-400">You haven't created any support tickets yet</p>
      <button
        @click="showCreateModal = true"
        class="mt-4 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Create Your First Ticket
      </button>
    </div>

    <!-- Tickets List -->
    <div v-else class="space-y-3">
      <div
        v-for="ticket in tickets"
        :key="ticket.$id"
        @click="viewTicket(ticket)"
        class="cursor-pointer rounded-xl border border-surface-border bg-surface-dark p-5 transition-all hover:border-primary/30"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <!-- Category & Status -->
            <div class="mb-2 flex flex-wrap items-center gap-2">
              <span class="text-lg">{{ getCategoryInfo(ticket.category).icon }}</span>
              <span class="rounded bg-surface px-2 py-0.5 text-xs font-medium text-gray-300">
                {{ getCategoryInfo(ticket.category).label }}
              </span>
              <span
                :class="[
                  'rounded px-2 py-0.5 text-xs font-medium',
                  ticket.status === 'open' ? 'bg-yellow-500/20 text-yellow-400' :
                  ticket.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-primary/20 text-primary'
                ]"
              >
                {{ getStatusInfo(ticket.status).label }}
              </span>
            </div>

            <!-- Subject -->
            <h3 class="mb-1 text-lg font-semibold text-white">{{ ticket.subject }}</h3>

            <!-- Message Preview -->
            <p class="mb-3 line-clamp-2 text-sm text-gray-400">{{ ticket.message }}</p>

            <!-- Meta -->
            <div class="flex items-center gap-4 text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">calendar_today</span>
                {{ formatDate(ticket.$createdAt) }}
              </span>
              <span v-if="ticket.adminResponse" class="flex items-center gap-1 text-primary">
                <span class="material-symbols-outlined text-[16px]">reply</span>
                Admin responded
              </span>
            </div>
          </div>

          <!-- Arrow -->
          <span class="material-symbols-outlined text-gray-500">chevron_right</span>
        </div>
      </div>
    </div>

    <!-- Create Ticket Modal -->
    <Teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        @click.self="showCreateModal = false"
      >
        <div class="w-full max-w-lg rounded-2xl border border-surface-border bg-surface-dark">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-surface-border p-5">
            <h2 class="text-xl font-bold text-white">New Support Ticket</h2>
            <button @click="showCreateModal = false" class="text-gray-400 hover:text-white">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="submitTicket" class="p-5">
            <!-- Category -->
            <div class="mb-4">
              <label class="mb-2 block text-sm font-medium text-gray-300">Category</label>
              <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <button
                  v-for="cat in categories"
                  :key="cat.value"
                  type="button"
                  @click="form.category = cat.value"
                  :class="[
                    'flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-colors',
                    form.category === cat.value
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-surface-border bg-surface text-gray-400 hover:border-gray-600'
                  ]"
                >
                  <span>{{ cat.icon }}</span>
                  <span>{{ cat.label }}</span>
                </button>
              </div>
            </div>

            <!-- Subject -->
            <div class="mb-4">
              <label for="subject" class="mb-2 block text-sm font-medium text-gray-300">Subject</label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                required
                maxlength="256"
                placeholder="Brief summary of your issue"
                class="w-full rounded-lg border border-surface-border bg-surface px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors focus:border-primary"
              />
            </div>

            <!-- Message -->
            <div class="mb-6">
              <label for="message" class="mb-2 block text-sm font-medium text-gray-300">Message</label>
              <textarea
                id="message"
                v-model="form.message"
                required
                rows="5"
                maxlength="5000"
                placeholder="Please describe your issue in detail..."
                class="w-full resize-none rounded-lg border border-surface-border bg-surface px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors focus:border-primary"
              ></textarea>
              <div class="mt-1 text-right text-xs text-gray-500">{{ form.message.length }}/5000</div>
            </div>

            <!-- Submit -->
            <div class="flex justify-end gap-3">
              <button
                type="button"
                @click="showCreateModal = false"
                class="rounded-lg border border-surface-border px-4 py-2 text-gray-300 transition-colors hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="submitting || !form.category || !form.subject || !form.message"
                class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span v-if="submitting" class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                {{ submitting ? 'Submitting...' : 'Submit Ticket' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- View Ticket Modal -->
    <Teleport to="body">
      <div
        v-if="showViewModal && selectedTicket"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        @click.self="showViewModal = false"
      >
        <div class="w-full max-w-2xl rounded-2xl border border-surface-border bg-surface-dark">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-surface-border p-5">
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ getCategoryInfo(selectedTicket.category).icon }}</span>
              <div>
                <h2 class="text-xl font-bold text-white">{{ selectedTicket.subject }}</h2>
                <div class="mt-1 flex items-center gap-2 text-sm">
                  <span
                    :class="[
                      'rounded px-2 py-0.5 text-xs font-medium',
                      selectedTicket.status === 'open' ? 'bg-yellow-500/20 text-yellow-400' :
                      selectedTicket.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-primary/20 text-primary'
                    ]"
                  >
                    {{ getStatusInfo(selectedTicket.status).label }}
                  </span>
                  <span class="text-gray-500">{{ formatDate(selectedTicket.$createdAt) }}</span>
                </div>
              </div>
            </div>
            <button @click="showViewModal = false" class="text-gray-400 hover:text-white">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Content -->
          <div class="max-h-[60vh] overflow-y-auto p-5">
            <!-- Your Message -->
            <div class="mb-6">
              <h3 class="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">Your Message</h3>
              <div class="rounded-xl border border-surface-border bg-surface p-4">
                <p class="whitespace-pre-wrap text-gray-300">{{ selectedTicket.message }}</p>
              </div>
            </div>

            <!-- Admin Response -->
            <div v-if="selectedTicket.adminResponse">
              <h3 class="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Admin Response</h3>
              <div class="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <p class="whitespace-pre-wrap text-gray-300">{{ selectedTicket.adminResponse }}</p>
                <div v-if="selectedTicket.resolvedAt" class="mt-3 text-xs text-gray-500">
                  Resolved on {{ formatDate(selectedTicket.resolvedAt) }}
                </div>
              </div>
            </div>

            <!-- Waiting for Response -->
            <div v-else class="rounded-xl border border-surface-border bg-surface p-6 text-center">
              <span class="material-symbols-outlined text-4xl text-gray-600">hourglass_top</span>
              <p class="mt-2 text-gray-400">Waiting for admin response...</p>
              <p class="text-sm text-gray-500">We'll get back to you as soon as possible</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="border-t border-surface-border p-5">
            <button
              @click="showViewModal = false"
              class="w-full rounded-lg border border-surface-border py-2 text-gray-300 transition-colors hover:bg-surface"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const { user } = useAuth()
const {
  tickets,
  loading,
  categories,
  createTicket,
  fetchMyTickets,
  getCategoryInfo,
  getStatusInfo,
  getTicketStats
} = useSupport()

// UI State
const showCreateModal = ref(false)
const showViewModal = ref(false)
const selectedTicket = ref(null)
const submitting = ref(false)

// Form
const form = ref({
  category: '',
  subject: '',
  message: ''
})

// Stats
const stats = computed(() => getTicketStats())

// Load tickets on mount
onMounted(async () => {
  if (user.value) {
    await fetchMyTickets(user.value.$id)
  }
})

// Format date
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// View ticket details
const viewTicket = (ticket) => {
  selectedTicket.value = ticket
  showViewModal.value = true
}

// Submit new ticket
const submitTicket = async () => {
  if (!user.value || submitting.value) return

  submitting.value = true
  try {
    await createTicket(form.value, user.value.$id)
    
    // Reset form
    form.value = { category: '', subject: '', message: '' }
    showCreateModal.value = false
    
    // Refresh tickets
    await fetchMyTickets(user.value.$id)
  }
  catch (err) {
    console.error('Failed to create ticket:', err)
    alert('Failed to create ticket. Please try again.')
  }
  finally {
    submitting.value = false
  }
}
</script>
