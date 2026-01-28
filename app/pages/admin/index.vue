<template>
  <UiLoadingScreen v-if="!authReady" message="Loading admin panel..." />
  
  <div v-else>
    <!-- Stats Grid -->
    <div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Pending Applications -->
      <div class="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-6">
        <div class="flex items-center justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-medium text-amber-400">Pending Applications</p>
            <p class="mt-2 text-2xl sm:text-3xl font-bold text-white">{{ stats.pendingApplications }}</p>
          </div>
          <div class="rounded-lg bg-amber-500/20 p-2 sm:p-3 flex-shrink-0">
            <span class="material-symbols-outlined text-amber-400 text-xl sm:text-2xl">pending_actions</span>
          </div>
        </div>
        <NuxtLink to="/admin/applications?status=pending" class="mt-4 flex items-center text-xs sm:text-sm text-amber-400 hover:underline">
          Review now
          <span class="material-symbols-outlined ml-1 text-[16px]">arrow_forward</span>
        </NuxtLink>
      </div>

      <!-- Total Students -->
      <div class="rounded-xl border border-green-500/20 bg-green-500/5 p-4 sm:p-6">
        <div class="flex items-center justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-medium text-green-400">Active Students</p>
            <p class="mt-2 text-2xl sm:text-3xl font-bold text-white">{{ stats.activeStudents }}</p>
          </div>
          <div class="rounded-lg bg-green-500/20 p-2 sm:p-3 flex-shrink-0">
            <span class="material-symbols-outlined text-green-400 text-xl sm:text-2xl">school</span>
          </div>
        </div>
        <NuxtLink to="/admin/students" class="mt-4 flex items-center text-xs sm:text-sm text-green-400 hover:underline">
          View all
          <span class="material-symbols-outlined ml-1 text-[16px]">arrow_forward</span>
        </NuxtLink>
      </div>

      <!-- Total Revenue -->
      <div class="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 sm:p-6">
        <div class="flex items-center justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-medium text-blue-400">Total Revenue</p>
            <p class="mt-2 text-xl sm:text-3xl font-bold text-white break-words">₦{{ formatCurrency(stats.totalRevenue) }}</p>
          </div>
          <div class="rounded-lg bg-blue-500/20 p-2 sm:p-3 flex-shrink-0">
            <span class="material-symbols-outlined text-blue-400 text-xl sm:text-2xl">payments</span>
          </div>
        </div>
        <NuxtLink to="/admin/payments" class="mt-4 flex items-center text-xs sm:text-sm text-blue-400 hover:underline">
          View payments
          <span class="material-symbols-outlined ml-1 text-[16px]">arrow_forward</span>
        </NuxtLink>
      </div>

      <!-- Completed Payments -->
      <div class="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 sm:p-6">
        <div class="flex items-center justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-medium text-purple-400">Completed Payments</p>
            <p class="mt-2 text-2xl sm:text-3xl font-bold text-white">{{ stats.completedPayments }}</p>
          </div>
          <div class="rounded-lg bg-purple-500/20 p-2 sm:p-3 flex-shrink-0">
            <span class="material-symbols-outlined text-purple-400 text-xl sm:text-2xl">check_circle</span>
          </div>
        </div>
        <p class="mt-4 text-xs sm:text-sm text-gray-500">This month</p>
      </div>
    </div>

    <!-- Recent Applications Section -->
    <div class="mt-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 class="text-lg font-semibold text-white">Recent Applications</h3>
        <NuxtLink to="/admin/applications" class="text-sm text-green-400 hover:underline">View all</NuxtLink>
      </div>

      <div class="mt-4 rounded-xl border border-gray-800 bg-gray-900 overflow-x-auto">
        <table class="w-full min-w-max">
          <thead class="border-b border-gray-800 bg-gray-900/50">
            <tr>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Applicant</th>
              <th class="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Track</th>
              <th class="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Payment</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
              <th class="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Date</th>
              <th class="px-3 sm:px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr v-for="app in recentApplications" :key="app.$id" class="hover:bg-gray-800/50">
              <td class="px-3 sm:px-6 py-4">
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <span class="text-xs sm:text-sm font-medium text-gray-400">{{ getInitials(app.fullName) }}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="font-medium text-white text-xs sm:text-sm truncate">{{ app.fullName }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ app.email }}</p>
                  </div>
                </div>
              </td>
              <th class="hidden sm:table-cell px-3 sm:px-6 py-4 text-sm text-gray-300">{{ app.fieldOfStudy || 'Not selected' }}</th>
              <th class="hidden lg:table-cell px-3 sm:px-6 py-4">
                <span :class="getPaymentBadgeClass(app.paymentVerified)" class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
                  {{ app.paymentVerified ? 'Verified' : 'Pending' }}
                </span>
              </th>
              <td class="px-3 sm:px-6 py-4">
                <span :class="getStatusBadgeClass(app.status)" class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
                  {{ app.status }}
                </span>
              </td>
              <td class="hidden md:table-cell px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-400">{{ formatDate(app.submittedAt || app.$createdAt) }}</td>
              <td class="px-3 sm:px-6 py-4 text-right">
                <NuxtLink :to="`/admin/applications/${app.$id}`" class="text-xs sm:text-sm text-green-400 hover:underline">
                  View
                </NuxtLink>
              </td>
            </tr>
            <tr v-if="recentApplications.length === 0">
              <td colspan="6" class="px-3 sm:px-6 py-12 text-center text-gray-500">
                No applications yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { databases } from '~/utils/appwrite'
