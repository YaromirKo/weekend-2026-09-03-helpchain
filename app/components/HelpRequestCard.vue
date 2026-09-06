<script setup lang="ts">
import type { HelpRequestSummary } from '~/data/helpchain';

defineProps<{
  request: HelpRequestSummary;
}>();
</script>

<template>
  <article
    class="hc-card group flex min-h-[27rem] flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(39,51,43,0.12)]"
    :style="{ '--request-accent': request.accentColor, '--request-wash': request.washColor }"
  >
    <div class="relative h-36 overflow-hidden border-b border-hc-line bg-[var(--request-wash)]">
      <div class="absolute inset-5 rounded-full border border-hc-line/70" />
      <svg class="absolute inset-0 h-full w-full" viewBox="0 0 240 210" aria-hidden="true">
        <path
          v-for="path in request.illustrationPaths"
          :key="path"
          :d="path"
          fill="none"
          stroke="var(--request-accent)"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-opacity="0.72"
          stroke-width="5"
        />
      </svg>

      <div class="absolute left-4 top-4 flex size-12 items-center justify-center rounded-full border border-hc-line bg-hc-paper text-[var(--request-accent)] shadow-hc-soft">
        <svg class="size-6" viewBox="0 0 34 34" aria-hidden="true">
          <path
            :d="request.iconPath"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.4"
          />
        </svg>
      </div>

      <div class="absolute bottom-4 right-4 rounded-[4px] border border-hc-line bg-hc-paper/90 px-3 py-1 text-xs font-semibold text-hc-muted shadow-hc-soft">
        {{ request.category }}
      </div>
    </div>

    <div class="flex flex-1 flex-col p-5">
      <div class="flex items-center justify-between gap-3">
        <span class="text-sm font-semibold text-[var(--request-accent)]">{{ request.category }}</span>
        <span class="rounded-[4px] border border-hc-line bg-hc-paper-soft px-3 py-1 text-[0.68rem] font-semibold uppercase leading-4 text-hc-muted">
          {{ request.status }}
        </span>
      </div>

      <h3 class="mt-5 text-xl font-semibold leading-7 text-hc-ink">
        {{ request.question }}
      </h3>
      <p class="mt-4 text-sm leading-6 text-hc-muted">
        Asked by {{ request.askedBy }}. {{ request.detail }}
      </p>

      <div class="mt-auto pt-6">
        <div class="border-t border-hc-line pt-4">
          <p class="text-sm font-medium leading-6 text-hc-muted">
            {{ request.helperNudge }}
          </p>
          <AppButton :to="request.routePath" variant="secondary" size="sm" block class="mt-4 group-hover:border-hc-emerald group-hover:text-hc-emerald">
            I can help
          </AppButton>
        </div>
      </div>
    </div>
  </article>
</template>
