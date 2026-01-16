<script setup>
const stats = [
  { icon: 'public', value: '50+', label: 'Global Partners' },
  { icon: 'workspace_premium', value: 'Top 1%', label: 'Curriculum Ranking' },
  { icon: 'groups', value: '200+', label: 'Industry Mentors' },
]
</script>

<template>
  <div class="relative z-20 w-full border-y border-surface-border bg-surface-dark/50 backdrop-blur-sm">
    <div class="container mx-auto px-4 md:px-8 lg:px-12">
      <div class="flex flex-wrap justify-center md:justify-around items-center py-6 md:py-8 gap-8 md:gap-4 text-center md:text-left">
        <template v-for="(stat, index) in stats" :key="stat.label">
          <UiStatCard 
            :icon="stat.icon" 
            :value="stat.value" 
            :label="stat.label" 
          />
          <div 
            v-if="index < stats.length - 1" 
            class="hidden md:block w-px h-12 bg-surface-border"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>
