<script setup>
const heroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHy_N6wqMbGBGIMD6LFitxTr9yZzA_68sN6bPO-I6FxEpms6FidA-FVsH4YWZ7yrWSDBqqjHVxRbywjjf7lBw6MgPQWTmRvacdLEybglD9v0CK1NMJ1wW_uwFd2LtLj-zywg5dmOMjaJksO1u9VwLRtJ8xk63MOrbw6WB35B0JsA_2YzLrOXFK291ssuZotTA5QKGzKXtUDdwTqwehe3SsFN2zAbprSpBDJ9Wl25h0Zmsz5SFYdYGwCVwwxAfgN7nh7E2oBUmGKYI'
</script>

<template>
  <section class="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-linear-to-b from-background-dark/80 via-background-dark/50 to-background-dark z-10"></div>
      <img 
        :src="heroImage" 
        alt="Abstract dark automotive curves and modern aerodynamic design" 
        class="h-full w-full object-cover object-center opacity-60"
      />
    </div>

    <div class="relative z-10 container mx-auto px-4 md:px-8 lg:px-12 py-20 text-center">
      <div class="mx-auto max-w-4xl flex flex-col items-center gap-8">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-border/50 border border-[#326748] backdrop-blur-sm mb-4">
          <span class="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          <span class="text-primary text-xs font-bold uppercase tracking-widest">Admissions Open 2026</span>
        </div>

        <!-- Headline -->
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white">
          Architecting the Future of <br />
          <span class="text-transparent bg-clip-text bg-linear-to-r from-white via-gray-200 to-gray-500">Global Mobility Leadership</span>
        </h1>

        <!-- Description -->
        <p class="text-lg md:text-xl text-gray-300 max-w-2xl font-light leading-relaxed">
          The premier institution for executives shaping the convergence of automotive, aviation, and maritime industries through AI and strategic foresight.
        </p>

        <!-- CTAs -->
        <div class="flex flex-wrap justify-center gap-4 pt-4">
          <a 
            href="#admissions"
            class="flex items-center justify-center gap-2 h-12 px-8 bg-primary hover:bg-primary-dark text-background-dark text-base font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(18,226,105,0.2)]"
          >
            <span>Apply for Admission</span>
            <span class="material-symbols-outlined text-lg">arrow_forward</span>
          </a>
          <button class="flex items-center justify-center h-12 px-8 bg-transparent border border-white/20 hover:border-primary/50 hover:bg-white/5 text-white text-base font-bold rounded-lg transition-all backdrop-blur-sm">
            <span>Download Prospectus</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
