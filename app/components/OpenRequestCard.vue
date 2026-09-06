<script setup lang="ts">
import type { HelpRequestSummary } from '~/data/helpchain';

defineProps<{
  request: HelpRequestSummary;
}>();
</script>

<template>
  <article class="rounded-[8px] border border-hc-line bg-hc-paper p-5 shadow-hc-soft">
    <div class="flex flex-wrap items-center gap-3">
      <StatusBadge tone="coral" dot>{{ request.status }}</StatusBadge>
      <span class="text-sm font-semibold text-hc-muted">{{ request.category }}</span>
    </div>
    <h3 class="hc-text-balance mt-4 text-2xl font-semibold leading-tight text-hc-ink">
      {{ request.question }}
    </h3>
    <p class="mt-3 text-sm leading-6 text-hc-muted">
      Asked by {{ request.askedBy }}. {{ request.helperNudge }}
    </p>
    <AppButton :to="request.routePath" variant="secondary" size="sm" class="mt-5">
      View request
    </AppButton>
  </article>
</template>
