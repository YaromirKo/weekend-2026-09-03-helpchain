<script setup lang="ts">
import type { SearchResultGuide } from '~/data/helpchain';

defineProps<{
  result: SearchResultGuide;
}>();
</script>

<template>
  <article class="hc-card group overflow-hidden">
    <div class="border-b border-hc-line bg-hc-emerald px-5 py-5 text-white sm:px-7">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase leading-5 text-white/70">
            Found through shared knowledge
          </p>
          <h2 class="mt-2 max-w-xl text-2xl font-semibold leading-tight sm:text-3xl">
            Someone had already helped with something similar.
          </h2>
        </div>

        <div class="w-fit rounded-[8px] bg-white/10 px-4 py-3 text-center">
          <p class="text-4xl font-semibold leading-none">{{ result.matchPercent }}%</p>
          <p class="mt-1 text-xs font-semibold uppercase leading-4 text-white/70">relevant</p>
        </div>
      </div>
    </div>

    <div class="grid gap-6 p-5 sm:p-7 lg:grid-cols-[0.74fr_1.26fr]">
      <div class="rounded-[8px] border border-hc-line bg-hc-paper-soft p-5">
        <div class="flex items-center gap-4">
          <div class="relative flex size-16 shrink-0 items-center justify-center rounded-full bg-hc-emerald text-2xl font-semibold text-white shadow-hc-button">
            <span class="absolute -right-1 -top-1 size-5 rounded-full border-2 border-hc-paper bg-hc-amber" />
            {{ result.helperInitial }}
          </div>
          <div>
            <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">Original helper</p>
            <p class="text-3xl font-semibold leading-none text-hc-ink">{{ result.helperName }}</p>
          </div>
        </div>

        <div class="mt-6 space-y-3 text-sm font-semibold text-hc-muted">
          <div class="flex items-center justify-between gap-4 border-t border-hc-line pt-3">
            <span>{{ result.duration }} source answer</span>
            <span class="size-2 rounded-full bg-hc-emerald" />
          </div>
          <div class="flex items-center justify-between gap-4 border-t border-hc-line pt-3">
            <span>{{ result.helpedCount }} people helped</span>
            <span class="size-2 rounded-full bg-hc-coral" />
          </div>
          <div class="flex items-center justify-between gap-4 border-t border-hc-line pt-3">
            <span>{{ result.languages }} languages</span>
            <span class="size-2 rounded-full bg-hc-amber" />
          </div>
        </div>
      </div>

      <div class="relative min-w-0 overflow-hidden rounded-[8px] border border-hc-line bg-hc-paper-soft p-5 sm:p-6">
        <div class="absolute -right-12 -top-12 size-32 rounded-full border border-hc-emerald/10" />
        <div class="absolute -right-6 top-10 size-20 rounded-full border border-hc-coral/10" />

        <StatusBadge tone="emerald" dot>Reusable guide</StatusBadge>

        <h3 class="hc-text-balance mt-5 max-w-lg text-3xl font-semibold leading-tight text-hc-ink">
          {{ result.title }}
        </h3>
        <p class="mt-4 max-w-xl border-l-2 border-hc-emerald/30 pl-4 text-base leading-7 text-hc-muted sm:text-lg">
          {{ result.summary }}
        </p>

        <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <AppButton :to="result.routePath" size="lg">
            See how John helped
          </AppButton>
          <p class="text-sm font-semibold leading-6 text-hc-muted">
            HelpChain made the answer searchable, step-by-step, and listenable.
          </p>
        </div>
      </div>
    </div>
  </article>
</template>
