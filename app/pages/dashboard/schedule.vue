<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
    </div>

    <template v-else>
      <!-- Hero Section - Current Week Overview -->
      <div class="mb-8 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-surface-dark to-surface-dark">
        <div class="p-6 md:p-8">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <!-- Left: Week Info -->
            <div>
              <div class="mb-2 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">calendar_today</span>
                <span class="text-sm font-medium text-primary">Your Learning Journey</span>
              </div>
              <h1 class="mb-2 text-3xl font-bold text-white md:text-4xl">
                Week {{ currentWeek }} <span class="text-gray-400">of {{ totalWeeks }}</span>
              </h1>
              <p class="text-gray-400">
                <template v-if="currentWeekData">
                  {{ formatDateRange(currentWeekData.dateRange) }}
                </template>
              </p>
              <p class="mt-2 text-sm text-primary">
                <span class="material-symbols-outlined text-sm align-middle">timer</span>
                {{ getDaysRemainingInWeek }} days remaining this week
              </p>
            </div>

            <!-- Right: Progress Ring -->
            <div class="flex items-center gap-6">
              <div class="relative">
                <svg class="h-28 w-28 -rotate-90 transform">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="currentColor"
                    stroke-width="8"
                    fill="none"
                    class="text-surface-border"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="currentColor"
                    stroke-width="8"
                    fill="none"
                    :stroke-dasharray="301.59"
                    :stroke-dashoffset="301.59 - (301.59 * programProgress) / 100"
                    stroke-linecap="round"
                    class="text-primary transition-all duration-1000"
                  />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-2xl font-bold text-white">{{ programProgress }}%</span>
                  <span class="text-xs text-gray-400">Complete</span>
                </div>
              </div>

              <!-- Quick Stats -->
              <div class="hidden space-y-2 md:block">
                <div class="flex items-center gap-2 text-sm">
                  <span class="material-symbols-outlined text-lg text-green-400">check_circle</span>
                  <span class="text-gray-300">{{ progress.passedExams }}/{{ progress.totalExams }} exams passed</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <span class="material-symbols-outlined text-lg text-blue-400">download</span>
                  <span class="text-gray-300">{{ progress.downloadedMaterials }}/{{ progress.totalMaterials }} materials</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <span class="material-symbols-outlined text-lg text-yellow-400">star</span>
                  <span class="text-gray-300">{{ progress.averageScore }}% avg score</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="border-t border-surface-border bg-surface-dark/50 px-6 py-4 md:px-8">
          <div class="flex items-center gap-3">
            <div class="flex-1">
              <div class="flex justify-between text-xs text-gray-500">
                <span>Week 1</span>
                <span>Week {{ totalWeeks }}</span>
              </div>
              <div class="mt-1 flex gap-1">
                <div
                  v-for="week in totalWeeks"
                  :key="week"
                  :class="[
                    'h-2 flex-1 rounded-full transition-all',
                    week < currentWeek ? 'bg-primary' :
                    week === currentWeek ? 'bg-primary animate-pulse' :
                    'bg-surface-border'
                  ]"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Events Alert -->
      <div v-if="todayEvents.length > 0" class="mb-6">
        <div class="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-2xl text-yellow-400">notifications_active</span>
            <div class="flex-1">
              <h3 class="font-semibold text-yellow-400">Today's Events</h3>
              <div class="mt-1 flex flex-wrap gap-3">
                <div
                  v-for="(event, idx) in todayEvents"
                  :key="idx"
                  class="flex items-center gap-2 text-sm text-gray-300"
                >
                  <span class="material-symbols-outlined text-base" :class="event.isLive ? 'text-red-400' : 'text-yellow-400'">
                    {{ event.icon }}
                  </span>
                  <span>{{ event.title }}</span>
                  <span v-if="event.isLive" class="rounded bg-red-500 px-1.5 py-0.5 text-xs font-medium text-white">LIVE</span>
                  <span v-else class="text-gray-500">{{ formatTime(event.time) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Left Column: Weekly Timeline -->
        <div class="lg:col-span-2">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-white">Program Timeline</h2>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <span class="h-2 w-2 rounded-full bg-primary"></span> Current
              </span>
              <span class="flex items-center gap-1">
                <span class="h-2 w-2 rounded-full bg-green-500"></span> Completed
              </span>
              <span class="flex items-center gap-1">
                <span class="h-2 w-2 rounded-full bg-gray-600"></span> Upcoming
              </span>
            </div>
          </div>

          <!-- Timeline -->
          <div class="space-y-3">
            <div
              v-for="week in weeklySchedule"
              :key="week.week"
              :class="[
                'rounded-xl border transition-all',
                week.status === 'current' ? 'border-primary/50 bg-primary/5' :
                week.status === 'completed' ? 'border-green-500/30 bg-surface-dark' :
                week.status === 'upcoming' ? 'border-yellow-500/30 bg-surface-dark' :
                'border-surface-border bg-surface-dark opacity-60'
              ]"
            >
              <!-- Week Header -->
              <button
                @click="toggleWeek(week.week)"
                class="flex w-full items-center justify-between p-4 text-left"
              >
                <div class="flex items-center gap-4">
                  <!-- Week Number Badge -->
                  <div
                    :class="[
                      'flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold',
                      week.status === 'current' ? 'bg-primary text-primary-foreground' :
                      week.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      week.status === 'upcoming' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-surface text-gray-500'
                    ]"
                  >
                    {{ week.week }}
                  </div>
                  
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="font-semibold text-white">Week {{ week.week }}</h3>
                      <span
                        :class="[
                          'rounded px-2 py-0.5 text-xs font-medium',
                          week.status === 'current' ? 'bg-primary/20 text-primary' :
                          week.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          week.status === 'upcoming' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-700 text-gray-400'
                        ]"
                      >
                        {{ getWeekStatusInfo(week.status).label }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-500">{{ formatDateRange(week.dateRange) }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <!-- Item counts -->
                  <div class="hidden items-center gap-3 text-sm text-gray-400 sm:flex">
                    <span v-if="week.materials.length" class="flex items-center gap-1">
                      <span class="material-symbols-outlined text-base">description</span>
                      {{ week.materials.length }}
                    </span>
                    <span v-if="week.liveSessions.length" class="flex items-center gap-1">
                      <span class="material-symbols-outlined text-base">videocam</span>
                      {{ week.liveSessions.length }}
                    </span>
                    <span v-if="week.exams.length" class="flex items-center gap-1">
                      <span class="material-symbols-outlined text-base">quiz</span>
                      {{ week.exams.length }}
                    </span>
                  </div>

                  <!-- Completion -->
                  <div v-if="week.status !== 'locked'" class="w-16">
                    <div class="text-right text-sm font-medium" :class="week.completion === 100 ? 'text-green-400' : 'text-gray-400'">
                      {{ week.completion }}%
                    </div>
                    <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-border">
                      <div
                        class="h-full rounded-full transition-all"
                        :class="week.completion === 100 ? 'bg-green-500' : 'bg-primary'"
                        :style="{ width: `${week.completion}%` }"
                      ></div>
                    </div>
                  </div>

                  <!-- Expand Icon -->
                  <span
                    class="material-symbols-outlined text-gray-500 transition-transform"
                    :class="expandedWeeks.includes(week.week) ? 'rotate-180' : ''"
                  >
                    expand_more
                  </span>
                </div>
              </button>

              <!-- Week Content (Expandable) -->
              <div v-if="expandedWeeks.includes(week.week)" class="border-t border-surface-border p-4">
                <!-- Materials -->
                <div v-if="week.materials.length > 0" class="mb-4">
                  <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Materials</h4>
                  <div class="space-y-2">
                    <NuxtLink
                      v-for="material in week.materials"
                      :key="material.$id"
                      :to="`/dashboard/materials?week=${week.week}`"
                      class="flex items-center gap-3 rounded-lg border border-surface-border bg-surface p-3 transition-colors hover:border-primary/30"
                    >
                      <span class="material-symbols-outlined text-gray-400">
                        {{ getContentIcon(material.type) }}
                      </span>
                      <span class="flex-1 text-sm text-white">{{ material.title }}</span>
                      <span
                        v-if="material.isDownloaded"
                        class="material-symbols-outlined text-green-400"
                        title="Downloaded"
                      >
                        check_circle
                      </span>
                    </NuxtLink>
                  </div>
                </div>

                <!-- Live Sessions -->
                <div v-if="week.liveSessions.length > 0" class="mb-4">
                  <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Live Sessions</h4>
                  <div class="space-y-2">
                    <a
                      v-for="session in week.liveSessions"
                      :key="session.$id"
                      :href="session.liveLink"
                      target="_blank"
                      class="flex items-center gap-3 rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 transition-colors hover:bg-blue-500/10"
                    >
                      <span class="material-symbols-outlined" :class="session.isLive ? 'text-red-400' : 'text-blue-400'">
                        videocam
                      </span>
                      <div class="flex-1">
                        <span class="text-sm text-white">{{ session.title }}</span>
                        <p v-if="session.liveStartTime" class="text-xs text-gray-500">
                          {{ formatDateTime(session.liveStartTime) }}
                        </p>
                      </div>
                      <span v-if="session.isLive" class="rounded bg-red-500 px-2 py-0.5 text-xs font-bold text-white animate-pulse">
                        LIVE NOW
                      </span>
                      <span v-else-if="session.isUpcoming" class="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                        Upcoming
                      </span>
                    </a>
                  </div>
                </div>

                <!-- Exams -->
                <div v-if="week.exams.length > 0">
                  <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Exams</h4>
                  <div class="space-y-2">
                    <NuxtLink
                      v-for="exam in week.exams"
                      :key="exam.$id"
                      :to="`/dashboard/exams/${exam.$id}`"
                      :class="[
                        'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                        exam.isPassed ? 'border-green-500/30 bg-green-500/5' : 'border-surface-border bg-surface hover:border-primary/30'
                      ]"
                    >
                      <span class="material-symbols-outlined" :class="exam.isPassed ? 'text-green-400' : 'text-gray-400'">
                        quiz
                      </span>
                      <div class="flex-1">
                        <span class="text-sm text-white">{{ exam.title }}</span>
                        <p class="text-xs text-gray-500">
                          Due: {{ formatDate(exam.endDate) }}
                        </p>
                      </div>
                      <div v-if="exam.isPassed" class="text-right">
                        <span class="text-sm font-medium text-green-400">{{ exam.bestScore }}%</span>
                        <p class="text-xs text-green-400/70">Passed</p>
                      </div>
                      <div v-else-if="exam.isAttempted" class="text-right">
                        <span class="text-sm font-medium text-yellow-400">{{ exam.bestScore }}%</span>
                        <p class="text-xs text-yellow-400/70">Try again</p>
                      </div>
                      <span v-else class="rounded bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                        Start
                      </span>
                    </NuxtLink>
                  </div>
                </div>

                <!-- Empty Week -->
                <div v-if="!week.materials.length && !week.liveSessions.length && !week.exams.length" class="py-4 text-center text-gray-500">
                  <span class="material-symbols-outlined text-3xl">event_busy</span>
                  <p class="mt-2 text-sm">No content scheduled for this week yet</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Upcoming Events & Stats -->
        <div class="space-y-6">
          <!-- Upcoming Events -->
          <div class="rounded-xl border border-surface-border bg-surface-dark p-5">
            <h2 class="mb-4 flex items-center gap-2 font-bold text-white">
              <span class="material-symbols-outlined text-primary">event</span>
              Upcoming Events
            </h2>

            <div v-if="upcomingEvents.length === 0" class="py-6 text-center text-gray-500">
              <span class="material-symbols-outlined text-3xl">event_available</span>
              <p class="mt-2 text-sm">No upcoming events this week</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(event, idx) in upcomingEvents.slice(0, 5)"
                :key="idx"
                :class="[
                  'rounded-lg border p-3',
                  event.type === 'exam_deadline' ? 'border-red-500/30 bg-red-500/5' : 'border-blue-500/30 bg-blue-500/5'
                ]"
              >
                <div class="flex items-start gap-3">
                  <span
                    class="material-symbols-outlined mt-0.5"
                    :class="event.type === 'exam_deadline' ? 'text-red-400' : 'text-blue-400'"
                  >
                    {{ event.icon }}
                  </span>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-white">{{ event.title }}</p>
                    <p class="text-xs text-gray-500">Week {{ event.week }}</p>
                    <p
                      class="mt-1 text-xs font-medium"
                      :class="event.type === 'exam_deadline' ? 'text-red-400' : 'text-blue-400'"
                    >
                      {{ formatRelativeTime(event.date) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress Stats -->
          <div class="rounded-xl border border-surface-border bg-surface-dark p-5">
            <h2 class="mb-4 flex items-center gap-2 font-bold text-white">
              <span class="material-symbols-outlined text-primary">insights</span>
              Your Progress
            </h2>

            <div class="space-y-4">
              <!-- Exams Progress -->
              <div>
                <div class="mb-1 flex justify-between text-sm">
                  <span class="text-gray-400">Exams Passed</span>
                  <span class="font-medium text-white">{{ progress.passedExams }}/{{ progress.totalExams }}</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-surface-border">
                  <div
                    class="h-full rounded-full bg-green-500 transition-all"
                    :style="{ width: `${progress.totalExams ? (progress.passedExams / progress.totalExams) * 100 : 0}%` }"
                  ></div>
                </div>
              </div>

              <!-- Materials Progress -->
              <div>
                <div class="mb-1 flex justify-between text-sm">
                  <span class="text-gray-400">Materials Downloaded</span>
                  <span class="font-medium text-white">{{ progress.downloadedMaterials }}/{{ progress.totalMaterials }}</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-surface-border">
                  <div
                    class="h-full rounded-full bg-blue-500 transition-all"
                    :style="{ width: `${progress.totalMaterials ? (progress.downloadedMaterials / progress.totalMaterials) * 100 : 0}%` }"
                  ></div>
                </div>
              </div>

              <!-- Average Score -->
              <div class="rounded-lg border border-surface-border bg-surface p-4 text-center">
                <p class="text-xs uppercase tracking-wider text-gray-500">Average Exam Score</p>
                <p class="mt-1 text-3xl font-bold" :class="progress.averageScore >= 70 ? 'text-green-400' : progress.averageScore >= 50 ? 'text-yellow-400' : 'text-gray-400'">
                  {{ progress.averageScore }}%
                </p>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="rounded-xl border border-surface-border bg-surface-dark p-5">
            <h2 class="mb-4 font-bold text-white">Quick Actions</h2>
            <div class="space-y-2">
              <NuxtLink
                to="/dashboard/materials"
                class="flex items-center gap-3 rounded-lg border border-surface-border bg-surface p-3 transition-colors hover:border-primary/30"
              >
                <span class="material-symbols-outlined text-primary">folder</span>
                <span class="text-sm text-white">Browse All Materials</span>
              </NuxtLink>
              <NuxtLink
                to="/dashboard/exams"
                class="flex items-center gap-3 rounded-lg border border-surface-border bg-surface p-3 transition-colors hover:border-primary/30"
              >
                <span class="material-symbols-outlined text-primary">quiz</span>
                <span class="text-sm text-white">View All Exams</span>
              </NuxtLink>
              <NuxtLink
                to="/dashboard/live-sessions"
                class="flex items-center gap-3 rounded-lg border border-surface-border bg-surface p-3 transition-colors hover:border-primary/30"
              >
                <span class="material-symbols-outlined text-primary">videocam</span>
                <span class="text-sm text-white">Live Sessions</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const { user } = useAuth()
const {
  loading,
  currentWeek,
  totalWeeks,
  weeklySchedule,
  upcomingEvents,
  todayEvents,
  progress,
  getDaysRemainingInWeek,
  programProgress,
  loadSchedule,
  getWeekStatusInfo,
  formatRelativeTime
} = useSchedule()

// UI State
const expandedWeeks = ref([])

// Current week data
const currentWeekData = computed(() => {
  return weeklySchedule.value.find(w => w.week === currentWeek.value)
})

// Auto-expand current week
watch(currentWeek, (week) => {
  if (!expandedWeeks.value.includes(week)) {
    expandedWeeks.value.push(week)
  }
}, { immediate: true })

// Load schedule on mount
onMounted(async () => {
  if (user.value) {
    await loadSchedule(user.value.$id)
    // Expand current week after load
    if (!expandedWeeks.value.includes(currentWeek.value)) {
      expandedWeeks.value.push(currentWeek.value)
    }
  }
})

// Toggle week expansion
const toggleWeek = (week) => {
  const idx = expandedWeeks.value.indexOf(week)
  if (idx === -1) {
    expandedWeeks.value.push(week)
  } else {
    expandedWeeks.value.splice(idx, 1)
  }
}

// Get content type icon
const getContentIcon = (type) => {
  const icons = {
    document: 'description',
    video: 'play_circle',
    audio: 'headphones',
    live_session: 'videocam'
  }
  return icons[type] || 'description'
}

// Format date range
const formatDateRange = (dateRange) => {
  if (!dateRange?.start || !dateRange?.end) return ''
  
  const options = { month: 'short', day: 'numeric' }
  const start = new Date(dateRange.start).toLocaleDateString('en-US', options)
  const end = new Date(dateRange.end).toLocaleDateString('en-US', options)
  
  return `${start} - ${end}`
}

// Format date
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

// Format date time
const formatDateTime = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

// Format time
const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}
</script>
