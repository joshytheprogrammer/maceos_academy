<template>
  <div class="min-h-screen bg-gray-950">
    <!-- Admin Sidebar -->
    <aside class="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-800 bg-gray-900">
      <!-- Logo -->
      <div class="flex h-16 items-center border-b border-gray-800 px-6">
        <NuxtLink to="/admin" class="flex items-center gap-2">
          <h1 class="text-xl font-bold tracking-tight">
            <span class="text-white">MACEOS</span>
            <span class="text-green-500">.</span>
          </h1>
          <span class="rounded bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">Admin</span>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="p-4">
        <ul class="space-y-1">
          <li>
            <NuxtLink 
              to="/admin" 
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              :class="route.path === '/admin' ? 'bg-green-500/10 text-green-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <span class="material-symbols-outlined text-[20px]">dashboard</span>
              Dashboard
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/admin/applications" 
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/applications') ? 'bg-green-500/10 text-green-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <span class="material-symbols-outlined text-[20px]">description</span>
              Applications
              <span v-if="pendingCount > 0" class="ml-auto rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                {{ pendingCount }}
              </span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/admin/students" 
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/students') ? 'bg-green-500/10 text-green-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <span class="material-symbols-outlined text-[20px]">school</span>
              Students
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/admin/payments" 
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/payments') ? 'bg-green-500/10 text-green-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <span class="material-symbols-outlined text-[20px]">payments</span>
              Payments
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/admin/content" 
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/content') ? 'bg-green-500/10 text-green-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <span class="material-symbols-outlined text-[20px]">folder</span>
              Content
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/admin/exams" 
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/exams') ? 'bg-green-500/10 text-green-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <span class="material-symbols-outlined text-[20px]">quiz</span>
              Exams
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/admin/support" 
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/support') ? 'bg-green-500/10 text-green-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <span class="material-symbols-outlined text-[20px]">support_agent</span>
              Support
            </NuxtLink>
          </li>
        </ul>

        <!-- Divider -->
        <div class="my-4 border-t border-gray-800"></div>

        <!-- Secondary Nav -->
        <ul class="space-y-1">
          <li>
            <button 
              @click="handleLogout"
              :disabled="isLoggingOut"
              class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoggingOut" class="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
              <span v-else class="material-symbols-outlined text-[20px]">logout</span>
              {{ isLoggingOut ? 'Logging Out...' : 'Logout' }}
            </button>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="pl-64">
      <!-- Top Bar -->
      <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-950/80 px-6 backdrop-blur-sm">
        <h2 class="text-lg font-semibold text-white">{{ pageTitle }}</h2>
        
        <div class="flex items-center gap-4">
          <!-- User Info -->
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <span class="text-sm font-medium text-green-400">{{ userInitials }}</span>
            </div>
            <div class="text-sm">
              <p class="font-medium text-white">{{ user?.name || 'Admin' }}</p>
              <p class="text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { user, logout } = useAuth()

// Page title based on route
const pageTitle = computed(() => {
  const titles = {
    '/admin': 'Dashboard',
    '/admin/applications': 'Applications',
    '/admin/students': 'Students',
    '/admin/payments': 'Payments',
  }
  // Check for dynamic routes
  if (route.path.startsWith('/admin/applications/')) return 'Application Details'
  return titles[route.path] || 'Admin'
})

// User initials for avatar
const userInitials = computed(() => {
  if (!user.value?.name) return 'A'
  return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

// Pending applications count (will be populated)
const pendingCount = useState('admin_pending_count', () => 0)

const isLoggingOut = ref(false)
const handleLogout = async () => {
  if (isLoggingOut.value) return
  isLoggingOut.value = true
  await logout()
  navigateTo('/')
}
</script>
