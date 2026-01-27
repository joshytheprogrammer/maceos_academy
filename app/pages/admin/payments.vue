<template>
  <UiLoadingScreen v-if="!authReady" message="Loading payments..." />
  
  <div v-else>
    <!-- Page Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Payments</h1>
        <p class="mt-1 text-gray-400">View all payment transactions</p>
      </div>
      
      <!-- Filter -->
      <select 
        v-model="statusFilter" 
        class="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
      >
        <option value="all">All Payments</option>
        <option value="success">Successful</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </select>
    </div>

    <!-- Stats -->
    <div class="mt-6 grid gap-4 sm:grid-cols-3">
      <div class="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <p class="text-sm text-gray-400">Total Collected</p>
        <p class="mt-1 text-2xl font-bold text-white">₦{{ formatCurrency(stats.totalRevenue) }}</p>
      </div>
      <div class="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <p class="text-sm text-gray-400">Successful Payments</p>
        <p class="mt-1 text-2xl font-bold text-green-400">{{ stats.successful }}</p>
      </div>
      <div class="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <p class="text-sm text-gray-400">This Month</p>
        <p class="mt-1 text-2xl font-bold text-blue-400">₦{{ formatCurrency(stats.thisMonth) }}</p>
      </div>
    </div>

    <!-- Payments Table -->
    <div class="mt-6 overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-green-500"></div>
      </div>

      <table v-else class="w-full">
        <thead class="border-b border-gray-800 bg-gray-900/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Reference</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Customer</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Amount</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Channel</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Date</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <tr v-for="payment in filteredPayments" :key="payment.$id" class="hover:bg-gray-800/50 transition-colors">
            <td class="whitespace-nowrap px-6 py-4">
              <p class="font-mono text-sm text-gray-300">{{ payment.reference }}</p>
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <p class="text-sm text-white">{{ payment.customer_email || 'N/A' }}</p>
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <p class="font-medium text-white">₦{{ formatCurrency(payment.amount) }}</p>
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <span :class="getStatusBadgeClass(payment.status)" class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize">
                <span class="material-symbols-outlined text-[14px]">{{ payment.status === 'success' ? 'check_circle' : payment.status === 'failed' ? 'cancel' : 'schedule' }}</span>
                {{ payment.status }}
              </span>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-400 capitalize">{{ payment.channel || 'N/A' }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{{ formatDate(payment.paid_at || payment.$createdAt) }}</td>
          </tr>
          <tr v-if="filteredPayments.length === 0 && !loading">
            <td colspan="6" class="px-6 py-12 text-center text-gray-500">
              <span class="material-symbols-outlined mb-2 text-4xl text-gray-600">payments</span>
              <p>No payments found</p>
            </td>
          </tr>
        </tbody>
      </table>
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

const DB_ID = 'academia_db'
const PAYMENTS_COLLECTION = 'payments'

// State
const loading = ref(true)
const payments = ref([])
const statusFilter = ref('all')

const stats = ref({
  totalRevenue: 0,
  successful: 0,
  thisMonth: 0
})

// Computed
const filteredPayments = computed(() => {
  if (statusFilter.value === 'all') return payments.value
  return payments.value.filter(p => p.status === statusFilter.value)
})

// Fetch payments
const fetchPayments = async () => {
  loading.value = true
  try {
    const response = await databases.listDocuments(DB_ID, PAYMENTS_COLLECTION, [
      Query.orderDesc('$createdAt'),
      Query.limit(100)
    ])
    payments.value = response.documents

    // Calculate stats
    const successfulPayments = response.documents.filter(p => p.status === 'success')
    stats.value.totalRevenue = successfulPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
    stats.value.successful = successfulPayments.length

    // This month calculation
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    stats.value.thisMonth = successfulPayments
      .filter(p => new Date(p.paid_at || p.$createdAt) >= startOfMonth)
      .reduce((sum, p) => sum + (p.amount || 0), 0)
  } catch (error) {
    console.error('Error fetching payments:', error)
  } finally {
    loading.value = false
  }
}

// Helpers
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG').format(amount / 100)
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusBadgeClass = (status) => {
  const classes = {
    success: 'bg-green-500/20 text-green-400',
    pending: 'bg-amber-500/20 text-amber-400',
    failed: 'bg-red-500/20 text-red-400'
  }
  return classes[status] || classes.pending
}

onMounted(() => {
  fetchPayments()
})
</script>
