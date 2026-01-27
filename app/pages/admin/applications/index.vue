<template>
  <UiLoadingScreen v-if="!authReady" message="Loading applications..." />
  
  <div v-else>
    <!-- Page Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Applications</h1>
        <p class="mt-1 text-gray-400">Review and manage student applications</p>
      </div>
      
      <!-- Filters -->
      <div class="flex gap-2">
        <select 
          v-model="statusFilter" 
          class="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        
        <select 
          v-model="paymentFilter" 
          class="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          <option value="all">All Payments</option>
          <option value="pending">Payment Pending</option>
          <option value="success">Paid</option>
        </select>
      </div>
    </div>

    <!-- Stats Pills -->
    <div class="mt-6 flex flex-wrap gap-3">
      <button 
        @click="statusFilter = 'all'; paymentFilter = 'all'"
        :class="statusFilter === 'all' && paymentFilter === 'all' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'"
        class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
      >
        All ({{ stats.total }})
      </button>
      <button 
        @click="statusFilter = 'pending'; paymentFilter = 'all'"
        :class="statusFilter === 'pending' ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'"
        class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
      >
        Pending Review ({{ stats.pending }})
      </button>
      <button 
        @click="statusFilter = 'all'; paymentFilter = 'success'"
        :class="paymentFilter === 'success' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'"
        class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
      >
        Paid ({{ stats.paid }})
      </button>
      <button 
        @click="statusFilter = 'approved'"
        :class="statusFilter === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'"
        class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
      >
        Approved ({{ stats.approved }})
      </button>
    </div>

    <!-- Applications Table -->
    <div class="mt-6 overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-green-500"></div>
      </div>

      <table v-else class="w-full">
        <thead class="border-b border-gray-800 bg-gray-900/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Applicant</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Program</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Payment</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Submitted</th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <tr v-for="app in filteredApplications" :key="app.$id" class="hover:bg-gray-800/50 transition-colors">
            <td class="whitespace-nowrap px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-400">{{ getInitials(app.full_name) }}</span>
                </div>
                <div>
                  <p class="font-medium text-white">{{ app.full_name }}</p>
                  <p class="text-sm text-gray-500">{{ app.email }}</p>
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <p class="text-sm text-gray-300">{{ app.program_track || 'Not selected' }}</p>
              <p class="text-xs text-gray-500">{{ app.country || 'Unknown' }}</p>
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <span :class="getPaymentBadgeClass(app.payment_status)" class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium">
                <span class="material-symbols-outlined text-[14px]">{{ app.payment_status === 'success' ? 'check_circle' : 'schedule' }}</span>
                {{ app.payment_status === 'success' ? 'Paid' : 'Pending' }}
              </span>
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <span :class="getStatusBadgeClass(app.status)" class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize">
                {{ app.status }}
              </span>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
              {{ formatDate(app.$createdAt) }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <NuxtLink 
                  :to="`/admin/applications/${app.$id}`" 
                  class="rounded-lg bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
                >
                  View
                </NuxtLink>
                <button 
                  v-if="app.status === 'pending' && app.payment_status === 'success'"
                  @click="quickApprove(app)"
                  class="rounded-lg bg-green-500/20 px-3 py-1.5 text-sm font-medium text-green-400 transition-colors hover:bg-green-500/30"
                >
                  Approve
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredApplications.length === 0 && !loading">
            <td colspan="6" class="px-6 py-12 text-center text-gray-500">
              <span class="material-symbols-outlined mb-2 text-4xl text-gray-600">folder_open</span>
              <p>No applications found</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between">
      <p class="text-sm text-gray-400">
        Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, totalApplications) }} of {{ totalApplications }} applications
      </p>
      <div class="flex gap-2">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button 
          @click="currentPage++" 
          :disabled="currentPage >= totalPages"
          class="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Quick Approve Modal -->
    <Teleport to="body">
      <div v-if="showApproveModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/70" @click="showApproveModal = false"></div>
        <div class="relative w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h3 class="text-lg font-semibold text-white">Approve Application</h3>
          <p class="mt-2 text-gray-400">
            Are you sure you want to approve <span class="text-white font-medium">{{ selectedApp?.full_name }}</span>'s application?
          </p>
          <p class="mt-2 text-sm text-gray-500">
            This will add the 'student' label to their account and send them a welcome email with login instructions.
          </p>
          
          <div class="mt-6 flex gap-3 justify-end">
            <button 
              @click="showApproveModal = false"
              class="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
            >
              Cancel
            </button>
            <button 
              @click="confirmApprove"
              :disabled="approving"
              class="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600 disabled:opacity-50"
            >
              {{ approving ? 'Approving...' : 'Approve Student' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { databases } from '~/utils/appwrite'
import { Query } from 'appwrite'

definePageMeta({
  layout: 'admin',
  middleware: ['admin']
})

const route = useRoute()
const authInitialized = useState('auth_initialized', () => false)
const authReady = computed(() => authInitialized.value)

const DB_ID = 'academia_db'
const APPLICATIONS_COLLECTION = 'applications'

// State
const loading = ref(true)
const applications = ref([])
const statusFilter = ref(route.query.status || 'all')
const paymentFilter = ref('all')
const currentPage = ref(1)
const pageSize = 20
const totalApplications = ref(0)

const stats = ref({
  total: 0,
  pending: 0,
  approved: 0,
  paid: 0
})

// Modal state
const showApproveModal = ref(false)
const selectedApp = ref(null)
const approving = ref(false)

// Computed
const filteredApplications = computed(() => {
  let filtered = applications.value

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(a => a.status === statusFilter.value)
  }

  if (paymentFilter.value !== 'all') {
    filtered = filtered.filter(a => a.payment_status === paymentFilter.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(totalApplications.value / pageSize))

// Fetch applications
const fetchApplications = async () => {
  loading.value = true
  try {
    const queries = [
      Query.orderDesc('$createdAt'),
      Query.limit(100) // Get more for client-side filtering
    ]

    const response = await databases.listDocuments(DB_ID, APPLICATIONS_COLLECTION, queries)
    applications.value = response.documents
    totalApplications.value = response.total

    // Calculate stats
    stats.value.total = response.total
    stats.value.pending = response.documents.filter(a => a.status === 'pending').length
    stats.value.approved = response.documents.filter(a => a.status === 'approved').length
    stats.value.paid = response.documents.filter(a => a.payment_status === 'success').length
    
    // Update navbar pending count
    const pendingCount = useState('admin_pending_count', () => 0)
    pendingCount.value = stats.value.pending
  } catch (error) {
    console.error('Error fetching applications:', error)
  } finally {
    loading.value = false
  }
}

// Quick approve
const quickApprove = (app) => {
  selectedApp.value = app
  showApproveModal.value = true
}

const confirmApprove = async () => {
  if (!selectedApp.value) return
  
  approving.value = true
  try {
    const response = await $fetch('/api/admin/approve-application', {
      method: 'POST',
      body: {
        applicationId: selectedApp.value.$id,
        userId: selectedApp.value.user_id
      }
    })

    if (response.success) {
      // Update local state
      const index = applications.value.findIndex(a => a.$id === selectedApp.value.$id)
      if (index !== -1) {
        applications.value[index].status = 'approved'
      }
      
      // Recalculate stats
      stats.value.pending--
      stats.value.approved++
      
      const pendingCount = useState('admin_pending_count', () => 0)
      pendingCount.value = stats.value.pending

      showApproveModal.value = false
      selectedApp.value = null
    }
  } catch (error) {
    console.error('Error approving application:', error)
    alert('Failed to approve application: ' + (error.data?.message || error.message))
  } finally {
    approving.value = false
  }
}

// Helpers
const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getStatusBadgeClass = (status) => {
  const classes = {
    pending: 'bg-amber-500/20 text-amber-400',
    approved: 'bg-green-500/20 text-green-400',
    rejected: 'bg-red-500/20 text-red-400'
  }
  return classes[status] || classes.pending
}

const getPaymentBadgeClass = (status) => {
  const classes = {
    pending: 'bg-gray-500/20 text-gray-400',
    success: 'bg-green-500/20 text-green-400',
    failed: 'bg-red-500/20 text-red-400'
  }
  return classes[status] || classes.pending
}

// Watch for filter changes via URL
watch(() => route.query.status, (newStatus) => {
  if (newStatus) {
    statusFilter.value = newStatus
  }
})

onMounted(() => {
  fetchApplications()
})
</script>
