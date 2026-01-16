<script setup>
const features = [
  {
    icon: 'trending_up',
    title: 'Business Intelligence',
    description: 'Redefining economic models for the global market. We analyze shifts in supply chains and consumer behavior to predict market volatility.',
  },
  {
    icon: 'memory',
    title: 'AI & Autonomy',
    description: 'Mastering the neural networks of tomorrow\'s fleets. From self-driving algorithms to predictive maintenance powered by machine learning.',
  },
  {
    icon: 'hub',
    title: 'Multi-Modal Ecosystems',
    description: 'Bridging land, sea, and air logistics seamlessly. Creating unified frameworks for inter-modal transportation efficiency.',
  },
]
</script>

<template>
  <section class="py-20 md:py-32 bg-background-dark relative">
    <!-- Subtle Grid Background -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#23483320_1px,transparent_1px),linear-gradient(to_bottom,#23483320_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
    
    <div class="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
      <div class="flex flex-col gap-16">
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row justify-between md:items-end gap-4 md:gap-6 border-b border-surface-border pb-6 md:pb-8">
          <div class="max-w-2xl">
            <h2 class="text-primary text-xs md:text-sm font-bold uppercase tracking-widest mb-2 md:mb-3">Our Vision</h2>
            <h3 class="text-2xl md:text-5xl font-bold text-white leading-tight">Our Mission Pillars</h3>
          </div>
          <p class="text-gray-400 text-sm md:text-lg max-w-lg leading-relaxed md:text-right">
            Bridging business, AI, and multi-modal mobility to define the next era of transportation.
          </p>
        </div>

        <!-- Feature Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <UiFeatureCard 
            v-for="feature in features" 
            :key="feature.title"
            :icon="feature.icon"
            :title="feature.title"
            :description="feature.description"
          />
        </div>
      </div>
    </div>
  </section>
</template>
