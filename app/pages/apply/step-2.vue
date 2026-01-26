<template>
  <div class="min-h-screen bg-background-dark text-white">
    <!-- Header -->
    <header class="border-b border-surface-border">
      <div class="max-w-4xl mx-auto px-6 py-4">
        <NuxtLink to="/apply" class="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors w-fit">
          <span class="material-symbols-outlined">arrow_back</span>
          <span>Back</span>
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

      <!-- Step 2: Education & Background -->
      <div class="bg-surface-dark border border-surface-border rounded-2xl p-8">
        <h1 class="text-3xl font-bold mb-2">Education & Background</h1>
        <p class="text-text-secondary mb-8">Tell us about your academic and professional background</p>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Highest Education -->
          <div>
            <label for="highestEducation" class="block text-sm font-medium text-gray-300 mb-2">
              Highest Level of Education <span class="text-primary">*</span>
            </label>
            <select
              id="highestEducation"
              v-model="form.highestEducation"
              required
              class="w-full px-4 py-3 bg-background-dark border border-surface-border rounded-xl text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            >
              <option value="" disabled>Select your education level</option>
              <option value="high_school">High School / Secondary School</option>
              <option value="diploma">Diploma / Certificate</option>
              <option value="bachelors">Bachelor's Degree</option>
              <option value="masters">Master's Degree</option>
              <option value="doctorate">Doctorate / PhD</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Field of Study -->
          <div>
            <label for="fieldOfStudy" class="block text-sm font-medium text-gray-300 mb-2">
              Field of Study <span class="text-primary">*</span>
            </label>
            <input
              id="fieldOfStudy"
              v-model="form.fieldOfStudy"
              type="text"
              required
              class="w-full px-4 py-3 bg-background-dark border border-surface-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="e.g., Business Administration, Engineering, Arts"
            />
          </div>

          <!-- Current Occupation & Experience Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="currentOccupation" class="block text-sm font-medium text-gray-300 mb-2">
                Current Occupation <span class="text-primary">*</span>
              </label>
              <input
                id="currentOccupation"
                v-model="form.currentOccupation"
                type="text"
                required
                class="w-full px-4 py-3 bg-background-dark border border-surface-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="e.g., Student, Engineer, Manager"
              />
            </div>
            <div>
              <label for="yearsOfExperience" class="block text-sm font-medium text-gray-300 mb-2">
                Years of Experience <span class="text-primary">*</span>
              </label>
              <select
                id="yearsOfExperience"
                v-model="form.yearsOfExperience"
                required
                class="w-full px-4 py-3 bg-background-dark border border-surface-border rounded-xl text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              >
                <option value="" disabled>Select experience</option>
                <option value="0-1">0-1 years</option>
                <option value="2-5">2-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
          </div>

          <!-- Why Join -->
          <div>
            <label for="whyJoin" class="block text-sm font-medium text-gray-300 mb-2">
              Why do you want to join MACEOS Academy? <span class="text-primary">*</span>
            </label>
            <textarea
              id="whyJoin"
              v-model="form.whyJoin"
              required
              rows="4"
              class="w-full px-4 py-3 bg-background-dark border border-surface-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
              placeholder="Tell us about your goals and why this program interests you..."
            />
            <p class="text-sm text-gray-500 mt-2">Minimum 50 characters</p>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {{ errorMessage }}
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between pt-4">
            <button
              type="button"
              @click="navigateTo('/apply')"
              class="px-6 py-3 border border-surface-border hover:border-primary/50 text-gray-300 font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              <span class="material-symbols-outlined">arrow_back</span>
              <span>Previous</span>
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="px-8 py-3 bg-primary hover:bg-primary-dark text-background-dark font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(18,226,105,0.2)]"
            >
              <span v-if="isLoading">Saving...</span>
              <span v-else>Continue to Payment</span>
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
})

const { user } = useAuth()
const { formData, saveStepData, currentStep, goToStep, createApplication } = useApplication()

const isLoading = ref(false)
const errorMessage = ref('')

// Local form state
const form = ref({
  highestEducation: formData.value.highestEducation || '',
  fieldOfStudy: formData.value.fieldOfStudy || '',
  currentOccupation: formData.value.currentOccupation || '',
  yearsOfExperience: formData.value.yearsOfExperience || '',
  whyJoin: formData.value.whyJoin || '',
})

// Set current step
goToStep(2)

const handleSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''

  // Validate
  if (!form.value.highestEducation || !form.value.fieldOfStudy || !form.value.currentOccupation || !form.value.yearsOfExperience) {
    errorMessage.value = 'Please fill in all required fields'
    isLoading.value = false
    return
  }

  if (form.value.whyJoin.length < 50) {
    errorMessage.value = 'Please provide a more detailed response (minimum 50 characters)'
    isLoading.value = false
    return
  }

  // Save step data
  saveStepData(form.value)

  // Create application in database
  const result = await createApplication(user.value.$id)

  if (result.success) {
    navigateTo('/apply/step-3')
  }
  else {
    errorMessage.value = result.error || 'Failed to save application. Please try again.'
  }

  isLoading.value = false
}
</script>
