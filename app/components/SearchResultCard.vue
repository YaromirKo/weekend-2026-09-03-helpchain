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

        <div class="w-fit rounded-[4px] bg-white/10 px-4 py-3 text-center">
          <p class="text-4xl font-semibold leading-none">{{ result.matchPercent }}%</p>
          <p class="mt-1 text-xs font-semibold uppercase leading-4 text-white/70">relevant</p>
        </div>
      </div>
    </div>

    <div class="p-5 sm:p-7">
      <div class="rounded-[4px] bg-hc-paper-soft p-4 sm:p-5">
        <div class="p-5 sm:p-6">
          <div class="grid gap-5">
            <div class="flex min-w-0 items-center gap-4">
              <div class="relative flex size-16 shrink-0 items-center justify-center rounded-full bg-hc-emerald text-2xl font-semibold text-white shadow-hc-button">
                <span class="absolute -right-1 -top-1 size-5 rounded-full border-2 border-hc-paper bg-hc-amber" />
                {{ result.helperInitial }}
              </div>
              <div class="min-w-0">
                <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">Original helper</p>
                <p class="text-3xl font-semibold leading-none text-hc-ink">{{ result.helperName }}</p>
                <p class="mt-2 max-w-md text-sm font-semibold leading-6 text-hc-muted">
                  Shared one short answer that matched the problem you described.
                </p>
              </div>
            </div>

            <dl class="grid gap-2 text-center sm:grid-cols-3">
              <div class="rounded-[4px] bg-hc-paper px-4 py-4 shadow-hc-soft">
                <dt class="text-xs font-semibold uppercase leading-4 text-hc-muted">source</dt>
                <dd class="mt-2 text-3xl font-semibold leading-none text-hc-emerald">{{ result.duration }}</dd>
              </div>
              <div class="rounded-[4px] bg-hc-paper px-4 py-4 shadow-hc-soft">
                <dt class="text-xs font-semibold uppercase leading-4 text-hc-muted">people helped</dt>
                <dd class="mt-2 text-3xl font-semibold leading-none text-hc-emerald">{{ result.helpedCount }}</dd>
              </div>
              <div class="rounded-[4px] bg-hc-paper px-4 py-4 shadow-hc-soft">
                <dt class="text-xs font-semibold uppercase leading-4 text-hc-muted">languages</dt>
                <dd class="mt-2 text-3xl font-semibold leading-none text-hc-emerald">{{ result.languages }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="rounded-[4px] bg-hc-paper p-5 shadow-hc-soft sm:p-6">
          <div class="grid gap-5">
            <div class="min-w-0 max-w-2xl">
              <StatusBadge tone="emerald" dot>Reusable guide</StatusBadge>

              <h3 class="hc-text-balance mt-5 text-xl font-semibold leading-tight text-hc-ink">
                {{ result.title }}
              </h3>
              <p class="mt-4 max-w-xl text-base leading-7 text-hc-muted sm:text-lg">
                {{ result.summary }}
              </p>
            </div>

            <div class="pt-1">
              <div class="flex max-w-[20rem] flex-col items-start gap-2">
                <AppButton :to="result.routePath" size="lg" aria-describedby="search-result-guide-hint" class="w-full sm:w-auto">
                  See how {{ result.helperName }} helped
                </AppButton>
                <p id="search-result-guide-hint" class="max-w-[17rem] pl-1 text-xs font-medium leading-5 text-hc-soft">
                  HelpChain made the answer searchable, step-by-step, and listenable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