import { Query } from 'appwrite'

definePageMeta({
  layout: 'admin',
  middleware: ['admin']
})

const authInitialized = useState('auth_initialized', () => false)
const authReady = computed(() => authInitialized.value)

const stats = ref({
  pendingApplications: 0,
  activeStudents: 0,
  totalRevenue: 0,
  completedPayments: 0
})

const recentApplications = ref([])
const pendingCount = useState('admin_pending_count', () => 0)

const DB_ID = 'academia_db'
const APPLICATIONS_COLLECTION = 'applications'
const PAYMENTS_COLLECTION = 'payments'

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    // Fetch pending applications count (status = pending)
    const pendingApps = await databases.listDocuments(DB_ID, APPLICATIONS_COLLECTION, [
      Query.equal('status', 'pending')
    ])
    stats.value.pendingApplications = pendingApps.total
    pendingCount.value = pendingApps.total

    // Fetch approved applications count
    const approvedStudents = await databases.listDocuments(DB_ID, APPLICATIONS_COLLECTION, [
      Query.equal('status', 'approved')
    ])
    stats.value.activeStudents = approvedStudents.total

    // Fetch verified payments
    const payments = await databases.listDocuments(DB_ID, PAYMENTS_COLLECTION, [
      Query.equal('verified', true)
    ])
    stats.value.completedPayments = payments.total
    // Calculate total revenue from verified payments
    stats.value.totalRevenue = payments.documents.reduce((sum, p) => sum + (p.amount || 0), 0)

    // Fetch recent applications that are either pending or approved
    const recent = await databases.listDocuments(DB_ID, APPLICATIONS_COLLECTION, [
      Query.orderDesc('$updatedAt'),
      Query.limit(5)
    ])
    recentApplications.value = recent.documents
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

// Helper functions
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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG').format(amount)
}

const getStatusBadgeClass = (status) => {
  const classes = {
    pending: 'bg-amber-500/20 text-amber-400',
    approved: 'bg-green-500/20 text-green-400',
    rejected: 'bg-red-500/20 text-red-400'
  }
  return classes[status] || classes.pending
}

const getPaymentBadgeClass = (verified) => {
  return verified ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
}

onMounted(() => {
  fetchDashboardData()
})
</script>
