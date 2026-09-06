<script setup lang="ts">
import type { GuideStepData } from '~/data/helpchain';

defineProps<{
  step: GuideStepData;
  active: boolean;
}>();

defineEmits<{
  select: [id: string];
}>();
</script>

<template>
  <article
    class="group relative rounded-[4px] border bg-hc-paper p-5 shadow-hc-soft transition duration-300 hover:-translate-y-0.5"
    :class="active ? 'border-hc-emerald shadow-[0_18px_48px_rgba(15,91,73,0.14)]' : 'border-hc-line'"
  >
    <span
      class="absolute -left-[1.8rem] top-8 hidden h-px w-[1.8rem] lg:block"
      :class="active ? 'bg-hc-emerald' : 'bg-hc-line-strong'"
    />
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0">
        <div class="flex items-center gap-3">
          <span
            class="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
            :class="active ? 'bg-hc-emerald text-white' : 'bg-hc-emerald-wash text-hc-emerald'"
          >
            {{ step.number }}
          </span>
          <div>
            <h3 class="text-xl font-semibold leading-7 text-hc-ink">{{ step.title }}</h3>
            <p class="mt-1 text-sm font-semibold leading-5 text-hc-muted">{{ step.timeRange }}</p>
          </div>
        </div>

        <p class="mt-4 max-w-xl text-base leading-7 text-hc-muted">
          {{ step.description }}
        </p>
      </div>

      <button
        class="hc-button min-h-11 shrink-0 rounded-[4px] border border-hc-line-strong bg-hc-paper-soft px-4 text-sm font-semibold text-hc-ink transition duration-200 hover:border-hc-emerald hover:text-hc-emerald focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hc-emerald"
        type="button"
        :aria-pressed="active"
        @click="$emit('select', step.id)"
      >
        {{ step.momentLabel }}
      </button>
    </div>
  </article>
</template>
