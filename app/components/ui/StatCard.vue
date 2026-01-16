<script setup>
defineProps({
  icon: { type: String, required: true },
  value: { type: String, required: true },
  label: { type: String, required: true },
  variant: { type: String, default: 'default' },
})
</script>

<template>
  <!-- Compact variant for mobile -->
  <div v-if="variant === 'compact'" class="flex flex-col items-center text-center">
    <div class="p-2 bg-primary/10 rounded-lg text-primary mb-2">
      <span class="material-symbols-outlined text-2xl">{{ icon }}</span>
    </div>
    <p class="text-white text-lg font-bold leading-none">{{ value }}</p>
    <p class="text-gray-400 text-xs font-medium mt-1">{{ label }}</p>
  </div>
  <!-- Default variant for desktop -->
  <div v-else class="flex items-center gap-4">
    <div class="p-2 bg-primary/10 rounded-lg text-primary">
      <span class="material-symbols-outlined text-3xl">{{ icon }}</span>
    </div>
    <div>
      <p class="text-white text-2xl font-bold leading-none">{{ value }}</p>
      <p class="text-gray-400 text-sm font-medium mt-1">{{ label }}</p>
    </div>
  </div>
</template>
