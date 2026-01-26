<template>
  <div class="min-h-screen bg-background-dark">
    <!-- Top Navigation -->
    <header class="bg-surface-dark border-b border-surface-border sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold text-primary">MACEOS</h1>
          <span class="text-surface-border">|</span>
          <span class="text-text-secondary">Student Dashboard</span>
        </div>
        
        <div class="flex items-center gap-4">
          <!-- Notifications -->
          <button class="p-2 text-gray-400 hover:text-white transition-colors relative">
            <span class="material-symbols-outlined">notifications</span>
            <span v-if="applicationStatus === 'pending_review'" class="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          
          <!-- User Menu -->
          <div class="relative" ref="userMenuRef">
            <button 
              @click="showUserMenu = !showUserMenu"
              class="flex items-center gap-2 p-2 rounded-xl hover:bg-surface-darker transition-colors"
            >
              <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-background-dark font-semibold">
                {{ userInitials }}
              </div>
              <span class="material-symbols-outlined text-gray-400">expand_more</span>
            </button>
            
            <!-- Dropdown -->
            <Transition name="fade">
              <div 
                v-if="showUserMenu" 
                class="absolute right-0 mt-2 w-56 bg-surface-dark border border-surface-border rounded-xl shadow-xl py-2"
              >
                <div class="px-4 py-3 border-b border-surface-border">
                  <p class="font-medium text-white">{{ user?.name }}</p>
                  <p class="text-sm text-text-secondary">{{ user?.email }}</p>
                </div>
                <a href="#" class="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-surface-darker transition-colors">
                  <span class="material-symbols-outlined text-xl">person</span>
                  Profile Settings
                </a>
                <a href="#" class="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-surface-darker transition-colors">
                  <span class="material-symbols-outlined text-xl">help</span>
                  Help & Support
                </a>
                <hr class="my-2 border-surface-border" />
                <button 
                  @click="handleLogout"
                  class="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-surface-darker transition-colors"
                >
                  <span class="material-symbols-outlined text-xl">logout</span>
                  Sign Out
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <!-- Application Pending Review State -->
      <template v-if="applicationStatus === 'pending_review'">
        <div class="max-w-2xl mx-auto text-center py-12">
          <!-- Animated Icon -->
          <div class="mb-8 relative">
            <div class="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <div class="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                <span class="material-symbols-outlined text-primary text-5xl">hourglass_top</span>
              </div>
            </div>
            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary/20 border border-primary/40 rounded-full">
              <span class="text-primary text-sm font-medium">Under Review</span>
            </div>
          </div>

          <!-- Welcome Message -->
          <h2 class="text-3xl font-bold text-white mb-4">
            Welcome, {{ user?.name?.split(' ')[0] }}! 🎉
          </h2>
          <p class="text-xl text-text-secondary mb-8">
            Your application has been successfully submitted
          </p>

          <!-- Password Reminder Alert -->
          <div class="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 mb-8 text-left">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-orange-400 text-2xl">key</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-orange-400 mb-1">Important: Change Your Password</h3>
                <p class="text-text-secondary mb-3">
                  Your login credentials were sent to <span class="text-white font-medium">{{ user?.email }}</span>. 
                  For security, please change your password after logging in.
                </p>
                <button 
                  @click="showChangePassword = true"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-medium rounded-lg transition-colors"
                >
                  <span class="material-symbols-outlined text-lg">lock_reset</span>
                  Change Password
                </button>
              </div>
            </div>
          </div>

          <!-- Status Card -->
          <div class="bg-surface-dark border border-surface-border rounded-2xl p-8 mb-8 text-left">
            <div class="flex items-start gap-4 mb-6">
              <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-primary text-2xl">description</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white mb-1">Application Status</h3>
                <p class="text-text-secondary">
                  Our admissions team is reviewing your application. This typically takes 
                  <span class="text-primary font-medium">3-5 business days</span>.
                </p>
              </div>
            </div>

            <!-- Progress Steps -->
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-background-dark">check</span>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-white">Application Submitted</p>
                  <p class="text-sm text-text-secondary">{{ formatDate(application?.submittedAt) }}</p>
                </div>
              </div>
              
              <div class="ml-5 w-0.5 h-6 bg-primary"></div>
              
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-background-dark">check</span>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-white">Payment Confirmed</p>
                  <p class="text-sm text-text-secondary">₦{{ application?.paymentAmount?.toLocaleString() }} paid via Paystack</p>
                </div>
              </div>
              
              <div class="ml-5 w-0.5 h-6 bg-primary/30"></div>
              
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-primary/20 border-2 border-primary rounded-full flex items-center justify-center shrink-0 animate-pulse">
                  <span class="material-symbols-outlined text-primary">pending</span>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-primary">Under Review</p>
                  <p class="text-sm text-text-secondary">Our team is evaluating your application</p>
                </div>
              </div>
              
              <div class="ml-5 w-0.5 h-6 bg-surface-border"></div>
              
              <div class="flex items-center gap-4 opacity-50">
                <div class="w-10 h-10 bg-surface-border rounded-full flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-gray-500">school</span>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-400">Decision</p>
                  <p class="text-sm text-gray-500">You'll be notified via email</p>
                </div>
              </div>
            </div>
          </div>

          <!-- What Happens Next -->
          <div class="bg-surface-dark border border-surface-border rounded-2xl p-6 mb-8">
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">info</span>
              What happens next?
            </h3>
            <ul class="space-y-3 text-left">
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary mt-0.5">mail</span>
                <span class="text-text-secondary">You'll receive an email notification once a decision is made</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary mt-0.5">calendar_today</span>
                <span class="text-text-secondary">If accepted, you'll get access to course materials and your schedule</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary mt-0.5">support_agent</span>
                <span class="text-text-secondary">Questions? Contact our support team at support@maceos.academy</span>
              </li>
            </ul>
          </div>

          <!-- Contact Support -->
          <a 
            href="mailto:support@maceos.academy"
            class="inline-flex items-center gap-2 px-6 py-3 border border-primary/50 text-primary hover:bg-primary/10 font-medium rounded-xl transition-colors"
          >
            <span class="material-symbols-outlined">email</span>
            Contact Support
          </a>
        </div>
      </template>

      <!-- Approved/Active Student Dashboard -->
      <template v-else-if="applicationStatus === 'approved'">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-surface-dark border border-surface-border rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <span class="material-symbols-outlined text-primary text-3xl">school</span>
            <span class="text-sm text-gray-500">Current</span>
          </div>
          <p class="text-3xl font-bold text-white mb-1">Week {{ currentWeek }}</p>
          <p class="text-text-secondary text-sm">of 10 weeks</p>
        </div>

        <div class="bg-surface-dark border border-surface-border rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <span class="material-symbols-outlined text-primary text-3xl">task_alt</span>
            <span class="text-sm text-gray-500">Progress</span>
          </div>
          <p class="text-3xl font-bold text-white mb-1">{{ progressPercent }}%</p>
          <p class="text-text-secondary text-sm">Course completed</p>
        </div>

        <div class="bg-surface-dark border border-surface-border rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <span class="material-symbols-outlined text-primary text-3xl">download</span>
            <span class="text-sm text-gray-500">Materials</span>
          </div>
          <p class="text-3xl font-bold text-white mb-1">{{ downloadedMaterials }}</p>
          <p class="text-text-secondary text-sm">Files downloaded</p>
        </div>

        <div class="bg-surface-dark border border-surface-border rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <span class="material-symbols-outlined text-primary text-3xl">emoji_events</span>
            <span class="text-sm text-gray-500">Exams</span>
          </div>
          <p class="text-3xl font-bold text-white mb-1">{{ completedExams }}/2</p>
          <p class="text-text-secondary text-sm">Exams completed</p>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Course Progress -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Current Week Materials -->
          <div class="bg-surface-dark border border-surface-border rounded-2xl p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-white">Week {{ currentWeek }} Materials</h3>
              <NuxtLink 
                to="/dashboard/materials" 
                class="text-primary hover:text-primary-dark text-sm flex items-center gap-1"
              >
                View all
                <span class="material-symbols-outlined text-lg">arrow_forward</span>
              </NuxtLink>
            </div>

            <div class="space-y-4">
              <div 
                v-for="material in currentMaterials" 
                :key="material.id"
                class="flex items-center gap-4 p-4 bg-background-dark/50 rounded-xl hover:bg-background-dark transition-colors cursor-pointer"
              >
                <div 
                  class="w-12 h-12 rounded-xl flex items-center justify-center"
                  :class="getMaterialIconClass(material.type)"
                >
                  <span class="material-symbols-outlined text-2xl">{{ getMaterialIcon(material.type) }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-white truncate">{{ material.title }}</p>
                  <p class="text-sm text-text-secondary">{{ material.type }} • {{ material.duration }}</p>
                </div>
                <button class="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <span class="material-symbols-outlined">{{ material.type === 'video' ? 'play_circle' : 'download' }}</span>
                </button>
              </div>

              <div v-if="currentMaterials.length === 0" class="text-center py-8 text-gray-500">
                <span class="material-symbols-outlined text-4xl mb-2">folder_open</span>
                <p>No materials available for this week yet.</p>
              </div>
            </div>
          </div>

          <!-- Upcoming Schedule -->
          <div class="bg-surface-dark border border-surface-border rounded-2xl p-6">
            <h3 class="text-xl font-bold text-white mb-6">Upcoming Schedule</h3>
            
            <div class="space-y-4">
              <div 
                v-for="event in upcomingEvents" 
                :key="event.id"
                class="flex items-center gap-4 p-4 border border-surface-border rounded-xl"
              >
                <div class="text-center min-w-[60px]">
                  <p class="text-2xl font-bold text-primary">{{ event.day }}</p>
                  <p class="text-sm text-text-secondary">{{ event.month }}</p>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-white">{{ event.title }}</p>
                  <p class="text-sm text-text-secondary">{{ event.time }}</p>
                </div>
                <span 
                  class="px-3 py-1 text-xs font-medium rounded-full"
                  :class="getEventTypeClass(event.type)"
                >
                  {{ event.type }}
                </span>
              </div>

              <div v-if="upcomingEvents.length === 0" class="text-center py-8 text-gray-500">
                <span class="material-symbols-outlined text-4xl mb-2">event_busy</span>
                <p>No upcoming events scheduled.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-surface-dark border border-surface-border rounded-2xl p-6">
            <h3 class="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <NuxtLink 
                to="/dashboard/materials"
                class="flex items-center gap-3 p-3 bg-background-dark hover:bg-surface-darker rounded-xl transition-colors"
              >
                <span class="material-symbols-outlined text-primary">folder</span>
                <span class="text-gray-300">Browse Materials</span>
              </NuxtLink>
              <NuxtLink 
                to="/dashboard/exams"
                class="flex items-center gap-3 p-3 bg-background-dark hover:bg-surface-darker rounded-xl transition-colors"
              >
                <span class="material-symbols-outlined text-primary">quiz</span>
                <span class="text-gray-300">View Exams</span>
              </NuxtLink>
              <NuxtLink 
                to="/dashboard/support"
                class="flex items-center gap-3 p-3 bg-background-dark hover:bg-surface-darker rounded-xl transition-colors"
              >
                <span class="material-symbols-outlined text-primary">support_agent</span>
                <span class="text-gray-300">Get Support</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Progress Overview -->
          <div class="bg-surface-dark border border-surface-border rounded-2xl p-6">
            <h3 class="text-lg font-bold text-white mb-4">Course Progress</h3>
            <div class="space-y-4">
              <div v-for="week in 10" :key="week" class="flex items-center gap-3">
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                  :class="week <= currentWeek ? 'bg-primary text-background-dark' : 'bg-surface-border text-gray-500'"
                >
                  <span v-if="week < currentWeek" class="material-symbols-outlined text-lg">check</span>
                  <span v-else>{{ week }}</span>
                </div>
                <div class="flex-1">
                  <div 
                    class="h-2 rounded-full"
                    :class="week < currentWeek ? 'bg-primary' : week === currentWeek ? 'bg-primary/50' : 'bg-surface-border'"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Need Help -->
          <div class="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-6">
            <span class="material-symbols-outlined text-primary text-3xl mb-3">help</span>
            <h3 class="text-lg font-bold text-white mb-2">Need Help?</h3>
            <p class="text-text-secondary text-sm mb-4">
              Our support team is here to assist you with any questions or concerns.
            </p>
            <NuxtLink 
              to="/dashboard/support"
              class="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium"
            >
              Contact Support
              <span class="material-symbols-outlined text-lg">arrow_forward</span>
            </NuxtLink>
          </div>
        </div>
      </div>
      </template>
    </main>

    <!-- Change Password Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="showChangePassword" 
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          <!-- Backdrop -->
          <div 
            class="absolute inset-0 bg-black/70 backdrop-blur-sm"
            @click="showChangePassword = false"
          ></div>
          
          <!-- Modal -->
          <div class="relative w-full max-w-md bg-surface-dark border border-surface-border rounded-2xl shadow-2xl">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-surface-border">
              <h3 class="text-xl font-bold text-white">Change Password</h3>
              <button 
                @click="showChangePassword = false"
                class="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <!-- Content -->
            <form @submit.prevent="handleChangePassword" class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                  class="w-full px-4 py-3 bg-background-dark border border-surface-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  minlength="8"
                  class="w-full px-4 py-3 bg-background-dark border border-surface-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  class="w-full px-4 py-3 bg-background-dark border border-surface-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Confirm new password"
                />
              </div>

              <div v-if="passwordError" class="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {{ passwordError }}
              </div>

              <div v-if="passwordSuccess" class="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                {{ passwordSuccess }}
              </div>
              
              <button
                type="submit"
                :disabled="isChangingPassword"
                class="w-full py-3 bg-primary hover:bg-primary-dark text-background-dark font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                {{ isChangingPassword ? 'Updating...' : 'Update Password' }}
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { account } from '~/utils/appwrite'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'application-complete']
})

