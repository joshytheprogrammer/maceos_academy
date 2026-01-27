<template>
  <UiLoadingScreen v-if="!authReady" message="Loading materials..." />
  
  <div v-else>
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-3">
        <span class="h-px w-8 bg-primary/50"></span>
        <span class="text-primary text-xs font-bold tracking-widest uppercase">Learning Resources</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-white font-display mb-2">Course Materials</h1>
      <p class="text-text-secondary text-lg">Access your weekly learning materials, videos, and resources</p>
    </div>

    <!-- Week Navigation -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="w in 10" 
          :key="w"
          @click="selectedWeek = w"
          :class="selectedWeek === w 
            ? 'bg-primary text-background-dark shadow-[0_0_20px_rgba(18,226,105,0.2)]' 
            : 'bg-surface-dark text-gray-400 border border-surface-border hover:border-primary/50 hover:text-white'"
          class="rounded-full px-5 py-2.5 text-sm font-bold transition-all"
        >
          Week {{ w }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="h-12 w-12 animate-spin rounded-full border-2 border-surface-border border-t-primary"></div>
    </div>

    <!-- Content Grid -->
    <div v-else-if="weekContent.length > 0" class="space-y-4">
      <div 
        v-for="item in weekContent" 
        :key="item.$id"
        class="group rounded-xl border border-surface-border bg-surface-dark hover:border-primary/50 p-6 transition-all"
      >
        <div class="flex items-start gap-5">
          <!-- Icon -->
          <div 
            class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-colors"
            :class="getIconContainerClass(item.type)"
          >
            <span class="material-symbols-outlined text-2xl">{{ getTypeIcon(item.type) }}</span>
          </div>

          <!-- Content Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-bold text-white group-hover:text-primary transition-colors font-display">
                  {{ item.title }}
                </h3>
                <p v-if="item.description" class="mt-2 text-text-secondary line-clamp-2">
                  {{ item.description }}
                </p>
              </div>
              
              <!-- Type Badge -->
              <span 
                class="shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                :class="getTypeBadgeClass(item.type)"
              >
                {{ item.type }}
              </span>
            </div>

            <!-- Meta Info -->
            <div class="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span v-if="item.fileSize" class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base text-primary">straighten</span>
                {{ formatFileSize(item.fileSize) }}
              </span>
              <span v-if="item.downloadLimit && item.downloadLimit > 0" class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base text-primary">download</span>
                {{ item.downloadLimit }} download{{ item.downloadLimit > 1 ? 's' : '' }} allowed
              </span>
              <span v-if="item.accessibleUntil" class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base text-primary">schedule</span>
                Available until {{ formatDate(item.accessibleUntil) }}
              </span>
            </div>

            <!-- Action Buttons -->
            <div class="mt-5 flex flex-wrap gap-3">
              <!-- Live Session Link -->
              <template v-if="item.type === 'live-link'">
                <a 
                  v-if="isLiveSessionActive(item)"
                  :href="item.liveLink" 
                  target="_blank"
                  class="inline-flex items-center justify-center gap-2 h-11 px-6 bg-primary hover:bg-primary-dark text-background-dark text-sm font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(18,226,105,0.2)]"
                >
                  <span class="material-symbols-outlined text-lg">videocam</span>
                  Join Live Session
                </a>
                <span 
                  v-else-if="isLiveSessionUpcoming(item)"
                  class="inline-flex items-center gap-2 h-11 px-6 bg-surface-darker border border-surface-border rounded-lg text-sm font-medium text-gray-400"
                >
                  <span class="material-symbols-outlined text-lg">schedule</span>
                  Starts {{ formatDateTime(item.liveStartTime) }}
                </span>
                <span 
                  v-else
                  class="inline-flex items-center gap-2 h-11 px-6 bg-surface-darker border border-surface-border rounded-lg text-sm font-medium text-gray-500"
                >
                  <span class="material-symbols-outlined text-lg">event_busy</span>
                  Session Ended
                </span>
              </template>

              <!-- Downloadable Content -->
              <template v-else-if="item.fileId">
                <button 
                  @click="downloadContent(item)"
                  :disabled="downloadingId === item.$id"
                  class="inline-flex items-center justify-center gap-2 h-11 px-6 bg-primary hover:bg-primary-dark text-background-dark text-sm font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(18,226,105,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="downloadingId === item.$id" class="material-symbols-outlined animate-spin text-lg">sync</span>
                  <span v-else class="material-symbols-outlined text-lg">download</span>
                  {{ downloadingId === item.$id ? 'Downloading...' : 'Download' }}
                </button>
                
                <!-- Preview for PDFs -->
                <button 
                  v-if="item.type === 'pdf'"
                  @click="previewContent(item)"
                  class="inline-flex items-center justify-center gap-2 h-11 px-6 bg-transparent border border-white/20 hover:border-primary/50 hover:bg-white/5 text-white text-sm font-bold rounded-lg transition-all"
                >
                  <span class="material-symbols-outlined text-lg">visibility</span>
                  Preview
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="rounded-2xl border border-surface-border bg-surface-dark py-20 text-center">
      <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-border flex items-center justify-center">
        <span class="material-symbols-outlined text-4xl text-gray-500">folder_open</span>
      </div>
      <h3 class="text-xl font-bold text-white font-display mb-2">No Materials Yet</h3>
      <p class="text-text-secondary max-w-md mx-auto">
        Week {{ selectedWeek }} materials will appear here once they're available. Check back soon!
      </p>
    </div>

    <!-- Download Error Toast -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div 
          v-if="downloadError" 
          class="fixed bottom-6 right-6 z-50 max-w-md rounded-xl border border-red-500/30 bg-red-500/10 p-5 backdrop-blur-md shadow-xl"
        >
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-red-400">error</span>
            </div>
            <div class="flex-1">
              <p class="font-bold text-red-400">Download Failed</p>
              <p class="mt-1 text-sm text-red-300">{{ downloadError }}</p>
            </div>
            <button @click="downloadError = ''" class="text-red-400 hover:text-red-300 transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Preview Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="previewItem" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" @click="previewItem = null"></div>
          <div class="relative h-[90vh] w-full max-w-5xl rounded-2xl border border-surface-border bg-surface-dark overflow-hidden shadow-2xl">
            <div class="flex items-center justify-between border-b border-surface-border px-6 py-4">
              <h3 class="font-bold text-white font-display">{{ previewItem.title }}</h3>
              <button @click="previewItem = null" class="p-2 text-gray-400 hover:text-white hover:bg-surface-darker rounded-lg transition-colors">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <iframe 
              :src="getFileViewUrl(previewItem.fileId)" 
              class="h-[calc(100%-65px)] w-full bg-white"
            ></iframe>
          </div>
        </div>
      </Transition>
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

const getIconContainerClass = (type) => {
  const classes = {
    'pdf': 'bg-red-500/10 text-red-400 group-hover:bg-red-500 group-hover:text-white',
    'video': 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white',
    'document': 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white',
    'presentation': 'bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white',
    'live-link': 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white',
    'exam': 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white',
    'audio': 'bg-pink-500/10 text-pink-400 group-hover:bg-pink-500 group-hover:text-white',
  }
  return classes[type] || 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background-dark'
}

const getTypeBadgeClass = (type) => {
  const classes = {
    'pdf': 'bg-red-500/20 text-red-400',
    'video': 'bg-purple-500/20 text-purple-400',
    'document': 'bg-blue-500/20 text-blue-400',
    'presentation': 'bg-orange-500/20 text-orange-400',
    'live-link': 'bg-cyan-500/20 text-cyan-400',
    'exam': 'bg-amber-500/20 text-amber-400',
    'audio': 'bg-pink-500/20 text-pink-400',
  }
  return classes[type] || 'bg-primary/20 text-primary'
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

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95);
}
</style>
