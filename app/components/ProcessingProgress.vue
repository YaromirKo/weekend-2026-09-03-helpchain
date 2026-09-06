<script setup lang="ts">
import { computed } from 'vue';
import type { ProcessingStepData } from '~/data/helpchain';

const props = defineProps<{
  heading: string;
  steps: ProcessingStepData[];
  helperName: string;
  duration: string;
  ready: boolean;
  completionTitle: string;
  completionCta: string;
  guidePath: string;
}>();

const visibleSteps = computed<ProcessingStepData[]>(() => {
  if (!props.ready) {
    return props.steps;
  }

  return props.steps.map((step) => ({
    ...step,
    symbol: '✓',
    status: 'complete',
  }));
});

const statusClass = (status: ProcessingStepData['status']) => ({
  complete: 'bg-hc-emerald text-white',
  active: 'bg-hc-amber text-hc-ink',
  queued: 'bg-hc-canvas text-hc-ink',
}[status]);
</script>

<template>
  <article class="overflow-hidden rounded-[4px] bg-hc-ink p-5 text-white shadow-hc-card sm:p-8 lg:p-10">
    <div class="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
      <div class="min-w-0">
        <p class="text-sm font-semibold uppercase leading-5 text-hc-amber-soft">Processing transformation</p>
        <h2 class="hc-text-balance mt-4 max-w-2xl text-4xl font-semibold leading-tight text-hc-paper sm:text-5xl">
          {{ heading }}
        </h2>
        <p class="mt-5 max-w-xl text-base leading-8 text-hc-paper-soft sm:text-lg">
          One source video is becoming a guide others can use, while {{ helperName }} remains attached to it.
        </p>

        <div class="mt-9 rounded-[4px] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
          <div class="relative min-h-[24rem] sm:min-h-[21rem]">
            <svg class="absolute inset-0 h-full w-full" viewBox="0 0 620 360" aria-hidden="true">
              <path class="hc-line-draw" d="M310 74v76" fill="none" stroke="#d89b3d" stroke-linecap="round" stroke-width="4" />
              <path class="hc-line-draw hc-delay-1" d="M310 150c-86 0-142 32-184 86" fill="none" stroke="#d7c9b7" stroke-linecap="round" stroke-width="3" />
              <path class="hc-line-draw hc-delay-2" d="M310 150v86" fill="none" stroke="#d7c9b7" stroke-linecap="round" stroke-width="3" />
              <path class="hc-line-draw hc-delay-3" d="M310 150c86 0 142 32 184 86" fill="none" stroke="#d7c9b7" stroke-linecap="round" stroke-width="3" />
            </svg>

            <div class="absolute left-1/2 top-0 w-56 -translate-x-1/2 rounded-[4px] bg-hc-paper p-4 text-hc-ink shadow-hc-soft">
              <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">Source video</p>
              <div class="mt-3 flex items-center justify-between gap-4">
                <span class="text-3xl font-semibold leading-none">{{ duration }}</span>
                <span class="rounded-full bg-hc-emerald px-3 py-1 text-xs font-semibold text-white">{{ helperName }}</span>
              </div>
            </div>

            <div class="absolute left-1/2 top-[8.4rem] flex -translate-x-1/2 items-center gap-2 rounded-full bg-hc-amber px-4 py-2 text-xs font-semibold uppercase leading-4 text-hc-ink shadow-hc-soft">
              Understanding
            </div>

            <div class="absolute bottom-0 left-0 right-0 grid gap-3 sm:grid-cols-3">
              <div class="hc-branch-card rounded-[4px] bg-hc-paper p-4 text-hc-ink shadow-hc-soft">
                <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">Step 1</p>
                <p class="mt-2 text-sm font-semibold leading-6">Create the first loop</p>
              </div>
              <div class="hc-branch-card rounded-[4px] bg-hc-paper p-4 text-hc-ink shadow-hc-soft">
                <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">Step 2</p>
                <p class="mt-2 text-sm font-semibold leading-6">Pull the yarn through</p>
              </div>
              <div class="hc-branch-card rounded-[4px] bg-hc-paper p-4 text-hc-ink shadow-hc-soft">
                <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">Step 3</p>
                <p class="mt-2 text-sm font-semibold leading-6">Tighten the knot</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="min-w-0 rounded-[4px] bg-hc-paper p-4 text-hc-ink shadow-hc-soft sm:p-5">
        <ol class="grid gap-3">
          <li
            v-for="step in visibleSteps"
            :key="step.label"
            class="grid min-w-0 grid-cols-[1.9rem_1fr] gap-3 rounded-[4px] bg-hc-paper-soft p-3 transition duration-300"
          >
            <span
              class="flex size-8 items-center justify-center rounded-full text-xs font-semibold"
              :class="statusClass(step.status)"
            >
              {{ step.symbol }}
            </span>
            <span class="min-w-0">
              <span class="block text-sm font-semibold leading-5 text-hc-ink">{{ step.label }}</span>
              <span v-if="step.provider" class="mt-0.5 block text-[0.68rem] font-semibold uppercase leading-4 text-hc-muted">
                {{ step.provider }}
              </span>
            </span>
          </li>
        </ol>

        <Transition name="hc-discovery">
          <div v-if="ready" class="mt-5 rounded-[4px] bg-hc-emerald p-4 text-white">
            <p class="text-xl font-semibold leading-tight">{{ completionTitle }}</p>
            <AppButton :to="guidePath" variant="light" size="sm" class="mt-4">
              {{ completionCta }}
            </AppButton>
          </div>
        </Transition>
      </div>
    </div>
  </article>
</template>
