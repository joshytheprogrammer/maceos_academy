<template>
  <UiLoadingScreen v-if="!authReady" message="Loading materials..." />
  
  <div v-else class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white">Course Materials</h1>
      <p class="mt-1 text-gray-400">Access your weekly learning materials, videos, and resources</p>
    </div>

    <!-- Week Navigation -->
    <div class="mb-8 flex flex-wrap gap-2">
      <button 
        v-for="w in 10" 
        :key="w"
        @click="selectedWeek = w"
        :class="selectedWeek === w 
          ? 'bg-primary text-background-dark' 
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
        class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
      >
        Week {{ w }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="h-10 w-10 animate-spin rounded-full border-2 border-gray-600 border-t-primary"></div>
    </div>

    <!-- Content Grid -->
    <div v-else-if="weekContent.length > 0" class="space-y-4">
      <div 
        v-for="item in weekContent" 
        :key="item.$id"
        class="group rounded-xl border border-gray-800 bg-gray-900/50 p-5 transition-all hover:border-gray-700 hover:bg-gray-900"
      >
        <div class="flex items-start gap-4">
          <!-- Icon -->
          <div 
            :class="getTypeColor(item.type)" 
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-800"
          >
            <span class="material-symbols-outlined text-2xl">{{ getTypeIcon(item.type) }}</span>
          </div>

          <!-- Content Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="font-semibold text-white group-hover:text-primary transition-colors">
                  {{ item.title }}
                </h3>
                <p v-if="item.description" class="mt-1 text-sm text-gray-400 line-clamp-2">
                  {{ item.description }}
                </p>
              </div>
              
              <!-- Type Badge -->
              <span class="shrink-0 rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300 capitalize">
                {{ item.type }}
              </span>
            </div>

            <!-- Meta Info -->
            <div class="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span v-if="item.fileSize" class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">straighten</span>
                {{ formatFileSize(item.fileSize) }}
              </span>
              <span v-if="item.downloadLimit && item.downloadLimit > 0" class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">download</span>
                {{ item.downloadLimit }} download{{ item.downloadLimit > 1 ? 's' : '' }} allowed
              </span>
              <span v-if="item.accessibleUntil" class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">schedule</span>
                Available until {{ formatDate(item.accessibleUntil) }}
              </span>
            </div>

            <!-- Action Buttons -->
            <div class="mt-4 flex flex-wrap gap-3">
              <!-- Live Session Link -->
              <template v-if="item.type === 'live-link'">
                <a 
                  v-if="isLiveSessionActive(item)"
                  :href="item.liveLink" 
                  target="_blank"
                  class="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-600"
                >
                  <span class="material-symbols-outlined text-[18px]">videocam</span>
                  Join Live Session
                </a>
                <span 
                  v-else-if="isLiveSessionUpcoming(item)"
                  class="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-400"
                >
                  <span class="material-symbols-outlined text-[18px]">schedule</span>
                  Starts {{ formatDateTime(item.liveStartTime) }}
                </span>
                <span 
                  v-else
                  class="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-500"
                >
                  <span class="material-symbols-outlined text-[18px]">event_busy</span>
                  Session Ended
                </span>
              </template>

              <!-- Downloadable Content -->
              <template v-else-if="item.fileId">
                <button 
                  @click="downloadContent(item)"
                  :disabled="downloadingId === item.$id"
                  class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background-dark transition-colors hover:bg-primary-dark disabled:opacity-50"
                >
                  <span v-if="downloadingId === item.$id" class="material-symbols-outlined animate-spin text-[18px]">sync</span>
                  <span v-else class="material-symbols-outlined text-[18px]">download</span>
                  {{ downloadingId === item.$id ? 'Downloading...' : 'Download' }}
                </button>
                
                <!-- Preview for PDFs -->
                <button 
                  v-if="item.type === 'pdf'"
                  @click="previewContent(item)"
                  class="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
                >
                  <span class="material-symbols-outlined text-[18px]">visibility</span>
                  Preview
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="rounded-xl border border-gray-800 bg-gray-900/50 py-20 text-center">
      <span class="material-symbols-outlined text-5xl text-gray-600">folder_open</span>
      <h3 class="mt-4 text-lg font-medium text-white">No Materials Yet</h3>
      <p class="mt-2 text-gray-400">
        Week {{ selectedWeek }} materials will appear here once they're available.
      </p>
    </div>

    <!-- Download Error Toast -->
    <Teleport to="body">
      <div 
        v-if="downloadError" 
        class="fixed bottom-4 right-4 z-50 max-w-md rounded-xl border border-red-500/30 bg-red-500/10 p-4 backdrop-blur-sm"
      >
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-red-400">error</span>
          <div>
            <p class="font-medium text-red-400">Download Failed</p>
            <p class="mt-1 text-sm text-red-300">{{ downloadError }}</p>
          </div>
          <button @click="downloadError = ''" class="text-red-400 hover:text-red-300">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Preview Modal -->
    <Teleport to="body">
      <div v-if="previewItem" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/80" @click="previewItem = null"></div>
        <div class="relative h-[90vh] w-full max-w-5xl rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
          <div class="flex items-center justify-between border-b border-gray-800 px-4 py-3">
            <h3 class="font-medium text-white">{{ previewItem.title }}</h3>
            <button @click="previewItem = null" class="text-gray-400 hover:text-white">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <iframe 
            :src="getFileViewUrl(previewItem.fileId)" 
            class="h-[calc(100%-56px)] w-full"
          ></iframe>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'student']
})

