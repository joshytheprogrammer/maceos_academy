<template>
  <UiLoadingScreen v-if="!authReady || loading" message="Loading application..." />
  
  <div v-else-if="!application" class="flex flex-col items-center justify-center py-20">
    <span class="material-symbols-outlined mb-4 text-6xl text-gray-600">error</span>
    <h2 class="text-xl font-semibold text-white">Application Not Found</h2>
    <p class="mt-2 text-gray-400">The application you're looking for doesn't exist.</p>
    <NuxtLink to="/admin/applications" class="mt-6 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600">
      Back to Applications
    </NuxtLink>
  </div>
  
  <div v-else>
    <!-- Back Link -->
    <NuxtLink to="/admin/applications" class="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-6">
      <span class="material-symbols-outlined text-[18px]">arrow_back</span>
      Back to Applications
    </NuxtLink>

    <!-- Header -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div class="flex items-start gap-4">
        <div class="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center">
          <span class="text-2xl font-medium text-gray-400">{{ getInitials(application.full_name) }}</span>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-white">{{ application.full_name }}</h1>
          <p class="text-gray-400">{{ application.email }}</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <span :class="getStatusBadgeClass(application.status)" class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize">
              {{ application.status }}
            </span>
            <span :class="getPaymentBadgeClass(application.payment_status)" class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium">
              <span class="material-symbols-outlined text-[14px]">{{ application.payment_status === 'success' ? 'check_circle' : 'schedule' }}</span>
              {{ application.payment_status === 'success' ? 'Paid' : 'Payment Pending' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button 
          v-if="application.status === 'pending'"
          @click="showRejectModal = true"
          class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
        >
          <span class="material-symbols-outlined mr-1 align-middle text-[18px]">close</span>
          Reject
        </button>
        <button 
          v-if="application.status === 'pending' && application.payment_status === 'success'"
          @click="showApproveModal = true"
          class="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
        >
          <span class="material-symbols-outlined mr-1 align-middle text-[18px]">check</span>
          Approve Application
        </button>
        <span v-if="application.status === 'approved'" class="rounded-lg bg-green-500/20 px-4 py-2 text-sm font-medium text-green-400">
          ✓ Approved
        </span>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="mt-8 grid gap-6 lg:grid-cols-3">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Personal Information -->
        <div class="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Personal Information</h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-sm text-gray-500">Full Name</p>
              <p class="mt-1 text-white">{{ application.full_name }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Email</p>
              <p class="mt-1 text-white">{{ application.email }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Phone</p>
              <p class="mt-1 text-white">{{ application.phone || 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Country</p>
              <p class="mt-1 text-white">{{ application.country || 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Date of Birth</p>
              <p class="mt-1 text-white">{{ application.date_of_birth ? formatDate(application.date_of_birth) : 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Gender</p>
              <p class="mt-1 text-white capitalize">{{ application.gender || 'Not provided' }}</p>
            </div>
          </div>
        </div>

        <!-- Educational Background -->
        <div class="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Educational Background</h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-sm text-gray-500">Education Level</p>
              <p class="mt-1 text-white">{{ application.education_level || 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Institution</p>
              <p class="mt-1 text-white">{{ application.institution || 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Field of Study</p>
              <p class="mt-1 text-white">{{ application.field_of_study || 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Graduation Year</p>
              <p class="mt-1 text-white">{{ application.graduation_year || 'Not provided' }}</p>
            </div>
          </div>
        </div>

        <!-- Program Selection -->
        <div class="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Program Selection</h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-sm text-gray-500">Program Track</p>
              <p class="mt-1 text-white">{{ application.program_track || 'Not selected' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Learning Goals</p>
              <p class="mt-1 text-white">{{ application.learning_goals || 'Not provided' }}</p>
            </div>
          </div>
          <div v-if="application.motivation" class="mt-4">
            <p class="text-sm text-gray-500">Motivation</p>
            <p class="mt-1 text-white whitespace-pre-wrap">{{ application.motivation }}</p>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Application Timeline -->
        <div class="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Timeline</h3>
          <div class="space-y-4">
            <div class="flex gap-3">
              <div class="flex flex-col items-center">
                <div class="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span class="material-symbols-outlined text-[16px] text-green-400">check</span>
                </div>
                <div class="w-px flex-1 bg-gray-700"></div>
              </div>
              <div class="pb-4">
                <p class="font-medium text-white">Application Submitted</p>
                <p class="text-sm text-gray-500">{{ formatDateTime(application.$createdAt) }}</p>
              </div>
            </div>
            
            <div class="flex gap-3">
              <div class="flex flex-col items-center">
                <div :class="application.payment_status === 'success' ? 'bg-green-500/20' : 'bg-gray-700'" class="h-8 w-8 rounded-full flex items-center justify-center">
                  <span class="material-symbols-outlined text-[16px]" :class="application.payment_status === 'success' ? 'text-green-400' : 'text-gray-500'">
                    {{ application.payment_status === 'success' ? 'check' : 'schedule' }}
                  </span>
                </div>
                <div class="w-px flex-1 bg-gray-700"></div>
              </div>
              <div class="pb-4">
                <p class="font-medium" :class="application.payment_status === 'success' ? 'text-white' : 'text-gray-500'">Payment</p>
                <p class="text-sm text-gray-500">
                  {{ application.payment_status === 'success' ? 'Completed' : 'Pending payment' }}
                </p>
              </div>
            </div>
            
            <div class="flex gap-3">
              <div class="flex flex-col items-center">
                <div :class="application.status === 'approved' ? 'bg-green-500/20' : application.status === 'rejected' ? 'bg-red-500/20' : 'bg-gray-700'" class="h-8 w-8 rounded-full flex items-center justify-center">
                  <span class="material-symbols-outlined text-[16px]" :class="application.status === 'approved' ? 'text-green-400' : application.status === 'rejected' ? 'text-red-400' : 'text-gray-500'">
                    {{ application.status === 'approved' ? 'check' : application.status === 'rejected' ? 'close' : 'pending' }}
                  </span>
                </div>
              </div>
              <div>
                <p class="font-medium" :class="application.status !== 'pending' ? 'text-white' : 'text-gray-500'">Review</p>
                <p class="text-sm text-gray-500">
                  {{ application.status === 'approved' ? 'Approved' : application.status === 'rejected' ? 'Rejected' : 'Awaiting review' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Details -->
        <div v-if="payment" class="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Payment Details</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <p class="text-sm text-gray-500">Amount</p>
              <p class="text-white font-medium">₦{{ formatCurrency(payment.amount) }}</p>
            </div>
            <div class="flex justify-between">
              <p class="text-sm text-gray-500">Reference</p>
              <p class="text-white font-mono text-sm">{{ payment.reference }}</p>
            </div>
            <div class="flex justify-between">
              <p class="text-sm text-gray-500">Status</p>
              <span :class="payment.status === 'success' ? 'text-green-400' : 'text-amber-400'" class="text-sm font-medium capitalize">
                {{ payment.status }}
              </span>
            </div>
            <div class="flex justify-between">
              <p class="text-sm text-gray-500">Date</p>
              <p class="text-white text-sm">{{ formatDateTime(payment.$createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div class="space-y-2">
            <a :href="`mailto:${application.email}`" class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
              <span class="material-symbols-outlined text-[18px]">mail</span>
              Send Email
            </a>
            <button @click="copyEmail" class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
              <span class="material-symbols-outlined text-[18px]">content_copy</span>
              Copy Email
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Approve Modal -->
    <Teleport to="body">
      <div v-if="showApproveModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/70" @click="showApproveModal = false"></div>
        <div class="relative w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
            <span class="material-symbols-outlined text-green-400">check_circle</span>
          </div>
          <h3 class="text-lg font-semibold text-white">Approve Application</h3>
          <p class="mt-2 text-gray-400">
            You are about to approve <span class="font-medium text-white">{{ application.full_name }}</span>'s application.
          </p>
          <div class="mt-4 rounded-lg bg-gray-800/50 p-4">
            <p class="text-sm text-gray-400">This action will:</p>
            <ul class="mt-2 space-y-1 text-sm text-gray-300">
              <li class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[14px] text-green-400">check</span>
                Add 'student' label to their account
              </li>
              <li class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[14px] text-green-400">check</span>
                Update application status to 'approved'
              </li>
              <li class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[14px] text-green-400">check</span>
                Send welcome email with instructions
              </li>
            </ul>
          </div>
          
          <div class="mt-6 flex gap-3 justify-end">
            <button 
              @click="showApproveModal = false"
              class="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
            >
              Cancel
            </button>
            <button 
              @click="approveApplication"
              :disabled="processing"
              class="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600 disabled:opacity-50"
            >
              {{ processing ? 'Approving...' : 'Confirm Approval' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Reject Modal -->
    <Teleport to="body">
      <div v-if="showRejectModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/70" @click="showRejectModal = false"></div>
        <div class="relative w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
            <span class="material-symbols-outlined text-red-400">cancel</span>
          </div>
          <h3 class="text-lg font-semibold text-white">Reject Application</h3>
          <p class="mt-2 text-gray-400">
            Are you sure you want to reject <span class="font-medium text-white">{{ application.full_name }}</span>'s application?
          </p>
          
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-300">Reason (optional)</label>
            <textarea 
              v-model="rejectReason"
              rows="3"
              placeholder="Enter a reason for rejection..."
              class="mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            ></textarea>
          </div>
          
          <div class="mt-6 flex gap-3 justify-end">
            <button 
              @click="showRejectModal = false"
              class="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
            >
              Cancel
            </button>
            <button 
              @click="rejectApplication"
              :disabled="processing"
              class="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
            >
              {{ processing ? 'Rejecting...' : 'Reject Application' }}
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
const router = useRouter()
const authInitialized = useState('auth_initialized', () => false)
const authReady = computed(() => authInitialized.value)

const DB_ID = 'academia_db'
const APPLICATIONS_COLLECTION = 'applications'
const PAYMENTS_COLLECTION = 'payments'

// State
const loading = ref(true)
const application = ref(null)
const payment = ref(null)
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const rejectReason = ref('')
const processing = ref(false)

// Fetch application details
const fetchApplication = async () => {
  loading.value = true
  try {
    const appId = route.params.id
    const doc = await databases.getDocument(DB_ID, APPLICATIONS_COLLECTION, appId)
    application.value = doc

    // Fetch payment if exists
    if (doc.user_id) {
      try {
        const paymentDocs = await databases.listDocuments(DB_ID, PAYMENTS_COLLECTION, [
          Query.equal('user_id', doc.user_id),
          Query.equal('status', 'success'),
          Query.limit(1)
        ])
        if (paymentDocs.documents.length > 0) {
          payment.value = paymentDocs.documents[0]
        }
      } catch (e) {
        console.log('No payment found')
      }
    }
  } catch (error) {
    console.error('Error fetching application:', error)
    application.value = null
  } finally {
    loading.value = false
  }
}

// Approve application
const approveApplication = async () => {
  processing.value = true
  try {
    const response = await $fetch('/api/admin/approve-application', {
      method: 'POST',
      body: {
        applicationId: application.value.$id,
        userId: application.value.user_id
      }
    })

    if (response.success) {
      application.value.status = 'approved'
      showApproveModal.value = false
      
      // Update pending count
      const pendingCount = useState('admin_pending_count', () => 0)
      pendingCount.value = Math.max(0, pendingCount.value - 1)
    }
  } catch (error) {
    console.error('Error approving application:', error)
    alert('Failed to approve: ' + (error.data?.message || error.message))
  } finally {
    processing.value = false
  }
}

// Reject application
const rejectApplication = async () => {
  processing.value = true
  try {
    const response = await $fetch('/api/admin/reject-application', {
      method: 'POST',
      body: {
        applicationId: application.value.$id,
        reason: rejectReason.value
      }
    })

    if (response.success) {
      application.value.status = 'rejected'
      showRejectModal.value = false
      rejectReason.value = ''
      
      // Update pending count
      const pendingCount = useState('admin_pending_count', () => 0)
      pendingCount.value = Math.max(0, pendingCount.value - 1)
    }
  } catch (error) {
    console.error('Error rejecting application:', error)
    alert('Failed to reject: ' + (error.data?.message || error.message))
  } finally {
    processing.value = false
  }
}

// Copy email to clipboard
const copyEmail = async () => {
  if (application.value?.email) {
    await navigator.clipboard.writeText(application.value.email)
    // You could add a toast notification here
  }
}

// Helpers
const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatDateTime = (dateStr) => {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG').format(amount / 100)
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

onMounted(() => {
  fetchApplication()
})
</script>
