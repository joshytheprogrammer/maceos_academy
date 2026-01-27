<template>
  <div class="min-h-screen bg-background-dark">
    <!-- Loading State -->
    <div v-if="pageLoading" class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <div class="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p class="text-gray-400">Loading exam...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="pageError" class="flex min-h-screen items-center justify-center p-6">
      <div class="max-w-md text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
          <span class="material-symbols-outlined text-3xl text-red-400">error</span>
        </div>
        <h2 class="mb-2 text-xl font-semibold text-white">{{ pageError }}</h2>
        <NuxtLink to="/dashboard/exams" class="inline-flex items-center gap-2 text-primary hover:underline">
          <span class="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Exams
        </NuxtLink>
      </div>
    </div>

    <!-- Pre-Exam Screen -->
    <div v-else-if="!examStarted" class="flex min-h-screen items-center justify-center p-6">
      <div class="w-full max-w-lg rounded-xl border border-surface-border bg-surface-dark p-6">
        <div class="mb-6 text-center">
          <span class="mb-3 inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
            Week {{ exam.week }}
          </span>
          <h1 class="mb-2 text-2xl font-bold text-white">{{ exam.title }}</h1>
          <p class="text-sm text-gray-400">{{ exam.description || 'Complete this assessment to test your knowledge' }}</p>
        </div>

        <div class="mb-6 grid grid-cols-2 gap-3">
          <div class="rounded-lg bg-background-dark p-3 text-center">
            <div class="text-xl font-bold text-white">{{ exam.questions?.length || 0 }}</div>
            <div class="text-xs text-gray-500">Questions</div>
          </div>
          <div class="rounded-lg bg-background-dark p-3 text-center">
            <div class="text-xl font-bold text-white">{{ exam.duration }}</div>
            <div class="text-xs text-gray-500">Minutes</div>
          </div>
          <div class="rounded-lg bg-background-dark p-3 text-center">
            <div class="text-xl font-bold text-white">{{ exam.passingScore }}%</div>
            <div class="text-xs text-gray-500">Pass Mark</div>
          </div>
          <div class="rounded-lg bg-background-dark p-3 text-center">
            <div class="text-xl font-bold text-white">{{ remainingAttempts }}</div>
            <div class="text-xs text-gray-500">Attempts Left</div>
          </div>
        </div>

        <div class="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
          <div class="flex gap-3">
            <span class="material-symbols-outlined mt-0.5 shrink-0 text-amber-400">info</span>
            <div class="text-sm text-amber-200/90">
              <p class="mb-1 font-medium">Before you begin:</p>
              <ul class="list-inside list-disc space-y-0.5 text-amber-200/70">
                <li>Ensure stable internet connection</li>
                <li>Timer starts immediately</li>
                <li>Answers save automatically</li>
                <li>Cannot pause or restart</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <NuxtLink
            to="/dashboard/exams"
            class="flex-1 rounded-lg border border-surface-border py-2.5 text-center text-sm text-gray-400 transition-colors hover:text-white"
          >
            Go Back
          </NuxtLink>
          <button
            @click="startExam"
            :disabled="starting || remainingAttempts === 0"
            class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-background-dark transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span v-if="starting" class="h-4 w-4 animate-spin rounded-full border-2 border-background-dark border-t-transparent"></span>
            {{ starting ? 'Starting...' : 'Start Exam' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Exam Interface -->
    <div v-else class="flex min-h-screen flex-col">
      <!-- Top Bar -->
      <header class="sticky top-0 z-40 border-b border-surface-border bg-surface-dark/95 px-4 py-3 backdrop-blur-sm">
        <div class="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <h1 class="text-base font-semibold text-white">{{ exam.title }}</h1>
            <p class="text-xs text-gray-400">Question {{ currentQuestionIndex + 1 }} of {{ exam.questions.length }}</p>
          </div>
          
          <!-- Timer -->
          <div
            :class="[
              'flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-base',
              timeRemaining <= 60 ? 'animate-pulse bg-red-500/20 text-red-400' : 
              timeRemaining <= 300 ? 'bg-amber-500/20 text-amber-400' : 
              'bg-primary/20 text-primary'
            ]"
          >
            <span class="material-symbols-outlined text-[18px]">timer</span>
            {{ formatTime(timeRemaining) }}
          </div>
        </div>
      </header>

      <!-- Question Content -->
      <main class="flex-1 px-4 py-6">
        <div class="mx-auto max-w-3xl">
          <!-- Progress Bar -->
          <div class="mb-6">
            <div class="mb-1.5 flex items-center justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{{ answeredCount }}/{{ exam.questions.length }} answered</span>
            </div>
            <div class="h-1.5 overflow-hidden rounded-full bg-surface-dark">
              <div
                class="h-full bg-primary transition-all duration-300"
                :style="{ width: `${(answeredCount / exam.questions.length) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Current Question -->
          <div class="mb-6 rounded-xl border border-surface-border bg-surface-dark p-5">
            <div class="mb-3 flex items-center gap-2">
              <span class="rounded bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                Q{{ currentQuestionIndex + 1 }}
              </span>
              <span class="text-xs text-gray-500">{{ currentQuestion.points }} pt{{ currentQuestion.points > 1 ? 's' : '' }}</span>
            </div>
            
            <h2 class="mb-5 text-lg text-white">{{ currentQuestion.question }}</h2>

            <!-- Options -->
            <div class="space-y-2">
              <button
                v-for="(option, index) in currentQuestion.options"
                :key="index"
                @click="selectAnswer(index)"
                :class="[
                  'flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-all',
                  answers[currentQuestion.id] === index
                    ? 'border-primary bg-primary/10'
                    : 'border-surface-border bg-background-dark hover:border-gray-600'
                ]"
              >
                <span
                  :class="[
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors',
                    answers[currentQuestion.id] === index
                      ? 'bg-primary text-background-dark'
                      : 'bg-surface-dark text-gray-400'
                  ]"
                >
                  {{ String.fromCharCode(65 + index) }}
                </span>
                <span :class="answers[currentQuestion.id] === index ? 'text-white' : 'text-gray-300'" class="text-sm">
                  {{ option }}
                </span>
              </button>
            </div>
          </div>

          <!-- Question Navigator -->
          <div class="mb-4 flex flex-wrap justify-center gap-1.5">
            <button
              v-for="(q, idx) in exam.questions"
              :key="q.id"
              @click="goToQuestion(idx)"
              :class="[
                'h-8 w-8 rounded text-xs font-medium transition-colors',
                idx === currentQuestionIndex
                  ? 'bg-primary text-background-dark'
                  : answers[q.id] !== undefined
                    ? 'bg-primary/30 text-primary'
                    : 'bg-surface-dark text-gray-400 hover:text-white'
              ]"
            >
              {{ idx + 1 }}
            </button>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex items-center justify-between">
            <button
              @click="previousQuestion"
              :disabled="currentQuestionIndex === 0"
              class="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <span class="material-symbols-outlined text-[18px]">chevron_left</span>
              Previous
            </button>

            <button
              v-if="currentQuestionIndex < exam.questions.length - 1"
              @click="nextQuestion"
              class="flex items-center gap-1 px-3 py-2 text-sm text-primary transition-colors hover:text-primary-light"
            >
              Next
              <span class="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
            <button
              v-else
              @click="showSubmitConfirm = true"
              class="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-background-dark transition-colors hover:bg-primary-dark"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </main>

      <!-- Auto-save indicator -->
      <div
        v-if="autoSaveStatus"
        class="fixed bottom-4 right-4 rounded-lg border border-surface-border bg-surface-dark px-3 py-2 text-xs"
        :class="autoSaveStatus === 'saving' ? 'text-amber-400' : 'text-primary'"
      >
        {{ autoSaveStatus === 'saving' ? 'Saving...' : '✓ Saved' }}
      </div>
    </div>

    <!-- Submit Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showSubmitConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/70" @click="showSubmitConfirm = false"></div>
        <div class="relative w-full max-w-sm rounded-xl border border-surface-border bg-surface-dark p-5 shadow-2xl">
          <h3 class="mb-2 text-lg font-semibold text-white">Submit Exam?</h3>
          <p class="mb-4 text-sm text-gray-400">
            You've answered {{ answeredCount }} of {{ exam.questions.length }} questions.
          </p>
          
          <div v-if="unansweredCount > 0" class="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <p class="text-xs text-amber-200">
              ⚠️ {{ unansweredCount }} unanswered question{{ unansweredCount > 1 ? 's' : '' }} will be marked incorrect.
            </p>
          </div>

          <div class="flex gap-3">
            <button
              @click="showSubmitConfirm = false"
              class="flex-1 rounded-lg border border-surface-border py-2 text-sm text-gray-400 transition-colors hover:text-white"
            >
              Review
            </button>
            <button
              @click="submitExam"
              :disabled="submitting"
              class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-medium text-background-dark transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              <span v-if="submitting" class="h-4 w-4 animate-spin rounded-full border-2 border-background-dark border-t-transparent"></span>
              {{ submitting ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Results Modal -->
    <Teleport to="body">
      <div v-if="showResults" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/80"></div>
        <div class="relative w-full max-w-sm rounded-xl border border-surface-border bg-surface-dark p-6 text-center shadow-2xl">
          <!-- Pass/Fail Icon -->
          <div
            :class="[
              'mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full',
              examResult.passed ? 'bg-primary/20' : 'bg-red-500/20'
            ]"
          >
            <span
              :class="['material-symbols-outlined text-4xl', examResult.passed ? 'text-primary' : 'text-red-400']"
            >
              {{ examResult.passed ? 'check_circle' : 'cancel' }}
            </span>
          </div>

          <h2 class="mb-1 text-xl font-bold text-white">
            {{ examResult.passed ? 'Congratulations!' : 'Keep Trying!' }}
          </h2>
          <p class="mb-5 text-sm text-gray-400">
            {{ examResult.passed ? 'You passed the exam!' : 'You did not pass this time.' }}
          </p>

          <!-- Score -->
          <div class="mb-5 rounded-lg bg-background-dark p-4">
            <div :class="['mb-1 text-4xl font-bold', examResult.passed ? 'text-primary' : 'text-red-400']">
              {{ examResult.score }}%
            </div>
            <div class="text-sm text-gray-400">
              {{ examResult.correctAnswers }}/{{ examResult.totalQuestions }} correct
            </div>
            <div class="mt-1 text-xs text-gray-500">Pass mark: {{ exam.passingScore }}%</div>
          </div>

          <NuxtLink
            to="/dashboard/exams"
            class="block w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-background-dark transition-colors hover:bg-primary-dark"
          >
            Back to Exams
          </NuxtLink>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const route = useRoute()
const examId = route.params.id

const { user } = useAuth()
const { getExam, getUserAttempts, startExamAttempt, saveAnswers, isExamAvailable } = useExam()

// Page State
const pageLoading = ref(true)
const pageError = ref('')
const exam = ref(null)
const userAttempts = ref([])
const remainingAttempts = ref(0)

// Exam State
const examStarted = ref(false)
const starting = ref(false)
const currentAttempt = ref(null)
const answers = ref({})
const currentQuestionIndex = ref(0)

// Timer
const timeRemaining = ref(0)
let timerInterval = null

// Auto-save
const autoSaveStatus = ref('')
let autoSaveInterval = null

// Submit
const showSubmitConfirm = ref(false)
const submitting = ref(false)
const showResults = ref(false)
const examResult = ref(null)

// Computed
const currentQuestion = computed(() => exam.value?.questions?.[currentQuestionIndex.value] || {})
const answeredCount = computed(() => Object.keys(answers.value).length)
const unansweredCount = computed(() => (exam.value?.questions?.length || 0) - answeredCount.value)

// Format time
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Load exam data
const loadExam = async () => {
  pageLoading.value = true
  pageError.value = ''
  
  try {
    const examData = await getExam(examId)
    if (!examData) {
      pageError.value = 'Exam not found'
      return
    }
    
    exam.value = examData
    
    if (!isExamAvailable(examData)) {
      if (new Date() < new Date(examData.startDate)) {
        pageError.value = 'This exam has not started yet'
      } else if (new Date() > new Date(examData.endDate)) {
        pageError.value = 'This exam has ended'
      } else {
        pageError.value = 'This exam is not available'
      }
      return
    }
    
    if (user.value?.$id) {
      userAttempts.value = await getUserAttempts(examId, user.value.$id)
      const completedAttempts = userAttempts.value.filter(a => a.isSubmitted).length
      remainingAttempts.value = Math.max(0, examData.attemptsAllowed - completedAttempts)
    }
  } catch (e) {
    pageError.value = 'Failed to load exam'
    console.error(e)
  } finally {
    pageLoading.value = false
  }
}

// Start exam
const startExam = async () => {
  if (!user.value?.$id) {
    pageError.value = 'You must be logged in to take an exam'
    return
  }
  
  starting.value = true
  try {
    currentAttempt.value = await startExamAttempt(examId, user.value.$id, exam.value.questions.length)
    examStarted.value = true
    timeRemaining.value = exam.value.duration * 60
    
    timerInterval = setInterval(() => {
      timeRemaining.value--
      if (timeRemaining.value <= 0) submitExam(true)
    }, 1000)
    
    autoSaveInterval = setInterval(() => autoSave(), 30000)
  } catch (e) {
    console.error('Failed to start exam:', e)
    pageError.value = 'Failed to start exam. Please try again.'
  } finally {
    starting.value = false
  }
}

// Select answer
const selectAnswer = (optionIndex) => {
  answers.value[currentQuestion.value.id] = optionIndex
}

// Navigation
const nextQuestion = () => {
  if (currentQuestionIndex.value < exam.value.questions.length - 1) currentQuestionIndex.value++
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) currentQuestionIndex.value--
}

