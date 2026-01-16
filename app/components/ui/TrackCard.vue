<script setup>
defineProps({
  badge: { type: String, required: true },
  badgeColor: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  features: { type: Array, required: true },
  image: { type: String, required: true },
  backgroundIcon: { type: String, required: true },
  ctaText: { type: String, required: true },
  ctaVariant: { type: String, required: true },
})
</script>

<template>
  <div class="group relative flex flex-col bg-card-dark border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(18,226,105,0.1)]">
    <!-- Background Icon -->
    <div class="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
      <span class="material-symbols-outlined text-8xl text-primary icon-filled">{{ backgroundIcon }}</span>
    </div>
    
    <!-- Image -->
    <div class="relative h-48 w-full overflow-hidden">
      <div class="absolute inset-0 bg-linear-to-t from-card-dark via-card-dark/50 to-transparent z-10"></div>
      <div 
        class="w-full h-full bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-700"
        :style="{ backgroundImage: `url('${image}')` }"
      ></div>
    </div>
    
    <!-- Content -->
    <div class="flex flex-col grow p-8 -mt-12 relative z-20">
      <!-- Badge -->
      <div class="flex items-center gap-3 mb-2">
        <span 
          class="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
          :class="badgeColor === 'primary' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-300'"
        >
          {{ badge }}
        </span>
      </div>
      
      <h3 class="text-3xl font-bold text-white mb-2">{{ title }}</h3>
      <p class="text-white/60 text-lg mb-8 font-light">{{ subtitle }}</p>
      
      <!-- Features -->
      <div class="space-y-6 mb-8 grow">
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          class="flex items-start gap-4"
        >
          <div 
            class="mt-1 p-1 rounded shrink-0"
            :class="feature.variant === 'warning' 
              ? 'bg-red-500/10 text-red-400' 
              : badgeColor === 'primary' 
                ? 'bg-primary/10 text-primary' 
                : 'bg-blue-500/10 text-blue-400'"
          >
            <span class="material-symbols-outlined text-[20px]">{{ feature.icon }}</span>
          </div>
          <div>
            <h4 class="text-white font-bold text-sm">{{ feature.title }}</h4>
            <p class="text-sm text-text-secondary mt-1">{{ feature.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- CTA -->
      <button 
        class="w-full py-4 rounded-xl font-bold transition-all duration-300 uppercase tracking-widest text-sm"
        :class="ctaVariant === 'primary' 
          ? 'border border-primary text-primary hover:bg-primary hover:text-background-dark' 
          : 'border border-white/20 text-white hover:bg-white hover:text-background-dark'"
      >
        {{ ctaText }}
      </button>
    </div>
  </div>
</template>
