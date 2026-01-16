<script setup>
const sectors = [
  { icon: 'directions_car', title: 'Automotive', description: 'Redefining terrestrial transport through electrification and autonomy.' },
  { icon: 'flight_takeoff', title: 'Aviation', description: 'Next-gen propulsion leadership for sustainable air travel.' },
  { icon: 'directions_boat', title: 'Maritime', description: 'Global logistics and the future of autonomous shipping lanes.' },
  { icon: 'smart_toy', title: 'AI Mobility', description: 'The algorithmic frontier connecting vehicles to infrastructure.' },
  { icon: 'rocket_launch', title: 'Space', description: 'Pioneering interplanetary logistics and transport systems.' },
]
</script>

<template>
  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-background-dark border-t border-white/5">
    <div class="max-w-6xl mx-auto">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <span class="h-px w-8 bg-primary/50"></span>
            <h2 class="text-primary text-sm font-bold tracking-widest uppercase">Global Mobility Scope</h2>
          </div>
          <h3 class="text-3xl md:text-4xl font-bold text-white">Impact Sectors</h3>
        </div>
        <p class="text-text-secondary max-w-md text-sm md:text-base leading-relaxed md:text-right">
          Our curriculum spans the five pillars of modern mobility, preparing you for leadership across the entire ecosystem.
        </p>
      </div>

      <!-- Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <UiSectorCard 
          v-for="sector in sectors" 
          :key="sector.title"
          :icon="sector.icon"
          :title="sector.title"
          :description="sector.description"
        />
      </div>
    </div>
  </section>
</template>