const goToQuestion = (index) => {
  currentQuestionIndex.value = index
}

// Auto-save
const autoSave = async () => {
  if (!currentAttempt.value) return
  
  autoSaveStatus.value = 'saving'
  try {
    await saveAnswers(currentAttempt.value.$id, answers.value)
    autoSaveStatus.value = 'saved'
    setTimeout(() => { autoSaveStatus.value = '' }, 2000)
  } catch (e) {
    console.error('Auto-save failed:', e)
    autoSaveStatus.value = ''
  }
}

// Submit exam
const submitExam = async (autoSubmit = false) => {
  if (submitting.value) return
  
  submitting.value = true
  showSubmitConfirm.value = false
  
  if (timerInterval) clearInterval(timerInterval)
  if (autoSaveInterval) clearInterval(autoSaveInterval)
  
  try {
    const timeSpent = (exam.value.duration * 60) - timeRemaining.value
    
    const result = await $fetch('/api/exams/submit', {
      method: 'POST',
      body: {
        attemptId: currentAttempt.value.$id,
        examId: examId,
        answers: answers.value,
        timeSpent
      }
    })
    
    examResult.value = result
    showResults.value = true
  } catch (e) {
    console.error('Failed to submit exam:', e)
    alert('Failed to submit exam. Please try again.')
    submitting.value = false
    
    if (autoSubmit && timeRemaining.value > 0) {
      timerInterval = setInterval(() => {
        timeRemaining.value--
        if (timeRemaining.value <= 0) submitExam(true)
      }, 1000)
    }
  }
}

// Cleanup
onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (autoSaveInterval) clearInterval(autoSaveInterval)
})

// Load on mount
onMounted(() => loadExam())
</script>
