<template>
  <UiLoadingScreen v-if="!authReady" message="Loading live sessions..." />
  
  <div v-else>
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-3">
        <span class="h-px w-8 bg-primary/50"></span>
        <span class="text-primary text-xs font-bold tracking-widest uppercase">Interactive Learning</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-white font-display mb-2">Live Sessions</h1>
      <p class="text-text-secondary text-lg">Join interactive classes and Q&A sessions with instructors</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="h-12 w-12 animate-spin rounded-full border-2 border-surface-border border-t-primary"></div>
    </div>

    <div v-else>
      <!-- Active Sessions -->
      <div v-if="activeSessions.length > 0" class="mb-8">
        <div class="flex items-center gap-3 mb-5">
          <div class="h-3 w-3 bg-primary rounded-full animate-pulse"></div>
          <h2 class="text-2xl font-bold text-white font-display">Live Now</h2>
        </div>
        
        <div class="grid gap-4">
          <div 
            v-for="session in activeSessions" 
            :key="session.$id"
            class="group relative overflow-hidden rounded-2xl border-2 border-primary bg-linear-to-br from-primary/20 via-primary/10 to-transparent p-6 shadow-[0_0_30px_rgba(18,226,105,0.3)]"
          >
            <div class="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div class="relative">
              <div class="flex items-start gap-5">
                <div class="w-16 h-16 rounded-2xl bg-primary/20 border-2 border-primary flex items-center justify-center shrink-0 animate-pulse">
                  <span class="material-symbols-outlined text-4xl text-primary">videocam</span>
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 class="text-2xl font-bold text-white font-display mb-1">{{ session.title }}</h3>
                      <p v-if="session.description" class="text-text-secondary">{{ session.description }}</p>
                    </div>
                    <span class="shrink-0 px-4 py-2 bg-primary/20 border border-primary/40 rounded-full text-primary text-sm font-bold uppercase tracking-wider animate-pulse">
                      ● Live
                    </span>
                  </div>
                  
                  <div class="flex flex-wrap items-center gap-4 mb-5 text-sm text-text-secondary">
                    <span class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-primary">calendar_today</span>
                      Week {{ session.week }}
                    </span>
                    <span v-if="session.liveStartTime" class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-primary">schedule</span>
                      Started {{ formatTimeAgo(session.liveStartTime) }}
                    </span>
                    <span v-if="session.liveEndTime" class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-primary">timer</span>
                      Ends {{ formatTime(session.liveEndTime) }}
                    </span>
                  </div>
                  
                  <a 
                    :href="session.liveLink" 
                    target="_blank"
                    class="inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary hover:bg-primary-dark text-background-dark text-base font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(18,226,105,0.4)] hover:shadow-[0_0_30px_rgba(18,226,105,0.6)]"
                  >
                    <span class="material-symbols-outlined text-xl">videocam</span>
                    Join Session Now
                    <span class="material-symbols-outlined text-xl">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Sessions -->
      <div v-if="upcomingSessions.length > 0" class="mb-8">
        <h2 class="text-2xl font-bold text-white font-display mb-5">Upcoming Sessions</h2>
        
        <div class="grid gap-4">
          <div 
            v-for="session in upcomingSessions" 
            :key="session.$id"
            class="group bg-surface-dark border border-surface-border hover:border-primary/50 rounded-2xl p-6 transition-all"
          >
            <div class="flex items-start gap-5">
              <div class="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                <span class="material-symbols-outlined text-3xl text-amber-400">schedule</span>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 class="text-xl font-bold text-white font-display mb-1 group-hover:text-primary transition-colors">
                      {{ session.title }}
                    </h3>
                    <p v-if="session.description" class="text-text-secondary">{{ session.description }}</p>
                  </div>
                  <span class="shrink-0 px-3 py-1.5 bg-amber-500/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider">
                    Scheduled
                  </span>
                </div>
                
                <div class="flex flex-wrap items-center gap-4 text-sm">
                  <span class="flex items-center gap-2 text-text-secondary">
                    <span class="material-symbols-outlined text-primary">calendar_today</span>
                    Week {{ session.week }}
                  </span>
                  <span v-if="session.liveStartTime" class="flex items-center gap-2 font-bold text-white">
                    <span class="material-symbols-outlined text-primary">schedule</span>
                    {{ formatDateTime(session.liveStartTime) }}
                  </span>
                  <span v-if="session.liveStartTime" class="flex items-center gap-2 text-amber-400 font-medium">
                    <span class="material-symbols-outlined">notification_important</span>
                    Starts {{ formatTimeUntil(session.liveStartTime) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Past Sessions -->
      <div v-if="pastSessions.length > 0">
        <h2 class="text-2xl font-bold text-white font-display mb-5">Past Sessions</h2>
        
        <div class="grid gap-3">
          <div 
            v-for="session in pastSessions" 
            :key="session.$id"
            class="bg-surface-dark border border-surface-border rounded-xl p-5 opacity-60"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-lg bg-gray-500/10 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-2xl text-gray-500">videocam_off</span>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 class="text-lg font-bold text-gray-400 font-display mb-1">{{ session.title }}</h3>
                    <p v-if="session.description" class="text-gray-500 text-sm">{{ session.description }}</p>
                  </div>
                  <span class="shrink-0 px-3 py-1 bg-gray-500/20 rounded-full text-gray-500 text-xs font-bold uppercase tracking-wider">
                    Ended
                  </span>
                </div>
                
                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span class="flex items-center gap-2">
                    <span class="material-symbols-outlined">calendar_today</span>
                    Week {{ session.week }}
                  </span>
                  <span v-if="session.liveEndTime" class="flex items-center gap-2">
                    <span class="material-symbols-outlined">schedule</span>
                    Ended {{ formatTimeAgo(session.liveEndTime) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="allSessions.length === 0" class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-surface-border flex items-center justify-center">
          <span class="material-symbols-outlined text-5xl text-gray-500">videocam_off</span>
        </div>
        <h3 class="text-xl font-bold text-white font-display mb-2">No Live Sessions Yet</h3>
        <p class="text-text-secondary max-w-md mx-auto">
          Live sessions will appear here once they're scheduled. Check back soon for interactive classes and Q&A sessions!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'student']
})

const { user } = useAuth()
const { content, loading, fetchAllContent } = useContent()
const authInitialized = useState('auth_initialized', () => false)
const authReady = computed(() => authInitialized.value)

// Computed properties for session categories
const allSessions = computed(() => {
  return content.value.filter(item => item.type === 'live-link' && item.isPublished)
})

const activeSessions = computed(() => {
  return allSessions.value.filter(session => isSessionActive(session))
})

const upcomingSessions = computed(() => {
  return allSessions.value
    .filter(session => isSessionUpcoming(session))
    .sort((a, b) => new Date(a.liveStartTime) - new Date(b.liveStartTime))
})

const pastSessions = computed(() => {
  return allSessions.value
    .filter(session => isSessionPast(session))
    .sort((a, b) => new Date(b.liveEndTime) - new Date(a.liveEndTime))
    .slice(0, 10) // Show only last 10 past sessions
})

// Session status helpers
const isSessionActive = (session) => {
  if (!session.liveStartTime || !session.liveEndTime) return false
  const now = new Date()
  const start = new Date(session.liveStartTime)
  const end = new Date(session.liveEndTime)
  // Active from 15 minutes before start until 1 hour after end
  return now >= new Date(start.getTime() - 15 * 60 * 1000) && 
         now <= new Date(end.getTime() + 60 * 60 * 1000)
}

const isSessionUpcoming = (session) => {
  if (!session.liveStartTime) return false
  const now = new Date()
  const start = new Date(session.liveStartTime)
  return now < new Date(start.getTime() - 15 * 60 * 1000)
}

const isSessionPast = (session) => {
  if (!session.liveEndTime) return false
  const now = new Date()
  const end = new Date(session.liveEndTime)
  return now > new Date(end.getTime() + 60 * 60 * 1000)
}

// Formatting helpers
const formatDateTime = (dateStr) => {
  return new Date(dateStr).toLocaleString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

const formatTimeAgo = (dateStr) => {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return formatDateTime(dateStr)
}

const formatTimeUntil = (dateStr) => {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = date - now
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 0) return 'now'
  if (diffMins < 60) return `in ${diffMins} minute${diffMins > 1 ? 's' : ''}`
  if (diffHours < 24) return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`
  if (diffDays < 7) return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`
  return `on ${formatDateTime(dateStr)}`
}

// Initialize
onMounted(async () => {
  await fetchAllContent()
  
  // Auto-refresh every minute to update session statuses
  setInterval(() => {
    fetchAllContent()
  }, 60000)
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
