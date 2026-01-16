<script setup>
const footerLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Contact Support', href: '#' },
]
</script>

<template>
  <footer class="border-t border-surface-border bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
      <!-- Brand -->
      <NuxtLink to="/" class="flex items-center gap-2 text-white">
        <div class="h-6 w-6 rounded bg-primary flex items-center justify-center">
          <span class="material-symbols-outlined text-background-dark text-sm">school</span>
        </div>
        <span class="font-bold">MACEOS Academy</span>
      </NuxtLink>

      <!-- Links -->
      <div class="flex gap-8 text-sm text-gray-400">
        <a 
          v-for="link in footerLinks"
          :key="link.label"
          :href="link.href"
          class="hover:text-primary transition-colors"
        >
          {{ link.label }}
        </a>
      </div>

      <!-- Copyright -->
      <p class="text-sm text-gray-500">© {{ new Date().getFullYear() }} MACEOS Academy. All rights reserved.</p>
    </div>
  </footer>
</template>