const { user } = useAuth()
const { 
  content,
  loading, 
  fetchStudentContent, 
  logDownload,
  getUserDownloadCount,
  getFileDownloadUrl,
  getFileViewUrl,
  getTypeIcon, 
  getTypeColor, 
  formatFileSize 
} = useContent()

// State
const authReady = ref(false)
const selectedWeek = ref(1)
const downloadingId = ref(null)
const downloadError = ref('')
const previewItem = ref(null)

// Computed
const weekContent = computed(() => {
  return content.value.filter(item => item.week === selectedWeek.value)
})

// Methods
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

const formatDateTime = (dateStr) => {
  return new Date(dateStr).toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const isLiveSessionActive = (item) => {
  if (!item.liveStartTime || !item.liveEndTime) return true // No time restriction
  const now = new Date()
  const start = new Date(item.liveStartTime)
  const end = new Date(item.liveEndTime)
  // Active from 15 minutes before start until 1 hour after end
  return now >= new Date(start.getTime() - 15 * 60 * 1000) && now <= new Date(end.getTime() + 60 * 60 * 1000)
}

const isLiveSessionUpcoming = (item) => {
  if (!item.liveStartTime) return false
  const now = new Date()
  const start = new Date(item.liveStartTime)
  return now < new Date(start.getTime() - 15 * 60 * 1000)
}

const downloadContent = async (item) => {
  if (!item.fileId) return
  
  downloadingId.value = item.$id
  downloadError.value = ''
  
  try {
    // Check download limit first via server
    const result = await $fetch('/api/content/download', {
      method: 'POST',
      body: {
        contentId: item.$id,
        userId: user.value.$id
      }
    })
    
    if (!result.success) {
      throw new Error(result.message || 'Download failed')
    }
    
    // Get download URL and trigger download
    const downloadUrl = getFileDownloadUrl(item.fileId)
    
    // Create a temporary link and click it
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = item.fileName || item.title
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  catch (e) {
    downloadError.value = e.data?.statusMessage || e.message || 'Failed to download file'
    setTimeout(() => { downloadError.value = '' }, 5000)
  }
  finally {
    downloadingId.value = null
  }
}

const previewContent = (item) => {
  previewItem.value = item
}

// Watch for week changes
watch(selectedWeek, async () => {
  await fetchStudentContent(selectedWeek.value)
})

// Initialize
onMounted(async () => {
  await fetchStudentContent(selectedWeek.value)
  authReady.value = true
})
</script>
