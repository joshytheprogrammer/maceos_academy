<script setup>
defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
})
</script>

<template>
  <div class="group relative flex flex-col gap-6 rounded-xl border border-surface-border bg-surface-dark hover:bg-surface-darker p-8 transition-all duration-300 hover:border-primary/50 overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div class="w-12 h-12 rounded-lg bg-surface-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
      <span class="material-symbols-outlined text-2xl">{{ icon }}</span>
    </div>
    <div class="flex flex-col gap-3">
      <h4 class="text-xl font-bold text-white group-hover:text-primary transition-colors">{{ title }}</h4>
      <p class="text-gray-400 text-sm leading-relaxed">{{ description }}</p>
    </div>
  </div>
</template>
