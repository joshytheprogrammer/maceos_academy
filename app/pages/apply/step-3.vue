<template>
  <div class="min-h-screen bg-background-dark text-white">
    <!-- Header -->
    <header class="border-b border-surface-border">
      <div class="max-w-4xl mx-auto px-6 py-4">
        <NuxtLink to="/apply/step-2" class="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors w-fit">
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

      <!-- Step 3: Payment -->
      <div class="bg-surface-dark border border-surface-border rounded-2xl p-8">
        <h1 class="text-3xl font-bold mb-2">Application Fee Payment</h1>
        <p class="text-text-secondary mb-8">Complete your application with a one-time fee</p>

        <!-- Payment Summary -->
        <div class="bg-background-dark/50 rounded-xl p-6 mb-8">
          <h3 class="text-lg font-semibold mb-4">Payment Summary</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-text-secondary">Application Fee</span>
              <span>₦50,000</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Processing Fee</span>
              <span>₦0</span>
            </div>
            <hr class="border-surface-border" />
            <div class="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span class="text-primary">₦50,000</span>
            </div>
          </div>
        </div>

        <!-- What's Included -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold mb-4">What's Included</h3>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <span class="material-symbols-outlined text-primary mt-0.5">check_circle</span>
              <span class="text-gray-300">10-month comprehensive curriculum</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="material-symbols-outlined text-primary mt-0.5">check_circle</span>
              <span class="text-gray-300">Access to all course materials and resources</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="material-symbols-outlined text-primary mt-0.5">check_circle</span>
              <span class="text-gray-300">Live sessions with industry experts</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="material-symbols-outlined text-primary mt-0.5">check_circle</span>
              <span class="text-gray-300">Certificate upon completion</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="material-symbols-outlined text-primary mt-0.5">check_circle</span>
              <span class="text-gray-300">Lifetime access to alumni network</span>
            </li>
          </ul>
        </div>

        <!-- Payment Methods -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold mb-4">Payment Method</h3>
          <div class="grid grid-cols-1 gap-4">
            <label 
              class="flex items-center gap-4 p-4 bg-background-dark border-2 rounded-xl cursor-pointer transition-colors"
              :class="paymentMethod === 'paystack' ? 'border-primary' : 'border-surface-border hover:border-primary/50'"
            >
              <input 
                type="radio" 
                v-model="paymentMethod" 
                value="paystack" 
                class="sr-only"
              />
              <div class="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="https://paystack.com/favicon.png" 
                  alt="Paystack" 
                  class="w-full h-full object-contain"
                />
              </div>
              <div>
                <p class="font-medium">Pay with Paystack</p>
                <p class="text-sm text-text-secondary">Cards, Bank Transfer, USSD</p>
              </div>
              <span 
                v-if="paymentMethod === 'paystack'" 
                class="material-symbols-outlined text-primary ml-auto"
              >
                check_circle
              </span>
            </label>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 mb-6">
          {{ errorMessage }}
        </div>

        <!-- Terms -->
        <div class="mb-8">
          <label class="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              v-model="agreedToTerms"
              class="mt-1 w-5 h-5 rounded border-surface-border bg-background-dark text-primary focus:ring-primary focus:ring-offset-0"
            />
            <span class="text-sm text-text-secondary">
              I agree to the 
              <a href="#" class="text-primary hover:underline">Terms of Service</a> 
              and 
              <a href="#" class="text-primary hover:underline">Privacy Policy</a>. 
              I understand that the application fee is non-refundable.
            </span>
          </label>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between pt-4">
          <button
            type="button"
            @click="navigateTo('/apply/step-2')"
            class="px-6 py-3 border border-surface-border hover:border-primary/50 text-gray-300 font-medium rounded-xl transition-colors flex items-center gap-2"
          >
            <span class="material-symbols-outlined">arrow_back</span>
            <span>Previous</span>
          </button>
          <button
            @click="handlePayment"
            :disabled="!agreedToTerms || isLoading"
            class="px-8 py-3 bg-primary hover:bg-primary-dark text-background-dark font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(18,226,105,0.2)]"
          >
            <span v-if="isLoading">Processing...</span>
            <span v-else>Pay ₦50,000</span>
            <span class="material-symbols-outlined">lock</span>
          </button>
        </div>
      </div>

      <!-- Security Note -->
      <p class="text-center text-neutral-500 text-sm mt-6 flex items-center justify-center gap-2">
        <span class="material-symbols-outlined text-lg">shield</span>
        Your payment is secured with 256-bit SSL encryption
      </p>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
})

const config = useRuntimeConfig()
const { user } = useAuth()
const { application, formData, currentStep, goToStep, initializePayment, completePayment, tempPassword } = useApplication()

const isLoading = ref(false)
const errorMessage = ref('')
const paymentMethod = ref('paystack')
const agreedToTerms = ref(false)

// Set current step
goToStep(3)

// Paystack configuration
const PAYSTACK_PUBLIC_KEY = config.public.paystackPublicKey

const verifyPayment = async (reference) => {
  try {
    const result = await $fetch('/api/payment/verify', {
      method: 'POST',
      body: { 
        reference,
        userId: user.value?.$id,
        applicationId: application.value?.$id,
        customerEmail: formData.value.email || user.value?.email,
        userName: user.value?.name || formData.value.fullName,
        tempPassword: tempPassword.value,
      },
    })
    return result
  }
  catch (e) {
    console.error('Verification error:', e)
    return { success: false, verified: false }
  }
}

const handlePayment = async () => {
  if (!agreedToTerms.value) {
    errorMessage.value = 'Please agree to the terms and conditions'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  const paymentReference = `MACEOS_${Date.now()}_${Math.floor(Math.random() * 1000000)}`

  try {
    // Store pending payment reference in database
    await initializePayment(application.value?.$id, paymentReference, 50000)

    // Initialize Paystack
    const handler = window.PaystackPop?.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: formData.value.email || user.value?.email,
      amount: 5000000, // Amount in kobo (₦50,000)
      currency: 'NGN',
      ref: paymentReference,
      metadata: {
        applicationId: application.value?.$id,
        userId: user.value?.$id,
        custom_fields: [
          {
            display_name: 'Application ID',
            variable_name: 'application_id',
            value: application.value?.$id,
          },
        ],
      },
      callback: function (response) {
        // Payment callback received - verify server-side
        console.log('Payment callback:', response)
        
        // Handle async verification inside regular function
        verifyPayment(response.reference).then((verification) => {
          if (verification.success && verification.verified) {
            // Payment verified - update application
            completePayment(application.value?.$id).then(() => {
              // Navigate to confirmation
              navigateTo('/apply/step-4')
            })
          }
          else {
            errorMessage.value = 'Payment verification failed. Please contact support if you were charged.'
            isLoading.value = false
          }
        }).catch(() => {
          errorMessage.value = 'Payment verification failed. Please contact support if you were charged.'
          isLoading.value = false
        })
      },
      onClose: function () {
        isLoading.value = false
        errorMessage.value = 'Payment was cancelled. Please try again.'
      },
    })

    handler?.openIframe()
  }
  catch (e) {
    console.error('Payment error:', e)
    errorMessage.value = 'Failed to initialize payment. Please try again.'
    isLoading.value = false
  }
}

// Load Paystack script
onMounted(() => {
  if (!window.PaystackPop) {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    document.head.appendChild(script)
  }
})
</script>
