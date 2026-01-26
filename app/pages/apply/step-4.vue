<template>
  <div class="min-h-screen bg-background-dark text-white">
    <!-- Header -->
    <header class="border-b border-surface-border">
      <div class="max-w-4xl mx-auto px-6 py-4">
        <NuxtLink to="/" class="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors w-fit">
          <span class="material-symbols-outlined">home</span>
          <span>Back to Home</span>
        </NuxtLink>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 py-12">
      <!-- Progress Steps -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-4">
          <template v-for="step in 4" :key="step">
            <div class="flex items-center">
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors bg-primary text-background-dark"
              >
                <span class="material-symbols-outlined text-xl">check</span>
              </div>
            </div>
            <div 
              v-if="step < 4" 
              class="flex-1 h-1 mx-2 rounded bg-primary"
            />
          </template>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-primary">Personal Info</span>
          <span class="text-primary">Education</span>
          <span class="text-primary">Payment</span>
          <span class="text-primary">Confirmation</span>
        </div>
      </div>

      <!-- Success Card -->
      <div class="bg-surface-dark border border-surface-border rounded-2xl p-8 text-center">
        <!-- Success Icon -->
        <div class="w-24 h-24 mx-auto mb-6 bg-primary/20 rounded-full flex items-center justify-center">
          <span class="material-symbols-outlined text-primary text-5xl">check_circle</span>
        </div>

        <h1 class="text-3xl font-bold mb-4">Application Submitted!</h1>
        <p class="text-text-secondary text-lg mb-8 max-w-md mx-auto">
          Thank you for applying to MACEOS Academy. Your application has been received and is under review.
        </p>

        <!-- Application Details -->
        <div class="bg-background-dark/50 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
          <h3 class="text-lg font-semibold mb-4 text-center">Application Details</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-text-secondary">Application ID</span>
              <span class="font-mono text-sm">{{ application?.$id?.slice(0, 12) }}...</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Name</span>
              <span>{{ formData.fullName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Email</span>
              <span>{{ formData.email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Status</span>
              <span class="text-primary flex items-center gap-1">
                <span class="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                Under Review
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Submitted</span>
              <span>{{ new Date().toLocaleDateString() }}</span>
            </div>
          </div>
        </div>

        <!-- What's Next -->
        <div class="bg-surface-darker/30 rounded-xl p-6 mb-8 text-left">
          <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">info</span>
            What Happens Next?
          </h3>
          <ol class="space-y-4">
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-semibold shrink-0">1</span>
              <div>
                <p class="font-medium">Application Review</p>
                <p class="text-sm text-text-secondary">Our admissions team will review your application within 3-5 business days.</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 bg-surface-border text-gray-400 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">2</span>
              <div>
                <p class="font-medium text-gray-400">Email Notification</p>
                <p class="text-sm text-gray-500">You'll receive an email with your admission decision.</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 bg-surface-border text-gray-400 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">3</span>
              <div>
                <p class="font-medium text-gray-400">Dashboard Access</p>
                <p class="text-sm text-gray-500">Once approved, you'll gain access to your student dashboard.</p>
              </div>
            </li>
          </ol>
        </div>

        <!-- Email Reminder -->
        <div class="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl mb-8">
          <p class="text-blue-400 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">mail</span>
            A confirmation email has been sent to <strong>{{ formData.email }}</strong>
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/dashboard"
            class="px-8 py-3 bg-primary hover:bg-primary-dark text-background-dark font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(18,226,105,0.2)]"
          >
            <span>Go to Dashboard</span>
            <span class="material-symbols-outlined">arrow_forward</span>
          </NuxtLink>
          <NuxtLink
            to="/"
            class="px-8 py-3 border border-surface-border hover:border-primary/50 text-gray-300 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span>Return Home</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Support Note -->
      <p class="text-center text-gray-500 text-sm mt-8">
        Have questions? Contact us at 
        <a href="mailto:support@maceosacademy.com" class="text-primary hover:underline">
          support@maceosacademy.com
        </a>
      </p>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
})

const { application, formData, goToStep, resetForm } = useApplication()

// Set current step
goToStep(4)

// Clear session storage temp password
onMounted(() => {
  sessionStorage.removeItem('temp_pwd')
})

// Optional: Reset form when leaving confirmation page
onBeforeUnmount(() => {
  // Uncomment to reset form after viewing confirmation
  // resetForm()
})
</script>
