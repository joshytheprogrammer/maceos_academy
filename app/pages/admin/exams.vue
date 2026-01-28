<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Exam Management</h1>
        <p class="mt-1 text-gray-400">Create and manage MCQ exams for students</p>
      </div>
      <button
        @click="openCreateModal"
        class="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-600"
      >
        <span class="material-symbols-outlined text-[20px]">add</span>
        Create Exam
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <p class="text-sm text-gray-400">Total Exams</p>
        <p class="mt-1 text-2xl font-bold text-white">{{ exams.length }}</p>
      </div>
      <div class="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <p class="text-sm text-gray-400">Published</p>
        <p class="mt-1 text-2xl font-bold text-green-400">{{ exams.filter(e => e.isPublished).length }}</p>
      </div>
      <div class="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <p class="text-sm text-gray-400">Drafts</p>
        <p class="mt-1 text-2xl font-bold text-amber-400">{{ exams.filter(e => !e.isPublished).length }}</p>
      </div>
      <div class="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <p class="text-sm text-gray-400">Total Questions</p>
        <p class="mt-1 text-2xl font-bold text-blue-400">{{ exams.reduce((sum, e) => sum + (e.questions?.length || 0), 0) }}</p>
      </div>
    </div>

    <!-- Exams Table -->
    <div class="mt-6 overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-green-500"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="exams.length === 0" class="py-12 text-center">
        <span class="material-symbols-outlined text-5xl text-gray-600">quiz</span>
        <h3 class="mt-4 text-lg font-medium text-white">No Exams Created</h3>
        <p class="mt-1 text-gray-400">Create your first exam to get started</p>
        <button
          @click="openCreateModal"
          class="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
        >
          <span class="material-symbols-outlined text-[18px]">add</span>
          Create First Exam
        </button>
      </div>

      <table v-else class="w-full">
        <thead class="border-b border-gray-800 bg-gray-900/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Exam</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Week</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Questions</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Duration</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <tr v-for="exam in exams" :key="exam.$id" class="transition-colors hover:bg-gray-800/50">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 text-green-400">
                  <span class="material-symbols-outlined">quiz</span>
                </div>
                <div>
                  <p class="font-medium text-white">{{ exam.title }}</p>
                  <p class="text-sm text-gray-500 line-clamp-1">{{ exam.description || 'No description' }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="rounded-full bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-300">
                Week {{ exam.week }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-300">{{ exam.questions?.length || 0 }}</td>
            <td class="px-6 py-4 text-gray-300">{{ exam.duration }} mins</td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'rounded-full px-2.5 py-1 text-xs font-medium',
                  exam.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                ]"
              >
                {{ exam.isPublished ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-end gap-1">
                <button
                  @click="viewAttempts(exam)"
                  class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                  title="View Attempts"
                >
                  <span class="material-symbols-outlined text-[20px]">group</span>
                </button>
                <button
                  @click="openEditModal(exam)"
                  class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-green-400"
                  title="Edit"
                >
                  <span class="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button
                  @click="confirmDelete(exam)"
                  class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  title="Delete"
                >
                  <span class="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pb-10 pt-10">
        <div class="fixed inset-0 bg-black/70" @click="closeModal"></div>
        <div class="relative mx-4 w-full max-w-4xl rounded-xl border border-gray-800 bg-gray-900 shadow-2xl">
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-gray-800 px-6 py-4">
            <h2 class="text-xl font-semibold text-white">
              {{ isEditing ? 'Edit Exam' : 'Create New Exam' }}
            </h2>
            <button @click="closeModal" class="text-gray-400 hover:text-white">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="max-h-[70vh] overflow-y-auto px-6 py-6">
            <!-- Exam Details -->
            <div class="mb-6 space-y-4">
              <h3 class="text-sm font-medium uppercase tracking-wider text-gray-400">Exam Details</h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="mb-1.5 block text-sm font-medium text-gray-300">Title *</label>
                  <input
                    v-model="formData.title"
                    type="text"
                    class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                    placeholder="e.g., Week 1 Assessment"
                  />
                </div>
                
                <div class="col-span-2">
                  <label class="mb-1.5 block text-sm font-medium text-gray-300">Description</label>
                  <textarea
                    v-model="formData.description"
                    rows="2"
                    class="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                    placeholder="Brief description of the exam..."
                  ></textarea>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-300">Week *</label>
                  <select
                    v-model.number="formData.week"
                    class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  >
                    <option v-for="w in 10" :key="w" :value="w">Week {{ w }}</option>
                  </select>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-300">Duration (minutes) *</label>
                  <input
                    v-model.number="formData.duration"
                    type="number"
                    min="5"
                    max="240"
                    class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-300">Passing Score (%) *</label>
                  <input
                    v-model.number="formData.passingScore"
                    type="number"
                    min="0"
                    max="100"
                    class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-300">Attempts Allowed *</label>
                  <input
                    v-model.number="formData.attemptsAllowed"
                    type="number"
                    min="1"
                    max="10"
                    class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-300">Start Date *</label>
                  <input
                    v-model="formData.startDate"
                    type="datetime-local"
                    class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-300">End Date *</label>
                  <input
                    v-model="formData.endDate"
                    type="datetime-local"
                    class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div class="col-span-2">
                  <label class="flex cursor-pointer items-center gap-3">
                    <input
                      v-model="formData.isPublished"
                      type="checkbox"
                      class="h-5 w-5 rounded border-gray-700 bg-gray-800 text-green-500 focus:ring-green-500"
                    />
                    <span class="text-gray-300">Publish exam (make visible to students)</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Questions Section -->
            <div class="border-t border-gray-800 pt-6">
              <div class="mb-4 flex items-center justify-between">
                <h3 class="text-sm font-medium uppercase tracking-wider text-gray-400">
                  Questions ({{ formData.questions.length }})
                </h3>
                <button
                  @click="addQuestion"
                  class="inline-flex items-center gap-1.5 rounded-lg bg-green-500/20 px-3 py-1.5 text-sm font-medium text-green-400 transition-colors hover:bg-green-500/30"
                >
                  <span class="material-symbols-outlined text-[18px]">add</span>
                  Add Question
                </button>
              </div>

              <!-- Questions List -->
              <div class="space-y-4">
                <div
                  v-for="(question, qIndex) in formData.questions"
                  :key="question.id"
                  class="rounded-lg border border-gray-800 bg-gray-800/50 p-4"
                >
                  <div class="mb-3 flex items-start justify-between">
                    <span class="rounded bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                      Question {{ qIndex + 1 }}
                    </span>
                    <button @click="removeQuestion(qIndex)" class="text-gray-400 hover:text-red-400">
                      <span class="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>

                  <div class="space-y-3">
                    <div>
                      <label class="mb-1 block text-xs text-gray-400">Question Text *</label>
                      <textarea
                        v-model="question.question"
                        rows="2"
                        class="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                        placeholder="Enter the question..."
                      ></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                      <div v-for="(option, oIndex) in question.options" :key="oIndex">
                        <label class="mb-1 block text-xs text-gray-400">
                          Option {{ String.fromCharCode(65 + oIndex) }}
                          <span v-if="question.correctAnswer === oIndex" class="ml-1 text-green-400">(Correct)</span>
                        </label>
                        <div class="flex gap-2">
                          <input
                            v-model="question.options[oIndex]"
                            type="text"
                            class="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                            :placeholder="`Option ${String.fromCharCode(65 + oIndex)}`"
                          />
                          <button
                            @click="question.correctAnswer = oIndex"
                            :class="[
                              'rounded-lg px-3 py-2 text-sm transition-colors',
                              question.correctAnswer === oIndex
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-700 text-gray-400 hover:text-green-400'
                            ]"
                            title="Mark as correct"
                          >
                            ✓
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center gap-4">
                      <div class="flex items-center gap-2">
                        <label class="text-xs text-gray-400">Points:</label>
                        <input
                          v-model.number="question.points"
                          type="number"
                          min="1"
                          max="10"
                          class="w-16 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-white focus:border-green-500 focus:outline-none"
                        />
                      </div>
                      <button
                        v-if="question.options.length < 6"
                        @click="addOption(qIndex)"
                        class="text-xs text-green-400 hover:underline"
                      >
                        + Add Option
                      </button>
                      <button
                        v-if="question.options.length > 2"
                        @click="removeOption(qIndex)"
                        class="text-xs text-red-400 hover:underline"
                      >
                        - Remove Option
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Empty Questions State -->
                <div v-if="formData.questions.length === 0" class="rounded-lg border border-dashed border-gray-700 py-8 text-center">
                  <p class="mb-2 text-gray-400">No questions added yet</p>
                  <button @click="addQuestion" class="text-sm text-green-400 hover:underline">
                    Add your first question
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-end gap-3 border-t border-gray-800 px-6 py-4">
            <button @click="closeModal" class="px-4 py-2 text-gray-400 transition-colors hover:text-white">
              Cancel
            </button>
            <button
              @click="saveExam"
              :disabled="saving"
              class="inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2 font-medium text-white transition-colors hover:bg-green-600 disabled:opacity-50"
            >
              <span v-if="saving" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {{ isEditing ? 'Update Exam' : 'Create Exam' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Attempts Modal -->
    <Teleport to="body">
      <div v-if="showAttemptsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/70" @click="showAttemptsModal = false"></div>
        <div class="relative flex max-h-[80vh] w-full max-w-4xl flex-col rounded-xl border border-gray-800 bg-gray-900 shadow-2xl">
          <div class="flex items-center justify-between border-b border-gray-800 px-6 py-4">
            <div>
              <h2 class="text-xl font-semibold text-white">Exam Attempts</h2>
              <p class="text-sm text-gray-400">{{ selectedExamTitle }}</p>
            </div>
            <button @click="showAttemptsModal = false" class="text-gray-400 hover:text-white">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div class="flex-1 overflow-y-auto p-6">
            <div v-if="loadingAttempts" class="flex items-center justify-center py-10">
              <div class="h-6 w-6 animate-spin rounded-full border-2 border-gray-600 border-t-green-500"></div>
            </div>
            
            <div v-else-if="examAttempts.length === 0" class="py-10 text-center text-gray-400">
              <span class="material-symbols-outlined mb-2 text-4xl text-gray-600">person_off</span>
              <p>No attempts recorded yet</p>
            </div>
            
            <!-- Attempts Table -->
            <table v-else class="w-full">
              <thead class="border-b border-gray-700 text-left">
                <tr>
                  <th class="pb-3 text-xs font-medium uppercase tracking-wider text-gray-400">Student</th>
                  <th class="pb-3 text-xs font-medium uppercase tracking-wider text-gray-400">Started</th>
                  <th class="pb-3 text-xs font-medium uppercase tracking-wider text-gray-400">Time Spent</th>
                  <th class="pb-3 text-xs font-medium uppercase tracking-wider text-gray-400">Score</th>
                  <th class="pb-3 text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-800">
                <tr v-for="attempt in examAttempts" :key="attempt.$id" class="group">
                  <td class="py-4">
                    <div class="flex items-center gap-3">
                      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-sm font-medium text-gray-300">
                        {{ (attemptUsers[attempt.userId]?.name || 'U').charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <p class="font-medium text-white">{{ attemptUsers[attempt.userId]?.name || 'Unknown User' }}</p>
                        <p class="text-xs text-gray-500">{{ attemptUsers[attempt.userId]?.email || attempt.userId }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 text-sm text-gray-300">
                    {{ formatDate(attempt.startedAt) }}
                  </td>
                  <td class="py-4 text-sm text-gray-300">
                    {{ attempt.timeSpent ? Math.floor(attempt.timeSpent / 60) + 'm ' + (attempt.timeSpent % 60) + 's' : '-' }}
                  </td>
                  <td class="py-4">
                    <div class="flex items-center gap-2">
                      <span :class="['text-lg font-bold', attempt.passed ? 'text-green-400' : (attempt.isSubmitted ? 'text-red-400' : 'text-gray-400')]">
                        {{ attempt.score ?? '-' }}%
                      </span>
                      <span class="text-xs text-gray-500">
                        ({{ attempt.correctAnswers ?? 0 }}/{{ attempt.totalQuestions }})
                      </span>
                    </div>
                  </td>
                  <td class="py-4">
                    <span
                      :class="[
                        'rounded-full px-2.5 py-1 text-xs font-medium',
                        attempt.passed ? 'bg-green-500/20 text-green-400' : 
                        attempt.isSubmitted ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                      ]"
                    >
                      {{ attempt.passed ? 'Passed' : (attempt.isSubmitted ? 'Failed' : 'In Progress') }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Summary Stats -->
            <div v-if="examAttempts.length > 0" class="mt-6 grid grid-cols-4 gap-4 border-t border-gray-800 pt-6">
              <div class="text-center">
                <p class="text-2xl font-bold text-white">{{ examAttempts.length }}</p>
                <p class="text-xs text-gray-400">Total Attempts</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-green-400">{{ examAttempts.filter(a => a.passed).length }}</p>
                <p class="text-xs text-gray-400">Passed</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-red-400">{{ examAttempts.filter(a => a.isSubmitted && !a.passed).length }}</p>
                <p class="text-xs text-gray-400">Failed</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-blue-400">
                  {{ examAttempts.filter(a => a.isSubmitted).length > 0 
                    ? Math.round(examAttempts.filter(a => a.isSubmitted).reduce((sum, a) => sum + (a.score || 0), 0) / examAttempts.filter(a => a.isSubmitted).length) 
                    : 0 }}%
                </p>
                <p class="text-xs text-gray-400">Avg Score</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/70" @click="showDeleteModal = false"></div>
        <div class="relative w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
          <h3 class="mb-2 text-xl font-semibold text-white">Delete Exam</h3>
          <p class="mb-6 text-gray-400">Are you sure you want to delete "{{ examToDelete?.title }}"? This action cannot be undone.</p>
          <div class="flex justify-end gap-3">
            <button @click="showDeleteModal = false" class="px-4 py-2 text-gray-400 transition-colors hover:text-white">
              Cancel
            </button>
            <button
              @click="handleDelete"
              :disabled="deleting"
              class="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
            >
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const { 
  exams, 
  loading, 
  fetchAllExams, 
  createExam, 
  updateExam, 
  deleteExam,
  getExamAttempts 
} = useExam()

// Modal State
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const editingExamId = ref(null)

// Delete Modal State
const showDeleteModal = ref(false)
const examToDelete = ref(null)
const deleting = ref(false)

// Attempts Modal State
const showAttemptsModal = ref(false)
const loadingAttempts = ref(false)
const examAttempts = ref([])
const attemptUsers = ref({})
const selectedExamTitle = ref('')

// Form Data
const getEmptyForm = () => ({
  title: '',
  description: '',
  week: 1,
  duration: 30,
  passingScore: 70,
  attemptsAllowed: 3,
  startDate: '',
  endDate: '',
  isPublished: false,
  questions: []
})

const formData = ref(getEmptyForm())

// Create blank question
const createQuestion = () => ({
  id: Date.now().toString(),
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  points: 1
})

// Question Management
const addQuestion = () => {
  formData.value.questions.push(createQuestion())
}

const removeQuestion = (index) => {
  formData.value.questions.splice(index, 1)
}

const addOption = (questionIndex) => {
  if (formData.value.questions[questionIndex].options.length < 6) {
    formData.value.questions[questionIndex].options.push('')
  }
}

const removeOption = (questionIndex) => {
  const question = formData.value.questions[questionIndex]
  if (question.options.length > 2) {
    question.options.pop()
    if (question.correctAnswer >= question.options.length) {
      question.correctAnswer = question.options.length - 1
    }
  }
}

// Modal Functions
const openCreateModal = () => {
  formData.value = getEmptyForm()
  isEditing.value = false
  editingExamId.value = null
  showModal.value = true
}

const openEditModal = (exam) => {
  formData.value = {
    title: exam.title,
    description: exam.description || '',
    week: exam.week,
    duration: exam.duration,
    passingScore: exam.passingScore,
    attemptsAllowed: exam.attemptsAllowed,
    startDate: formatDateForInput(exam.startDate),
    endDate: formatDateForInput(exam.endDate),
    isPublished: exam.isPublished || false,
    questions: JSON.parse(JSON.stringify(exam.questions || []))
  }
  isEditing.value = true
  editingExamId.value = exam.$id
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  formData.value = getEmptyForm()
}

// Save Exam
const saveExam = async () => {
  if (!formData.value.title.trim()) {
    alert('Please enter an exam title')
    return
  }
  if (!formData.value.startDate || !formData.value.endDate) {
    alert('Please set start and end dates')
    return
  }
  if (formData.value.questions.length === 0) {
    alert('Please add at least one question')
    return
  }

  for (let i = 0; i < formData.value.questions.length; i++) {
    const q = formData.value.questions[i]
    if (!q.question.trim()) {
      alert(`Question ${i + 1} is empty`)
      return
    }
    const filledOptions = q.options.filter(o => o.trim())
    if (filledOptions.length < 2) {
      alert(`Question ${i + 1} needs at least 2 options`)
      return
    }
  }

  saving.value = true
  try {
    const payload = {
      ...formData.value,
      startDate: new Date(formData.value.startDate).toISOString(),
      endDate: new Date(formData.value.endDate).toISOString(),
      createdBy: 'admin'
    }

    if (isEditing.value) {
      await updateExam(editingExamId.value, payload)
    } else {
      await createExam(payload)
    }

    closeModal()
  } catch (e) {
    alert('Failed to save exam: ' + e.message)
  } finally {
    saving.value = false
  }
}

// Delete Functions
const confirmDelete = (exam) => {
  examToDelete.value = exam
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!examToDelete.value) return
  
  deleting.value = true
  try {
    await deleteExam(examToDelete.value.$id)
    showDeleteModal.value = false
    examToDelete.value = null
  } catch (e) {
    alert('Failed to delete exam: ' + e.message)
  } finally {
    deleting.value = false
  }
}

// View Attempts
const viewAttempts = async (exam) => {
  showAttemptsModal.value = true
  loadingAttempts.value = true
  selectedExamTitle.value = exam.title
  attemptUsers.value = {}
  
  try {
    const attempts = await getExamAttempts(exam.$id)
    examAttempts.value = attempts
    
    // Fetch user details for all attempts
    if (attempts.length > 0) {
      const userIds = [...new Set(attempts.map(a => a.userId))]
      const users = await $fetch('/api/users/batch', {
        query: { ids: userIds.join(',') }
      })
      attemptUsers.value = users
    }
  } catch (e) {
    console.error('Failed to load attempts:', e)
  } finally {
    loadingAttempts.value = false
  }
}

// Utility Functions
const formatDateForInput = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toISOString().slice(0, 16)
}

const formatDate = (isoString) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString()
}

// Load exams on mount
onMounted(() => {
  fetchAllExams()
})
</script>
