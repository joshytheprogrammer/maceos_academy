<template>
  <div class="min-h-screen bg-gray-950">
    <!-- Student Sidebar -->
    <aside class="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-800 bg-gray-900">
      <!-- Logo -->
      <div class="flex h-16 items-center border-b border-gray-800 px-6">
        <NuxtLink to="/dashboard" class="flex items-center gap-2">
          <h1 class="text-xl font-bold tracking-tight">
            <span class="text-white">MACEOS</span>
            <span class="text-green-500">Academy</span>
          </h1>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="p-4">
        <ul class="space-y-1">
          <li>
            <NuxtLink 
              to="/dashboard" 
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              :class="route.path === '/dashboard' ? 'bg-green-500/10 text-green-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <span class="material-symbols-outlined text-[20px]">home</span>
              Dashboard
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/dashboard/materials" 
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/dashboard/materials') ? 'bg-green-500/10 text-green-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <span class="material-symbols-outlined text-[20px]">folder</span>
              Course Materials
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/dashboard/schedule" 
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/dashboard/schedule') ? 'bg-green-500/10 text-green-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <span class="material-symbols-outlined text-[20px]">calendar_month</span>
              Schedule
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/dashboard/support" 
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/dashboard/support') ? 'bg-green-500/10 text-green-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
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
            <NuxtLink 
              to="/dashboard/profile" 
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            >
              <span class="material-symbols-outlined text-[20px]">person</span>
              Profile
            </NuxtLink>
          </li>
          <li>
            <button 
              @click="handleLogout"
              class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <span class="material-symbols-outlined text-[20px]">logout</span>
              Logout
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
              <p class="font-medium text-white">{{ user?.name || 'Student' }}</p>
              <p class="text-gray-500">Student</p>
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
