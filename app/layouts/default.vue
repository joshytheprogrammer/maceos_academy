<template>
  <div class="relative flex min-h-screen w-full flex-col">
    <LayoutTheNavbar />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutTheFooter />
  </div>
</template>
