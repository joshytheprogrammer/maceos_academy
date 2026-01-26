<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950">
    <!-- Animated background gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"></div>
    
    <!-- Subtle grid pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="h-full w-full" style="background-image: linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px); background-size: 50px 50px;"></div>
    </div>

    <!-- Content -->
    <div class="relative flex flex-col items-center">
      <!-- Logo -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold tracking-tight">
          <span class="text-white">MACEOS</span>
          <span class="text-green-500">.</span>
        </h1>
        <p class="text-center text-sm text-gray-500 tracking-widest mt-1">ACADEMY</p>
      </div>

      <!-- Animated loader -->
      <div class="relative">
        <!-- Outer ring -->
        <div class="w-16 h-16 rounded-full border-2 border-gray-800"></div>
        
        <!-- Spinning arc -->
        <div class="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-green-500 animate-spin"></div>
        
        <!-- Inner pulse -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <!-- Loading text -->
      <p class="mt-6 text-sm text-gray-500 animate-pulse">
        {{ message }}
      </p>
    </div>

    <!-- Bottom accent line -->
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Initializing...'
  }
})
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
