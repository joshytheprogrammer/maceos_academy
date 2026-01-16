<script setup>
defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
})
</script>

<template>
  <div class="group bg-[#152820] p-6 rounded-xl border border-white/5 hover:border-primary/30 transition-all hover:bg-[#1a3026]">
    <div class="size-12 rounded-lg bg-background-dark flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/5">
      <span class="material-symbols-outlined text-primary text-2xl">{{ icon }}</span>
    </div>
    <h4 class="text-white font-bold text-lg mb-2">{{ title }}</h4>
    <p class="text-white/50 text-sm leading-relaxed">{{ description }}</p>
  </div>
</template>
