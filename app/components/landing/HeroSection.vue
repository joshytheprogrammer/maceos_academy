<script setup>
const { user, isLoggedIn } = useAuth()

const heroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHy_N6wqMbGBGIMD6LFitxTr9yZzA_68sN6bPO-I6FxEpms6FidA-FVsH4YWZ7yrWSDBqqjHVxRbywjjf7lBw6MgPQWTmRvacdLEybglD9v0CK1NMJ1wW_uwFd2LtLj-zywg5dmOMjaJksO1u9VwLRtJ8xk63MOrbw6WB35B0JsA_2YzLrOXFK291ssuZotTA5QKGzKXtUDdwTqwehe3SsFN2zAbprSpBDJ9Wl25h0Zmsz5SFYdYGwCVwwxAfgN7nh7E2oBUmGKYI'

// Fetch user's application status if logged in
const hasApplication = ref(false)
const applicationStatus = ref(null)
const loadingStatus = ref(false)

const checkApplicationStatus = async () => {
  if (!isLoggedIn.value || !user.value) return
  
  loadingStatus.value = true
  try {
    const response = await $fetch(`/api/applications/${user.value.$id}/status`)
    if (response) {
      hasApplication.value = true
      applicationStatus.value = response.status
    }
  } catch (e) {
    // No application found - that's fine
    hasApplication.value = false
  } finally {
    loadingStatus.value = false
  }
}

// Check on mount and when user changes
watch(() => user.value, () => {
  checkApplicationStatus()
}, { immediate: true })
</script>

