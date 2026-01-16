<script setup>
const staticTrack = {
  badge: 'Cohort Based',
  badgeColor: 'primary',
  title: 'Static Track',
  subtitle: 'The Sprint. Designed for leaders who need rapid acceleration.',
  backgroundIcon: 'bolt',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtSDRb1Ba5D076TBGkVe-oqqSXV16z3sE2_q2m0PZN51RuXblGaQx8JnyJL4TeRnttTKQf0JoVzhO7n3A6dwFPRZFf3iSgYbBmnDuTAchgdIbJihoa4UbiiVEO4GZlMa79h2Tlwe51bqvWBsb2pYqD1OHrc4QXB1sGaqL_stl0Eid0ajAovQLuBYTQWpxBP1g7eSk3BL1J3mJsewZFBuH6HkdGn-GMIiy2cXHxQY0eXVmqJfijACpO8danDNbkPhD70MlvsWcXhJ0',
  features: [
    { icon: 'timer', title: '6-Month Duration', description: 'Strictly time-bound. No pauses allowed.' },
    { icon: 'library_books', title: '9-Course Requirement', description: 'Full academic load with mandatory attendance.' },
    { icon: 'warning', title: 'Rustication Policy', description: 'Exceeding timeline results in immediate dropout.', variant: 'warning' },
  ],
  ctaText: 'View Requirements',
  ctaVariant: 'primary',
}

const dynamicTrack = {
  badge: 'Self-Paced',
  badgeColor: 'blue',
  title: 'Dynamic Track',
  subtitle: 'The Marathon. Maximum flexibility for working executives.',
  backgroundIcon: 'all_inclusive',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2YNL_ar-vGQ235Iefzs5Q1yFJMLSoJqzFg3J0Zt8CCNE1vDw3MXXxOUZ4PNR4bh8CImBYSa_VXPQ4RPXjgAByFdGOQ2fFMhvh2HySBm1rVH1vaWW1hF2pFWKJDsvRUD6l-mT90-u5JRYqk0rfcpx4U1hqVN1SqO_y_vCH6ULoO7scSpltv1EUX_HbJlhBFyCV-KuDZ59EH2UAJX0RIMxr03ndriUJOZPK3LEm8aTeJUgBAnGJ4wq7_-fvwWIJZJbrUH8T62xjT4w',
  features: [
    { icon: 'calendar_month', title: '2-Year Duration', description: 'Extended timeline with pause options.' },
    { icon: 'school', title: 'Modular Credits', description: 'Complete the 9 courses in any order.' },
    { icon: 'verified', title: 'Completion Checkpoints', description: 'Quarterly reviews to ensure steady progress.' },
  ],
  ctaText: 'Explore Options',
  ctaVariant: 'outline',
}
</script>

<template>
  <section id="programs" class="py-20 px-4 sm:px-6 lg:px-8 bg-background-dark">
    <div class="max-w-6xl mx-auto space-y-16">
      <!-- Section Header -->
      <div class="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
        <div class="flex items-center gap-3">
          <span class="h-px w-8 bg-primary/50"></span>
          <h2 class="text-primary text-sm font-bold tracking-widest uppercase">Academic Pathways</h2>
          <span class="h-px w-8 bg-primary/50"></span>
        </div>
        <h3 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
          Choose Your Velocity
        </h3>
        <p class="text-text-secondary text-lg md:text-xl font-light leading-relaxed max-w-2xl">
          Two distinct pathways designed for different leadership trajectories. Select the rigor that matches your career velocity.
        </p>
      </div>

      <!-- Tracks Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UiTrackCard v-bind="staticTrack" />
        <UiTrackCard v-bind="dynamicTrack" />
      </div>
    </div>
  </section>
</template>
