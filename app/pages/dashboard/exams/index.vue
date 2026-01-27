<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Examinations</h1>
      <p class="mt-1 text-gray-400">Complete your weekly assessments to track your progress</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
    </div>

    <!-- No Exams -->
    <div v-else-if="exams.length === 0" class="rounded-xl border border-surface-border bg-surface-dark p-12 text-center">
      <span class="material-symbols-outlined text-5xl text-gray-600">quiz</span>
      <h3 class="mt-4 text-lg font-semibold text-white">No Exams Available</h3>
      <p class="mt-1 text-gray-400">Check back later for upcoming assessments</p>
    </div>

    <!-- Exams List -->
    <div v-else class="space-y-8">
      <!-- Available Exams -->
      <section v-if="availableExams.length > 0">
        <div class="mb-3 flex items-center gap-2">
          <span class="h-2 w-2 animate-pulse rounded-full bg-primary"></span>
          <h2 class="text-sm font-semibold uppercase tracking-wider text-primary">Available Now</h2>
        </div>
        <div class="space-y-3">
          <div
            v-for="exam in availableExams"
            :key="exam.$id"
            class="rounded-xl border border-primary/30 bg-surface-dark p-5 transition-colors hover:border-primary/50"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="min-w-0 flex-1">
                <div class="mb-2 flex flex-wrap items-center gap-2">
                  <span class="rounded bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">Week {{ exam.week }}</span>
                  <h3 class="text-lg font-semibold text-white">{{ exam.title }}</h3>
                </div>
                <p class="mb-3 line-clamp-1 text-sm text-gray-400">{{ exam.description || 'No description available' }}</p>
                
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px]">schedule</span>
                    {{ exam.duration }} mins
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px]">help</span>
                    {{ exam.questions?.length || 0 }} questions
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px]">verified</span>
                    {{ exam.passingScore }}% to pass
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px]">replay</span>
                    {{ getRemainingAttempts(exam) }} attempts left
                  </span>
                </div>

                <!-- Previous Attempts -->
                <div v-if="getUserExamAttempts(exam.$id).length > 0" class="mt-3 flex flex-wrap items-center gap-2 border-t border-surface-border pt-3">
                  <span class="text-xs text-gray-500">Previous:</span>
                  <span
                    v-for="(attempt, idx) in getUserExamAttempts(exam.$id).slice(0, 3)"
                    :key="attempt.$id"
                    :class="[
                      'rounded px-2 py-0.5 text-xs font-medium',
                      attempt.passed ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-400'
                    ]"
                  >
                    {{ attempt.score }}%
                  </span>
                </div>
              </div>

              <NuxtLink
                v-if="getRemainingAttempts(exam) > 0"
                :to="`/dashboard/exams/${exam.$id}`"
                class="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-background-dark transition-colors hover:bg-primary-dark"
              >
                <span class="material-symbols-outlined text-[20px]">play_arrow</span>
                Start
              </NuxtLink>
              <span v-else class="shrink-0 rounded-lg bg-gray-700/50 px-4 py-2 text-sm text-gray-400">
                No attempts left
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Upcoming Exams -->
      <section v-if="upcomingExams.length > 0">
        <div class="mb-3 flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] text-amber-400">event</span>
          <h2 class="text-sm font-semibold uppercase tracking-wider text-amber-400">Upcoming</h2>
        </div>
        <div class="space-y-3">
          <div
            v-for="exam in upcomingExams"
            :key="exam.$id"
            class="rounded-xl border border-surface-border bg-surface-dark/60 p-5"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="min-w-0 flex-1">
                <div class="mb-2 flex flex-wrap items-center gap-2">
                  <span class="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">Week {{ exam.week }}</span>
                  <h3 class="text-lg font-semibold text-white/80">{{ exam.title }}</h3>
                </div>
                <p class="mb-2 line-clamp-1 text-sm text-gray-500">{{ exam.description || 'No description available' }}</p>
                <div class="flex items-center gap-1 text-xs text-amber-400/80">
                  <span class="material-symbols-outlined text-[16px]">schedule</span>
                  Opens {{ formatDate(exam.startDate) }}
                </div>
              </div>
              <span class="shrink-0 rounded-lg bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Completed Exams -->
      <section v-if="completedExams.length > 0">
        <div class="mb-3 flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] text-gray-400">check_circle</span>
          <h2 class="text-sm font-semibold uppercase tracking-wider text-gray-400">Completed</h2>
        </div>
        <div class="space-y-3">
          <div
            v-for="exam in completedExams"
            :key="exam.$id"
            class="rounded-xl border border-surface-border bg-surface-dark/40 p-5"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="min-w-0 flex-1">
                <div class="mb-2 flex flex-wrap items-center gap-2">
                  <span class="rounded bg-gray-600/30 px-2 py-0.5 text-xs font-medium text-gray-400">Week {{ exam.week }}</span>
                  <h3 class="text-lg font-semibold text-white/70">{{ exam.title }}</h3>
                </div>
                
                <!-- Best Score -->
                <div v-if="getBestAttempt(exam.$id)" class="flex items-center gap-3">
                  <span class="text-sm text-gray-500">Best Score:</span>
                  <span
                    :class="[
                      'text-xl font-bold',
                      getBestAttempt(exam.$id).passed ? 'text-primary' : 'text-red-400'
                    ]"
                  >
                    {{ getBestAttempt(exam.$id).score }}%
                  </span>
                  <span
                    :class="[
                      'rounded px-2 py-0.5 text-xs font-medium',
                      getBestAttempt(exam.$id).passed ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-400'
                    ]"
                  >
                    {{ getBestAttempt(exam.$id).passed ? 'Passed' : 'Failed' }}
                  </span>
                </div>
                <div v-else class="text-sm text-gray-500">No attempts recorded</div>
              </div>
              <span class="shrink-0 rounded-lg bg-gray-700/30 px-4 py-2 text-sm text-gray-500">
                Ended
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const { user } = useAuth()
const { 
  exams, 
  loading, 
  fetchPublishedExams,
  getAllUserAttempts,
  isExamAvailable,
  isExamUpcoming,
  isExamEnded
} = useExam()

const userAttempts = ref([])

// Categorize exams
const availableExams = computed(() => exams.value.filter(exam => isExamAvailable(exam)))
const upcomingExams = computed(() => exams.value.filter(exam => isExamUpcoming(exam)))
const completedExams = computed(() => exams.value.filter(exam => isExamEnded(exam)))

// Get user's attempts for a specific exam
const getUserExamAttempts = (examId) => {
  return userAttempts.value
    .filter(a => a.examId === examId && a.isSubmitted)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
}

// Get remaining attempts for an exam
const getRemainingAttempts = (exam) => {
  const attempts = getUserExamAttempts(exam.$id)
  return Math.max(0, exam.attemptsAllowed - attempts.length)
}

// Get best attempt for an exam
const getBestAttempt = (examId) => {
  const attempts = getUserExamAttempts(examId)
  if (attempts.length === 0) return null
  return attempts.reduce((best, current) => 
    (current.score > (best?.score || 0)) ? current : best
  , null)
}

// Format date
const formatDate = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

// Load data on mount
onMounted(async () => {
  await fetchPublishedExams()
  if (user.value?.$id) {
    userAttempts.value = await getAllUserAttempts(user.value.$id)
  }
})
</script>
