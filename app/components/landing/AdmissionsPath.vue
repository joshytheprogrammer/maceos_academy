<script setup>
const steps = [
  {
    icon: 'assignment_ind',
    number: 1,
    title: 'Application Review',
    description: 'Submit your professional credentials and statement of purpose for initial screening.',
    isFirst: true,
  },
  {
    icon: 'gavel',
    number: 2,
    title: 'Committee Approval',
    description: 'Our academic board reviews selected candidates for fit and potential impact.',
    isFirst: false,
  },
  {
    icon: 'payments',
    number: 3,
    title: 'Secure Enrollment',
    description: 'Confirm your seat with a secure deposit via our encrypted payment gateway.',
    isFirst: false,
  },
]
</script>

<template>
  <section id="admissions" class="py-24 px-4 sm:px-6 lg:px-8 bg-background-dark relative overflow-hidden">
    <!-- Background decorative element -->
    <div class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
    
    <div class="mx-auto max-w-6xl relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span class="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Join the Elite</span>
        <h2 class="text-3xl sm:text-4xl font-bold text-white">Admissions Path</h2>
        <p class="mt-4 text-text-secondary max-w-2xl mx-auto">Our rigorous selection process ensures a cohort of dedicated, high-potential leaders.</p>
      </div>

      <!-- Steps -->
      <div class="relative">
        <!-- Connecting Line (Desktop) -->
        <div class="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-surface-border"></div>
        
        <div class="grid md:grid-cols-3 gap-8 md:gap-4">
          <div 
            v-for="step in steps" 
            :key="step.number"
            class="relative flex flex-col items-center text-center group"
          >
            <div class="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-background-dark bg-surface-dark group-hover:border-primary transition-colors duration-300">
              <span class="material-symbols-outlined text-4xl text-white group-hover:text-primary transition-colors">{{ step.icon }}</span>
              <div 
                class="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full font-bold"
                :class="step.isFirst ? 'bg-primary text-background-dark' : 'bg-surface-border text-white'"
              >
                {{ step.number }}
              </div>
            </div>
            <h3 class="mt-6 text-xl font-bold text-white">{{ step.title }}</h3>
            <p class="mt-2 text-sm text-text-secondary max-w-xs mx-auto">{{ step.description }}</p>
            
            <!-- Payment providers for last step -->
            <div v-if="step.number === 3" class="mt-4 flex gap-4 opacity-50 group-hover:opacity-100 transition-all">
              <div class="flex items-center gap-1 text-xs font-bold text-white border border-white/20 px-2 py-1 rounded">
                <span class="material-symbols-outlined text-base">lock</span> Stripe
              </div>
              <div class="flex items-center gap-1 text-xs font-bold text-white border border-white/20 px-2 py-1 rounded">
                <span class="material-symbols-outlined text-base">credit_card</span> Flutterwave
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Code of Conduct & CTA -->
      <div class="mt-20 mx-auto max-w-3xl">
        <div class="rounded-2xl border border-surface-border bg-surface-dark/50 p-8 text-center backdrop-blur-sm">
          <div class="flex justify-center mb-4">
            <span class="material-symbols-outlined text-primary text-3xl">verified_user</span>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Code of Conduct</h3>
          <p class="text-text-secondary mb-8 font-body text-sm leading-relaxed max-w-xl mx-auto">
            Excellence requires integrity. We accept only those committed to reshaping the industry with ethical leadership and unwavering dedication. By applying, you agree to uphold the MACEOS standard.
          </p>
          <button class="w-full sm:w-auto min-w-50 h-12 rounded-lg bg-primary text-background-dark font-bold text-lg hover:bg-primary-dark transition-all shadow-[0_0_20px_rgba(18,226,105,0.3)]">
            Begin Application
          </button>
          <p class="mt-4 text-xs text-gray-500">Applications for the Fall Cohort close in 14 days.</p>
        </div>
      </div>
    </div>
  </section>
</template>
