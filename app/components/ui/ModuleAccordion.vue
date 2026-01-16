<script setup>
defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  content: { type: String, required: true },
  checkpoints: { type: Array, default: () => [] },
  defaultOpen: { type: Boolean, default: false },
})
</script>

<template>
  <details 
    class="group rounded-xl border border-surface-border bg-surface-dark open:border-primary/50 transition-all duration-300"
    :open="defaultOpen"
  >
    <summary class="flex cursor-pointer list-none items-center justify-between p-6">
      <div class="flex items-center gap-4">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <span class="material-symbols-outlined">{{ icon }}</span>
        </div>
        <div>
          <h3 class="font-bold text-lg text-white group-hover:text-primary transition-colors">{{ title }}</h3>
          <p class="text-sm text-text-secondary hidden sm:block">{{ subtitle }}</p>
        </div>
      </div>
      <span class="material-symbols-outlined text-gray-400 transition-transform group-open:rotate-180">expand_more</span>
    </summary>
    <div class="px-6 pb-6 pt-2">
      <div class="pl-14 border-l border-surface-border ml-5 space-y-4">
        <p class="text-gray-300 font-body text-sm leading-relaxed">{{ content }}</p>
        <div v-if="checkpoints && checkpoints.length" class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div 
            v-for="(checkpoint, index) in checkpoints" 
            :key="index"
            class="flex items-center gap-2 text-sm text-text-secondary"
          >
            <span class="material-symbols-outlined text-primary text-base">check_circle</span>
            {{ checkpoint }}
          </div>
        </div>
      </div>
    </div>
  </details>
</template>
