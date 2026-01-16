<script setup>
const outcomes = [
  {
    icon: 'science',
    title: 'Applied Research',
    description: 'Conduct real-world studies directly applicable to current market challenges.',
  },
  {
    icon: 'hub',
    title: 'Global Network',
    description: 'Connect with top-tier executives and alumni across 30+ countries.',
  },
]
</script>

<template>
  <section id="outcomes" class="py-20 px-4 sm:px-6 lg:px-8 bg-surface-dark border-y border-surface-border">
    <div class="mx-auto max-w-7xl">
      <div class="grid lg:grid-cols-2 gap-12">
        <!-- Left Column: Description -->
        <div class="flex flex-col justify-center">
          <h2 class="text-3xl font-bold mb-6">Futuristic Outcomes</h2>
          <p class="text-lg text-text-secondary font-body mb-8">
            Our curriculum emphasizes practical research and tangible results that reshape the industry. Graduates leave not just with a certificate, but with a deployed strategy.
          </p>
          
          <div class="grid gap-4">
            <div 
              v-for="outcome in outcomes" 
              :key="outcome.title"
              class="flex gap-4 p-4 rounded-lg bg-background-dark border border-surface-border hover:border-primary/50 transition-colors"
            >
              <span class="material-symbols-outlined text-primary text-3xl">{{ outcome.icon }}</span>
              <div>
                <h3 class="font-bold text-white">{{ outcome.title }}</h3>
                <p class="text-sm text-text-secondary mt-1">{{ outcome.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Stats Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col justify-between p-6 rounded-2xl bg-linear-to-br from-background-dark to-surface-dark border border-surface-border">
            <span class="material-symbols-outlined text-primary text-4xl mb-4">rocket_launch</span>
            <div>
              <p class="text-3xl font-bold text-white">94%</p>
              <p class="text-sm text-text-secondary">Graduates in C-Suite roles within 2 years</p>
            </div>
          </div>
          
          <div class="flex flex-col justify-between p-6 rounded-2xl bg-linear-to-br from-background-dark to-surface-dark border border-surface-border">
            <span class="material-symbols-outlined text-primary text-4xl mb-4">group_add</span>
            <div>
              <p class="text-3xl font-bold text-white">500+</p>
              <p class="text-sm text-text-secondary">Corporate Partners Worldwide</p>
            </div>
          </div>
          
          <div class="col-span-2 p-6 rounded-2xl bg-primary text-background-dark">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-bold text-xl mb-2">Industry Innovation</h3>
                <p class="font-medium opacity-80 max-w-sm">Lead the charge in sustainable and autonomous vehicle technologies.</p>
              </div>
              <span class="material-symbols-outlined text-4xl">lightbulb</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
