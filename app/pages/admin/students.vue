<template>
  <UiLoadingScreen v-if="!authReady" message="Loading students..." />
  
  <div v-else>
    <!-- Page Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Students</h1>
        <p class="mt-1 text-gray-400">Manage approved students</p>
      </div>
      
      <!-- Search -->
      <div class="relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">search</span>
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Search students..."
          class="w-full sm:w-64 rounded-lg border border-gray-700 bg-gray-800 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>
    </div>

    <!-- Students Table -->
    <div class="mt-6 overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-green-500"></div>
      </div>

      <table v-else class="w-full">
        <thead class="border-b border-gray-800 bg-gray-900/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Student</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Program</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Country</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Enrolled</th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <tr v-for="student in filteredStudents" :key="student.$id" class="hover:bg-gray-800/50 transition-colors">
            <td class="whitespace-nowrap px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span class="text-sm font-medium text-green-400">{{ getInitials(student.fullName) }}</span>
                </div>
                <div>
                  <p class="font-medium text-white">{{ student.fullName }}</p>
                  <p class="text-sm text-gray-500">{{ student.email }}</p>
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{{ student.fieldOfStudy || 'Not specified' }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{{ student.country || 'Unknown' }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{{ formatDate(student.submittedAt || student.$updatedAt) }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <NuxtLink :to="`/admin/applications/${student.$id}`" class="text-sm text-green-400 hover:underline">
                  View Application
                </NuxtLink>
              </div>
            </td>
          </tr>
          <tr v-if="filteredStudents.length === 0 && !loading">
            <td colspan="5" class="px-6 py-12 text-center text-gray-500">
              <span class="material-symbols-outlined mb-2 text-4xl text-gray-600">school</span>
              <p>{{ searchQuery ? 'No students found matching your search' : 'No approved students yet' }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Summary -->
    <div class="mt-6 flex items-center justify-between text-sm text-gray-400">
      <p>Total students: {{ students.length }}</p>
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
const APPLICATIONS_COLLECTION = 'applications'

// State
const loading = ref(true)
const students = ref([])
const searchQuery = ref('')

// Computed
const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value
  
  const query = searchQuery.value.toLowerCase()
  return students.value.filter(s => 
    s.fullName?.toLowerCase().includes(query) ||
    s.email?.toLowerCase().includes(query) ||
    s.country?.toLowerCase().includes(query) ||
    s.fieldOfStudy?.toLowerCase().includes(query)
  )
})

// Fetch approved students
const fetchStudents = async () => {
  loading.value = true
  try {
    const response = await databases.listDocuments(DB_ID, APPLICATIONS_COLLECTION, [
      Query.equal('status', 'approved'),
      Query.orderDesc('$updatedAt'),
      Query.limit(100)
    ])
    students.value = response.documents
  } catch (error) {
    console.error('Error fetching students:', error)
  } finally {
    loading.value = false
  }
}

// Helpers
const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

onMounted(() => {
  fetchStudents()
})
</script>
