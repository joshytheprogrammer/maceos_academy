<script setup>
const modules = [
  {
    icon: 'trending_up',
    title: 'Module 1: Strategic EV Markets',
    subtitle: 'Weeks 1-4 • Strategy & Economics',
    content: 'Focuses on the integration of AI in mobility, managing R&D teams, and predicting future market shifts in the autonomous sector. Students will analyze real-time case studies from Asian and European markets.',
    checkpoints: [
      'Market Penetration Strategy',
      'Regulatory Landscape Analysis',
      'Battery Economics',
      'Charging Infrastructure Models',
    ],
    defaultOpen: true,
  },
  {
    icon: 'memory',
    title: 'Module 2: Innovation & Autonomous Systems',
    subtitle: 'Weeks 5-8 • Technology Management',
    content: 'Explore the ethical and technical challenges of L4 and L5 autonomy. This module brings in guest lecturers from top Silicon Valley firms.',
    checkpoints: [],
    defaultOpen: false,
  },
  {
    icon: 'public',
    title: 'Module 3: Global Supply Chain Leadership',
    subtitle: 'Weeks 9-12 • Operations',
    content: 'Resilience in the face of geopolitical instability. Learn to architect supply chains that can withstand global shocks.',
    checkpoints: [],
    defaultOpen: false,
  },
]
</script>

<template>
  <section id="curriculum" class="py-20 px-4 sm:px-6 lg:px-8 bg-background-dark">
    <div class="mx-auto max-w-4xl">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold mb-4">Core Modules</h2>
        <p class="text-text-secondary">A rigorous academic structure designed for senior executives.</p>
      </div>

      <!-- Modules -->
      <div class="flex flex-col gap-4">
        <UiModuleAccordion 
          v-for="module in modules" 
          :key="module.title"
          :icon="module.icon"
          :title="module.title"
          :subtitle="module.subtitle"
          :content="module.content"
          :checkpoints="module.checkpoints"
          :default-open="module.defaultOpen"
        />
      </div>
    </div>
  </section>
</template>
