<template>
  <!-- Loading screen while checking auth -->
  <UiLoadingScreen v-if="!authReady" message="Loading dashboard..." />
  
  <div v-else>
      <!-- Application Rejected State -->
      <template v-if="applicationStatus === 'rejected'">
        <div class="max-w-2xl mx-auto text-center py-12">
          <!-- Icon -->
          <div class="mb-8">
            <div class="w-32 h-32 mx-auto bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
              <span class="material-symbols-outlined text-red-400 text-6xl">block</span>
            </div>
          </div>

          <!-- Message -->
          <h2 class="text-3xl font-bold text-white font-display mb-4">
            Application Not Approved
          </h2>
          <p class="text-xl text-text-secondary mb-8">
            Thank you for your interest in MACEOS Academy
          </p>

          <!-- Rejection Info Card -->
          <div class="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 mb-8 text-left">
            <div class="flex items-start gap-4 mb-6">
              <div class="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-red-400 text-2xl">info</span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-red-400 mb-2 font-display">Your Application Status</h3>
                <p class="text-text-secondary">
                  After careful review, we regret to inform you that your application has not been accepted at this time. 
                  This decision was made based on our program requirements and available spots.
                </p>
              </div>
            </div>
          </div>

          <!-- What You Can Do -->
          <div class="bg-surface-dark border border-surface-border rounded-2xl p-8 mb-8 text-left">
            <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-2 font-display">
              <span class="material-symbols-outlined text-primary">lightbulb</span>
              What You Can Do Next
            </h3>
            <ul class="space-y-5">
              <li class="flex items-start gap-4">
                <div class="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span class="text-primary font-bold">1</span>
                </div>
                <div>
                  <p class="font-bold text-white mb-1">Contact Our Support Team</p>
                  <p class="text-text-secondary">
                    Reach out to us if you'd like feedback on your application. We're happy to provide constructive insights.
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-4">
                <div class="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span class="text-primary font-bold">2</span>
                </div>
                <div>
                  <p class="font-bold text-white mb-1">Consider Applying Again</p>
                  <p class="text-text-secondary">
                    We open applications regularly. You're welcome to reapply in the future with updated qualifications or experiences.
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-4">
                <div class="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span class="text-primary font-bold">3</span>
                </div>
                <div>
                  <p class="font-bold text-white mb-1">Explore Other Programs</p>
                  <p class="text-text-secondary">
                    Visit our website to learn about other training programs and opportunities that might be a great fit for you.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@maceos.academy"
              class="inline-flex items-center justify-center gap-2 h-12 px-6 bg-primary hover:bg-primary-dark text-background-dark font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(18,226,105,0.2)]"
            >
              <span class="material-symbols-outlined">email</span>
              Contact Support
            </a>
            <NuxtLink 
              to="/"
              class="inline-flex items-center justify-center gap-2 h-12 px-6 border border-white/20 text-white hover:bg-white/5 hover:border-primary/50 font-bold rounded-xl transition-all"
            >
              <span class="material-symbols-outlined">home</span>
              Back to Home
            </NuxtLink>
          </div>
        </div>
      </template>

      <!-- Application Pending Review State -->
      <template v-else-if="applicationStatus === 'pending'">
        <div class="max-w-2xl mx-auto text-center py-12">
          <!-- Animated Icon -->
          <div class="mb-8 relative">
            <div class="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
              <div class="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                <span class="material-symbols-outlined text-primary text-5xl">hourglass_top</span>
              </div>
            </div>
            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary/20 border border-primary/40 rounded-full">
              <span class="text-primary text-sm font-bold tracking-wide">Under Review</span>
            </div>
          </div>

          <!-- Welcome Message -->
          <h2 class="text-3xl font-bold text-white font-display mb-4">
            Welcome, {{ user?.name?.split(' ')[0] }}! 🎉
          </h2>
          <p class="text-xl text-text-secondary mb-8">
            Your application has been successfully submitted
          </p>

          <!-- Password Reminder Alert -->
          <div class="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-8 text-left">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-amber-400 text-2xl">key</span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-amber-400 mb-1 font-display">Important: Change Your Password</h3>
                <p class="text-text-secondary mb-4">
                  Your login credentials were sent to <span class="text-white font-medium">{{ user?.email }}</span>. 
                  For security, please change your password after logging in.
                </p>
                <button 
                  @click="showChangePassword = true"
                  class="inline-flex items-center gap-2 h-10 px-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold rounded-lg transition-all"
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
                <h3 class="text-lg font-bold text-white mb-1 font-display">Application Status</h3>
                <p class="text-text-secondary">
                  Our admissions team is reviewing your application. This typically takes 
                  <span class="text-primary font-bold">3-5 business days</span>.
                </p>
              </div>
            </div>

            <!-- Progress Steps -->
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(18,226,105,0.3)]">
                  <span class="material-symbols-outlined text-background-dark">check</span>
                </div>
                <div class="flex-1">
                  <p class="font-bold text-white">Application Submitted</p>
                  <p class="text-sm text-text-secondary">{{ formatDate(application?.submittedAt) }}</p>
                </div>
              </div>
              
              <div class="ml-5 w-0.5 h-6 bg-primary"></div>
              
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(18,226,105,0.3)]">
                  <span class="material-symbols-outlined text-background-dark">check</span>
                </div>
                <div class="flex-1">
                  <p class="font-bold text-white">Payment Confirmed</p>
                  <p class="text-sm text-text-secondary">₦{{ application?.paymentAmount?.toLocaleString() }} paid via Paystack</p>
                </div>
              </div>
              
              <div class="ml-5 w-0.5 h-6 bg-primary/30"></div>
              
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-primary/20 border-2 border-primary rounded-full flex items-center justify-center shrink-0 animate-pulse">
                  <span class="material-symbols-outlined text-primary">pending</span>
                </div>
                <div class="flex-1">
                  <p class="font-bold text-primary">Under Review</p>
                  <p class="text-sm text-text-secondary">Our team is evaluating your application</p>
                </div>
              </div>
              
              <div class="ml-5 w-0.5 h-6 bg-surface-border"></div>
              
              <div class="flex items-center gap-4 opacity-50">
                <div class="w-10 h-10 bg-surface-border rounded-full flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-gray-500">school</span>
                </div>
                <div class="flex-1">
                  <p class="font-bold text-gray-400">Decision</p>
                  <p class="text-sm text-gray-500">You'll be notified via email</p>
                </div>
              </div>
            </div>
          </div>

          <!-- What Happens Next -->
          <div class="bg-surface-dark border border-surface-border rounded-2xl p-6 mb-8">
            <h3 class="text-lg font-bold text-white mb-5 flex items-center gap-2 font-display">
              <span class="material-symbols-outlined text-primary">info</span>
              What happens next?
            </h3>
            <ul class="space-y-4 text-left">
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
            class="inline-flex items-center gap-2 h-12 px-6 border border-white/20 text-white hover:bg-white/5 hover:border-primary/50 font-bold rounded-xl transition-all"
          >
            <span class="material-symbols-outlined">email</span>
            Contact Support
          </a>
        </div>
      </template>

      <!-- Approved/Active Student Dashboard -->
      <template v-else-if="applicationStatus === 'approved'">
        <!-- Welcome Header -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-3">
            <span class="h-px w-8 bg-primary/50"></span>
            <span class="text-primary text-xs font-bold tracking-widest uppercase">Welcome Back</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-white font-display mb-2">
            Hello, {{ user?.name?.split(' ')[0] }}! 👋
          </h1>
          <p class="text-text-secondary text-lg">Track your progress and access your course materials</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="group bg-surface-dark border border-surface-border rounded-2xl p-6 hover:border-primary/50 transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span class="material-symbols-outlined text-primary text-2xl">school</span>
              </div>
              <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Current</span>
            </div>
            <p class="text-3xl font-bold text-white font-display mb-1">Week {{ currentWeek }}</p>
            <p class="text-text-secondary text-sm">of 10 weeks total</p>
          </div>

          <div class="group bg-surface-dark border border-surface-border rounded-2xl p-6 hover:border-primary/50 transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span class="material-symbols-outlined text-primary text-2xl">task_alt</span>
              </div>
              <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Progress</span>
            </div>
            <p class="text-3xl font-bold text-white font-display mb-1">{{ progressPercent }}%</p>
            <p class="text-text-secondary text-sm">Course completed</p>
          </div>

          <div class="group bg-surface-dark border border-surface-border rounded-2xl p-6 hover:border-primary/50 transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span class="material-symbols-outlined text-primary text-2xl">download</span>
              </div>
              <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Materials</span>
            </div>
            <p class="text-3xl font-bold text-white font-display mb-1">{{ downloadedMaterials }}</p>
            <p class="text-text-secondary text-sm">Files downloaded</p>
          </div>

          <div class="group bg-surface-dark border border-surface-border rounded-2xl p-6 hover:border-primary/50 transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span class="material-symbols-outlined text-primary text-2xl">emoji_events</span>
              </div>
              <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Exams</span>
            </div>
            <p class="text-3xl font-bold text-white font-display mb-1">{{ completedExams }}/2</p>
            <p class="text-text-secondary text-sm">Exams completed</p>
          </div>
        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column: Course Progress -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Live Sessions Widget -->
            <div v-if="activeLiveSessions.length > 0 || upcomingLiveSessions.length > 0" class="bg-linear-to-br from-primary/20 via-primary/10 to-transparent border-2 border-primary/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(18,226,105,0.2)]">
              <div class="flex items-center justify-between mb-5">
                <div class="flex items-center gap-3">
                  <div v-if="activeLiveSessions.length > 0" class="h-3 w-3 bg-primary rounded-full animate-pulse"></div>
                  <h3 class="text-xl font-bold text-white font-display">
                    {{ activeLiveSessions.length > 0 ? 'Live Now' : 'Upcoming Live Session' }}
                  </h3>
                </div>
                <NuxtLink 
                  to="/dashboard/live-sessions" 
                  class="inline-flex items-center gap-1 text-primary hover:text-primary-light text-sm font-bold transition-colors"
                >
                  View all
                  <span class="material-symbols-outlined text-lg">arrow_forward</span>
                </NuxtLink>
              </div>

              <div class="space-y-3">
                <!-- Active Sessions -->
                <div 
                  v-for="session in activeLiveSessions.slice(0, 1)" 
                  :key="session.$id"
                  class="relative overflow-hidden bg-primary/10 border border-primary/30 rounded-xl p-4"
                >
                  <div class="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
                  <div class="relative flex items-start gap-4">
                    <div class="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 animate-pulse">
                      <span class="material-symbols-outlined text-2xl text-primary">videocam</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-bold text-white mb-1">{{ session.title }}</h4>
                      <p class="text-sm text-text-secondary mb-3">Week {{ session.week }} • Live Now</p>
                      <a 
                        :href="session.liveLink" 
                        target="_blank"
                        class="inline-flex items-center justify-center gap-2 h-10 px-5 bg-primary hover:bg-primary-dark text-background-dark text-sm font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(18,226,105,0.3)]"
                      >
                        <span class="material-symbols-outlined">videocam</span>
                        Join Now
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Upcoming Sessions -->
                <div 
                  v-for="session in activeLiveSessions.length > 0 ? [] : upcomingLiveSessions.slice(0, 1)" 
                  :key="session.$id"
                  class="bg-background-dark/50 border border-surface-border rounded-xl p-4"
                >
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-2xl text-amber-400">schedule</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-bold text-white mb-1">{{ session.title }}</h4>
                      <p class="text-sm text-text-secondary mb-1">Week {{ session.week }}</p>
                      <p class="text-sm text-amber-400 font-medium">
                        Starts {{ formatTimeUntil(session.liveStartTime) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Current Week Materials -->
            <div class="bg-surface-dark border border-surface-border rounded-2xl p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-white font-display">Week {{ currentWeek }} Materials</h3>
                <NuxtLink 
                  to="/dashboard/materials" 
                  class="inline-flex items-center gap-1 text-primary hover:text-primary-light text-sm font-bold transition-colors"
                >
                  View all
                  <span class="material-symbols-outlined text-lg">arrow_forward</span>
                </NuxtLink>
              </div>

              <div class="space-y-3">
                <div 
                  v-for="material in currentMaterials" 
                  :key="material.id"
                  class="group flex items-center gap-4 p-4 bg-background-dark/50 rounded-xl hover:bg-background-dark border border-transparent hover:border-surface-border transition-all cursor-pointer"
                >
                  <div 
                    class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                    :class="getMaterialIconClass(material.type)"
                  >
                    <span class="material-symbols-outlined text-2xl">{{ getMaterialIcon(material.type) }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-white truncate group-hover:text-primary transition-colors">{{ material.title }}</p>
                    <p class="text-sm text-text-secondary capitalize">{{ material.type }} • {{ material.duration }}</p>
                  </div>
                  <button class="p-2.5 text-primary bg-primary/10 hover:bg-primary hover:text-background-dark rounded-lg transition-all">
                    <span class="material-symbols-outlined">{{ material.type === 'video' ? 'play_circle' : 'download' }}</span>
                  </button>
                </div>

                <div v-if="currentMaterials.length === 0" class="text-center py-12">
                  <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-border flex items-center justify-center">
                    <span class="material-symbols-outlined text-3xl text-gray-500">folder_open</span>
                  </div>
                  <p class="text-gray-500">No materials available for this week yet.</p>
                </div>
              </div>
            </div>

            <!-- Upcoming Schedule -->
            <div class="bg-surface-dark border border-surface-border rounded-2xl p-6">
              <h3 class="text-xl font-bold text-white font-display mb-6">Upcoming Schedule</h3>
              
              <div class="space-y-3">
                <div 
                  v-for="event in upcomingEvents" 
                  :key="event.id"
                  class="flex items-center gap-4 p-4 border border-surface-border rounded-xl hover:border-primary/30 transition-all"
                >
                  <div class="text-center min-w-15 p-3 bg-primary/10 rounded-xl">
                    <p class="text-2xl font-bold text-primary font-display">{{ event.day }}</p>
                    <p class="text-xs text-text-secondary font-bold uppercase">{{ event.month }}</p>
                  </div>
                  <div class="flex-1">
                    <p class="font-bold text-white">{{ event.title }}</p>
                    <p class="text-sm text-text-secondary">{{ event.time }}</p>
                  </div>
                  <span 
                    class="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full"
                    :class="getEventTypeClass(event.type)"
                  >
                    {{ event.type }}
                  </span>
                </div>

                <div v-if="upcomingEvents.length === 0" class="text-center py-12">
                  <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-border flex items-center justify-center">
                    <span class="material-symbols-outlined text-3xl text-gray-500">event_busy</span>
                  </div>
                  <p class="text-gray-500">No upcoming events scheduled.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Sidebar -->
          <div class="space-y-6">
            <!-- Quick Actions -->
            <div class="bg-surface-dark border border-surface-border rounded-2xl p-6">
              <h3 class="text-lg font-bold text-white font-display mb-4">Quick Actions</h3>
              <div class="space-y-2">
                <NuxtLink 
                  to="/dashboard/materials"
                  class="flex items-center gap-3 p-3.5 bg-background-dark hover:bg-surface-darker rounded-xl transition-all group"
                >
                  <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span class="material-symbols-outlined text-primary">folder</span>
                  </div>
                  <span class="text-gray-300 font-medium group-hover:text-white transition-colors">Browse Materials</span>
                </NuxtLink>
                <NuxtLink 
                  to="/dashboard/exams"
                  class="flex items-center gap-3 p-3.5 bg-background-dark hover:bg-surface-darker rounded-xl transition-all group"
                >
                  <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span class="material-symbols-outlined text-primary">quiz</span>
                  </div>
                  <span class="text-gray-300 font-medium group-hover:text-white transition-colors">View Exams</span>
                </NuxtLink>
                <NuxtLink 
                  to="/dashboard/support"
                  class="flex items-center gap-3 p-3.5 bg-background-dark hover:bg-surface-darker rounded-xl transition-all group"
                >
                  <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span class="material-symbols-outlined text-primary">support_agent</span>
                  </div>
                  <span class="text-gray-300 font-medium group-hover:text-white transition-colors">Get Support</span>
                </NuxtLink>
              </div>
            </div>

            <!-- Progress Overview -->
            <div class="bg-surface-dark border border-surface-border rounded-2xl p-6">
              <h3 class="text-lg font-bold text-white font-display mb-5">Course Progress</h3>
              <div class="space-y-3">
                <div v-for="week in 10" :key="week" class="flex items-center gap-3">
                  <div 
                    class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                    :class="week <= currentWeek 
                      ? 'bg-primary text-background-dark shadow-[0_0_10px_rgba(18,226,105,0.3)]' 
                      : 'bg-surface-border text-gray-500'"
                  >
                    <span v-if="week < currentWeek" class="material-symbols-outlined text-lg">check</span>
                    <span v-else>{{ week }}</span>
                  </div>
                  <div class="flex-1">
                    <div 
                      class="h-2 rounded-full transition-all"
                      :class="week < currentWeek 
                        ? 'bg-primary' 
                        : week === currentWeek 
                          ? 'bg-linear-to-r from-primary to-primary/30' 
                          : 'bg-surface-border'"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Need Help Card -->
            <div class="relative overflow-hidden bg-linear-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 rounded-2xl p-6">
              <div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <span class="material-symbols-outlined text-primary text-3xl mb-4 block">help</span>
              <h3 class="text-lg font-bold text-white font-display mb-2">Need Help?</h3>
              <p class="text-text-secondary text-sm mb-5">
                Our support team is here to assist you with any questions or concerns.
              </p>
              <NuxtLink 
                to="/dashboard/support"
                class="inline-flex items-center gap-2 text-primary hover:text-primary-light font-bold transition-colors"
              >
                Contact Support
                <span class="material-symbols-outlined text-lg">arrow_forward</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>

    <!-- Change Password Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="showChangePassword" 
          class="fixed inset-0 z-9999 flex items-center justify-center p-4"
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
const { content, fetchAllContent } = useContent()
const authInitialized = useState('auth_initialized', () => false)
const authReady = computed(() => authInitialized.value)

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

// Live sessions computed
const liveSessions = computed(() => {
  return content.value.filter(item => item.type === 'live-link' && item.isPublished)
})

const activeLiveSessions = computed(() => {
  return liveSessions.value.filter(session => isSessionActive(session))
})

const upcomingLiveSessions = computed(() => {
  return liveSessions.value
    .filter(session => isSessionUpcoming(session))
    .sort((a, b) => new Date(a.liveStartTime) - new Date(b.liveStartTime))
})

// Session status helpers
const isSessionActive = (session) => {
  if (!session.liveStartTime || !session.liveEndTime) return false
  const now = new Date()
  const start = new Date(session.liveStartTime)
  const end = new Date(session.liveEndTime)
  return now >= new Date(start.getTime() - 15 * 60 * 1000) && 
         now <= new Date(end.getTime() + 60 * 60 * 1000)
}

const isSessionUpcoming = (session) => {
  if (!session.liveStartTime) return false
  const now = new Date()
  const start = new Date(session.liveStartTime)
  return now < new Date(start.getTime() - 15 * 60 * 1000)
}

const formatTimeUntil = (dateStr) => {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = date - now
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 0) return 'now'
  if (diffMins < 60) return `in ${diffMins} minute${diffMins > 1 ? 's' : ''}`
  if (diffHours < 24) return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`
  if (diffDays < 7) return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`
  return 'soon'
}

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
    await account.updatePassword({
      password: passwordForm.value.newPassword,
      oldPassword: passwordForm.value.currentPassword
    })
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

onMounted(() => {
  // Fetch user's application status
  if (user.value) {
    fetchApplication(user.value.$id)
  }
  
  // Fetch all content for live sessions widget
  fetchAllContent()
  
  // Auto-refresh every minute to update live session statuses
  setInterval(() => {
    fetchAllContent()
  }, 60000)
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