<template>
  <section class="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-linear-to-b from-background-dark/80 via-background-dark/50 to-background-dark z-10"></div>
      <img 
        :src="heroImage" 
        alt="Abstract dark automotive curves and modern aerodynamic design" 
        class="h-full w-full object-cover object-center opacity-60"
      />
    </div>

    <div class="relative z-10 container mx-auto px-4 md:px-8 lg:px-12 py-20 text-center">
      <div class="mx-auto max-w-4xl flex flex-col items-center gap-8">
        
        <!-- LOGGED IN USER WITH APPLICATION -->
        <template v-if="isLoggedIn && hasApplication">
          <!-- Welcome Back Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm mb-4">
            <span class="material-symbols-outlined text-primary">waving_hand</span>
            <span class="text-primary text-sm font-bold">Welcome back, {{ user?.name?.split(' ')[0] || 'Student' }}!</span>
          </div>

          <!-- Headline -->
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white">
            Your Journey to <br />
            <span class="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary/80 to-primary/60">Excellence Awaits</span>
          </h1>

          <!-- Application Status Card -->
          <div class="w-full max-w-md rounded-2xl border border-surface-border bg-surface-dark/80 backdrop-blur-md p-6 mt-4">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-gray-400">Application Status</span>
              <span 
                class="rounded-full px-3 py-1 text-xs font-bold uppercase"
                :class="{
                  'bg-yellow-500/20 text-yellow-400': applicationStatus === 'pending',
                  'bg-blue-500/20 text-blue-400': applicationStatus === 'reviewing',
                  'bg-green-500/20 text-green-400': applicationStatus === 'approved',
                  'bg-red-500/20 text-red-400': applicationStatus === 'rejected',
                  'bg-gray-500/20 text-gray-400': !applicationStatus
                }"
              >
                {{ applicationStatus || 'Processing' }}
              </span>
            </div>
            <p class="text-sm text-gray-300 mb-4">
              <template v-if="applicationStatus === 'approved'">
                Congratulations! You've been accepted. Access your dashboard to begin your learning journey.
              </template>
              <template v-else-if="applicationStatus === 'pending' || applicationStatus === 'reviewing'">
                Your application is being reviewed. We'll notify you once a decision is made.
              </template>
              <template v-else-if="applicationStatus === 'rejected'">
                Unfortunately, your application was not successful this time. Contact support for more information.
              </template>
              <template v-else>
                Your application status is being processed.
              </template>
            </p>
          </div>

          <!-- CTAs for Logged In Users -->
          <div class="flex flex-wrap justify-center gap-4 pt-4">
            <NuxtLink 
              to="/dashboard"
              class="flex items-center justify-center gap-2 h-12 px-8 bg-primary hover:bg-primary-dark text-background-dark text-base font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(18,226,105,0.2)]"
            >
              <span class="material-symbols-outlined text-lg">dashboard</span>
              <span>Go to Dashboard</span>
            </NuxtLink>
            <NuxtLink
              to="/dashboard/support"
              class="flex items-center justify-center h-12 px-8 bg-transparent border border-white/20 hover:border-primary/50 hover:bg-white/5 text-white text-base font-bold rounded-lg transition-all backdrop-blur-sm"
            >
              <span class="material-symbols-outlined mr-2">support_agent</span>
              <span>Get Support</span>
            </NuxtLink>
          </div>
        </template>

        <!-- LOGGED IN USER WITHOUT APPLICATION -->
        <template v-else-if="isLoggedIn && !hasApplication && !loadingStatus">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-border/50 border border-[#326748] backdrop-blur-sm mb-4">
            <span class="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span class="text-primary text-xs font-bold uppercase tracking-widest">Admissions Open 2026</span>
          </div>

          <!-- Headline -->
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white">
            Ready to Begin <br />
            <span class="text-transparent bg-clip-text bg-linear-to-r from-white via-gray-200 to-gray-500">Your Transformation?</span>
          </h1>

          <!-- Description -->
          <p class="text-lg md:text-xl text-gray-300 max-w-2xl font-light leading-relaxed">
            Welcome, {{ user?.name?.split(' ')[0] || 'future leader' }}! Complete your application to join the premier institution for mobility industry executives.
          </p>

          <!-- CTAs -->
          <div class="flex flex-wrap justify-center gap-4 pt-4">
            <NuxtLink 
              to="/apply"
              class="flex items-center justify-center gap-2 h-12 px-8 bg-primary hover:bg-primary-dark text-background-dark text-base font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(18,226,105,0.2)]"
            >
              <span>Complete Your Application</span>
              <span class="material-symbols-outlined text-lg">arrow_forward</span>
            </NuxtLink>
            <NuxtLink
              to="/dashboard"
              class="flex items-center justify-center h-12 px-8 bg-transparent border border-white/20 hover:border-primary/50 hover:bg-white/5 text-white text-base font-bold rounded-lg transition-all backdrop-blur-sm"
            >
              <span>View Dashboard</span>
            </NuxtLink>
          </div>
        </template>

        <!-- DEFAULT: NOT LOGGED IN -->
        <template v-else-if="!isLoggedIn">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-border/50 border border-[#326748] backdrop-blur-sm mb-4">
            <span class="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span class="text-primary text-xs font-bold uppercase tracking-widest">Admissions Open 2026</span>
          </div>

          <!-- Headline -->
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white">
            Architecting the Future of <br />
            <span class="text-transparent bg-clip-text bg-linear-to-r from-white via-gray-200 to-gray-500">Global Mobility Leadership</span>
          </h1>

          <!-- Description -->
          <p class="text-lg md:text-xl text-gray-300 max-w-2xl font-light leading-relaxed">
            The premier institution for executives shaping the convergence of automotive, aviation, and maritime industries through AI and strategic foresight.
          </p>

          <!-- CTAs -->
          <div class="flex flex-wrap justify-center gap-4 pt-4">
            <NuxtLink 
              to="/apply"
              class="flex items-center justify-center gap-2 h-12 px-8 bg-primary hover:bg-primary-dark text-background-dark text-base font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(18,226,105,0.2)]"
            >
              <span>Apply for Admission</span>
              <span class="material-symbols-outlined text-lg">arrow_forward</span>
            </NuxtLink>
            <button class="flex items-center justify-center h-12 px-8 bg-transparent border border-white/20 hover:border-primary/50 hover:bg-white/5 text-white text-base font-bold rounded-lg transition-all backdrop-blur-sm">
              <span>Download Prospectus</span>
            </button>
          </div>
        </template>

        <!-- Loading State -->
        <template v-else>
          <div class="flex items-center justify-center py-20">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </template>

      </div>
    </div>
  </section>
</template>
