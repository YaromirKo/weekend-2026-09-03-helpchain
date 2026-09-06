<script setup lang="ts">
defineProps<{
  matchPercent: number;
  text: string;
}>();
</script>

<template>
  <aside class="relative overflow-hidden rounded-[8px] border border-hc-line bg-hc-paper p-5 shadow-hc-soft sm:p-6">
    <div class="absolute -right-8 -top-10 size-28 rounded-full border border-hc-emerald/10" />
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm font-semibold leading-6 text-hc-ink">Found through shared knowledge</p>
        <p class="mt-1 text-2xl font-semibold leading-tight text-hc-emerald">
          {{ matchPercent }}% relevant to the problem you described
        </p>
        <p class="mt-2 text-sm leading-6 text-hc-muted">
          {{ text }}
        </p>
      </div>

      <div class="flex items-center gap-3 rounded-[8px] border border-hc-emerald/15 bg-hc-emerald-wash px-4 py-3">
        <svg class="size-8 shrink-0 text-hc-emerald" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 5v22M6.5 10.5l19 11M25.5 10.5l-19 11" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" />
          <circle cx="16" cy="16" r="3" fill="currentColor" />
        </svg>
        <div>
          <p class="text-sm font-semibold leading-5 text-hc-emerald">Snowflake</p>
          <p class="mt-1 text-[0.68rem] font-semibold uppercase leading-4 text-hc-muted">similar help found</p>
        </div>
      </div>
    </div>
  </aside>
</template>
