<script setup>
const navLinks = [
  { label: 'Curriculum', href: '#curriculum' },
  { label: 'Programs', href: '#programs' },
  { label: 'Admissions', href: '#admissions' },
  { label: 'Research', href: '#outcomes' },
]

const isMobileMenuOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-surface-border bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-4">
        <div class="flex h-8 w-8 items-center justify-center rounded bg-primary text-background-dark">
          <span class="material-symbols-outlined text-xl">school</span>
        </div>
        <span class="text-lg font-bold tracking-tight">MACEOS Academy</span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-8">
        <a 
          v-for="link in navLinks" 
          :key="link.label"
          :href="link.href"
          class="text-sm font-medium hover:text-primary transition-colors"
        >
          {{ link.label }}
        </a>
      </nav>

      <!-- CTA & Mobile Menu -->
      <div class="flex items-center gap-4">
        <a 
          href="#admissions"
          class="hidden sm:flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-background-dark hover:bg-primary-dark transition-colors"
        >
          Apply Now
        </a>
        <button 
          class="md:hidden p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <span class="material-symbols-outlined">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div 
      v-if="isMobileMenuOpen"
      class="md:hidden border-t border-surface-border bg-background-dark"
    >
      <nav class="flex flex-col px-4 py-4 gap-2">
        <a 
          v-for="link in navLinks" 
          :key="link.label"
          :href="link.href"
          class="text-sm font-medium py-2 hover:text-primary transition-colors"
          @click="isMobileMenuOpen = false"
        >
          {{ link.label }}
        </a>
        <a 
          href="#admissions"
          class="mt-2 flex h-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-background-dark hover:bg-primary-dark transition-colors"
          @click="isMobileMenuOpen = false"
        >
          Apply Now
        </a>
      </nav>
    </div>
  </header>
</template>
