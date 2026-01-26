<template>
  <div class="min-h-screen bg-background-dark text-white">
    <!-- Header -->
    <header class="border-b border-surface-border">
      <div class="max-w-4xl mx-auto px-6 py-4">
        <NuxtLink to="/" class="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors w-fit">
          <span class="material-symbols-outlined">arrow_back</span>
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
                class="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors"
                :class="currentStep >= step ? 'bg-primary text-background-dark' : 'bg-surface-dark text-gray-500'"
              >
                <span v-if="currentStep > step" class="material-symbols-outlined text-xl">check</span>
                <span v-else>{{ step }}</span>
              </div>
            </div>
            <div 
              v-if="step < 4" 
              class="flex-1 h-1 mx-2 rounded transition-colors"
              :class="currentStep > step ? 'bg-primary' : 'bg-surface-dark'"
            />
          </template>
        </div>
        <div class="flex justify-between text-sm">
          <span :class="currentStep >= 1 ? 'text-primary' : 'text-gray-500'">Personal Info</span>
          <span :class="currentStep >= 2 ? 'text-primary' : 'text-gray-500'">Education</span>
          <span :class="currentStep >= 3 ? 'text-primary' : 'text-gray-500'">Payment</span>
          <span :class="currentStep >= 4 ? 'text-primary' : 'text-gray-500'">Confirmation</span>
        </div>
      </div>

      <!-- Step 1: Personal Information -->
      <div class="bg-surface-dark border border-surface-border rounded-2xl p-8">
        <h1 class="text-3xl font-bold mb-2">Personal Information</h1>
        <p class="text-text-secondary mb-8">Let's start with your basic details</p>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Full Name -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-300 mb-2">
              Full Name <span class="text-primary">*</span>
            </label>
            <input
              id="fullName"
              v-model="form.fullName"
              type="text"
              required
              class="w-full px-4 py-3 bg-background-dark border border-surface-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Email Address <span class="text-primary">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 bg-background-dark border border-surface-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <!-- Phone & Country Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">
                Phone Number <span class="text-primary">*</span>
              </label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                required
                class="w-full px-4 py-3 bg-background-dark border border-surface-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="+234 800 000 0000"
              />
            </div>
            <div>
              <label for="country" class="block text-sm font-medium text-gray-300 mb-2">
                Country <span class="text-primary">*</span>
              </label>
              <select
                id="country"
                v-model="form.country"
                required
                class="w-full px-4 py-3 bg-background-dark border border-surface-border rounded-xl text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              >
                <option value="" disabled>Select your country</option>
                <option value="NG">Nigeria</option>
                <option value="GH">Ghana</option>
                <option value="KE">Kenya</option>
                <option value="ZA">South Africa</option>
                <option value="EG">Egypt</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <!-- Date of Birth -->
          <div>
            <label for="dateOfBirth" class="block text-sm font-medium text-gray-300 mb-2">
              Date of Birth <span class="text-primary">*</span>
            </label>
            <input
              id="dateOfBirth"
              v-model="form.dateOfBirth"
              type="date"
              required
              class="w-full px-4 py-3 bg-background-dark border border-surface-border rounded-xl text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end pt-4">
            <button
              type="submit"
              :disabled="isLoading"
              class="px-8 py-3 bg-primary hover:bg-primary-dark text-background-dark font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(18,226,105,0.2)]"
            >
              <span v-if="isLoading">Creating Account...</span>
              <span v-else>Continue</span>
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Login Link -->
      <p class="text-center text-text-secondary mt-8">
        Already have an account? 
        <NuxtLink to="/login" class="text-primary hover:text-primary-dark transition-colors">
          Sign in here
        </NuxtLink>
      </p>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['guest']
})

const { register, error: authError, loading: authLoading } = useAuth()
const { formData, saveStepData, currentStep, goToStep, setTempPassword } = useApplication()

const isLoading = ref(false)
const errorMessage = ref('')

// Local form state
const form = ref({
  fullName: formData.value.fullName || '',
  email: formData.value.email || '',
  phone: formData.value.phone || '',
  country: formData.value.country || '',
  dateOfBirth: formData.value.dateOfBirth || '',
})

// Set current step
goToStep(1)

const handleSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''

  // Validate
  if (!form.value.fullName || !form.value.email || !form.value.phone || !form.value.country || !form.value.dateOfBirth) {
    errorMessage.value = 'Please fill in all required fields'
    isLoading.value = false
    return
  }

  // Save step data
  saveStepData(form.value)

  // Create Appwrite account - password is auto-generated
  // User will need to reset password after admin approval
  const result = await register(form.value.email, form.value.fullName)

  if (result.success) {
    // Store the generated password for email later
    if (result.generatedPassword) {
      setTempPassword(result.generatedPassword)
    }
    // Navigate to step 2
    navigateTo('/apply/step-2')
  }
  else {
    errorMessage.value = result.error || 'Failed to create account. Please try again.'
  }

  isLoading.value = false
}
</script>
