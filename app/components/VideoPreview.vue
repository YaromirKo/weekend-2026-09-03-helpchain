<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    helperName: string;
    helperInitial: string;
    duration: string;
    note?: string;
    primaryCta?: string;
    secondaryCta?: string;
    activeMoment?: string;
    compact?: boolean;
  }>(),
  {
    note: '',
    primaryCta: '',
    secondaryCta: '',
    activeMoment: '',
    compact: false,
  },
);

const hasActions = computed(() => Boolean(props.primaryCta || props.secondaryCta));

defineEmits<{
  primary: [];
  secondary: [];
}>();
</script>

<template>
  <article class="hc-card overflow-hidden">
    <div class="border-b border-hc-line bg-hc-paper p-5 sm:p-6" :class="compact ? '' : 'sm:p-7'">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <StatusBadge tone="emerald" dot>{{ label }}</StatusBadge>
          <h2 class="hc-text-balance mt-4 text-2xl font-semibold leading-tight text-hc-ink sm:text-3xl">
            Start with what {{ helperName }} showed.
          </h2>
        </div>

        <div class="flex items-center gap-3 text-sm font-semibold text-hc-ink">
          <span class="flex size-10 shrink-0 items-center justify-center bg-hc-emerald text-xs text-white rounded-full">
            {{ helperInitial }}
          </span>
          <span>helper: {{ helperName }}</span>
          <span class="rounded-[4px] bg-hc-paper-soft px-3 py-1">{{ duration }}</span>
        </div>
      </div>
    </div>

    <div class="bg-[#e9f1ec] p-3 sm:p-4">
      <div class="relative aspect-video overflow-hidden rounded-[4px] border border-hc-emerald/15 bg-hc-paper shadow-inner">
        <svg class="absolute inset-0 h-full w-full" viewBox="0 0 760 430" role="img" :aria-label="`${helperName} demonstrating a fix`">
          <rect x="70" y="64" width="620" height="300" rx="22" fill="#fffdf8" opacity="0.72" />
          <path d="M114 287c108-112 258-108 316-16 45 72-28 145-111 90-77-51-9-168 105-114" fill="none" stroke="#0f5b49" stroke-linecap="round" stroke-width="13" />
          <path d="M147 319c-45 20-82 31-119 34" fill="none" stroke="#cbbba8" stroke-linecap="round" stroke-width="10" />
          <path d="M438 316c88 35 176 35 266-2" fill="none" stroke="#bf5b48" stroke-linecap="round" stroke-opacity="0.5" stroke-width="10" />
          <path d="M205 124c44-42 97-47 142-14 15 11 22 27 16 42-8 20-38 24-62 8-31-21-63-21-96 0" fill="#fae7df" stroke="#bf5b48" stroke-linejoin="round" stroke-width="3" />
          <path d="M474 120c54-35 112-31 151 9 13 14 17 31 8 45-12 18-42 16-63-4-27-25-61-29-102-11" fill="#e7f4ee" stroke="#0f5b49" stroke-linejoin="round" stroke-width="3" />
          <circle cx="397" cy="263" r="18" fill="#fffdf8" stroke="#0f5b49" stroke-width="6" />
          <circle cx="343" cy="320" r="9" fill="#c8892f" />
          <path
            v-if="activeMoment"
            d="M331 257c38-44 91-48 129-8"
            fill="none"
            stroke="#c8892f"
            stroke-linecap="round"
            stroke-width="7"
          />
        </svg>

        <div class="absolute left-4 top-4 rounded-[4px] border border-hc-line bg-hc-paper/90 px-3 py-2 text-xs font-semibold uppercase leading-4 text-hc-muted shadow-hc-soft">
          Source video
        </div>

        <div class="absolute right-4 top-4 rounded-[4px] bg-hc-ink px-3 py-2 text-sm font-semibold text-white shadow-hc-soft">
          {{ duration }}
        </div>

        <button
          class="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-hc-emerald text-white shadow-hc-button transition duration-200 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hc-emerald"
          type="button"
          :aria-label="`Preview ${helperName}'s answer`"
        >
          <svg class="ml-1 size-7" viewBox="0 0 32 32" aria-hidden="true">
            <path d="m12 8 13 8-13 8V8Z" fill="currentColor" />
          </svg>
        </button>

        <div class="absolute bottom-4 left-4 right-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div class="rounded-[4px] border border-hc-line bg-hc-paper/95 p-3 shadow-hc-soft">
            <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">original helper</p>
            <p class="mt-1 text-lg font-semibold leading-6 text-hc-ink">{{ helperName }}</p>
          </div>

          <div v-if="activeMoment" class="rounded-[4px] border border-hc-amber/30 bg-hc-amber-soft px-3 py-2 text-sm font-semibold text-hc-ink shadow-hc-soft">
            {{ activeMoment }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="note || hasActions" class="border-t border-hc-line bg-hc-paper p-5 sm:p-6">
      <p v-if="note" class="max-w-2xl text-sm font-semibold leading-6 text-hc-muted">
        {{ note }}
      </p>

      <div v-if="hasActions" class="mt-5 flex flex-col gap-3 sm:flex-row">
        <AppButton v-if="primaryCta" size="md" type="button" @click="$emit('primary')">
          {{ primaryCta }}
        </AppButton>
        <AppButton v-if="secondaryCta" variant="secondary" size="md" type="button" @click="$emit('secondary')">
          {{ secondaryCta }}
        </AppButton>
      </div>
    </div>
  </article>
</template>
