<template>
  <div class="min-h-screen bg-background-dark">
    <!-- Student Sidebar -->
    <aside class="fixed left-0 top-0 z-40 h-screen w-64 border-r border-surface-border bg-surface-dark">
      <!-- Logo -->
      <div class="flex h-16 items-center border-b border-surface-border px-6">
        <NuxtLink to="/dashboard" class="flex items-center gap-2">
          <h1 class="text-xl font-bold tracking-tight font-display">
            <span class="text-white">MACEOS</span>
            <span class="text-primary">Academy</span>
          </h1>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="p-4">
        <ul class="space-y-1">
          <li>
            <NuxtLink 
              to="/dashboard" 
              class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all"
              :class="route.path === '/dashboard' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:bg-surface-darker hover:text-white'"
            >
              <span class="material-symbols-outlined text-xl">home</span>
              Dashboard
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/dashboard/materials" 
              class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all"
              :class="route.path.startsWith('/dashboard/materials') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:bg-surface-darker hover:text-white'"
            >
              <span class="material-symbols-outlined text-xl">folder</span>
              Course Materials
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/dashboard/live-sessions" 
              class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all"
              :class="route.path.startsWith('/dashboard/live-sessions') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:bg-surface-darker hover:text-white'"
            >
              <span class="material-symbols-outlined text-xl">videocam</span>
              Live Sessions
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/dashboard/exams" 
              class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all"
              :class="route.path.startsWith('/dashboard/exams') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:bg-surface-darker hover:text-white'"
            >
              <span class="material-symbols-outlined text-xl">quiz</span>
              Examinations
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/dashboard/schedule" 
              class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all"
              :class="route.path.startsWith('/dashboard/schedule') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:bg-surface-darker hover:text-white'"
            >
              <span class="material-symbols-outlined text-xl">calendar_month</span>
              Schedule
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/dashboard/support" 
              class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all"
              :class="route.path.startsWith('/dashboard/support') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:bg-surface-darker hover:text-white'"
            >
              <span class="material-symbols-outlined text-xl">support_agent</span>
              Support
            </NuxtLink>
          </li>
        </ul>

        <!-- Divider -->
        <div class="my-6 border-t border-surface-border"></div>

        <!-- Secondary Nav -->
        <ul class="space-y-1">
          <li>
            <NuxtLink 
              to="/dashboard/profile" 
              class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:bg-surface-darker hover:text-white"
            >
              <span class="material-symbols-outlined text-xl">person</span>
              Profile
            </NuxtLink>
          </li>
          <li>
            <button 
              @click="handleLogout"
              :disabled="isLoggingOut"
              class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoggingOut" class="material-symbols-outlined text-xl animate-spin">progress_activity</span>
              <span v-else class="material-symbols-outlined text-xl">logout</span>
              {{ isLoggingOut ? 'Signing Out...' : 'Sign Out' }}
            </button>
          </li>
        </ul>
      </nav>

      <!-- User Card at Bottom -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-border">
        <div class="flex items-center gap-3 p-3 rounded-xl bg-background-dark">
          <div class="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span class="text-sm font-bold text-primary">{{ userInitials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-white text-sm truncate">{{ user?.name || 'Student' }}</p>
            <p class="text-xs text-text-secondary truncate">{{ user?.email }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="pl-64">
      <!-- Top Bar -->
      <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-border bg-background-dark/80 px-8 backdrop-blur-md">
        <div>
          <h2 class="text-lg font-bold text-white font-display">{{ pageTitle }}</h2>
        </div>
        
        <div class="flex items-center gap-4">
          <!-- Notifications -->
          <button class="relative p-2 text-gray-400 hover:text-white hover:bg-surface-dark rounded-lg transition-colors">
            <span class="material-symbols-outlined">notifications</span>
          </button>
          
          <!-- Help -->
          <button class="p-2 text-gray-400 hover:text-white hover:bg-surface-dark rounded-lg transition-colors">
            <span class="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>

      <!-- Email Verification Banner -->
      <div v-if="!isEmailVerified" class="bg-gradient-to-r from-yellow-500/20 via-yellow-500/10 to-yellow-500/20 border-b border-yellow-500/30 px-8 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-yellow-400 animate-pulse">warning</span>
            <p class="text-sm font-medium text-yellow-200">
              <span class="font-bold">Action Required:</span> Please verify your email address to access all features.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="handleSendVerificationFromBanner"
              :disabled="sendingVerificationBanner || bannerCooldown > 0"
              class="flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-1.5 text-sm font-bold text-yellow-900 transition-all hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span v-if="sendingVerificationBanner" class="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              <span v-if="bannerCooldown > 0">{{ bannerCooldown }}s</span>
              <span v-else-if="sendingVerificationBanner">Sending...</span>
              <span v-else>Verify Now</span>
            </button>
            <NuxtLink 
              to="/dashboard/profile"
              class="text-sm text-yellow-300 hover:text-yellow-100 underline underline-offset-2"
            >
              Learn more
            </NuxtLink>
          </div>
        </div>
        <p v-if="bannerVerificationSent" class="mt-2 text-xs text-green-400">
          ✓ Verification email sent! Check your inbox.
        </p>
      </div>

      <!-- Page Content -->
      <main class="p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { user, logout, isEmailVerified, sendVerificationEmail } = useAuth()

// Email verification from banner
const sendingVerificationBanner = ref(false)
const bannerVerificationSent = ref(false)
const bannerCooldown = ref(0)

const handleSendVerificationFromBanner = async () => {
  if (sendingVerificationBanner.value || bannerCooldown.value > 0) return
  
  sendingVerificationBanner.value = true
  bannerVerificationSent.value = false
  
  try {
    const result = await sendVerificationEmail()
    if (result.success) {
      bannerVerificationSent.value = true
      bannerCooldown.value = 60
      const timer = setInterval(() => {
        bannerCooldown.value--
        if (bannerCooldown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
      // Hide success message after 5 seconds
      setTimeout(() => {
        bannerVerificationSent.value = false
      }, 5000)
    }
  } finally {
    sendingVerificationBanner.value = false
  }
}

// Compute page title from route
const pageTitle = computed(() => {
  const titles = {
    '/dashboard': 'Dashboard',
    '/dashboard/materials': 'Course Materials',
    '/dashboard/schedule': 'Schedule',
    '/dashboard/support': 'Support',
    '/dashboard/profile': 'Profile'
  }
  return titles[route.path] || 'Dashboard'
})

// User initials
const userInitials = computed(() => {
  if (!user.value?.name) return '?'
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

// Logout handler
const isLoggingOut = ref(false)
const handleLogout = async () => {
  if (isLoggingOut.value) return
  isLoggingOut.value = true
  await logout()
  navigateTo('/login')
}
</script>