const { user, logout } = useAuth()
const { application, applicationStatus, fetchApplication } = useApplication()

const showUserMenu = ref(false)
const userMenuRef = ref(null)
const showChangePassword = ref(false)

// Password change form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const isChangingPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')

const handleChangePassword = async () => {
  passwordError.value = ''
  passwordSuccess.value = ''

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'New passwords do not match'
    return
  }

  if (passwordForm.value.newPassword.length < 8) {
    passwordError.value = 'Password must be at least 8 characters'
    return
  }

  isChangingPassword.value = true

  try {
    await account.updatePassword(
      passwordForm.value.newPassword,
      passwordForm.value.currentPassword
    )
    passwordSuccess.value = 'Password updated successfully!'
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    
    // Close modal after success
    setTimeout(() => {
      showChangePassword.value = false
      passwordSuccess.value = ''
    }, 2000)
  }
  catch (e) {
    passwordError.value = e.message || 'Failed to update password'
  }
  finally {
    isChangingPassword.value = false
  }
}

// Mock data - replace with real data from Appwrite later
const currentWeek = ref(3)
const progressPercent = ref(30)
const downloadedMaterials = ref(12)
const completedExams = ref(1)

const currentMaterials = ref([
  { id: 1, title: 'Introduction to Marine Operations', type: 'pdf', duration: '15 pages' },
  { id: 2, title: 'Safety Protocols Overview', type: 'video', duration: '45 min' },
  { id: 3, title: 'Week 3 Study Guide', type: 'pdf', duration: '8 pages' },
])

