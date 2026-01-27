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
              class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400"
            >
              <span class="material-symbols-outlined text-xl">logout</span>
              Sign Out
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

      <!-- Page Content -->
      <main class="p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { user, logout } = useAuth()

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
const handleLogout = async () => {
  await logout()
  navigateTo('/login')
}
</script>
