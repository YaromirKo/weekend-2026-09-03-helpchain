<script setup lang="ts">
import { ref } from 'vue';

const languages = ['English', 'Spanish', 'French'] as const;
const selectedLanguage = ref<(typeof languages)[number]>('English');
</script>

<template>
  <section class="rounded-[8px] border border-hc-line bg-hc-paper p-5 shadow-hc-soft sm:p-7">
    <div class="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
      <div>
        <StatusBadge tone="amber">Making the guide listenable: ElevenLabs</StatusBadge>
        <h2 class="mt-4 text-3xl font-semibold leading-tight text-hc-ink">
          Listen instead
        </h2>
        <p class="mt-3 max-w-md text-base leading-7 text-hc-muted">
          The same help in a format that's easier to follow.
        </p>
      </div>

      <div class="rounded-[8px] border border-hc-line bg-hc-paper-soft p-4 sm:p-5">
        <fieldset>
          <legend class="sr-only">Audio language</legend>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="language in languages"
              :key="language"
              class="min-h-10 rounded-[8px] border px-3 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hc-emerald"
              :class="selectedLanguage === language ? 'border-hc-emerald bg-hc-emerald text-white' : 'border-hc-line bg-hc-paper text-hc-muted hover:text-hc-ink'"
              type="button"
              :aria-pressed="selectedLanguage === language"
              @click="selectedLanguage = language"
            >
              {{ language }}
            </button>
          </div>
        </fieldset>

        <div class="mt-5 flex items-center gap-4 rounded-[8px] border border-hc-line bg-hc-paper px-4 py-4">
          <button
            class="flex size-11 shrink-0 items-center justify-center rounded-full bg-hc-emerald text-white transition duration-200 hover:bg-[#0b4333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hc-emerald"
            type="button"
            aria-label="Play narration"
          >
            <svg class="ml-0.5 size-5" viewBox="0 0 32 32" aria-hidden="true">
              <path d="m12 8 13 8-13 8V8Z" fill="currentColor" />
            </svg>
          </button>

          <div class="min-w-0 flex-1">
            <div class="h-2 overflow-hidden rounded-full bg-hc-emerald-soft" aria-hidden="true">
              <div class="h-full w-0 rounded-full bg-hc-emerald" />
            </div>
            <p class="mt-2 text-sm font-semibold leading-5 text-hc-muted">0:00 / 0:42</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
