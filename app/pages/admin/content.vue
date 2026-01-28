<template>
  <UiLoadingScreen v-if="!authReady" message="Loading content manager..." />
  
  <div v-else>
    <!-- Page Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-white">Course Content</h1>
        <p class="mt-1 text-xs sm:text-sm text-gray-400">Upload and manage course materials for students</p>
      </div>
      
      <button 
        @click="showUploadModal = true"
        class="inline-flex items-center gap-2 rounded-lg bg-green-500 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-green-600 w-full sm:w-auto justify-center sm:justify-start"
      >
        <span class="material-symbols-outlined text-[20px]">add</span>
        Add Content
      </button>
    </div>

    <!-- Filters -->
    <div class="mt-6 flex flex-wrap gap-2 sm:gap-3">
      <select 
        v-model="weekFilter" 
        class="rounded-lg border border-gray-700 bg-gray-800 px-3 sm:px-4 py-2 text-xs sm:text-sm text-white focus:border-green-500 focus:outline-none"
      >
        <option value="">All Weeks</option>
        <option v-for="w in 10" :key="w" :value="w">Week {{ w }}</option>
      </select>
      
      <select 
        v-model="typeFilter" 
        class="rounded-lg border border-gray-700 bg-gray-800 px-3 sm:px-4 py-2 text-xs sm:text-sm text-white focus:border-green-500 focus:outline-none"
      >
        <option value="">All Types</option>
        <option value="pdf">PDF</option>
        <option value="video">Video</option>
        <option value="document">Document</option>
        <option value="presentation">Presentation</option>
        <option value="live-link">Live Session</option>
        <option value="exam">Exam</option>
      </select>

      <select 
        v-model="statusFilter" 
        class="rounded-lg border border-gray-700 bg-gray-800 px-3 sm:px-4 py-2 text-xs sm:text-sm text-white focus:border-green-500 focus:outline-none"
      >
        <option value="">All Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
    </div>

    <!-- Stats Cards -->
    <div class="mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-gray-800 bg-gray-900 p-3 sm:p-4">
        <p class="text-xs sm:text-sm text-gray-400">Total Content</p>
        <p class="mt-1 text-xl sm:text-2xl font-bold text-white">{{ stats.total }}</p>
      </div>
      <div class="rounded-xl border border-gray-800 bg-gray-900 p-3 sm:p-4">
        <p class="text-xs sm:text-sm text-gray-400">Published</p>
        <p class="mt-1 text-xl sm:text-2xl font-bold text-green-400">{{ stats.published }}</p>
      </div>
      <div class="rounded-xl border border-gray-800 bg-gray-900 p-3 sm:p-4">
        <p class="text-xs sm:text-sm text-gray-400">Draft</p>
        <p class="mt-1 text-xl sm:text-2xl font-bold text-amber-400">{{ stats.draft }}</p>
      </div>
      <div class="rounded-xl border border-gray-800 bg-gray-900 p-3 sm:p-4">
        <p class="text-xs sm:text-sm text-gray-400">Total Downloads</p>
        <p class="mt-1 text-xl sm:text-2xl font-bold text-blue-400">{{ stats.downloads }}</p>
      </div>
    </div>

    <!-- Content Table -->
    <div class="mt-6 rounded-xl border border-gray-800 bg-gray-900 overflow-x-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-green-500"></div>
      </div>

      <table v-else class="w-full min-w-max">
        <thead class="border-b border-gray-800 bg-gray-900/50">
          <tr>
            <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Content</th>
            <th class="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Week</th>
            <th class="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Type</th>
            <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
            <th class="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Accessible</th>
            <th class="px-3 sm:px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <tr v-for="item in filteredContent" :key="item.$id" class="hover:bg-gray-800/50 transition-colors">
            <td class="px-3 sm:px-6 py-4 max-w-xs lg:max-w-md">
              <div class="flex items-center gap-2 sm:gap-3">
                <div :class="getTypeColor(item.type)" class="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gray-800 shrink-0">
                  <span class="material-symbols-outlined text-lg">{{ getTypeIcon(item.type) }}</span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="font-medium text-white text-xs truncate">{{ item.title }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ item.description || 'No description' }}</p>
                </div>
              </div>
            </td>
            <td class="hidden sm:table-cell px-3 sm:px-6 py-4">
              <span class="inline-flex items-center rounded-full bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-300">
                Week {{ item.week }}
              </span>
            </td>
            <td class="hidden md:table-cell px-3 sm:px-6 py-4">
              <span class="text-xs sm:text-sm capitalize text-gray-300">{{ item.type }}</span>
              <p v-if="item.fileSize" class="text-xs text-gray-500">{{ formatFileSize(item.fileSize) }}</p>
            </td>
            <td class="px-3 sm:px-6 py-4">
              <span 
                :class="item.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'"
                class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
              >
                {{ item.isPublished ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="hidden lg:table-cell px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-400">
              <span v-if="item.accessibleAfter || item.accessibleUntil">
                {{ formatDateRange(item.accessibleAfter, item.accessibleUntil) }}
              </span>
              <span v-else class="text-gray-500">Always</span>
            </td>
            <td class="px-3 sm:px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-1 sm:gap-2">
                <button 
                  @click="togglePublish(item)"
                  :class="item.isPublished ? 'text-amber-400 hover:bg-amber-500/20' : 'text-green-400 hover:bg-green-500/20'"
                  class="rounded-lg p-1.5 sm:p-2 transition-colors"
                  :title="item.isPublished ? 'Unpublish' : 'Publish'"
                >
                  <span class="material-symbols-outlined text-[16px] sm:text-[18px]">{{ item.isPublished ? 'visibility_off' : 'visibility' }}</span>
                </button>
                <button 
                  @click="editContent(item)"
                  class="rounded-lg p-1.5 sm:p-2 text-blue-400 transition-colors hover:bg-blue-500/20"
                  title="Edit"
                >
                  <span class="material-symbols-outlined text-[16px] sm:text-[18px]">edit</span>
                </button>
                <button 
                  @click="confirmDelete(item)"
                  class="rounded-lg p-1.5 sm:p-2 text-red-400 transition-colors hover:bg-red-500/20"
                  title="Delete"
                >
                  <span class="material-symbols-outlined text-[16px] sm:text-[18px]">delete</span>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredContent.length === 0 && !loading">
            <td colspan="6" class="px-6 py-12 text-center text-gray-500">
              <span class="material-symbols-outlined mb-2 text-4xl text-gray-600">folder_open</span>
              <p>No content found</p>
              <button @click="showUploadModal = true" class="mt-4 text-green-400 hover:underline">
                Add your first content
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Upload Modal -->
    <Teleport to="body">
      <div v-if="showUploadModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/70" @click="closeModal"></div>
        <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-white">{{ editingContent ? 'Edit Content' : 'Add New Content' }}</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-white">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <form @submit.prevent="saveContent" class="space-y-5">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Title *</label>
              <input 
                v-model="form.title" 
                type="text" 
                required
                class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                placeholder="e.g., Introduction to Maritime Law"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea 
                v-model="form.description" 
                rows="3"
                class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                placeholder="Brief description of the content..."
              ></textarea>
            </div>

            <!-- Week & Type -->
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Week *</label>
                <select 
                  v-model="form.week" 
                  required
                  class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                >
                  <option v-for="w in 10" :key="w" :value="w">Week {{ w }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Content Type *</label>
                <select 
                  v-model="form.type" 
                  required
                  class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="video">Video</option>
                  <option value="document">Word Document</option>
                  <option value="presentation">Presentation</option>
                  <option value="spreadsheet">Spreadsheet</option>
                  <option value="live-link">Live Session Link</option>
                  <option value="exam">Exam</option>
                  <option value="audio">Audio</option>
                  <option value="archive">Archive (ZIP)</option>
                </select>
              </div>
            </div>

            <!-- File Upload (if not live-link) -->
            <div v-if="form.type !== 'live-link'">
              <label class="block text-sm font-medium text-gray-300 mb-1">File</label>
              <div 
                class="relative rounded-lg border-2 border-dashed border-gray-700 p-6 text-center transition-colors"
                :class="{ 'border-green-500 bg-green-500/5': isDragging }"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                @drop.prevent="handleFileDrop"
              >
                <input 
                  type="file" 
                  ref="fileInput"
                  @change="handleFileSelect"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.webm,.mp3,.zip"
                />
                <div v-if="form.fileName" class="flex items-center justify-center gap-2">
                  <span :class="getTypeColor(form.type)" class="material-symbols-outlined">{{ getTypeIcon(form.type) }}</span>
                  <span class="text-white">{{ form.fileName }}</span>
                  <span class="text-gray-500">({{ formatFileSize(form.fileSize) }})</span>
                  <button type="button" @click.stop="clearFile" class="text-red-400 hover:text-red-300">
                    <span class="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
                <div v-else>
                  <span class="material-symbols-outlined text-4xl text-gray-600">cloud_upload</span>
                  <p class="mt-2 text-sm text-gray-400">Drag & drop or click to upload</p>
                  <p class="mt-1 text-xs text-gray-500">Max file size: 30MB</p>
                </div>
              </div>
              <p v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-2 text-sm text-gray-400">
                Uploading: {{ uploadProgress }}%
              </p>
            </div>

            <!-- Live Link (if live-link type) -->
            <div v-if="form.type === 'live-link'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Session Link *</label>
                <input 
                  v-model="form.liveLink" 
                  type="url" 
                  required
                  class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                  placeholder="https://zoom.us/j/..."
                />
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
                  <input 
                    v-model="form.liveStartTime" 
                    type="datetime-local" 
                    class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">End Time</label>
                  <input 
                    v-model="form.liveEndTime" 
                    type="datetime-local" 
                    class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <!-- Accessibility Dates -->
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Accessible After</label>
                <input 
                  v-model="form.accessibleAfter" 
                  type="datetime-local" 
                  class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Accessible Until</label>
                <input 
                  v-model="form.accessibleUntil" 
                  type="datetime-local" 
                  class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>

            <!-- Download Limit -->
            <div v-if="form.type !== 'live-link'">
              <label class="block text-sm font-medium text-gray-300 mb-1">Download Limit per Student</label>
              <input 
                v-model.number="form.downloadLimit" 
                type="number" 
                min="0"
                class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                placeholder="0 = unlimited"
              />
              <p class="mt-1 text-xs text-gray-500">Set to 0 for unlimited downloads</p>
            </div>

            <!-- Publish Toggle -->
            <div class="flex items-center gap-3">
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="form.isPublished" type="checkbox" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
              <span class="text-sm text-gray-300">Publish immediately</span>
            </div>

            <!-- Error Message -->
            <div v-if="formError" class="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-red-400 text-sm">
              {{ formError }}
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                @click="closeModal"
                class="rounded-lg border border-gray-700 px-4 py-2 text-gray-300 transition-colors hover:bg-gray-800"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                :disabled="saving"
                class="rounded-lg bg-green-500 px-6 py-2 font-medium text-white transition-colors hover:bg-green-600 disabled:opacity-50"
              >
                {{ saving ? 'Saving...' : (editingContent ? 'Update Content' : 'Add Content') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/70" @click="showDeleteModal = false"></div>
        <div class="relative w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h3 class="text-lg font-semibold text-white">Delete Content</h3>
          <p class="mt-2 text-gray-400">
            Are you sure you want to delete "{{ deletingContent?.title }}"? This action cannot be undone.
          </p>
          <div class="mt-6 flex gap-3 justify-end">
            <button 
              @click="showDeleteModal = false"
              class="rounded-lg border border-gray-700 px-4 py-2 text-gray-300 transition-colors hover:bg-gray-800"
            >
              Cancel
            </button>
            <button 
              @click="deleteContentItem"
              :disabled="deleting"
              class="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
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
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const { user } = useAuth()
const { 
  content, 
  loading, 
  fetchAllContent, 
  uploadFile, 
  updateContent,
  getTypeIcon, 
  getTypeColor, 
  formatFileSize 
} = useContent()

// Auth ready state
const authReady = ref(false)

// Filters
const weekFilter = ref('')
const typeFilter = ref('')
const statusFilter = ref('')

// Modals
const showUploadModal = ref(false)
const showDeleteModal = ref(false)
const editingContent = ref(null)
const deletingContent = ref(null)

// Form state
const form = ref({
  title: '',
  description: '',
  type: 'pdf',
  week: 1,
  fileId: null,
  fileName: null,
  fileSize: null,
  mimeType: null,
  downloadLimit: 0,
  accessibleAfter: '',
  accessibleUntil: '',
  liveLink: '',
  liveStartTime: '',
  liveEndTime: '',
  isPublished: false
})
const formError = ref('')
const saving = ref(false)
const deleting = ref(false)
const isDragging = ref(false)
const uploadProgress = ref(0)
const fileInput = ref(null)

// Computed
const filteredContent = computed(() => {
  return content.value.filter(item => {
    if (weekFilter.value && item.week !== parseInt(weekFilter.value)) return false
    if (typeFilter.value && item.type !== typeFilter.value) return false
    if (statusFilter.value === 'published' && !item.isPublished) return false
    if (statusFilter.value === 'draft' && item.isPublished) return false
    return true
  })
})

const stats = computed(() => {
  const total = content.value.length
  const published = content.value.filter(c => c.isPublished).length
  const draft = total - published
  return { total, published, draft, downloads: 0 }
})

// Methods
const formatDateRange = (from, until) => {
  const options = { month: 'short', day: 'numeric' }
  const fromStr = from ? new Date(from).toLocaleDateString('en-US', options) : null
  const untilStr = until ? new Date(until).toLocaleDateString('en-US', options) : null
  
  if (fromStr && untilStr) return `${fromStr} - ${untilStr}`
  if (fromStr) return `From ${fromStr}`
  if (untilStr) return `Until ${untilStr}`
  return 'Always'
}

const handleFileSelect = async (e) => {
  const file = e.target.files[0]
  if (file) await processFile(file)
}

const handleFileDrop = async (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) await processFile(file)
}

const processFile = async (file) => {
  if (file.size > 30 * 1024 * 1024) {
    formError.value = 'File size exceeds 30MB limit'
    return
  }
  
  formError.value = ''
  uploadProgress.value = 10
  
  try {
    const result = await uploadFile(file)
    uploadProgress.value = 100
    
    if (result.success) {
      form.value.fileId = result.data.fileId
      form.value.fileName = result.data.fileName
      form.value.fileSize = result.data.fileSize
      form.value.mimeType = result.data.mimeType
    }
    else {
      formError.value = result.error || 'Failed to upload file'
    }
  }
  catch (e) {
    formError.value = e.message || 'Failed to upload file'
  }
  finally {
    setTimeout(() => { uploadProgress.value = 0 }, 1000)
  }
}

const clearFile = () => {
  form.value.fileId = null
  form.value.fileName = null
  form.value.fileSize = null
  form.value.mimeType = null
  if (fileInput.value) fileInput.value.value = ''
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    type: 'pdf',
    week: 1,
    fileId: null,
    fileName: null,
    fileSize: null,
    mimeType: null,
    downloadLimit: 0,
    accessibleAfter: '',
    accessibleUntil: '',
    liveLink: '',
    liveStartTime: '',
    liveEndTime: '',
    isPublished: false
  }
  formError.value = ''
  editingContent.value = null
}

const closeModal = () => {
  showUploadModal.value = false
  resetForm()
}

const editContent = (item) => {
  editingContent.value = item
  form.value = {
    title: item.title,
    description: item.description || '',
    type: item.type,
    week: item.week,
    fileId: item.fileId,
    fileName: item.fileName,
    fileSize: item.fileSize,
    mimeType: item.mimeType,
    downloadLimit: item.downloadLimit || 0,
    accessibleAfter: item.accessibleAfter ? item.accessibleAfter.substring(0, 16) : '',
    accessibleUntil: item.accessibleUntil ? item.accessibleUntil.substring(0, 16) : '',
    liveLink: item.liveLink || '',
    liveStartTime: item.liveStartTime ? item.liveStartTime.substring(0, 16) : '',
    liveEndTime: item.liveEndTime ? item.liveEndTime.substring(0, 16) : '',
    isPublished: item.isPublished
  }
  showUploadModal.value = true
}

const saveContent = async () => {
  if (!form.value.title || !form.value.type || !form.value.week) {
    formError.value = 'Please fill in all required fields'
    return
  }

  if (form.value.type === 'live-link' && !form.value.liveLink) {
    formError.value = 'Please provide a session link'
    return
  }

  if (form.value.type !== 'live-link' && !form.value.fileId && !editingContent.value) {
    formError.value = 'Please upload a file'
    return
  }

  saving.value = true
  formError.value = ''

  try {
    const data = {
      title: form.value.title,
      description: form.value.description,
      type: form.value.type,
      week: parseInt(form.value.week),
      fileId: form.value.fileId,
      fileName: form.value.fileName,
      fileSize: form.value.fileSize,
      mimeType: form.value.mimeType,
      downloadLimit: form.value.downloadLimit || 0,
      accessibleAfter: form.value.accessibleAfter ? new Date(form.value.accessibleAfter).toISOString() : null,
      accessibleUntil: form.value.accessibleUntil ? new Date(form.value.accessibleUntil).toISOString() : null,
      liveLink: form.value.liveLink || null,
      liveStartTime: form.value.liveStartTime ? new Date(form.value.liveStartTime).toISOString() : null,
      liveEndTime: form.value.liveEndTime ? new Date(form.value.liveEndTime).toISOString() : null,
      isPublished: form.value.isPublished
    }

    if (editingContent.value) {
      // Update existing content
      const result = await updateContent(editingContent.value.$id, data)
      if (!result.success) throw new Error(result.error)
    }
    else {
      // Create new content via server API
      const result = await $fetch('/api/admin/content/create', {
        method: 'POST',
        body: { ...data, adminId: user.value.$id }
      })
      if (!result.success) throw new Error(result.error || 'Failed to create content')
    }

    // Refresh content list
    await fetchAllContent()
    closeModal()
  }
  catch (e) {
    formError.value = e.message || 'Failed to save content'
  }
  finally {
    saving.value = false
  }
}

const togglePublish = async (item) => {
  try {
    await updateContent(item.$id, { isPublished: !item.isPublished })
    await fetchAllContent()
  }
  catch (e) {
    console.error('Failed to toggle publish status:', e)
  }
}

const confirmDelete = (item) => {
  deletingContent.value = item
  showDeleteModal.value = true
}

const deleteContentItem = async () => {
  if (!deletingContent.value) return
  
  deleting.value = true
  try {
    const result = await $fetch('/api/admin/content/delete', {
      method: 'POST',
      body: { 
        contentId: deletingContent.value.$id,
        adminId: user.value.$id
      }
    })
    
    if (!result.success) throw new Error(result.error)
    
    await fetchAllContent()
    showDeleteModal.value = false
    deletingContent.value = null
  }
  catch (e) {
    console.error('Failed to delete content:', e)
  }
  finally {
    deleting.value = false
  }
}

// Initialize
onMounted(async () => {
  await fetchAllContent()
  authReady.value = true
})
</script>