const upcomingEvents = ref([
  { id: 1, title: 'Live Q&A Session', day: '28', month: 'Jan', time: '2:00 PM WAT', type: 'Live' },
  { id: 2, title: 'Week 4 Materials Release', day: '02', month: 'Feb', time: '9:00 AM WAT', type: 'Content' },
  { id: 3, title: 'Mid-Course Exam', day: '10', month: 'Feb', time: '10:00 AM WAT', type: 'Exam' },
])

// Computed
const userInitials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Methods
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getMaterialIcon = (type) => {
  const icons = {
    pdf: 'description',
    video: 'play_circle',
    exam: 'quiz',
    live: 'videocam',
  }
  return icons[type] || 'description'
}

const getMaterialIconClass = (type) => {
  const classes = {
    pdf: 'bg-red-500/20 text-red-400',
    video: 'bg-blue-500/20 text-blue-400',
    exam: 'bg-purple-500/20 text-purple-400',
    live: 'bg-primary/20 text-primary',
  }
  return classes[type] || 'bg-surface-border text-gray-400'
}

const getEventTypeClass = (type) => {
  const classes = {
    Live: 'bg-primary/20 text-primary',
    Content: 'bg-blue-500/20 text-blue-400',
    Exam: 'bg-red-500/20 text-red-400',
  }
  return classes[type] || 'bg-surface-border text-gray-400'
}

const handleLogout = async () => {
  await logout()
}

// Close menu when clicking outside
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // Fetch user's application status
  if (user.value) {
    fetchApplication(user.value.$id)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.2s ease;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95);
}
</style>
