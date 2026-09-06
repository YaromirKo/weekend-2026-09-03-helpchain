<script setup lang="ts">
defineProps<{
  helperName: string;
  helpedCount: number;
}>();
</script>

<template>
  <section class="relative overflow-hidden rounded-[8px] border border-hc-line bg-hc-paper p-5 shadow-hc-card sm:p-8">
    <div class="absolute inset-x-8 top-1/2 h-px bg-hc-line" aria-hidden="true" />
    <div class="relative grid gap-6 sm:grid-cols-[0.88fr_auto_1fr] sm:items-center">
      <div class="rounded-[8px] border border-hc-line bg-hc-paper-soft p-5">
        <p class="text-lg font-semibold leading-7 text-hc-ink">{{ helperName }} helped one person.</p>
        <p class="mt-4 text-7xl font-semibold leading-none text-hc-emerald sm:text-8xl">1</p>
        <p class="mt-3 text-sm font-semibold uppercase leading-5 text-hc-muted">person directly</p>
      </div>

      <div class="flex items-center justify-center">
        <div class="flex size-14 items-center justify-center rounded-full bg-hc-amber text-2xl font-semibold text-hc-ink shadow-hc-soft">
          →
        </div>
      </div>

      <div class="rounded-[8px] border border-hc-emerald/20 bg-hc-emerald p-5 text-white shadow-hc-button">
        <p class="text-lg font-semibold leading-7">His answer has now helped {{ helpedCount }}.</p>
        <p class="mt-4 text-7xl font-semibold leading-none sm:text-8xl">{{ helpedCount }}</p>
        <p class="mt-3 text-sm font-semibold uppercase leading-5 text-white/70">people reached</p>
      </div>
    </div>
  </section>
</template>
